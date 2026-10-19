<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Leva ao Sankhya o cancelamento e o estorno feitos na loja.
 *
 * O Mercado Pago põe o pedido em "cancelado" (pagamento cancelado) ou em
 * "reembolsado" (estorno total e chargeback). Nos dois casos:
 * - pedido ainda não faturado: cancelado no Sankhya pela API;
 * - pedido já faturado: a API não cancela ("Pedidos faturados não serão
 *   cancelados") e não existe endpoint para cancelar NF-e modelo 55. A nota é
 *   cancelada no ERP, que transmite à SEFAZ; o site avisa a equipe com o prazo
 *   e acompanha até a nota deixar de ser autorizada. Aí cancela o pedido.
 */
final class Aerion_Sankhya_Cancellations
{
    public const HOOK = 'aerion_sankhya_cancel_order';
    public const WATCH_HOOK = 'aerion_sankhya_watch_invoice_cancellations';

    private const MAX_ATTEMPTS = 5;
    private const CLOSED = ['cancelled', 'refunded'];

    public static function boot(): void
    {
        add_action('woocommerce_order_status_cancelled', [self::class, 'queue']);
        add_action('woocommerce_order_status_refunded', [self::class, 'queue']);
        add_action('woocommerce_order_status_failed', [self::class, 'drop_pending_push']);
        add_action('woocommerce_order_partially_refunded', [self::class, 'partial_refund'], 10, 2);
        add_action(self::HOOK, [self::class, 'run'], 10, 2);
        add_action(self::WATCH_HOOK, [self::class, 'watch']);
        add_filter('woocommerce_order_actions', [self::class, 'order_action']);
        add_action('woocommerce_order_action_aerion_sankhya_cancel', [self::class, 'manual']);
    }

    public static function queue(int $orderId): void
    {
        if (Aerion_Sankhya_Sync::mode() === 'disabled') {
            return;
        }
        $order = wc_get_order($orderId);
        if (! $order instanceof WC_Order) {
            return;
        }
        self::drop_pending_push($orderId);
        if ($order->get_meta('_aerion_sankhya_cancelled_at') || $order->get_meta('_aerion_sankhya_invoice_cancel_pending') === 'yes') {
            return;
        }
        if (! self::sent($order)) {
            if ($order->get_meta('_aerion_sankhya_idempotency_key')) {
                $order->add_order_note('Sankhya: pedido encerrado antes de chegar ao Sankhya; nada a cancelar no ERP.');
            }
            return;
        }
        if (function_exists('as_has_scheduled_action') && as_has_scheduled_action(self::HOOK, [$orderId, 1], 'aerion-sankhya')) {
            return;
        }
        self::schedule($orderId, 1, time());
    }

    /** Pedido encerrado não pode mais ser enviado por uma tentativa que estava na fila. */
    public static function drop_pending_push(int $orderId): void
    {
        $order = wc_get_order($orderId);
        $key = $order instanceof WC_Order ? (string) $order->get_meta('_aerion_sankhya_idempotency_key') : '';
        if ($key === '' || ! function_exists('as_unschedule_all_actions')) {
            return;
        }
        for ($attempt = 1; $attempt <= 5; $attempt++) {
            as_unschedule_all_actions('aerion_sankhya_push_order', [$orderId, $key, $attempt], 'aerion-sankhya');
        }
    }

    public static function run(int $orderId, int $attempt): void
    {
        $order = wc_get_order($orderId);
        if (! $order instanceof WC_Order || $order->get_meta('_aerion_sankhya_cancelled_at')) {
            return;
        }
        if (! in_array($order->get_status(), self::CLOSED, true)) {
            $order->add_order_note(sprintf(
                'Sankhya: cancelamento não enviado; o pedido voltou para "%s".',
                wc_get_order_status_name($order->get_status())
            ));
            return;
        }
        $client = new Aerion_Sankhya_Client(Aerion_Sankhya_Sync::mode());
        $remoteId = (string) $order->get_meta('_aerion_sankhya_remote_id');

        // Envio com resultado incerto: descobrir se o pedido chegou a existir.
        if ($remoteId === '' && $order->get_meta('_aerion_sankhya_uncertain') === 'yes') {
            $found = $client->find_sales_order($order);
            if (is_wp_error($found)) {
                self::fail($order, $found, $attempt);
                return;
            }
            if ($found === null) {
                $order->delete_meta_data('_aerion_sankhya_uncertain');
                $order->save();
                $order->add_order_note('Sankhya: o pedido não chegou a ser criado no ERP; nada a cancelar.');
                return;
            }
            $remoteId = (string) $found['remote_id'];
            $order->update_meta_data('_aerion_sankhya_remote_id', $remoteId);
            $order->delete_meta_data('_aerion_sankhya_uncertain');
            $order->save();
        }
        if ($remoteId === '') {
            return;
        }
        if (self::invoice_in_force($order)) {
            self::require_invoice_cancel($order, $client);
            return;
        }

        $result = $client->cancel_sales_order($remoteId, self::reason($order));
        if (is_wp_error($result)) {
            if ($result->get_error_code() === 'sankhya_order_invoiced') {
                self::require_invoice_cancel($order, $client);
                return;
            }
            if ($result->get_error_code() === 'sankhya_order_unconfirmed') {
                self::require_manual_cancel($order, $remoteId);
                return;
            }
            self::fail($order, $result, $attempt);
            return;
        }
        $order->update_meta_data('_aerion_sankhya_cancelled_at', current_time('mysql', true));
        $order->update_meta_data('_aerion_sankhya_status', 'cancelled');
        $order->delete_meta_data('_aerion_sankhya_cancel_error');
        $order->save();
        $order->add_order_note(sprintf(
            ($result['status'] ?? '') === 'already_cancelled'
                ? 'Sankhya: pedido %s já estava cancelado no ERP.'
                : 'Sankhya: pedido %s cancelado no ERP.',
            $remoteId
        ));
    }

    /**
     * Confere as notas que a equipe precisa cancelar no ERP.
     *
     * A API não documenta os códigos de `statusNFe`, mas documenta que o DANFE
     * responde 409 para nota que não está autorizada. Nota que era autorizada e
     * passou a dar 409 foi cancelada.
     *
     * @return array{at:string,checked:int,cancelled:int,errors:list<string>}|WP_Error
     */
    public static function watch(): array|WP_Error
    {
        if (Aerion_Sankhya_Sync::mode() !== 'live') {
            return new WP_Error('sankhya_not_live', 'O acompanhamento de cancelamentos exige o modo live.');
        }
        if (! Aerion_Sankhya_Client::supports_invoices()) {
            return new WP_Error('sankhya_invoices_unsupported', 'O proxy do Sankhya não expõe NF-e; a equipe confirma o cancelamento da nota manualmente.');
        }
        $client = new Aerion_Sankhya_Client('live');
        $orders = wc_get_orders([
            'limit'      => 50,
            'status'     => array_keys(wc_get_order_statuses()),
            'meta_key'   => '_aerion_sankhya_invoice_cancel_pending',
            'meta_value' => 'yes',
        ]);
        $checked = 0;
        $cancelled = 0;
        $errors = [];
        foreach ($orders as $order) {
            if (! $order instanceof WC_Order) {
                continue;
            }
            $code = (string) ($order->get_meta('_aerion_sankhya_invoice_code') ?: $order->get_meta('_aerion_invoice_key'));
            if ($code === '') {
                continue;
            }
            $checked++;
            $danfe = $client->invoice_danfe($code);
            if (! is_wp_error($danfe)) {
                continue;
            }
            if ($danfe->get_error_code() !== 'sankhya_danfe_not_ready') {
                $errors[] = '#' . $order->get_order_number() . ': ' . $danfe->get_error_message();
                continue;
            }
            self::invoice_cancelled($order);
            $cancelled++;
        }
        $summary = ['at' => current_time('mysql', true), 'checked' => $checked, 'cancelled' => $cancelled, 'errors' => array_slice($errors, 0, 5)];
        update_option('aerion_sankhya_cancellations_last', $summary, false);
        return $summary;
    }

    public static function partial_refund(int $orderId, int $refundId): void
    {
        $order = wc_get_order($orderId);
        if (! $order instanceof WC_Order || ! self::sent($order)) {
            return;
        }
        $refund = wc_get_order($refundId);
        $amount = $refund ? abs((float) $refund->get_amount()) : 0.0;
        $formatted = html_entity_decode(wp_strip_all_tags(wc_price($amount, ['currency' => $order->get_currency()])));
        $action = self::invoice_in_force($order)
            ? 'registre a devolução parcial (nota de entrada) no Sankhya.'
            : 'ajuste itens ou financeiro no Sankhya antes de faturar.';
        $order->add_order_note(sprintf('Sankhya: reembolso parcial de %s. O pedido segue ativo no ERP; %s', $formatted, $action));
        self::notify_team($order, sprintf('Reembolso parcial no pedido #%s: ajustar no Sankhya', $order->get_order_number()), [
            sprintf('Pedido #%s recebeu reembolso parcial de %s.', $order->get_order_number(), $formatted),
            'O pedido continua ativo no Sankhya; ' . $action,
        ]);
    }

    public static function order_action(array $actions): array
    {
        $actions['aerion_sankhya_cancel'] = __('Cancelar no Sankhya', 'aerion-sankhya');
        return $actions;
    }

    public static function manual(WC_Order $order): void
    {
        if (! in_array($order->get_status(), self::CLOSED, true)) {
            $order->add_order_note('Sankhya: só pedidos cancelados ou reembolsados são cancelados no ERP.');
            return;
        }
        $order->delete_meta_data('_aerion_sankhya_cancel_error');
        $order->save();
        self::run($order->get_id(), 1);
    }

    private static function sent(WC_Order $order): bool
    {
        return (string) $order->get_meta('_aerion_sankhya_remote_id') !== ''
            || $order->get_meta('_aerion_sankhya_uncertain') === 'yes';
    }

    private static function invoice_in_force(WC_Order $order): bool
    {
        return (string) $order->get_meta('_aerion_invoice_key') !== ''
            && (string) $order->get_meta('_aerion_invoice_cancelled_at') === '';
    }

    private static function require_invoice_cancel(WC_Order $order, Aerion_Sankhya_Client $client): void
    {
        if ((string) $order->get_meta('_aerion_invoice_key') === '') {
            $invoice = $client->find_invoice($order);
            if (is_array($invoice)) {
                $order->update_meta_data('_aerion_invoice_number', $invoice['number']);
                $order->update_meta_data('_aerion_invoice_series', $invoice['series']);
                $order->update_meta_data('_aerion_invoice_key', $invoice['key']);
                $order->update_meta_data('_aerion_invoice_protocol', $invoice['protocol']);
                $order->update_meta_data('_aerion_invoice_protocol_date', $invoice['protocol_date']);
                $order->update_meta_data('_aerion_sankhya_invoice_code', $invoice['code']);
            }
        }
        $order->update_meta_data('_aerion_sankhya_invoice_cancel_pending', 'yes');
        $order->delete_meta_data('_aerion_sankhya_cancel_error');
        $order->save();

        $number = (string) $order->get_meta('_aerion_invoice_number');
        $key = (string) $order->get_meta('_aerion_invoice_key');
        $deadline = self::deadline($order);
        $deadlineText = $deadline !== null ? 'até ' . $deadline : 'em até 24 horas da autorização';
        $order->add_order_note(sprintf(
            'Sankhya: o pedido já foi faturado%s. Cancele a nota no Sankhya %s; depois do prazo, só com nota de devolução. '
            . 'O site acompanha e tira a nota da área do cliente quando o cancelamento for autorizado.',
            $number !== '' ? ' (NF-e ' . $number . ')' : '',
            $deadlineText
        ));
        self::notify_team($order, sprintf('Cancelar NF-e %s no Sankhya: pedido #%s', $number, $order->get_order_number()), [
            sprintf('O pedido #%s foi %s na loja, mas já tem nota fiscal emitida.', $order->get_order_number(), wc_get_order_status_name($order->get_status())),
            'Motivo: ' . self::reason($order),
            '',
            'NF-e: ' . ($number !== '' ? $number : 'não localizada') . ((string) $order->get_meta('_aerion_invoice_series') !== '' ? ' (série ' . $order->get_meta('_aerion_invoice_series') . ')' : ''),
            'Chave de acesso: ' . ($key !== '' ? $key : 'não localizada'),
            'Autorizada em: ' . ((string) $order->get_meta('_aerion_invoice_protocol_date') ?: 'não informado'),
            'Prazo para cancelar: ' . ($deadline ?? '24 horas após a autorização') . '. Depois disso, só com nota de devolução.',
            '',
            'Cancele a nota no Sankhya. O site confere a cada 30 minutos e, quando a nota deixar de ser autorizada, cancela o pedido no ERP sozinho.',
        ]);
    }

    private static function invoice_cancelled(WC_Order $order): void
    {
        $order->update_meta_data('_aerion_invoice_cancelled_at', current_time('mysql', true));
        $order->delete_meta_data('_aerion_sankhya_invoice_cancel_pending');
        $order->save();
        $order->add_order_note(sprintf(
            'Sankhya: NF-e %s não está mais autorizada (cancelada no ERP). DANFE e XML saíram da área do cliente.',
            (string) $order->get_meta('_aerion_invoice_number')
        ));
        // Sem a nota, o pedido volta a poder ser cancelado.
        if (in_array($order->get_status(), self::CLOSED, true) && ! $order->get_meta('_aerion_sankhya_cancelled_at')) {
            self::schedule($order->get_id(), 1, time());
        }
    }

    /** Fim do prazo de cancelamento (24 horas após a autorização), quando a data do protocolo é conhecida. */
    private static function deadline(WC_Order $order): ?string
    {
        $raw = trim((string) $order->get_meta('_aerion_invoice_protocol_date'));
        foreach (['d/m/Y H:i:s', 'd/m/Y H:i', 'Y-m-d\TH:i:sP', 'Y-m-d\TH:i:s', 'Y-m-d H:i:s'] as $format) {
            $moment = $raw !== '' ? DateTimeImmutable::createFromFormat($format, $raw, wp_timezone()) : false;
            if ($moment instanceof DateTimeImmutable) {
                return wp_date('d/m/Y H:i', $moment->getTimestamp() + DAY_IN_SECONDS);
            }
        }
        return null;
    }

    private static function reason(WC_Order $order): string
    {
        return $order->get_status() === 'refunded'
            ? sprintf('Pagamento estornado no Mercado Pago - pedido site #%s', $order->get_order_number())
            : sprintf('Pedido cancelado no site - pedido site #%s', $order->get_order_number());
    }

    /**
     * O Sankhya recusa cancelar pedido "a confirmar" e a API não confirma:
     * a equipe cancela ou exclui o pedido no ERP. Não há nova tentativa útil.
     */
    private static function require_manual_cancel(WC_Order $order, string $remoteId): void
    {
        $order->update_meta_data('_aerion_sankhya_cancel_error', 'Pedido ainda "a confirmar" no Sankhya; cancele ou exclua manualmente.');
        $order->save();
        $order->add_order_note(sprintf(
            'Sankhya: o pedido %s está "a confirmar" e a API não cancela pedido não confirmado. Cancele ou exclua no Sankhya; a equipe foi avisada.',
            $remoteId
        ));
        self::notify_team($order, sprintf('Cancelar pedido %s no Sankhya (pedido #%s)', $remoteId, $order->get_order_number()), [
            sprintf('O pedido #%s foi %s na loja, mas o pedido %s ainda está "a confirmar" no Sankhya.', $order->get_order_number(), wc_get_order_status_name($order->get_status()), $remoteId),
            'Motivo: ' . self::reason($order),
            '',
            'A API não cancela pedido não confirmado. Cancele ou exclua o pedido ' . $remoteId . ' direto no Sankhya.',
        ]);
    }

    /** @param list<string> $lines */
    private static function notify_team(WC_Order $order, string $subject, array $lines): void
    {
        Aerion_Sankhya_Alerts::notify($order, $subject, $lines);
    }

    private static function fail(WC_Order $order, WP_Error $error, int $attempt): void
    {
        $data = (array) $error->get_error_data();
        $retryable = ! empty($data['retryable']);
        $willRetry = $retryable && $attempt < self::MAX_ATTEMPTS;
        $order->update_meta_data('_aerion_sankhya_cancel_error', $error->get_error_message());
        $order->save();
        $suffix = $willRetry
            ? ' Nova tentativa agendada.'
            : ($retryable ? ' Tentativas esgotadas; use "Cancelar no Sankhya".' : '');
        $order->add_order_note('Sankhya (cancelamento): ' . $error->get_error_message() . $suffix);
        if ($willRetry) {
            self::schedule($order->get_id(), $attempt + 1, time() + (5 ** $attempt) * MINUTE_IN_SECONDS);
        } else {
            self::notify_team($order, sprintf('Cancelamento do pedido #%s não foi feito no Sankhya', $order->get_order_number()), [
                sprintf('O pedido #%s foi %s na loja, mas o cancelamento no Sankhya falhou.', $order->get_order_number(), wc_get_order_status_name($order->get_status())),
                'Motivo: ' . $error->get_error_message(),
                '',
                'Cancele no Sankhya ou use "Cancelar no Sankhya" nas ações do pedido.',
            ]);
        }
    }

    private static function schedule(int $orderId, int $attempt, int $timestamp): void
    {
        if (function_exists('as_schedule_single_action')) {
            as_schedule_single_action($timestamp, self::HOOK, [$orderId, $attempt], 'aerion-sankhya', true);
        } else {
            wp_schedule_single_event($timestamp, self::HOOK, [$orderId, $attempt]);
        }
    }
}
