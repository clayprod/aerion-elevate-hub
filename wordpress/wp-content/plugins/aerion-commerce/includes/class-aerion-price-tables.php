<?php
/**
 * Tabelas de preços geradas do próprio catálogo.
 *
 * /tabela-consumidor  — preços ao consumidor (Pix e cartão), aberta por link direto.
 * /tabela-distribuicao — preço de venda do distribuidor base; só para parceiro
 *                        aprovado ou gestor da loja logado.
 *
 * Nada é digitado aqui: os valores saem do mesmo motor de preço da loja
 * (Aerion_Pricing::quote), então mudar o preço de revenda ou a campanha no admin
 * muda a tabela. A página já nasce em formato de impressão; o botão "Baixar PDF"
 * abre a janela do navegador, onde se escolhe "Salvar como PDF".
 *
 * As duas páginas não entram em menu, sitemap nem buscadores (noindex).
 */
if (! defined('ABSPATH')) {
    exit;
}

final class Aerion_Price_Tables
{
    private const ROUTES = [
        'tabela-distribuicao' => 'distribuicao',
        'tabela-consumidor' => 'consumidor',
    ];

    /** Ordem das seções, a mesma do menu da loja; o que não está aqui vai depois, em ordem alfabética. */
    private const ORDEM_CATEGORIAS = ['Drones', 'Kits', 'Baterias e Carregadores', 'Payloads', 'Softwares', 'Docas', 'Acessórios'];

    public static function boot(): void
    {
        add_action('parse_request', [self::class, 'maybe_render'], 1);
    }

    public static function maybe_render(): void
    {
        $path = (string) wp_parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);
        $slug = trim($path, '/');
        if (! isset(self::ROUTES[$slug])) {
            return;
        }
        $kind = self::ROUTES[$slug];

        nocache_headers();
        header('Cache-Control: private, no-store, max-age=0');
        header('X-Robots-Tag: noindex, nofollow, noarchive');
        header('Content-Type: text/html; charset=utf-8');

        if ($kind === 'distribuicao' && ! self::can_view_distribution()) {
            $error = '';
            if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && isset($_POST['aerion_tbl_pass'])) {
                $error = self::try_password((string) wp_unslash($_POST['aerion_tbl_pass']));
                if ($error === '') {
                    header('Location: /tabela-distribuicao', true, 303);
                    exit;
                }
            }
            status_header(401);
            echo self::restricted_page($error);
            exit;
        }
        status_header(200);
        echo self::page($kind);
        exit;
    }

    private const PASS_OPTION = 'aerion_price_table_hash';
    private const COOKIE = 'aerion_tbl_dist';

    /** Gestor da loja, parceiro aprovado ou quem digitou a senha da tabela (cookie assinado). */
    private static function can_view_distribution(): bool
    {
        return current_user_can('manage_woocommerce') || Aerion_B2B::is_approved() || self::has_valid_cookie();
    }

    private static function signature(int $expires): string
    {
        // Entra o hash da senha: trocar a senha invalida todos os cookies já emitidos.
        return hash_hmac('sha256', 'tbl|' . $expires . '|' . (string) get_option(self::PASS_OPTION, ''), wp_salt('auth'));
    }

    private static function has_valid_cookie(): bool
    {
        $raw = (string) ($_COOKIE[self::COOKIE] ?? '');
        if ((string) get_option(self::PASS_OPTION, '') === '' || ! preg_match('/^(\d{10})\.([a-f0-9]{64})$/', $raw, $m)) {
            return false;
        }
        return (int) $m[1] > time() && hash_equals(self::signature((int) $m[1]), $m[2]);
    }

    /** Devolve a mensagem de erro, ou '' se a senha estava certa (e o cookie foi emitido). */
    private static function try_password(string $given): string
    {
        $hash = (string) get_option(self::PASS_OPTION, '');
        $ip = (string) ($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '');
        $key = 'aerion_tbl_fail_' . md5($ip);
        $fails = (int) get_transient($key);
        if ($fails >= 5) {
            return 'Muitas tentativas. Tente novamente em 15 minutos.';
        }
        if ($hash === '' || $given === '' || ! password_verify($given, $hash)) {
            set_transient($key, $fails + 1, 15 * MINUTE_IN_SECONDS);
            return 'Senha incorreta.';
        }
        delete_transient($key);
        $expires = time() + 30 * DAY_IN_SECONDS;
        setcookie(self::COOKIE, $expires . '.' . self::signature($expires), [
            'expires' => $expires, 'path' => '/', 'secure' => is_ssl(), 'httponly' => true, 'samesite' => 'Lax',
        ]);
        return '';
    }

    /* ------------------------------------------------------------- dados */

    /**
     * @return array{groups:array<string,list<array>>,offers:list<array>}
     */
    private static function collect(string $kind): array
    {
        $audience = $kind === 'distribuicao' ? 'trade' : 'consumer';
        $products = wc_get_products(['status' => 'publish', 'limit' => -1, 'orderby' => 'menu_order title', 'order' => 'ASC']);
        $groups = [];
        $offers = [];
        foreach ($products as $p) {
            if (! $p instanceof WC_Product || $p->is_type('variable') || $p->get_catalog_visibility() === 'hidden') {
                continue;
            }
            $id = $p->get_id();
            if ($audience === 'trade' && (string) get_post_meta($id, '_aerion_trade_price', true) === '') {
                continue;
            }
            $q = Aerion_Pricing::quote($p, $audience, 0);
            if ($q['list_pix'] <= 0) {
                continue;
            }
            $display = static fn (float $v): float => (float) wc_get_price_to_display($p, ['price' => $v]);
            $row = [
                'id' => $id,
                'name' => $p->get_name(),
                'sku' => $p->get_sku(),
                'url' => get_permalink($id),
                'image' => self::image($p),
                'in_stock' => $p->is_in_stock(),
                'pix' => $display((float) $q['list_pix']),
                'card' => $display((float) $q['list_card']),
                'card_raw' => (float) $q['list_card'],
            ];
            if ($audience === 'trade') {
                $consumer = Aerion_Pricing::quote($p, 'consumer', 0);
                $row['consumer_pix'] = $display((float) $consumer['list_pix']);
            }
            $groups[self::category($id)][] = $row;

            if ($q['campaign'] && $q['pix'] < $q['list_pix']) {
                $meta = $q['campaign']['meta'];
                $offers[] = $row + [
                    'offer_pix' => $display((float) $q['pix']),
                    'offer_card' => $display((float) $q['card']),
                    'offer_card_raw' => (float) $q['card'],
                    'offer_pct' => (float) ($meta['percentage'] ?? 0),
                    // Título da seção: o nome da campanha ("Black November"), não o da regra que ganhou neste item.
                    'campaign' => (string) (($meta['eyebrow'] ?? '') !== '' ? $meta['eyebrow'] : $q['campaign']['title']),
                    'campaign_color' => (string) ($meta['color'] ?? ''),
                    'campaign_end' => self::end_label((string) ($meta['end'] ?? '')),
                ];
            }
        }
        // Ofertas: maior desconto em reais primeiro (preço no cartão menos o Pix da oferta, os dois valores da linha); empate por nome.
        usort($offers, static fn (array $a, array $b): int => ($b['card'] - $b['offer_pix']) <=> ($a['card'] - $a['offer_pix']) ?: strcasecmp($a['name'], $b['name']));
        foreach ($groups as &$groupRows) {
            usort($groupRows, static fn (array $a, array $b): int => $a['pix'] <=> $b['pix'] ?: strcasecmp($a['name'], $b['name']));
        }
        unset($groupRows);
        uksort($groups, static function (string $a, string $b): int {
            $ia = array_search($a, self::ORDEM_CATEGORIAS, true);
            $ib = array_search($b, self::ORDEM_CATEGORIAS, true);
            $ia = $ia === false ? 999 : $ia;
            $ib = $ib === false ? 999 : $ib;
            return $ia === $ib ? strcasecmp($a, $b) : $ia <=> $ib;
        });
        return ['groups' => $groups, 'offers' => $offers];
    }

    private static function category(int $productId): string
    {
        $terms = get_the_terms($productId, 'product_cat');
        if (is_array($terms)) {
            foreach ($terms as $term) {
                if ($term->slug !== 'uncategorized' && $term->slug !== 'sem-categoria') {
                    return $term->name;
                }
            }
        }
        return 'Outros';
    }

    private static function image(WC_Product $p): string
    {
        $imageId = $p->get_image_id();
        $url = $imageId ? wp_get_attachment_image_url($imageId, 'woocommerce_thumbnail') : '';
        return $url ?: wc_placeholder_img_src('woocommerce_thumbnail');
    }

    /** Último dia de vigência: um fim "01/12 00:00" vale até 30/11. */
    private static function end_label(string $end): string
    {
        foreach (['Y-m-d\TH:i:s', 'Y-m-d\TH:i'] as $format) {
            $d = DateTimeImmutable::createFromFormat('!' . $format, trim($end), wp_timezone());
            if ($d instanceof DateTimeImmutable) {
                if ($d->format('H:i:s') === '00:00:00') {
                    $d = $d->modify('-1 second');
                }
                return $d->format('d/m/Y');
            }
        }
        return '';
    }

    /* ------------------------------------------------------------ páginas */

    private static function money(float $v): string
    {
        return 'R$&nbsp;' . esc_html(number_format($v, 2, ',', '.'));
    }

    /** Cartão: no consumidor, o parcelamento ("até 12x de") com o à vista embaixo; no distribuidor, só o à vista. */
    private static function card_text(float $cardRaw, float $cardDisplay, bool $installments = false): string
    {
        if (class_exists('Aerion_Installments') && ! Aerion_Installments::card_accepted($cardRaw)) {
            return '<span class="mut">só Pix</span>';
        }
        if ($installments && class_exists('Aerion_Installments')) {
            $plans = Aerion_Installments::plans($cardRaw);
            $last = $plans ? $plans[count($plans) - 1] : null;
            if ($last && $last['count'] >= 2) {
                return '<span class="parc">até ' . (int) $last['count'] . 'x de ' . self::money((float) $last['amount'])
                    . ($last['free'] ? ' sem juros' : '') . '</span><small class="mut">ou ' . self::money($cardDisplay) . ' à vista</small>';
            }
        }
        return '<span>' . self::money($cardDisplay) . '</span>';
    }

    private static function product_cell(array $r): string
    {
        $stock = $r['in_stock'] ? '' : ' <span class="tag">Esgotado</span>';
        return '<a class="img" href="' . esc_url($r['url']) . '"><img src="' . esc_url($r['image']) . '" alt="" loading="eager" width="56" height="56"></a>'
            . '<div class="pn"><a href="' . esc_url($r['url']) . '">' . esc_html($r['name']) . '</a>' . $stock
            . ($r['sku'] !== '' ? '<small>SKU ' . esc_html($r['sku']) . '</small>' : '') . '</div>';
    }

    private static function page(string $kind): string
    {
        $data = self::collect($kind);
        $total = array_sum(array_map('count', $data['groups']));
        $dist = $kind === 'distribuicao';
        $titulo = $dist ? 'Tabela de preços · Distribuição' : 'Tabela de preços · Consumidor';
        $mes = wp_date('F \d\e Y');
        $agora = wp_date('d/m/Y \à\s H:i');
        $fileName = 'Aerion-Tabela-' . ($dist ? 'Distribuicao' : 'Consumidor') . '-' . wp_date('Y-m');
        $logo = get_theme_file_uri('assets/images/logo-aerion.png');
        $font = get_theme_file_uri('assets/fonts/montserrat.woff2');

        ob_start();
        ?>
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title><?php echo esc_html($fileName); ?></title>
<style>
@font-face{font-family:Montserrat;src:url("<?php echo esc_url($font); ?>") format("woff2");font-weight:100 900;font-display:swap}
:root{--navy:#1e3a8a;--blue:#2563eb;--ink:#0f1c2e;--mut:#5b6b7e;--line:#dfe6ee;--zebra:#f5f8fc;--orange:#f97316}
*{box-sizing:border-box}
body{background:#eef2f7;color:var(--ink);font:13px/1.45 Montserrat,Arial,sans-serif;font-variant-numeric:tabular-nums;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sheet{background:#fff;margin:24px auto;max-width:980px;padding:28px 32px 36px;box-shadow:0 6px 28px rgb(15 28 46 / 10%)}
header.top{align-items:center;border-bottom:3px solid var(--navy);display:flex;gap:20px;justify-content:space-between;padding-bottom:16px}
header.top img{height:46px;width:auto}
header.top h1{color:var(--navy);font-size:20px;letter-spacing:-.01em;line-height:1.15;margin:0;text-align:right}
header.top p{color:var(--mut);font-size:11.5px;margin:3px 0 0;text-align:right}
.bar{align-items:center;display:flex;gap:12px;justify-content:space-between;margin:14px 0 4px}
.bar span{color:var(--mut);font-size:11.5px}
button.pdf{background:var(--navy);border:0;border-radius:8px;color:#fff;cursor:pointer;font:700 13px Montserrat,Arial,sans-serif;padding:11px 20px}
button.pdf:hover{background:var(--blue)}
section{margin-top:22px}
h2{border-radius:6px 6px 0 0;color:#fff;font-size:13px;letter-spacing:.04em;margin:0;padding:9px 14px;text-transform:uppercase;background:var(--navy);break-after:avoid}
h2{align-items:baseline;display:flex;gap:10px;justify-content:space-between}
h2 small{font-size:11px;font-weight:600;letter-spacing:0;opacity:.85;text-transform:none}
h2.offer{background:#0b0b0b;border-bottom:3px solid var(--orange)}
table{border-collapse:collapse;table-layout:fixed;width:100%}
thead{display:table-header-group}
th{background:#e8eef7;border-bottom:1px solid #cdd8e6;color:var(--navy);font-size:10px;font-weight:800;letter-spacing:.06em;padding:8px 12px;text-align:right;text-transform:uppercase}
th:first-child,td:first-child{text-align:left}
td{border-bottom:1px solid var(--line);padding:9px 12px;text-align:right;vertical-align:middle}
tr{break-inside:avoid}
tbody tr:nth-child(even){background:var(--zebra)}
td.p{align-items:center;display:flex;gap:12px}
.img{background:#fff;border:1px solid var(--line);border-radius:6px;display:block;flex:0 0 56px;height:58px;overflow:hidden;padding:2px;width:58px}
.img img{display:block;height:100%;object-fit:contain;width:100%}
.pn a{border-bottom:1px dotted #9db0c7;color:var(--ink);font-size:12.5px;font-weight:700;line-height:1.3;text-decoration:none}
.pn a:hover{color:var(--blue)}
.pn small{color:var(--mut);display:block;font-size:10.5px;margin-top:1px}
.tag{background:#fde8e8;border-radius:4px;color:#a32020;font-size:10px;font-weight:700;margin-left:6px;padding:1px 6px;text-transform:uppercase}
.price{color:var(--ink);font-size:14px;font-weight:800;white-space:nowrap}
.price.big{display:block;font-size:17px;letter-spacing:-.01em;line-height:1.15}
.old{color:var(--mut);display:block;font-size:11.5px;white-space:nowrap}
.old em{font-size:10px;font-style:normal;text-decoration:none}
.old s{text-decoration:line-through}
.off{background:#0b0b0b;border-radius:999px;color:#fff;display:inline-block;font-size:10px;font-weight:800;letter-spacing:.02em;padding:2px 9px}
th.c,td.c{text-align:center}
td.c small.mut{display:block;font-size:10px;margin-top:4px}
tbody.offers tr{background:#fffaf4}
tbody.offers tr:nth-child(even){background:#fff3e6}
.mut{color:var(--mut);font-size:11.5px}
.parc{display:block;font-size:12.5px;font-weight:700;white-space:nowrap}
td small.mut{display:block;font-size:10.5px}
.summary{color:var(--mut);font-size:11.5px;margin:10px 0 0}
.notes{border-top:1px solid var(--line);color:var(--mut);font-size:11px;margin-top:26px;padding-top:12px}
.end{break-inside:avoid}
.sec{break-inside:avoid;margin-top:26px}
.sec h3{border-left:4px solid var(--navy);color:var(--navy);font-size:15px;line-height:1.2;margin:0 0 10px;padding:2px 0 2px 10px}
.sec > p{color:var(--ink);font-size:13.5px;margin:0 0 12px;max-width:780px}
.steps{counter-reset:s;display:grid;gap:12px;grid-template-columns:repeat(3,1fr);list-style:none;margin:0;padding:0}
.steps li{border:1px solid var(--line);border-radius:8px;counter-increment:s;padding:14px 16px}
.steps li:before{background:var(--navy);border-radius:50%;color:#fff;content:counter(s);display:block;font-size:14px;font-weight:800;height:28px;line-height:28px;margin-bottom:9px;text-align:center;width:28px}
.steps b{color:var(--ink);display:block;font-size:15px;line-height:1.3;margin-bottom:4px}
.steps span{color:var(--ink);display:block;font-size:13.5px;line-height:1.45}
.tiers .g{display:grid;gap:12px;grid-template-columns:1fr 1fr;margin:0}
.tiers .n{border:1px solid var(--line);border-radius:8px;border-top:4px solid #9aa8ba;padding:12px 16px 14px}
.tiers .n.o{border-top-color:#d9a21b}
.tiers .lv{color:var(--ink);display:block;font-size:14px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.tiers .n strong{color:var(--navy);display:block;font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.05;margin:4px 0}
.tiers .n span.t{color:var(--ink);display:block;font-size:13.5px;line-height:1.45}
.sec .l{display:flex;flex-wrap:wrap;gap:6px 24px;margin-top:12px}
.sec .l a{color:var(--navy);font-size:13.5px;font-weight:700;text-decoration:underline;text-underline-offset:3px}
.foot{border-top:3px solid var(--navy);margin-top:18px;padding-top:12px;text-align:center}
.foot b{color:var(--navy);display:block;font-size:12px;letter-spacing:.04em;margin-bottom:6px;text-transform:uppercase}
.foot .c{color:var(--mut);display:flex;flex-wrap:wrap;gap:4px 22px;justify-content:center;font-size:11.5px}
.foot .c span{color:var(--ink);font-weight:700}
.foot a{color:inherit;text-decoration:none}
.notes li{margin:2px 0}
@page{margin:11mm;size:A4}
@media(max-width:720px){.steps{grid-template-columns:1fr}.tiers .g{grid-template-columns:1fr}}
@media print{
body{background:#fff}
.sheet{box-shadow:none;margin:0;max-width:none;padding:0}
.noprint{display:none!important}
section{margin-top:14px}
}
@media(max-width:640px){.sheet{padding:18px 14px}header.top{flex-direction:column;align-items:flex-start}header.top h1,header.top p{text-align:left}td,th{padding:7px 6px}.img{display:none}}
</style>
</head>
<body>
<div class="sheet">
<header class="top">
  <img src="<?php echo esc_url($logo); ?>" alt="Aerion Technologies">
  <div><h1><?php echo esc_html($titulo); ?></h1><p><?php echo esc_html(ucfirst($mes)); ?> · atualizada em <?php echo esc_html($agora); ?></p></div>
</header>
<p class="summary"><?php echo (int) $total; ?> produtos<?php echo $data['offers'] ? ' · ' . count($data['offers']) . ' em oferta' : ''; ?></p>
<div class="bar noprint">
  <span>Clique em um produto para abrir a página de compra. Para salvar, escolha “Salvar como PDF” na janela que abrir.</span>
  <button class="pdf" type="button" id="aerion-pdf">Baixar PDF</button>
</div>

<?php if ($data['offers']) :
    $first = $data['offers'][0]; ?>
<section>
  <h2 class="offer"><?php echo esc_html($first['campaign']); ?> <?php if ($first['campaign_end'] !== '') : ?><small>ofertas válidas até <?php echo esc_html($first['campaign_end']); ?></small><?php endif; ?></h2>
  <table>
    <colgroup><col><col style="width:110px"><col style="width:200px"></colgroup>
    <thead><tr><th>Produto</th><th class="c">Desconto</th><th>Preço</th></tr></thead>
    <tbody class="offers">
    <?php foreach ($data['offers'] as $r) : ?>
      <tr>
        <td class="p"><?php echo self::product_cell($r); // phpcs:ignore WordPress.Security.EscapeOutput ?></td>
        <td class="c"><span class="off"><?php echo esc_html(rtrim(rtrim(number_format($r['offer_pct'], 1, ',', ''), '0'), ',')); ?>% OFF</span><?php if ($r['campaign_end'] !== '') : ?><small class="mut">até <?php echo esc_html(substr($r['campaign_end'], 0, 5)); ?></small><?php endif; ?></td>
        <td><span class="old"><s><?php echo self::money($r['card']); // phpcs:ignore ?></s> <em>no cartão</em></span><span class="price big"><?php echo self::money($r['offer_pix']); // phpcs:ignore ?></span><small class="mut">no Pix</small></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</section>
<?php endif; ?>

<?php foreach ($data['groups'] as $nome => $rows) : ?>
<section>
  <h2><?php echo esc_html($nome); ?> <small><?php echo count($rows); ?> <?php echo count($rows) === 1 ? 'item' : 'itens'; ?></small></h2>
  <table>
    <colgroup><col><?php echo $dist ? '<col style="width:160px"><col style="width:140px"><col style="width:140px">' : '<col style="width:150px"><col style="width:220px">'; ?></colgroup>
    <thead>
      <tr>
        <th>Produto</th>
        <?php if ($dist) : ?>
          <th>Venda no Pix</th><th>Cartão à vista</th><th>Consumidor (Pix)</th>
        <?php else : ?>
          <th>No Pix</th><th>No cartão</th>
        <?php endif; ?>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($rows as $r) : ?>
      <tr>
        <td class="p"><?php echo self::product_cell($r); // phpcs:ignore ?></td>
        <td><span class="price"><?php echo self::money($r['pix']); // phpcs:ignore ?></span></td>
        <td><?php echo self::card_text($r['card_raw'], $r['card'], ! $dist); // phpcs:ignore ?></td>
        <?php if ($dist) : ?>
        <td><span class="mut"><?php echo self::money($r['consumer_pix']); // phpcs:ignore ?></span></td>
        <?php endif; ?>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</section>
<?php endforeach; ?>

<div class="end">
<?php if ($dist) : echo self::howto_box() . self::tiers_box(); endif; ?>

<ul class="notes">
<?php if ($dist) : ?>
  <li>Preço de venda no Pix, para distribuidor cadastrado sem nível. Cartão à vista, sem juros.</li>
  <li>Frete CIF (por conta da Aerion). Prazo de 5 dias para produtos a pronta entrega.</li>
  <li>Pedidos sob demanda têm prazo de até 30 dias úteis e exigem sinal mínimo de 30%.
<?php else : ?>
  <li>Pix com desconto à vista; cartão de crédito em até 12x (conforme o valor do pedido).</li>
  <li>Frete calculado no carrinho, pelo CEP de entrega.
<?php endif; ?>
  </li>
  <li>Sujeito a disponibilidade de estoque. Preços sujeitos a alteração sem aviso prévio.</li>
</ul>
<div class="foot">
  <b>Fale com a Aerion · aerion.com.br</b>
  <div class="c">
    <div><span>Telefone</span> <a href="tel:+551151973319">+55 11 5197-3319</a></div>
    <div><span>WhatsApp</span> <a href="https://wa.me/5511934668839">+55 11 93466-8839</a></div>
    <div><span>E-mail</span> <a href="mailto:comercial@aerion.com.br">comercial@aerion.com.br</a></div>
  </div>
</div>
</div>
</div>
<script>
document.getElementById('aerion-pdf').addEventListener('click',function(){
  var t=document.title;document.title=<?php echo wp_json_encode($fileName); ?>;
  window.print();setTimeout(function(){document.title=t;},800);
});
</script>
</body>
</html>
        <?php
        return (string) ob_get_clean();
    }

    /** Descontos extras do programa de revendas (Silver e Gold), lidos das regras reais dos níveis. */
    private static function howto_box(): string
    {
        $account = esc_url(wc_get_page_permalink('myaccount'));
        $step = static fn (string $title, string $text): string => '<li><b>' . esc_html($title) . '</b><span>' . esc_html($text) . '</span></li>';
        return '<div class="sec"><h3>Como ter o preço de distribuidor no site</h3>'
            . '<ol class="steps">'
            . $step('Crie sua conta de empresa', 'Em Minha conta, escolha "Empresa" e informe o CNPJ.')
            . $step('Aguarde a aprovação', 'CNPJ ativo com atividade de revenda é liberado. Os demais casos passam por análise da Aerion.')
            . $step('Compre com preço de revenda', 'Entre na sua conta: os preços de distribuidor aparecem em toda a loja e no checkout.')
            . '</ol>'
            . '<div class="l"><a href="' . $account . '">Criar conta ou entrar</a></div></div>';
    }

    private static function tiers_box(): string
    {
        if (! class_exists('Aerion_Tiers')) {
            return '';
        }
        try {
            $discounts = (new ReflectionClassConstant('Aerion_Tiers', 'DESCONTO'))->getValue();
        } catch (ReflectionException $e) {
            return '';
        }
        $pct = static fn (string $tier): string => rtrim(rtrim(number_format(((float) ($discounts[$tier] ?? 0)) * 100, 1, ',', ''), '0'), ',');
        $meta = static fn (string $tier): string => 'R$&nbsp;' . esc_html(number_format(Aerion_Tiers::meta_trimestral($tier), 0, ',', '.'));
        $program = 'https://aerion.com.br/programa-de-revendas/';
        $pdfFile = get_theme_file_path('assets/source-downloads/politica-comercial-revendas-aerion-v1-0-2025-2026.pdf');
        $pdf = is_readable($pdfFile) ? get_theme_file_uri('assets/source-downloads/politica-comercial-revendas-aerion-v1-0-2025-2026.pdf') : '';

        $html = '<div class="sec tiers"><h3>Descontos adicionais · Programa de revendas</h3>'
            . '<p>Os preços desta tabela são do distribuidor cadastrado. Silver e Gold ganham desconto extra, aplicado na loja quando você entra na sua conta.</p>'
            . '<div class="g">'
            . '<div class="n s"><span class="lv">Silver</span><strong>' . esc_html($pct(Aerion_Tiers::SILVER)) . '%</strong><span class="t">de desconto extra. Meta: ' . $meta(Aerion_Tiers::SILVER) . ' em compras por trimestre.</span></div>'
            . '<div class="n o"><span class="lv">Gold</span><strong>' . esc_html($pct(Aerion_Tiers::GOLD)) . '%</strong><span class="t">de desconto extra. Meta: ' . $meta(Aerion_Tiers::GOLD) . ' em compras por trimestre.</span></div>'
            . '</div>'
            . '<div class="l"><a href="' . esc_url($program) . '">Conheça o Programa de Revendas e a Política Comercial</a>'
            . ($pdf !== '' ? '<a href="' . esc_url($pdf) . '">Política comercial v1.0 (PDF)</a>' : '')
            . '</div></div>';
        return $html;
    }

    private static function restricted_page(string $error = ''): string
    {
        $login = esc_url(wc_get_page_permalink('myaccount'));
        $msg = $error !== '' ? '<p class="e">' . esc_html($error) . '</p>' : '';
        return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow">'
            . '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Tabela de distribuição</title>'
            . '<style>body{align-items:center;background:#eef2f7;color:#0f1c2e;display:flex;font:15px/1.5 Arial,sans-serif;justify-content:center;min-height:100vh;margin:0}'
            . '.b{background:#fff;border-radius:12px;box-shadow:0 6px 28px rgb(15 28 46 / 10%);max-width:380px;padding:32px;text-align:center;width:100%}'
            . 'h1{color:#1e3a8a;font-size:20px;margin:0 0 6px}p{margin:0 0 16px}.e{color:#a32020;font-weight:700}'
            . 'input{border:1px solid #cdd8e6;border-radius:8px;box-sizing:border-box;font-size:15px;margin-bottom:12px;padding:11px 12px;width:100%}'
            . 'button{background:#1e3a8a;border:0;border-radius:8px;color:#fff;cursor:pointer;font-size:15px;font-weight:700;padding:11px 22px;width:100%}'
            . 'a{color:#1e3a8a;display:inline-block;font-size:13px;margin-top:16px}</style></head>'
            . '<body><form class="b" method="post" action="/tabela-distribuicao"><h1>Tabela de distribuição</h1><p>Digite a senha para ver os preços.</p>'
            . $msg . '<input type="password" name="aerion_tbl_pass" placeholder="Senha" autocomplete="current-password" autofocus required>'
            . '<button type="submit">Acessar</button>'
            . '<a href="' . $login . '">Sou distribuidor cadastrado: entrar com minha conta</a></form></body></html>';
    }
}
