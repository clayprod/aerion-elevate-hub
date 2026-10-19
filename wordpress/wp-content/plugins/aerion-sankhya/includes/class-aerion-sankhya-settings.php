<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

final class Aerion_Sankhya_Settings
{
    public static function boot(): void
    {
        add_filter('woocommerce_get_sections_advanced', [self::class, 'section']);
        add_filter('woocommerce_get_settings_advanced', [self::class, 'settings'], 10, 2);
        add_action('woocommerce_product_options_inventory_product_data', [self::class, 'product_field']);
        add_action('woocommerce_process_product_meta', [self::class, 'save_product_field']);
    }

    public static function section(array $sections): array
    {
        $sections['aerion_sankhya'] = __('Aerion Sankhya', 'aerion-sankhya');
        return $sections;
    }

    public static function settings(array $settings, string $currentSection): array
    {
        if ($currentSection !== 'aerion_sankhya') {
            return $settings;
        }
        $code = static fn (string $id, string $title, string $desc): array => [
            'title'    => $title,
            'id'       => $id,
            'type'     => 'number',
            'default'  => '0',
            'desc'     => $desc,
            'autoload' => false,
        ];
        $text = static fn (string $id, string $title, string $desc): array => [
            'title'    => $title,
            'id'       => $id,
            'type'     => 'text',
            'default'  => '',
            'desc'     => $desc,
            'autoload' => false,
        ];
        $intro = sprintf(
            __('Modo atual: %1$s · ambiente: %2$s. Credenciais ficam exclusivamente em variáveis de ambiente.', 'aerion-sankhya'),
            esc_html(Aerion_Sankhya_Sync::mode()),
            esc_html(Aerion_Sankhya_Client::base_url())
        );
        $status = implode('<br>', array_map('esc_html', Aerion_Sankhya_Jobs::status_lines()));
        return [
            [
                'title' => __('Integração Sankhya', 'aerion-sankhya'),
                'type'  => 'title',
                'desc'  => $intro . '<br><br>' . $status . '<br><br>' . Aerion_Sankhya_Jobs::buttons_html(),
                'id'    => 'aerion_sankhya_options',
            ],
            $code('aerion_sankhya_note_model', __('Modelo de nota', 'aerion-sankhya'), __('Define empresa, tipo de operação (TOP) e natureza do pedido.', 'aerion-sankhya')),
            $code('aerion_sankhya_seller_code', __('Código do vendedor', 'aerion-sankhya'), __('CODVEND das vendas do site. 0 usa o do modelo.', 'aerion-sankhya')),
            $code('aerion_sankhya_stock_location', __('Local de estoque', 'aerion-sankhya'), __('CODLOCAL padrão dos itens. Com a sincronização de estoque ligada, cada item sai do local que tem saldo do produto e este valor só vale quando o saldo não é conhecido.', 'aerion-sankhya')),
            $code('aerion_sankhya_payment_type_pix', __('Tipo de título: Pix', 'aerion-sankhya'), __('CODTIPTIT do Pix do Mercado Pago.', 'aerion-sankhya')),
            $code('aerion_sankhya_payment_type_card', __('Tipo de título: cartão', 'aerion-sankhya'), __('CODTIPTIT dos demais meios do Mercado Pago (cartão, Checkout Pro).', 'aerion-sankhya')),
            $code('aerion_sankhya_payment_type_boleto', __('Tipo de título: boleto', 'aerion-sankhya'), __('CODTIPTIT do boleto do Mercado Pago.', 'aerion-sankhya')),
            [
                'title'    => __('Baixar título pago', 'aerion-sankhya'),
                'id'       => 'aerion_sankhya_settle_paid',
                'type'     => 'checkbox',
                'default'  => 'no',
                'desc'     => __('Envia o financeiro já baixado na data da aprovação do Mercado Pago. Desmarcado, o título nasce em aberto para o financeiro conciliar.', 'aerion-sankhya'),
                'autoload' => false,
            ],
            [
                'title'    => __('Buscar notas fiscais a cada (minutos)', 'aerion-sankhya'),
                'id'       => 'aerion_sankhya_invoice_interval',
                'type'     => 'number',
                'default'  => '120',
                'desc'     => __('De 10 a 1440. A busca automática roda só de segunda a sexta, das 8h às 18h. O botão "Buscar notas agora" busca na hora, a qualquer horário.', 'aerion-sankhya'),
                'autoload' => false,
                'custom_attributes' => ['min' => '10', 'max' => '1440'],
            ],
            $text('aerion_sankhya_order_ad_field', __('Campo adicional do pedido', 'aerion-sankhya'), __('Ex.: AD_WC_ORDER_ID. Recebe o número do pedido do site. Deixe vazio até o campo existir no Sankhya.', 'aerion-sankhya')),
            [
                'title'    => __('Estoque pelo Sankhya', 'aerion-sankhya'),
                'id'       => 'aerion_sankhya_stock_sync',
                'type'     => 'checkbox',
                'default'  => 'no',
                'desc'     => __('Atualiza o estoque da loja pela API, no lugar da planilha "SALDO EM ESTOQUE". Roda de hora em hora, a qualquer horário.', 'aerion-sankhya'),
                'autoload' => false,
            ],
            [
                'title'    => __('Sincronizar estoque a cada (minutos)', 'aerion-sankhya'),
                'id'       => 'aerion_sankhya_stock_interval',
                'type'     => 'number',
                'default'  => '60',
                'desc'     => __('De 10 a 1440. O botão "Sincronizar estoque agora" atualiza na hora.', 'aerion-sankhya'),
                'autoload' => false,
                'custom_attributes' => ['min' => '10', 'max' => '1440'],
            ],
            $text('aerion_sankhya_stock_companies', __('Empresas do estoque', 'aerion-sankhya'), __('Códigos separados por vírgula (ex.: 100, 102). Vazio soma todas, como a planilha.', 'aerion-sankhya')),
            $text('aerion_sankhya_stock_locations', __('Locais do estoque', 'aerion-sankhya'), __('CODLOCAL separados por vírgula. Vazio soma todos.', 'aerion-sankhya')),
            ['type' => 'sectionend', 'id' => 'aerion_sankhya_options'],
        ];
    }

    public static function product_field(): void
    {
        woocommerce_wp_text_input([
            'id'          => '_aerion_sankhya_product_code',
            'label'       => __('Código do produto no Sankhya', 'aerion-sankhya'),
            'description' => __('Vazio usa o SKU quando ele é numérico (o CODPROD da filial SP é o próprio SKU).', 'aerion-sankhya'),
            'desc_tip'    => true,
            'type'        => 'number',
        ]);
    }

    public static function save_product_field(int $productId): void
    {
        update_post_meta(
            $productId,
            '_aerion_sankhya_product_code',
            absint(wp_unslash($_POST['_aerion_sankhya_product_code'] ?? 0))
        );
    }
}
