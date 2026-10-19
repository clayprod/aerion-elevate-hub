<?php
/**
 * Plugin Name: Aerion Core
 * Description: Conteúdo institucional, migrações, e-mail e saúde operacional.
 * Version: 0.4.0
 * Requires at least: 6.6
 * Requires PHP: 8.2
 * Text Domain: aerion-core
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

define('AERION_CORE_VERSION', '0.4.0');
define('AERION_CORE_FILE', __FILE__);
define('AERION_CORE_DIR', __DIR__);

require_once __DIR__ . '/includes/class-aerion-media-importer.php';
require_once __DIR__ . '/includes/class-aerion-migration-command.php';
require_once __DIR__ . '/includes/aerion-contact-fields.php';
require_once __DIR__ . '/includes/class-aerion-legal-pages.php';
require_once __DIR__ . '/includes/class-aerion-core-command.php';
require_once __DIR__ . '/includes/class-aerion-tracking.php';
require_once __DIR__ . '/includes/class-aerion-contact-form.php';
require_once __DIR__ . '/includes/class-aerion-contact-spam.php';
require_once __DIR__ . '/includes/class-aerion-institutional-catalog.php';
require_once __DIR__ . '/includes/class-aerion-product-content.php';
require_once __DIR__ . '/includes/class-aerion-institutional-product-admin.php';
require_once __DIR__ . '/includes/class-aerion-cover-position.php';
require_once __DIR__ . '/includes/class-aerion-content-blocks.php';
require_once __DIR__ . '/includes/class-aerion-utm-analytics.php';
require_once __DIR__ . '/includes/class-aerion-utm-builder.php';
require_once __DIR__ . '/includes/class-aerion-hardening.php';

Aerion_Hardening::boot();
Aerion_Contact_Spam::boot();
Aerion_Tracking::boot();
Aerion_Institutional_Catalog::boot();
Aerion_Product_Content::boot();
Aerion_UTM_Analytics::boot();
Aerion_UTM_Builder::boot();
// O catálogo editorial é deliberadamente independente do WooCommerce. A classe
// antiga permanece carregada apenas para interpretar páginas legadas no CLI,
// mas seus metaboxes e rotinas de gravação não devem voltar a vincular cadastros.

add_action('init', static function (): void {
    register_post_type('solucao', [
        'labels' => [
            'name'          => __('Soluções', 'aerion-core'),
            'singular_name' => __('Solução', 'aerion-core'),
            'add_new_item'  => __('Adicionar solução', 'aerion-core'),
            'edit_item'     => __('Editar solução', 'aerion-core'),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-admin-site-alt3',
        // The public solution landing pages live below /solucoes/ as
        // hierarchical pages. Keep this optional content type on a distinct
        // base so its rewrite rules never shadow those legacy URLs.
        'has_archive'  => false,
        'rewrite'      => ['slug' => 'solucao', 'with_front' => false],
        'supports'     => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes'],
        'show_in_nav_menus' => true,
    ]);
});

add_action('admin_menu', static function (): void {
    add_menu_page(
        __('Aerion', 'aerion-core'),
        __('Aerion', 'aerion-core'),
        'manage_options',
        'aerion',
        'aerion_core_render_dashboard',
        'dashicons-airplane',
        3
    );
});

/**
 * Render the operational overview inside wp-admin.
 */
function aerion_core_render_dashboard(): void
{
    if (! current_user_can('manage_options')) {
        return;
    }
    $checks = [
        __('HTTPS configurado', 'aerion-core') => is_ssl(),
        __('WooCommerce ativo', 'aerion-core') => class_exists('WooCommerce'),
        __('Yoast SEO ativo', 'aerion-core') => defined('WPSEO_VERSION'),
        __('Fluent Forms ativo', 'aerion-core') => defined('FLUENTFORM'),
        __('Transporte SMTP definido', 'aerion-core') => wp_get_environment_type() === 'local' || (bool) getenv('AERION_SMTP_HOST'),
        __('Consentimento ativo', 'aerion-core') => function_exists('wp_has_consent'),
        __('GTM definido', 'aerion-core') => defined('AERION_GTM_ID') && AERION_GTM_ID !== '',
        __('Sankhya desativado ou configurado', 'aerion-core') =>
            ! defined('AERION_SANKHYA_MODE') || AERION_SANKHYA_MODE !== 'live' || getenv('AERION_SANKHYA_BASE_URL'),
    ];
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Visão geral Aerion', 'aerion-core'); ?></h1>
        <p><?php esc_html_e('Esta tela reúne as dependências da reconstrução WordPress.', 'aerion-core'); ?></p>
        <table class="widefat striped" style="max-width:900px">
            <thead><tr><th><?php esc_html_e('Verificação', 'aerion-core'); ?></th><th><?php esc_html_e('Estado', 'aerion-core'); ?></th></tr></thead>
            <tbody>
            <?php foreach ($checks as $label => $ok) : ?>
                <tr><td><?php echo esc_html($label); ?></td><td><?php echo $ok ? '✅ OK' : '⚠️ Pendente'; ?></td></tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <h2><?php esc_html_e('Fluxo recomendado', 'aerion-core'); ?></h2>
        <ol>
            <li><?php esc_html_e('Configure o tema, menus e páginas no Site Editor.', 'aerion-core'); ?></li>
            <li><?php esc_html_e('Importe blog e catálogo no ambiente de homologação.', 'aerion-core'); ?></li>
            <li><?php esc_html_e('Configure SMTP, formulários, consentimento, GTM, Mercado Pago e Melhor Envio.', 'aerion-core'); ?></li>
            <li><?php esc_html_e('Valide URLs, SEO e checkout antes da troca de produção.', 'aerion-core'); ?></li>
        </ol>
    </div>
    <?php
}

add_action('phpmailer_init', static function (PHPMailer\PHPMailer\PHPMailer $mailer): void {
    $host = (string) getenv('AERION_SMTP_HOST');

    // O Mailpit é apenas o destino padrão quando nenhum SMTP foi informado no
    // ambiente local. As opções de porta, autenticação e criptografia seguem o
    // servidor de verdade quando ele existe — antes elas eram decididas pelo
    // tipo de ambiente, o que impedia testar envio real a partir daqui.
    $usandoMailpit = false;
    if ($host === '' && wp_get_environment_type() === 'local') {
        $host = 'mailpit';
        $usandoMailpit = true;
    }
    if ($host === '') {
        return;
    }

    $mailer->isSMTP();
    $mailer->Host = $host;
    $mailer->Port = $usandoMailpit ? 1025 : (int) (getenv('AERION_SMTP_PORT') ?: 587);
    $mailer->SMTPAuth = ! $usandoMailpit;
    $mailer->Username = (string) getenv('AERION_SMTP_USER');
    $mailer->Password = (string) getenv('AERION_SMTP_PASSWORD');
    $mailer->SMTPSecure = $usandoMailpit ? '' : (string) (getenv('AERION_SMTP_ENCRYPTION') ?: 'tls');

    // O remetente é um "não responda"; sem um Reply-To as respostas se perdem.
    // Só definimos quando a mensagem não trouxe o seu próprio — a notificação
    // de contato, por exemplo, responde para quem escreveu.
    $replyTo = (string) (getenv('AERION_MAIL_REPLY_TO') ?: 'comercial@aerion.com.br');
    if ($replyTo !== '' && ! $mailer->getReplyToAddresses() && is_email($replyTo)) {
        $mailer->addReplyTo($replyTo, (string) (getenv('AERION_MAIL_FROM_NAME') ?: ''));
    }
});

add_filter('wp_mail_from', static fn (string $from): string => getenv('AERION_MAIL_FROM') ?: $from);
add_filter('wp_mail_from_name', static fn (string $name): string => getenv('AERION_MAIL_FROM_NAME') ?: $name);

add_action('plugins_loaded', static function (): void {
    if (defined('WP_CLI') && WP_CLI) {
        WP_CLI::add_command('aerion', 'Aerion_Core_Command');
    }
});

register_activation_hook(__FILE__, static function (): void {
    update_option('aerion_core_version', AERION_CORE_VERSION);
    flush_rewrite_rules();
});
