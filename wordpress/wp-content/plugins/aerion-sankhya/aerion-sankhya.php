<?php
/**
 * Plugin Name: Aerion Sankhya
 * Description: Integração com o Sankhya Om: cliente, pedido, NF-e (DANFE e XML), estoque e produtos.
 * Version: 0.3.0
 * Requires at least: 6.6
 * Requires PHP: 8.2
 * Requires Plugins: woocommerce
 * Text Domain: aerion-sankhya
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

define('AERION_SANKHYA_VERSION', '0.3.0');
define('AERION_SANKHYA_FILE', __FILE__);

require_once __DIR__ . '/includes/interface-aerion-erp-client.php';
require_once __DIR__ . '/includes/class-aerion-sankhya-mapper.php';
require_once __DIR__ . '/includes/class-aerion-sankhya-client.php';
require_once __DIR__ . '/includes/class-aerion-sankhya-sync.php';
require_once __DIR__ . '/includes/class-aerion-sankhya-invoices.php';
require_once __DIR__ . '/includes/class-aerion-sankhya-catalog.php';
require_once __DIR__ . '/includes/class-aerion-sankhya-alerts.php';
require_once __DIR__ . '/includes/class-aerion-sankhya-cancellations.php';
require_once __DIR__ . '/includes/class-aerion-sankhya-jobs.php';
require_once __DIR__ . '/includes/class-aerion-sankhya-settings.php';

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
        return;
    }
    Aerion_Sankhya_Sync::boot();
    Aerion_Sankhya_Invoices::boot();
    Aerion_Sankhya_Catalog::boot();
    Aerion_Sankhya_Cancellations::boot();
    Aerion_Sankhya_Alerts::boot();
    Aerion_Sankhya_Jobs::boot();
    Aerion_Sankhya_Settings::boot();
});
