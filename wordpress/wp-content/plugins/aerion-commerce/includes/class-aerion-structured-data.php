<?php
/**
 * Campos de oferta que o Google Merchant pede no schema do produto:
 * politica de devolucao, validade inicial e detalhes de envio.
 *
 * `review` e `aggregateRating` nao sao tratados aqui: o WooCommerce ja os emite
 * sozinho para qualquer produto que tenha avaliacao aprovada, e inventar nota
 * onde nao ha avaliacao violaria a politica do Google.
 *
 * @package AerionCommerce
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

final class Aerion_Structured_Data
{
    /** Prazo maximo de postagem, em dias uteis. Valor conservador. */
    private const HANDLING_DAYS_MAX = 2;

    public static function boot(): void
    {
        add_filter('woocommerce_structured_data_product_offer', [self::class, 'enrich_offer'], 20, 2);
    }

    /**
     * @param array<string,mixed> $offer
     * @return array<string,mixed>
     */
    public static function enrich_offer(array $offer, $product): array
    {
        if (! $product instanceof WC_Product) {
            return $offer;
        }

        if (empty($offer['validFrom'])) {
            $from = $product->get_date_on_sale_from() ?: $product->get_date_created();
            if ($from) {
                $offer['validFrom'] = $from->date('c');
            }
        }

        $offer['hasMerchantReturnPolicy'] ??= self::return_policy($offer);
        $offer['shippingDetails'] ??= self::shipping_details();

        return $offer;
    }

    /**
     * Espelha a pagina /trocas-devolucoes/: arrependimento de 7 dias corridos
     * a partir do recebimento, coleta ou etiqueta por conta da Aerion e
     * reembolso integral (frete incluido) pelo mesmo meio de pagamento.
     *
     * @param array<string,mixed> $offer
     * @return array<string,mixed>
     */
    private static function return_policy(array $offer): array
    {
        // O link usa o mesmo dominio da URL da oferta: na loja, home_url() devolve o subdominio.
        $url = (string) ($offer['url'] ?? '');
        $parts = $url !== '' ? wp_parse_url($url) : [];
        $origin = isset($parts['scheme'], $parts['host']) ? $parts['scheme'] . '://' . $parts['host'] : untrailingslashit(home_url());

        return [
            '@type' => 'MerchantReturnPolicy',
            'applicableCountry' => 'BR',
            'returnPolicyCategory' => 'https://schema.org/MerchantReturnFiniteReturnWindow',
            'merchantReturnDays' => 7,
            'returnMethod' => 'https://schema.org/ReturnByMail',
            'returnFees' => 'https://schema.org/FreeReturn',
            'refundType' => 'https://schema.org/FullRefund',
            'merchantReturnLink' => $origin . '/trocas-devolucoes/',
        ];
    }

    /**
     * O frete e cotado no checkout pelo Melhor Envio, entao nao ha valor fixo
     * para declarar: informamos o destino e o prazo de postagem.
     *
     * @return array<string,mixed>
     */
    private static function shipping_details(): array
    {
        return [
            '@type' => 'OfferShippingDetails',
            'shippingDestination' => [
                '@type' => 'DefinedRegion',
                'addressCountry' => 'BR',
            ],
            'deliveryTime' => [
                '@type' => 'ShippingDeliveryTime',
                'handlingTime' => [
                    '@type' => 'QuantitativeValue',
                    'minValue' => 0,
                    'maxValue' => self::HANDLING_DAYS_MAX,
                    'unitCode' => 'DAY',
                ],
            ],
        ];
    }
}
