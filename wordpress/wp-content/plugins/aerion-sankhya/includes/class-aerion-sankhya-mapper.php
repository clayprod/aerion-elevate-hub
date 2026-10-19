<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Traduz cliente e pedido do WooCommerce para os payloads da API REST do Sankhya.
 *
 * Fica fora do cliente HTTP para que o modo mock valide exatamente o mesmo
 * payload que o modo live envia, e para que o mapeamento seja testável sem rede.
 */
final class Aerion_Sankhya_Mapper
{
    /**
     * Marca gravada na observação do pedido no Sankhya.
     *
     * A API não aceita chave de idempotência; é por esta marca que um envio
     * cujo resultado ficou incerto (timeout, 5xx) é reencontrado antes de reenviar.
     */
    public static function order_marker(WC_Order $order): string
    {
        return 'Pedido site #' . $order->get_order_number();
    }

    /** Data de negociação do pedido: a aprovação do pagamento, ou a criação. */
    public static function order_timestamp(WC_Order $order): int
    {
        $moment = $order->get_date_paid() ?: $order->get_date_created();
        return $moment ? $moment->getTimestamp() : time();
    }

    /** Campo adicional (AD_*) do cabeçalho que recebe o número do pedido do site. */
    public static function ad_field(): string
    {
        $field = strtolower(trim((string) get_option('aerion_sankhya_order_ad_field', '')));
        return preg_match('/^ad_[a-z0-9_]{1,40}$/', $field) ? $field : '';
    }

    /** Saldo por produto e local, gravado pela sincronização de estoque. */
    public const STOCK_BY_LOCATION_OPTION = 'aerion_sankhya_stock_by_location';

    /**
     * Local de estoque da linha: onde o produto tem saldo.
     *
     * Entre os locais que cobrem a quantidade vence o de maior saldo; se nenhum
     * cobre, o de maior saldo (o ERP decide o que fazer com a falta). Sem saldo
     * conhecido, vale o local padrão configurado.
     */
    public static function stock_location(int $productCode, float $quantity, int $default): int
    {
        $map = get_option(self::STOCK_BY_LOCATION_OPTION, []);
        $locations = is_array($map) && is_array($map[(string) $productCode] ?? null) ? $map[(string) $productCode] : [];
        if (! $locations) {
            return $default;
        }
        arsort($locations);
        foreach ($locations as $location => $available) {
            if ((float) $available >= $quantity) {
                return (int) $location;
            }
        }
        return (int) array_key_first($locations);
    }

    /**
     * Payload de POST /v1/parceiros/clientes.
     *
     * @return array<string,mixed>|WP_Error
     */
    public static function customer(WC_Order $order): array|WP_Error
    {
        $document = self::document($order);
        if (! in_array(strlen($document), [11, 14], true)) {
            return self::incomplete('CPF/CNPJ ausente ou inválido no pedido.');
        }
        $isCompany = strlen($document) === 14;
        $address = self::address($order);
        if (is_wp_error($address)) {
            return $address;
        }
        $fullName = trim($order->get_formatted_billing_full_name());
        $company = trim($order->get_billing_company());
        $name = $isCompany && $company !== '' ? $company : $fullName;
        if ($name === '') {
            return self::incomplete('Nome do cliente ausente no pedido.');
        }

        $payload = [
            'tipo'     => $isCompany ? 'PJ' : 'PF',
            'cnpjCpf'  => $document,
            'nome'     => mb_substr($name, 0, 100),
            'endereco' => $address,
        ];
        if ($isCompany && $company !== '') {
            $payload['razao'] = mb_substr($company, 0, 100);
        }
        $stateRegistration = self::state_registration($order);
        if ($stateRegistration !== '') {
            $payload['ieRg'] = $stateRegistration;
        }
        $fiscalEmail = sanitize_email((string) $order->get_meta('_billing_fiscal_email'));
        $email = $isCompany && $fiscalEmail !== '' ? $fiscalEmail : $order->get_billing_email();
        if ($email !== '') {
            $payload['email'] = $email;
        }
        $phone = self::digits($order->get_billing_phone());
        if (strlen($phone) >= 12 && str_starts_with($phone, '55')) {
            $phone = substr($phone, 2);
        }
        if (strlen($phone) >= 10) {
            $payload['telefoneDdd'] = substr($phone, 0, 2);
            $payload['telefoneNumero'] = substr($phone, 2);
        }
        return $payload;
    }

    /**
     * Endereço de cobrança no formato do Sankhya, com o código IBGE do município.
     *
     * @return array<string,mixed>|WP_Error
     */
    public static function address(WC_Order $order): array|WP_Error
    {
        $street = trim($order->get_billing_address_1());
        $number = trim((string) $order->get_meta('_billing_number'));
        // Pedidos anteriores ao campo "Número" gravavam "Rua X, 123" numa linha só.
        if ($number === '' && preg_match('/^(.+?),\s*(\d+[a-z]?|s\/?n)$/iu', $street, $match)) {
            $street = trim($match[1]);
            $number = $match[2];
        }
        $postcode = self::digits($order->get_billing_postcode());
        $neighborhood = trim((string) $order->get_meta('_billing_neighborhood'));
        $ibge = '';
        if (strlen($postcode) === 8) {
            $lookup = self::lookup_postcode($postcode);
            if (is_wp_error($lookup) && $lookup->get_error_code() !== 'sankhya_cep_not_found') {
                return $lookup;
            }
            if (! is_wp_error($lookup)) {
                $ibge = $lookup['ibge'];
                if ($neighborhood === '') {
                    $neighborhood = $lookup['bairro'];
                }
            }
        }
        $city = trim($order->get_billing_city());
        $state = strtoupper(trim($order->get_billing_state()));

        $missing = array_keys(array_filter([
            'rua'                      => $street === '',
            'número'                   => $number === '',
            'bairro'                   => $neighborhood === '',
            'cidade'                   => $city === '',
            'UF'                       => strlen($state) !== 2,
            'CEP'                      => strlen($postcode) !== 8,
            'código IBGE do município' => $ibge === '',
        ]));
        if ($missing) {
            return self::incomplete('Endereço incompleto para o Sankhya: falta ' . implode(', ', $missing) . '.');
        }

        // O cadastro de parceiro aceita só dígitos no número; "S/N" vira 0 e
        // sufixos como "123A" seguem no complemento para não se perderem.
        $complement = trim($order->get_billing_address_2());
        if (! ctype_digit($number)) {
            $complement = trim('Nº ' . $number . ' ' . $complement);
        }
        $address = [
            'logradouro' => mb_substr($street, 0, 100),
            'numero'     => (int) self::digits($number),
            'bairro'     => mb_substr($neighborhood, 0, 60),
            'cidade'     => $city,
            'codigoIbge' => $ibge,
            'uf'         => $state,
            'cep'        => $postcode,
        ];
        if ($complement !== '') {
            $address['complemento'] = mb_substr($complement, 0, 60);
        }
        return $address;
    }

    /**
     * Código IBGE e bairro pelo CEP (ViaCEP). O site não coleta o IBGE, e o
     * Sankhya não cadastra parceiro sem ele.
     *
     * @return array{ibge:string,bairro:string}|WP_Error
     */
    public static function lookup_postcode(string $postcode): array|WP_Error
    {
        $cacheKey = 'aerion_sankhya_cep_' . $postcode;
        $cached = get_transient($cacheKey);
        if (is_array($cached)) {
            return $cached;
        }
        $response = wp_remote_get('https://viacep.com.br/ws/' . $postcode . '/json/', [
            'timeout' => 8,
            'headers' => ['Accept' => 'application/json'],
        ]);
        if (is_wp_error($response) || wp_remote_retrieve_response_code($response) >= 500) {
            return new WP_Error(
                'sankhya_cep_unavailable',
                'Consulta de CEP indisponível para obter o código IBGE do município.',
                ['retryable' => true]
            );
        }
        $data = json_decode((string) wp_remote_retrieve_body($response), true);
        $ibge = is_array($data) ? self::digits((string) ($data['ibge'] ?? '')) : '';
        if (! is_array($data) || ! empty($data['erro']) || strlen($ibge) !== 7) {
            return new WP_Error('sankhya_cep_not_found', 'CEP não encontrado na base dos Correios.');
        }
        $result = ['ibge' => $ibge, 'bairro' => sanitize_text_field((string) ($data['bairro'] ?? ''))];
        set_transient($cacheKey, $result, 30 * DAY_IN_SECONDS);
        return $result;
    }

    /**
     * Payload de POST /v1/vendas/pedidos.
     *
     * @return array<string,mixed>|WP_Error
     */
    public static function order(WC_Order $order): array|WP_Error
    {
        $noteModel = absint(get_option('aerion_sankhya_note_model', 0));
        if (! $noteModel) {
            return self::config('Configure o modelo de nota do Sankhya em WooCommerce → Configurações → Avançado → Aerion Sankhya.');
        }
        $partnerCode = absint($order->get_meta('_aerion_sankhya_partner_code'));
        $partnerDocument = self::digits((string) $order->get_meta('_aerion_sankhya_partner_document'));
        if (! $partnerCode && $partnerDocument === '') {
            return new WP_Error('sankhya_customer_missing', 'Pedido sem cliente Sankhya vinculado.');
        }

        $lines = [];
        foreach ($order->get_items() as $item) {
            if (! $item instanceof WC_Order_Item_Product) {
                continue;
            }
            $code = self::product_code($item->get_product());
            if (! $code) {
                return self::config(
                    sprintf('Produto "%s" sem código Sankhya.', $item->get_name()),
                    'sankhya_product_mapping_missing'
                );
            }
            $lines[] = [
                'code'     => $code,
                'quantity' => (float) $item->get_quantity(),
                'subtotal' => (float) $item->get_subtotal(),
                'total'    => (float) $item->get_total(),
            ];
        }
        if (! $lines) {
            return self::incomplete('Pedido sem produtos.');
        }

        // O desconto do Pix do Mercado Pago entra no WooCommerce como taxa
        // negativa. O Sankhya calcula o total da nota pelos itens e pelo frete,
        // então esse desconto precisa descer para os itens; deixá-lo de fora
        // faria a nota sair maior que o valor pago.
        $feeDiscount = 0.0;
        $otherCharges = 0.0;
        foreach ($order->get_fees() as $fee) {
            $amount = (float) $fee->get_total();
            if ($amount < 0) {
                $feeDiscount += -$amount;
            } else {
                $otherCharges += $amount;
            }
        }
        $shares = self::split($feeDiscount, array_column($lines, 'total'));
        $location = absint(get_option('aerion_sankhya_stock_location', 0));

        $items = [];
        foreach ($lines as $index => $line) {
            $item = [
                'sequencia'          => $index + 1,
                'codigoProduto'      => $line['code'],
                'quantidade'         => $line['quantity'],
                'valorUnitario'      => round($line['subtotal'] / max(1.0, $line['quantity']), 6),
                'controle'           => '',
                'codigoLocalEstoque' => self::stock_location($line['code'], $line['quantity'], $location),
            ];
            $discount = round($line['subtotal'] - $line['total'] + $shares[$index], 2);
            if ($discount > 0) {
                $item['valorDesconto'] = $discount;
            }
            $items[] = $item;
        }

        $timestamp = self::order_timestamp($order);
        $note = trim(self::order_marker($order) . ($order->get_customer_note() !== '' ? ' — ' . $order->get_customer_note() : ''));
        $payload = [
            'notaModelo'    => $noteModel,
            'data'          => wp_date('d/m/Y', $timestamp),
            'hora'          => wp_date('H:i', $timestamp),
            'valorTotal'    => round((float) $order->get_total(), 2),
            'observacao'    => mb_substr($note, 0, 250),
            'itens'         => $items,
        ];
        // Código do parceiro quando conhecido; senão o CPF/CNPJ, que o ERP resolve.
        $payload += $partnerCode ? ['codigoCliente' => $partnerCode] : ['cliente' => ['cnpjCpf' => $partnerDocument]];
        $shipping = round((float) $order->get_shipping_total(), 2);
        if ($shipping > 0) {
            $payload['valorFrete'] = $shipping;
        }
        if ($otherCharges > 0) {
            $payload['valorOutros'] = round($otherCharges, 2);
        }
        $sellerCode = absint(get_option('aerion_sankhya_seller_code', 0));
        if ($sellerCode) {
            $payload['codigoVendedor'] = $sellerCode;
        }
        $companyCode = absint(getenv('AERION_SANKHYA_COMPANY_ID'));
        if ($companyCode) {
            $payload['codigoEmpresa'] = $companyCode;
        }
        $adField = self::ad_field();
        if ($adField !== '') {
            $payload[$adField] = (string) $order->get_order_number();
        }
        if ($order->is_paid()) {
            $financial = self::financial($order, $timestamp);
            if (is_wp_error($financial)) {
                return $financial;
            }
            $payload['financeiros'] = [$financial];
        }
        return $payload;
    }

    /**
     * Pagamento aprovado pelo Mercado Pago como título do pedido.
     *
     * @return array<string,mixed>|WP_Error
     */
    private static function financial(WC_Order $order, int $timestamp): array|WP_Error
    {
        $method = $order->get_payment_method();
        $option = match (true) {
            $method === 'woo-mercado-pago-pix'         => 'aerion_sankhya_payment_type_pix',
            $method === 'woo-mercado-pago-ticket'      => 'aerion_sankhya_payment_type_boleto',
            str_starts_with($method, 'woo-mercado-pago') => 'aerion_sankhya_payment_type_card',
            default                                    => '',
        };
        $type = $option !== '' ? absint(get_option($option, 0)) : 0;
        if (! $type) {
            return self::config(sprintf(
                'Configure o tipo de título Sankhya para o meio de pagamento "%s".',
                $order->get_payment_method_title() ?: $method
            ));
        }
        $date = wp_date('d/m/Y', $timestamp);
        $financial = [
            'sequencia'      => 1,
            'tipoPagamento'  => $type,
            'dataVencimento' => $date,
            'valorParcela'   => round((float) $order->get_total(), 2),
        ];
        if (get_option('aerion_sankhya_settle_paid', 'no') === 'yes') {
            $financial['dataBaixa'] = $date;
        }
        $transaction = trim($order->get_transaction_id());
        if ($transaction === '') {
            $ids = explode(',', (string) $order->get_meta('_Mercado_Pago_Payment_IDs'));
            $transaction = trim($ids[0]);
        }
        if ($transaction !== '') {
            $financial['idTransacao'] = $transaction;
        }
        return $financial;
    }

    /**
     * Divide um valor proporcionalmente aos pesos; o último absorve o arredondamento.
     *
     * @param list<float> $weights
     * @return list<float>
     */
    private static function split(float $amount, array $weights): array
    {
        $shares = array_fill(0, count($weights), 0.0);
        $base = array_sum($weights);
        if ($amount <= 0 || $base <= 0) {
            return $shares;
        }
        $remaining = round($amount, 2);
        $last = count($weights) - 1;
        foreach ($weights as $index => $weight) {
            $share = $index === $last ? $remaining : round($amount * $weight / $base, 2);
            $shares[$index] = $share;
            $remaining = round($remaining - $share, 2);
        }
        return $shares;
    }

    private static function product_code(WC_Product|false|null $product): int
    {
        if (! $product) {
            return 0;
        }
        $code = absint($product->get_meta('_aerion_sankhya_product_code'));
        if (! $code && $product->get_parent_id()) {
            $parent = wc_get_product($product->get_parent_id());
            $code = $parent ? absint($parent->get_meta('_aerion_sankhya_product_code')) : 0;
        }
        // Na filial SP o CODPROD do Sankhya é o próprio SKU da loja (ver Aerion_Inventory).
        if (! $code && ctype_digit($product->get_sku())) {
            $code = (int) $product->get_sku();
        }
        return $code;
    }

    private static function document(WC_Order $order): string
    {
        return self::digits((string) ($order->get_meta('_billing_document') ?: $order->get_meta('_aerion_document')));
    }

    private static function state_registration(WC_Order $order): string
    {
        $taxpayer = sanitize_key((string) $order->get_meta('_billing_icms_taxpayer'));
        if ($taxpayer === 'exempt') {
            return 'ISENTO';
        }
        if ($taxpayer === 'contributor') {
            return strtoupper((string) preg_replace('/[^0-9A-Za-z]/', '', (string) $order->get_meta('_billing_state_registration')));
        }
        return '';
    }

    private static function digits(string $value): string
    {
        return (string) preg_replace('/\D+/', '', $value);
    }

    private static function incomplete(string $message): WP_Error
    {
        return new WP_Error('sankhya_customer_data_incomplete', $message);
    }

    private static function config(string $message, string $code = 'sankhya_mapping_incomplete'): WP_Error
    {
        return new WP_Error($code, $message);
    }
}
