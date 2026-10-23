<?php
/**
 * Plugin Name: Aerion Commerce
 * Description: Catálogo, campanhas, estoque, cadastro B2B e operação comercial da loja Aerion.
 * Version: 0.12.0
 * Requires at least: 6.6
 * Requires PHP: 8.2
 * Requires Plugins: woocommerce
 * Text Domain: aerion-commerce
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

define('AERION_COMMERCE_VERSION', '0.12.0');
define('AERION_B2B_DEFAULT_CNAES', '46,47,77');
define('AERION_COMMERCE_FILE', __FILE__);
define('AERION_COMMERCE_DIR', __DIR__);

require_once __DIR__ . '/includes/class-aerion-cnpj-service.php';
require_once __DIR__ . '/includes/class-aerion-b2b.php';
require_once __DIR__ . '/includes/class-aerion-campaigns.php';
require_once __DIR__ . '/includes/class-aerion-tiers.php';
require_once __DIR__ . '/includes/class-aerion-vendedores.php';
require_once __DIR__ . '/includes/class-aerion-painel-revenda.php';
require_once __DIR__ . '/includes/class-aerion-painel-parceiro.php';
require_once __DIR__ . '/includes/class-aerion-partner-materials.php';
require_once __DIR__ . '/includes/class-aerion-partner-portal.php';
require_once __DIR__ . '/includes/class-aerion-installments.php';
require_once __DIR__ . '/includes/class-aerion-pricing.php';
require_once __DIR__ . '/includes/class-aerion-pricing-migration.php';
require_once __DIR__ . '/includes/class-aerion-catalog.php';
require_once __DIR__ . '/includes/class-aerion-familia-conteudo.php';
require_once __DIR__ . '/includes/class-aerion-product-content-import.php';
require_once __DIR__ . '/includes/class-aerion-inventory.php';
require_once __DIR__ . '/includes/class-aerion-presale.php';
require_once __DIR__ . '/includes/class-aerion-shipping.php';
require_once __DIR__ . '/includes/class-aerion-store-api.php';
require_once __DIR__ . '/includes/class-aerion-google-merchant.php';
require_once __DIR__ . '/includes/class-aerion-product-ui-v2.php';
require_once __DIR__ . '/includes/class-aerion-coupons.php';
require_once __DIR__ . '/includes/class-aerion-checkout.php';
require_once __DIR__ . '/includes/class-aerion-birth-date.php';
require_once __DIR__ . '/includes/class-aerion-shipping-packages.php';
require_once __DIR__ . '/includes/class-aerion-structured-data.php';
require_once __DIR__ . '/includes/class-aerion-order-operations.php';
require_once __DIR__ . '/includes/class-aerion-billing-profiles.php';
require_once __DIR__ . '/includes/class-aerion-order-status.php';
require_once __DIR__ . '/includes/class-aerion-licencas.php';
require_once __DIR__ . '/includes/class-aerion-shipping-webhook.php';
require_once __DIR__ . '/includes/class-aerion-descadastro.php';
require_once __DIR__ . '/includes/class-aerion-emails.php';
require_once __DIR__ . '/includes/class-aerion-pix-experience.php';
require_once __DIR__ . '/includes/class-aerion-traducoes.php';
require_once __DIR__ . '/includes/class-aerion-email-imagens.php';
require_once __DIR__ . '/includes/class-aerion-commerce-settings.php';
/**
 * Identifica o hostname dedicado da loja sem confiar em valores parciais.
 */
function aerion_is_store_host(): bool
{
    $host = strtolower(trim((string) ($_SERVER['HTTP_HOST'] ?? '')));
    $host = preg_replace('/:\d+$/', '', $host) ?: '';

    return $host === 'loja.aerion.com.br';
}

/**
 * Mantem links, checkout e produtos no subdominio quando a requisicao entrou
 * por ele. O siteurl continua canonico no dominio principal para assets e wp-admin.
 */
add_filter('pre_option_home', static function ($value) {
    return aerion_is_store_host() ? 'https://loja.aerion.com.br' : $value;
});

/**
 * A raiz do subdominio representa internamente a pagina /loja/, sem redirect.
 */
add_filter('request', static function (array $queryVars): array {
    if (! aerion_is_store_host()) {
        return $queryVars;
    }

    $path = trim((string) wp_parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH), '/');
    if ($path !== '') {
        return $queryVars;
    }

    return ['pagename' => 'loja'];
}, PHP_INT_MAX);

add_filter('redirect_canonical', static function ($redirect, $requested) {
    if (! aerion_is_store_host()) {
        return $redirect;
    }

    $path = trim((string) wp_parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH), '/');
    return $path === '' ? false : $redirect;
}, 10, 2);
/**
 * Corrige URLs absolutas salvas no conteudo da loja para o host comercial.
 */
add_filter('render_block', static function (string $content): string {
    if (! aerion_is_store_host() || $content === '') {
        return $content;
    }

    return str_replace(
        'https://aerion.com.br/loja/',
        'https://loja.aerion.com.br/loja/',
        $content
    );
}, 20);

/**
 * Fronteira compartilhada com o tema. Mantém CSS, menus e templates da loja
 * fora das páginas institucionais.
 */
function aerion_is_store_context(): bool
{
    if (is_admin()) {
        return false;
    }

    if (aerion_is_store_host()) {
        return true;
    }

    if (is_singular('aerion_campaign') || is_post_type_archive('aerion_campaign') || is_tax('aerion_family')) {
        return true;
    }

    if (is_search() && get_query_var('post_type') === 'product') {
        return true;
    }

    $path=(string)wp_parse_url((string)($_SERVER['REQUEST_URI']??''),PHP_URL_PATH);
    foreach(['/loja','/carrinho','/finalizar-compra','/minha-conta','/pre-venda']as$storePath){
        if($path===$storePath||str_starts_with($path,$storePath.'/'))return true;
    }

    return function_exists('is_woocommerce') && (
        is_woocommerce() || is_cart() || is_checkout() || is_account_page()
    );
}

add_filter('woocommerce_breadcrumb_home_url',static fn(string $url):string=>aerion_is_store_context()?home_url('/loja/'):$url);
add_filter('woocommerce_return_to_shop_redirect',static fn():string=>home_url('/loja/'));
add_filter('woocommerce_continue_shopping_redirect',static fn():string=>home_url('/loja/'));
add_filter('wpseo_breadcrumb_links',static function(array $links):array{
    if(aerion_is_store_context()&&!empty($links[0])){$links[0]['url']=home_url('/loja/');$links[0]['text']='Loja';}
    return$links;
});

add_action('template_redirect',static function():void{
    if(!is_404())return;
    $path=trim((string)wp_parse_url((string)($_SERVER['REQUEST_URI']??''),PHP_URL_PATH),'/');
    if(!preg_match('#^produtos/([^/]+)$#',$path,$match))return;
    $product=get_page_by_path(sanitize_title($match[1]),OBJECT,'product');
    if(!$product)return;
    wp_safe_redirect(get_permalink($product),301);
    exit;
},5);

add_action('before_woocommerce_init', static function (): void {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
            'custom_order_tables',
            __FILE__,
            true
        );
    }
});

add_action('plugins_loaded', static function (): void {
    if (! class_exists('WooCommerce')) {
        add_action('admin_notices', static function (): void {
            echo '<div class="notice notice-error"><p>Aerion Commerce requer WooCommerce ativo.</p></div>';
        });
        return;
    }
    Aerion_Campaigns::boot();
    Aerion_B2B::boot();
    Aerion_Tiers::boot();
    Aerion_Vendedores::boot();
    Aerion_Painel_Revenda::boot();
    Aerion_Painel_Parceiro::boot();
    Aerion_Partner_Materials::boot();
    Aerion_Partner_Portal::boot();
    Aerion_Pricing::boot();
    Aerion_Installments::boot();
    Aerion_Catalog::boot();
    Aerion_Pricing_Migration::boot();
    Aerion_Familia_Conteudo::boot();
    Aerion_Product_Content_Import::boot();
    Aerion_Inventory::boot();
Aerion_Presale::boot();
    Aerion_Shipping::boot();
    Aerion_Store_API::boot();
    Aerion_Google_Merchant::boot();
    Aerion_Product_UI::boot();
    Aerion_Coupons::boot();
    Aerion_Checkout::boot();
    Aerion_Birth_Date::boot();
    Aerion_Billing_Profiles::boot();
    // O gateway "Pagamento de teste" existia porque nenhum meio real estava
    // configurado e o checkout precisava de um caminho ate o fim. Agora que o
    // Mercado Pago responde, ele so acrescenta uma opcao a mais para o cliente
    // errar. Continua no repositorio, e voltar e descomentar duas linhas.
    //
    // if (wp_get_environment_type() === 'local') {
    //     require_once __DIR__ . '/includes/class-aerion-local-payment-gateway.php';
    //     Aerion_Local_Payment_Gateway::boot();
    // }
    Aerion_Order_Status::boot();
    Aerion_Licencas::boot();
    Aerion_Shipping_Webhook::boot();
    Aerion_Descadastro::boot();
Aerion_Emails::boot();
Aerion_Pix_Experience::boot();
Aerion_Traducoes::boot();
Aerion_Email_Imagens::boot();
    Aerion_Shipping_Packages::boot();
    Aerion_Structured_Data::boot();
    Aerion_Order_Operations::boot();
    Aerion_Commerce_Settings::boot();
    if (get_option('aerion_commerce_schema_version') !== AERION_COMMERCE_VERSION) {
        update_option('aerion_commerce_schema_version', AERION_COMMERCE_VERSION, false);
        // O desconto do Pix e do boleto nao e mais regravado aqui: antes, cada
        // versao nova devolvia o gateway para 15% e desfazia a configuracao. Ele
        // e da loja desde `wp aerion-store pricing migrate-pix5`
        // (Aerion_Pricing::pix_rate e Aerion_Checkout::desconto_por_item).
        update_option('woocommerce_enable_coupons', 'yes', false);
        update_option('woocommerce_review_rating_verification_required', 'no', false);
        update_option('woocommerce_review_rating_verification_label', 'yes', false);
        update_option('comment_registration', 1, false);
        update_option('woocommerce_enable_guest_checkout', 'yes', false);
        update_option('woocommerce_enable_signup_and_login_from_checkout', 'yes', false);
        update_option('woocommerce_enable_checkout_login_reminder', 'yes', false);
        update_option('woocommerce_registration_generate_username', 'yes', false);
        update_option('woocommerce_registration_generate_password', 'yes', false);
        update_option('melhor_envio_option_where_show_calculator', 'woocommerce_after_add_to_cart_form', false);
        delete_option('melhorenvio_hide_calculator_product');
        update_option('aerion_b2b_auto_approve', 'yes', false);
        $allowedCnaes = preg_split('/[\s,;]+/', (string) get_option('aerion_b2b_allowed_cnaes', '')) ?: [];
        $allowedCnaes = array_values(array_filter(array_map('trim', $allowedCnaes)));
        foreach (explode(',', AERION_B2B_DEFAULT_CNAES) as $defaultCnae) {
            if (! in_array($defaultCnae, $allowedCnaes, true)) $allowedCnaes[] = $defaultCnae;
        }
        update_option('aerion_b2b_allowed_cnaes', implode(',', $allowedCnaes), false);
        if (! get_option('aerion_b2b_pending_revalidation_done') && ! wp_next_scheduled('aerion_revalidate_pending_cnaes_batch')) {
            wp_schedule_single_event(time() + 60, 'aerion_revalidate_pending_cnaes_batch');
        }
        update_option('aerion_store_legal_name', 'Aerion Technologies LTDA', false);
        update_option('aerion_store_legal_cnpj', '61.217.015/0002-81', false);
        update_option('aerion_store_legal_address', "Edifício Itamaracá\nR. Quintana 887, Cj. 111, 11º Andar\nBrooklin Novo - SP\n04569-011", false);
    }
});

register_activation_hook(__FILE__, static function (): void {
    if (get_option('aerion_b2b_allowed_cnaes', null) === null) {
        add_option('aerion_b2b_allowed_cnaes', AERION_B2B_DEFAULT_CNAES);
    }
    if (get_option('aerion_b2b_auto_approve', null) === null) {
        add_option('aerion_b2b_auto_approve', 'yes');
    }
    if (get_option('aerion_inventory_has_trusted_import', null) === null) {
        add_option('aerion_inventory_has_trusted_import', 'no', '', false);
    }
    if (get_option('aerion_store_legal_name', null) === null) {
        add_option('aerion_store_legal_name', 'Aerion Technologies LTDA', '', false);
    }
    if (get_option('aerion_store_legal_cnpj', null) === null) {
        add_option('aerion_store_legal_cnpj', '61.217.015/0002-81', '', false);
    }
    if (get_option('aerion_store_legal_address', null) === null) {
        add_option('aerion_store_legal_address', "Edifício Itamaracá\nR. Quintana 887, Cj. 111, 11º Andar\nBrooklin Novo - SP\n04569-011", '', false);
    }

    // O desconto do Pix e do boleto e da loja desde a migracao de precos
    // (wp aerion-store pricing migrate-pix5); o gateway nao e mais regravado.
    update_option('woocommerce_enable_coupons', 'yes', false);

    Aerion_Campaigns::register_content_types();
    Aerion_Google_Merchant::register_rewrite();
    flush_rewrite_rules();
});
