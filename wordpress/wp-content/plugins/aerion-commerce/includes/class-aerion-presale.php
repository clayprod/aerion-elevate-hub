<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Pré-venda: item sem estoque que a Aerion vende com data de entrega prevista.
 *
 * A marca (`_aerion_presale`) e a data (`_aerion_presale_date`, AAAA-MM-DD) são
 * decididas à mão no produto, no wp-admin. Enquanto não há saldo, o produto
 * aparece com o chip "Pré-venda" e o prazo nos cards e na página, o cliente
 * confirma o aceite no checkout e o pedido fica registrado como pré-venda.
 * Com saldo de volta, o chip some e o produto vende como qualquer outro.
 */
final class Aerion_Presale
{
    public const META_DATE = '_aerion_presale_date';
    public const META_ACK = '_aerion_presale_ack';
    public const PAGE_OPTION = 'aerion_presale_page_id';

    public static function boot(): void
    {
        add_action('woocommerce_product_options_stock_status', [self::class, 'admin_field'], 12);
        add_action('woocommerce_admin_process_product_object', [self::class, 'admin_save'], 20);
        add_action('wp_enqueue_scripts', [self::class, 'assets']);
        add_filter('woocommerce_product_single_add_to_cart_text', [self::class, 'button_text'], 20, 2);
        add_filter('woocommerce_get_item_data', [self::class, 'cart_item_data'], 10, 2);
        add_action('woocommerce_review_order_before_submit', [self::class, 'checkout_ack']);
        add_action('woocommerce_checkout_process', [self::class, 'checkout_validate']);
        add_action('woocommerce_checkout_create_order_line_item', [self::class, 'line_item_meta'], 10, 4);
        add_action('woocommerce_checkout_create_order', [self::class, 'order_meta'], 10, 2);
        add_action('woocommerce_checkout_order_created', [self::class, 'order_note']);
        add_action('init', [self::class, 'ensure_page'], 30);
        add_filter('body_class', [self::class, 'body_class']);
    }

    /** Pré-venda em vigor para o produto (marcada e sem saldo). */
    public static function active(WC_Product $product): bool
    {
        return class_exists('Aerion_Inventory') && Aerion_Inventory::presale_active($product);
    }

    /** Data prevista (AAAA-MM-DD) ou vazio. */
    public static function date(WC_Product $product): string
    {
        $date = (string) $product->get_meta(self::META_DATE, true);
        return preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) === 1 ? $date : '';
    }

    /** Texto do prazo: "Entrega a partir de 05/02/2027" ou, sem data futura, "Prazo de entrega a confirmar". */
    public static function delivery_text(WC_Product $product): string
    {
        $date = self::date($product);
        if ($date === '' || $date < wp_date('Y-m-d')) {
            return 'Prazo de entrega a confirmar';
        }
        return 'Entrega a partir de ' . wp_date('d/m/Y', (int) strtotime($date . ' 12:00:00'));
    }

    /** Chip discreto para os cards (sobreposto à imagem, sem ocupar espaço). A data só aparece na página do produto. */
    public static function chip(WC_Product $product, bool $compact = true): string
    {
        if (! self::active($product)) {
            return '';
        }
        return '<span class="aerion-presale-chip">Pré-venda</span>';
    }

    /** Endereço da página que explica a pré-venda. */
    public static function page_url(): string
    {
        $id = (int) get_option(self::PAGE_OPTION, 0);
        $url = $id ? get_permalink($id) : '';
        return $url ? (string) $url : home_url('/pre-venda/');
    }

    /** Aviso na página do produto, com a data e o link "Saiba mais". */
    public static function product_notice(WC_Product $product): string
    {
        if (! self::active($product)) {
            return '';
        }
        return '<div class="aerion-presale-box"><div class="aerion-presale-box__head"><b>Pré-venda</b><strong>'
            . esc_html(self::delivery_text($product)) . '</strong></div>'
            . '<p>Garanta o seu agora e receba a partir dessa data. Se a entrega não acontecer, você recebe o valor de volta. '
            . '<a href="' . esc_url(self::page_url()) . '" target="_blank" rel="noopener">Saiba mais</a></p></div>';
    }

    public static function button_text(string $text, $product): string
    {
        return $product instanceof WC_Product && self::active($product) ? 'COMPRAR EM PRÉ-VENDA' : $text;
    }

    public static function assets(): void
    {
        $file = dirname(__DIR__) . '/assets/css/presale.css';
        if (is_file($file)) {
            wp_enqueue_style('aerion-presale', plugins_url('assets/css/presale.css', dirname(__DIR__) . '/aerion-commerce.php'), [], (string) filemtime($file));
        }
    }

    /* ---- wp-admin ---------------------------------------------------- */

    public static function admin_field(): void
    {
        woocommerce_wp_text_input([
            'id'          => self::META_DATE,
            'label'       => __('Entrega prevista', 'aerion-commerce'),
            'type'        => 'date',
            'desc_tip'    => true,
            'description' => __('Data a partir da qual a Aerion entrega este item em pré-venda. Aparece no chip, na página do produto, no checkout e no pedido.', 'aerion-commerce'),
        ]);
    }

    public static function admin_save(WC_Product $product): void
    {
        $date = isset($_POST[self::META_DATE]) ? sanitize_text_field(wp_unslash((string) $_POST[self::META_DATE])) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing
        $product->update_meta_data(self::META_DATE, preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) === 1 ? $date : '');
    }

    /* ---- carrinho e checkout ------------------------------------------- */

    /** @param array<int,array<string,mixed>> $data */
    public static function cart_item_data(array $data, array $cartItem): array
    {
        $product = $cartItem['data'] ?? null;
        if ($product instanceof WC_Product && self::active($product)) {
            $data[] = ['key' => 'Pré-venda', 'value' => self::delivery_text($product)];
        }
        return $data;
    }

    /** @return list<WC_Product> */
    private static function cart_presale_products(): array
    {
        if (! function_exists('WC') || ! WC()->cart) {
            return [];
        }
        $found = [];
        foreach (WC()->cart->get_cart() as $item) {
            $product = $item['data'] ?? null;
            if ($product instanceof WC_Product && self::active($product)) {
                $found[] = $product;
            }
        }
        return $found;
    }

    public static function checkout_ack(): void
    {
        $items = self::cart_presale_products();
        if (! $items) {
            return;
        }
        $posted = [];
        if (isset($_POST['post_data'])) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
            parse_str(wp_unslash((string) $_POST['post_data']), $posted); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        }
        $checked = ! empty($posted['aerion_presale_ack']) || ! empty($_POST['aerion_presale_ack']); // phpcs:ignore WordPress.Security.NonceVerification.Missing
        echo '<div class="aerion-presale-ack"><label class="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox">'
            . '<input type="checkbox" class="woocommerce-form__input woocommerce-form__input-checkbox input-checkbox" name="aerion_presale_ack" value="1"' . checked($checked, true, false) . '> '
            . '<span>Estou ciente de que ' . esc_html(self::summary($items)) . ' ' . (count($items) > 1 ? 'são itens' : 'é um item')
            . ' de <strong>pré-venda</strong>. Se a entrega não acontecer, posso pedir meu dinheiro de volta. '
            . '<a href="' . esc_url(self::page_url()) . '" target="_blank" rel="noopener">Como funciona</a></span></label></div>';
    }

    /** @param list<WC_Product> $items */
    private static function summary(array $items): string
    {
        return implode('; ', array_map(
            static fn (WC_Product $p): string => $p->get_name() . ' (' . lcfirst(self::delivery_text($p)) . ')',
            $items
        ));
    }

    public static function checkout_validate(): void
    {
        if (! self::cart_presale_products()) {
            return;
        }
        if (empty($_POST['aerion_presale_ack'])) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
            wc_add_notice('Marque a caixinha da pré-venda para continuar: ela confirma que você viu o prazo de entrega.', 'error');
        }
    }

    public static function line_item_meta(WC_Order_Item_Product $item, string $cartItemKey, array $values, WC_Order $order): void
    {
        $product = $values['data'] ?? null;
        if ($product instanceof WC_Product && self::active($product)) {
            $item->add_meta_data('Pré-venda', self::delivery_text($product), true);
        }
    }

    public static function order_meta(WC_Order $order, array $data): void
    {
        $items = self::cart_presale_products();
        if (! $items) {
            return;
        }
        $order->update_meta_data('_aerion_presale', 'yes');
        $order->update_meta_data(self::META_ACK, gmdate('c') . ' | ' . self::summary($items));
    }

    /** Nota no pedido (só possível depois de salvo). */
    public static function order_note(WC_Order $order): void
    {
        if ($order->get_meta('_aerion_presale') === 'yes') {
            $order->add_order_note('Pré-venda: cliente confirmou o aceite no checkout. ' . (string) $order->get_meta(self::META_ACK) . '. Não segue ao ERP até liberar (ação "Enviar/reprocessar no Sankhya").');
        }
    }

    /* ---- página "Como funciona a pré-venda" ----------------------------- */

    /** Marca a página para o CSS esconder o título duplicado (o topo já tem o próprio título). */
    public static function body_class(array $classes): array
    {
        $id = (int) get_option(self::PAGE_OPTION, 0);
        if ($id && is_page($id)) {
            $classes[] = 'aerion-presale-page';
        }
        return $classes;
    }

    /** Cria a página uma vez; depois é da equipe (editável no wp-admin, nunca sobrescrita). */
    public static function ensure_page(): void
    {
        if (get_option(self::PAGE_OPTION) && get_post_status((int) get_option(self::PAGE_OPTION))) {
            return;
        }
        $existing = get_page_by_path('pre-venda');
        if ($existing) {
            update_option(self::PAGE_OPTION, $existing->ID, false);
            return;
        }
        $id = wp_insert_post([
            'post_type'    => 'page',
            'post_status'  => 'publish',
            'post_title'   => 'Como funciona a pré-venda',
            'post_name'    => 'pre-venda',
            'post_content' => self::page_content(),
        ], true);
        if (! is_wp_error($id)) {
            update_option(self::PAGE_OPTION, (int) $id, false);
        }
    }

    private static function page_content(): string
    {
        $group = static fn (string $class, string $inner): string => '<!-- wp:group {"className":"' . $class . '","layout":{"type":"constrained"}} --><div class="wp-block-group ' . $class . '">' . $inner . '</div><!-- /wp:group -->';
        $h2 = static fn (string $t): string => '<!-- wp:heading {"level":2} --><h2 class="wp-block-heading">' . $t . '</h2><!-- /wp:heading -->';
        $h3 = static fn (string $t): string => '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">' . $t . '</h3><!-- /wp:heading -->';
        $p = static fn (string $t): string => '<!-- wp:paragraph --><p>' . $t . '</p><!-- /wp:paragraph -->';
        $step = static fn (string $title, string $text) => $group('aerion-presale-page__step', $h3($title) . $p($text));
        $card = static fn (string $title, string $text) => $group('aerion-presale-page__card', $h3($title) . $p($text));

        return implode("\n", [
            $group('aerion-presale-page__hero',
                '<!-- wp:paragraph {"className":"aerion-presale-page__eyebrow"} --><p class="aerion-presale-page__eyebrow">Pré-venda</p><!-- /wp:paragraph -->'
                . '<!-- wp:heading {"level":1} --><h1 class="wp-block-heading">Garanta o seu antes de todo mundo</h1><!-- /wp:heading -->'
                . $p('Pré-venda é quando você reserva o seu produto antes de ele chegar ao nosso estoque. Você já garante a sua unidade, e a gente te avisa em cada etapa até a entrega.')),
            $h2('Como funciona'),
            $group('aerion-presale-page__steps',
                $step('Você compra normalmente', 'O pagamento é feito na hora, do mesmo jeito que em qualquer outro produto da loja.')
                . $step('Reservamos o seu produto', 'Assim que ele chega, separamos a sua unidade.')
                . $step('Você acompanha por e-mail', 'Avisamos quando o pedido for preparado e enviado, e você vê tudo pela sua conta.')
                . $step('Entrega a partir da data prevista', 'A data aparece na página do produto e no seu pedido.')),
            $h2('Suas dúvidas'),
            $card('E se eu mudar de ideia?', 'Sem problema. Você tem 7 dias, contados do recebimento, para desistir da compra, como em qualquer compra feita pela internet. E, se o pedido ainda não tiver sido enviado, é só falar com a gente que cancelamos e devolvemos o valor.')
            . $card('E se a data não for cumprida?', 'Se houver qualquer mudança no prazo, a gente avisa você por e-mail. Se não conseguirmos entregar, você recebe o valor integral de volta, pelo mesmo meio de pagamento que usou na compra.'),
            $group('aerion-presale-page__cta',
                $h3('Ficou com alguma dúvida?')
                . $p('Fale com a gente pelo e-mail <a href="mailto:comercial@aerion.com.br">comercial@aerion.com.br</a> ou pelo WhatsApp. Vai ser um prazer ajudar.')),
        ]);
    }
}
