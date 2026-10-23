<?php
/**
 * Carrossel da abertura da home, alimentado pelo editor de blocos.
 *
 * @package AerionBlocks
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Diferenciais exibidos abaixo do texto do slide ativo.
 *
 * @return list<array{0:string,1:string,2:string}>
 */
function aerion_hero_carousel_props(): array
{
    return [
        ['intelligence', 'Inteligência Artificial', 'Reconhecimento automático e navegação inteligente'],
        ['camera', 'Câmeras térmicas e 6K', 'Não perca nenhum detalhe com alta resolução'],
        ['zoom', 'Zoom até 560x', 'Detecção e identificação a longa distância'],
        ['shield', 'Proteção IP55', 'Resistente a intempéries e condições extremas'],
        ['translate', 'Software em Português', 'Interface e suporte técnico localizados'],
        ['sensor', 'Sensoriamento Inteligente', 'Sensores de colisão, antijamming e RTH'],
    ];
}

/**
 * Variantes WebP de uma arte do tema, geradas ao lado do original como
 * `nome-<largura>.webp`. Devolve [] para URL fora do tema ou sem variantes,
 * e o chamador cai no arquivo original.
 *
 * @return list<array{url:string,width:int,height:int}>
 */
function aerion_hero_webp_variants(string $url): array
{
    static $cache = [];
    if (isset($cache[$url])) {
        return $cache[$url];
    }

    $base = get_theme_file_uri('assets/');
    if (strpos($url, $base) !== 0) {
        return $cache[$url] = [];
    }
    $relative = substr($url, strlen($base));
    $stem = preg_replace('/\.[a-z0-9]+$/i', '', $relative);
    $files = glob(get_theme_file_path('assets/' . $stem) . '-*.webp') ?: [];

    $variants = [];
    $name = preg_quote(basename($stem), '/');
    foreach ($files as $file) {
        // `hero-*.webp` também casaria `hero-mobile-600.webp`: exige só número após o nome.
        $size = preg_match('/^' . $name . '-(\d+)\.webp$/', basename($file), $match) ? @getimagesize($file) : false;
        if (! $size || (int) $match[1] !== (int) $size[0]) {
            continue;
        }
        $variants[] = [
            'url' => $base . $stem . '-' . $size[0] . '.webp',
            'width' => (int) $size[0],
            'height' => (int) $size[1],
        ];
    }
    usort($variants, static fn (array $a, array $b): int => $a['width'] <=> $b['width']);

    return $cache[$url] = $variants;
}

function aerion_hero_webp_srcset(array $variants): string
{
    return implode(', ', array_map(static fn (array $v): string => esc_url($v['url']) . ' ' . $v['width'] . 'w', $variants));
}

function aerion_render_hero_carousel_block(array $attributes): string
{
    $slides = isset($attributes['slides']) && is_array($attributes['slides']) ? $attributes['slides'] : [];
    $slides = array_values(array_filter($slides, static fn ($slide): bool => is_array($slide)));

    if (! $slides) {
        return current_user_can('edit_posts')
            ? '<div class="aerion-container aerion-editor-placeholder"><p>Nenhum slide configurado no carrossel.</p></div>'
            : '';
    }

    $autoplay = ! isset($attributes['autoplay']) || $attributes['autoplay'];
    $interval = max(3, (int) ($attributes['interval'] ?? 7));
    $fallbackVideo = aerion_blocks_theme_asset('source-videos/products/evo_max/Introducing EVO Max 4T_720.mp4');

    ob_start();
    ?>
    <section <?php echo get_block_wrapper_attributes([
        'class' => 'aerion-home-hero aerion-hero-carousel',
    ]); ?> data-aerion-carousel data-aerion-carousel-autoplay="<?php echo $autoplay ? '1' : '0'; ?>" data-aerion-carousel-interval="<?php echo esc_attr((string) $interval); ?>">
        <div class="aerion-hero-carousel__track" data-aerion-carousel-track>
            <?php foreach ($slides as $index => $slide) : ?>
                <?php
                $mediaType = ($slide['mediaType'] ?? 'image') === 'video' ? 'video' : 'image';
                $mediaUrl = trim((string) ($slide['mediaUrl'] ?? ''));
                $mediaMobileUrl = trim((string) ($slide['mediaMobileUrl'] ?? ''));
                $slideUrl = trim((string) ($slide['slideUrl'] ?? ''));
                if ($slideUrl === '' && $index === 0) {
                    $slideUrl = '/loja/';
                }
                if ($mediaUrl === '' && $mediaType === 'video') {
                    $mediaUrl = $fallbackVideo;
                }
                // Um caminho relativo vira asset do tema. Sem isso um slide
                // padrao definido em block.json so poderia apontar para uma URL
                // absoluta, que muda entre local, staging e producao e sempre
                // quebra em uma das tres. A midia escolhida na biblioteca pelo
                // editor continua chegando absoluta e passa direto.
                if ($mediaUrl !== '' && ! preg_match('#^(https?:)?//#', $mediaUrl)) {
                    $mediaUrl = aerion_blocks_theme_asset($mediaUrl);
                }
                if ($mediaMobileUrl === '' && $index === 0 && strpos($mediaUrl, '/campaigns/lancamento-mini-7/hero.png') !== false) {
                    $mediaMobileUrl = aerion_blocks_theme_asset('source-images/campaigns/lancamento-mini-7/hero-mobile.png');
                }
                if ($mediaMobileUrl !== '' && ! preg_match('#^(https?:)?//#', $mediaMobileUrl)) {
                    $mediaMobileUrl = aerion_blocks_theme_asset($mediaMobileUrl);
                }
                // Cada slide controla o próprio véu: uma arte pronta pode pedir
                // 0 (nenhum) e um vídeo de fundo costuma pedir 70 — a vinheta soma por cima.
                $overlay = isset($slide['overlayOpacity']) ? (int) $slide['overlayOpacity'] : 70;
                $overlay = max(0, min(100, $overlay));
                $temTexto = ! empty($slide['title']) || ! empty($slide['text'])
                    || ! empty($slide['primaryLabel']) || ! empty($slide['secondaryLabel']);
                $mostrarProps = ! isset($slide['showProps']) || $slide['showProps'];
                ?>
                <article class="aerion-hero-carousel__slide<?php echo $index === 0 ? ' is-active' : ''; ?>"
                    data-aerion-carousel-slide="<?php echo esc_attr((string) $index); ?>">
                    <?php if ($mediaUrl !== '' && $mediaType === 'video') : ?>
                        <video class="aerion-home-hero__video" autoplay muted loop playsinline preload="metadata"><source src="<?php echo esc_url($mediaUrl); ?>" type="video/mp4"></video>
                    <?php elseif ($mediaUrl !== '') : ?>
                        <?php
                        $webpDesktop = aerion_hero_webp_variants($mediaUrl);
                        $webpMobile = $mediaMobileUrl !== '' ? aerion_hero_webp_variants($mediaMobileUrl) : [];
                        $usaPicture = $mediaMobileUrl !== '' || $webpDesktop;
                        $dimensoes = $webpDesktop ? end($webpDesktop) : null;
                        ?>
                        <?php if ($usaPicture) : ?><picture>
                            <?php if ($webpMobile) : ?><source media="(max-width: 700px)" type="image/webp" srcset="<?php echo aerion_hero_webp_srcset($webpMobile); ?>" sizes="100vw"><?php endif; ?>
                            <?php if ($mediaMobileUrl !== '') : ?><source media="(max-width: 700px)" srcset="<?php echo esc_url($mediaMobileUrl); ?>"><?php endif; ?>
                            <?php if ($webpDesktop) : ?><source type="image/webp" srcset="<?php echo aerion_hero_webp_srcset($webpDesktop); ?>" sizes="100vw"><?php endif; ?>
                        <?php endif; ?>
                        <img class="aerion-home-hero__video" src="<?php echo esc_url($mediaUrl); ?>" alt="" <?php echo $dimensoes ? 'width="' . (int) $dimensoes['width'] . '" height="' . (int) $dimensoes['height'] . '" ' : ''; ?>loading="<?php echo $index === 0 ? 'eager' : 'lazy'; ?>" decoding="async"<?php echo $index === 0 ? ' fetchpriority="high"' : ''; ?>>
                        <?php if ($usaPicture) : ?></picture><?php endif; ?>
                    <?php endif; ?>
                    <?php if ($overlay > 0) : ?>
                        <?php /* `background-color` e não o atalho `background`: o atalho zeraria o gradiente da vinheta aplicado pelo CSS. */ ?>
                        <div class="aerion-home-hero__overlay" style="background-color: rgb(0 0 0 / <?php echo esc_attr((string) $overlay); ?>%)"></div>
                    <?php endif; ?>
                    <?php if ($slideUrl !== '') : ?>
                        <a class="aerion-hero-carousel__slide-link" href="<?php echo esc_url($slideUrl); ?>" aria-label="<?php echo esc_attr((string) ($slide['slideLinkLabel'] ?? 'Ir para a loja')); ?>"></a>
                    <?php endif; ?>
                    <?php if ($temTexto) : ?>
                        <div class="aerion-container aerion-home-hero__content">
                            <?php if (! empty($slide['title'])) : ?><h1><span class="aerion-hero-carousel__realce"><?php echo esc_html((string) $slide['title']); ?></span></h1><?php endif; ?>
                            <?php if (! empty($slide['text'])) : ?><p class="aerion-home-hero__lead"><?php echo esc_html((string) $slide['text']); ?></p><?php endif; ?>
                            <?php if ($mostrarProps) : ?>
                                <div class="aerion-home-hero__props">
                                    <?php foreach (aerion_hero_carousel_props() as [$icon, $title, $description]) : ?>
                                        <div><span class="aerion-home-hero__prop-icon"><?php echo aerion_blocks_icon($icon); ?></span><p><strong><?php echo esc_html($title); ?></strong><small><?php echo esc_html($description); ?></small></p></div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                            <?php if (! empty($slide['primaryLabel']) || ! empty($slide['secondaryLabel'])) : ?>
                                <div class="aerion-actions">
                                    <?php
                                    $icone = (string) ($slide['primaryIcon'] ?? 'arrow');
                                    $icone = in_array($icone, ['arrow', 'cart', 'none'], true) ? $icone : 'arrow';
                                    ?>
                                    <?php if (! empty($slide['primaryLabel'])) : ?><a class="aerion-button<?php echo $icone === 'cart' ? ' aerion-button--cart' : ''; ?>" href="<?php echo esc_url((string) ($slide['primaryUrl'] ?? '#')); ?>"><?php echo $icone === 'cart' ? aerion_blocks_icon('cart') : ''; ?><?php echo esc_html((string) $slide['primaryLabel']); ?><?php echo $icone === 'arrow' ? aerion_blocks_icon('arrow') : ''; ?></a><?php endif; ?>
                                    <?php if (! empty($slide['secondaryLabel'])) : ?><a class="aerion-button aerion-button--glass" href="<?php echo esc_url((string) ($slide['secondaryUrl'] ?? '#')); ?>"><?php echo esc_html((string) $slide['secondaryLabel']); ?></a><?php endif; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                </article>
            <?php endforeach; ?>
        </div>

        <?php if (count($slides) > 1) : ?>
            <button type="button" class="aerion-hero-carousel__arrow aerion-hero-carousel__arrow--prev" data-aerion-carousel-prev aria-label="Slide anterior">&#8249;</button>
            <button type="button" class="aerion-hero-carousel__arrow aerion-hero-carousel__arrow--next" data-aerion-carousel-next aria-label="Próximo slide">&#8250;</button>
            <div class="aerion-hero-carousel__dots" role="tablist" aria-label="Slides da abertura">
                <?php foreach ($slides as $index => $slide) : ?>
                    <button type="button" role="tab" data-aerion-carousel-dot="<?php echo esc_attr((string) $index); ?>"
                        aria-selected="<?php echo $index === 0 ? 'true' : 'false'; ?>"
                        aria-label="<?php echo esc_attr(sprintf('Slide %d', $index + 1)); ?>"></button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </section>
    <?php
    return (string) ob_get_clean();
}
