<?php

declare(strict_types=1);

if (! defined('ABSPATH')) exit;

final class Aerion_Campaigns
{
    private static array $cache = [];

    public static function boot(): void
    {
        add_action('admin_enqueue_scripts', [self::class, 'assets_admin']);
        add_action('init', [self::class, 'register_content_types']);
add_filter('body_class', [self::class, 'classe_black_november']);
        add_action('init', [self::class, 'ensure_launch_campaign'],40);
        add_action('add_meta_boxes_aerion_campaign', fn () => add_meta_box('aerion_campaign_rules', 'Regras da campanha', [self::class, 'box'], 'aerion_campaign', 'normal', 'high'));
        add_action('save_post_aerion_campaign', [self::class, 'save']);
        add_filter('template_include', fn (string $file): string => is_singular('aerion_campaign') ? AERION_COMMERCE_DIR . '/templates/campaign.php' : $file);
    }

    /**
     * Scripts que a tela de edicao precisa.
     *
     * `wp_enqueue_media` habilita a biblioteca; `wc-enhanced-select` e o que faz
     * o campo de produtos buscar por AJAX. Carregados SO nesta tela — o painel
     * inteiro nao precisa pagar por eles.
     */
    public static function assets_admin(string $hook): void
    {
        if (! in_array($hook, ['post.php', 'post-new.php'], true)) {
            return;
        }
        $screen = get_current_screen();
        if (! $screen || $screen->post_type !== 'aerion_campaign') {
            return;
        }
        wp_enqueue_media();
        wp_enqueue_script('wc-enhanced-select');
        wp_enqueue_style('woocommerce_admin_styles');
    }

    public static function register_content_types(): void
    {
        register_taxonomy('aerion_family', ['product'], [
            'labels' => ['name' => 'Famílias de produtos', 'singular_name' => 'Família'],
            'public' => true, 'show_in_rest' => true, 'hierarchical' => true,
            'rewrite' => ['slug' => 'loja/familia', 'with_front' => false],
        ]);
        register_post_type('aerion_campaign', [
            'labels' => ['name' => 'Campanhas da loja', 'singular_name' => 'Campanha', 'add_new_item' => 'Adicionar campanha'],
            'public' => true, 'show_in_rest' => true, 'show_in_menu' => 'woocommerce',
            'supports' => ['title', 'editor', 'thumbnail'],
            'rewrite' => ['slug' => 'loja/campanha', 'with_front' => false], 'has_archive' => false,
        ]);
    }

    /**
     * Tela de edicao da campanha.
     *
     * A anterior era uma pilha de campos de texto: datas digitadas no formato
     * "AAAA-MM-DDTHH:MM", URLs de imagem coladas a mao e uma lista de produtos
     * com todos os itens da loja de uma vez. Funcionava para quem escreveu, nao
     * para quem opera.
     *
     * Aqui cada campo usa o controle que o dado pede: calendario para data,
     * busca com AJAX para produto, seletor da biblioteca de midia para arte. E
     * os campos ficam agrupados pela pergunta que respondem — quando vale, para
     * quem, quanto desconta, o que aparece —, em vez de uma lista unica.
     */
    public static function box(WP_Post $post): void
    {
        wp_nonce_field('aerion_campaign_save', 'aerion_campaign_nonce');
        $m = self::meta($post->ID);
        $familias = get_terms(['taxonomy' => 'aerion_family', 'hide_empty' => false]);

        echo '<style>
        .ac-secao{border:1px solid #dcdcde;border-radius:6px;margin:0 0 18px;padding:0}
        .ac-secao>h2{background:#f6f7f7;border-bottom:1px solid #dcdcde;font-size:13px;margin:0;padding:10px 14px}
        .ac-secao>.ac-corpo{padding:14px}
        .ac-linha{display:grid;grid-template-columns:170px minmax(0,1fr);gap:12px;align-items:start;margin:0 0 14px}
        .ac-linha:last-child{margin-bottom:0}
        .ac-linha>label{font-weight:600;padding-top:5px}
        .ac-dica{color:#646970;display:block;font-size:12px;margin-top:4px}
        .ac-arte{align-items:flex-start;display:flex;gap:12px}
        .ac-arte img{background:#f0f0f1;border:1px solid #dcdcde;border-radius:4px;max-height:90px;max-width:190px;object-fit:contain}
        .ac-arte .ac-vazio{align-items:center;border:1px dashed #c3c4c7;border-radius:4px;color:#8c8f94;display:flex;font-size:12px;height:60px;justify-content:center;width:190px}
        </style>';

        // --- quando vale ---------------------------------------------------
        echo '<div class="ac-secao"><h2>' . esc_html__('Período', 'aerion-commerce') . '</h2><div class="ac-corpo">';
        foreach (['start' => __('Início', 'aerion-commerce'), 'end' => __('Fim', 'aerion-commerce')] as $chave => $rotulo) {
            printf(
                '<div class="ac-linha"><label for="ac-%1$s">%2$s</label><div>'
                . '<input type="datetime-local" step="1" id="ac-%1$s" name="ac[%1$s]" value="%3$s">'
                . '</div></div>',
                esc_attr($chave),
                esc_html($rotulo),
                esc_attr(self::para_campo((string) $m[$chave]))
            );
        }
        echo '<div class="ac-linha"><label>' . esc_html__('Agora', 'aerion-commerce') . '</label><div><code>'
            . esc_html(current_time('d/m/Y H:i:s')) . '</code>'
            . '<span class="ac-dica">' . esc_html__('O fim é inclusivo: 30/09 23:59:59 vale até o último segundo do dia.', 'aerion-commerce') . '</span>'
            . '</div></div>';
        echo '</div></div>';

        // --- para quem e com que forca -------------------------------------
        echo '<div class="ac-secao"><h2>' . esc_html__('Alcance', 'aerion-commerce') . '</h2><div class="ac-corpo">';
        echo '<div class="ac-linha"><label for="ac-audience">' . esc_html__('Público', 'aerion-commerce') . '</label><div><select id="ac-audience" name="ac[audience]">';
        foreach (['both' => __('Todos', 'aerion-commerce'), 'consumer' => __('Consumidor final', 'aerion-commerce'), 'trade' => __('Revenda', 'aerion-commerce')] as $v => $r) {
            printf('<option value="%s" %s>%s</option>', esc_attr($v), selected($m['audience'], $v, false), esc_html($r));
        }
        echo '</select></div></div>';
        printf(
            '<div class="ac-linha"><label for="ac-priority">%s</label><div><input type="number" id="ac-priority" name="ac[priority]" value="%s" min="0" step="1" style="width:90px">'
            . '<span class="ac-dica">%s</span></div></div>',
            esc_html__('Prioridade', 'aerion-commerce'),
            esc_attr((string) $m['priority']),
            esc_html__('Campanhas não acumulam. Quando duas alcançam o mesmo produto, vence a de maior prioridade.', 'aerion-commerce')
        );
        echo '</div></div>';

        // --- quanto desconta ------------------------------------------------
        echo '<div class="ac-secao"><h2>' . esc_html__('Desconto', 'aerion-commerce') . '</h2><div class="ac-corpo">';
        echo '<div class="ac-linha"><label for="ac-type">' . esc_html__('Tipo', 'aerion-commerce') . '</label><div><select id="ac-type" name="ac[type]" data-ac-tipo>';
        foreach (['percentage' => __('Percentual sobre o preço', 'aerion-commerce'), 'final' => __('Preço final por SKU', 'aerion-commerce')] as $v => $r) {
            printf('<option value="%s" %s>%s</option>', esc_attr($v), selected($m['type'], $v, false), esc_html($r));
        }
        echo '</select></div></div>';
        printf(
            '<div class="ac-linha" data-ac-campo="percentage"><label for="ac-percentage">%s</label><div>'
            . '<input type="number" id="ac-percentage" name="ac[percentage]" value="%s" min="0" max="90" step="0.5" style="width:90px"> %%'
            . '<span class="ac-dica">%s</span></div></div>',
            esc_html__('Percentual', 'aerion-commerce'),
            esc_attr((string) $m['percentage']),
            esc_html__('Aplicado sobre o preço que o cliente já veria — o público para consumidor, o de revenda para parceiro.', 'aerion-commerce')
        );
        printf(
            '<div class="ac-linha" data-ac-campo="final"><label for="ac-prices">%s</label><div>'
            . '<textarea id="ac-prices" name="ac[prices]" rows="6" class="large-text code" placeholder="102000941=899,00">%s</textarea>'
            . '<span class="ac-dica">%s</span></div></div>',
            esc_html__('Preços por SKU', 'aerion-commerce'),
            esc_textarea($m['prices']),
            esc_html__('Uma linha por SKU, no formato SKU=valor. SKU sem linha aqui fica fora da campanha.', 'aerion-commerce')
        );
        echo '</div></div>';

        // --- o que entra ----------------------------------------------------
        echo '<div class="ac-secao"><h2>' . esc_html__('Itens', 'aerion-commerce') . '</h2><div class="ac-corpo">';
        echo '<div class="ac-linha"><label for="ac-products">' . esc_html__('Produtos', 'aerion-commerce') . '</label><div>';
        // `wc-product-search` e o campo de busca do proprio WooCommerce: procura
        // por nome e por SKU via AJAX. A lista fixa anterior obrigava a rolar o
        // catalogo inteiro e nao buscava nada.
        echo '<select class="wc-product-search" multiple id="ac-products" name="ac[products][]" style="width:100%" '
            . 'data-placeholder="' . esc_attr__('Busque por nome ou SKU…', 'aerion-commerce') . '" '
            . 'data-action="woocommerce_json_search_products_and_variations">';
        foreach ($m['products'] as $pid) {
            $produto = wc_get_product($pid);
            if (! $produto) {
                continue;
            }
            printf('<option value="%d" selected>%s</option>', $pid, esc_html($produto->get_formatted_name()));
        }
        echo '</select><span class="ac-dica">' . esc_html__('Deixe vazio para valer apenas pelas famílias abaixo.', 'aerion-commerce') . '</span></div></div>';

        echo '<div class="ac-linha"><label for="ac-families">' . esc_html__('Famílias', 'aerion-commerce') . '</label><div><select id="ac-families" name="ac[families][]" multiple size="5" style="min-width:420px">';
        if (! is_wp_error($familias)) {
            foreach ($familias as $f) {
                printf('<option value="%d" %s>%s</option>', $f->term_id, selected(in_array((int) $f->term_id, $m['families'], true), true, false), esc_html($f->name));
            }
        }
        echo '</select><span class="ac-dica">' . esc_html__('Um produto entra se estiver na lista acima OU numa destas famílias.', 'aerion-commerce') . '</span></div></div>';
        echo '</div></div>';

        // --- como aparece ---------------------------------------------------
        echo '<div class="ac-secao"><h2>' . esc_html__('Aparência', 'aerion-commerce') . '</h2><div class="ac-corpo">';
        foreach ([
            'eyebrow'  => [__('Chamada', 'aerion-commerce'), 'text', ''],
            'subtitle' => [__('Subtítulo', 'aerion-commerce'), 'text', ''],
            'color'    => [__('Cor', 'aerion-commerce'), 'color', ''],
            'link'     => [__('Link do banner', 'aerion-commerce'), 'url', ''],
            'alt'      => [__('Texto alternativo das artes', 'aerion-commerce'), 'text', __('Descreve a imagem para quem usa leitor de tela.', 'aerion-commerce')],
            'order'    => [__('Ordem no hero', 'aerion-commerce'), 'number', ''],
        ] as $chave => [$rotulo, $tipo, $dica]) {
            printf(
                '<div class="ac-linha"><label for="ac-%1$s">%2$s</label><div>'
                . '<input type="%3$s" id="ac-%1$s" name="ac[%1$s]" value="%4$s" class="%5$s">%6$s</div></div>',
                esc_attr($chave),
                esc_html($rotulo),
                esc_attr($tipo),
                esc_attr((string) $m[$chave]),
                $tipo === 'color' || $tipo === 'number' ? '' : 'regular-text',
                $dica !== '' ? '<span class="ac-dica">' . esc_html($dica) . '</span>' : ''
            );
        }
        printf(
            '<div class="ac-linha"><label for="ac-featured">%s</label><div><label><input type="checkbox" id="ac-featured" name="ac[featured]" value="yes" %s> %s</label></div></div>',
            esc_html__('Destaque', 'aerion-commerce'),
            checked($m['featured'], 'yes', false),
            esc_html__('Exibir no carrossel da home', 'aerion-commerce')
        );
        echo '</div></div>';

        // --- artes ------------------------------------------------------------
        echo '<div class="ac-secao"><h2>' . esc_html__('Artes', 'aerion-commerce') . '</h2><div class="ac-corpo">';
        foreach ([
            'desktop_image' => [__('Banner desktop', 'aerion-commerce'), __('Proporção 5:2.', 'aerion-commerce')],
            'mobile_image'  => [__('Banner mobile', 'aerion-commerce'), __('Proporção 3:2.', 'aerion-commerce')],
            'mini_image'    => [__('Selo mini', 'aerion-commerce'), __('Aparece no card do produto, ao lado do contador.', 'aerion-commerce')],
        ] as $chave => [$rotulo, $dica]) {
            $url = (string) $m[$chave];
            printf(
                '<div class="ac-linha"><label for="ac-%1$s">%2$s</label><div class="ac-arte">'
                . '%3$s'
                . '<div style="flex:1">'
                . '<input type="url" class="regular-text" id="ac-%1$s" name="ac[%1$s]" value="%4$s" data-ac-url style="width:100%%">'
                . '<p style="margin:8px 0 0">'
                . '<button type="button" class="button" data-ac-escolher="%1$s">%5$s</button> '
                . '<button type="button" class="button-link" data-ac-limpar="%1$s" style="color:#b32d2e">%6$s</button>'
                . '</p><span class="ac-dica">%7$s</span></div></div></div>',
                esc_attr($chave),
                esc_html($rotulo),
                $url !== ''
                    ? '<img src="' . esc_url($url) . '" alt="" data-ac-previa="' . esc_attr($chave) . '">'
                    : '<span class="ac-vazio" data-ac-previa="' . esc_attr($chave) . '">' . esc_html__('sem arte', 'aerion-commerce') . '</span>',
                esc_attr($url),
                esc_html__('Escolher da biblioteca', 'aerion-commerce'),
                esc_html__('Remover', 'aerion-commerce'),
                esc_html($dica)
            );
        }
        echo '</div></div>';

        self::script_admin();
    }

    /** Converte o valor gravado para o formato que `datetime-local` aceita. */
    private static function para_campo(string $v): string
    {
        $v = trim($v);
        if ($v === '') {
            return '';
        }
        // O campo aceita "AAAA-MM-DDTHH:MM:SS"; valores antigos vem sem segundos.
        return strlen($v) === 16 ? $v . ':00' : $v;
    }

    /**
     * Seletor de midia e alternancia entre os tipos de desconto.
     *
     * Impresso na propria tela em vez de virar arquivo: sao vinte linhas que so
     * existem na edicao de campanha, e um arquivo separado seria uma requisicao
     * a mais em todo o painel para servir uma pagina.
     */
    private static function script_admin(): void
    {
        ?>
        <script>
        (function () {
          var caixa = document.getElementById('aerion_campaign_rules');
          if (!caixa) return;

          function alternarTipo() {
            var tipo = caixa.querySelector('[data-ac-tipo]');
            if (!tipo) return;
            caixa.querySelectorAll('[data-ac-campo]').forEach(function (linha) {
              linha.style.display = linha.getAttribute('data-ac-campo') === tipo.value ? '' : 'none';
            });
          }
          caixa.addEventListener('change', function (e) {
            if (e.target.matches('[data-ac-tipo]')) alternarTipo();
          });
          alternarTipo();

          caixa.addEventListener('click', function (e) {
            var escolher = e.target.closest('[data-ac-escolher]');
            var limpar = e.target.closest('[data-ac-limpar]');
            if (!escolher && !limpar) return;
            e.preventDefault();
            var chave = (escolher || limpar).getAttribute(escolher ? 'data-ac-escolher' : 'data-ac-limpar');
            var campo = document.getElementById('ac-' + chave);
            var previa = caixa.querySelector('[data-ac-previa="' + chave + '"]');

            if (limpar) { campo.value = ''; trocarPrevia(previa, '', chave); return; }

            var seletor = wp.media({ title: 'Escolher arte', multiple: false, library: { type: 'image' } });
            seletor.on('select', function () {
              var arquivo = seletor.state().get('selection').first().toJSON();
              campo.value = arquivo.url;
              trocarPrevia(previa, arquivo.url, chave);
            });
            seletor.open();
          });

          function trocarPrevia(atual, url, chave) {
            if (!atual) return;
            var novo;
            if (url) {
              novo = document.createElement('img');
              novo.src = url;
              novo.alt = '';
            } else {
              novo = document.createElement('span');
              novo.className = 'ac-vazio';
              novo.textContent = 'sem arte';
            }
            novo.setAttribute('data-ac-previa', chave);
            atual.parentNode.replaceChild(novo, atual);
          }
        })();
        </script>
        <?php
    }

    public static function save(int $postId): void
    {
        if(wp_is_post_revision($postId)||!current_user_can('edit_post',$postId)||!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['aerion_campaign_nonce']??'')),'aerion_campaign_save'))return;
        $r=wp_unslash($_POST['ac']??[]); if(!is_array($r))return;
        $start=self::date((string)($r['start']??''));$end=self::date((string)($r['end']??''));
        if(!$start||!$end||strtotime($end)<=strtotime($start))return;
        $v=['start'=>$start,'end'=>$end,'priority'=>absint($r['priority']??0),
            'audience'=>in_array(($r['audience']??''),['consumer','trade','both'],true)?$r['audience']:'both',
            'type'=>($r['type']??'')==='final'?'final':'percentage',
            'percentage'=>min(99,max(0,(float)($r['percentage']??0))),
            'products'=>array_values(array_unique(array_filter(array_map('absint',(array)($r['products']??[]))))),
            'families'=>array_values(array_unique(array_filter(array_map('absint',(array)($r['families']??[]))))),
            'prices'=>self::clean_prices((string)($r['prices']??'')),'featured'=>($r['featured']??'')==='yes'?'yes':'no',
            'color'=>sanitize_hex_color((string)($r['color']??''))?:'#ff6a00',
            'eyebrow'=>sanitize_text_field((string)($r['eyebrow']??'')),'subtitle'=>sanitize_text_field((string)($r['subtitle']??'')),
            'mini_image'=>esc_url_raw((string)($r['mini_image']??''))];
        $v['desktop_image']=esc_url_raw((string)($r['desktop_image']??''));
        $v['mobile_image']=esc_url_raw((string)($r['mobile_image']??''));
        $v['alt']=sanitize_text_field((string)($r['alt']??''));
        $v['link']=esc_url_raw((string)($r['link']??''));
        $v['order']=absint($r['order']??0);
        foreach($v as $key=>$value)update_post_meta($postId,'_aerion_campaign_'.$key,$value);
        self::$cache=[];
    }

    public static function meta(int $id): array
    {
        $m=['start'=>'','end'=>'','priority'=>0,'audience'=>'both','type'=>'percentage','percentage'=>0,'products'=>[],'families'=>[],'prices'=>'','featured'=>'no','color'=>'#ff6a00','eyebrow'=>'','subtitle'=>'','mini_image'=>''];
        $m+=['desktop_image'=>'','mobile_image'=>'','alt'=>'','link'=>'','order'=>0];
        // Texto do botao do slide. Vazio mantem 'Ver ofertas', que e o que
        // toda campanha de desconto quer dizer; um lancamento sem oferta nao.
        $m+=['cta'=>''];
        foreach($m as $key=>$default){$v=get_post_meta($id,'_aerion_campaign_'.$key,true);$m[$key]=$v===''?$default:$v;}
        $m['products']=array_map('absint',(array)$m['products']);$m['families']=array_map('absint',(array)$m['families']);
        return $m;
    }

    public static function active_for_product(int $productId,?string $audience=null): ?array
    {
        $audience??=Aerion_B2B::is_approved()?'trade':'consumer';$key=$productId.':'.$audience;
        if(array_key_exists($key,self::$cache))return self::$cache[$key];
        $now=time();
        $posts=get_posts(['post_type'=>'aerion_campaign','post_status'=>'publish','numberposts'=>-1,'meta_key'=>'_aerion_campaign_priority','orderby'=>['meta_value_num'=>'DESC','date'=>'DESC']]);
        foreach($posts as $p){$m=self::meta($p->ID);
            $start=self::timestamp((string)$m['start']);$end=self::timestamp((string)$m['end'],true);
            if(!$start||!$end||$start>$now||$end<=$now||!in_array($m['audience'],[$audience,'both'],true))continue;
            $selected=in_array($productId,$m['products'],true);
            if(!$selected&&$m['families'])$selected=(bool)array_intersect($m['families'],wp_get_post_terms($productId,'aerion_family',['fields'=>'ids']));
            if($selected)return self::$cache[$key]=['id'=>$p->ID,'title'=>$p->post_title,'url'=>add_query_arg('campanha',$p->post_name,home_url('/loja/')),'meta'=>$m];
        }
        return self::$cache[$key]=null;
    }

    public static function price(float $base,WC_Product $product,?string $audience=null): float
    {
        $c=self::active_for_product($product->get_parent_id()?:$product->get_id(),$audience);if(!$c||$base<=0)return $base;$m=$c['meta'];
        if($m['type']==='final'){$prices=self::prices($m['prices']);return isset($prices[$product->get_sku()])?min($base,$prices[$product->get_sku()]):$base;}
        return round($base*(1-((float)$m['percentage']/100)),wc_get_price_decimals());
    }

    /**
     * Marca o <body> com `aerion-black-november` enquanto a campanha de slug
     * `black-november` estiver dentro do período (início/fim do cadastro).
     * O CSS temático da campanha (preto) depende desta classe; ao fim da
     * campanha ela some sozinha e o visual volta ao normal.
     */
    public static function classe_black_november(array $classes): array
    {
        $p = get_page_by_path('black-november', OBJECT, 'aerion_campaign');
        if ($p && $p->post_status === 'publish') {
            $m = self::meta($p->ID);
            $start = self::timestamp((string) $m['start']);
            $end = self::timestamp((string) $m['end'], true);
            $now = time();
            if ($start && $end && $start <= $now && $end > $now) {
                $classes[] = 'aerion-black-november';
            }
        }
        return $classes;
    }

    public static function featured(): array
    {
        $out=[];$now=time();
        foreach(get_posts(['post_type'=>'aerion_campaign','post_status'=>'publish','numberposts'=>-1])as$p){$m=self::meta($p->ID);$start=self::timestamp((string)$m['start']);$end=self::timestamp((string)$m['end'],true);if($m['featured']==='yes'&&$start&&$end&&$start<=$now&&$end>$now)$out[]=['id'=>$p->ID,'title'=>$p->post_title,'url'=>$m['link']?:add_query_arg('campanha',$p->post_name,home_url('/loja/')),'image'=>$m['desktop_image']?:get_the_post_thumbnail_url($p,'full')?:'','mobile_image'=>$m['mobile_image'],'alt'=>$m['alt']?:$p->post_title,'meta'=>$m];}
        usort($out,static fn(array $a,array $b):int=>(int)$a['meta']['order']<=>(int)$b['meta']['order']);
        return $out;
    }

    public static function ensure_launch_campaign(): void
    {
        if(!function_exists('wc_get_products'))return;
        $existing=get_page_by_path('ofertas-de-lancamento',OBJECT,'aerion_campaign');
        if($existing){
            if(get_post_meta($existing->ID,'_aerion_campaign_mini_image',true)==='')update_post_meta($existing->ID,'_aerion_campaign_mini_image',get_theme_file_uri('/assets/source-images/campaigns/ofertas-de-lancamento/mini.png'));
            if((float)get_post_meta($existing->ID,'_aerion_campaign_percentage',true)<=0)update_post_meta($existing->ID,'_aerion_campaign_percentage',15);
            update_post_meta($existing->ID,'_aerion_campaign_featured','yes');
            if(get_post_meta($existing->ID,'_aerion_campaign_desktop_image',true)==='')update_post_meta($existing->ID,'_aerion_campaign_desktop_image',get_theme_file_uri('/assets/source-images/campaigns/ofertas-de-lancamento/hero.png'));
            if(get_post_meta($existing->ID,'_aerion_campaign_mobile_image',true)==='')update_post_meta($existing->ID,'_aerion_campaign_mobile_image',get_theme_file_uri('/assets/source-images/campaigns/ofertas-de-lancamento/hero-mobile.png'));
            if(get_post_meta($existing->ID,'_aerion_campaign_alt',true)==='')update_post_meta($existing->ID,'_aerion_campaign_alt','Ofertas de lançamento Aerion com drones Autel');
            if(get_post_meta($existing->ID,'_aerion_campaign_link',true)==='')update_post_meta($existing->ID,'_aerion_campaign_link',home_url('/loja/?campanha=ofertas-de-lancamento'));
            if(get_post_meta($existing->ID,'_aerion_campaign_order',true)==='')update_post_meta($existing->ID,'_aerion_campaign_order',1);
            return;
        }
        $products=wc_get_products(['status'=>'publish','limit'=>8,'orderby'=>'menu_order','order'=>'ASC']);
        $ids=[];foreach($products as$product)if((float)$product->get_price()>0)$ids[]=$product->get_id();
        if(!$ids)return;
        $id=wp_insert_post(['post_type'=>'aerion_campaign','post_status'=>'publish','post_title'=>'Ofertas de Lançamento','post_name'=>'ofertas-de-lancamento','post_content'=>'Seleção inaugural de ofertas da Loja Aerion.']);
        if(is_wp_error($id)||!$id)return;
        $meta=[
            'start'=>'2026-08-01T00:00','end'=>'2026-08-31T23:59','priority'=>10,'audience'=>'both',
            'type'=>'percentage','percentage'=>15,'products'=>$ids,'families'=>[],'prices'=>'','featured'=>'yes',
            'color'=>'#0877bd','eyebrow'=>'Ofertas de Lançamento','subtitle'=>'Condições especiais de lançamento por tempo limitado.',
            'mini_image'=>get_theme_file_uri('/assets/source-images/campaigns/ofertas-de-lancamento/mini.png'),
            'desktop_image'=>get_theme_file_uri('/assets/source-images/campaigns/ofertas-de-lancamento/hero.png'),
            'mobile_image'=>get_theme_file_uri('/assets/source-images/campaigns/ofertas-de-lancamento/hero-mobile.png'),
            'alt'=>'Ofertas de lançamento Aerion com drones Autel',
            'link'=>home_url('/loja/?campanha=ofertas-de-lancamento'),
            'order'=>1,
        ];
        foreach($meta as$key=>$value)update_post_meta((int)$id,'_aerion_campaign_'.$key,$value);
    }

    public static function countdown(array $c,string $size='medium'): string
    {
        $end=self::timestamp((string)$c['meta']['end']);
        if(!$end)return'';
        $variant=in_array($size,['compact','medium','large'],true)?$size:'medium';
        $icon='<svg class="aerion-countdown__icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M18 2h12v5H18zM35.3 7.1l3.5-3.5 5.6 5.6-3.6 3.6z"/><path fill-rule="evenodd" d="M24 8a19 19 0 1 0 0 38 19 19 0 0 0 0-38Zm0 5a14 14 0 1 0 0 28 14 14 0 0 0 0-28Z"/><path d="M24 13v14h14A14 14 0 0 0 24 13Z"/></svg>';
        return'<span class="aerion-countdown aerion-countdown--'.esc_attr($variant).'" data-aerion-countdown="'.esc_attr(gmdate('c',$end)).'">'.$icon.'<span class="aerion-countdown__body"><span class="aerion-countdown__lead">Termina em</span><strong class="aerion-countdown__flip" aria-hidden="true"><span class="aerion-countdown__unit"><span class="aerion-countdown__digits" data-aerion-countdown-days><b>00</b></span><small>Dias</small></span><i>:</i><span class="aerion-countdown__unit"><span class="aerion-countdown__digits" data-aerion-countdown-hours><b>00</b></span><small>Horas</small></span><i>:</i><span class="aerion-countdown__unit"><span class="aerion-countdown__digits" data-aerion-countdown-minutes><b>00</b></span><small>Min</small></span><i>:</i><span class="aerion-countdown__unit"><span class="aerion-countdown__digits" data-aerion-countdown-seconds><b>00</b></span><small>Seg</small></span></strong></span><span class="screen-reader-text" data-aerion-countdown-value></span></span>';
    }

    /**
     * Converte a data gravada em timestamp.
     *
     * Aceita com e sem segundos: o campo passou a oferecer segundos e o que ja
     * estava gravado nao tem. O `!` no inicio do formato importa — sem ele,
     * `createFromFormat` preenche os campos NAO informados com a hora ATUAL, e
     * um fim gravado como "23:59" terminava num segundo diferente a cada
     * carregamento, entre 23:59:00 e 23:59:59.
     *
     * `$fimDeMinuto` fecha o intervalo no ultimo segundo quando a data nao traz
     * segundos: um fim "30/09 23:59" vale ate 23:59:59, nao ate 23:59:00.
     */
    private static function timestamp(string $v, bool $fimDeMinuto = false): int
    {
        $v = trim($v);
        foreach (['Y-m-d\TH:i:s' => 0, 'Y-m-d\TH:i' => 59] as $formato => $sobra) {
            $d = DateTimeImmutable::createFromFormat('!' . $formato, $v, wp_timezone());
            if ($d instanceof DateTimeImmutable) {
                return $d->getTimestamp() + ($fimDeMinuto ? $sobra : 0);
            }
        }
        return 0;
    }

    private static function date(string $v): string
    {
        $v = trim($v);
        foreach (['Y-m-d\TH:i:s', 'Y-m-d\TH:i'] as $formato) {
            $d = DateTimeImmutable::createFromFormat('!' . $formato, $v, wp_timezone());
            if ($d instanceof DateTimeImmutable) {
                return $d->format('Y-m-d\TH:i:s');
            }
        }
        return '';
    }
    private static function clean_prices(string $raw): string{$o=[];foreach(preg_split('/\\R/',$raw)?:[]as$line)if(preg_match('/^\\s*([A-Za-z0-9._-]+)\\s*=\\s*([0-9.,]+)\\s*$/',$line,$m))$o[]=sanitize_text_field($m[1]).'='.wc_format_decimal(str_replace(',','.',$m[2]));return implode(PHP_EOL,$o);}
    private static function prices(string $raw): array{$o=[];foreach(preg_split('/\\R/',$raw)?:[]as$line){[$sku,$p]=array_pad(explode('=',$line,2),2,'');if($sku&&is_numeric($p))$o[$sku]=(float)$p;}return $o;}
}
