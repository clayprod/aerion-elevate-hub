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
            status_header(403);
            echo self::restricted_page();
            exit;
        }
        status_header(200);
        echo self::page($kind);
        exit;
    }

    private static function can_view_distribution(): bool
    {
        return current_user_can('manage_woocommerce') || Aerion_B2B::is_approved();
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
                    'offer_pct' => (float) ($meta['percentage'] ?? 0),
                    // Título da seção: o nome da campanha ("Black November"), não o da regra que ganhou neste item.
                    'campaign' => (string) (($meta['eyebrow'] ?? '') !== '' ? $meta['eyebrow'] : $q['campaign']['title']),
                    'campaign_color' => (string) ($meta['color'] ?? ''),
                    'campaign_end' => self::end_label((string) ($meta['end'] ?? '')),
                ];
            }
        }
        // Maior desconto primeiro; empate por nome.
        usort($offers, static fn (array $a, array $b): int => $b['offer_pct'] <=> $a['offer_pct'] ?: strcasecmp($a['name'], $b['name']));
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
body{background:#eef2f7;color:var(--ink);font:13px/1.45 Montserrat,Arial,sans-serif;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
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
h2 small{font-size:11px;font-weight:600;letter-spacing:0;opacity:.85;text-transform:none}
h2.offer{background:#0b0b0b;border-bottom:3px solid var(--orange)}
table{border-collapse:collapse;table-layout:fixed;width:100%}
thead{display:table-header-group}
th{background:#e8eef7;color:var(--navy);font-size:10.5px;letter-spacing:.05em;padding:7px 10px;text-align:right;text-transform:uppercase}
th:first-child,td:first-child{text-align:left}
td{border-bottom:1px solid var(--line);padding:8px 10px;text-align:right;vertical-align:middle}
tr{break-inside:avoid}
tbody tr:nth-child(even){background:var(--zebra)}
td.p{align-items:center;display:flex;gap:12px}
.img{background:#fff;border:1px solid var(--line);border-radius:6px;display:block;flex:0 0 56px;height:58px;overflow:hidden;padding:2px;width:58px}
.img img{display:block;height:100%;object-fit:contain;width:100%}
.pn a{color:var(--ink);font-weight:700;text-decoration:none;border-bottom:1px dotted #9db0c7}
.pn a:hover{color:var(--blue)}
.pn small{color:var(--mut);display:block;font-size:10.5px;margin-top:1px}
.tag{background:#fde8e8;border-radius:4px;color:#a32020;font-size:10px;font-weight:700;margin-left:6px;padding:1px 6px;text-transform:uppercase}
.price{color:var(--ink);font-size:14px;font-weight:800;white-space:nowrap}
.old{color:var(--mut);font-size:11.5px;text-decoration:line-through;white-space:nowrap}
.off{background:#0b0b0b;border-radius:999px;color:#fff;display:inline-block;font-size:11px;font-weight:800;padding:3px 10px}
.mut{color:var(--mut);font-size:11.5px}
.parc{display:block;font-size:12.5px;font-weight:700}
td small.mut{display:block;font-size:10.5px}
.notes{border-top:1px solid var(--line);color:var(--mut);font-size:11px;margin-top:26px;padding-top:12px}
.notes li{margin:2px 0}
@page{margin:11mm;size:A4}
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
<div class="bar noprint">
  <span>Clique em um produto para abrir a página de compra. Para salvar, escolha “Salvar como PDF” na janela que abrir.</span>
  <button class="pdf" type="button" id="aerion-pdf">Baixar PDF</button>
</div>

<?php if ($data['offers']) :
    $first = $data['offers'][0]; ?>
<section>
  <h2 class="offer"><?php echo esc_html($first['campaign']); ?> <?php if ($first['campaign_end'] !== '') : ?><small>· ofertas válidas até <?php echo esc_html($first['campaign_end']); ?></small><?php endif; ?></h2>
  <table>
    <colgroup><col><col style="width:130px"><col style="width:120px"><col style="width:150px"></colgroup>
    <thead><tr><th>Produto</th><th>De</th><th>Desconto</th><th>Por (Pix)</th></tr></thead>
    <tbody>
    <?php foreach ($data['offers'] as $r) : ?>
      <tr>
        <td class="p"><?php echo self::product_cell($r); // phpcs:ignore WordPress.Security.EscapeOutput ?></td>
        <td><span class="old"><?php echo self::money($r['pix']); // phpcs:ignore ?></span></td>
        <td><span class="off"><?php echo esc_html(rtrim(rtrim(number_format($r['offer_pct'], 1, ',', ''), '0'), ',')); ?>% OFF</span></td>
        <td><span class="price"><?php echo self::money($r['offer_pix']); // phpcs:ignore ?></span></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</section>
<?php endif; ?>

<?php foreach ($data['groups'] as $nome => $rows) : ?>
<section>
  <h2><?php echo esc_html($nome); ?></h2>
  <table>
    <colgroup><col><?php echo $dist ? '<col style="width:160px"><col style="width:140px"><col style="width:140px">' : '<col style="width:170px"><col style="width:170px">'; ?></colgroup>
    <thead>
      <tr>
        <th>Produto</th>
        <?php if ($dist) : ?>
          <th>Preço de venda (Pix)</th><th>Cartão à vista</th><th>Consumidor (Pix)</th>
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

<ul class="notes">
<?php if ($dist) : ?>
  <li>Preço de venda no Pix, para distribuidor cadastrado sem nível. Cartão sem juros à vista; níveis Silver e Gold têm desconto adicional.</li>
  <li>Frete CIF (por conta da Aerion). Prazo de 5 dias para produtos a pronta entrega.</li>
  <li>Pedidos sob demanda têm prazo de até 30 dias úteis e exigem sinal mínimo de 30%.
<?php else : ?>
  <li>Pix com desconto à vista; cartão de crédito em até 12x (conforme o valor do pedido).</li>
  <li>Frete calculado no carrinho, pelo CEP de entrega.
<?php endif; ?>
  </li>
  <li>Sujeito a disponibilidade de estoque. Preços sujeitos a alteração sem aviso prévio.</li>
</ul>
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

    private static function restricted_page(): string
    {
        $login = esc_url(wc_get_page_permalink('myaccount'));
        return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow">'
            . '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Acesso restrito</title>'
            . '<style>body{align-items:center;background:#eef2f7;color:#0f1c2e;display:flex;font:15px/1.5 Arial,sans-serif;justify-content:center;min-height:100vh;margin:0}'
            . '.b{background:#fff;border-radius:12px;box-shadow:0 6px 28px rgb(15 28 46 / 10%);max-width:420px;padding:32px;text-align:center}'
            . 'h1{color:#1e3a8a;font-size:20px;margin:0 0 8px}a{background:#1e3a8a;border-radius:8px;color:#fff;display:inline-block;font-weight:700;margin-top:14px;padding:11px 22px;text-decoration:none}</style></head>'
            . '<body><div class="b"><h1>Tabela de distribuição</h1><p>Disponível para distribuidores aprovados. Entre com a sua conta para ver os preços.</p>'
            . '<a href="' . $login . '">Entrar</a></div></body></html>';
    }
}
