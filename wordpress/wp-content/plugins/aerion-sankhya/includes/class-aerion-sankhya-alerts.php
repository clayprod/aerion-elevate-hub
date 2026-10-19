<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Avisos por e-mail à equipe sobre o que exige ação humana no ERP.
 *
 * O destinatário é o do e-mail "Novo pedido" do WooCommerce (aceita vários,
 * separados por vírgula), então trocar a caixa em um lugar só vale para tudo.
 */
final class Aerion_Sankhya_Alerts
{
    /** Pedido que já foi pago antes de entrar em espera. */
    private const PAID_BEFORE = ['processing', 'aerion-nf', 'aerion-transito', 'completed'];

    public static function boot(): void
    {
        add_action('woocommerce_order_status_changed', [self::class, 'status_changed'], 20, 3);
    }

    /** @param list<string> $lines */
    public static function notify(WC_Order $order, string $subject, array $lines): void
    {
        $settings = get_option('woocommerce_new_order_settings', []);
        $to = is_array($settings) && ! empty($settings['recipient']) ? (string) $settings['recipient'] : (string) get_option('admin_email');
        $lines[] = '';
        $lines[] = 'Pedido no admin: ' . $order->get_edit_order_url();
        wp_mail($to, '[' . wp_specialchars_decode((string) get_bloginfo('name'), ENT_QUOTES) . '] ' . $subject, implode("\n", $lines));
    }

    /**
     * Pedido pago que não entrou no ERP: sem este aviso só restaria uma nota
     * privada no pedido e ninguém ficaria sabendo.
     *
     * Chamado quando não há mais tentativa automática; o mesmo erro não é
     * avisado duas vezes.
     */
    public static function sync_failed(WC_Order $order, WP_Error $error): void
    {
        $message = $error->get_error_message();
        $signature = md5($message);
        if ((string) $order->get_meta('_aerion_sankhya_alerted') === $signature) {
            return;
        }
        $order->update_meta_data('_aerion_sankhya_alerted', $signature);
        $order->save();
        $uncertain = $order->get_meta('_aerion_sankhya_uncertain') === 'yes';
        self::notify($order, sprintf('Pedido #%s não entrou no Sankhya', $order->get_order_number()), [
            sprintf('O pedido #%s está %s na loja, mas não foi enviado ao Sankhya.', $order->get_order_number(), wc_get_order_status_name($order->get_status())),
            'Motivo: ' . $message,
            '',
            $uncertain
                ? 'Atenção: o envio pode ter sido gravado no ERP mesmo com a falha. Confira no Sankhya antes de reprocessar.'
                : 'Corrija o que o motivo indica e use "Enviar/reprocessar no Sankhya" nas ações do pedido.',
        ]);
    }

    public static function status_changed(int $orderId, string $from, string $to): void
    {
        $order = wc_get_order($orderId);
        if (! $order instanceof WC_Order) {
            return;
        }
        $number = $order->get_order_number();
        if ($to === 'refunded') {
            self::notify($order, sprintf('Pedido #%s reembolsado', $number), [
                sprintf('O pedido #%s foi reembolsado (valor %s).', $number, html_entity_decode(wp_strip_all_tags(wc_price((float) $order->get_total(), ['currency' => $order->get_currency()])))),
                'Confira o cancelamento do pedido e da nota fiscal no Sankhya.',
            ]);
            return;
        }
        // O Mercado Pago coloca o pedido em espera quando abre mediação ou contestação.
        if ($to === 'on-hold' && in_array($from, self::PAID_BEFORE, true)) {
            self::notify($order, sprintf('Pedido #%s voltou para "Aguardando" depois de pago', $number), [
                sprintf('O pedido #%s estava "%s" e voltou para "Aguardando".', $number, wc_get_order_status_name($from)),
                'Isso costuma indicar mediação ou contestação do pagamento no Mercado Pago. Verifique antes de faturar ou enviar.',
            ]);
        }
    }
}
