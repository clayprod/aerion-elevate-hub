<?php
/**
 * Serve WebP nas imagens do HTML quando existe uma versao ao lado do original.
 *
 * Para `.../foto.png` (ou .jpg/.jpeg) existir `.../foto.webp`, as tags <img> e
 * <source> passam a apontar para o WebP. Sem a versao WebP nada muda, e o
 * original continua no disco como reserva. Isso cobre o tema e os uploads do
 * WooCommerce sem tocar em cada renderizador.
 *
 * @package Aerion
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Hosts cujas imagens podem ser trocadas: institucional, loja e o host da requisicao.
 *
 * @return list<string>
 */
function aerion_webp_allowed_hosts(): array
{
    static $hosts = null;
    if ($hosts === null) {
        $hosts = array_values(array_unique(array_filter([
            'aerion.com.br',
            'www.aerion.com.br',
            'loja.aerion.com.br',
            (string) wp_parse_url((string) get_option('home'), PHP_URL_HOST),
            (string) wp_parse_url((string) get_option('siteurl'), PHP_URL_HOST),
            (string) wp_parse_url(home_url(), PHP_URL_HOST),
            (string) ($_SERVER['HTTP_HOST'] ?? ''),
        ])));
    }

    return $hosts;
}

/**
 * Devolve a URL do WebP irmao de uma imagem local, ou null se nao houver.
 */
function aerion_webp_sibling_url(string $url): ?string
{
    static $cache = [];
    if (array_key_exists($url, $cache)) {
        return $cache[$url];
    }

    $cache[$url] = null;
    if (! preg_match('#^(.*?/wp-content/)(.+)\.(?:png|jpe?g)(\?[^\s]*)?$#i', $url, $match)) {
        return null;
    }

    // So arquivos do proprio site: o host precisa ser o do site ou da loja,
    // ou a URL ser relativa ao dominio. Na loja `home_url()` devolve o
    // subdominio, entao o dominio institucional vem das opcoes brutas.
    $host = (string) wp_parse_url($match[1], PHP_URL_HOST);
    if ($host !== '' && ! in_array($host, aerion_webp_allowed_hosts(), true)) {
        return null;
    }

    // Sem `..` no caminho: a URL vem do HTML, mas nunca deve escapar de wp-content.
    if (strpos($match[2], '..') !== false || ! file_exists(WP_CONTENT_DIR . '/' . $match[2] . '.webp')) {
        return null;
    }

    return $cache[$url] = $match[1] . $match[2] . '.webp' . ($match[3] ?? '');
}

function aerion_webp_rewrite_srcset(string $value): string
{
    $parts = array_map(static function (string $candidate): string {
        $candidate = trim($candidate);
        $split = preg_split('/\s+/', $candidate, 2);
        $url = $split[0] ?? '';
        $webp = $url !== '' ? aerion_webp_sibling_url($url) : null;
        return $webp === null ? $candidate : $webp . (isset($split[1]) ? ' ' . $split[1] : '');
    }, explode(',', $value));

    return implode(', ', $parts);
}

function aerion_webp_rewrite_html(string $html): string
{
    if (stripos($html, '<img') === false && stripos($html, '<source') === false) {
        return $html;
    }

    $result = preg_replace_callback('/<(?:img|source)\b[^>]*>/i', static function (array $tag): string {
        // `<source type="image/webp">` ja foi escolhido pelo tema: nao mexe.
        if (stripos($tag[0], 'type="image/webp"') !== false) {
            return $tag[0];
        }

        return (string) preg_replace_callback('/\b(src|srcset)=(["\'])(.*?)\2/i', static function (array $attr): string {
            $value = html_entity_decode($attr[3], ENT_QUOTES);
            $new = strtolower($attr[1]) === 'srcset'
                ? aerion_webp_rewrite_srcset($value)
                : (aerion_webp_sibling_url($value) ?? $value);

            return $new === $value ? $attr[0] : $attr[1] . '=' . $attr[2] . esc_attr($new) . $attr[2];
        }, $tag[0]);
    }, $html);

    return is_string($result) ? $result : $html;
}

add_action('template_redirect', static function (): void {
    if (is_admin() || is_feed() || wp_doing_ajax() || is_customize_preview()) {
        return;
    }
    ob_start('aerion_webp_rewrite_html');
}, 1);
