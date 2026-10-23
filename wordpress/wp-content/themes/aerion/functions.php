<?php
/**
 * Aerion theme setup.
 *
 * @package Aerion
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('after_setup_theme', static function (): void {
    load_theme_textdomain('aerion', get_template_directory() . '/languages');
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce', [
        'thumbnail_image_width' => 560,
        'single_image_width'    => 900,
        'product_grid'          => [
            'default_rows'    => 3,
            'min_rows'        => 1,
            'default_columns' => 3,
            'min_columns'     => 1,
            'max_columns'     => 4,
        ],
    ]);
    add_theme_support('wc-product-gallery-slider');
    register_nav_menus([
        'primary' => __('Navegação principal', 'aerion'),
        'store_categories' => __('Categorias da loja', 'aerion'),
    ]);
    add_editor_style([
        'assets/css/institutional.css',
    ]);
});

add_filter('template_include',static function(string $template):string{
    if(!is_search())return$template;
    $postType=get_query_var('post_type');
    $isProductSearch=$postType==='product'||is_array($postType)&&in_array('product',$postType,true);
    if(!$isProductSearch)return$template;
    $storeSearch=get_theme_file_path('/search.php');
    return is_readable($storeSearch)?$storeSearch:$template;
},99);

add_action('init',static function():void{
    if(has_nav_menu('store_categories'))return;
    $menuId=wp_create_nav_menu('Categorias da loja');
    if(is_wp_error($menuId))return;
    $items=[
        ['Drones','/loja/?tipo=drones'],['Kits','/loja/?tipo=kits'],
        ['Baterias e Carregadores','/loja/?tipo=baterias-e-carregadores'],['Payloads','/loja/?tipo=payloads'],
        ['Softwares','/loja/?tipo=softwares'],['Docas','/loja/?tipo=docas'],['Acessórios','/loja/?tipo=acessorios'],
    ];
    foreach($items as[$title,$path])wp_update_nav_menu_item($menuId,0,['menu-item-title'=>$title,'menu-item-url'=>home_url($path),'menu-item-status'=>'publish','menu-item-type'=>'custom']);
    $locations=get_theme_mod('nav_menu_locations',[]);
    $locations['store_categories']=$menuId;
    set_theme_mod('nav_menu_locations',$locations);
},50);

add_action('admin_menu',static function():void{
    add_submenu_page('woocommerce','Menu da loja','Menu da loja','edit_theme_options','aerion-store-menu',static function():void{
        echo'<div class="wrap"><h1>Menu da loja</h1><p>Edite a ordem, os nomes e os links das categorias exibidas no topo da loja.</p><a class="button button-primary" href="'.esc_url(admin_url('nav-menus.php?action=locations')).'">Editar categorias da loja</a></div>';
    });
});

add_action('wp_enqueue_scripts', static function (): void {
    $institutionalCss = get_theme_file_path('assets/css/institutional.css');
    $productExtrasCss = get_theme_file_path('assets/css/product-extras.css');
    $productCatalogJs = get_theme_file_path('assets/js/product-catalog.js');
    $siteJs = get_theme_file_path('assets/js/site.js');
    $fidelityJs = get_theme_file_path('assets/js/fidelity.js');
    wp_enqueue_style('aerion-institutional', get_theme_file_uri('assets/css/institutional.css'), [], (string) filemtime($institutionalCss));
    $institutionalHardCss = get_theme_file_path('assets/css/institutional-hardening.css');
    wp_enqueue_style('aerion-institutional-hardening', get_theme_file_uri('assets/css/institutional-hardening.css'), ['aerion-institutional'], (string) filemtime($institutionalHardCss));
    if (file_exists($productExtrasCss)) {
        wp_enqueue_style('aerion-product-extras', get_theme_file_uri('assets/css/product-extras.css'), ['aerion-institutional-hardening'], (string) filemtime($productExtrasCss));
    }
    wp_enqueue_script(
        'aerion-site',
        get_theme_file_uri('assets/js/site.js'),
        [],
        (string) filemtime($siteJs),
        ['in_footer' => true, 'strategy' => 'defer']
    );
    wp_enqueue_script(
        'aerion-fidelity',
        get_theme_file_uri('assets/js/fidelity.js'),
        [],
        (string) filemtime($fidelityJs),
        ['in_footer' => true, 'strategy' => 'defer']
    );
    if (is_page('produtos') && file_exists($productCatalogJs)) {
        wp_enqueue_script(
            'aerion-product-catalog',
            get_theme_file_uri('assets/js/product-catalog.js'),
            ['aerion-site'],
            (string) filemtime($productCatalogJs),
            ['in_footer' => true, 'strategy' => 'defer']
        );
    }
    if (function_exists('aerion_is_store_context') && aerion_is_store_context()) {
        $storeCss = get_theme_file_path('assets/css/store-autelpilot.css');
        $storeHardCss = get_theme_file_path('assets/css/store-hardening.css');
        $storeJourneyCss = get_theme_file_path('assets/css/store-journey.css');
        $storeCouponCss = get_theme_file_path('assets/css/store-coupon.css');
        $storeJs = get_theme_file_path('assets/js/store.js');
        $storeInteractions = get_theme_file_path('assets/js/store-interactions.js');
        wp_enqueue_style('aerion-store', get_theme_file_uri('assets/css/store-autelpilot.css'), ['aerion-institutional'], (string) filemtime($storeCss));
        wp_enqueue_style('aerion-store-hardening', get_theme_file_uri('assets/css/store-hardening.css'), ['aerion-store'], (string) filemtime($storeHardCss));
        wp_enqueue_style('aerion-store-journey', get_theme_file_uri('assets/css/store-journey.css'), ['aerion-store-hardening'], (string) filemtime($storeJourneyCss));
        if (file_exists($storeCouponCss)) {
            wp_enqueue_style('aerion-store-coupon', get_theme_file_uri('assets/css/store-coupon.css'), ['aerion-store-journey'], (string) filemtime($storeCouponCss));
        }
        $storeCompactCss = get_theme_file_path('assets/css/store-compact.css');
        if (file_exists($storeCompactCss)) {
            wp_enqueue_style('aerion-store-compact', get_theme_file_uri('assets/css/store-compact.css'), [file_exists($storeCouponCss) ? 'aerion-store-coupon' : 'aerion-store-journey'], (string) filemtime($storeCompactCss));
        }
        wp_enqueue_script('aerion-store', get_theme_file_uri('assets/js/store.js'), [], (string) filemtime($storeJs), ['in_footer' => true, 'strategy' => 'defer']);
        wp_enqueue_script('aerion-store-interactions', get_theme_file_uri('assets/js/store-interactions.js'), ['jquery', 'wc-add-to-cart'], (string) filemtime($storeInteractions), ['in_footer' => true, 'strategy' => 'defer']);
        // Formata a cotação do Melhor Envio e põe a marca da transportadora.
        // O plugin entrega cada opção como uma frase única numa célula de tabela;
        // este script quebra em nome, prazo e preço depois que ele escreve.
        // As duas etapas do checkout. So na pagina de finalizacao: em qualquer
        // outra o script nao encontra `form.checkout` e sai sem fazer nada, mas
        // carregar por carregar e peso a toa.
        $passosJs = get_theme_file_path('assets/js/store-checkout-passos.js');
        if (file_exists($passosJs) && function_exists('is_checkout') && is_checkout() && ! is_order_received_page()) {
            wp_enqueue_script('aerion-checkout-passos', get_theme_file_uri('assets/js/store-checkout-passos.js'), [], (string) filemtime($passosJs), ['in_footer' => true, 'strategy' => 'defer']);
        }
        $couponJs = get_theme_file_path('assets/js/store-checkout-coupon.js');
        if (file_exists($couponJs) && function_exists('is_checkout') && is_checkout() && ! is_order_received_page() && function_exists('wc_coupons_enabled') && wc_coupons_enabled()) {
            wp_enqueue_script('aerion-checkout-coupon', get_theme_file_uri('assets/js/store-checkout-coupon.js'), ['jquery', 'wc-checkout'], (string) filemtime($couponJs), ['in_footer' => true, 'strategy' => 'defer']);
        }

        $freteJs = get_theme_file_path('assets/js/store-frete.js');
        if (file_exists($freteJs)) {
            wp_enqueue_script('aerion-store-frete', get_theme_file_uri('assets/js/store-frete.js'), [], (string) filemtime($freteJs), ['in_footer' => true, 'strategy' => 'defer']);
            $marcas = [];
            foreach (['correios', 'jadlog', 'azul-cargo-express', 'latam-cargo', 'loggi', 'buslog', 'total-express', 'jet'] as $marca) {
                $arquivo = 'assets/images/transportadoras/' . $marca . '.png';
                if (file_exists(get_theme_file_path($arquivo))) {
                    $marcas[$marca] = get_theme_file_uri($arquivo);
                }
            }
            wp_localize_script('aerion-store-frete', 'aerionFrete', ['logos' => $marcas]);
        }
        wp_localize_script('aerion-store', 'aerionStore', [
            'searchUrl' => esc_url_raw(rest_url('aerion/v1/products/search')),
            'cepUrl' => esc_url_raw(rest_url('aerion/v1/address/cep/')),
            'cnpjUrl' => esc_url_raw(rest_url('aerion/v1/registration/cnpj/')),
            'registrationNonce' => wp_create_nonce('aerion_cnpj_lookup'),
        ]);
    }
});

add_filter('excerpt_length', static fn (): int => 28);
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (! is_admin() && $query->is_main_query() && $query->is_home()) {
        // Preserve the complete Supabase history on the canonical blog page.
        $query->set('posts_per_page', 24);
        $query->set('ignore_sticky_posts', true);
    }
});

add_filter('render_block_core/post-featured-image', static function (string $content): string {
    $position = sanitize_text_field((string) get_post_meta(get_the_ID(), '_aerion_cover_position', true));
    if ($position === '' || ! preg_match('/^\d{1,3}(?:\.\d+)?%\s+\d{1,3}(?:\.\d+)?%$/', $position)) {
        return $content;
    }
    $processor = new WP_HTML_Tag_Processor($content);
    if ($processor->next_tag('img')) {
        $style = trim((string) $processor->get_attribute('style'));
        $processor->set_attribute('style', rtrim($style, ';') . ($style ? ';' : '') . 'object-position:' . $position);
        return $processor->get_updated_html();
    }
    return $content;
});

add_filter('body_class', static function (array $classes): array {
    if (class_exists('WooCommerce')) {
        $classes[] = 'aerion-has-commerce';
    }
    if (function_exists('aerion_is_store_context') && aerion_is_store_context()) {
        $classes[] = 'aerion-store-context';
    }
    return $classes;
});

/**
 * Os posts migrados sem categoria de origem caem na categoria padrão do
 * WordPress. O React não renderiza rótulo nesse caso, então a escondemos na
 * exibição em vez de inventar uma categoria.
 */
/**
 * Os "Posts Relacionados" do rodapé do artigo: mesma categoria quando houver,
 * sempre sem repetir o post que está sendo lido.
 */
add_filter('query_loop_block_query_vars', static function (array $query, $block): array {
    if ((int) ($block->context['queryId'] ?? 0) !== 7 || ! is_singular('post')) {
        return $query;
    }
    $postId = get_the_ID();
    $query['post__not_in'] = array_merge($query['post__not_in'] ?? [], [$postId]);

    // A maioria das categorias migradas tem um único post; se filtrássemos
    // sempre por categoria a seção ficaria vazia. Só restringimos quando há
    // outros artigos de fato.
    $categories = wp_get_post_categories($postId);
    if ($categories) {
        $irmaos = get_posts([
            'category__in'   => $categories,
            'post__not_in'   => [$postId],
            'posts_per_page' => 1,
            'fields'         => 'ids',
        ]);
        if ($irmaos) {
            $query['category__in'] = $categories;
        }
    }

    return $query;
}, 10, 2);

/**
 * No React a categoria do card é apenas um rótulo. O bloco core sempre gera
 * links para o arquivo da categoria, o que criava um desvio antes do artigo.
 */
add_filter('render_block_core/post-terms', static function (string $content): string {
    return preg_replace('#<a\b[^>]*>(.*?)</a>#is', '$1', $content) ?? $content;
});

add_filter('get_the_terms', static function ($terms, $postId, $taxonomy) {
    if ($taxonomy !== 'category' || is_wp_error($terms) || ! is_array($terms)) {
        return $terms;
    }
    $defaultId = (int) get_option('default_category');
    if ($defaultId === 0) {
        return $terms;
    }
    $filtered = array_values(array_filter(
        $terms,
        static fn($term): bool => (int) $term->term_id !== $defaultId
    ));

    return $filtered === [] ? [] : $filtered;
}, 10, 3);

require_once get_theme_file_path('inc/webp-images.php');

// Turnstile sob demanda: o Fluent Forms enfileira o api.js em toda pagina com
// formulario (na home, ~700 KB bloqueando a renderizacao). O script sai do HTML
// e o lazy-turnstile.js o carrega quando o visitante chega perto do formulario
// ou comeca a usa-lo.
add_filter('script_loader_tag', static fn (string $tag, string $handle): string => $handle === 'turnstile' ? '' : $tag, 10, 2);
add_action('wp_enqueue_scripts', static function (): void {
    $file = get_theme_file_path('assets/js/lazy-turnstile.js');
    wp_enqueue_script('aerion-lazy-turnstile', get_theme_file_uri('assets/js/lazy-turnstile.js'), [], (string) filemtime($file), ['in_footer' => true, 'strategy' => 'defer']);
}, 20);

/**
 * Paginas institucionais (fora da loja, carrinho, checkout e conta): tira CSS
 * que nao e usado e adia o que so aparece depois da primeira tela. Medido
 * comparando o estilo calculado de todos os elementos com e sem cada folha:
 * o CSS do WooCommerce nao altera nada nessas paginas; o do Fluent Forms so
 * afeta o formulario de contato, que fica no rodape.
 */
function aerion_is_institutional_request(): bool
{
    if (is_admin() || is_feed() || (function_exists('aerion_is_store_context') && aerion_is_store_context())) {
        return false;
    }
    if (function_exists('is_woocommerce') && (is_woocommerce() || is_cart() || is_checkout() || is_account_page())) {
        return false;
    }

    return true;
}

// O WooCommerce Blocks enfileira o CSS dele mais tarde; por isso tambem na impressao dos estilos.
$aerionDropWooStyles = static function (): void {
    if (! aerion_is_institutional_request()) {
        return;
    }
    foreach (['woocommerce-layout', 'woocommerce-smallscreen', 'woocommerce-general', 'woocommerce-blocktheme', 'wc-blocks-style'] as $handle) {
        wp_dequeue_style($handle);
    }
};
add_action('wp_enqueue_scripts', $aerionDropWooStyles, 100);
add_action('wp_print_styles', $aerionDropWooStyles, 1);
add_action('wp_footer', $aerionDropWooStyles, 1);

add_filter('style_loader_tag', static function (string $tag, string $handle): string {
    static $deferred = ['fluent-form-styles', 'fluentform-public-default', 'aerion-presale'];
    if (! in_array($handle, $deferred, true) || ! aerion_is_institutional_request()) {
        return $tag;
    }
    // Carrega sem bloquear a renderizacao e passa a valer ao terminar; sem JS, a folha original.
    $async = str_replace("media='all'", "media='print' onload=\"this.media='all'\"", $tag);

    return $async === $tag ? $tag : $async . '<noscript>' . $tag . '</noscript>';
}, 10, 2);

// Paginas institucionais: o jQuery Migrate (shim de APIs antigas) nao e usado
// por nenhum script do site nelas; testado sem erro de JS em home, contato,
// produtos, revendas, blog e sobre. A loja mantem (checkout tem plugins de terceiros).
add_action('wp_enqueue_scripts', static function (): void {
    if (! aerion_is_institutional_request()) {
        return;
    }
    $jquery = wp_scripts()->registered['jquery'] ?? null;
    if ($jquery && is_array($jquery->deps)) {
        $jquery->deps = array_values(array_diff($jquery->deps, ['jquery-migrate']));
    }
}, 100);

/**
 * Listagem da loja (home, categorias e busca): seis folhas nao alteram nenhum
 * elemento nessas paginas (medido a 390 e 1280 px), entao saem do caminho
 * critico. Produto, carrinho, checkout e conta continuam com tudo bloqueante.
 */
function aerion_is_store_listing_request(): bool
{
    return function_exists('aerion_is_store_context') && aerion_is_store_context()
        && ! is_admin()
        && function_exists('is_product') && ! is_product() && ! is_cart() && ! is_checkout() && ! is_account_page();
}

add_filter('style_loader_tag', static function (string $tag, string $handle): string {
    static $deferred = ['woocommerce-smallscreen', 'woocommerce-general', 'aerion-product-extras', 'aerion-store-coupon', 'aerion-store-compact', 'aerion-presale'];
    if (! in_array($handle, $deferred, true) || ! aerion_is_store_listing_request()) {
        return $tag;
    }
    // Preserva a media original (ex.: smallscreen so vale ate 768 px) e a restaura ao carregar.
    $async = (string) preg_replace("/media='([^']*)'/", "media='print' data-media='$1' onload=\"this.media=this.dataset.media\"", $tag, 1);

    return $async === $tag ? $tag : $async . '<noscript>' . $tag . '</noscript>';
}, 10, 2);
