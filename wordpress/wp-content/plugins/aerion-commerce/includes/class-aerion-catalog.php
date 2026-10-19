<?php
declare(strict_types=1);
if(!defined('ABSPATH'))exit;

final class Aerion_Catalog
{
    public const EVO_NEST_SKU = 'EVO-NEST';
    public const HUBSAN_MINI_7_SKU = 'HUBSAN-MINI-7';
    public static function boot(): void
    {
        if(defined('WP_CLI')&&WP_CLI){WP_CLI::add_command('aerion-store catalog import',[self::class,'cli_import']);WP_CLI::add_command('aerion-store catalog migrate-identifiers',[self::class,'cli_migrate_identifiers']);}
    }

    public static function cli_import(): void
    {
        // Os precos de rows() ja sao os do Pix a 5% (cartao = Pix em ,99 / 0,95).
        // Importar numa loja ainda na regra antiga (15%) derrubaria o Pix em ~10%.
        // Em instalacao nova, sem produto do catalogo, a regra nova liga aqui.
        if(!Aerion_Pricing::migrated()){
            if(wc_get_products(['limit'=>1,'return'=>'ids','status'=>['publish','private','draft'],'meta_key'=>'_aerion_catalog_managed','meta_value'=>'yes'])){
                WP_CLI::error('Rode antes: wp aerion-store pricing migrate-pix5. Os preços do catálogo já são os do Pix a 5%.');
            }
            Aerion_Pricing_Migration::migrate();
        }
        $result=self::import();
        WP_CLI::success(sprintf('%d produtos importados; %d SKUs em quarentena.',$result['imported'],$result['quarantined']));
    }

    public static function import(): array
    {
        if(!term_exists('docas','product_cat'))wp_insert_term('Docas','product_cat',['slug'=>'docas']);
        self::retire_products(['901030203','901030201']);
        $imported=0;
        foreach(self::rows() as $row){
            $isInternal=in_array($row['sku'],self::standalone_component_skus(),true);
            $id=wc_get_product_id_by_sku($row['sku']);
            if($id){
                $existing=wc_get_product($id);
                if(!$existing||$existing->get_meta('_aerion_catalog_managed',true)!=='yes'){
                    continue;
                }
            }
            $p=new WC_Product_Simple($id);
            $p->set_name($row['name']);$p->set_slug($row['slug']);$p->set_sku($row['sku']);
            $p->set_status($isInternal?'private':'publish');$p->set_catalog_visibility($isInternal?'hidden':'visible');
            $p->set_regular_price($row['public']);$p->set_price($row['public']);
            $p->set_reviews_allowed(true);
            $presale=$p->get_meta('_aerion_presale',true)==='yes';
            if(!$row['virtual'])$p->set_backorders($presale?'notify':'no');
            if(get_option('aerion_inventory_has_trusted_import','no')!=='yes'){$p->set_manage_stock(false);$p->set_stock_status('instock');}
            elseif($p->managing_stock()&&(int)$p->get_stock_quantity()<=0)$p->set_stock_status($presale?'onbackorder':'outofstock');
            if($row['virtual']){$p->set_virtual(true);$p->set_downloadable(false);}
            $p->update_meta_data('_aerion_trade_price',$row['trade']);
            $p->update_meta_data('_aerion_brand','Autel Robotics');
            $p->update_meta_data('_aerion_mpn',$row['sku']);
            if($row['gtin'])$p->update_meta_data('_aerion_gtin',$row['gtin']);
            $p->update_meta_data('_aerion_shipping_validated',$row['shipping']?'yes':'no');
            $p->update_meta_data('_aerion_bom',$row['bom']);
            $p->update_meta_data('_aerion_catalog_managed','yes');
            // Os precos de rows() ja estao no Pix a 5%: a migracao nao os converte de novo.
            $p->update_meta_data('_aerion_price_basis',Aerion_Pricing_Migration::BASIS);
            $facets=self::facets($row);
            $p->update_meta_data('_aerion_filter_applications',$facets['applications']);
            $p->update_meta_data('_aerion_filter_autonomy',$facets['autonomy']);
            $p->update_meta_data('_aerion_filter_technologies',$facets['technologies']);
            $p->update_meta_data('_aerion_filter_camera',$facets['camera']);
            $p->update_meta_data('_aerion_filter_rtk',$facets['rtk']);
            $p->update_meta_data('_aerion_filter_product_type',$facets['product_type']);
            $p->update_meta_data('_aerion_filter_battery_count',$facets['battery_count']);
            $p->update_meta_data('_aerion_filter_license',$facets['license']);
            if($row['shipping']){$p->set_weight($row['weight']);$p->set_length($row['length']);$p->set_width($row['width']);$p->set_height($row['height']);}
            $id=$p->save();
            wp_set_object_terms($id,self::store_category($row),'product_cat');
            wp_set_object_terms($id,$row['family'],'aerion_family');
            $imported++;
        }
        $componentSkus=[];
        foreach(self::rows()as$row)foreach($row['bom']as$c)$componentSkus[$c['sku']]=true;
        foreach(array_keys($componentSkus)as$sku){
            if(wc_get_product_id_by_sku($sku))continue;
            $component=new WC_Product_Simple();
            $component->set_name('Componente interno '.$sku);$component->set_sku($sku);
            $component->set_status('private');$component->set_catalog_visibility('hidden');
            $component->set_manage_stock(false);$component->set_stock_status('instock');
            $component->update_meta_data('_aerion_internal_component','yes');$component->save();
        }
        self::upsert_evo_nest();
        self::upsert_hubsan_mini_7();
        $conflicts=self::conflicts();update_option('aerion_catalog_quarantine',$conflicts,false);
        update_option('aerion_catalog_imported_at',current_time('mysql',true),false);
        if(get_option('aerion_inventory_has_trusted_import','no')==='yes')delete_option('aerion_inventory_last_hash');
        return ['imported'=>$imported,'quarantined'=>count($conflicts)];
    }

    public static function cli_migrate_identifiers(): void
    {
        $post=get_page_by_path('evo-nest',OBJECT,'product');
        $product=$post?wc_get_product((int)$post->ID):null;
        if(!$product instanceof WC_Product||$product->get_meta('_aerion_catalog_managed',true)!=='yes'||$product->get_sku()!=='') { WP_CLI::success('Nenhum identificador legado pendente.'); return; }
        $product->set_sku(self::EVO_NEST_SKU);$product->save();
        WP_CLI::success('SKU de consulta do EVO Nest migrado.');
    }

    private static function standalone_component_skus(): array
    {
        return [];
    }

    private static function retire_products(array $skus): void
    {
        foreach($skus as $sku){
            $id=wc_get_product_id_by_sku($sku);
            $product=$id?wc_get_product($id):null;
            if(!$product instanceof WC_Product||$product->get_meta('_aerion_catalog_managed',true)!=='yes')continue;
            $product->set_status('draft');
            $product->set_catalog_visibility('hidden');
            $product->save();
        }
    }

    private static function legacy_facets(array $row): array
    {
        $name=remove_accents(strtolower((string)$row['name']));
        $isDrone=in_array($row['category'],['Drones','Kits'],true);
        $applications=[];
        if($isDrone){
            $applications=['Construção e Topografia','Inspeção Industrial e Energia'];
            if(str_contains($name,'640t')||str_contains($name,'4t')||str_contains($name,'4n')||str_contains($name,'alpha')||str_contains($name,'l35t')){
                $applications[]='Segurança Pública e Defesa Civil';
                $applications[]='Resgate e Emergências';
            }
        }elseif($row['category']==='Softwares'){
            $applications=['Construção e Topografia','Inspeção Industrial e Energia'];
        }

        $autonomy='';
        if($isDrone){
            if(str_contains($name,'evo max'))$autonomy='Até 42 min';
            elseif(str_contains($name,'alpha')||str_contains($name,'evo lite')||str_contains($name,'evo ii'))$autonomy='Até 40 min';
        }

        $technologies=[];
        if(str_contains($name,'rtk'))$technologies[]='RTK integrado';
        elseif(str_contains($name,'evo max'))$technologies[]='Compatível com RTK';
        elseif(str_contains($name,'alpha'))$technologies[]='RTK integrado';
        if(str_contains($name,'640t')||str_contains($name,'4t')||str_contains($name,'l35t'))$technologies[]='Câmera térmica';
        if(str_contains($name,'4n')||str_contains($name,'alpha')||str_contains($name,'l35t'))$technologies[]='Visão noturna';
        if(str_contains($name,'6k'))$technologies[]='Câmera 6K';
        if(str_contains($name,'mapper'))$technologies[]='Mapeamento 2D e 3D';

        return ['applications'=>array_values(array_unique($applications)),'autonomy'=>$autonomy,'technologies'=>array_values(array_unique($technologies))];
    }

    private static function facets(array $row): array
    {
        $name=remove_accents(strtolower((string)$row['name']));
        $category=self::store_category($row);
        $isAircraft=in_array($category,['Drones','Kits'],true);
        $applications=[];
        if($isAircraft){
            $applications=['Construção e Topografia','Inspeção Industrial e Energia'];
            if(str_contains($name,'640t')||str_contains($name,'4t')||str_contains($name,'4n')||str_contains($name,'alpha')||str_contains($name,'l35t')){
                $applications[]='Segurança Pública e Defesa Civil';
                $applications[]='Resgate e Emergências';
            }
        }elseif($category==='Softwares')$applications=['Construção e Topografia','Inspeção Industrial e Energia'];

        $autonomy='';
        if($isAircraft){
            if(str_contains($name,'evo max'))$autonomy='Até 42 min';
            elseif(str_contains($name,'alpha')||str_contains($name,'evo lite')||str_contains($name,'evo ii'))$autonomy='Até 40 min';
        }

        $camera=[];
        if(str_contains($name,'640t')||str_contains($name,'4t')||str_contains($name,'l35t'))$camera[]='Térmica';
        if(str_contains($name,'4n')||str_contains($name,'alpha')||str_contains($name,'l35t'))$camera[]='Noturna / Starlight';
        if(str_contains($name,'6k'))$camera[]='RGB 6K';
        if(str_contains($name,'4t')||str_contains($name,'alpha')||str_contains($name,'l35t'))$camera[]='RGB com zoom';

        $rtk='';
        if($isAircraft){
            if(str_contains($name,'rtk')||str_contains($name,'alpha'))$rtk='Sim — integrado';
            elseif(str_contains($name,'evo max'))$rtk='Sim — módulo avulso';
            else $rtk='Não';
        }

        $productType='';
        if($category==='Baterias e Carregadores'){
            if(str_contains($name,'bateria'))$productType='Bateria';
            elseif(str_contains($name,'maleta'))$productType='Maleta carregadora';
            else $productType='Multicarregador';
        }elseif($category==='Payloads'){
            if(str_contains($name,'rtk'))$productType='Módulo RTK';
            elseif(str_contains($name,'camera')||str_contains($name,'gimbal'))$productType='Câmera / gimbal';
            elseif(str_contains($name,'strobe'))$productType='Strobe';
            elseif(str_contains($name,'spotlight'))$productType='Speaker + spotlight';
            elseif(str_contains($name,'speaker'))$productType='Speaker';
        }elseif($category==='Softwares')$productType='Software de mapeamento';

        $batteryCount='';
        if($category==='Kits'&&preg_match('/com\s+(\d+)\s+baterias?/u',$name,$match))$batteryCount=$match[1].' baterias';
        $license='';
        if($category==='Softwares'){
            if(str_contains($name,'mensal'))$license='Mensal';
            elseif(str_contains($name,'anual'))$license='Anual';
            elseif(str_contains($name,'perpetua'))$license='Perpétua';
        }
        $technologies=array_values(array_filter(array_merge($camera,$rtk!==''?[$rtk]:[])));
        return [
            'applications'=>array_values(array_unique($applications)),
            'autonomy'=>$autonomy,
            'technologies'=>$technologies,
            'camera'=>array_values(array_unique($camera)),
            'rtk'=>$rtk,
            'product_type'=>$productType,
            'battery_count'=>$batteryCount,
            'license'=>$license,
        ];
    }

    private static function store_category(array $row): string
    {
        if($row['category']==='Kits')return'Kits';
        if($row['category']!=='Acessórios')return(string)$row['category'];
        $name=remove_accents(strtolower((string)$row['name']));
        if(str_contains($name,'bateria')||str_contains($name,'carregador'))return'Baterias e Carregadores';
        if(str_contains($name,'camera')||str_contains($name,'gimbal')||str_contains($name,'rtk')||str_contains($name,'speaker')||str_contains($name,'spotlight')||str_contains($name,'strobe'))return'Payloads';
        return'Acessórios';
    }

    private static function upsert_evo_nest(): void
    {
        $id=wc_get_product_id_by_sku(self::EVO_NEST_SKU);
        if($id){$existing=wc_get_product($id);if(!$existing||$existing->get_meta('_aerion_catalog_managed',true)!=='yes')return;}
        $product=new WC_Product_Simple($id);
        $product->set_name('EVO Nest');
        $product->set_slug('evo-nest');
        $product->set_sku(self::EVO_NEST_SKU);
        $product->set_status('publish');
        $product->set_catalog_visibility('visible');
        $product->set_manage_stock(false);
        $product->set_stock_status('instock');
        $product->set_reviews_allowed(true);
        $product->update_meta_data('_aerion_brand','Autel Robotics');
        $product->update_meta_data('_aerion_catalog_managed','yes');
        $product->update_meta_data('_aerion_catalog_inquiry','yes');
        $product->update_meta_data('_aerion_filter_applications',['Inspeção Industrial e Energia','Segurança Pública e Defesa Civil']);
        $product->update_meta_data('_aerion_filter_autonomy','');
        $product->update_meta_data('_aerion_filter_technologies',['Operação remota','Carregamento autônomo','Proteção IP55']);
        $product->update_meta_data('_aerion_filter_camera',[]);
        $product->update_meta_data('_aerion_filter_rtk','Não se aplica');
        $product->update_meta_data('_aerion_filter_product_type','Doca autônoma');
        $product->update_meta_data('_aerion_filter_battery_count','');
        $product->update_meta_data('_aerion_filter_license','');
        $id=$product->save();
        wp_set_object_terms($id,'Docas','product_cat');
    }

    /**
     * HUBSAN Mini 7: fora do catalogo Autel/Sankhya de rows(), por isso tem
     * cadastro proprio, como o EVO Nest.
     *
     * Precos no Pix a 5%: publico R$ 5.999,99 no Pix (cartao 6.315,78) e
     * tabela de revenda R$ 4.499,99 no Pix (cartao 4.736,83). Os niveis saem
     * do motor: Silver R$ 4.199,99 e Gold R$ 4.019,99 no Pix.
     */
    public static function upsert_hubsan_mini_7(): void
    {
        $id=wc_get_product_id_by_sku(self::HUBSAN_MINI_7_SKU);
        if($id){$existing=wc_get_product($id);if(!$existing||$existing->get_meta('_aerion_catalog_managed',true)!=='yes')return;}
        $product=new WC_Product_Simple($id);
        $product->set_name('HUBSAN Mini 7');
        $product->set_slug('hubsan-mini-7');
        $product->set_sku(self::HUBSAN_MINI_7_SKU);
        $product->set_status('publish');
        $product->set_catalog_visibility('visible');
        $product->set_regular_price('6315.78');$product->set_price('6315.78');
        $product->set_reviews_allowed(true);
        $presale=$product->get_meta('_aerion_presale',true)==='yes';
        $product->set_backorders($presale?'notify':'no');
        if(get_option('aerion_inventory_has_trusted_import','no')!=='yes'){$product->set_manage_stock(false);$product->set_stock_status('instock');}
        elseif($product->managing_stock()&&(int)$product->get_stock_quantity()<=0)$product->set_stock_status($presale?'onbackorder':'outofstock');
        // Embalagem informada pela Aerion: 370 × 180 × 340 mm, 5,10 kg bruto.
        $product->set_weight('5.10');$product->set_length('37');$product->set_width('18');$product->set_height('34');
        $product->update_meta_data('_aerion_trade_price','4736.83');
        $product->update_meta_data('_aerion_brand','HUBSAN');
        $product->update_meta_data('_aerion_mpn',self::HUBSAN_MINI_7_SKU);
        $product->update_meta_data('_aerion_shipping_validated','yes');
        $product->update_meta_data('_aerion_catalog_managed','yes');
        $product->update_meta_data('_aerion_price_basis',Aerion_Pricing_Migration::BASIS);
        $product->update_meta_data('_aerion_institutional_url',home_url('/produtos/hubsan-mini-7/'));
        $product->update_meta_data('_aerion_filter_applications',['Criação de conteúdo','Viagens e lazer']);
        $product->update_meta_data('_aerion_filter_autonomy','Até 28 min');
        $product->update_meta_data('_aerion_filter_technologies',['Câmera de 1 polegada','Menos de 249 g']);
        $product->update_meta_data('_aerion_filter_camera',['RGB 4K']);
        $product->update_meta_data('_aerion_filter_rtk','Não');
        $product->update_meta_data('_aerion_filter_product_type','');
        $product->update_meta_data('_aerion_filter_battery_count','');
        $product->update_meta_data('_aerion_filter_license','');
        $id=$product->save();
        wp_set_object_terms($id,'Drones','product_cat');
        wp_set_object_terms($id,'HUBSAN Mini 7','aerion_family');
        $page=get_page_by_path('produtos/hubsan-mini-7',OBJECT,'page');
        if($page){
            update_post_meta($page->ID,'_aerion_wc_product_id',$id);
            update_post_meta($id,'_aerion_institutional_page_id',$page->ID);
        }
    }

    public static function rows(): array
    {
        $lines=[
          // Precos do Pix a 5% (wp aerion-store pricing migrate-pix5 --emit-rows):
          // publico = cartao cujo Pix termina em ,99; tabela = revenda no cartao.
          '102002996|EVO Lite 6K Enterprise 6,0 com 2 baterias|evo-lite-6k-enterprise-60|20562.09|14181.09|Drones|EVO Lite Enterprise||evo-lite-enterprise|0|1|1.25|35|25|15',
          '102003296|EVO Lite 6K Enterprise 7,9 com 2 baterias|evo-lite-6k-enterprise-79|23122.09|15946.37|Drones|EVO Lite Enterprise||evo-lite-enterprise|0|1|1.25|35|25|15',
          '102002930|EVO Lite 640T Enterprise 6,0 com 2 baterias|evo-lite-640t-enterprise-60|35731.57|24642.03|Drones|EVO Lite Enterprise||evo-lite-enterprise|0|1|1.25|35|25|15',
          '102003324|EVO Lite 640T Enterprise 7,9 com 2 baterias|evo-lite-640t-enterprise-79|39206.31|27039.33|Drones|EVO Lite Enterprise|||0|1|1.25|35|25|15',
          '102003505|EVO Max 4T V2 sem baterias|evo-max-4t-v2|49349.46|34034.54|Drones|EVO Max||evo-max-v2|0|1|4.50|48|40|25',
          '901030260|Autel Alpha L35T com 2 baterias|autel-alpha-l35t|159306.31|109866.89|Drones|Autel Alpha||autel-alpha|0|1|15|70|55|45',
          '102000642|Multi-Carregador EVO Lite|multi-carregador-evo-lite|1254.73|865.34|Acessórios|EVO Lite Enterprise|||0|0||||',
          '102002546|Multi-Carregador EVO Max|multi-carregador-evo-max|3079.99|2124.14|Acessórios|EVO Max|||0|0||||',
          'TBS100|Maleta Multi-Carregador Autel Alpha|multi-carregador-alpha-tbs100|26487.36|18267.31|Acessórios|Autel Alpha|||0|0||||',
          '102002596|Módulo RTK EVO Max|modulo-rtk-evo-max|5216.83|3598.34|Acessórios|EVO Max|||0|0||||',
          '102002240|Speaker e Spotlight EVO Max|speaker-spotlight-evo-max|8414.73|5803.60|Acessórios|EVO Max|||0|0||||',
          '102000617|Speaker EVO II Pro|speaker-evo-ii-pro|952.62|657.01|Acessórios|EVO II Pro|||0|0||||',
          '102000616|Strobe EVO II Pro|strobe-evo-ii-pro|658.94|454.86|Acessórios|EVO II Pro|||0|0||||',
          '102002205|Câmera Gimbal EVO Max 4N|camera-gimbal-evo-max-4n|63287.36|43647.16|Acessórios|EVO Max|||0|0||||',
          '102000941|Bateria EVO Lite|bateria-evo-lite|1466.31|1011.46|Acessórios|EVO Lite Enterprise|||0|1|.35|18|12|8',
          '102003061|Bateria EVO Max ABX41-D|bateria-evo-max-abx41-d|2838.94|1958.24|Acessórios|EVO Max|||0|1|.60|20|14|10',
          '102002556|Kit com 2 baterias Autel Alpha|baterias-autel-alpha-2|11194.73|7720.55|Acessórios|Autel Alpha|||0|1|2.20|30|22|18',
          '901030202|Autel Mapper licença perpétua|autel-mapper-perpetuo|28065.25|19355.39|Softwares|Autel Mapper||autel-mapper|1|1||||',
          '102002998|Kit EVO Lite 6K 6,0 com 4 baterias e multi-carregador|kit-evo-lite-6k-60-4-baterias|23693.67|16340.82|Kits|EVO Lite Enterprise|102002996:1,102000941:2,102000642:1||0|0||||',
          '102003298|Kit EVO Lite 6K 7,9 com 4 baterias e multi-carregador|kit-evo-lite-6k-79-4-baterias|26253.67|18106.10|Kits|EVO Lite Enterprise|102003296:1,102000941:2,102000642:1||0|0||||',
          '102003300|Kit EVO Lite 640T 6,0 com 2 baterias e multi-carregador|kit-evo-lite-640t-60-2-baterias|36068.41|24875.19|Kits|EVO Lite Enterprise|102002930:1,102000642:1||0|0||||',
          '102003301|Kit EVO Lite 640T 6,0 com 4 baterias e multi-carregador|kit-evo-lite-640t-60-4-baterias|38862.09|26801.76|Kits|EVO Lite Enterprise|102002930:1,102000941:2,102000642:1||0|0||||',
          '102001513|Kit EVO II Pro 6K RTK V3 7,9 com 2 baterias|kit-evo-ii-pro-6k-rtk-v3-2-baterias|21209.46|14627.37|Kits|EVO II Pro|||0|0||||',
          '102001512|Kit EVO II Pro 6K RTK V3 com multi-carregador e 2 baterias|kit-evo-ii-pro-6k-rtk-v3-multicarregador|36965.25|25493.43|Kits|EVO II Pro|||0|0||||',
          '102003506|Kit EVO Max 4T V2 com 2 baterias e multi-carregador|kit-evo-max-4t-v2-2-baterias|53955.78|37210.91|Kits|EVO Max|102003505:1,102003061:2,102002546:1||0|0||||',
          '102003508|Kit EVO Max 4T V2 com 4 baterias e multi-carregador|kit-evo-max-4t-v2-4-baterias|59364.20|40940.89|Kits|EVO Max|102003505:1,102003061:4,102002546:1||0|0||||',
          '901030263|Kit Autel Alpha L35T com 6 baterias|kit-autel-alpha-6-baterias|180629.46|124572.71|Kits|Autel Alpha|901030260:1,102002556:2||0|0||||',
          '901030264|Kit Autel Alpha L35T com 8 baterias|kit-autel-alpha-8-baterias|201953.67|139278.51|Kits|Autel Alpha|901030260:1,102002556:3||0|0||||',
        ];
        return array_map([self::class,'parse'],$lines);
    }

    private static function parse(string $line): array
    {
        $v=array_pad(explode('|',$line),15,'');
        $bom=[];foreach(array_filter(explode(',',$v[7]))as$part){[$sku,$qty]=array_pad(explode(':',$part,2),2,'1');$bom[]=['sku'=>$sku,'qty'=>max(1,absint($qty))];}
        $gtins=['102002996'=>'6924991132738','102003324'=>'889520219068'];
        return ['sku'=>$v[0],'name'=>$v[1],'slug'=>$v[2],'public'=>$v[3],'trade'=>$v[4],'gtin'=>$gtins[$v[0]]??'',
            'category'=>$v[5],'family'=>$v[6],'bom'=>$bom,
            'virtual'=>$v[9]==='1','shipping'=>$v[10]==='1','weight'=>$v[11],
            'length'=>$v[12],'width'=>$v[13],'height'=>$v[14]];
    }

    public static function conflicts(): array
    {
        return [
          '102002997'=>['Kit EVO Lite 6K 6,0','EVO Lite 640T 6,0'],
          '102003296'=>['Kit EVO Lite 6K 7,9','EVO Lite 6K 7,9'],
          '102003326'=>['Kit EVO Lite 640T 7,9','Kits EVO II Pro 6K e 640T'],
          '102003327'=>['Kit EVO Lite 640T 7,9','Kits EVO II Pro 6K e 640T'],
        ];
    }
}
