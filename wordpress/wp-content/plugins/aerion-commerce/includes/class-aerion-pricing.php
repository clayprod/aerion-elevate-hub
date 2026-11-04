<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

final class Aerion_Pricing
{
    /** Versão da regra de preço. Entra no hash das variações para descartar cache antigo. */
    public const RULES_VERSION = 'pix5-1';

    /** Desconto do Pix antes da migração (`Aerion_Pricing_Migration`). */
    private const LEGACY_RATE = 15.0;

    private static bool $quoting = false;

    private static ?float $rate = null;

    public static function boot(): void
    {
        add_action('woocommerce_product_options_pricing', [self::class, 'simple_field']);
        add_action('woocommerce_process_product_meta', [self::class, 'save_simple_field']);
        add_action('woocommerce_variation_options_pricing', [self::class, 'variation_field'], 10, 3);
        add_action('woocommerce_save_product_variation', [self::class, 'save_variation_field'], 10, 2);
        add_action('woocommerce_admin_process_product_object', [self::class, 'normalize_saved_prices']);
        add_action('woocommerce_admin_process_variation_object', [self::class, 'normalize_saved_prices']);

        foreach (['woocommerce_product_get_price', 'woocommerce_product_variation_get_price'] as $filter) {
            add_filter($filter, [self::class, 'customer_price'], 20, 2);
        }
        add_filter('woocommerce_variation_prices_price', [self::class, 'variation_price'], 20, 3);
        add_filter('woocommerce_get_variation_prices_hash', [self::class, 'variation_hash'], 20, 3);
        add_filter('woocommerce_get_price_html', [self::class, 'price_html'], 30, 2);
        add_filter('woocommerce_get_price_html', [self::class, 'cash_price_html'], 50, 2);
        add_action('woocommerce_checkout_create_order_line_item', [self::class, 'stamp_line_item'], 20, 4);
    }

    /* ------------------------------------------------------- regra do preço */

    /**
     * Preço no Pix e preço no cartão.
     *
     * O cadastro guarda o preço NO CARTÃO. O Pix sai dele com o desconto do
     * Pix/boleto e termina sempre em ,99, arredondado para baixo; o cartão
     * exibido é esse Pix dividido de volta, com centavos exatos. Como
     * round(cartão × (1 − taxa)) devolve exatamente o Pix, a regra é idempotente
     * e o desconto lançado no carrinho reproduz o ,99 da vitrine.
     *
     * Antes da migração a loja segue a regra antiga (15%, sem ,99). Assim o
     * código pode ir para o ar sem mudar preço nenhum até
     * `wp aerion-store pricing migrate-pix5` rodar.
     */
    public static function migrated(): bool
    {
        return (bool) get_option(Aerion_Pricing_Migration::FLAG);
    }

    /** Desconto do Pix e do boleto, em pontos percentuais. */
    public static function pix_rate(): float
    {
        if (self::$rate !== null) {
            return self::$rate;
        }
        if (! self::migrated()) {
            return self::$rate = self::LEGACY_RATE;
        }
        $rate = (float) get_option('aerion_pix_discount_percent', 5);
        return self::$rate = ($rate >= 0 && $rate < 50) ? $rate : 5.0;
    }

    /** Descarta a taxa guardada na requisição (migração, testes, troca de opção). */
    public static function reset(): void
    {
        self::$rate = null;
    }

    /** "5" ou "7,5", para os textos. */
    public static function rate_label(): string
    {
        $rate = self::pix_rate();
        return $rate == (int) $rate ? (string) (int) $rate : number_format_i18n($rate, 1);
    }

    /** Maior valor ≤ $value terminado em ,99. Abaixo de R$ 1 fica como está. */
    public static function floor99(float $value): float
    {
        $cents = (int) round($value * 100);
        if ($cents < 100) {
            return $cents / 100;
        }
        return (intdiv($cents + 1, 100) * 100 - 1) / 100;
    }

    /** Preço no Pix de um preço no cartão. A conta é em centavos inteiros. */
    public static function pix_price(float $card): float
    {
        if ($card <= 0) {
            return 0.0;
        }
        $pix = round((int) round($card * 100) * (100 - self::pix_rate()) / 100) / 100;
        return self::migrated() ? self::floor99($pix) : $pix;
    }

    /** Preço no cartão que, com o desconto do Pix, dá exatamente $pix. */
    public static function card_price(float $pix): float
    {
        $factor = 100 - self::pix_rate();
        if ($factor <= 0) {
            return $pix;
        }
        return round((int) round($pix * 100) * 100 / $factor) / 100;
    }

    /** Cartão cujo Pix termina em ,99. Antes da migração devolve o valor como veio. */
    public static function normalize_card(float $card): float
    {
        if (! self::migrated() || $card <= 0) {
            return $card;
        }
        return self::card_price(self::pix_price($card));
    }

    /**
     * Todos os preços de um produto para um público: o motor único que vitrine,
     * página de produto, carrinho e feed usam.
     *
     * Ordem: preço público (ou tabela de revenda menos o desconto do nível),
     * depois a campanha, depois o ,99. Nessa ordem o ,99 acontece uma vez só —
     * normalizar também a tabela de revenda no cadastro deixaria Silver e Gold
     * R$ 1,00 abaixo do preço combinado.
     *
     * A economia compara cartão com cartão: é o benefício da tabela de revenda,
     * sem misturar a condição de pagamento.
     *
     * @return array{card:float,pix:float,list_card:float,list_pix:float,public_card:float,tier:string,table:string,campaign:?array,saving_pct:int}
     */
    public static function quote(WC_Product $product, ?string $audience = null, ?int $userId = null): array
    {
        $userId ??= get_current_user_id();
        $audience ??= ($userId > 0 && Aerion_B2B::is_approved($userId)) ? 'trade' : 'consumer';
        $public = (float) $product->get_price('edit');
        $base = $public;
        $table = 'publico';
        $tier = Aerion_Tiers::NENHUM;
        if ($audience === 'trade') {
            $trade = self::trade_price($product);
            if ($trade !== '') {
                $base = Aerion_Tiers::aplicar((float) $trade, $public, $userId ?: null);
                $table = 'revenda';
                $tier = Aerion_Tiers::do_usuario($userId ?: null);
            }
        }
        $campaign = Aerion_Campaigns::active_for_product($product->get_parent_id() ?: $product->get_id(), $audience);
        $card = self::normalize_card($campaign ? Aerion_Campaigns::price((float) $base, $product, $audience) : (float) $base);
        $listCard = self::normalize_card((float) $base);
        $publicCard = self::normalize_card($public);

        return [
            'card'        => $card,
            'pix'         => self::pix_price($card),
            'list_card'   => $listCard,
            'list_pix'    => self::pix_price($listCard),
            'public_card' => $publicCard,
            'tier'        => $tier,
            'table'       => $table,
            'campaign'    => $campaign,
            'saving_pct'  => ($table === 'revenda' && $publicCard > 0 && $card < $publicCard)
                ? (int) round((1 - $card / $publicCard) * 100)
                : 0,
        ];
    }

    /* --------------------------------------------------------------- admin */

    public static function simple_field(): void
    {
        woocommerce_wp_text_input([
            'id'          => '_aerion_trade_price',
            'label'       => __('Preço de revenda (R$)', 'aerion-commerce'),
            'description' => __('Preço no cartão da tabela de revenda. Visível e aplicável somente a clientes PJ aprovados.', 'aerion-commerce'),
            'desc_tip'    => true,
            'data_type'   => 'price',
        ]);
    }

    public static function save_simple_field(int $postId): void
    {
        self::save_price_meta($postId, wp_unslash($_POST['_aerion_trade_price'] ?? ''));
    }

    public static function variation_field(int $loop, array $variationData, WP_Post $variation): void
    {
        woocommerce_wp_text_input([
            'id'            => "_aerion_trade_price_{$loop}",
            'name'          => "_aerion_trade_price[{$loop}]",
            'value'         => get_post_meta($variation->ID, '_aerion_trade_price', true),
            'label'         => __('Preço de revenda (R$)', 'aerion-commerce'),
            'wrapper_class' => 'form-row form-row-full',
            'data_type'     => 'price',
        ]);
    }

    public static function save_variation_field(int $variationId, int $loop): void
    {
        $values = wp_unslash($_POST['_aerion_trade_price'] ?? []);
        self::save_price_meta($variationId, is_array($values) ? ($values[$loop] ?? '') : '');
    }

    /**
     * Preço público digitado no admin vira um preço de cartão cujo Pix termina
     * em ,99. A tabela de revenda fica como foi digitada: o ,99 dela sai no
     * cálculo, depois do nível.
     */
    public static function normalize_saved_prices(WC_Product $product): void
    {
        if (! self::migrated()) {
            return;
        }
        $regular = (float) $product->get_regular_price('edit');
        if ($regular > 0) {
            $product->set_regular_price(wc_format_decimal(self::normalize_card($regular), 2));
        }
        $sale = (float) $product->get_sale_price('edit');
        if ($sale > 0) {
            $product->set_sale_price(wc_format_decimal(self::normalize_card($sale), 2));
        }
        $product->update_meta_data('_aerion_price_basis', Aerion_Pricing_Migration::BASIS);
    }

    /* ------------------------------------------------------------- filtros */

    public static function customer_price(string|float $price, WC_Product $product): string|float
    {
        if (self::$quoting || $price === '' || (float) $price <= 0) {
            return $price;
        }
        self::$quoting = true;
        try {
            $card = self::quote($product)['card'];
        } finally {
            self::$quoting = false;
        }
        return wc_format_decimal($card);
    }

    public static function variation_price(string|float $price, WC_Product_Variation $variation, WC_Product_Variable $parent): string|float
    {
        return self::customer_price($price, $variation);
    }

    public static function variation_hash(array $hash, WC_Product $product, bool $forDisplay): array
    {
        $hash['aerion_price_table'] = Aerion_B2B::is_approved() ? 'revenda' : 'publico';
        // Sem o nivel no hash, o preco de um Gold sairia do cache montado
        // para um Silver — a variacao guarda preco por hash, nao por usuario.
        $hash['aerion_tier'] = Aerion_Tiers::do_usuario();
        $hash['aerion_user'] = get_current_user_id();
        $campaign = Aerion_Campaigns::active_for_product($product->get_id());
        $hash['aerion_campaign'] = $campaign ? $campaign['id'] . ':' . $campaign['meta']['end'] : 'none';
        $hash['aerion_price_rules'] = self::RULES_VERSION . ':' . (self::migrated() ? '1' : '0') . ':' . self::pix_rate();
        return $hash;
    }

    /**
     * Pilula de oferta da campanha ativa.
     *
     * Mostra o desconto DA CAMPANHA. Calcular a diferenca entre o preco final e
     * o publico somaria tabela de revenda e desconto de nivel — um parceiro Gold
     * veria "48% OFF" numa campanha de 15%, e o numero nao corresponderia a
     * oferta anunciada em lugar nenhum.
     *
     * Fica ao lado da pilula de tabela, e sempre a direita dela: a tabela diz
     * QUEM o cliente e, a oferta diz o que esta acontecendo agora. A ordem
     * separa o permanente do temporario.
     */
    private static function selo_oferta(WC_Product $product): string
    {
        $campanha = Aerion_Campaigns::active_for_product($product->get_parent_id() ?: $product->get_id());
        if (! $campanha) {
            return '';
        }
        $percentual = (float) ($campanha['meta']['percentage'] ?? 0);
        if (($campanha['meta']['type'] ?? '') !== 'percentage' || $percentual <= 0) {
            return '';
        }
        $texto = ($percentual == (int) $percentual ? (string) (int) $percentual : number_format_i18n($percentual, 1)) . '% OFF';

        return '<span class="aerion-trade-price__tag aerion-trade-price__tag--oferta">' . esc_html($texto) . '</span>';
    }

    /**
     * Bloco de preço do parceiro aprovado, com ou sem nível.
     *
     * O número em destaque é o Pix, que é o que ele paga escolhendo Pix; logo
     * abaixo, o cartão, que antes ele não via. O preço público riscado e a
     * economia comparam cartão com cartão: a economia é o benefício da tabela e
     * do nível, sem somar o desconto do Pix, que vale para qualquer cliente.
     */
    public static function price_html(string $html, WC_Product $product): string
    {
        $campaign = Aerion_Campaigns::active_for_product($product->get_parent_id() ?: $product->get_id());
        if (! Aerion_B2B::is_approved()) {
            return $campaign ? '<span class=aerion-campaign-price>' . $html . '</span>' : $html;
        }
        if ($product->is_type('variable') || self::trade_price($product) === '') {
            return $html;
        }
        $quote = self::quote($product);
        $pix = wc_get_price_to_display($product, ['price' => $quote['pix']]);
        $card = wc_get_price_to_display($product, ['price' => $quote['card']]);
        $public = wc_get_price_to_display($product, ['price' => $quote['public_card']]);
        // Riscado como o do consumidor: o Pix de revenda de antes da campanha. Só existe
        // em campanha, e a conta fecha com o chip (riscado menos o % da campanha = Pix).
        $before = ($quote['campaign'] && $quote['list_pix'] > $quote['pix'])
            ? wc_get_price_to_display($product, ['price' => $quote['list_pix']])
            : 0.0;

        // A etiqueta nomeia o nivel quando ha um: "Preço de revenda · Gold" diz ao
        // parceiro que o desconto extra dele ja esta no numero abaixo. A forma
        // curta existe porque no card a longa estoura a largura; qual aparece e
        // o CSS que decide.
        $tier = $quote['tier'];
        $nivel = $tier === Aerion_Tiers::NENHUM ? '' : Aerion_Tiers::rotulos()[$tier];
        $etiqueta = __('Preço de revenda', 'aerion-commerce') . ($nivel !== '' ? ' · ' . $nivel : '');
        $etiquetaCurta = __('Revenda', 'aerion-commerce') . ($nivel !== '' ? ' ' . $nivel : '');

        $out = '<span class="aerion-trade-price aerion-trade-price--' . esc_attr($tier) . '">'
            . '<span class="aerion-trade-price__tags">'
            . '<span class="aerion-trade-price__tag">' . esc_html($etiqueta) . '</span>'
            . '<span class="aerion-trade-price__tag aerion-trade-price__tag--curto">' . esc_html($etiquetaCurta) . '</span>'
            . self::selo_oferta($product)
            . '</span>'
            . ($before > 0 ? '<del class="aerion-trade-price__before">' . wp_kses_post(wc_price($before)) . '</del>' : '')
            . '<strong class="aerion-trade-price__value">' . wp_kses_post(wc_price($pix)) . '</strong>'
            . '<span class="aerion-trade-price__avista">'
            . esc_html(sprintf(__('à vista no Pix com %s%% de desconto', 'aerion-commerce'), self::rate_label())) . '</span>'
            . '<span class="aerion-trade-price__avista-curto">' . esc_html(sprintf(__('%s%% de desconto no Pix', 'aerion-commerce'), self::rate_label())) . '</span>'
            . self::card_line($card, 'aerion-trade-price__card');

        // Rodapé do bloco: o preço público no cartão e a economia da revenda contra ele.
        // Cartão com cartão (preço público no cartão), sem misturar o Pix nem a campanha: é o benefício da tabela e
        // do nível. Só aparece quando há economia: numa campanha agressiva no preço
        // público a tabela de revenda pode empatar, e "economia de 0%" seria pior que
        // nada. No card a linha do preço público some e fica só o percentual.
        $out .= '<span class="aerion-trade-price__compare">'
            . '<span class="aerion-trade-price__public">' . esc_html__('Preço público', 'aerion-commerce')
            . ' <del>' . wp_kses_post(wc_price($public)) . '</del></span>';
        if ($quote['saving_pct'] > 0) {
            $out .= '<span class="aerion-trade-price__save">'
                . esc_html(sprintf(__('Economia de %d%%', 'aerion-commerce'), $quote['saving_pct']))
                . '</span>'
                . '<span class="aerion-trade-price__save-curto">'
                . esc_html(sprintf(__('Economia de %d%%', 'aerion-commerce'), $quote['saving_pct']))
                . '</span>';
        }
        $out .= '</span>';

        return $out . '</span>';
    }

    /**
     * O cartão "no Pix", para o cliente final.
     *
     * Roda na prioridade 50, DEPOIS do `price_html` da revenda (30), e devolve um
     * bloco proprio. Para o parceiro aprovado sai sem mexer: o bloco da revenda
     * ja mostra o que interessa a ele, e com a base certa.
     *
     * Com o Pix a 5%, o preço no cartão deixou de aparecer riscado — a diferença
     * pequena parecia promoção. Riscado fica só o preço de antes da campanha.
     */
    public static function cash_price_html(string $html, WC_Product $product): string
    {
        if (Aerion_B2B::is_approved() || $product->is_type('variable')) {
            return $html;
        }
        $listing = is_shop() || is_product_category() || is_tax('aerion_family') || is_singular('aerion_campaign') || is_cart();
        if (! $listing && ! is_product()) {
            return $html;
        }
        $quote = self::quote($product, 'consumer');
        if ($quote['card'] <= 0) {
            return $html;
        }
        $pix = wc_get_price_to_display($product, ['price' => $quote['pix']]);
        $card = wc_get_price_to_display($product, ['price' => $quote['card']]);
        $before = ($quote['campaign'] && $quote['list_pix'] > $quote['pix'])
            ? wc_get_price_to_display($product, ['price' => $quote['list_pix']])
            : 0.0;
        // O consumidor nao tem pilula de tabela, entao a de oferta vem sozinha —
        // no mesmo lugar em que o parceiro a ve, ao lado do preco.
        $selo = self::selo_oferta($product);

        return '<span class="aerion-card-price">'
            . ($selo !== '' ? '<span class="aerion-trade-price__tags">' . $selo . '</span>' : '')
            . ($before > 0 ? '<del>' . wp_kses_post(wc_price($before)) . '</del>' : '')
            . '<strong>' . wp_kses_post(wc_price($pix)) . '</strong>'
            . '<small>' . esc_html(sprintf(__('%s%% de desconto no Pix', 'aerion-commerce'), self::rate_label())) . '</small>'
            . self::card_line($card, 'aerion-card-price__card')
            . '</span>';
    }

    /**
     * "ou até 12x de R$ Y no cartão · R$ X à vista", ou, sem plano do Mercado
     * Pago para o valor, "ou R$ X no cartão · parcelamento no checkout". A nota
     * some no card, pelo CSS.
     */
    private static function card_line(float $card, string $class): string
    {
        // Acima do teto do Mercado Pago o cartão é recusado: a vitrine fica só
        // com o Pix, sem anunciar o limite. Quem explica é o aviso do checkout.
        // A linha fica, vazia e com a mesma altura: sem ela o card encolhe e a
        // fileira da vitrine desalinha.
        if (class_exists('Aerion_Installments') && ! Aerion_Installments::card_accepted($card)) {
            return '<span class="' . esc_attr($class) . ' is-empty" aria-hidden="true">&nbsp;</span>';
        }
        $parcelado = class_exists('Aerion_Installments') && Aerion_Installments::has_plans($card);
        $line = $parcelado
            ? Aerion_Installments::summary($card)
            : sprintf(esc_html__('ou %s no cartão', 'aerion-commerce'), wp_kses_post(wc_price($card)));
        $note = $parcelado
            ? sprintf(esc_html__('%s à vista no cartão', 'aerion-commerce'), wp_kses_post(wc_price($card)))
            : esc_html__('parcelamento no checkout', 'aerion-commerce');
        return '<span class="' . esc_attr($class) . '">' . $line
            . '<span class="' . esc_attr($class) . '-note"> · ' . $note . '</span>'
            . '</span>';
    }

    public static function stamp_line_item(WC_Order_Item_Product $item, string $cartItemKey, array $values, WC_Order $order): void
    {
        $item->add_meta_data('_aerion_price_table', Aerion_B2B::is_approved($order->get_customer_id()) ? 'revenda' : 'publico', true);
        $item->add_meta_data('_aerion_unit_price', wc_format_decimal((string) $item->get_total() / max(1, $item->get_quantity())), true);
        $product = $item->get_product();
        if ($product) {
            $campaign = Aerion_Campaigns::active_for_product($product->get_parent_id() ?: $product->get_id(), Aerion_B2B::is_approved($order->get_customer_id()) ? 'trade' : 'consumer');
            if ($campaign) {
                $item->add_meta_data('_aerion_campaign_id', $campaign['id'], true);
                $item->add_meta_data('_aerion_campaign_title', $campaign['title'], true);
            }
        }
    }

    private static function save_price_meta(int $postId, mixed $raw): void
    {
        $value = wc_format_decimal((string) $raw);
        if ($value === '') {
            delete_post_meta($postId, '_aerion_trade_price');
        } else {
            update_post_meta($postId, '_aerion_trade_price', $value);
        }
        wc_delete_product_transients($postId);
    }

    private static function trade_price(WC_Product $product): string
    {
        $trade = (string) $product->get_meta('_aerion_trade_price', true);
        if ($trade === '' && $product->is_type('variation')) {
            $trade = (string) get_post_meta($product->get_parent_id(), '_aerion_trade_price', true);
        }
        return $trade !== '' ? wc_format_decimal($trade) : '';
    }
}
