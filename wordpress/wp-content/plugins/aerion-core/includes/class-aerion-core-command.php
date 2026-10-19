<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

final class Aerion_Core_Command
{
    /**
     * Create the initial pages and WordPress/WooCommerce URL structure.
     */
    public function bootstrap(): void
    {
        $contactFormId = Aerion_Contact_Form::ensure();
        $pages = [
            'inicio' => [
                'title' => 'Início',
                'content' => '<!-- wp:aerion/hero-carousel {"align":"full"} /-->' .
                    '<!-- wp:aerion/products-showcase {"align":"full"} /-->' .
                    '<!-- wp:aerion/solutions-showcase {"align":"full"} /-->' .
                    '<!-- wp:aerion/benefits {"align":"full"} /-->' .
                    '<!-- wp:aerion/contact-form {"align":"full"} /-->',
            ],
            'sobre' => ['title' => 'Sobre', 'content' => '<!-- wp:aerion/about-page {"align":"full"} /-->'],
            'produtos' => ['title' => 'Produtos', 'content' => '<!-- wp:aerion/products-showcase {"align":"full","count":6} /-->'],
            'loja' => ['title' => 'Loja', 'content' => '<!-- wp:aerion/storefront {"align":"full"} /-->'],
            'solucoes' => ['title' => 'Soluções', 'content' => '<!-- wp:aerion/solutions-showcase {"align":"full"} /-->'],
            'contato' => [
                'title' => 'Contato',
                'content' => '<!-- wp:aerion/contact-form {"align":"full","title":"Entre em Contato","subtitle":"Pronto para revolucionar suas operações? Nossa equipe de especialistas está pronta para ajudar você a escolher a solução ideal para seu negócio"} /-->',
            ],
            'blog' => ['title' => 'Blog', 'content' => ''],
            'programa-de-revendas' => [
                'title' => 'Programa de Revendas',
                'content' => '<!-- wp:aerion/reseller-program {"align":"full"} /-->',
            ],
            // Os quatro documentos juridicos nascem vazios aqui e sao preenchidos
            // logo abaixo por `Aerion_Legal_Pages::seed()`. A separacao e
            // deliberada: o texto e longo, muda por motivo juridico e precisa
            // continuar editavel no wp-admin sem que uma rotina o sobrescreva.
            'politica-privacidade' => ['title' => 'Política de Privacidade', 'content' => ''],
            'termos-uso' => ['title' => 'Termos de Uso', 'content' => ''],
            'trocas-devolucoes' => ['title' => 'Política de Trocas e Devoluções', 'content' => ''],
            'garantia' => ['title' => 'Política de Garantia', 'content' => ''],
            'carrinho' => ['title' => 'Carrinho', 'content' => '<!-- wp:shortcode -->[woocommerce_cart]<!-- /wp:shortcode -->'],
            'finalizar-compra' => ['title' => 'Finalizar compra', 'content' => '<!-- wp:shortcode -->[woocommerce_checkout]<!-- /wp:shortcode -->'],
            'minha-conta' => ['title' => 'Minha conta', 'content' => '<!-- wp:shortcode -->[woocommerce_my_account]<!-- /wp:shortcode -->'],
        ];
        $ids = [];
        $renamedPages = [
            'politica-privacidade' => 'politica-de-privacidade',
            'termos-uso' => 'termos-de-uso',
        ];
        foreach ($pages as $slug => $page) {
            $existing = get_page_by_path($slug);
            if (! $existing && isset($renamedPages[$slug])) {
                $existing = get_page_by_path($renamedPages[$slug]);
                if ($existing) {
                    wp_update_post([
                        'ID' => $existing->ID,
                        'post_name' => $slug,
                    ]);
                }
            }
            if ($existing) {
                $ids[$slug] = (int) $existing->ID;
                continue;
            }
            $ids[$slug] = (int) wp_insert_post([
                'post_type'    => 'page',
                'post_status'  => 'publish',
                'post_title'   => $page['title'],
                'post_name'    => $slug,
                'post_content' => $page['content'],
            ]);
        }
        // Escreve os documentos juridicos apenas nas paginas que ninguem editou
        // ainda. Roda sempre, e nao so na virada de blueprint, porque uma pagina
        // legal vazia e um problema em si — a loja ja referencia essas paginas no
        // rodape, no checkout e no cadastro B2B.
        Aerion_Legal_Pages::seed($ids);
        $this->ensure_solution_pages($ids['solucoes']);
        $institutionalProducts = [
            'evo-lite-enterprise' => ['EVO Lite Enterprise', 'EVO Lite Enterprise | Drone profissional compacto | Aerion'],
            'evo-max-v2' => ['EVO Max V2', 'EVO Max V2 | Drone profissional RTK | Aerion'],
            'autel-alpha' => ['Autel Alpha', 'Autel Alpha | Drone industrial para operações críticas | Aerion'],
            'evo-nest' => ['EVO Nest', 'EVO Nest | Dock autônomo para drones | Aerion'],
            'autel-mapper' => ['Autel Mapper', 'Autel Mapper | Software profissional de mapeamento | Aerion'],
            'hubsan-mini-7' => ['HUBSAN Mini 7', 'HUBSAN Mini 7 | Drone compacto com câmera de 1 polegada | Aerion'],
        ];
        $productBlueprintVersion = '2026-09-08-product-sections-v5';
        $refreshProductPages = get_option('aerion_product_page_blueprint_version') !== $productBlueprintVersion;
        foreach ($institutionalProducts as $productSlug => [$productTitle, $seoTitle]) {
            $productPage = get_page_by_path('produtos/' . $productSlug, OBJECT, 'page');
            if (! $productPage) {
                $legacyPage = get_page_by_path($productSlug, OBJECT, 'page');
                if ($legacyPage && (int) $legacyPage->post_parent === 0) {
                    wp_update_post(['ID' => $legacyPage->ID, 'post_parent' => $ids['produtos']]);
                    $productPage = get_post($legacyPage->ID);
                }
            }
            $productContent = Aerion_Institutional_Product_Admin::default_content($productSlug);
            if (! $productPage) {
                $productPageId = wp_insert_post([
                    'post_type' => 'page',
                    'post_status' => 'publish',
                    'post_title' => $productTitle,
                    'post_name' => $productSlug,
                    'post_parent' => $ids['produtos'],
                    'post_content' => $productContent,
                ]);
                $productPage = $productPageId ? get_post($productPageId) : null;
            } elseif ($refreshProductPages) {
                wp_update_post(['ID' => $productPage->ID, 'post_title' => $productTitle, 'post_parent' => $ids['produtos'], 'post_content' => $productContent]);
            }
            if ($productPage) {
                update_post_meta($productPage->ID, '_wp_page_template', 'page-landing');
                update_post_meta($productPage->ID, '_yoast_wpseo_title', $seoTitle);
            }
        }
        if ($refreshProductPages) {
            update_option('aerion_product_page_blueprint_version', $productBlueprintVersion, false);
        }
        $homeBlueprintVersion = '2026-08-10-hero-carousel-v1';
        if (get_option('aerion_home_blueprint_version') !== $homeBlueprintVersion) {
            wp_update_post([
                'ID' => $ids['inicio'],
                'post_content' => $pages['inicio']['content'],
            ]);
            update_post_meta($ids['inicio'], '_yoast_wpseo_title', 'Aerion Technologies | Drones Autel Profissionais no Brasil');
            update_post_meta($ids['inicio'], '_yoast_wpseo_metadesc', 'Distribuidor oficial Autel no Brasil. Tecnologia de ponta em drones profissionais para Construção, Industrial, Segurança e Resgate com custo-benefício superior e suporte local.');
            update_option('aerion_home_blueprint_version', $homeBlueprintVersion, false);
        }
        $pageBlueprintVersion = '2026-08-26-reseller-program-v2';
        if (get_option('aerion_page_blueprint_version') !== $pageBlueprintVersion) {
            foreach (['sobre', 'solucoes', 'contato', 'produtos', 'loja', 'programa-de-revendas'] as $pageSlug) {
                wp_update_post([
                    'ID' => $ids[$pageSlug],
                    'post_content' => $pages[$pageSlug]['content'],
                ]);
                update_post_meta($ids[$pageSlug], '_wp_page_template', 'page-landing');
            }
            update_post_meta($ids['sobre'], '_yoast_wpseo_title', 'Sobre a Aerion Technologies | Distribuidor Oficial Autel no Brasil');
            update_post_meta($ids['sobre'], '_yoast_wpseo_metadesc', 'Conheça a Aerion Technologies, distribuidor oficial Autel Robotics no Brasil. Especialistas em drones profissionais com suporte técnico local e parcerias estratégicas.');
            update_post_meta($ids['produtos'], '_yoast_wpseo_title', 'Drones e soluções profissionais | Autel e HUBSAN | Aerion');
            update_post_meta($ids['produtos'], '_yoast_wpseo_metadesc', 'Conheça drones e soluções Autel para operações profissionais e o HUBSAN Mini 7 para viagens, criação de conteúdo e novas perspectivas.');
            update_post_meta($ids['blog'], '_yoast_wpseo_title', 'Blog Aerion | Insights sobre Drones, Mapeamento e Operações Enterprise');
            update_post_meta($ids['blog'], '_yoast_wpseo_metadesc', 'Conteúdos técnicos, aplicações e novidades sobre drones profissionais, mapeamento, inspeções, segurança e operações enterprise.');
            update_post_meta($ids['loja'], '_yoast_wpseo_title', 'Loja Aerion | Drones e Soluções Autel Profissionais');
            update_post_meta($ids['loja'], '_yoast_wpseo_metadesc', 'Compre drones e soluções Autel profissionais com suporte técnico local, garantia nacional de 1 ano e condições especiais para revendedores aprovados.');
            update_post_meta($ids['programa-de-revendas'], '_yoast_wpseo_title', 'Programa de Revendas Aerion | Tabela para Parceiros Autorizados');
            update_post_meta($ids['programa-de-revendas'], '_yoast_wpseo_metadesc', 'Revenda drones profissionais com suporte comercial, capacitação e compra direta pela Aerion. CNPJ ativo com CNAE de revenda — 46, 47 ou 77 — libera a tabela-base automaticamente.');
            // Mesma imagem da hero declarada em render-reseller-program.php. Se a
            // hero mudar de versão e estas duas linhas ficarem para trás, o card
            // social continua servindo a arte antiga sem erro nenhum aparecer.
            update_post_meta($ids['programa-de-revendas'], '_yoast_wpseo_opengraph-image', get_theme_file_uri('assets/source-images/revendas/hero-desktop-v2.webp'));
            update_post_meta($ids['programa-de-revendas'], '_yoast_wpseo_twitter-image', get_theme_file_uri('assets/source-images/revendas/hero-desktop-v2.webp'));
            update_option('aerion_page_blueprint_version', $pageBlueprintVersion, false);
        }
        $catalogSeoVersion = '2026-09-08-multibrand-v1';
        if (get_option('aerion_catalog_seo_version') !== $catalogSeoVersion) {
            update_post_meta($ids['produtos'], '_yoast_wpseo_title', 'Drones e soluções profissionais | Autel e HUBSAN | Aerion');
            update_post_meta($ids['produtos'], '_yoast_wpseo_metadesc', 'Conheça drones e soluções Autel para operações profissionais e o HUBSAN Mini 7 para viagens, criação de conteúdo e novas perspectivas.');
            update_option('aerion_catalog_seo_version', $catalogSeoVersion, false);
        }
        update_option('show_on_front', 'page');
        update_option('page_on_front', $ids['inicio']);
        update_option('page_for_posts', $ids['blog']);
        update_option('posts_per_page', 24);
        update_option('permalink_structure', '/blog/%postname%/');
        update_option('woocommerce_shop_page_id', $ids['loja']);
        update_option('woocommerce_permalinks', [
            'product_base'   => '/loja/produto',
            'category_base'  => '/loja/categoria',
            'tag_base'       => '/loja/tag',
            'attribute_base' => '',
        ]);
        update_option('woocommerce_cart_page_id', $ids['carrinho']);
        update_option('woocommerce_checkout_page_id', $ids['finalizar-compra']);
        update_option('woocommerce_myaccount_page_id', $ids['minha-conta']);
        foreach (['carrinho', 'finalizar-compra', 'minha-conta'] as $technicalPage) {
            update_post_meta($ids[$technicalPage], '_yoast_wpseo_meta-robots-noindex', '1');
            update_post_meta($ids[$technicalPage], '_yoast_wpseo_meta-robots-nofollow', '0');
        }
        $this->archive_unused_woocommerce_pages($ids);
        update_option('wp_page_for_privacy_policy', $ids['politica-privacidade']);
        update_option('woocommerce_terms_page_id', $ids['termos-uso']);
        // Apontava para "Refund and Returns Policy", o rascunho em ingles que o
        // WooCommerce cria na instalacao e que `archive_unused_woocommerce_pages`
        // despublica logo acima. A opcao seguia valendo, entao qualquer link que
        // o WooCommerce gerasse a partir dela levava a uma pagina inexistente.
        update_option('woocommerce_refund_returns_page_id', $ids['trocas-devolucoes']);
        // O texto que o WooCommerce mostra no checkout vinha em ingles, do
        // default do plugin. `[privacy_policy]` e substituido pelo link da
        // pagina definida em `wp_page_for_privacy_policy`.
        update_option(
            'woocommerce_checkout_privacy_policy_text',
            'Seus dados pessoais serão usados para processar o pedido, dar suporte à sua experiência nesta loja e para as demais finalidades descritas na nossa [privacy_policy].'
        );
        update_option(
            'woocommerce_registration_privacy_policy_text',
            'Seus dados pessoais serão usados para dar suporte à sua experiência nesta loja, gerenciar o acesso à sua conta e para as demais finalidades descritas na nossa [privacy_policy].'
        );
        // Os e-mails da loja saem pelo mesmo remetente do institucional, mas o
        // nome e o rodapé precisam identificar a Aerion — o domínio de envio é
        // apenas o transporte.
        update_option('woocommerce_email_from_address', getenv('AERION_MAIL_FROM') ?: 'naoresponda@aerion.com.br');
        update_option('woocommerce_email_from_name', getenv('AERION_MAIL_FROM_NAME') ?: 'Aerion Technologies');
        update_option(
            'woocommerce_email_footer_text',
            'Aerion Technologies — drones Autel profissionais no Brasil'
            . "\n" . '{site_url}'
            . "\n" . 'Este e-mail é enviado de um endereço que não recebe respostas. '
            . 'Para falar com a equipe, escreva para ' . (getenv('AERION_MAIL_REPLY_TO') ?: 'comercial@aerion.com.br') . '.'
        );
        // Sem `site_icon` o WordPress não emite <link rel="icon"> e o navegador
        // cai no favicon.ico padrão dele. Usamos o mesmo ícone do site React.
        $iconId = (int) get_option('site_icon');
        if (! $iconId || ! wp_attachment_is_image($iconId)) {
            $icon = $this->import_square_site_icon();
            if ($icon) {
                update_option('site_icon', $icon);
            }
        }
        update_option('timezone_string', 'America/Sao_Paulo');
        update_option('woocommerce_coming_soon', 'no');
        update_option('blog_public', '1');
        update_option('woocommerce_currency', 'BRL');
        update_option('woocommerce_default_country', 'BR');
        update_option('woocommerce_dimension_unit', 'cm');
        update_option('woocommerce_weight_unit', 'kg');
        update_option('date_format', 'd/m/Y');

        $this->configure_tracking();
        $this->configure_consent_banner();
        $this->sync_contact_page($ids['contato'], $contactFormId);

        $this->remove_installer_content();
        $this->create_menu($ids);
        flush_rewrite_rules();
        WP_CLI::success('Estrutura inicial criada ou já existente.');
    }

    /**
     * Import source data.
     *
     * ## OPTIONS
     *
     * <source>
     * : `supabase`, `products` or `media`.
     */
    public function migrate(array $args): void
    {
        $source = $args[0] ?? '';
        $migration = new Aerion_Migration_Command(new Aerion_Media_Importer());
        match ($source) {
            'supabase' => $migration->supabase(),
            'products' => $migration->products(),
            'media'    => $migration->media(),
            default    => WP_CLI::error('Use: wp aerion migrate supabase|products|media'),
        };
    }

    /**
     * Converte o conteúdo dos posts migrados em blocos do Gutenberg.
     *
     * O blog entrou como HTML cru num bloco único, o que no editor vira o Bloco
     * Clássico. A conversão preserva a marcação — o HTML renderizado é o mesmo.
     *
     * ## OPTIONS
     *
     * [--dry-run]
     * : Apenas relata quantos posts seriam convertidos.
     *
     * [--revert]
     * : Restaura o conteúdo original guardado na conversão.
     */
    public function blocos(array $args, array $assoc): void
    {
        $conversor = new Aerion_Content_Blocks();

        if (! empty($assoc['revert'])) {
            $total = $conversor->reverter();
            WP_CLI::success(sprintf('%d post(s) restaurado(s) ao conteúdo original.', $total));

            return;
        }

        $simular = ! empty($assoc['dry-run']);
        $resultado = $conversor->converter($simular);

        foreach ($resultado['erros'] as $erro) {
            WP_CLI::warning($erro);
        }

        WP_CLI::success(sprintf(
            '%s: %d convertido(s), %d já em blocos.',
            $simular ? 'Simulação' : 'Conversão',
            $resultado['convertidos'],
            $resultado['ignorados']
        ));
    }

    /**
     * Run acceptance checks and fail when critical invariants are broken.
     */
    public function verify(): void
    {
        $errors = [];
        foreach (['inicio', 'sobre', 'produtos', 'solucoes', 'contato', 'blog', 'loja', 'politica-privacidade'] as $slug) {
            if (! get_page_by_path($slug)) {
                $errors[] = sprintf('Página ausente: %s', $slug);
            }
        }
        if (get_option('permalink_structure') !== '/blog/%postname%/') {
            $errors[] = 'Permalink do blog não preserva /blog/{slug}.';
        }
        if ((int) get_option('posts_per_page') !== 24) {
            $errors[] = 'O blog não está configurado para 24 posts por página.';
        }
        if (wp_get_theme()->get_stylesheet() !== 'aerion') {
            $errors[] = 'Tema Aerion não está ativo.';
        }
        if (! class_exists('WooCommerce')) {
            $errors[] = 'WooCommerce não está ativo.';
        }
        if (get_option('woocommerce_coming_soon') !== 'no') {
            $errors[] = 'WooCommerce ainda está em modo Em breve.';
        }
        $contactFormId = absint(get_option(Aerion_Contact_Form::OPTION_ID));
        if (! $contactFormId || ! \FluentForm\App\Models\Form::find($contactFormId)) {
            $errors[] = 'Formulário de contato não está configurado.';
        }
        if (! is_readable(get_stylesheet_directory() . '/assets/css/institutional.css')) {
            $errors[] = 'Stylesheet institucional compilado está ausente.';
        }
        foreach (['shop', 'cart', 'checkout', 'myaccount'] as $wooPage) {
            if (wc_get_page_id($wooPage) <= 0) {
                $errors[] = sprintf('Página técnica WooCommerce ausente: %s', $wooPage);
            }
        }

        if (is_readable('/migration/source/products.json')) {
            foreach (['evo-lite-enterprise', 'evo-max-v2', 'autel-alpha', 'evo-nest', 'autel-mapper', 'hubsan-mini-7'] as $slug) {
                $page = get_page_by_path('produtos/' . $slug, OBJECT, 'page');
                $product = get_page_by_path($slug, OBJECT, 'product');
                if (! $page || ! $product) {
                    $errors[] = sprintf('Página institucional ou produto comercial obrigatório ausente: %s', $slug);
                    continue;
                }
                $sections = array_values(array_filter(
                    parse_blocks($page->post_content),
                    static fn (array $block): bool => ($block['blockName'] ?? '') === 'aerion/product-section'
                ));
                $expectedSections = count(Aerion_Institutional_Product_Admin::section_keys());
                if (count($sections) !== $expectedSections) {
                    $errors[] = sprintf(
                        'Página %s não possui as %d seções protegidas.',
                        $slug,
                        $expectedSections
                    );
                }
                if ((int) get_post_meta($page->ID, '_aerion_wc_product_id', true) !== (int) $product->ID
                    || (int) get_post_meta($product->ID, '_aerion_institutional_page_id', true) !== (int) $page->ID) {
                    $errors[] = sprintf('Vínculo institucional/WooCommerce inconsistente: %s', $slug);
                }
            }
        }

        if (is_readable('/migration/source/supabase-blog.json')) {
            $payload = json_decode((string) file_get_contents('/migration/source/supabase-blog.json'), true);
            foreach ((array) ($payload['posts'] ?? []) as $source) {
                if (empty($source['published'])) {
                    continue;
                }
                $matches = get_posts([
                    'post_type' => 'post',
                    'post_status' => 'publish',
                    'fields' => 'ids',
                    'posts_per_page' => 1,
                    'meta_key' => '_aerion_supabase_id',
                    'meta_value' => (string) ($source['id'] ?? ''),
                ]);
                if (! $matches) {
                    $errors[] = sprintf('Post histórico ausente: %s', (string) ($source['slug'] ?? $source['id'] ?? 'sem-id'));
                } elseif (! has_post_thumbnail((int) $matches[0])) {
                    $errors[] = sprintf('Post sem capa local: %s', (string) ($source['slug'] ?? $source['id'] ?? 'sem-id'));
                }
            }
        }
        if ($errors) {
            foreach ($errors as $error) {
                WP_CLI::warning($error);
            }
            WP_CLI::error(sprintf('%d verificação(ões) críticas falharam.', count($errors)));
        }
        WP_CLI::success('Verificações críticas aprovadas.');
    }

    private function ensure_solution_pages(int $parentId): void
    {
        $solutions = [
            'construcao' => [
                'title' => 'Construção e Topografia',
                'seoTitle' => 'Drones para Construção e Topografia | Soluções Aéreas Profissionais',
                'description' => 'Transforme suas obras com drones Autel para levantamentos topográficos precisos, modelagem BIM, mapeamento urbano e medição de volumes.',
            ],
            'industrial' => [
                'title' => 'Inspeção Industrial',
                'seoTitle' => 'Drones para Inspeção Industrial e Energia | Inspeções Térmicas Avançadas',
                'description' => 'Maximize eficiência e segurança com drones Autel para inspeções térmicas em energia, óleo e gás, mineração e operações BVLOS.',
            ],
            'seguranca' => [
                'title' => 'Segurança Pública',
                'seoTitle' => 'Drones para Segurança Pública e Defesa Civil | Vigilância e Patrulhamento',
                'description' => 'Amplie capacidades operacionais com drones Autel para vigilância 360°, patrulha inteligente, gestão de tráfego e resposta rápida.',
            ],
            'resgate' => [
                'title' => 'Resgate e Emergências',
                'seoTitle' => 'Drones para Resgate e Emergências | Busca e Salvamento com Tecnologia Aérea',
                'description' => 'Salve vidas com drones Autel para busca e resgate, combate a incêndios, localização de vítimas e avaliação de danos em tempo real.',
            ],
        ];
        $blueprintVersion = '2026-07-31-solution-pages-v1';
        $updateContent = get_option('aerion_solution_blueprint_version') !== $blueprintVersion;

        foreach ($solutions as $slug => $solution) {
            $page = get_page_by_path('solucoes/' . $slug);
            if (! $page) {
                $topLevel = get_page_by_path($slug);
                if ($topLevel && (int) $topLevel->post_parent === 0) {
                    wp_update_post(['ID' => $topLevel->ID, 'post_parent' => $parentId]);
                    $page = get_post($topLevel->ID);
                }
            }
            if (! $page) {
                $pageId = wp_insert_post([
                    'post_type' => 'page',
                    'post_status' => 'publish',
                    'post_title' => $solution['title'],
                    'post_name' => $slug,
                    'post_parent' => $parentId,
                    'post_content' => '<!-- wp:aerion/solution-detail {"align":"full","solution":"' . $slug . '"} /-->',
                ]);
                $page = $pageId ? get_post($pageId) : null;
            }
            if (! $page) {
                continue;
            }
            if ($updateContent) {
                wp_update_post([
                    'ID' => $page->ID,
                    'post_title' => $solution['title'],
                    'post_parent' => $parentId,
                    'post_content' => '<!-- wp:aerion/solution-detail {"align":"full","solution":"' . $slug . '"} /-->',
                ]);
            }
            update_post_meta($page->ID, '_wp_page_template', 'page-landing');
            update_post_meta($page->ID, '_yoast_wpseo_title', $solution['seoTitle']);
            update_post_meta($page->ID, '_yoast_wpseo_metadesc', $solution['description']);
        }
        if ($updateContent) {
            update_option('aerion_solution_blueprint_version', $blueprintVersion, false);
        }
    }

    private function create_menu(array $pageIds): void
    {
        $menu = wp_get_nav_menu_object('Navegação principal');
        $menuId = $menu ? (int) $menu->term_id : wp_create_nav_menu('Navegação principal');
        if (is_wp_error($menuId)) {
            return;
        }
        $existing = wp_get_nav_menu_items($menuId) ?: [];
        $linked = array_map(static fn (WP_Post $item): int => (int) $item->object_id, $existing);
        foreach (['inicio', 'produtos', 'solucoes', 'blog', 'sobre', 'contato'] as $slug) {
            if (! in_array($pageIds[$slug], $linked, true)) {
                wp_update_nav_menu_item($menuId, 0, [
                    'menu-item-object-id' => $pageIds[$slug],
                    'menu-item-object'    => 'page',
                    'menu-item-type'      => 'post_type',
                    'menu-item-status'    => 'publish',
                ]);
            }
        }
        $locations = get_theme_mod('nav_menu_locations', []);
        $locations['primary'] = $menuId;
        set_theme_mod('nav_menu_locations', $locations);
    }

    private function sync_contact_page(int $pageId, int $formId): void
    {
        if (! $pageId || ! $formId) {
            return;
        }
        $page = get_post($pageId);
        if (! $page) {
            return;
        }
        $content = (string) $page->post_content;
        $migratedContent = str_replace(
            '"title":"Fale com a Aerion","subtitle":"Conte sua necessidade e nossa equipe entrará em contato"',
            '"title":"Entre em Contato","subtitle":"Pronto para revolucionar suas operações? Nossa equipe de especialistas está pronta para ajudar você a escolher a solução ideal para seu negócio"',
            $content
        );
        if ($migratedContent !== $content) {
            wp_update_post([
                'ID' => $pageId,
                'post_content' => $migratedContent,
            ]);
            $content = $migratedContent;
        }
        $content = str_replace(
            'Crie o formulário no Fluent Forms e substitua o ID do shortcode abaixo.',
            'Fale com a equipe Aerion.',
            $content
        );
        if (! str_contains($content, '[fluentform')) {
            return;
        }
        $updated = preg_replace(
            '/\[fluentform\s+id=(?:"|\')?\d+(?:"|\')?\]/',
            '[fluentform id="' . $formId . '"]',
            $content
        );
        if (is_string($updated) && $updated !== $content) {
            wp_update_post([
                'ID' => $pageId,
                'post_content' => $updated,
            ]);
        }
    }

    private function configure_consent_banner(): void
    {
        if (! class_exists('Moove_GDPR_Content')) {
            return;
        }

        $optionName = (new Moove_GDPR_Content())->moove_gdpr_get_option_name();
        $options = get_option($optionName, []);
        if (! is_array($options)) {
            $options = [];
        }

        $defaults = [
            'moove_gdpr_infobar_visibility' => 'visible',
            // O banner precisa levar a politica: a LGPD exige que o titular
            // saiba o que esta aceitando ANTES de aceitar, e ate agora o unico
            // caminho para o documento era o rodape — abaixo da dobra e atras do
            // proprio banner.
            'moove_gdpr_info_bar_content' => '<p>Usamos cookies necessários para o funcionamento do site e, com sua autorização, cookies de medição e publicidade. Você pode aceitar, rejeitar ou configurar suas preferências. Saiba mais na nossa <a href="' . esc_url(home_url('/politica-privacidade/')) . '">Política de Privacidade</a>.</p>',
            'moove_gdpr_accept_button_enable' => 1,
            'moove_gdpr_reject_button_enable' => 1,
            'moove_gdpr_settings_button_enable' => 1,
            'moove_gdpr_infobar_accept_button_label' => 'Aceitar todos',
            'moove_gdpr_infobar_reject_button_label' => 'Rejeitar',
            'moove_gdpr_infobar_settings_button_label' => 'Configurar',
            'moove_gdpr_modal_save_button_label' => 'Salvar preferências',
            'moove_gdpr_modal_allow_button_label' => 'Aceitar todos',
            'moove_gdpr_modal_reject_button_label' => 'Rejeitar todos',
            'moove_gdpr_modal_enabled_checkbox_label' => 'Ativado',
            'moove_gdpr_modal_disabled_checkbox_label' => 'Desativado',
        ];

        update_option($optionName, array_merge($options, $defaults), false);
    }

    private function configure_tracking(): void
    {
        if (! defined('AERION_GTM_ID') || AERION_GTM_ID === '') {
            return;
        }
        $options = get_option('gtm4wp-options', []);
        if (! is_array($options)) {
            $options = [];
        }
        $options['gtm-code'] = sanitize_text_field(AERION_GTM_ID);
        update_option('gtm4wp-options', $options, false);
    }

    /**
     * O favicon do React é retangular (1472x856) e o WordPress recorta o ícone
     * do site em quadrado, o que cortava as laterais do logo. Centralizamos a
     * arte numa tela quadrada transparente antes de importar.
     */
    private function import_square_site_icon(): ?int
    {
        $origem = '/migration/source/react-public/favicon.png';
        $media = new Aerion_Media_Importer();
        if (! is_readable($origem)) {
            return null;
        }

        $tamanho = @getimagesize($origem);
        if (! $tamanho) {
            return null;
        }
        [$largura, $altura] = $tamanho;
        if ($largura === $altura || ! function_exists('imagecreatetruecolor')) {
            return $media->import_file('react-public:favicon.png', $origem, 'Favicon Aerion');
        }

        $fonte = @imagecreatefrompng($origem);
        if (! $fonte) {
            return null;
        }

        $lado = max($largura, $altura);
        $tela = imagecreatetruecolor($lado, $lado);
        imagealphablending($tela, false);
        imagesavealpha($tela, true);
        imagefill($tela, 0, 0, imagecolorallocatealpha($tela, 0, 0, 0, 127));
        imagealphablending($tela, true);
        imagecopy($tela, $fonte, (int) (($lado - $largura) / 2), (int) (($lado - $altura) / 2), 0, 0, $largura, $altura);

        $destino = wp_tempnam('favicon-quadrado.png');
        $gravou = imagepng($tela, $destino);
        imagedestroy($tela);
        imagedestroy($fonte);
        if (! $gravou) {
            @unlink($destino);
            return null;
        }

        try {
            // A chave inclui o lado para que uma arte de origem diferente gere
            // um novo anexo em vez de reaproveitar o antigo.
            return $media->import_file(
                'site-icon:favicon-' . $lado,
                $destino,
                'Favicon Aerion',
                'favicon.png',
                'image/png'
            );
        } finally {
            @unlink($destino);
        }
    }

    /**
     * Keep WooCommerce's English installer pages recoverable without letting
     * them compete with the canonical Portuguese routes in search engines.
     */
    private function archive_unused_woocommerce_pages(array $canonicalIds): void
    {
        $protected = array_map('intval', $canonicalIds);
        foreach (['shop', 'cart', 'checkout', 'my-account'] as $slug) {
            $page = get_page_by_path($slug);
            if (! $page || in_array((int) $page->ID, $protected, true)) {
                continue;
            }
            wp_update_post([
                'ID'          => (int) $page->ID,
                'post_status' => 'draft',
            ]);
            update_post_meta((int) $page->ID, '_yoast_wpseo_meta-robots-noindex', '1');
        }
    }

    private function remove_installer_content(): void
    {
        $post = get_page_by_path('hello-world', OBJECT, 'post');
        if ($post && $post->ID <= 5 && ! get_post_meta($post->ID, '_aerion_supabase_id', true)) {
            wp_delete_post($post->ID, true);
        }

        $postPtBr = get_page_by_path('ola-mundo', OBJECT, 'post');
        if ($postPtBr && $postPtBr->ID <= 5 && ! get_post_meta($postPtBr->ID, '_aerion_supabase_id', true)) {
            wp_delete_post($postPtBr->ID, true);
        }

        $samplePage = get_page_by_path('sample-page');
        if ($samplePage && $samplePage->ID <= 5) {
            wp_delete_post($samplePage->ID, true);
        }
    }
}
