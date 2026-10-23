<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Defines the physical packages used by Aerion shipping quotations.
 *
 * Until master boxes are registered, one physical product unit is one volume.
 * A future box-packing step can consolidate these unit volumes without changing
 * the Melhor Envio request boundary implemented here.
 */
final class Aerion_Shipping_Packages
{
    private const MELHOR_ENVIO_HOSTS = [
        'api.melhorenvio.com',
        'sandbox.melhorenvio.com.br',
    ];
    private const SINGLE_VOLUME_SERVICES = [1, 2, 17, 27, 31, 32, 33];

    public static function boot(): void
    {
        add_filter('http_request_args', [self::class, 'filter_melhor_envio_quotation'], 20, 2);
        add_filter('http_response', [self::class, 'filter_incompatible_services'], 20, 3);
        add_action('wp_enqueue_scripts', [self::class, 'product_calculator_assets'], 100);
    }

    /**
     * Replaces Melhor Envio's generic empty-result message with a calculator
     * that distinguishes an unknown CEP from a valid route without services.
     */
    public static function product_calculator_assets(): void
    {
        // O Melhor Envio enfileira a calculadora em todas as paginas. Ela so
        // existe no produto da loja; na home e nas paginas institucionais sao
        // tres scripts bloqueantes sem uso.
        if (
            function_exists('is_product')
            && ! is_admin()
            && ! is_product() && ! is_cart() && ! is_checkout()
        ) {
            foreach (['produto', 'produto-variacao', 'calculator'] as $handle) {
                wp_dequeue_script($handle);
            }
            return;
        }

        if (! wp_script_is('produto', 'enqueued')) {
            return;
        }

        wp_dequeue_script('produto');
        wp_deregister_script('produto');
        wp_enqueue_script(
            'aerion-product-shipping',
            plugin_dir_url(AERION_COMMERCE_FILE) . 'assets/js/product-shipping.js',
            ['jquery'],
            AERION_COMMERCE_VERSION,
            false
        );
    }

    /**
     * Replaces products with Aerion's physical volumes only on ME quotations.
     * Products remain untouched in the label-purchase request for fiscal data.
     */
    public static function filter_melhor_envio_quotation(array $args, string $url): array
    {
        if (! self::is_calculate_url($url) || ! is_string($args['body'] ?? null)) {
            return $args;
        }

        $payload = json_decode($args['body'], true);
        if (
            ! is_array($payload)
            || ! empty($payload['volumes'])
            || empty($payload['products'])
            || ! is_array($payload['products'])
        ) {
            return $args;
        }

        $volumes = [];
        $orderId = self::order_id_from_melhor_envio_call();
        if ($orderId > 0) {
            $volumes = self::confirmed_order_volumes($orderId);
        }
        if ($volumes === []) {
            $volumes = self::volumes_from_products($payload['products']);
        }
        if ($volumes === []) {
            return $args;
        }

        $insurance = (float) ($payload['options']['insurance_value'] ?? 0);
        $insuranceLimit = (float) apply_filters('aerion_teto_seguro', 30000.0);
        if ($insuranceLimit > 0 && $insurance > $insuranceLimit) {
            $insurance = $insuranceLimit;
            $payload['options']['insurance_value'] = $insurance;
        }
        $payload['volumes'] = self::distribute_insurance($volumes, $insurance);
        unset($payload['products']);
        $encoded = wp_json_encode($payload);
        if (is_string($encoded) && $encoded !== '') {
            $args['body'] = $encoded;
        }

        return $args;
    }

    /**
     * ME requires separate shipments for these carriers when there is more
     * than one package. The official Woo plugin cannot purchase that batch,
     * so do not offer a rate that would fail later during label creation.
     */
    public static function filter_incompatible_services(mixed $response, array $args, string $url): mixed
    {
        if (! self::is_calculate_url($url) || is_wp_error($response) || ! is_array($response)) {
            return $response;
        }
        $quotations = json_decode((string) ($response['body'] ?? ''), true);
        if (! is_array($quotations)) {
            return $response;
        }

        $changed = false;
        foreach ($quotations as $key => $quotation) {
            if (! is_array($quotation)) {
                continue;
            }
            $serviceId = absint($quotation['id'] ?? 0);
            $packages = $quotation['packages'] ?? [];
            if (in_array($serviceId, self::SINGLE_VOLUME_SERVICES, true) && is_array($packages) && count($packages) > 1) {
                unset($quotations[$key]);
                $changed = true;
            }
        }
        if ($changed) {
            $encoded = wp_json_encode(array_values($quotations));
            if (is_string($encoded)) {
                $response['body'] = $encoded;
            }
        }
        return $response;
    }

    /**
     * @return array<int,array{weight:string,length:string,width:string,height:string}>
     */
    public static function order_volumes(WC_Order $order): array
    {
        $products = [];
        if (class_exists('MelhorEnvio\\Services\\OrdersProductsService')) {
            try {
                $products = (new \MelhorEnvio\Services\OrdersProductsService())
                    ->getProductsOrder($order->get_id());
            } catch (Throwable) {
                $products = [];
            }
        }

        if ($products === []) {
            foreach ($order->get_items('line_item') as $item) {
                $product = $item->get_product();
                if (! $product || ! $product->needs_shipping()) {
                    continue;
                }
                $quantity = max(0, (int) $item->get_quantity());
                $products[] = [
                    'quantity' => $quantity,
                    'width' => wc_get_dimension((float) $product->get_width(), 'cm'),
                    'height' => wc_get_dimension((float) $product->get_height(), 'cm'),
                    'length' => wc_get_dimension((float) $product->get_length(), 'cm'),
                    'weight' => wc_get_weight((float) $product->get_weight(), 'kg'),
                    'is_virtual' => false,
                ];
            }
        }

        return array_map(
            static fn(array $volume): array => [
                'weight' => wc_format_decimal((string) $volume['weight'], 2),
                'length' => wc_format_decimal((string) $volume['length'], 2),
                'width' => wc_format_decimal((string) $volume['width'], 2),
                'height' => wc_format_decimal((string) $volume['height'], 2),
            ],
            self::volumes_from_products($products)
        );
    }

    /**
     * One product row with quantity N becomes N independent volumes.
     *
     * @param array<int,mixed> $products
     * @return array<int,array{weight:float,length:float,width:float,height:float}>
     */
    public static function volumes_from_products(array $products): array
    {
        $volumes = [];
        foreach ($products as $product) {
            $product = is_object($product) ? get_object_vars($product) : $product;
            if (! is_array($product) || ! empty($product['is_virtual'])) {
                continue;
            }

            $quantity = max(0, (int) ($product['quantity'] ?? 0));
            if ($quantity === 0) {
                continue;
            }
            $volume = [
                'weight' => (float) ($product['weight'] ?? 0),
                'length' => (float) ($product['length'] ?? 0),
                'width' => (float) ($product['width'] ?? 0),
                'height' => (float) ($product['height'] ?? 0),
            ];
            if (min($volume) <= 0) {
                // Never send a partial shipment; the official plugin can still
                // apply its configured defaults to the original product payload.
                return [];
            }
            for ($unit = 0; $unit < $quantity; $unit++) {
                $volumes[] = $volume;
            }
        }
        return $volumes;
    }

    /**
     * The quotation API expects insurance per volume. A proportional split
     * prevents the complete order value from being repeated on every package.
     *
     * @param array<int,array{weight:float,length:float,width:float,height:float}> $volumes
     * @return array<int,array{weight:float,length:float,width:float,height:float,insurance?:float}>
     */
    private static function distribute_insurance(array $volumes, float $total): array
    {
        if ($total <= 0 || $volumes === []) {
            return $volumes;
        }

        $weightTotal = array_sum(array_column($volumes, 'weight'));
        $remaining = round($total, 2);
        $last = array_key_last($volumes);
        foreach ($volumes as $index => &$volume) {
            if ($index === $last) {
                $share = $remaining;
            } else {
                $ratio = $weightTotal > 0
                    ? $volume['weight'] / $weightTotal
                    : 1 / count($volumes);
                $share = min($remaining, round($total * $ratio, 2));
                $remaining = round($remaining - $share, 2);
            }
            $volume['insurance'] = max(0.01, $share);
        }
        unset($volume);

        return $volumes;
    }

    private static function is_calculate_url(string $url): bool
    {
        $host = strtolower((string) wp_parse_url($url, PHP_URL_HOST));
        $path = rtrim((string) wp_parse_url($url, PHP_URL_PATH), '/');
        return in_array($host, self::MELHOR_ENVIO_HOSTS, true)
            && str_ends_with($path, '/me/shipment/calculate');
    }

    /**
     * The official plugin does not expose the order ID in a payload filter.
     * During its synchronous order quotation the ID is still in this call.
     */
    private static function order_id_from_melhor_envio_call(): int
    {
        foreach (debug_backtrace(DEBUG_BACKTRACE_PROVIDE_OBJECT, 18) as $call) {
            if (
                ($call['function'] ?? '') === 'calculateQuotationByPostId'
                && isset($call['args'][0])
                && is_numeric($call['args'][0])
            ) {
                return absint($call['args'][0]);
            }
        }
        return 0;
    }

    /**
     * @return array<int,array{weight:float,length:float,width:float,height:float}>
     */
    private static function confirmed_order_volumes(int $orderId): array
    {
        $order = wc_get_order($orderId);
        if (! $order || $order->get_meta('_aerion_packing_confirmed') !== 'yes') {
            return [];
        }
        $stored = $order->get_meta('_aerion_shipping_volumes');
        if (! is_array($stored)) {
            return [];
        }

        $volumes = [];
        foreach ($stored as $row) {
            if (! is_array($row)) {
                return [];
            }
            $volume = [
                'weight' => (float) ($row['weight'] ?? 0),
                'length' => (float) ($row['length'] ?? 0),
                'width' => (float) ($row['width'] ?? 0),
                'height' => (float) ($row['height'] ?? 0),
            ];
            if (min($volume) <= 0) {
                return [];
            }
            $volumes[] = $volume;
        }
        return $volumes;
    }
}
