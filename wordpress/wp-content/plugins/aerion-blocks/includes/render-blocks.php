<?php
/**
 * Server-rendered Aerion blocks.
 *
 * @package AerionBlocks
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

function aerion_blocks_theme_asset(string $path): string
{
    return get_theme_file_uri('assets/' . ltrim($path, '/'));
}

function aerion_blocks_page_snapshot(string $slug, array $tokens = []): string
{
    if (! preg_match('/^[a-z0-9-]+$/', $slug)) {
        return '';
    }
    $file = dirname(__DIR__) . '/snapshots/page-' . $slug . '.html';
    if (! is_readable($file) || filesize($file) > 524288) {
        return '';
    }
    $html = file_get_contents($file);
    if (! is_string($html) || ! str_contains($html, 'data-aerion-editorial-snapshot')) {
        return '';
    }
    return strtr($html, array_merge([
        '{{theme_images}}' => get_theme_file_uri('assets/source-images'),
        '{{theme_videos}}' => get_theme_file_uri('assets/source-videos'),
        '{{home_url}}' => untrailingslashit(home_url('/')),
    ], $tokens));
}

/**
 * Ícone de cada benefício das soluções.
 *
 * Os quatro cards de cada vertical usavam o mesmo "check", o que não dizia nada
 * sobre o benefício. O mapa é por título porque é o dado que existe hoje; quando
 * os benefícios virarem conteúdo estruturado, o ícone passa a ser um campo.
 */
function aerion_blocks_benefit_icon(string $titulo): string
{
    $mapa = [
        'Visão 360°'       => 'vision',
        'Resposta Rápida'  => 'rapid-response',
        'Segurança'        => 'safety',
        'Documentação'     => 'documentation',
        'Detecção Térmica' => 'thermal',
        'Visão Noturna'    => 'night-vision',
        'Precisão'         => 'precision',
        'Agilidade'        => 'agility',
        'Modelagem 3D'     => 'modeling-3d',
        'Salvamento'       => 'rescue',
    ];

    return $mapa[trim($titulo)] ?? 'technology';
}

function aerion_blocks_clay_icon(string $name, string $class = ''): string
{
    $allowed = [
        'technology', 'roi', 'support', 'mission', 'vision', 'values',
        'safety', 'documentation', 'rapid-response', 'modeling-3d',
        'rescue', 'service', 'thermal', 'night-vision', 'precision', 'agility',
        // Programa de revendas. Os dois selos de tier são a exceção metalizada
        // registrada no manifest da família — prata e ouro, forma claymórfica.
        'capacitacao', 'materiais-marketing', 'tier-silver', 'tier-gold',
        // Os quatro passos vivem sobre a seção navy: mesma paleta, peso invertido
        // para branco e ciano, senão a peça some no fundo.
        'passo-cadastro', 'passo-validacao', 'passo-tabela', 'passo-compra',
    ];
    $name = in_array($name, $allowed, true) ? $name : 'technology';
    return '<img class="aerion-clay-icon ' . esc_attr($class) . '" src="' . esc_url(aerion_blocks_theme_asset('source-images/icons/clay/semantic/' . $name . '.png')) . '" alt="" loading="lazy" decoding="async" aria-hidden="true">';
}

function aerion_blocks_icon(string $name, string $class = ''): string
{
    $paths = [
        'arrow' => '<path d="M5 12h14M13 6l6 6-6 6"/>',
        'cart' => '<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6"/>',
        'user' => '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
        'menu' => '<path d="M4 6h16M4 12h16M4 18h16"/>',
        'search' => '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
        'intelligence' => '<path d="M9 18h6M10 22h4"/><path d="M8.4 14.8A7 7 0 1 1 15.6 14.8C14.6 15.6 14 16.5 14 18h-4c0-1.5-.6-2.4-1.6-3.2z"/><path d="M12 2V1M4.2 4.2l-.7-.7M19.8 4.2l.7-.7"/>',
        'camera' => '<path d="M14.5 5 13 3h-2L9.5 5H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><circle cx="12" cy="12.5" r="3.5"/>',
        'zoom' => '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.3 15.3 5.2 5.2M10.5 7.5v6M7.5 10.5h6"/>',
        'translate' => '<path d="M4 5h8M8 3v2c0 4-2 7-5 9M5 9c1.5 2.3 3.4 4.1 6 5"/><path d="m13 21 4-10 4 10M14.5 17h5"/>',
        'sensor' => '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
        'play' => '<path d="m8 5 11 7-11 7z"/>',
        'download' => '<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"/>',
        'phone' => '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2.1z"/>',
        'mail' => '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7"/>',
        'pin' => '<path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
        'message' => '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
        'instagram' => '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
        'linkedin' => '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
        'check' => '<path d="m5 13 4 4L19 7"/>',
        'rocket' => '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
        'money' => '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
        'headset' => '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
        'eye' => '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
        'award' => '<circle cx="12" cy="8" r="5"/><path d="m8.5 12-1.5 10 5-3 5 3-1.5-10"/>',
        // Cada benefício das soluções tem o seu ícone: antes os quatro cards de
        // cada vertical repetiam o mesmo "check".
        'shield' => '<path d="M20 13c0 5-3.5 7.4-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.4 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1 1 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>',
        'bolt' => '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
        'document' => '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h6M8 13h8M8 17h5"/>',
        'thermal' => '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/><path d="M10 8h4"/>',
        'night' => '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
        'target' => '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
        'cube' => '<path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5z"/><path d="M3 8.5 12 14l9-5.5M12 14v7"/>',
        'rescue' => '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M4.9 4.9l4.3 4.3M14.8 14.8l4.3 4.3M19.1 4.9l-4.3 4.3M9.2 14.8l-4.3 4.3"/>',
        'globe' => '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
        'layers' => '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
    ];
    $path = $paths[$name] ?? $paths['check'];
    return '<svg class="aerion-icon ' . esc_attr($class) . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $path . '</svg>';
}

function aerion_blocks_whatsapp_icon(string $class = ''): string
{
    return '<svg class="aerion-icon ' . esc_attr($class) . '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.84 9.84 0 0 0-8.49 14.8L2 22l5.35-1.5A9.96 9.96 0 1 0 12.04 2Zm0 17.92a8 8 0 0 1-4.08-1.12l-.3-.18-3.17.89.85-3.1-.2-.32A7.94 7.94 0 1 1 12.04 20Zm4.36-5.94c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18a7.2 7.2 0 0 1-1.33-1.66c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/></svg>';
}

function aerion_blocks_store_menu_links(): string
{
    $items=[];
    $locations=get_nav_menu_locations();
    if(!empty($locations['store_categories'])){
        $menuItems=wp_get_nav_menu_items((int)$locations['store_categories']);
        if(is_array($menuItems))foreach($menuItems as$item)if((int)$item->menu_item_parent===0)$items[]=[$item->title,$item->url];
    }
    if(!$items)$items=[
        ['Drones',home_url('/loja/?tipo=drones')],
        ['Kits',home_url('/loja/?tipo=kits')],
        ['Baterias e Carregadores',home_url('/loja/?tipo=baterias-e-carregadores')],
        ['Payloads',home_url('/loja/?tipo=payloads')],
        ['Softwares',home_url('/loja/?tipo=softwares')],
        ['Docas',home_url('/loja/?tipo=docas')],
        ['Acessórios',home_url('/loja/?tipo=acessorios')],
    ];
    $html='';foreach($items as[$label,$url])$html.='<a href="'.esc_url($url).'">'.esc_html($label).'</a>';
    return$html;
}

function aerion_render_site_header_block(array $attributes): string
{
    $accountUrl = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('myaccount') : wp_login_url();
    $cartUrl = function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/carrinho/');
    $cartCount = function_exists('WC') && WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
    $productGroups = [
        'Drones' => [
            ['HUBSAN Mini 7', '/produtos/hubsan-mini-7/', 'Lançamento'],
            ['EVO Lite Enterprise', '/produtos/evo-lite-enterprise/'],
            ['EVO Max V2', '/produtos/evo-max-v2/'],
            ['Autel Alpha', '/produtos/autel-alpha/'],
        ],
        'Docks' => [['EVO Nest', '/produtos/evo-nest/']],
        'Softwares' => [['Autel Mapper', '/produtos/autel-mapper/']],
    ];
    $solutions = [
        ['Segurança Pública', '/solucoes/seguranca/'],
        ['Inspeção Industrial', '/solucoes/industrial/'],
        ['Construção Civil', '/solucoes/construcao/'],
        ['Resgate e Emergências', '/solucoes/resgate/'],
    ];
    $isStore = function_exists('aerion_is_store_context') ? aerion_is_store_context() : (function_exists('is_shop') && is_shop());
    $requestPath = trailingslashit('/' . trim((string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH), '/'));
    $isCurrent = static fn (string $path, bool $includeChildren = false): bool =>
        $path === '/' ? $requestPath === '/' : ($includeChildren ? str_starts_with($requestPath, $path) : $requestPath === $path);
    ob_start();
    ?>
    <header class="aerion-header<?php echo $isStore ? ' aerion-store-header' : ''; ?>" data-aerion-header>
        <?php // A faixa e a barra principal vivem juntas num bloco proprio porque
              // e ELE que fica fixo na rolagem, e nao o cabecalho inteiro: a fila
              // de categorias e alta demais para roubar essa altura da vitrine o
              // tempo todo. `position:sticky` prende a caixa inteira, entao a
              // unica forma de soltar a fila e ela ficar fora desta caixa. ?>
        <div class="aerion-header__topo">
        <?php if ($isStore) : ?>
        <div class="aerion-reseller-strip"><div class="aerion-container"><a href="<?php echo esc_url(home_url('/programa-de-revendas/')); ?>">Condições especiais para revendedores: cadastre seu CNPJ <?php echo aerion_blocks_icon('arrow'); ?></a></div></div>
        <?php endif; ?>
        <div class="aerion-container aerion-header__inner">
            <a class="aerion-header__logo" href="<?php echo esc_url($isStore ? home_url('/loja/') : home_url('/')); ?>" aria-label="Aerion">
                <img src="<?php echo esc_url(aerion_blocks_theme_asset('images/logo-aerion.png')); ?>" width="200" height="56" alt="Aerion Technologies">
            </a>
            <?php if ($isStore) : ?>
            <form class="aerion-store-search" role="search" action="<?php echo esc_url(home_url('/')); ?>" data-aerion-store-search><input type="hidden" name="post_type" value="product"><input name="s" type="search" autocomplete="off" placeholder="Buscar drones, acessórios, docas e softwares" aria-label="Buscar produtos"><kbd aria-hidden="true">Ctrl K</kbd><button type="submit" aria-label="Buscar"><?php echo aerion_blocks_icon('search'); ?></button><div class="aerion-store-search__results" data-aerion-search-results hidden></div></form>
            <div class="aerion-header__commerce aerion-header__commerce--store"><a class="aerion-customer-service" href="https://wa.me/5511934668839" target="_blank" rel="noopener noreferrer" aria-label="Atendimento"><?php echo aerion_blocks_clay_icon('service', 'aerion-customer-service__icon'); ?><span>Atendimento</span></a><a class="aerion-header__icon" href="<?php echo esc_url($accountUrl); ?>" aria-label="<?php echo is_user_logged_in() ? 'Minha conta' : 'Entrar'; ?>"><?php echo aerion_blocks_icon('user'); ?><span><?php echo is_user_logged_in() ? 'Minha conta' : 'Entrar'; ?></span><?php
            // Selo do nivel ao lado de "Minha conta": o parceiro reconhece o
            // proprio patamar em qualquer pagina, sem entrar na conta. Guardado
            // por `class_exists` porque este bloco tambem renderiza no site
            // institucional, onde o plugin da loja pode nao estar ativo.
            if (class_exists('Aerion_Tiers')) {
                $aerionTier = Aerion_Tiers::do_usuario();
                if ($aerionTier !== Aerion_Tiers::NENHUM) {
                    printf(
                        '<span class="aerion-header__tier aerion-header__tier--%s">%s</span>',
                        esc_attr($aerionTier),
                        esc_html(Aerion_Tiers::rotulos()[$aerionTier])
                    );
                }
            }
            ?></a><a class="aerion-header__icon aerion-cart-link" href="<?php echo esc_url($cartUrl); ?>" aria-label="Carrinho"><?php echo aerion_blocks_icon('cart'); ?><span>Carrinho</span><span class="aerion-cart-count"><?php echo esc_html((string) $cartCount); ?></span></a></div>
            <?php else : ?>
            <nav class="aerion-nav" aria-label="Navegação principal">
                <div class="aerion-nav__item<?php echo $isCurrent('/') ? ' is-current' : ''; ?>"><a href="<?php echo esc_url(home_url('/')); ?>"<?php echo $isCurrent('/') ? ' aria-current="page"' : ''; ?>>Home</a></div>
                <div class="aerion-nav__item<?php echo $isCurrent('/produtos/', true) ? ' is-current' : ''; ?>">
                    <a href="<?php echo esc_url(home_url('/produtos/')); ?>" aria-haspopup="true"<?php echo $isCurrent('/produtos/', true) ? ' aria-current="page"' : ''; ?>>Produtos</a>
                    <div class="aerion-nav__dropdown aerion-nav__dropdown--products">
                        <?php foreach ($productGroups as $group => $products) : ?>
                            <span><?php echo esc_html($group); ?></span>
                            <?php foreach ($products as $productLink) : ?><?php [$label, $url] = $productLink; $badge = (string) ($productLink[2] ?? ''); ?><a class="aerion-nav__product-link" href="<?php echo esc_url(home_url($url)); ?>"><span><?php echo esc_html($label); ?></span><?php if ($badge !== '') : ?><small><?php echo esc_html($badge); ?></small><?php endif; ?></a><?php endforeach; ?>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="aerion-nav__item<?php echo $isCurrent('/solucoes/', true) ? ' is-current' : ''; ?>">
                    <a href="<?php echo esc_url(home_url('/solucoes/')); ?>" aria-haspopup="true"<?php echo $isCurrent('/solucoes/', true) ? ' aria-current="page"' : ''; ?>>Soluções</a>
                    <div class="aerion-nav__dropdown">
                        <?php foreach ($solutions as [$label, $url]) : ?>
                            <a href="<?php echo esc_url(home_url($url)); ?>"><?php echo esc_html($label); ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="aerion-nav__item<?php echo $isCurrent('/sobre/') ? ' is-current' : ''; ?>"><a href="<?php echo esc_url(home_url('/sobre/')); ?>"<?php echo $isCurrent('/sobre/') ? ' aria-current="page"' : ''; ?>>Sobre</a></div>
                <div class="aerion-nav__item<?php echo $isCurrent('/blog/', true) ? ' is-current' : ''; ?>"><a href="<?php echo esc_url(home_url('/blog/')); ?>"<?php echo $isCurrent('/blog/', true) ? ' aria-current="page"' : ''; ?>>Blog</a></div>
                <div class="aerion-nav__item<?php echo $isCurrent('/contato/') ? ' is-current' : ''; ?>"><a href="<?php echo esc_url(home_url('/contato/')); ?>"<?php echo $isCurrent('/contato/') ? ' aria-current="page"' : ''; ?>>Contato</a></div>
            </nav>
            <div class="aerion-header__commerce aerion-header__commerce--institutional">
                <a class="aerion-button aerion-button--header aerion-button--reseller" href="<?php echo esc_url(home_url('/programa-de-revendas/')); ?>">Quero ser um revendedor</a>
                <a class="aerion-button aerion-button--header aerion-button--store" href="<?php echo esc_url(home_url('/loja/')); ?>"><?php echo aerion_blocks_icon('cart'); ?>Loja</a>
            </div>
            <?php endif; ?>
            <button class="aerion-menu-toggle" type="button" aria-expanded="false" aria-controls="aerion-mobile-nav">
                <?php echo aerion_blocks_icon('menu'); ?><span class="screen-reader-text">Abrir menu</span>
            </button>
        </div>
        </div><?php // fim de .aerion-header__topo ?>
        <?php if ($isStore) : ?>
        <nav class="aerion-store-nav" aria-label="Categorias da loja"><div class="aerion-container">
            <?php echo aerion_blocks_store_menu_links(); ?>
        </div></nav>
        <?php endif; ?>
        <div class="aerion-mobile-nav<?php echo $isStore ? ' aerion-mobile-nav--store' : ''; ?>" id="aerion-mobile-nav" hidden>
            <?php if ($isStore) : ?>
            <form class="aerion-store-search aerion-store-search--mobile" role="search" action="<?php echo esc_url(home_url('/')); ?>"><input type="hidden" name="post_type" value="product"><input name="s" type="search" placeholder="Buscar na loja"><button type="submit">Buscar</button></form>
            <?php echo aerion_blocks_store_menu_links(); ?>
            <a class="aerion-mobile-nav__service" href="https://wa.me/5511934668839" target="_blank" rel="noopener noreferrer"><?php echo aerion_blocks_clay_icon('service', 'aerion-customer-service__icon'); ?>Atendimento</a>
            <a href="<?php echo esc_url($accountUrl); ?>"><?php echo is_user_logged_in() ? 'Minha conta' : 'Entrar ou cadastrar'; ?></a>
            <a href="<?php echo esc_url($cartUrl); ?>">Carrinho (<?php echo esc_html((string) $cartCount); ?>)</a>
            <?php else : ?>
            <a href="<?php echo esc_url(home_url('/')); ?>">Home</a>
            <details><summary>Produtos</summary><?php foreach ($productGroups as $group => $products) : ?><strong><?php echo esc_html($group); ?></strong><?php foreach ($products as $productLink) : ?><?php [$label, $url] = $productLink; $badge = (string) ($productLink[2] ?? ''); ?><a class="aerion-mobile__product-link" href="<?php echo esc_url(home_url($url)); ?>"><span><?php echo esc_html($label); ?></span><?php if ($badge !== '') : ?><small><?php echo esc_html($badge); ?></small><?php endif; ?></a><?php endforeach; ?><?php endforeach; ?></details>
            <details><summary>Soluções</summary><?php foreach ($solutions as [$label, $url]) : ?><a href="<?php echo esc_url(home_url($url)); ?>"><?php echo esc_html($label); ?></a><?php endforeach; ?></details>
            <a href="<?php echo esc_url(home_url('/sobre/')); ?>">Sobre</a>
            <a href="<?php echo esc_url(home_url('/blog/')); ?>">Blog</a>
            <a href="<?php echo esc_url(home_url('/contato/')); ?>">Contato</a>
            <a class="aerion-mobile-nav__reseller" href="<?php echo esc_url(home_url('/programa-de-revendas/')); ?>">Quero ser um revendedor</a>
            <a class="aerion-mobile-nav__store" href="<?php echo esc_url(home_url('/loja/')); ?>"><?php echo aerion_blocks_icon('cart'); ?>Loja</a>
            <?php endif; ?>
        </div>
    </header>
    <?php
    return (string) ob_get_clean();
}

function aerion_render_site_footer_block(array $attributes): string
{
    $accountUrl = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('myaccount') : wp_login_url();
    $partnerUrl = 'https://aerion.com.br/area-do-parceiro/';
    $isStore = function_exists('aerion_is_store_context') && aerion_is_store_context();
    $legalName = (string) get_option('aerion_store_legal_name', 'Aerion Technologies LTDA');
    $legalCnpj = (string) get_option('aerion_store_legal_cnpj', '61.217.015/0002-81');
    $legalAddress = (string) get_option('aerion_store_legal_address', "Edifício Itamaracá\nR. Quintana 887, Cj. 111, 11º Andar\nBrooklin Novo - SP\n04569-011");
    if ($isStore) {
        $mpAssets=content_url('/plugins/woocommerce-mercadopago/assets/images');
        $paymentMarks=[
            [$mpAssets.'/checkouts/basic/payment-methods/visa.svg','Visa'],
            [$mpAssets.'/checkouts/basic/payment-methods/master.svg','Mastercard'],
            [$mpAssets.'/checkouts/basic/payment-methods/amex.svg','American Express'],
            [$mpAssets.'/checkouts/basic/payment-methods/elo.svg','Elo'],
            [$mpAssets.'/checkouts/basic/payment-methods/hipercard.svg','Hipercard'],
            [$mpAssets.'/checkouts/basic/payment-methods/pix.svg','Pix'],
        ];
        ob_start();
        ?>
        <footer class="aerion-footer aerion-store-footer">
            <div class="aerion-container aerion-store-footer__benefits"><div><?php echo aerion_blocks_icon('shield'); ?><span><strong>Compra segura</strong><small>Checkout transparente</small></span></div><div><?php echo aerion_blocks_icon('headset'); ?><span><strong>Suporte no Brasil</strong><small>Atendimento especializado</small></span></div><div><?php echo aerion_blocks_icon('money'); ?><span><strong><?php echo esc_html((class_exists('Aerion_Pricing') ? Aerion_Pricing::rate_label() : '5') . '% de desconto'); ?></strong><small>No Pix</small></span></div></div>
            <div class="aerion-container aerion-footer__grid">
                <div class="aerion-footer__brand"><img src="<?php echo esc_url(aerion_blocks_theme_asset('images/logo-aerion.png')); ?>" width="200" height="56" alt="Aerion Technologies"><p>Loja oficial Autel no Brasil, com suporte local, garantia nacional de 1 ano e atendimento especializado.</p></div>
                <div><h2>Comprar</h2><nav><a href="<?php echo esc_url(home_url('/loja/?tipo=drones')); ?>">Drones</a><a href="<?php echo esc_url(home_url('/loja/?tipo=kits')); ?>">Kits</a><a href="<?php echo esc_url(home_url('/loja/?tipo=baterias-e-carregadores')); ?>">Baterias e Carregadores</a><a href="<?php echo esc_url(home_url('/loja/?tipo=payloads')); ?>">Payloads</a><a href="<?php echo esc_url(home_url('/loja/?tipo=softwares')); ?>">Softwares</a><a href="<?php echo esc_url(home_url('/loja/?tipo=docas')); ?>">Docas</a><a href="<?php echo esc_url(home_url('/loja/?tipo=acessorios')); ?>">Acessórios</a></nav></div>
                <div><h2>Atendimento</h2><nav><a href="<?php echo esc_url($accountUrl); ?>">Minha conta</a><a href="<?php echo esc_url($partnerUrl); ?>">Área do parceiro</a><a href="<?php echo esc_url(home_url('/carrinho/')); ?>">Carrinho</a><a href="mailto:comercial@aerion.com.br">comercial@aerion.com.br</a><a href="https://wa.me/5511934668839">WhatsApp</a></nav></div>
                 <div class="aerion-footer__contact"><h2>Dados da Aerion</h2><p><strong><?php echo esc_html($legalName); ?></strong></p><p>CNPJ: <?php echo esc_html($legalCnpj); ?></p><p><?php echo nl2br(esc_html($legalAddress)); ?></p></div>
            </div>
            <div class="aerion-container aerion-store-payments"><div><img class="aerion-payment-shield" src="<?php echo esc_url($mpAssets.'/checkouts/basic/shield.svg'); ?>" alt=""><span>Pagamento seguro por</span><img class="aerion-payment-mercadopago" src="<?php echo esc_url($mpAssets.'/mp-logo.svg'); ?>" alt="Mercado Pago"></div><div class="aerion-payment-marks"><?php foreach($paymentMarks as[$src,$label]):?><img src="<?php echo esc_url($src); ?>" alt="<?php echo esc_attr($label); ?>" loading="lazy"><?php endforeach;?></div><div class="aerion-store-seals"><img src="<?php echo esc_url(aerion_blocks_theme_asset('images/seals/site-protegido-ssl.webp')); ?>" width="294" height="91" alt="Compra segura: site protegido com certificado SSL" loading="lazy"><a href="https://transparencyreport.google.com/safe-browsing/search?url=loja.aerion.com.br&amp;hl=pt_BR" target="_blank" rel="noopener noreferrer" title="Verificar no Google Safe Browsing"><img src="<?php echo esc_url(aerion_blocks_theme_asset('images/seals/selo-google-site-seguro.png')); ?>" width="130" height="46" alt="Google Safe Browsing: site seguro" loading="lazy"></a></div><p>Pix com <?php echo esc_html(class_exists('Aerion_Pricing') ? Aerion_Pricing::rate_label() : '5'); ?>% de desconto. Cartões disponíveis conforme as condições exibidas no checkout.</p></div>
            <div class="aerion-container aerion-footer__bottom"><div><p>© <?php echo esc_html(wp_date('Y').' '.$legalName); ?>. Todos os direitos reservados.</p><p>CNPJ: <?php echo esc_html($legalCnpj); ?></p></div><nav><button type="button" data-aerion-cookie-settings>Configurar cookies</button><a href="<?php echo esc_url(home_url('/politica-privacidade/')); ?>">Política de Privacidade</a><a href="<?php echo esc_url(home_url('/termos-uso/')); ?>">Termos de Uso</a><a href="<?php echo esc_url(home_url('/trocas-devolucoes/')); ?>">Trocas e Devoluções</a><a href="<?php echo esc_url(home_url('/garantia/')); ?>">Garantia</a><a href="<?php echo esc_url(home_url('/loja/google-merchant.xml/')); ?>">Feed de produtos</a><a href="<?php echo esc_url(home_url('/')); ?>">Site institucional</a></nav></div>
        </footer>
        <?php
        return (string) ob_get_clean();
    }
    ob_start();
    ?>
    <footer class="aerion-footer">
        <div class="aerion-container aerion-footer__grid">
            <div class="aerion-footer__brand">
                <img src="<?php echo esc_url(aerion_blocks_theme_asset('images/logo-aerion.png')); ?>" width="200" height="56" alt="Aerion Technologies">
                <p>Distribuindo o futuro da tecnologia aérea no Brasil</p>
            </div>
            <div><h2>Links Rápidos</h2><nav><a href="<?php echo esc_url(home_url('/produtos/')); ?>">Produtos</a><a href="<?php echo esc_url(home_url('/solucoes/')); ?>">Soluções</a><a href="<?php echo esc_url(home_url('/blog/')); ?>">Blog</a><a href="<?php echo esc_url(home_url('/sobre/')); ?>">Sobre</a><a href="<?php echo esc_url(home_url('/contato/')); ?>">Contato</a></nav></div>
            <div><h2>Soluções</h2><nav><a href="<?php echo esc_url(home_url('/solucoes/construcao/')); ?>">Construção</a><a href="<?php echo esc_url(home_url('/solucoes/industrial/')); ?>">Industrial</a><a href="<?php echo esc_url(home_url('/solucoes/seguranca/')); ?>">Segurança</a><a href="<?php echo esc_url(home_url('/solucoes/resgate/')); ?>">Resgate</a></nav></div>
            <div class="aerion-footer__contact">
                <h2>Contato</h2>
                <p><?php echo aerion_blocks_icon('phone'); ?><span>+55 11 5197-3319</span></p>
                <a href="https://wa.me/5511934668839"><?php echo aerion_blocks_icon('message'); ?><span>+55 11 93466-8839 (WhatsApp)</span></a>
                <a href="mailto:comercial@aerion.com.br"><?php echo aerion_blocks_icon('mail'); ?><span>comercial@aerion.com.br</span></a>
                <p><?php echo aerion_blocks_icon('pin'); ?><span><?php echo nl2br(esc_html($legalAddress)); ?></span></p>
                <a href="https://instagram.com/aerion.technologies" target="_blank" rel="noopener noreferrer"><?php echo aerion_blocks_icon('instagram'); ?><span>@aerion.technologies</span></a>
                <a href="https://linkedin.com/company/aerion-technologies-br" target="_blank" rel="noopener noreferrer"><?php echo aerion_blocks_icon('linkedin'); ?><span>@aerion-technologies-br</span></a>
            </div>
        </div>
        <div class="aerion-container aerion-footer__bottom">
            <div><p>© <?php echo esc_html(wp_date('Y').' '.$legalName); ?>. Todos os direitos reservados.</p><p>CNPJ: <?php echo esc_html($legalCnpj); ?></p></div>
            <nav><button type="button" data-aerion-cookie-settings>Configurar cookies</button><a href="<?php echo esc_url($accountUrl); ?>">Minha conta</a><a href="<?php echo esc_url($partnerUrl); ?>">Área do parceiro</a><a href="<?php echo esc_url(home_url('/politica-privacidade/')); ?>">Política de Privacidade</a><a href="<?php echo esc_url(home_url('/termos-uso/')); ?>">Termos de Uso</a><a href="<?php echo esc_url(home_url('/trocas-devolucoes/')); ?>">Trocas e Devoluções</a><a href="<?php echo esc_url(home_url('/garantia/')); ?>">Garantia</a></nav>
        </div>
    </footer>
    <?php
    return (string) ob_get_clean();
}

function aerion_render_hero_block(array $attributes): string
{
    $defaults = [
        'title' => 'A Revolução Autel Chegou ao Brasil',
        'text' => 'Tecnologia de ponta com custo-benefício superior e suporte técnico especializado local. A escolha inteligente para operações enterprise.',
        'primaryLabel' => 'Conheça os Produtos',
        'primaryUrl' => '/produtos/',
        'secondaryLabel' => 'Fale Conosco',
        'secondaryUrl' => '/contato/',
        'videoUrl' => '',
    ];
    $a = wp_parse_args($attributes, $defaults);
    $video = $a['videoUrl'] ?: aerion_blocks_theme_asset('source-videos/products/evo_max/Introducing EVO Max 4T_720.mp4');
    $props = [
        ['intelligence', 'Inteligência Artificial', 'Reconhecimento automático e navegação inteligente'],
        ['camera', 'Câmeras térmicas e 6K', 'Não perca nenhum detalhe com alta resolução'],
        ['zoom', 'Zoom até 560x', 'Detecção e identificação a longa distância'],
        ['shield', 'Proteção IP55', 'Resistente a intempéries e condições extremas'],
        ['translate', 'Software em Português', 'Interface e suporte técnico localizados'],
        ['sensor', 'Sensoriamento Inteligente', 'Sensores de colisão, antijamming e RTH'],
    ];
    ob_start();
    ?>
    <section <?php echo get_block_wrapper_attributes(['class' => 'aerion-home-hero']); ?>>
        <video class="aerion-home-hero__video" autoplay muted loop playsinline preload="metadata"><source src="<?php echo esc_url($video); ?>" type="video/mp4"></video>
        <div class="aerion-home-hero__overlay"></div>
        <div class="aerion-container aerion-home-hero__content">
            <h1><?php echo wp_kses_post($a['title']); ?></h1>
            <p class="aerion-home-hero__lead"><?php echo wp_kses_post($a['text']); ?></p>
            <div class="aerion-home-hero__props">
                <?php foreach ($props as [$icon, $title, $description]) : ?>
                    <div><span class="aerion-home-hero__prop-icon"><?php echo aerion_blocks_icon($icon); ?></span><p><strong><?php echo esc_html($title); ?></strong><small><?php echo esc_html($description); ?></small></p></div>
                <?php endforeach; ?>
            </div>
            <div class="aerion-actions"><a class="aerion-button" href="<?php echo esc_url($a['primaryUrl']); ?>"><?php echo esc_html($a['primaryLabel']); ?><?php echo aerion_blocks_icon('arrow'); ?></a><a class="aerion-button aerion-button--glass" href="<?php echo esc_url($a['secondaryUrl']); ?>"><?php echo esc_html($a['secondaryLabel']); ?></a></div>
        </div>
    </section>
    <?php
    return (string) ob_get_clean();
}

function aerion_blocks_editorial_product_card(array $product, array $options = []): string
{
    $slug = sanitize_title((string) ($product['slug'] ?? ''));
    $card = is_array($product['editorialCard'] ?? null) ? $product['editorialCard'] : [];
    $image = (string) ($card['image'] ?? (($product['photoGallery']['product'][0] ?? null) ?: ($product['gallery'][0] ?? $product['fallbackImage'] ?? '')));
    $tagline = (string) ($card['tagline'] ?? ($product['variants'][0]['description'] ?? 'Tecnologia Autel Enterprise'));
    $description = array_key_exists('description', $options)
        ? (string) $options['description']
        : (string) ($card['description'] ?? $product['description'] ?? '');
    $specifications = ! empty($options['hideSpecifications'])
        ? []
        : array_slice(array_values(array_filter(array_map('strval', (array) ($card['specifications'] ?? $product['keyFeatures'] ?? [])))), 0, 2);
    $fit = ($card['imageFit'] ?? '') === 'contain' ? 'contain' : 'cover';
    $brand = trim((string) ($options['brand'] ?? ''));
    $badge = trim((string) ($options['badge'] ?? ''));
    ob_start();
    ?>
    <article class="aerion-editorial-product-card">
        <a href="<?php echo esc_url(home_url('/produtos/' . $slug . '/')); ?>">
            <div class="aerion-editorial-product-card__image is-<?php echo esc_attr($fit); ?>">
                <?php if ($image !== '') : ?><img src="<?php echo esc_url(aerion_blocks_product_asset_url($image)); ?>" alt="<?php echo esc_attr((string) ($product['name'] ?? 'Produto Autel')); ?>" width="400" height="192" loading="lazy"><?php endif; ?>
            </div>
            <div class="aerion-editorial-product-card__body">
                <?php if ($brand !== '' || $badge !== '') : ?><div class="aerion-editorial-product-card__meta"><?php if ($brand !== '') : ?><span><?php echo esc_html($brand); ?></span><?php endif; ?><?php if ($badge !== '') : ?><small><?php echo esc_html($badge); ?></small><?php endif; ?></div><?php endif; ?>
                <header><h2><?php echo esc_html((string) ($product['name'] ?? '')); ?></h2><p><?php echo esc_html($tagline); ?></p></header>
                <p class="aerion-editorial-product-card__description"><?php echo esc_html($description); ?></p>
                <?php if ($specifications) : ?><div class="aerion-editorial-product-card__specifications"><strong>Especificações Principais:</strong><ul><?php foreach ($specifications as $specification) : ?><li><span class="aerion-list-marker" aria-hidden="true"></span><span><?php echo esc_html($specification); ?></span></li><?php endforeach; ?></ul></div><?php endif; ?>
                <span class="aerion-text-link">Saber mais <?php echo aerion_blocks_icon('arrow'); ?></span>
            </div>
        </a>
    </article>
    <?php
    return (string) ob_get_clean();
}

function aerion_render_products_showcase_block(array $attributes): string
{
    if (! class_exists('Aerion_Institutional_Catalog')) return '';
    $defaultSubtitle = 'Tecnologia de ponta que transforma operações enterprise em resultados mensuráveis';
    $subtitle = trim((string) ($attributes['subtitle'] ?? '')) ?: $defaultSubtitle;
    $isIndex = is_page('produtos');
    if ($isIndex) {
        $catalogItems = [
            ['hubsan-mini-7', 'hubsan', 'drones', 'HUBSAN', 'Lançamento', 'Drone sub-249 g com sensor de 1", 48 MP, vídeo 4K e controle com tela integrada.'],
            ['evo-lite-enterprise', 'autel', 'drones', 'AUTEL ROBOTICS', '', 'Drone compacto com câmera térmica ou 6K, até 40 minutos de voo e transmissão a 12 km.'],
            ['evo-max-v2', 'autel', 'drones', 'AUTEL ROBOTICS', '', 'Drone multissensor com navegação autônoma, câmera térmica e operação segura mesmo sem GNSS.'],
            ['autel-alpha', 'autel', 'drones', 'AUTEL ROBOTICS', '', 'Drone industrial IP55 com gimbal multissensor, zoom óptico 35× e alcance de até 30 km.'],
            ['evo-nest', 'autel', 'docks', 'AUTEL ROBOTICS', '', 'Estação autônoma para decolagem, pouso e recarga da série EVO, pronta para operação remota.'],
            ['autel-mapper', 'autel', 'softwares', 'AUTEL ROBOTICS', '', 'Software de reconstrução 2D e 3D para mapeamento, topografia e inspeções com precisão profissional.'],
        ];
        $catalogProducts = [];
        foreach ($catalogItems as [$slug, $brand, $category, $brandLabel, $badge, $cardDescription]) {
            $product = Aerion_Institutional_Catalog::get($slug);
            if ($product) $catalogProducts[] = compact('product', 'brand', 'category', 'brandLabel', 'badge', 'cardDescription');
        }
        if (! $catalogProducts) return '';
        ob_start();
        ?>
        <section <?php echo get_block_wrapper_attributes(['class' => 'aerion-home-section aerion-products-catalog']); ?> data-product-catalog>
            <div class="aerion-container">
                <header class="aerion-products-catalog__header">
                    <span>Portfólio Aerion</span>
                    <h1>Produtos</h1>
                </header>
                <div class="aerion-products-catalog__filters" aria-label="Filtros do catálogo">
                    <div class="aerion-products-catalog__filter-group">
                        <strong>Fabricante</strong>
                        <div><button type="button" class="is-active" data-filter-kind="brand" data-filter-value="all" aria-pressed="true">Todos</button><button type="button" class="has-logo" data-filter-kind="brand" data-filter-value="hubsan" aria-pressed="false" aria-label="HUBSAN"><img src="<?php echo esc_url(aerion_blocks_theme_asset('images/hubsan-logo.svg')); ?>" alt="HUBSAN"></button><button type="button" class="has-logo" data-filter-kind="brand" data-filter-value="autel" aria-pressed="false" aria-label="Autel Robotics"><img src="<?php echo esc_url(aerion_blocks_theme_asset('images/autel-logo.png')); ?>" alt="Autel Robotics"></button></div>
                    </div>
                    <div class="aerion-products-catalog__filter-group">
                        <strong>Categoria</strong>
                        <div><button type="button" class="is-active" data-filter-kind="category" data-filter-value="all" aria-pressed="true">Todos</button><button type="button" data-filter-kind="category" data-filter-value="drones" aria-pressed="false">Drones</button><button type="button" data-filter-kind="category" data-filter-value="docks" aria-pressed="false">Docks</button><button type="button" data-filter-kind="category" data-filter-value="softwares" aria-pressed="false">Softwares</button></div>
                    </div>
                </div>
                <p class="aerion-products-catalog__count" aria-live="polite"><strong data-catalog-count><?php echo esc_html((string) count($catalogProducts)); ?></strong> <span data-catalog-count-label>produtos</span></p>
                <div class="aerion-editorial-product-grid aerion-products-catalog__grid">
                    <?php foreach ($catalogProducts as $item) : ?>
                        <div class="aerion-products-catalog__item" data-brand="<?php echo esc_attr($item['brand']); ?>" data-category="<?php echo esc_attr($item['category']); ?>"><?php echo aerion_blocks_editorial_product_card($item['product'], ['brand' => $item['brandLabel'], 'badge' => $item['badge'], 'description' => $item['cardDescription'], 'hideSpecifications' => true]); ?></div>
                    <?php endforeach; ?>
                </div>
                <p class="aerion-products-catalog__empty" hidden>Nenhum produto corresponde a esses filtros.</p>
            </div>
        </section>
        <?php
        return (string) ob_get_clean();
    }
    $slugs = ['evo-lite-enterprise', 'evo-max-v2', 'autel-alpha', 'evo-nest', 'autel-mapper'];
    $count = max(1, min(3, (int) ($attributes['count'] ?? 3)));
    $products = [];
    foreach (array_slice($slugs, 0, $count) as $slug) {
        $product = Aerion_Institutional_Catalog::get($slug);
        if ($product) $products[] = $product;
    }
    if (! $products) return '';
    ob_start();
    ?>
    <section <?php echo get_block_wrapper_attributes(['class' => 'aerion-home-section aerion-products-showcase']); ?>>
        <div class="aerion-container">
            <header class="aerion-section-heading"><img src="<?php echo esc_url(aerion_blocks_theme_asset('images/autel-logo.png')); ?>" alt="Autel Robotics"><p><?php echo wp_kses_post($subtitle); ?></p></header>
            <div class="aerion-editorial-product-grid"><?php foreach ($products as $product) echo aerion_blocks_editorial_product_card($product); ?></div>
            <p class="aerion-section-cta"><a class="aerion-button aerion-button--outline" href="<?php echo esc_url(home_url('/produtos/')); ?>">Ver Todos os Produtos</a></p>
        </div>
    </section>
    <?php
    return (string) ob_get_clean();
}

function aerion_render_solutions_showcase_block(array $attributes): string
{
    $items = [
        ['Construção e Topografia', 'construcao', 'Agilidade e precisão em obras e mapeamento', 'source-images/lifestyle/construction-1.jpeg'],
        ['Inspeção Industrial e Energia', 'industrial', 'Precisão e segurança operacional', 'source-images/lifestyle/oil-and-gas-1.jpg'],
        ['Segurança Pública e Defesa Civil', 'seguranca', 'Proteção e resposta estratégica', 'source-images/lifestyle/public-safety-1-alpha.jpg'],
        ['Resgate e Emergências', 'resgate', 'Salvamento e preservação de vidas', 'source-images/lifestyle/rescue-2.jpg'],
    ];
    $title = $attributes['title'] ?? 'Soluções para Cada Segmento';
    $subtitle = $attributes['subtitle'] ?? 'Descubra como nossa tecnologia pode transformar suas operações em diferentes setores e aplicações';
    if (is_page('solucoes')) {
        $snapshotTitle = 'Soluções Especializadas por Vertical';
        $snapshotLead = 'Expertise específica para as principais aplicações de tecnologia aérea enterprise';
        $pageTitle = $title === 'Soluções para Cada Segmento' ? $snapshotTitle : (string) $title;
        $pageLead = $subtitle === 'Descubra como nossa tecnologia pode transformar suas operações em diferentes setores e aplicações' ? $snapshotLead : (string) $subtitle;
        $snapshot = aerion_blocks_page_snapshot('solucoes');
        if ($snapshot !== '') {
            return str_replace(
                [$snapshotTitle, $snapshotLead],
                [esc_html($pageTitle), esc_html($pageLead)],
                $snapshot
            );
        }
    }
    ob_start();
    ?>
    <section <?php echo get_block_wrapper_attributes(['class' => 'aerion-home-section aerion-solutions-showcase']); ?>><div class="aerion-container">
        <header class="aerion-section-heading"><h2><?php echo wp_kses_post($title); ?></h2><p><?php echo wp_kses_post($subtitle); ?></p></header>
        <div class="aerion-solution-grid">
            <?php foreach ($items as [$name, $slug, $description, $image]) : ?>
                <article class="aerion-solution-card"><a href="<?php echo esc_url(home_url('/solucoes/' . $slug . '/')); ?>"><div class="aerion-solution-card__image"><img src="<?php echo esc_url(aerion_blocks_theme_asset($image)); ?>" alt="<?php echo esc_attr($name); ?>" loading="lazy"><h3><?php echo esc_html($name); ?></h3></div><div class="aerion-solution-card__body"><p><?php echo esc_html($description); ?></p><span class="aerion-text-link">Saiba mais <?php echo aerion_blocks_icon('arrow'); ?></span></div></a></article>
            <?php endforeach; ?>
        </div>
    </div></section>
    <?php
    return (string) ob_get_clean();
}

function aerion_render_benefits_block(array $attributes): string
{
    $items = [
        ['technology', 'Tecnologia de Ponta', 'Drones Autel com tecnologia digna de um dos líderes globais, oferecendo desempenho excepcional em aplicações enterprise', ['Anti-interferência superior', 'Navegação visual de alta precisão', 'Sistema A-Mesh para colaboração', 'Reconhecimento de alvos por IA']],
        ['roi', 'Custo-Benefício Superior', 'Investimento estratégico que se paga rapidamente através de eficiência operacional e redução significativa de custos', ['ROI mensurável em meses', 'Redução de custos operacionais', 'Menor necessidade de presença física', 'Autonomia e eficiência energética']],
        ['support', 'Suporte Integral', 'Suporte técnico especializado local, treinamento completo e acompanhamento pós-venda diferenciado', ['Especialistas brasileiros', 'Treinamento personalizado', 'Suporte técnico local', 'Acompanhamento contínuo']],
    ];
    $title = $attributes['title'] ?? 'Por que escolher a AERION?';
    $subtitle = $attributes['subtitle'] ?? 'Soluções completas em tecnologia de drones para seu negócio';
    ob_start();
    ?>
    <section <?php echo get_block_wrapper_attributes(['class' => 'aerion-home-section aerion-benefits']); ?>><div class="aerion-container">
        <header class="aerion-section-heading"><h2><?php echo wp_kses_post($title); ?></h2><p><?php echo wp_kses_post($subtitle); ?></p></header>
        <div class="aerion-benefit-grid"><?php foreach ($items as [$icon, $itemTitle, $description, $features]) : ?><article class="aerion-benefit-card"><span class="aerion-benefit-card__icon"><?php echo aerion_blocks_clay_icon($icon); ?></span><h3><?php echo esc_html($itemTitle); ?></h3><p><?php echo esc_html($description); ?></p><ul><?php foreach ($features as $feature) : ?><li><?php echo aerion_blocks_icon('check'); ?><?php echo esc_html($feature); ?></li><?php endforeach; ?></ul></article><?php endforeach; ?></div>
    </div></section>
    <?php
    return (string) ob_get_clean();
}

function aerion_render_about_page_block(array $attributes): string
{
    $defaults = [
        // Estes valores precisam bater exatamente com o snapshot page-sobre.html:
        // é por eles que a substituição editorial encontra o texto na página.
        'title' => 'Nossa História',
        'subtitle' => 'Distribuidora oficial da Autel Robotics no Brasil, com garantia nacional de 1 ano e suporte técnico em português.',
        'storyOne' => 'A Aerion Technologies é a distribuidora oficial da Autel Robotics no Brasil. Trabalhamos a linha Enterprise inteira — EVO Lite Enterprise, EVO Max V2, Autel Alpha, a estação autônoma EVO Nest e o software Autel Mapper — a partir de São Paulo, no Brooklin Novo.',
        'storyTwo' => 'Vender o equipamento é a parte fácil. O que trava a adoção de drone profissional no Brasil vem depois: nota fiscal, garantia, peça de reposição e alguém que atenda em português quando a aeronave para no meio da operação. Foi por isso que montamos suporte técnico local, garantia nacional de 1 ano e uma rede de revendas — em vez de deixar o cliente sozinho com um equipamento importado.',
        'storyThree' => 'Levamos os drones para teste onde eles vão trabalhar. Foi assim no Comando de Aviação da Polícia Militar de São Paulo, no Hangar João Negão, onde a linha Enterprise foi avaliada em cenário real de patrulhamento e resgate. Ficha técnica não substitui operação.',
        'missionTitle' => 'Nossa Missão',
        'missionText' => 'Levar a linha Enterprise da Autel às operações brasileiras com garantia nacional de 1 ano, suporte em português e treinamento por vertical.',
        'visionTitle' => 'Nossa Visão 2028',
        'visionText' => 'Consolidar a rede nacional de revendas Autel e tornar o suporte técnico local o padrão do mercado brasileiro de drones profissionais.',
        'valuesTitle' => 'Nossos Valores',
        'valueOne' => 'Suporte em português, por quem opera',
        'valueTwo' => 'Garantia e peças de reposição no Brasil',
        'valueThree' => 'Indicação técnica, não venda de catálogo',
        'autelText' => 'A fabricante por trás dos equipamentos que distribuímos',
    ];
    $a = wp_parse_args($attributes, $defaults);
    if (is_page('sobre')) {
        $snapshot = aerion_blocks_page_snapshot('sobre');
        if ($snapshot !== '') {
            $search = [];
            $replace = [];
            foreach ($defaults as $key => $defaultValue) {
                $search[] = $defaultValue;
                $replace[] = esc_html((string) ($a[$key] ?? $defaultValue));
            }
            return str_replace($search, $replace, $snapshot);
        }
    }
    ob_start();
    ?>
    <section <?php echo get_block_wrapper_attributes(['class' => 'aerion-about-page']); ?>>
        <div class="aerion-container aerion-breadcrumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a><span>/</span><span>Sobre</span></div>
        <div class="aerion-about-story">
            <div class="aerion-container aerion-about-story__inner">
                <header class="aerion-section-heading"><h1><?php echo wp_kses_post($a['title']); ?></h1><p><?php echo wp_kses_post($a['subtitle']); ?></p></header>
                <div class="aerion-about-story__card"><p><?php echo wp_kses_post($a['storyOne']); ?></p><p><?php echo wp_kses_post($a['storyTwo']); ?></p><p><?php echo wp_kses_post($a['storyThree']); ?></p></div>
            </div>
        </div>
        <div class="aerion-about-pillars"><div class="aerion-container aerion-about-pillars__grid">
            <article><span><?php echo aerion_blocks_clay_icon('mission'); ?></span><h2><?php echo wp_kses_post($a['missionTitle']); ?></h2><p><?php echo wp_kses_post($a['missionText']); ?></p></article>
            <article><span><?php echo aerion_blocks_clay_icon('vision'); ?></span><h2><?php echo wp_kses_post($a['visionTitle']); ?></h2><p><?php echo wp_kses_post($a['visionText']); ?></p></article>
            <article><span><?php echo aerion_blocks_clay_icon('values'); ?></span><h2><?php echo wp_kses_post($a['valuesTitle']); ?></h2><ul><li><?php echo aerion_blocks_icon('check'); ?><?php echo wp_kses_post($a['valueOne']); ?></li><li><?php echo aerion_blocks_icon('check'); ?><?php echo wp_kses_post($a['valueTwo']); ?></li><li><?php echo aerion_blocks_icon('check'); ?><?php echo wp_kses_post($a['valueThree']); ?></li></ul></article>
        </div></div>
        <div class="aerion-about-autel"><div class="aerion-container"><header class="aerion-section-heading"><img src="<?php echo esc_url(aerion_blocks_theme_asset('images/autel-logo.png')); ?>" alt="Autel Robotics"><p><?php echo wp_kses_post($a['autelText']); ?></p></header>
            <div class="aerion-about-autel__grid"><div>
                <h3>Presença Global</h3><p>Presente em mais de 70 países, a Autel Robotics é hoje um dos maiores fabricantes globais de drones profissionais.</p>
                <h3>Reconhecimento Mundial</h3><p>Reconhecida por sua precisão, confiabilidade e inovação tecnológica em aplicações enterprise.</p>
                <h3>Parceria Estratégica no Brasil</h3><p>No Brasil, a Aerion Technologies é o distribuidor oficial, responsável por construir a rede nacional de revendas Autel.</p>
            </div><aside><h3>Vantagens da Parceria Oficial</h3><ul><li><?php echo aerion_blocks_icon('check'); ?>Suporte técnico em português</li><li><?php echo aerion_blocks_icon('check'); ?>Pós-venda local especializado</li><li><?php echo aerion_blocks_icon('check'); ?>Garantia nacional completa</li><li><?php echo aerion_blocks_icon('check'); ?>Condições comerciais diferenciadas</li><li><?php echo aerion_blocks_icon('check'); ?>Parcerias estratégicas prioritárias</li></ul></aside></div>
        </div></div>
        <div class="aerion-about-differentials"><div class="aerion-container aerion-about-differentials__inner">
            <article><span><?php echo aerion_blocks_clay_icon('technology'); ?></span><div><h3>Tecnologia Autel — Padrão de Líder Global</h3><p>Oferecemos drones com tecnologia de ponta, desenvolvida por uma das líderes globais do setor. Nossas soluções entregam desempenho excepcional em aplicações profissionais — combinando precisão, robustez e confiabilidade — com um custo-benefício altamente competitivo, superando os principais concorrentes do mercado enterprise.</p></div></article>
            <article><span><?php echo aerion_blocks_clay_icon('support'); ?></span><div><h3>Suporte Técnico Local Especializado</h3><p>Equipe brasileira de especialistas que compreende as necessidades específicas do mercado local e oferece suporte em português com agilidade.</p></div></article>
            <article><span><?php echo aerion_blocks_clay_icon('precision'); ?></span><div><h3>Especialização por Vertical</h3><p>Conhecimento profundo das necessidades específicas de cada setor, permitindo recomendações precisas e treinamento customizado.</p></div></article>
        </div></div>
    </section>
    <?php
    return (string) ob_get_clean();
}

function aerion_render_solution_detail_block(array $attributes): string
{
    $solutions = [
        'seguranca' => [
            'label' => 'Segurança Pública e Defesa Civil',
            'title' => 'Proteção e Resposta Estratégica',
            'description' => 'Amplie suas capacidades operacionais com tecnologia de vigilância avançada. Visão 360°, patrulha inteligente, gestão de tráfego urbano e resposta rápida a emergências com visão noturna de última geração.',
            'image' => 'images/solutions/security-hero.jpg',
            'benefitsTitle' => 'Por que drones para segurança pública?',
            'benefitsLead' => 'Tecnologia que revoluciona a proteção e resposta a emergências',
            'benefits' => [['Visão 360°', 'Monitoramento completo de áreas extensas'], ['Resposta Rápida', 'Chegada em minutos a qualquer local'], ['Segurança', 'Operações sem exposição de pessoal'], ['Documentação', 'Evidências em tempo real com vídeo 4K']],
            'applicationsTitle' => 'Aplicações em Segurança Pública',
            'applications' => [['Patrulhamento Inteligente', 'Monitoramento proativo de áreas urbanas e rurais'], ['Busca e Resgate', 'Localização eficiente de pessoas desaparecidas'], ['Gestão de Tráfego', 'Monitoramento e fiscalização de trânsito'], ['Monitoramento de Eventos', 'Segurança em eventos de massa e manifestações']],
        ],
        'industrial' => [
            'label' => 'Inspeção Industrial e Energia',
            'title' => 'Precisão e Segurança Operacional',
            'description' => 'Maximize a eficiência e segurança das suas instalações. Inspeções térmicas avançadas em energia, óleo & gás, mineração, detecção precoce de hotspots e operações BVLOS que reduzem paradas não planejadas em até 60%.',
            'image' => 'images/solutions/industrial.jpg',
            'benefitsTitle' => 'Por que drones para inspeção industrial?',
            'benefitsLead' => 'Tecnologia que revoluciona a manutenção preditiva e segurança operacional',
            'benefits' => [['Segurança', 'Inspeções sem exposição a riscos operacionais'], ['Detecção Térmica', 'Identificação precoce de falhas e hotspots'], ['Visão Noturna', 'Monitoramento 24/7 com tecnologia Starlight'], ['Precisão', 'Inspeções detalhadas com zoom até 560x']],
            'applicationsTitle' => 'Setores Atendidos',
            'applications' => [['Energia Solar', 'Inspeção térmica de painéis solares e detecção de falhas'], ['Óleo & Gás', 'Monitoramento de oleodutos, gasodutos e instalações offshore'], ['Mineração', 'Inspeção de equipamentos, pilhas de rejeito e áreas de risco'], ['Transmissão de Energia', 'Inspeção de linhas, torres e subestações']],
        ],
        'construcao' => [
            'label' => 'Construção e Topografia',
            'title' => 'Agilidade e Precisão em Obras e Mapeamento',
            'description' => 'Transforme suas obras com tecnologia aérea de ponta. Levantamentos topográficos com precisão centimétrica, modelagem BIM, mapeamento urbano e medição de volumes com eficiência incomparável.',
            'image' => 'images/solutions/construction-hero.jpeg',
            'benefitsTitle' => 'Por que escolher drones para construção?',
            'benefitsLead' => 'Tecnologia que revoluciona a forma como você planeja, executa e monitora seus projetos',
            'benefits' => [['Agilidade', 'Levantamentos 10x mais rápidos que métodos tradicionais'], ['Precisão', 'Acurácia centimétrica com RTK integrado'], ['Documentação', 'Imagens e vídeos 4K para documentação completa'], ['Modelagem 3D', 'Ortofotos e modelos 3D para projetos BIM']],
            'applicationsTitle' => 'Aplicações em Construção e Topografia',
            'applications' => [['Levantamentos Topográficos', 'Mapeamento preciso de terrenos para projetos de engenharia'], ['Inspeção de Estruturas', 'Verificação térmica e visual de edifícios e pontes'], ['Mapeamento Urbano', 'Cadastro territorial e planejamento urbano'], ['Medição de Volumes', 'Cálculo preciso de volumes de terra e materiais']],
        ],
        'resgate' => [
            'label' => 'Resgate e Emergências',
            'title' => 'Salvamento e Preservação de Vidas',
            'description' => 'Salve vidas com tecnologia que não falha. Busca e resgate eficaz, combate a incêndios florestais, localização de vítimas em minutos e avaliação de danos em tempo real, mesmo em áreas remotas.',
            'image' => 'images/solutions/rescue.jpg',
            'benefitsTitle' => 'Por que drones para resgate e emergências?',
            'benefitsLead' => 'Tecnologia que salva vidas em situações críticas',
            'benefits' => [['Resposta Rápida', 'Chegada em minutos a qualquer local de emergência'], ['Detecção Térmica', 'Localização de vítimas mesmo em condições adversas'], ['Visão Noturna', 'Operações 24/7 com tecnologia Starlight'], ['Salvamento', 'Tecnologia que salva vidas em situações críticas']],
            'applicationsTitle' => 'Aplicações em Resgate e Emergências',
            'applications' => [['Busca e Resgate de Vítimas', 'Localização eficiente de pessoas desaparecidas com câmera térmica'], ['Combate a Incêndios Florestais', 'Prevenção e combate eficaz com detecção precoce'], ['Resposta a Desastres', 'Avaliação rápida de danos e coordenação de resgate'], ['Monitoramento Ambiental', 'Prevenção de queimadas e monitoramento de áreas de risco']],
        ],
    ];
    $key = sanitize_key((string) ($attributes['solution'] ?? 'seguranca'));
    $solution = $solutions[$key] ?? $solutions['seguranca'];
    $title = trim((string) ($attributes['title'] ?? '')) ?: $solution['title'];
    $description = trim((string) ($attributes['description'] ?? '')) ?: $solution['description'];
    ob_start();
    ?>
    <article <?php echo get_block_wrapper_attributes(['class' => 'aerion-solution-detail aerion-solution-detail--' . $key]); ?>>
        <div class="aerion-container aerion-breadcrumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a><span>/</span><a href="<?php echo esc_url(home_url('/solucoes/')); ?>">Soluções</a><span>/</span><span><?php echo esc_html($solution['label']); ?></span></div>
        <section class="aerion-solution-hero"><div class="aerion-container aerion-solution-hero__grid"><div><span class="aerion-segment-badge"><?php echo esc_html($solution['label']); ?></span><h1><?php echo wp_kses_post($title); ?></h1><p><?php echo wp_kses_post($description); ?></p><div class="aerion-actions"><a class="aerion-button" href="<?php echo esc_url(home_url('/contato/')); ?>">Tire suas dúvidas <?php echo aerion_blocks_icon('arrow'); ?></a><a class="aerion-button aerion-button--outline" href="<?php echo esc_url(home_url('/produtos/')); ?>">Ver Drones</a></div></div><img src="<?php echo esc_url(aerion_blocks_theme_asset($solution['image'])); ?>" alt="<?php echo esc_attr($solution['label']); ?>"></div></section>
        <section class="aerion-solution-detail__section"><div class="aerion-container"><header class="aerion-section-heading"><h2><?php echo esc_html($solution['benefitsTitle']); ?></h2><p><?php echo esc_html($solution['benefitsLead']); ?></p></header><div class="aerion-solution-benefits"><?php foreach ($solution['benefits'] as [$itemTitle, $itemText]) : ?><article><span><?php echo aerion_blocks_clay_icon(aerion_blocks_benefit_icon($itemTitle)); ?></span><h3><?php echo esc_html($itemTitle); ?></h3><p><?php echo esc_html($itemText); ?></p></article><?php endforeach; ?></div></div></section>
        <?php echo aerion_render_solution_extended($key, $solution); ?>
        <section class="aerion-solution-detail__cta"><div class="aerion-container"><h2>Leve esta tecnologia para sua operação</h2><p>Converse com os especialistas da Aerion para definir equipamentos, treinamento e suporte.</p><a class="aerion-button" href="<?php echo esc_url(home_url('/contato/')); ?>">Falar com a Aerion</a></div></section>
    </article>
    <?php
    return (string) ob_get_clean();
}

function aerion_render_contact_form_block(array $attributes): string
{
    $title = $attributes['title'] ?? 'Pronto para Começar?';
    $subtitle = $attributes['subtitle'] ?? 'Entre em contato e descubra como podemos transformar suas operações';
    $formId = max(1, absint(get_option('aerion_contact_form_id', 1)));
    $formHtml = do_shortcode('[fluentform id="' . $formId . '"]');
    if (is_page('contato')) {
        $snapshotTitle = 'Entre em Contato';
        $snapshotLead = 'Pronto para revolucionar suas operações? Nossa equipe de especialistas está pronta para ajudar você a escolher a solução ideal para seu negócio';
        $legacyTitles = ['Pronto para Começar?', 'Fale com a Aerion'];
        $legacyLeads = [
            'Entre em contato e descubra como podemos transformar suas operações',
            'Conte sua necessidade e nossa equipe entrará em contato',
        ];
        $pageTitle = in_array($title, $legacyTitles, true) ? $snapshotTitle : (string) $title;
        $pageLead = in_array($subtitle, $legacyLeads, true) ? $snapshotLead : (string) $subtitle;
        $snapshot = aerion_blocks_page_snapshot('contato', ['{{contact_form}}' => $formHtml]);
        if ($snapshot !== '') {
            return str_replace(
                [$snapshotTitle, $snapshotLead],
                [esc_html($pageTitle), esc_html($pageLead)],
                $snapshot
            );
        }
    }
    ob_start();
    ?>
    <section <?php echo get_block_wrapper_attributes(['class' => 'aerion-home-section aerion-home-contact']); ?>><div class="aerion-container aerion-home-contact__inner"><header class="aerion-section-heading"><h2><?php echo wp_kses_post($title); ?></h2><p><?php echo wp_kses_post($subtitle); ?></p></header><div class="aerion-home-contact__form"><?php echo $formHtml; ?></div></div></section>
    <?php
    return (string) ob_get_clean();
}

function aerion_render_contact_cta_block(array $attributes): string
{
    $a = wp_parse_args($attributes, ['title' => 'Vamos projetar a solução certa?', 'text' => 'Converse com a equipe técnica da Aerion.', 'label' => 'Entrar em contato', 'url' => '/contato/']);
    return '<section ' . get_block_wrapper_attributes(['class' => 'aerion-contact-cta']) . '><div><h2>' . wp_kses_post($a['title']) . '</h2><p>' . wp_kses_post($a['text']) . '</p></div><a class="aerion-button" href="' . esc_url($a['url']) . '">' . esc_html($a['label']) . '</a></section>';
}

function aerion_render_specs_block(array $attributes): string
{
    $title = $attributes['title'] ?? 'Especificações técnicas';
    $items = is_array($attributes['items'] ?? null) ? $attributes['items'] : [];
    $html = '<section ' . get_block_wrapper_attributes() . '><h2>' . wp_kses_post($title) . '</h2><dl class="aerion-specs">';
    foreach ($items as $item) {
        $html .= '<div class="aerion-specs__row"><dt>' . esc_html((string) ($item['label'] ?? '')) . '</dt><dd>' . esc_html((string) ($item['value'] ?? '')) . '</dd></div>';
    }
    return $html . '</dl></section>';
}
