<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

final class Aerion_Product_UI
{
    public static function boot(): void
    {
        add_action('wp', [self::class, 'configure_summary']);
        add_action('woocommerce_single_product_summary', [self::class, 'campaign'], 4);
        add_action('woocommerce_single_product_summary', [self::class, 'brand_mark'], 4);
        add_action('pre_get_posts', [self::class, 'busca_por_marca']);
        add_action('woocommerce_single_product_summary', [self::class, 'product_utility'], 8);
        add_action('woocommerce_single_product_summary', [self::class, 'sku_line'], 6);
        add_action('woocommerce_single_product_summary', [self::class, 'cash_box'], 11);
        add_action('woocommerce_after_add_to_cart_button', [self::class, 'secondary_cart_button'], 8);
        add_action('woocommerce_after_add_to_cart_form', [self::class, 'secure_purchase'], 12);
        add_action('woocommerce_after_single_product_summary', [self::class, 'gallery_recommendations'], 5);
        add_action('woocommerce_after_cart_table', [self::class, 'cart_recommendations'], 20);
        add_action('wc_ajax_aerion_toggle_cart_product', [self::class, 'toggle_cart_product']);
        add_filter('woocommerce_is_purchasable', [self::class, 'product_purchasable'], 20, 2);
        add_filter('woocommerce_product_single_add_to_cart_text', [self::class, 'cart_text']);
        add_filter('woocommerce_get_availability_text', [self::class, 'availability_text'], 20, 2);
        add_filter('woocommerce_add_to_cart_redirect', [self::class, 'buy_now_redirect']);
        add_filter('woocommerce_add_to_cart_fragments', [self::class, 'cart_fragments']);
        add_filter('woocommerce_product_tabs', [self::class, 'tabs']);
        add_filter('woocommerce_product_review_comment_form_args', [self::class, 'review_form_args']);
        add_filter('allow_empty_comment', [self::class, 'allow_empty_product_review'], 10, 2);
        add_filter('the_content', [self::class, 'decorate_a_plus_content'], 30);
        add_filter('pre_comment_approved', [self::class, 'moderate_first_review'], 20, 2);
    }

    public static function configure_summary(): void
    {
        if (! function_exists('is_product') || ! is_product()) return;
        remove_action('woocommerce_after_single_product_summary', ['Aerion_Product_Content', 'render'], 12);
        remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_price', 10);
        remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_rating', 10);
        remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20);
        remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40);
        remove_action('woocommerce_review_before', 'woocommerce_review_display_gravatar', 10);
        add_action('woocommerce_after_single_product_summary', 'woocommerce_output_product_data_tabs', 10);
    }

    public static function decorate_a_plus_content(string $content): string
    {
        if (! function_exists('is_product') || ! is_product() || ! str_contains($content, 'class="aerion-product-aplus"')) return $content;
        global $product;
        if (! $product instanceof WC_Product) return $content;
        $name = strtolower(remove_accents($product->get_name()));
        $modifier = str_contains($name, 'alpha')
            ? 'aerion-product-aplus--autel-alpha'
            : (str_contains($name, 'nest') ? 'aerion-product-aplus--evo-nest' : '');
        if ($modifier === '') return $content;
        return str_replace(
            'class="aerion-product-aplus"',
            'class="aerion-product-aplus ' . $modifier . '"',
            $content
        );
    }

    public static function campaign(): void
    {
        global $product;
        if (! $product instanceof WC_Product) return;
        $campaign = Aerion_Campaigns::active_for_product($product->get_parent_id() ?: $product->get_id());
        if (! $campaign) return;
        $mini = (string) ($campaign['meta']['mini_image'] ?? '');
        if ($mini === '') $mini = get_theme_file_uri('/assets/source-images/campaigns/ofertas-de-lancamento/mini.png');
        echo '<a class="aerion-product-campaign" href="' . esc_url($campaign['url']) . '"><span class="aerion-product-campaign__mini"><img src="' . esc_url($mini) . '" alt="' . esc_attr((string) ($campaign['meta']['alt'] ?? $campaign['title'])) . '"></span>' . Aerion_Campaigns::countdown($campaign, 'large') . '</a>';
    }

    public static function cash_box(): void
    {
        global $product;
        if (! $product instanceof WC_Product) return;
        if (! self::is_immediately_available($product)) {
            self::caixa_indisponivel($product);
            return;
        }
        if (class_exists('Aerion_Presale')) echo Aerion_Presale::product_notice($product);
        self::payment_box($product);
    }

    /**
     * Caixa de indisponivel, com saida para o comercial.
     *
     * Antes era um beco: dizia "consulte nossa equipe" sem dizer como. Quem
     * chegou ate a pagina de um produto de dezenas de milhares de reais e
     * descobriu que ele acabou e o contato mais quente que a loja tem no dia —
     * mandar essa pessoa procurar o telefone sozinha e jogar fora a venda.
     *
     * A mensagem ja vai preenchida com o nome e o SKU do produto, entao quem
     * atende sabe do que se trata antes de perguntar. O numero e o mesmo do
     * atendimento no cabecalho e no rodape; ficar em `AERION_WHATSAPP_COMERCIAL`
     * deixa a troca em um lugar so no dia em que o comercial tiver linha propria.
     */
    private static function caixa_indisponivel(WC_Product $product): void
    {
        $numero = defined('AERION_WHATSAPP_COMERCIAL') ? AERION_WHATSAPP_COMERCIAL : '5511934668839';

        $sku = $product->get_sku();
        $mensagem = 'Olá! Vi que o ' . $product->get_name() . ($sku ? ' (SKU ' . $sku . ')' : '')
            . ' está indisponível no site. Quando tem reposição?';
        $link = 'https://wa.me/' . $numero . '?text=' . rawurlencode($mensagem);

        echo '<div class="aerion-stock-box aerion-stock-box--out">';
        echo '<strong>Produto indisponível</strong>';
        echo '<p>Fale com o comercial para saber da próxima reposição.</p>';
        echo '<a class="aerion-stock-box__acao" href="' . esc_url($link) . '" target="_blank" rel="noopener noreferrer">';
        echo self::icon('message') . '<span>Consultar no WhatsApp</span></a>';
        echo '</div>';
    }

    /**
     * A caixa de preco da pagina de produto.
     *
     * O `woocommerce_template_single_price` foi removido desta pagina, entao esta
     * caixa e a UNICA coisa que desenha preco aqui — e o `price_html`, que monta
     * o bloco da tabela de revenda, nunca chegava a aparecer. O parceiro via o
     * cartao de consumidor com o valor dele dentro: sem a etiqueta do nivel, sem
     * o preco publico para comparar e sem a linha de economia.
     *
     * Para o parceiro, a caixa passa a reaproveitar o proprio `price_html`. Uma
     * fonte so para os dois lugares: o que ele ve na vitrine e o que ve aqui.
     */
    private static function payment_box(WC_Product $product): void
    {
        $current = (float) $product->get_price();
        if ($current <= 0) return;

        if (class_exists('Aerion_B2B') && Aerion_B2B::is_approved()) {
            echo '<div class="aerion-payment-advantage aerion-payment-advantage--revenda">';
            echo wp_kses_post($product->get_price_html());
            // Parcelas sobre o cartão da tabela de revenda, já com o nível.
            $tradeCard = (float) Aerion_Pricing::quote($product)['card'];
            if (class_exists('Aerion_Installments') && Aerion_Installments::card_accepted($tradeCard)) {
                echo Aerion_Installments::dropdown($tradeCard);
            }
            echo '</div>';
            return;
        }

        $campaign = class_exists('Aerion_Campaigns') ? Aerion_Campaigns::active_for_product($product->get_parent_id() ?: $product->get_id()) : null;
        // Pix em destaque e o cartao logo abaixo, sem risco: com 5% de diferenca,
        // riscar o cartao parecia promocao. Riscado fica so o preco de antes da
        // campanha.
        $quote = Aerion_Pricing::quote($product, 'consumer');
        $antes = ($campaign && $quote['list_pix'] > $quote['pix'])
            ? '<del aria-label="Preço antes da oferta">' . wp_kses_post(wc_price($quote['list_pix'])) . '</del>'
            : '';
        echo '<div class="aerion-payment-advantage' . ($campaign ? ' is-campaign' : '') . '">';
        echo '<div class="aerion-payment-advantage__price">' . $antes . '<strong>' . wp_kses_post(wc_price($quote['pix'])) . '</strong></div>'
            . '<p>' . esc_html__('à vista no Pix com', 'aerion-commerce') . ' <b>' . esc_html(Aerion_Pricing::rate_label()) . '% ' . esc_html__('de desconto', 'aerion-commerce') . '</b></p>'
            . self::card_terms((float) $quote['card'])
            . '</div>';
    }

    /**
     * Linha do cartão sob o preço do Pix: parcelas do Mercado Pago, ou o aviso
     * de que o valor passa do teto do cartão e só sai no Pix.
     */
    private static function card_terms(float $card): string
    {
        if (! class_exists('Aerion_Installments')) {
            return '<small>' . sprintf(esc_html__('ou %s no cartão · parcelamento no checkout', 'aerion-commerce'), wp_kses_post(wc_price($card))) . '</small>';
        }
        // Acima do teto do cartão: só o Pix, sem texto de limite no produto.
        if (! Aerion_Installments::card_accepted($card)) {
            return '';
        }
        if (Aerion_Installments::has_plans($card)) {
            return '<small>' . Aerion_Installments::summary($card) . '</small>' . Aerion_Installments::dropdown($card);
        }
        return '<small>' . sprintf(esc_html__('ou %s no cartão · parcelamento no checkout', 'aerion-commerce'), wp_kses_post(wc_price($card))) . '</small>';
    }

    public static function cart_text(): string
    {
        return 'COMPRAR AGORA';
    }

    public static function availability_text(string $text, WC_Product $product): string
    {
        if (! self::is_immediately_available($product)) return 'Indisponível';
        return '';
    }

    public static function product_purchasable(bool $purchasable, WC_Product $product): bool
    {
        return $purchasable && self::is_immediately_available($product);
    }

    private static function is_immediately_available(WC_Product $product): bool
    {
        if ($product->get_meta('_aerion_catalog_inquiry', true) === 'yes' || ! $product->is_in_stock()) return false;
        return class_exists('Aerion_Inventory') ? Aerion_Inventory::immediately_available($product) : true;
    }

    public static function product_utility(): void
    {
        global $product;
        if (! $product instanceof WC_Product) return;
        $average = (float) $product->get_average_rating();
        $count = (int) $product->get_review_count();
        $label = $count === 1 ? '1 avaliação' : $count . ' avaliações';
        echo '<div class="aerion-product-utility"><a class="aerion-rating-summary woocommerce-review-link" href="#reviews" aria-label="' . esc_attr(number_format_i18n($average, 1) . ' de 5 estrelas; ' . $label) . '"><span class="aerion-rating-stars" style="--aerion-rating:' . esc_attr((string) ($average / 5 * 100)) . '%"><span>★★★★★</span></span><small>' . esc_html($label) . '</small></a><div><button type="button" data-aerion-favorite data-product-id="' . esc_attr((string) $product->get_id()) . '" aria-pressed="false">' . self::icon('heart') . '<span>Favoritar</span></button><button type="button" data-aerion-share data-share-title="' . esc_attr($product->get_name()) . '" data-share-url="' . esc_url($product->get_permalink()) . '">' . self::icon('share') . '<span>Compartilhar</span></button></div><span class="aerion-product-utility__status" data-aerion-product-status aria-live="polite"></span></div>';
    }

    /**
     * Marca do fabricante, logo acima do titulo do produto.
     *
     * A fonte e a taxonomia `product_brand`, nativa no WooCommerce 11 — nao um
     * campo proprio. Isso importa porque a marca ja alimenta filtros de catalogo,
     * feed de produtos e dados estruturados sem nenhum codigo nosso; um meta
     * campo paralelo seria invisivel para tudo isso.
     *
     * A logo vem do `thumbnail_id` do termo, entao cadastrar uma marca nova e
     * so criar o termo e anexar a imagem pelo admin — sem tocar neste arquivo.
     * Sem imagem cadastrada, cai no nome em texto, que continua util para SEO.
     */
    public static function brand_mark(): void
    {
        global $product;
        if (! $product instanceof WC_Product) return;

        $terms = get_the_terms($product->get_id(), 'product_brand');
        if (! $terms || is_wp_error($terms)) return;
        $brand = $terms[0];

        // A busca, e nao o arquivo da taxonomia: e para la que o cliente espera
        // ir ao clicar numa marca, e e a tela que ja tem filtro, ordenacao e
        // paginacao da loja. `busca_por_marca()` abaixo e o que faz esse termo
        // devolver a marca inteira em vez dos poucos produtos que trazem o nome
        // dela no titulo.
        $href = add_query_arg(
            ['s' => $brand->name, 'post_type' => 'product'],
            home_url('/')
        );

        $thumb = (int) get_term_meta($brand->term_id, 'thumbnail_id', true);
        $inner = $thumb
            ? wp_get_attachment_image($thumb, 'medium', false, [
                'class' => 'aerion-product-brand__logo',
                'alt'   => $brand->name,
                'loading' => 'eager',
            ])
            : '<span class="aerion-product-brand__nome">' . esc_html($brand->name) . '</span>';

        echo '<div class="aerion-product-brand">';
        echo $href
            ? '<a class="aerion-product-brand__link" href="' . esc_url($href) . '" aria-label="' . esc_attr('Ver todos os produtos ' . $brand->name) . '">' . $inner . '</a>'
            : $inner;
        echo '</div>';
    }

    /**
     * Buscar o nome de uma marca devolve a marca inteira.
     *
     * Sem isto, `?s=Autel Robotics` cai na busca por texto e retorna so os
     * produtos que trazem essas palavras no titulo ou na descricao — seis dos
     * trinta e cinco, no catalogo de hoje. O cliente que clica na marca quer a
     * prateleira dela, nao uma coincidencia de texto.
     *
     * A troca acontece so quando o termo digitado E uma marca cadastrada, e a
     * comparacao e por nome ou slug. Qualquer outra busca segue intacta.
     */
    public static function busca_por_marca(WP_Query $query): void
    {
        if (is_admin() || ! $query->is_main_query() || ! $query->is_search()) return;

        $termo = trim((string) $query->get('s'));
        if ($termo === '') return;

        $marca = get_term_by('name', $termo, 'product_brand') ?: get_term_by('slug', sanitize_title($termo), 'product_brand');
        if (! $marca instanceof WP_Term) return;

        $query->set('s', '');
        $query->set('post_type', 'product');
        $query->set('tax_query', [[
            'taxonomy' => 'product_brand',
            'field'    => 'term_id',
            'terms'    => $marca->term_id,
        ]]);
        // `is_search` continua true, entao o template de busca e o titulo da
        // pagina seguem valendo — e o cliente continua vendo o que procurou.
        $query->set('aerion_marca', $marca->term_id);
    }

    public static function sku_line(): void
    {
        global $product;
        if (! $product instanceof WC_Product || $product->get_sku() === '') return;
        echo '<p class="aerion-product-sku"><span>SKU:</span> ' . esc_html($product->get_sku()) . '</p>';
    }

    public static function secondary_cart_button(): void
    {
        global $product;
        if (! $product instanceof WC_Product || ! $product->is_purchasable()) return;
        $quantity = self::product_cart_quantity($product->get_id());
        echo '<button type="button" class="aerion-secondary-cart' . ($quantity ? ' is-in-cart' : '') . '" data-aerion-secondary-cart data-aerion-cart-toggle data-aerion-cart-endpoint="' . esc_url(WC_AJAX::get_endpoint('aerion_toggle_cart_product')) . '" data-aerion-cart-security="' . esc_attr(wp_create_nonce('aerion_toggle_cart_product')) . '" data-product_id="' . esc_attr((string) $product->get_id()) . '" data-product_sku="' . esc_attr($product->get_sku()) . '" data-quantity="1" aria-pressed="' . ($quantity ? 'true' : 'false') . '" aria-label="' . esc_attr($quantity ? 'Remover do carrinho' : 'Adicionar ao carrinho') . '">' . self::icon('cart') . '<span class="screen-reader-text">' . esc_html($quantity ? 'Remover do carrinho' : 'Adicionar ao carrinho') . '</span><span class="aerion-cart-quantity' . ($quantity ? '' : ' is-empty') . '" data-aerion-cart-quantity="' . esc_attr((string) $product->get_id()) . '">' . esc_html((string) $quantity) . '</span></button>';
    }

    public static function buy_now_redirect(string $url): string
    {
        return isset($_POST['aerion_buy_now']) && wc_get_checkout_url() ? wc_get_checkout_url() : $url;
    }

    public static function cart_fragments(array $fragments): array
    {
        $count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
        $fragments['.aerion-cart-count'] = '<span class="aerion-cart-count">' . esc_html((string) $count) . '</span>';
        if (WC()->cart) {
            $ids = [];
            foreach (WC()->cart->get_cart() as $item) $ids[(int) $item['product_id']] = true;
            foreach (array_keys($ids) as $productId) {
                $quantity = self::product_cart_quantity((int) $productId);
                $selector = '[data-aerion-cart-quantity="' . (int) $productId . '"]';
                $fragments[$selector] = '<span class="aerion-cart-quantity' . ($quantity ? '' : ' is-empty') . '" data-aerion-cart-quantity="' . (int) $productId . '">' . esc_html((string) $quantity) . '</span>';
            }
        }
        return $fragments;
    }

    private static function product_cart_quantity(int $productId): int
    {
        $quantity = 0;
        if (! WC()->cart) return $quantity;
        foreach (WC()->cart->get_cart() as $item) {
            if ((int) $item['product_id'] === $productId) $quantity += (int) $item['quantity'];
        }
        return $quantity;
    }

    public static function toggle_cart_product(): void
    {
        if (! check_ajax_referer('aerion_toggle_cart_product', 'security', false)) {
            wp_send_json_error(['message' => 'Sessão expirada. Atualize a página e tente novamente.'], 403);
        }
        if (! WC()->cart) wc_load_cart();
        $productId = absint($_POST['product_id'] ?? 0);
        $quantity = max(1, absint($_POST['quantity'] ?? 1));
        $product = $productId ? wc_get_product($productId) : null;
        if (! $product instanceof WC_Product || ! $product->is_purchasable()) {
            wp_send_json_error(['message' => 'Produto indisponível.'], 400);
        }
        $removed = false;
        foreach (WC()->cart->get_cart() as $cartItemKey => $item) {
            if ((int) ($item['product_id'] ?? 0) !== $productId) continue;
            WC()->cart->remove_cart_item($cartItemKey);
            $removed = true;
        }
        if (! $removed && ! WC()->cart->add_to_cart($productId, $quantity)) {
            wp_send_json_error(['message' => 'Não foi possível adicionar o produto.'], 400);
        }
        WC()->cart->calculate_totals();
        ob_start();
        woocommerce_mini_cart();
        $miniCart = ob_get_clean();
        $fragments = apply_filters('woocommerce_add_to_cart_fragments', [
            'div.widget_shopping_cart_content' => '<div class="widget_shopping_cart_content">' . $miniCart . '</div>',
        ]);
        wp_send_json([
            'fragments' => $fragments,
            'cart_hash' => WC()->cart->get_cart_hash(),
            'in_cart' => ! $removed,
            'quantity' => $removed ? 0 : $quantity,
        ]);
    }

    public static function gallery_recommendations(): void
    {
        global $product;
        if (! $product instanceof WC_Product) return;
        self::render_recommendations('Complete sua operação', self::recommendation_ids([$product->get_id()], 4), 'product');
    }

    public static function cart_recommendations(): void
    {
        if (! WC()->cart || WC()->cart->is_empty()) return;
        $productIds = array_values(array_unique(array_map(static fn ($item): int => (int) ($item['product_id'] ?? 0), WC()->cart->get_cart())));
        self::render_recommendations('Quem comprou este item também levou', self::recommendation_ids($productIds, 4), 'cart');
    }

    /** @param list<int> $sourceIds @return list<int> */
    private static function recommendation_ids(array $sourceIds, int $limit): array
    {
        $excluded = array_fill_keys(array_filter($sourceIds), true);
        $familyIds = [];
        $explicit = [];
        $sourceCategories = [];
        foreach ($sourceIds as $sourceId) {
            $source = wc_get_product($sourceId);
            if (! $source instanceof WC_Product) continue;
            foreach ($source->get_cross_sell_ids() as $id) $explicit[] = (int) $id;
            $sourceTerms = wp_get_object_terms($sourceId, 'aerion_family', ['fields' => 'ids']);
            if (! is_wp_error($sourceTerms)) foreach ($sourceTerms as $termId) $familyIds[(int) $termId] = true;
            foreach (self::product_category_slugs($sourceId) as $slug) $sourceCategories[$slug] = true;
        }
        $sourceHasPrimary = (bool) array_intersect(array_keys($sourceCategories), ['drones', 'kits']);
        $candidateIds = array_merge($explicit, wc_get_products(['status' => 'publish', 'visibility' => 'visible', 'limit' => 80, 'return' => 'ids']));
        $candidateIds = array_values(array_unique(array_map('intval', $candidateIds)));
        usort($candidateIds, static function (int $left, int $right) use ($explicit, $familyIds): int {
            $score = static function (int $id) use ($explicit, $familyIds): int {
                $product = wc_get_product($id);
                if (! $product instanceof WC_Product) return 999;
                $terms = wp_get_object_terms($id, 'aerion_family', ['fields' => 'ids']);
                if (is_wp_error($terms)) $terms = [];
                $sameFamily = count(array_intersect(array_map('intval', $terms), array_keys($familyIds))) > 0;
                $categories = self::product_category_slugs($id);
                $priority = 4;
                if (in_array('baterias-e-carregadores', $categories, true)) $priority = -12;
                elseif (in_array('payloads', $categories, true)) $priority = -10;
                elseif (in_array('softwares', $categories, true)) $priority = -7;
                elseif (array_intersect($categories, ['docas', 'docks'])) $priority = -6;
                elseif (in_array('acessorios', $categories, true)) $priority = -5;
                $availability = ! $product->is_in_stock() ? 20 : ((class_exists('Aerion_Inventory') && ! Aerion_Inventory::immediately_available($product)) ? 8 : 0);
                return (in_array($id, $explicit, true) ? -50 : 0) + ($sameFamily ? -30 : 0) + $priority + $availability;
            };
            return $score($left) <=> $score($right);
        });
        $result = [];
        foreach ($candidateIds as $id) {
            if (isset($excluded[$id])) continue;
            $candidate = wc_get_product($id);
            if (! $candidate instanceof WC_Product || ! $candidate->is_visible() || ! $candidate->is_purchasable() || $candidate->get_meta('_aerion_catalog_managed', true) !== 'yes') continue;
            $categories = self::product_category_slugs($id);
            $candidateIsPrimary = (bool) array_intersect($categories, ['drones', 'kits']);
            if ($sourceHasPrimary && $candidateIsPrimary) continue;
            $candidateFamilies = wp_get_object_terms($id, 'aerion_family', ['fields' => 'ids']);
            if (is_wp_error($candidateFamilies)) $candidateFamilies = [];
            $sameFamily = (bool) array_intersect(array_map('intval', $candidateFamilies), array_keys($familyIds));
            $isUniversalSoftware = in_array('softwares', $categories, true);
            $isExplicit = in_array($id, $explicit, true);
            $isComplement = (bool) array_intersect($categories, ['acessorios', 'baterias-e-carregadores', 'payloads', 'softwares', 'docas', 'docks']);
            if (! $isComplement || (! $sameFamily && ! $isUniversalSoftware && ! $isExplicit)) continue;
            $result[] = $id;
            if (count($result) >= $limit) break;
        }
        return $result;
    }

    /** @return list<string> */
    private static function product_category_slugs(int $productId): array
    {
        $categories = wp_get_post_terms($productId, 'product_cat', ['fields' => 'slugs']);
        return is_wp_error($categories) ? [] : array_values(array_map('strval', $categories));
    }

    /** @param list<int> $productIds */
    private static function render_recommendations(string $title, array $productIds, string $context): void
    {
        if (! $productIds) return;
        echo '<section class="aerion-inline-recommendations aerion-inline-recommendations--' . esc_attr($context) . '" aria-label="' . esc_attr($title) . '"><div class="aerion-inline-recommendations__heading"><span>Compre junto</span><h2>' . esc_html($title) . '</h2></div><div class="aerion-inline-recommendations__rail"><div class="aerion-inline-recommendations__track">';
        foreach ($productIds as $id) {
            $item = wc_get_product($id);
            if (! $item instanceof WC_Product) continue;
            self::render_recommendation_card($item);
        }
        echo '</div></div></section>';
    }

    public static function review_form_args(array $args): array
    {
        $rating = '';
        if (wc_review_ratings_enabled()) {
            $rating = '<div class="comment-form-rating"><label for="rating">Sua avaliação <span class="required" aria-hidden="true">*</span></label><select name="rating" id="rating" required><option value="">Escolha de 1 a 5 estrelas</option><option value="5">Excelente — 5 estrelas</option><option value="4">Muito bom — 4 estrelas</option><option value="3">Bom — 3 estrelas</option><option value="2">Regular — 2 estrelas</option><option value="1">Ruim — 1 estrela</option></select></div>';
        }
        $args['title_reply'] = 'Avalie este produto';
        $intro = '<p class="aerion-review-form__intro">A nota em estrelas é obrigatória. Escrever um comentário é opcional.</p>';
        $args['comment_notes_before'] = '';
        $args['comment_field'] = $intro . $rating . '<p class="comment-form-comment"><label for="comment">Comentário <span>(opcional)</span></label><textarea id="comment" name="comment" cols="45" rows="5" placeholder="Conte como foi sua experiência, se quiser."></textarea></p>';
        $args['label_submit'] = 'Enviar avaliação';
        return $args;
    }

    public static function allow_empty_product_review(bool $allow, array $commentData): bool
    {
        $postId = (int) ($commentData['comment_post_ID'] ?? 0);
        if ($postId <= 0 || get_post_type($postId) !== 'product') return $allow;
        $rating = isset($_POST['rating']) ? (int) wp_unslash($_POST['rating']) : 0;
        return $rating >= 1 && $rating <= 5 ? true : $allow;
    }

    private static function render_recommendation_card(WC_Product $item): void
    {
        $id = $item->get_id();
        $quantity = self::product_cart_quantity($id);
        $available = self::is_immediately_available($item);
        $status = $available ? '' : 'Indisponível';
        $categories = self::product_category_slugs($id);
        $isPrimary = (bool) array_intersect($categories, ['drones', 'kits']);
        $campaign = $available && class_exists('Aerion_Campaigns') ? Aerion_Campaigns::active_for_product($id) : null;
        echo '<article class="aerion-inline-product' . ($available ? '' : ' is-unavailable') . ($campaign ? ' is-campaign' : '') . '" data-product-primary="' . ($isPrimary ? 'yes' : 'no') . '">';
        echo '<a class="aerion-inline-product__image" href="' . esc_url($item->get_permalink()) . '">' . $item->get_image('woocommerce_thumbnail', ['loading' => 'lazy']) . (class_exists('Aerion_Presale') ? Aerion_Presale::chip($item, true) : '') . '</a>';
        echo '<a class="aerion-inline-product__name" href="' . esc_url($item->get_permalink()) . '">' . esc_html($item->get_name()) . '</a>';
        // Mesma leitura do card grande da vitrine, em escala menor: a nota sob o
        // titulo e o que faz o mini-card parecer um produto, e nao um item de lista.
        $rating = (float) $item->get_average_rating();
        $ratingCount = (int) $item->get_review_count();
        echo '<div class="aerion-card-rating" aria-label="' . esc_attr(number_format_i18n($rating, 1) . ' de 5 estrelas; ' . $ratingCount . ' avaliações') . '"><span class="aerion-rating-stars" style="--aerion-rating:' . esc_attr((string) ($rating / 5 * 100)) . '%"><span>★★★★★</span></span><small>(' . esc_html((string) $ratingCount) . ')</small></div>';
        if ($status !== '') echo '<span class="aerion-inline-product__status">' . esc_html($status) . '</span>';
        $priceHtml = $item->get_price_html();
        echo '<div class="aerion-inline-product__bottom"><span class="aerion-inline-product__price">' . ($priceHtml !== '' ? wp_kses_post($priceHtml) : esc_html__('Consulte', 'aerion-commerce')) . '</span>';
        if ($available && $item->is_purchasable()) {
            echo '<button type="button" class="aerion-inline-product__cart' . ($quantity ? ' is-in-cart' : '') . '" data-aerion-cart-toggle data-aerion-cart-endpoint="' . esc_url(WC_AJAX::get_endpoint('aerion_toggle_cart_product')) . '" data-aerion-cart-security="' . esc_attr(wp_create_nonce('aerion_toggle_cart_product')) . '" data-product_id="' . esc_attr((string) $id) . '" data-product_sku="' . esc_attr($item->get_sku()) . '" data-quantity="1" aria-pressed="' . ($quantity ? 'true' : 'false') . '" aria-label="' . esc_attr($quantity ? 'Remover do carrinho' : 'Adicionar ao carrinho') . '"><span class="aerion-cart-toggle-label">' . esc_html($quantity ? 'Remover do carrinho' : 'Adicionar ao carrinho') . '</span></button>';
        }
        echo '</div></article>';
    }

    /**
     * Os tres selos de confianca abaixo do botao de compra.
     *
     * Dois deles fazem uma PROMESSA verificavel — "7 dias para devolucao" e "12
     * meses de garantia" — e ate agora nao levavam a lugar nenhum: o cliente lia
     * a condicao e nao tinha como conferir o que ela cobre. Agora cada um abre a
     * politica correspondente.
     *
     * O selo de compra segura continua sem link: ele descreve o checkout, nao uma
     * condicao contratual, e nao ha documento que o detalhe.
     */
    public static function secure_purchase(): void
    {
        $item = static function (string $icone, string $titulo, string $legenda, string $url = ''): string {
            $miolo = '<span><strong>' . $titulo . '</strong><small>' . $legenda . '</small></span>';
            $conteudo = self::icon($icone) . $miolo;
            return $url === ''
                ? '<div class="aerion-secure-purchase__item">' . $conteudo . '</div>'
                : '<a class="aerion-secure-purchase__item" href="' . esc_url($url) . '">' . $conteudo . '</a>';
        };

        echo '<div class="aerion-secure-purchase">';
        echo $item('shield', 'Compra segura', 'Dados protegidos em todas as etapas.');
        echo $item('return', '7 dias para devolução', 'Veja as condições.', home_url('/trocas-devolucoes/'));
        echo $item('badge', '12 meses de garantia', 'Baterias: 6 meses. Saiba mais.', home_url('/garantia/'));
        echo '</div>';
    }

    public static function tabs(array $tabs): array
    {
        unset($tabs['additional_information']);
        $tabs['aerion_specifications'] = ['title' => 'Ficha técnica', 'priority' => 20, 'callback' => [self::class, 'specifications_tab']];
        $tabs['aerion_contents'] = ['title' => 'O que acompanha', 'priority' => 25, 'callback' => static function (): void {
            global $product;
            $bom = $product instanceof WC_Product ? $product->get_meta('_aerion_bom', true) : [];
            echo '<div class="aerion-tab-content aerion-product-plain"><section><h2>Conteúdo da embalagem</h2><p>Itens incluídos nesta configuração.</p>';
            if (! is_array($bom) || ! $bom) {
                $contents = $product instanceof WC_Product ? json_decode((string) $product->get_meta('_aerion_package_contents', true), true) : [];
                if (is_array($contents) && $contents) {
                    echo '<ul class="aerion-readable-bom">';
                    foreach ($contents as $item) echo '<li><strong>' . esc_html('1 × ' . (string) $item) . '</strong></li>';
                    echo '</ul></section></div>';
                } else {
                    echo '<p>Conteúdo da embalagem conforme a configuração selecionada.</p></section></div>';
                }
                return;
            }
            echo '<ul class="aerion-readable-bom">';
            foreach ($bom as $component) {
                $sku = sanitize_text_field((string) ($component['sku'] ?? ''));
                $quantity = max(1, absint($component['qty'] ?? 1));
                $componentId = $sku !== '' ? wc_get_product_id_by_sku($sku) : 0;
                $componentProduct = $componentId ? wc_get_product($componentId) : null;
                $name = $componentProduct instanceof WC_Product ? $componentProduct->get_name() : 'Item do kit';
                echo '<li><strong>' . esc_html($quantity . ' × ' . $name) . '</strong>' . ($sku !== '' ? '<small>Ref. ' . esc_html($sku) . '</small>' : '') . '</li>';
            }
            echo '</ul></section></div>';
        }];
        $tabs['aerion_support'] = ['title' => 'Garantia e suporte', 'priority' => 35, 'callback' => static fn () => print('<div class="aerion-tab-content aerion-product-plain"><section><h2>Operação oficial no Brasil</h2><p>Produto Autel com procedência oficial, garantia nacional de 1 ano e suporte técnico especializado da Aerion. Nossa equipe orienta configuração, compatibilidade, treinamento e pós-venda.</p><ul><li>Atendimento técnico em português</li><li>Orientação de compatibilidade antes da compra</li><li>Garantia nacional de 1 ano</li></ul></section></div>')];
        if (isset($tabs['reviews'])) {
            global $product;
            $tabs['reviews']['title'] = 'Avaliações (' . (int) ($product instanceof WC_Product ? $product->get_review_count() : 0) . ')';
            $tabs['reviews']['priority'] = 40;
        }
        return $tabs;
    }

    public static function specifications_tab(): void
    {
        global $product;
        if (! $product instanceof WC_Product) return;
        $groups = [];
        $signatures = [];
        self::append_specification_groups($groups, $signatures, self::decode_array_meta($product, '_aerion_specifications'), 'Especificações técnicas');
        self::append_specification_groups($groups, $signatures, self::decode_array_meta($product, '_aerion_technical_data'), 'Dados técnicos');
        self::append_specification_groups($groups, $signatures, self::decode_array_meta($product, '_aerion_variant_specs'), $product->get_name());
        if ($product instanceof WC_Product_Variable) {
            foreach ($product->get_children() as $variationId) {
                $variation = wc_get_product($variationId);
                if (! $variation instanceof WC_Product) continue;
                self::append_specification_groups($groups, $signatures, self::decode_array_meta($variation, '_aerion_variant_specs'), $variation->get_name());
            }
        }
        $compatibility = self::decode_array_meta($product, '_aerion_compatibility');
        echo '<div class="aerion-tab-content aerion-product-plain"><section><h2>Ficha técnica</h2>';
        if ($groups) {
            foreach ($groups as $title => $rows) self::render_specification_group((string) $title, $rows);
        } else {
            echo '<p>Consulte nossa equipe para confirmar os dados técnicos desta configuração.</p>';
        }
        $brochureId = absint($product->get_meta('_aerion_brochure_attachment_id', true));
        $brochureUrl = $brochureId ? wp_get_attachment_url($brochureId) : false;
        if ($brochureUrl) echo '<p><a class="aerion-button aerion-button--outline" href="' . esc_url($brochureUrl) . '" target="_blank" rel="noopener">Baixar catálogo técnico</a></p>';
        echo '</section>';
        if (is_array($compatibility) && $compatibility) {
            echo '<section><h2>Compatibilidade</h2><ul>';
            foreach ($compatibility as $item) echo '<li>' . esc_html((string) $item) . '</li>';
            echo '</ul></section>';
        }
        echo '</div>';
    }

    private static function decode_array_meta(WC_Product $product, string $key): array
    {
        $value = $product->get_meta($key, true);
        if (is_array($value)) return $value;
        $decoded = json_decode((string) $value, true);
        return is_array($decoded) ? $decoded : [];
    }

    private static function append_specification_groups(array &$groups, array &$signatures, array $data, string $fallbackTitle): void
    {
        if (! $data) return;
        $nested = false;
        foreach ($data as $value) if (is_array($value)) { $nested = true; break; }
        $candidates = $nested ? $data : [$fallbackTitle => $data];
        foreach ($candidates as $title => $rows) {
            if (! is_array($rows) || ! $rows) continue;
            $signature = md5((string) wp_json_encode($rows));
            if (isset($signatures[$signature])) continue;
            $signatures[$signature] = true;
            $label = is_string($title) && ! ctype_digit($title) ? self::humanize_specification_label($title) : $fallbackTitle;
            $groups[$label] = isset($groups[$label]) ? array_merge($groups[$label], $rows) : $rows;
        }
    }

    private static function render_specification_group(string $title, array $values): void
    {
        $rows = [];
        self::flatten_specifications($values, $rows);
        if (! $rows) return;
        echo '<div class="aerion-specification-group"><h3>' . esc_html($title) . '</h3><div class="aerion-specification-table">';
        foreach ($rows as [$label, $value]) {
            echo '<div class="aerion-specification-row">' . ($label !== '' ? '<strong>' . esc_html($label) . '</strong>' : '') . '<span>' . esc_html($value) . '</span></div>';
        }
        echo '</div></div>';
    }

    private static function flatten_specifications(array $values, array &$rows, string $prefix = ''): void
    {
        foreach ($values as $key => $value) {
            $label = is_string($key) && ! ctype_digit($key) ? self::humanize_specification_label($key) : '';
            $compound = trim($prefix . ($prefix !== '' && $label !== '' ? ' — ' : '') . $label);
            if (is_array($value)) {
                $allScalar = ! array_filter($value, 'is_array');
                if ($allScalar && array_is_list($value)) {
                    $rows[] = [$compound, implode(', ', array_map('strval', $value))];
                } else {
                    self::flatten_specifications($value, $rows, $compound);
                }
                continue;
            }
            $text = trim((string) $value);
            if ($compound === '' && str_contains($text, ':')) [$compound, $text] = array_map('trim', explode(':', $text, 2));
            if ($text !== '') $rows[] = [$compound, $text];
        }
    }

    private static function humanize_specification_label(string $label): string
    {
        return mb_convert_case(str_replace(['_', '-'], ' ', trim($label)), MB_CASE_TITLE, 'UTF-8');
    }

    public static function review_photo_field(): void
    {
        if (! function_exists('is_product') || ! is_product()) return;
        wp_nonce_field('aerion_review_photos', 'aerion_review_photos_nonce');
        echo '<p class="comment-form-aerion-photos"><label for="aerion-review-photos">Fotos do produto <span>(opcional)</span></label><input id="aerion-review-photos" name="aerion_review_photos[]" type="file" accept="image/jpeg,image/png,image/webp" multiple><small>Envie até 3 fotos em JPG, PNG ou WebP, com no máximo 5 MB cada.</small></p>';
    }

    public static function validate_review_photos(array $commentData): array
    {
        if (get_post_type((int) ($commentData['comment_post_ID'] ?? 0)) !== 'product' || empty($_FILES['aerion_review_photos']['name'])) return $commentData;
        $nonce = sanitize_text_field(wp_unslash($_POST['aerion_review_photos_nonce'] ?? ''));
        if (! $nonce || ! wp_verify_nonce($nonce, 'aerion_review_photos')) wp_die(esc_html__('Não foi possível validar o envio das fotos.', 'aerion-commerce'), '', ['response' => 403]);
        $files = $_FILES['aerion_review_photos'];
        $error = self::review_photo_error($files);
        if ($error) wp_die(esc_html($error->get_error_message()), '', ['response' => 400]);
        return $commentData;
    }

    public static function review_photo_error(array $files): ?WP_Error
    {
        $names = array_values(array_filter((array) ($files['name'] ?? [])));
        if (count($names) > 3) return new WP_Error('aerion_review_photo_count', __('Envie no máximo 3 fotos.', 'aerion-commerce'));
        foreach (array_keys((array) ($files['name'] ?? [])) as $index) {
            if ((int) ($files['error'][$index] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
            if ((int) ($files['error'][$index] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK || (int) ($files['size'][$index] ?? 0) > 5 * MB_IN_BYTES) return new WP_Error('aerion_review_photo_size', __('Cada foto deve ter no máximo 5 MB.', 'aerion-commerce'));
            $checked = wp_check_filetype_and_ext((string) ($files['tmp_name'][$index] ?? ''), sanitize_file_name((string) ($files['name'][$index] ?? '')), ['jpg|jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp']);
            if (empty($checked['type'])) return new WP_Error('aerion_review_photo_type', __('Use apenas imagens JPG, PNG ou WebP válidas.', 'aerion-commerce'));
        }
        return null;
    }

    public static function moderate_first_review(int|string $approved, array $commentData): int|string
    {
        if (($commentData['comment_type'] ?? '') !== 'review' || get_post_type((int) ($commentData['comment_post_ID'] ?? 0)) !== 'product') return $approved;
        $userId = get_current_user_id();
        if (! $userId) return 0;
        $approvedReviews = get_comments(['user_id' => $userId, 'type' => 'review', 'status' => 'approve', 'count' => true]);
        return (int) $approvedReviews > 0 ? $approved : 0;
    }

    public static function save_review_photos(int $commentId): void
    {
        $comment = get_comment($commentId);
        if (! $comment || get_post_type((int) $comment->comment_post_ID) !== 'product' || empty($_FILES['aerion_review_photos']['name'])) return;
        $files = $_FILES['aerion_review_photos'];
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        $ids = [];
        foreach (array_slice(array_keys((array) $files['name']), 0, 3) as $index) {
            if ((int) ($files['error'][$index] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) continue;
            $file = ['name' => sanitize_file_name((string) $files['name'][$index]), 'type' => (string) $files['type'][$index], 'tmp_name' => (string) $files['tmp_name'][$index], 'error' => (int) $files['error'][$index], 'size' => (int) $files['size'][$index]];
            $upload = wp_handle_upload($file, ['test_form' => false, 'mimes' => ['jpg|jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp']]);
            if (isset($upload['error'])) continue;
            $attachmentId = wp_insert_attachment(['post_mime_type' => $upload['type'], 'post_title' => sanitize_text_field(pathinfo($file['name'], PATHINFO_FILENAME)), 'post_status' => 'inherit'], $upload['file'], (int) $comment->comment_post_ID);
            if (is_wp_error($attachmentId)) continue;
            wp_update_attachment_metadata($attachmentId, wp_generate_attachment_metadata($attachmentId, $upload['file']));
            $ids[] = (int) $attachmentId;
        }
        if ($ids) update_comment_meta($commentId, '_aerion_review_photos', $ids);
    }

    public static function review_photos(string $text, $comment, array $args): string
    {
        if (is_admin() || ! $comment instanceof WP_Comment || get_post_type((int) $comment->comment_post_ID) !== 'product') return $text;
        $ids = get_comment_meta($comment->comment_ID, '_aerion_review_photos', true);
        if (! is_array($ids) || ! $ids) return $text;
        $gallery = '<div class="aerion-review-photos" aria-label="Fotos da avaliação">';
        foreach ($ids as $id) $gallery .= wp_get_attachment_image((int) $id, 'thumbnail', false, ['loading' => 'lazy']);
        return $text . $gallery . '</div>';
    }

    private static function icon(string $name): string
    {
        $paths = [
            'heart' => '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>',
            'share' => '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
            'lock' => '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
            'cart' => '<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6"/>',
            'shield' => '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
            'return' => '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
            'message' => '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.9L3 20.5l1.6-4.9A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z"/>',
            'badge' => '<path d="M12 2l2.1 2.2 3-.2.8 2.9 2.6 1.5-1.2 2.8 1.2 2.8-2.6 1.5-.8 2.9-3-.2L12 22l-2.1-3.8-3 .2-.8-2.9L3.5 14l1.2-2.8-1.2-2.8 2.6-1.5.8-2.9 3 .2z"/><path d="m9 12 2 2 4-4"/>',
        ];
        return '<svg class="aerion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . ($paths[$name] ?? $paths['lock']) . '</svg>';
    }
}
