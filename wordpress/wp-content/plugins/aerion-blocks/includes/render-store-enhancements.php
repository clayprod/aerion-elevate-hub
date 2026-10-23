<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/** @return list<string> */
function aerion_store_product_editorial_badges(WC_Product $product): array
{
    $custom = $product->get_meta('_aerion_custom_badges', true);
    if (is_string($custom)) {
        $decoded = json_decode($custom, true);
        $custom = is_array($decoded) ? $decoded : array_map('trim', explode(',', $custom));
    }
    $custom = array_values(array_filter(array_map('sanitize_text_field', (array) $custom)));
    if ($product->get_meta('_aerion_replace_automatic_badges', true) === 'yes') {
        return array_slice($custom, 0, 2);
    }

    $automatic = [];
    $release = (string) $product->get_meta('_aerion_release_date', true);
    if ($release !== '' && $product->get_meta('_aerion_migrated_product', true) !== 'yes') {
        $releasedAt = strtotime($release);
        if ($releasedAt && $releasedAt <= time() && $releasedAt >= strtotime('-60 days')) $automatic[] = 'Novidade';
    }

    if ((int) $product->get_total_sales() > 0) {
        $categories = wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'ids']);
        $categoryId = is_array($categories) && $categories ? (int) $categories[0] : 0;
        if ($categoryId) {
            $topQuery = new WP_Query([
                'post_type'=>'product','post_status'=>'publish','fields'=>'ids','posts_per_page'=>3,
                'tax_query'=>[['taxonomy'=>'product_cat','field'=>'term_id','terms'=>[$categoryId]]],
                'meta_key'=>'total_sales','meta_value'=>0,'meta_compare'=>'>','orderby'=>'meta_value_num','order'=>'DESC','no_found_rows'=>true,
            ]);
            $topIds=array_map('intval',$topQuery->posts);
            if (in_array($product->get_id(), array_map('intval', $topIds), true)) $automatic[] = 'Mais vendido';
        }
    }

    if ($product->get_meta('_aerion_hide_automatic_badges', true) === 'yes') $automatic = [];
    return array_slice(array_values(array_unique(array_merge($custom, $automatic))), 0, 2);
}

add_action('woocommerce_product_options_general_product_data', static function (): void {
    global $product_object;
    if (! $product_object instanceof WC_Product) return;
    echo '<div class="options_group">';
    woocommerce_wp_text_input(['id'=>'_aerion_custom_badges','label'=>'Selos editoriais','description'=>'Até dois selos, separados por vírgula.','desc_tip'=>true,'value'=>implode(', ',(array)$product_object->get_meta('_aerion_custom_badges',true))]);
    woocommerce_wp_text_input(['id'=>'_aerion_release_date','label'=>'Data de lançamento','type'=>'date','description'=>'Ativa Novidade por até 60 dias.','desc_tip'=>true,'value'=>$product_object->get_meta('_aerion_release_date',true)]);
    woocommerce_wp_checkbox(['id'=>'_aerion_replace_automatic_badges','label'=>'Substituir automáticos','description'=>'Exibe apenas os selos editoriais.']);
    woocommerce_wp_checkbox(['id'=>'_aerion_hide_automatic_badges','label'=>'Ocultar automáticos','description'=>'Oculta Novidade e Mais vendido.']);
    echo '</div>';
});

add_action('woocommerce_admin_process_product_object', static function (WC_Product $product): void {
    $raw=wp_unslash((string)($_POST['_aerion_custom_badges']??''));
    $badges=array_slice(array_values(array_filter(array_map('sanitize_text_field',array_map('trim',explode(',',$raw))))),0,2);
    $release=sanitize_text_field(wp_unslash((string)($_POST['_aerion_release_date']??'')));
    $product->update_meta_data('_aerion_custom_badges',$badges);
    $product->update_meta_data('_aerion_release_date',preg_match('/^\d{4}-\d{2}-\d{2}$/',$release)?$release:'');
    $product->update_meta_data('_aerion_replace_automatic_badges',isset($_POST['_aerion_replace_automatic_badges'])?'yes':'no');
    $product->update_meta_data('_aerion_hide_automatic_badges',isset($_POST['_aerion_hide_automatic_badges'])?'yes':'no');
});

function aerion_store_cart_quantity(int $productId): int
{
    if (! function_exists('WC') || ! WC()->cart) return 0;
    $quantity = 0;
    foreach (WC()->cart->get_cart() as $item) {
        if ((int) ($item['product_id'] ?? 0) === $productId) $quantity += (int) ($item['quantity'] ?? 0);
    }
    return $quantity;
}

function aerion_store_product_card(WC_Product $product, string $modifier = ''): string
{
    $isInquiry = $product->get_meta('_aerion_catalog_inquiry', true) === 'yes';
    $available = ! $isInquiry && $product->is_in_stock() && (class_exists('Aerion_Inventory') ? Aerion_Inventory::immediately_available($product) : true);
    $isUnavailable = ! $available;
    $inCart = aerion_store_cart_quantity($product->get_id()) > 0;
    $campaign = $available && class_exists('Aerion_Campaigns') ? Aerion_Campaigns::active_for_product($product->get_id()) : null;
    $classes = 'aerion-store-product' . ($isUnavailable ? ' is-unavailable' : '') . ($campaign ? ' is-campaign' : '') . ($modifier !== '' ? ' ' . $modifier : '');
    $rating = (float) $product->get_average_rating();
    $ratingCount = (int) $product->get_review_count();
    $primaryLabel = $isUnavailable ? 'INDISPONÍVEL' : 'COMPRAR';
    $regular=(float)$product->get_regular_price();
    $campaignPrice=(float)$product->get_price();
    // O selo e da CAMPANHA: mostra o desconto dela, nao a diferenca total
    // contra o preco publico. Comparar os dois somava tabela de revenda e
    // desconto de nivel — um parceiro Gold via "48% OFF" numa campanha de 15%.
    $offerPercent=$campaign?max(1,(int)round((float)($campaign['meta']['percentage']?:15))):0;
    $badges = aerion_store_product_editorial_badges($product);
    ob_start();
    ?>
    <article class="<?php echo esc_attr($classes); ?>">
        <a class="aerion-store-product__main" href="<?php echo esc_url($product->get_permalink()); ?>">
            <div class="aerion-store-product__image"><?php echo $product->get_image('woocommerce_single', ['loading' => 'lazy']); ?><span class="aerion-store-product__badges"><?php foreach ($badges as $badge) : ?><?php $badgeKey = sanitize_title($badge); ?><b class="aerion-store-product__badge aerion-store-product__badge--<?php echo esc_attr(in_array($badgeKey, ['novidade', 'mais-vendido'], true) ? $badgeKey : 'editorial'); ?>"><?php echo esc_html($badge); ?></b><?php endforeach; ?></span><?php if ($offerPercent > 0) : ?><?php endif; ?><?php echo class_exists('Aerion_Presale') ? Aerion_Presale::chip($product, true) : ''; ?></div>
            <div class="aerion-store-product__meta"><?php if ($isUnavailable) : ?><em class="is-out-of-stock">Indisponível</em><?php endif; ?></div>
            <h3><?php echo esc_html($product->get_name()); ?></h3>
            <div class="aerion-card-rating" aria-label="<?php echo esc_attr(number_format_i18n($rating, 1) . ' de 5 estrelas; ' . $ratingCount . ' avaliações'); ?>"><span class="aerion-rating-stars" style="--aerion-rating:<?php echo esc_attr((string) ($rating / 5 * 100)); ?>%"><span>★★★★★</span></span><small>(<?php echo esc_html((string) $ratingCount); ?>)</small></div>
        </a>
        <div class="aerion-store-product__bottom">
            <strong><?php echo $product->get_price_html() ? wp_kses_post($product->get_price_html()) : 'Consulte'; ?></strong>
            <div class="aerion-store-product__actions">
                <a class="aerion-store-product__buy<?php echo $isUnavailable ? ' is-disabled' : ''; ?>" href="<?php echo esc_url($product->get_permalink()); ?>"<?php echo $isUnavailable ? ' aria-disabled="true"' : ''; ?>><?php echo esc_html($primaryLabel); ?></a>
                <?php if (! $isInquiry && ! $isUnavailable && $product->is_purchasable()) : ?>
                    <button type="button" class="aerion-store-product__cart<?php echo $inCart ? ' is-in-cart' : ''; ?>" data-aerion-cart-toggle data-aerion-cart-endpoint="<?php echo esc_url(WC_AJAX::get_endpoint('aerion_toggle_cart_product')); ?>" data-aerion-cart-security="<?php echo esc_attr(wp_create_nonce('aerion_toggle_cart_product')); ?>" data-quantity="1" data-product_id="<?php echo esc_attr((string) $product->get_id()); ?>" data-product_sku="<?php echo esc_attr($product->get_sku()); ?>" aria-pressed="<?php echo $inCart ? 'true' : 'false'; ?>" aria-label="<?php echo esc_attr(($inCart ? 'Remover do carrinho: ' : 'Adicionar ao carrinho: ') . $product->get_name()); ?>"><?php echo aerion_blocks_icon('cart'); ?><span class="screen-reader-text"><?php echo esc_html($inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'); ?></span></button>
                <?php else : ?><span class="aerion-store-product__cart is-disabled" role="img" aria-label="Produto indisponível"><?php echo aerion_blocks_icon('cart'); ?></span><?php endif; ?>
            </div>
        </div>
    </article>
    <?php
    return (string) ob_get_clean();
}
