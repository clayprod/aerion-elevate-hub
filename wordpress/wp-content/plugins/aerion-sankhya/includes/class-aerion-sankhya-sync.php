<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

final class Aerion_Sankhya_Sync
{
    private const MAX_ATTEMPTS = 5;

    public static function boot(): void
    {
        add_action('woocommerce_payment_complete', [self::class, 'queue']);
        add_action('woocommerce_order_status_processing', [self::class, 'queue']);
        add_action('aerion_sankhya_push_order', [self::class, 'run'], 10, 3);
        add_filter('woocommerce_order_actions', [self::class, 'order_action']);
        add_action('woocommerce_order_action_aerion_sankhya_sync', [self::class, 'manual_sync']);
    }

    public static function queue(int $orderId): void
    {
        $mode = self::mode();
        if ($mode === 'disabled') {
            return;
        }
        $order = wc_get_order($orderId);
        if (! $order || $order->get_meta('_aerion_sankhya_remote_id')) {
            return;
        }
        $key = (string) $order->get_meta('_aerion_sankhya_idempotency_key');
        if (! $key) {
            $created = $order->get_date_created()?->getTimestamp() ?? time();
            $key = hash('sha256', home_url('/') . '|' . $orderId . '|' . $created);
            $order->update_meta_data('_aerion_sankhya_idempotency_key', $key);
            $order->save();
        }
        if (function_exists('as_has_scheduled_action') &&
            as_has_scheduled_action('aerion_sankhya_push_order', [$orderId, $key, 1], 'aerion-sankhya')) {
            return;
        }
        self::schedule($orderId, $key, 1, time());
    }

    /**
     * Cliente primeiro, pedido depois: o pedido do Sankhya referencia o
     * parceiro pelo código, que só existe depois do cadastro.
     */
    public static function run(int $orderId, string $key, int $attempt): void
    {
        $order = wc_get_order($orderId);
        if (! $order instanceof WC_Order || $order->get_meta('_aerion_sankhya_remote_id')) {
            return;
        }
        if (! hash_equals((string) $order->get_meta('_aerion_sankhya_idempotency_key'), $key)) {
            $order->add_order_note('Sankhya: tentativa ignorada por chave de idempotência divergente.');
            return;
        }
        if (in_array($order->get_status(), ['cancelled', 'refunded', 'failed'], true)) {
            $order->add_order_note(sprintf(
                'Sankhya: envio não feito; o pedido está "%s".',
                wc_get_order_status_name($order->get_status())
            ));
            return;
        }
        $client = new Aerion_Sankhya_Client(self::mode());
        $order->update_meta_data('_aerion_sankhya_last_attempt_at', current_time('mysql', true));
        $order->update_meta_data('_aerion_sankhya_attempts', $attempt);

        $partner = self::ensure_customer($order, $client);
        if (is_wp_error($partner)) {
            self::fail($order, $partner, $key, $attempt);
            return;
        }

        if ($order->get_meta('_aerion_sankhya_uncertain') === 'yes') {
            $existing = $client->find_sales_order($order);
            if (is_wp_error($existing)) {
                self::fail($order, $existing, $key, $attempt);
                return;
            }
            if ($existing !== null) {
                self::succeed($order, $existing);
                return;
            }
        }

        $result = $client->create_sales_order($order, $key);
        if (is_wp_error($result)) {
            self::fail($order, $result, $key, $attempt);
            return;
        }
        self::succeed($order, $result);
    }

    public static function order_action(array $actions): array
    {
        $actions['aerion_sankhya_sync'] = __('Enviar/reprocessar no Sankhya', 'aerion-sankhya');
        return $actions;
    }

    /**
     * Reprocessar é decisão de quem opera: refaz o cadastro do cliente (para
     * valer um endereço corrigido) e dispensa a conferência de duplicidade.
     */
    public static function manual_sync(WC_Order $order): void
    {
        if (self::mode() === 'disabled') {
            $order->add_order_note('Sankhya: integração desativada; nenhuma chamada foi feita.');
            return;
        }
        $order->delete_meta_data('_aerion_sankhya_remote_id');
        $order->delete_meta_data('_aerion_sankhya_partner_code');
        $order->delete_meta_data('_aerion_sankhya_partner_document');
        $order->delete_meta_data('_aerion_sankhya_uncertain');
        $order->save();
        self::queue($order->get_id());
    }

    public static function mode(): string
    {
        $mode = defined('AERION_SANKHYA_MODE') ? AERION_SANKHYA_MODE : getenv('AERION_SANKHYA_MODE');
        $mode = apply_filters('aerion_sankhya_mode', $mode);
        return in_array($mode, ['disabled', 'mock', 'live'], true) ? $mode : 'disabled';
    }

    private static function ensure_customer(WC_Order $order, Aerion_ERP_Client $client): int|WP_Error
    {
        $code = absint($order->get_meta('_aerion_sankhya_partner_code'));
        if ($code || (string) $order->get_meta('_aerion_sankhya_partner_document') !== '') {
            return $code;
        }
        $result = $client->upsert_customer($order);
        if (is_wp_error($result)) {
            return $result;
        }
        $code = absint($result['code']);
        if (! $code && ! empty($result['document'])) {
            // Cliente existente que o ERP não identificou por código: o pedido leva o documento.
            $order->update_meta_data('_aerion_sankhya_partner_document', (string) $result['document']);
            $order->save();
            $order->add_order_note('Sankhya: cliente já existia; o pedido identifica o cliente pelo CPF/CNPJ.');
            return 0;
        }
        $order->update_meta_data('_aerion_sankhya_partner_code', $code);
        $order->save();
        $order->add_order_note(sprintf(
            $result['created'] ? 'Sankhya: cliente cadastrado (código %d).' : 'Sankhya: cliente já existia (código %d).',
            $code
        ));
        return $code;
    }

    /**
     * @param array<string,mixed> $result
     */
    private static function succeed(WC_Order $order, array $result): void
    {
        $remoteId = sanitize_text_field((string) ($result['remote_id'] ?? ''));
        $status = sanitize_key((string) ($result['status'] ?? 'created'));
        $order->update_meta_data('_aerion_sankhya_remote_id', $remoteId);
        $order->update_meta_data('_aerion_sankhya_status', $status);
        $order->delete_meta_data('_aerion_sankhya_last_error');
        $order->delete_meta_data('_aerion_sankhya_uncertain');
        $order->save();
        $order->add_order_note($status === 'recovered'
            ? sprintf('Sankhya: pedido %s já tinha sido criado por uma tentativa anterior; vinculado sem reenviar.', $remoteId)
            : sprintf('Sankhya: pedido sincronizado (%s).', $remoteId ?: 'sem ID retornado'));
    }

    private static function fail(WC_Order $order, WP_Error $error, string $key, int $attempt): void
    {
        $data = (array) $error->get_error_data();
        $retryable = ! empty($data['retryable']);
        if (! empty($data['uncertain'])) {
            $order->update_meta_data('_aerion_sankhya_uncertain', 'yes');
        }
        $order->update_meta_data('_aerion_sankhya_status', 'error');
        $order->update_meta_data('_aerion_sankhya_last_error', $error->get_error_message());
        $order->save();
        $willRetry = $retryable && $attempt < self::MAX_ATTEMPTS;
        $suffix = $willRetry
            ? ' Nova tentativa agendada.'
            : ($retryable ? ' Tentativas esgotadas; use "Enviar/reprocessar no Sankhya".' : '');
        $order->add_order_note('Sankhya: ' . $error->get_error_message() . $suffix);
        if ($willRetry) {
            self::schedule($order->get_id(), $key, $attempt + 1, time() + (5 ** $attempt) * MINUTE_IN_SECONDS);
        } else {
            Aerion_Sankhya_Alerts::sync_failed($order, $error);
        }
    }

    private static function schedule(int $orderId, string $key, int $attempt, int $timestamp): void
    {
        if (function_exists('as_schedule_single_action')) {
            as_schedule_single_action(
                $timestamp,
                'aerion_sankhya_push_order',
                [$orderId, $key, $attempt],
                'aerion-sankhya',
                true
            );
        } else {
            wp_schedule_single_event($timestamp, 'aerion_sankhya_push_order', [$orderId, $key, $attempt]);
        }
    }
}
