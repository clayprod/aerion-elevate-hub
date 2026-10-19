<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Traz do Sankhya a NF-e dos pedidos pagos.
 *
 * O Sankhya não avisa quando fatura: a cada ciclo, cada pedido em
 * "processando" já enviado ao ERP é consultado. Achada a nota autorizada,
 * DANFE e XML vão para a pasta privada (a mesma do upload manual) e o pedido
 * passa a "Nota fiscal emitida", o que dispara o e-mail com os anexos.
 */
final class Aerion_Sankhya_Invoices
{
    public const HOOK = 'aerion_sankhya_poll_invoices';

    /** Pedido pago há mais tempo que isto sem nota sai da consulta automática. */
    private const WINDOW_DAYS = 60;

    public static function boot(): void
    {
        add_action(self::HOOK, [self::class, 'scheduled']);
        add_action('rest_api_init', [self::class, 'register_routes']);
        add_filter('woocommerce_order_actions', [self::class, 'order_action']);
        add_action('woocommerce_order_action_aerion_sankhya_invoice', [self::class, 'manual_check']);
    }

    /** Execução agendada: só em horário comercial. O botão e o WP-CLI chamam poll() direto, a qualquer hora. */
    public static function scheduled(): void
    {
        if (Aerion_Sankhya_Jobs::business_hours()) {
            self::poll();
        }
    }

    /**
     * @return array{at:string,checked:int,found:int,errors:list<string>}|WP_Error
     */
    public static function poll(): array|WP_Error
    {
        if (Aerion_Sankhya_Sync::mode() !== 'live') {
            return new WP_Error('sankhya_not_live', 'A busca de notas fiscais exige o modo live.');
        }
        if (! Aerion_Sankhya_Client::supports_invoices()) {
            return new WP_Error('sankhya_invoices_unsupported', 'O proxy do Sankhya não expõe NF-e; anexe DANFE e XML no pedido manualmente.');
        }
        $client = new Aerion_Sankhya_Client('live');
        $orders = wc_get_orders([
            'status'       => ['processing'],
            'date_created' => '>' . (time() - self::WINDOW_DAYS * DAY_IN_SECONDS),
            'limit'        => 100,
            'orderby'      => 'date',
            'order'        => 'ASC',
        ]);
        $checked = 0;
        $found = 0;
        $errors = [];
        foreach ($orders as $order) {
            if (! $order instanceof WC_Order || ! self::pending($order)) {
                continue;
            }
            $checked++;
            $result = self::check($order, $client);
            if ($result === true) {
                $found++;
            } elseif (is_wp_error($result)) {
                $errors[] = '#' . $order->get_order_number() . ': ' . $result->get_error_message();
            }
        }
        $summary = ['at' => current_time('mysql', true), 'checked' => $checked, 'found' => $found, 'errors' => array_slice($errors, 0, 5)];
        update_option('aerion_sankhya_invoices_last', $summary, false);
        return $summary;
    }

    /**
     * true = nota registrada; false = ainda sem nota autorizada.
     */
    public static function check(WC_Order $order, Aerion_Sankhya_Client $client): bool|WP_Error
    {
        $invoice = $client->find_invoice($order);
        if (is_wp_error($invoice)) {
            return self::remember_error($order, $invoice);
        }
        if ($invoice === null) {
            return false;
        }
        if ($invoice['code'] === '') {
            return self::remember_error($order, new WP_Error('sankhya_invoice_code_missing', 'Nota encontrada sem código interno no Sankhya.'));
        }
        $pdf = $client->invoice_danfe($invoice['code']);
        if (is_wp_error($pdf)) {
            // Nota com protocolo mas DANFE ainda recusado: o próximo ciclo tenta de novo.
            return $pdf->get_error_code() === 'sankhya_danfe_not_ready' ? false : self::remember_error($order, $pdf);
        }
        $xml = $client->invoice_xml($invoice['code']);
        if (is_wp_error($xml)) {
            // O proxy pode não expor o XML; o DANFE basta para o cliente.
            if (! Aerion_Sankhya_Client::is_proxy()) {
                return self::remember_error($order, $xml);
            }
            $xml = '';
        }
        $attached = self::attach($order, $invoice, $pdf, $xml);
        return is_wp_error($attached) ? self::remember_error($order, $attached) : true;
    }

    /**
     * Grava DANFE e XML na pasta privada, registra a nota no pedido e, se ele
     * estiver em "processando", muda o status (o que dispara o e-mail com anexos).
     *
     * @param array{code?:string,number?:string,series?:string,key:string,protocol?:string,protocol_date?:string} $invoice
     */
    public static function attach(WC_Order $order, array $invoice, string $pdf, string $xml = ''): true|WP_Error
    {
        $pdfPath = self::store($order, 'DANFE-' . $invoice['key'] . '.pdf', $pdf);
        if (is_wp_error($pdfPath)) {
            return $pdfPath;
        }
        $xmlPath = '';
        if ($xml !== '') {
            $xmlPath = self::store($order, 'NFe' . $invoice['key'] . '.xml', $xml);
            if (is_wp_error($xmlPath)) {
                return $xmlPath;
            }
        }

        $order->update_meta_data('_aerion_invoice_number', $invoice['number'] ?? '');
        $order->update_meta_data('_aerion_invoice_series', $invoice['series'] ?? '');
        $order->update_meta_data('_aerion_invoice_key', $invoice['key']);
        $order->update_meta_data('_aerion_invoice_protocol', $invoice['protocol'] ?? '');
        $order->update_meta_data('_aerion_invoice_protocol_date', $invoice['protocol_date'] ?? '');
        $order->update_meta_data('_aerion_sankhya_invoice_code', $invoice['code'] ?? '');
        $order->update_meta_data('_aerion_invoice_private_path', $pdfPath);
        if ($xmlPath !== '') {
            $order->update_meta_data('_aerion_invoice_xml_path', $xmlPath);
        }
        $order->delete_meta_data('_aerion_sankhya_invoice_error');
        $order->save();
        $order->add_order_note(sprintf(
            'Sankhya: NF-e %s autorizada (chave %s). %s disponível na conta do cliente.',
            ($invoice['number'] ?? '') ?: ($invoice['code'] ?? ''),
            $invoice['key'],
            $xmlPath !== '' ? 'DANFE e XML' : 'DANFE'
        ));
        // Os arquivos já estão gravados: o e-mail disparado por esta mudança os anexa.
        if ($order->get_status() === 'processing') {
            $order->update_status(self::invoiced_status(), 'Nota fiscal autorizada no Sankhya.');
        }
        return true;
    }

    /**
     * Recebe a nota de quem a tem. O proxy não expõe NF-e e o Sankhya só manda
     * o DANFE por e-mail; o fluxo que lê esse e-mail (n8n) entrega aqui.
     *
     * Corpo JSON: `pedido` (código do pedido no Sankhya) ou `pedido_site` (número
     * do pedido da loja), `chave` (44 dígitos), `pdf_base64` e, se houver,
     * `xml_base64`, `numero`, `serie`, `protocolo`.
     */
    public static function register_routes(): void
    {
        register_rest_route('aerion/v1', '/fiscal/nota', [
            'methods'             => 'POST',
            'callback'            => [self::class, 'receive'],
            'permission_callback' => [self::class, 'authorize'],
        ]);
    }

    public static function authorize(WP_REST_Request $request): bool|WP_Error
    {
        $secret = (string) getenv('AERION_INVOICE_WEBHOOK_KEY');
        if ($secret === '') {
            return new WP_Error('aerion_invoice_disabled', 'Recebimento de nota fiscal não configurado.', ['status' => 404]);
        }
        $given = (string) $request->get_header('x_aerion_key');
        return hash_equals($secret, $given) ? true : new WP_Error('aerion_invoice_forbidden', 'Chave inválida.', ['status' => 401]);
    }

    public static function receive(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        $key = (string) preg_replace('/\D+/', '', (string) $request->get_param('chave'));
        if (strlen($key) !== 44) {
            return new WP_Error('aerion_invoice_key', 'Informe a chave de acesso com 44 dígitos.', ['status' => 400]);
        }
        $pdf = base64_decode((string) $request->get_param('pdf_base64'), true);
        if ($pdf === false || ! str_starts_with($pdf, '%PDF')) {
            return new WP_Error('aerion_invoice_pdf', 'pdf_base64 ausente ou não é um PDF.', ['status' => 400]);
        }
        $xml = '';
        if ((string) $request->get_param('xml_base64') !== '') {
            $xml = base64_decode((string) $request->get_param('xml_base64'), true);
            if ($xml === false || ! str_contains($xml, '<')) {
                return new WP_Error('aerion_invoice_xml', 'xml_base64 inválido.', ['status' => 400]);
            }
        }
        $order = self::find_order((string) $request->get_param('pedido'), (string) $request->get_param('pedido_site'));
        if (! $order) {
            return new WP_Error('aerion_invoice_order', 'Pedido não encontrado.', ['status' => 404]);
        }
        $current = (string) $order->get_meta('_aerion_invoice_key');
        if ($current === $key) {
            return new WP_REST_Response(['status' => 'already', 'order' => $order->get_id()], 200);
        }
        if ($current !== '' && (string) $order->get_meta('_aerion_invoice_cancelled_at') === '') {
            return new WP_Error('aerion_invoice_conflict', 'O pedido já tem outra nota fiscal.', ['status' => 409]);
        }
        $attached = self::attach($order, [
            'code'          => sanitize_text_field((string) $request->get_param('pedido')),
            'number'        => sanitize_text_field((string) $request->get_param('numero')),
            'series'        => sanitize_text_field((string) $request->get_param('serie')),
            'key'           => $key,
            'protocol'      => sanitize_text_field((string) $request->get_param('protocolo')),
            'protocol_date' => '',
        ], $pdf, $xml);
        if (is_wp_error($attached)) {
            return new WP_Error($attached->get_error_code(), $attached->get_error_message(), ['status' => 500]);
        }
        return new WP_REST_Response(['status' => 'attached', 'order' => $order->get_id()], 200);
    }

    private static function find_order(string $sankhyaOrder, string $siteOrder): ?WC_Order
    {
        $sankhyaOrder = trim($sankhyaOrder);
        if ($sankhyaOrder !== '') {
            $orders = wc_get_orders(['limit' => 2, 'meta_key' => '_aerion_sankhya_remote_id', 'meta_value' => $sankhyaOrder, 'status' => array_keys(wc_get_order_statuses())]);
            if (count($orders) === 1 && $orders[0] instanceof WC_Order) {
                return $orders[0];
            }
            return null;
        }
        $siteOrder = trim($siteOrder);
        $order = ctype_digit($siteOrder) ? wc_get_order((int) $siteOrder) : null;
        return $order instanceof WC_Order && $order->get_type() === 'shop_order' ? $order : null;
    }

    public static function order_action(array $actions): array
    {
        $actions['aerion_sankhya_invoice'] = __('Buscar nota fiscal no Sankhya', 'aerion-sankhya');
        return $actions;
    }

    public static function manual_check(WC_Order $order): void
    {
        if (Aerion_Sankhya_Sync::mode() !== 'live') {
            $order->add_order_note('Sankhya: busca de nota fiscal disponível só no modo live.');
            return;
        }
        if ((string) $order->get_meta('_aerion_sankhya_remote_id') === '') {
            $order->add_order_note('Sankhya: o pedido ainda não foi enviado ao Sankhya.');
            return;
        }
        $result = self::check($order, new Aerion_Sankhya_Client('live'));
        if ($result === false) {
            $order->add_order_note('Sankhya: nenhuma NF-e autorizada para este pedido ainda.');
        }
    }

    private static function pending(WC_Order $order): bool
    {
        return (string) $order->get_meta('_aerion_sankhya_remote_id') !== ''
            && ! str_starts_with((string) $order->get_meta('_aerion_sankhya_remote_id'), 'MOCK-')
            && (string) $order->get_meta('_aerion_invoice_key') === '';
    }

    private static function invoiced_status(): string
    {
        return class_exists('Aerion_Order_Status') ? Aerion_Order_Status::NOTA : 'aerion-nf';
    }

    private static function store(WC_Order $order, string $filename, string $content): string|WP_Error
    {
        $root = defined('AERION_PRIVATE_DIR') ? AERION_PRIVATE_DIR : WP_CONTENT_DIR . '/aerion-private';
        $directory = trailingslashit($root) . 'orders/' . $order->get_id();
        if (! wp_mkdir_p($directory)) {
            return new WP_Error('sankhya_storage_failed', 'Não foi possível criar a pasta privada da nota fiscal.');
        }
        $target = trailingslashit($directory) . sanitize_file_name($filename);
        if (file_put_contents($target, $content) === false) {
            return new WP_Error('sankhya_storage_failed', 'Não foi possível gravar o arquivo da nota fiscal.');
        }
        @chmod($target, 0640);
        return $target;
    }

    /** Anota o erro no pedido só quando ele muda, para os ciclos de busca não encherem o histórico. */
    private static function remember_error(WC_Order $order, WP_Error $error): WP_Error
    {
        $message = $error->get_error_message();
        if ((string) $order->get_meta('_aerion_sankhya_invoice_error') !== $message) {
            $order->update_meta_data('_aerion_sankhya_invoice_error', $message);
            $order->save();
            $order->add_order_note('Sankhya (nota fiscal): ' . $message);
        }
        return $error;
    }
}
