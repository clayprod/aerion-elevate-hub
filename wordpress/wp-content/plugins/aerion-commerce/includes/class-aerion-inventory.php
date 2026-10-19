<?php
declare(strict_types=1);
if(!defined('ABSPATH'))exit;

final class Aerion_Inventory
{
    /**
     * Linhas do relatorio que chegam por codigo interno, e nao por SKU.
     *
     * O saldo sai de duas empresas. A FILIAL SP (102) exporta cada item com o
     * proprio SKU em `CODPROD`, e o casamento e direto. A empresa 100 (ESTOQUE
     * AERION) exporta com o codigo interno do ERP — 3332, 3336 — que nao existe
     * no catalogo da loja. Sem traducao essas unidades sao descartadas em
     * silencio, e um produto com estoque nas duas empresas aparece na loja com o
     * saldo de uma so.
     *
     * O mapa e curto de proposito: so entra a linha cujo produto de destino e
     * inequivoco. Um "PREMIUM PACKAGE" sem tamanho de tela casa com mais de um
     * SKU da loja, e adivinhar ali colocaria estoque no kit errado.
     */
    private const CODPROD_ALIAS = [
        '3336' => '901030260',   // # AUTEL - ALPHA L35T  ->  Autel Alpha L35T com 2 baterias
    ];

    public static function boot(): void
    {
        add_action('admin_menu',[self::class,'menu']);
        add_action('admin_post_aerion_inventory_upload',[self::class,'upload']);
        add_filter('woocommerce_product_is_in_stock',[self::class,'kit_in_stock'],20,2);
        add_filter('woocommerce_quantity_input_max',[self::class,'kit_max_input'],20,2);
        add_filter('woocommerce_add_to_cart_validation',[self::class,'kit_valida_carrinho'],30,4);
        add_filter('woocommerce_update_cart_validation',[self::class,'kit_valida_atualizacao'],30,4);
        add_action('woocommerce_reduce_order_stock',[self::class,'reduce_components']);
        add_action('woocommerce_restore_order_stock',[self::class,'restore_components']);
        add_action('woocommerce_product_options_stock_status',[self::class,'presale_field']);
        add_action('woocommerce_admin_process_product_object',[self::class,'presale_save']);
        if(defined('WP_CLI')&&WP_CLI)WP_CLI::add_command('aerion-store inventory import',[self::class,'cli']);
    }

    public static function menu(): void
    {
        add_submenu_page('woocommerce','Estoque Aerion','Estoque Aerion','manage_woocommerce','aerion-inventory',[self::class,'page']);
    }

    public static function page(): void
    {
        if(!current_user_can('manage_woocommerce'))return;
        echo '<div class=wrap><h1>Estoque Aerion</h1><form method=post enctype=multipart/form-data action='.esc_url(admin_url('admin-post.php')).'><input type=hidden name=action value=aerion_inventory_upload>';
        wp_nonce_field('aerion_inventory_upload');
        echo '<input required type=file name=inventory accept=.xlsx><button>Importar</button></form></div>';
    }

    public static function upload(): void
    {
        if(!current_user_can('manage_woocommerce')||!check_admin_referer('aerion_inventory_upload'))wp_die('Acesso negado.');
        $f=$_FILES['inventory']??null;if(!$f||($f['error']??1)!==UPLOAD_ERR_OK)wp_die('Falha no upload.');
        $name=sanitize_file_name((string)$f['name']);if(!preg_match('/^SALDO EM ESTOQUE_(\\d{8})\\.xlsx$/i',$name))wp_die('Nome inválido.');
        $dir=self::directory();wp_mkdir_p($dir);$target=$dir.'/'.$name;
        if(!move_uploaded_file($f['tmp_name'],$target))wp_die('Falha ao guardar arquivo.');
        self::import_latest();wp_safe_redirect(admin_url('admin.php?page=aerion-inventory&imported=1'));exit;
    }

    public static function cli(array $args): void
    {
        $r=isset($args[0])?self::import($args[0]):self::import_latest();
        WP_CLI::success(wp_json_encode($r,JSON_UNESCAPED_UNICODE));
    }

    private static function directory(): string
    {
        $base=defined('AERION_PRIVATE_DIR')?AERION_PRIVATE_DIR:WP_CONTENT_DIR.'/aerion-private';
        return rtrim($base,'/\\').'/inventory';
    }

    public static function import_latest(): array
    {
        $files=glob(self::directory().'/SALDO EM ESTOQUE_*.xlsx')?:[];
        usort($files,static function(string $a,string $b):int{
            preg_match('/_(\\d{8})\\.xlsx$/i',$a,$ma);preg_match('/_(\\d{8})\\.xlsx$/i',$b,$mb);
            return strcmp($mb[1]??'',$ma[1]??'');
        });
        if(!$files)throw new RuntimeException('Nenhum relatório de estoque encontrado.');
        return self::import($files[0]);
    }

    public static function import(string $file): array
    {
        if(!is_readable($file))throw new RuntimeException('Relatório não legível.');
        $hash=hash_file('sha256',$file).':parser-4';if($hash===get_option('aerion_inventory_last_hash'))return ['status'=>'unchanged','file'=>basename($file)];
        $rows=self::read_xlsx($file);$whitelist=self::whitelist();
        $stock=[];foreach($rows as$row){$sku=self::sku_for_code((string)($row['CODPROD']??''));if($sku!==''&&isset($whitelist[$sku]))$stock[$sku]=($stock[$sku]??0)+max(0,(float)str_replace(',','.',(string)($row['DISPONÍVEL']??0)));}
        $result=self::apply_stock($stock,['file'=>basename($file),'hash'=>$hash]);
        update_option('aerion_inventory_last_hash',$hash,false);
        return $result;
    }

    /** SKUs cujo saldo a loja controla: os produtos do catalogo e os componentes dos kits. */
    public static function whitelist(): array
    {
        $whitelist=[];
        foreach(Aerion_Catalog::rows()as$r){$whitelist[$r['sku']]=true;foreach($r['bom']as$c)$whitelist[$c['sku']]=true;}
        return$whitelist;
    }

    /** CODPROD do Sankhya -> SKU da loja: numero sem casas decimais, com os aliases da empresa 100. */
    public static function sku_for_code(string $code): string
    {
        $code=trim($code);
        $sku=is_numeric($code)?number_format((float)$code,0,'',''):$code;
        return self::CODPROD_ALIAS[$sku]??$sku;
    }

    /**
     * Grava o saldo por SKU, venha ele da planilha XLSX ou da API do Sankhya.
     *
     * SKU controlado que nao vier em $stock fica com zero: tanto a planilha
     * quanto a API omitem produto sem saldo. Por isso quem chama nao pode
     * entregar um $stock vazio por falha de leitura — isso zeraria a loja.
     */
    public static function apply_stock(array $stock,array $meta=[]): array
    {
        // Todo produto publicado da loja segue o saldo do ERP, sem fluxo paralelo: quem o ERP nao devolve
        // (ou nem cadastrou) fica sem estoque. Venda sem estoque so existe como pre-venda marcada no produto.
        $skus=array_keys(self::whitelist());
        global $wpdb;
        foreach((array)$wpdb->get_col("SELECT m.meta_value FROM {$wpdb->postmeta} m JOIN {$wpdb->posts} p ON p.ID=m.post_id WHERE m.meta_key='_sku' AND m.meta_value<>'' AND p.post_type='product' AND p.post_status='publish'")as$extra)$skus[]=(string)$extra;
        $kits=[];
        foreach(array_unique($skus)as$sku){
            $id=wc_get_product_id_by_sku($sku);if(!$id)continue;$p=wc_get_product($id);if(!$p)continue;
            if($p->is_virtual()){$p->set_manage_stock(false);$p->set_stock_status('instock');$p->set_backorders('no');$p->save();continue;}
            $bom=$p->get_meta('_aerion_bom',true);
            if(is_array($bom)&&$bom){$kits[]=$id;continue;}
            $qty=(int)floor($stock[$sku]??0);
            $p->set_manage_stock(true);$p->set_stock_quantity($qty);
            $p->set_backorders(self::presale($p)?'notify':'no');
            $p->set_stock_status($qty>0?'instock':(self::presale($p)?'onbackorder':'outofstock'));
            $p->save();
        }
        self::refresh_kits($kits);
        $result=array_merge(['status'=>'imported'],$meta,['skus'=>count($stock),'at'=>current_time('mysql',true)]);
        update_option('aerion_inventory_last_import',$result,false);update_option('aerion_inventory_has_trusted_import','yes',false);
        return $result;
    }

    private static function read_xlsx(string $file): array
    {
        $zip=new ZipArchive();if($zip->open($file)!==true)throw new RuntimeException('XLSX inválido.');
        $shared=[];$xml=$zip->getFromName('xl/sharedStrings.xml');
        if($xml){$doc=simplexml_load_string($xml);if($doc)foreach($doc->si as$si)$shared[]=(string)$si->t;}
        $sheet=$zip->getFromName('xl/worksheets/sheet1.xml');$zip->close();
        if(!$sheet)throw new RuntimeException('Planilha principal ausente.');
        $xml=simplexml_load_string($sheet);if(!$xml)throw new RuntimeException('XML inválido.');
        $all=[];foreach($xml->sheetData->row as$row){$record=[];foreach($row->c as$c){preg_match('/([A-Z]+)\\d+/',(string)$c['r'],$m);$col=$m[1]??'';$value=(string)$c->v;if((string)$c['t']==='s')$value=$shared[(int)$value]??'';elseif((string)$c['t']==='inlineStr')$value=(string)$c->is->t;$record[$col]=$value;}$all[]=$record;}
        if(!$all)return[];$head=array_shift($all);$map=[];foreach($head as$col=>$name)$map[$col]=trim((string)$name);
        $out=[];foreach($all as$row){$item=[];foreach($row as$col=>$value)if(isset($map[$col]))$item[$map[$col]]=$value;$out[]=$item;}return$out;
    }

    public static function kit_in_stock(bool $inStock,WC_Product $product): bool
    {
        if(get_option('aerion_inventory_has_trusted_import','no')!=='yes')return$inStock;
        $bom=$product->get_meta('_aerion_bom',true);if(!is_array($bom)||!$bom)return$inStock;
        if(self::presale($product))return true;
        $q=self::kit_quantity($product);
        return$q===null?$inStock:$q>0;
    }

    /** Caixa "Pré-venda" na aba Estoque do produto (wp-admin). */
    public static function presale_field(): void
    {
        woocommerce_wp_checkbox([
            'id'          => '_aerion_presale',
            'label'       => __('Pré-venda', 'aerion-commerce'),
            'description' => __('Vende sem estoque. Sem esta marca, produto sem saldo (ou sem cadastro no ERP) aparece indisponível.', 'aerion-commerce'),
        ]);
    }

    public static function presale_save(WC_Product $product): void
    {
        $on=isset($_POST['_aerion_presale'])?'yes':'no'; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- nonce do WooCommerce ja validado
        $product->update_meta_data('_aerion_presale',$on);
        if($product->is_virtual()||$product->get_meta('_aerion_bom',true))return;
        $product->set_backorders($on==='yes'?'notify':'no');
        if($product->managing_stock()&&(int)$product->get_stock_quantity()<=0)$product->set_stock_status($on==='yes'?'onbackorder':'outofstock');
    }

    /** Pre-venda: unico caso em que um item vende sem estoque, marcado a mao no produto (wp-admin). */
    public static function presale(WC_Product $product): bool
    {
        return $product->get_meta('_aerion_presale',true)==='yes';
    }

    /**
     * Grava no kit o status derivado dos componentes, para listagens e buscas que leem o campo
     * em vez de passar pelo filtro. Sem componente (ou sem saldo): esgotado; so pre-venda vende assim.
     *
     * @param list<int>|null $ids kits a atualizar; null = todos os que tem composicao
     */
    public static function refresh_kits(?array $ids=null): void
    {
        if($ids===null){
            global $wpdb;
            $ids=array_map('intval',(array)$wpdb->get_col("SELECT DISTINCT post_id FROM {$wpdb->postmeta} WHERE meta_key='_aerion_bom'"));
        }
        foreach($ids as$id){
            $kit=wc_get_product($id);if(!$kit)continue;
            $bom=$kit->get_meta('_aerion_bom',true);if(!is_array($bom)||!$bom)continue;
            $q=self::kit_quantity($kit,true);
            $presale=self::presale($kit);
            $status=($q===null||$q>0)?'instock':($presale?'onbackorder':'outofstock');
            if($kit->get_stock_status()===$status&&$kit->get_backorders()===($presale?'notify':'no')&&!$kit->managing_stock())continue;
            $kit->set_manage_stock(false);$kit->set_backorders($presale?'notify':'no');$kit->set_stock_status($status);$kit->save();
        }
    }


    /**
     * Quantos kits dá para montar com o que existe em estoque dos componentes.
     *
     * É o mínimo entre as razões de cada componente: um kit que pede 1 drone e
     * 2 baterias, tendo 2 drones e 5 baterias, dá 2 kits — o drone limita, e a
     * quinta bateria não vira meio kit.
     *
     * Devolve null quando não há composição, ou quando nenhum componente
     * controla saldo: aí não há o que derivar e o produto segue a regra normal
     * do WooCommerce.
     */
    public static function kit_quantity(WC_Product $product,bool $ignorarPrevenda=false): ?int
    {
        $bom=$product->get_meta('_aerion_bom',true);
        if(!is_array($bom)||!$bom)return null;
        if(!$ignorarPrevenda&&self::presale($product))return null;
        $limite=null;
        foreach($bom as $c){
            $id=wc_get_product_id_by_sku((string)($c['sku']??''));
            $component=$id?wc_get_product($id):null;
            if(!$component)return 0;
            if(!$component->managing_stock())continue;
            $precisa=max(1,absint($c['qty']??1));
            $cabem=(int)floor(max(0,(int)$component->get_stock_quantity())/$precisa);
            $limite=$limite===null?$cabem:min($limite,$cabem);
        }
        return $limite;
    }

    /**
     * Teto do seletor de quantidade na página e no carrinho.
     *
     * Sem isto o cliente pode pedir dez kits havendo componente para dois: o kit
     * não controla saldo próprio — de propósito, para a baixa acontecer nos
     * componentes — e o WooCommerce não tem de onde tirar um limite sozinho.
     */
    public static function kit_max_input($max,$product)
    {
        if(!$product instanceof WC_Product)return$max;
        $q=self::kit_quantity($product);
        if($q===null)return$max;
        return($max>0&&$max<$q)?$max:$q;
    }

    /**
     * Barra o excesso na hora de adicionar, contando o que já está no carrinho.
     *
     * O teto do seletor cobre a interface; esta validação cobre o resto — link
     * direto com quantidade na URL, carrinho montado aos poucos, e a REST API.
     */
    public static function kit_valida_carrinho($valid,$productId,$quantity,$variationId=0)
    {
        if(!$valid)return$valid;
        $product=wc_get_product($variationId?:$productId);
        if(!$product instanceof WC_Product)return$valid;
        $disponivel=self::kit_quantity($product);
        if($disponivel===null)return$valid;

        $noCarrinho=0;
        if(function_exists('WC')&&WC()->cart){
            foreach(WC()->cart->get_cart() as $linha){
                if((int)($linha['product_id']??0)===(int)$productId)$noCarrinho+=(int)$linha['quantity'];
            }
        }
        if($noCarrinho+(int)$quantity<=$disponivel)return$valid;

        wc_add_notice(sprintf(
            $disponivel>0
                ? 'Temos %1$d unidade(s) de "%2$s" disponíveis com o estoque atual dos itens que o compõem.'
                : 'No momento não há componentes em estoque suficientes para montar "%2$s".',
            $disponivel,$product->get_name()
        ),'error');
        return false;
    }

    /**
     * Mesma regra ao alterar a quantidade dentro do carrinho.
     *
     * Sem isto o cliente contorna o limite entrando com 1 e editando para 10 na
     * página do carrinho, que é outro gancho.
     */
    public static function kit_valida_atualizacao($passou,$cartItemKey,$values,$quantity)
    {
        if(!$passou)return$passou;
        $product=isset($values['data'])&&$values['data'] instanceof WC_Product?$values['data']:null;
        if(!$product)return$passou;
        $disponivel=self::kit_quantity($product);
        if($disponivel===null||(int)$quantity<=$disponivel)return$passou;
        wc_add_notice(sprintf(
            'Temos %1$d unidade(s) de "%2$s" disponíveis com o estoque atual dos itens que o compõem.',
            $disponivel,$product->get_name()
        ),'error');
        return false;
    }

    public static function immediately_available(WC_Product $product): bool
    {
        $bom=$product->get_meta('_aerion_bom',true);
        if(is_array($bom)&&$bom){
            foreach($bom as$c){
                $id=wc_get_product_id_by_sku((string)($c['sku']??''));
                $component=$id?wc_get_product($id):null;
                if(!$component||($component->managing_stock()&&(int)$component->get_stock_quantity()<max(1,absint($c['qty']??1))))return false;
            }
            return true;
        }
        if($product->managing_stock())return(int)$product->get_stock_quantity()>0;
        return$product->get_stock_status()==='instock';
    }

    public static function reduce_components(WC_Order $order): void
    {
        self::change_components($order,-1,'_aerion_components_reduced');
        $order->delete_meta_data('_aerion_components_restored');$order->save();
    }

    public static function restore_components(WC_Order $order): void
    {
        self::change_components($order,1,'_aerion_components_restored');
        $order->delete_meta_data('_aerion_components_reduced');$order->save();
    }

    private static function change_components(WC_Order $order,int $direction,string $flag): void
    {
        if($order->get_meta($flag,true))return;
        $operation=$direction>0?'increase':'decrease';
        foreach($order->get_items()as$item){$p=$item->get_product();$bom=$p?$p->get_meta('_aerion_bom',true):[];if(!is_array($bom))continue;foreach($bom as$c){$id=wc_get_product_id_by_sku((string)($c['sku']??''));$component=$id?wc_get_product($id):null;$amount=max(1,absint($c['qty']??1))*$item->get_quantity();if($component&&$component->managing_stock())wc_update_product_stock($component,$amount,$operation);}}
        $order->update_meta_data($flag,current_time('mysql',true));$order->save();
        self::refresh_kits();
    }
}
