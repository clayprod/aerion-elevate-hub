<?php
declare(strict_types=1);
if(!defined('ABSPATH'))exit;

final class Aerion_Checkout
{
    private static bool $emailContext=false;

    /** Como o abatimento aparece no carrinho e no checkout. */
    private const ROTULO_DESCONTO = 'Desconto no Pix';

    /** Gateway do Pix no plugin do Mercado Pago. */
    private const GATEWAY_PIX = 'woo-mercado-pago-pix';

    /** Desconto vigente no pedido, resolvido uma vez por requisicao. */
    private static ?float $percentualVigente = null;

    /** Trava contra reentrada: resolver o gateway toca no total do carrinho. */
    private static bool $resolvendoGateway = false;

    public static function boot(): void
    {
        add_filter('woocommerce_cart_item_price',[self::class,'preco_unitario_com_pix'],20,2);
        add_filter('woocommerce_cart_item_subtotal',[self::class,'subtotal_com_pix'],20,2);
        add_filter('woocommerce_available_payment_gateways',[self::class,'pix_como_padrao'],20);
        add_filter('option_woocommerce_woo-mercado-pago-pix_settings',[self::class,'zerar_desconto_do_gateway']);
        add_filter('option_woocommerce_woo-mercado-pago-ticket_settings',[self::class,'zerar_desconto_do_gateway']);
        add_filter('woocommerce_gateway_title',[self::class,'titulo_com_desconto'],20,2);
        add_filter('gettext_woocommerce-mercadopago',[self::class,'rotulo_do_desconto'],10,2);
        add_filter('gettext_woocommerce-mercadopago',[self::class,'mensagem_de_recusa_por_seguranca'],11,2);
        add_action('woocommerce_cart_calculate_fees',[self::class,'desconto_do_pagamento_fora_do_checkout'],20);
        add_action('woocommerce_before_checkout_form',[self::class,'intro'],4);
        add_action('wp',[self::class,'remover_aviso_de_login']);
        add_action('woocommerce_before_thankyou',[self::class,'selo_de_sucesso'],5);
        add_filter('woocommerce_checkout_show_terms','__return_false');
        add_action('woocommerce_review_order_before_submit',[self::class,'aviso_termos'],20);
        add_action('wp',[self::class,'mover_pagamento'],20);
        add_action('woocommerce_checkout_before_order_review_heading',[self::class,'order_review_panel_start'],5);
        add_action('woocommerce_checkout_after_order_review',[self::class,'coupon_panel'],40);
        add_action('woocommerce_checkout_after_order_review',[self::class,'order_review_panel_end'],50);
        add_filter('woocommerce_checkout_fields',[self::class,'fields']);
        add_filter('woocommerce_default_address_fields',[self::class,'default_address_fields'],20);
        add_filter('woocommerce_localisation_address_formats',[self::class,'address_formats'],20);
        add_filter('woocommerce_formatted_address_replacements',[self::class,'address_replacements'],20,2);
        add_filter('woocommerce_order_formatted_billing_address',[self::class,'order_address_parts'],20,2);
        add_filter('woocommerce_order_formatted_shipping_address',[self::class,'order_address_parts'],20,2);
        add_filter('woocommerce_my_account_my_address_formatted_address',[self::class,'account_address_parts'],20,3);
        add_filter('woocommerce_admin_billing_fields',[self::class,'admin_address_fields'],20);
        add_filter('woocommerce_admin_shipping_fields',[self::class,'admin_address_fields'],20);
        add_filter('woocommerce_checkout_get_value',[self::class,'checkout_value'],20,2);
        add_action('woocommerce_after_checkout_validation',[self::class,'validate'],10,2);
        add_action('woocommerce_checkout_create_order',[self::class,'save'],10,2);
        add_action('woocommerce_admin_order_data_after_billing_address',[self::class,'admin_document']);
        add_filter('woocommerce_breadcrumb_home_url',[self::class,'store_url']);
        add_filter('woocommerce_return_to_shop_redirect',[self::class,'store_url']);
        add_filter('woocommerce_continue_shopping_redirect',[self::class,'store_url']);
        add_filter('woocommerce_get_privacy_policy_text',[self::class,'privacy_text'],20,2);
        add_filter('woocommerce_get_terms_and_conditions_checkbox_text',[self::class,'terms_text'],20);
        add_filter('woocommerce_order_button_text',[self::class,'order_button_text'],20);
        add_filter('woocommerce_no_available_payment_methods_message',[self::class,'payment_unavailable_message'],20);
        add_filter('woocommerce_order_button_html',[self::class,'payment_order_button_html'],20);
        add_filter('woocommerce_price_decimal_separator',static fn():string=>',',20);
        add_filter('woocommerce_price_thousand_separator',static fn():string=>'.',20);
        add_filter('woocommerce_price_num_decimals',static fn():int=>2,20);
        add_action('rest_api_init',[self::class,'register_cep_route']);
        add_filter('gettext',[self::class,'checkout_translation'],20,3);
        add_action('init',[self::class,'register_account_endpoint']);
        add_action('wp_loaded',[self::class,'maybe_flush_account_endpoint']);
        add_action('template_redirect',[self::class,'redirect_registered_customers']);
        add_filter('body_class',[self::class,'account_body_class']);
        add_filter('the_title',[self::class,'account_page_title'],20,2);
        add_filter('woocommerce_account_menu_items',[self::class,'account_menu_items'],30);
        add_filter('woocommerce_account_menu_item_classes',[self::class,'account_menu_item_classes'],30,2);
        add_action('woocommerce_before_customer_login_form',[self::class,'account_intro']);
        add_action('woocommerce_after_customer_login_form',[self::class,'account_switch']);
        add_action('woocommerce_account_cadastro_endpoint',[self::class,'registered_account_message']);
        add_action('woocommerce_account_dashboard',[self::class,'dashboard_overview'],5);
        add_action('woocommerce_before_account_orders',[self::class,'account_orders_intro'],5,1);
        add_action('woocommerce_before_edit_account_address_form',[self::class,'address_actions'],5);
        add_action('woocommerce_customer_save_address',[self::class,'customer_address_saved'],20,2);
        add_action('template_redirect',[self::class,'maybe_use_billing_for_shipping'],15);
        add_action('woocommerce_after_edit_account_form',[self::class,'billing_details_panel'],10);
        add_filter('pre_option_woocommerce_enable_myaccount_registration',static fn():string=>'yes');
        add_filter('pre_option_woocommerce_registration_generate_username',static fn():string=>'yes');
        add_filter('pre_option_woocommerce_registration_generate_password',static fn():string=>'no');
        add_action('woocommerce_register_form_start',[self::class,'registration_identity_fields']);
        add_action('woocommerce_register_form',[self::class,'registration_password_confirmation'],5);
        add_filter('woocommerce_registration_errors',[self::class,'validate_registration'],20,3);
        add_action('woocommerce_created_customer',[self::class,'save_registration'],20,3);
        add_action('woocommerce_edit_account_form',[self::class,'marketing_preference_field']);
        add_action('woocommerce_save_account_details',[self::class,'save_marketing_preference']);
        add_action('woocommerce_after_edit_account_form',[self::class,'account_deletion_panel']);
        add_action('template_redirect',[self::class,'maybe_delete_account'],20);
        foreach([
            'new_order','cancelled_order','customer_cancelled_order','failed_order','customer_failed_order','customer_on_hold_order',
            'customer_processing_order','customer_completed_order','customer_refunded_order',
            'customer_invoice','customer_note','customer_reset_password','customer_new_account',
            'customer_pos_completed_order','customer_pos_refunded_order','customer_verify_email',
        ]as$emailId){
            add_filter('woocommerce_email_subject_'.$emailId,[self::class,'email_subject'],20,2);
            add_filter('woocommerce_email_heading_'.$emailId,[self::class,'email_heading'],20,2);
        }
        add_action('woocommerce_email_header',[self::class,'begin_email_translation'],0,2);
        add_action('woocommerce_email_footer',[self::class,'end_email_translation'],PHP_INT_MAX,1);
        add_filter('woocommerce_email_footer_text',static fn():string=>'Aerion Technologies · Loja oficial Autel no Brasil');
    }

    public static function register_account_endpoint(): void
    {
        add_rewrite_endpoint('cadastro',EP_ROOT|EP_PAGES);
    }

    public static function maybe_flush_account_endpoint(): void
    {
        if(get_option('aerion_registration_endpoint_version')==='1')return;
        flush_rewrite_rules(false);
        update_option('aerion_registration_endpoint_version','1',false);
    }

    private static function is_registration_screen(): bool
    {
        global $wp;
        return isset($wp->query_vars)&&array_key_exists('cadastro',$wp->query_vars);
    }

    public static function redirect_registered_customers(): void
    {
        if(is_user_logged_in()&&self::is_registration_screen()){
            wp_safe_redirect(wc_get_page_permalink('myaccount'));
            exit;
        }
        if(is_user_logged_in()&&function_exists('is_account_page')&&is_account_page()&&function_exists('is_wc_endpoint_url')&&is_wc_endpoint_url('downloads')){
            wp_safe_redirect(wc_get_page_permalink('myaccount'));
            exit;
        }
    }

    public static function account_body_class(array $classes): array
    {
        if(self::is_registration_screen())$classes[]='aerion-registration-page';
        if(is_user_logged_in()&&function_exists('is_account_page')&&is_account_page()&&function_exists('is_wc_endpoint_url')&&!is_wc_endpoint_url())$classes[]='aerion-account-dashboard-page';
        if(is_user_logged_in()&&function_exists('is_wc_endpoint_url')){
            if(is_wc_endpoint_url('orders'))$classes[]='aerion-account-orders-page';
            if(is_wc_endpoint_url('edit-address')){
                $classes[]=(string)get_query_var('edit-address')===''?'aerion-account-addresses-page':'aerion-account-address-form-page';
            }
            if(is_wc_endpoint_url('edit-account'))$classes[]='aerion-account-details-page';
        }
        return$classes;
    }

    public static function account_page_title(string $title,int $postId=0): string
    {
        if($postId!==(int)wc_get_page_id('myaccount')||!str_contains((string)($_SERVER['REQUEST_URI']??''),'/minha-conta'))return$title;
        if(is_user_logged_in())return'Minha conta';
        return self::is_registration_screen()?'Criar conta':'Entrar';
    }

    public static function account_menu_items(array $items): array
    {
        unset($items['downloads']);
        $labels=['dashboard'=>'Visão geral','orders'=>'Pedidos','edit-address'=>'Endereço de entrega','edit-account'=>'Dados da conta','customer-logout'=>'Sair'];
        $ordered=[];
        foreach(['dashboard','orders','edit-address','edit-account','customer-logout']as$key)if(isset($items[$key]))$ordered[$key]=$labels[$key];
        foreach($items as$key=>$label)if(!isset($ordered[$key]))$ordered[$key]=$labels[$key]??$label;
        return$ordered;
    }

    public static function account_menu_item_classes(array $classes,string $endpoint): array
    {
        if(!function_exists('is_wc_endpoint_url')||!is_wc_endpoint_url('edit-address'))return$classes;
        $addressType=sanitize_key((string)get_query_var('edit-address'));
        if(!in_array($addressType,['billing','cobranca'],true))return$classes;
        $classes=array_values(array_diff($classes,['is-active']));
        if($endpoint==='edit-account')$classes[]='is-active';
        return array_values(array_unique($classes));
    }

    public static function account_intro(): void
    {
        if(is_user_logged_in())return;
        if(isset($_GET['conta_excluida'])&&sanitize_key(wp_unslash((string)$_GET['conta_excluida']))==='1')echo'<div class="woocommerce-message" role="status">Sua conta foi excluída e seus dados pessoais foram removidos ou anonimizados.</div>';
        if(self::is_registration_screen()){
            echo'<header class="aerion-account-intro"><span>Novo cadastro</span><p>Crie sua conta para acompanhar pedidos, salvar seus dados e agilizar as próximas compras.</p></header>';
            return;
        }
        echo'<header class="aerion-account-intro"><span>Área do cliente</span><p>Acesse seus pedidos, endereços e dados de compra com segurança.</p></header>';
    }

    public static function account_switch(): void
    {
        if(self::is_registration_screen()){
            echo'<aside class="aerion-account-switch"><span>Já possui cadastro?</span><a href="'.esc_url(wc_get_page_permalink('myaccount')).'">Entrar na minha conta</a></aside>';
            return;
        }
        echo'<aside class="aerion-account-switch"><div><strong>Ainda não tem cadastro?</strong><span>Crie sua conta para acompanhar pedidos e agilizar próximas compras.</span></div><a class="button" href="'.esc_url(wc_get_account_endpoint_url('cadastro')).'">Cadastre-se</a></aside>';
    }

    public static function registered_account_message(): void
    {
        echo'<p>Sua conta já está ativa. Use o menu para consultar seus pedidos e dados.</p>';
    }

    public static function dashboard_overview(): void
    {
        $customer=wp_get_current_user();
        $isCompany=get_user_meta($customer->ID,'_aerion_customer_type',true)==='pj';
        $snapshot=json_decode((string)get_user_meta($customer->ID,'_aerion_cnpj_snapshot',true),true);
        $snapshot=is_array($snapshot)?$snapshot:[];
        $legalName=trim((string)($snapshot['razao_social']??get_user_meta($customer->ID,'_aerion_company_name',true)));
        $tradeName=trim((string)($snapshot['nome_fantasia']??''));
        $companyName=$tradeName!==''?$tradeName:trim((string)(get_user_meta($customer->ID,'billing_company',true)?:$legalName));
        $cnpj=trim((string)($snapshot['cnpj']??get_user_meta($customer->ID,'_aerion_document',true)));
        $firstName=trim((string)get_user_meta($customer->ID,'first_name',true));
        $name=$firstName!==''?$firstName:$customer->display_name;
        $orderCount=function_exists('wc_get_customer_order_count')?wc_get_customer_order_count($customer->ID):0;
        $orders=wc_get_orders(['customer'=>$customer->ID,'limit'=>3,'orderby'=>'date','order'=>'DESC']);
        echo'<section class="aerion-account-dashboard">';
        if($isCompany){
            echo'<header class="aerion-account-dashboard__company"><span>Conta empresarial</span><h2>'.esc_html($companyName!==''?$companyName:($legalName!==''?$legalName:'Minha empresa')).'</h2>';
            echo'<div class="aerion-account-dashboard__company-meta">';
            if($legalName!==''&&strcasecmp($legalName,$companyName)!==0)echo'<span><b>Razão social</b>'.esc_html($legalName).'</span>';
            if($cnpj!=='')echo'<span><b>CNPJ</b>'.esc_html(Aerion_CNPJ_Service::format($cnpj)).'</span>';
            echo'<span><b>Responsável</b>'.esc_html($customer->display_name).'</span>';
            echo'</div><p>Acompanhe as compras da empresa e mantenha os dados cadastrais e fiscais atualizados.</p></header>';
        }else{
            echo'<header><span>Visão geral</span><h2>Olá, '.esc_html($name).'</h2><p>Acompanhe suas compras e mantenha seus dados atualizados.</p></header>';
        }
        echo'<nav class="aerion-account-dashboard__shortcuts" aria-label="Atalhos da conta">';
        echo'<a href="'.esc_url(wc_get_account_endpoint_url('orders')).'"><span>Histórico</span><strong>'.esc_html((string)$orderCount).' '.($orderCount===1?'pedido':'pedidos').'</strong><small>Ver meus pedidos</small></a>';
        echo'<a href="'.esc_url(wc_get_account_endpoint_url('edit-address')).'"><span>Entrega</span><strong>Endereço de entrega</strong><small>Cadastrar ou editar</small></a>';
        if($isCompany){
            echo'<a href="'.esc_url(wc_get_account_endpoint_url('edit-account')).'"><span>Empresa</span><strong>Dados da empresa</strong><small>Cadastro, faturamento e contato</small></a>';
        }else{
            echo'<a href="'.esc_url(wc_get_account_endpoint_url('edit-account')).'"><span>Preferências</span><strong>Dados da conta</strong><small>Editar meus dados</small></a>';
        }
        echo'</nav>';
        echo'<section class="aerion-account-dashboard__orders"><div class="aerion-account-dashboard__section-heading"><div><span>Histórico</span><h3>Pedidos recentes</h3></div><a href="'.esc_url(wc_get_account_endpoint_url('orders')).'">Ver todos</a></div>';
        if(!$orders){
            echo'<div class="aerion-account-dashboard__empty"><p>Você ainda não fez nenhum pedido.</p><a class="button" href="'.esc_url(home_url('/loja/')).'">Ir para a loja</a></div>';
        }else{
            echo'<div class="aerion-account-dashboard__order-list">';
            foreach($orders as$order){
                if(!$order instanceof WC_Order)continue;
                echo'<a href="'.esc_url($order->get_view_order_url()).'"><span><b>Pedido #'.esc_html((string)$order->get_order_number()).'</b><small>'.esc_html(wc_format_datetime($order->get_date_created(),'d/m/Y')).'</small></span><span><b>'.esc_html(wc_get_order_status_name($order->get_status())).'</b><small>'.wp_kses_post($order->get_formatted_order_total()).'</small></span><em>Ver pedido</em></a>';
            }
            echo'</div>';
        }
        echo'</section></section>';
    }

    public static function address_actions(): void
    {
        if((string)get_query_var('edit-address')!=='')return;
        $account=wc_get_page_permalink('myaccount');
        $shipping=wc_get_endpoint_url('edit-address','shipping',$account);
        $userId=get_current_user_id();
        $hasAddress=trim((string)get_user_meta($userId,'shipping_address_1',true))!=='';
        $hasBilling=trim((string)get_user_meta($userId,'billing_address_1',true))!=='';
        $matchesBilling=get_user_meta($userId,'_aerion_shipping_matches_billing',true)==='yes';
        $description=$matchesBilling&&$hasAddress
            ?'Seu endereço de entrega acompanha automaticamente o endereço de cobrança.'
            :($hasAddress?'Confira o local de entrega salvo para os próximos pedidos.':'Cadastre o local onde seus pedidos deverão ser recebidos.');
        echo'<section class="aerion-address-intro"><div><span>Dados de entrega</span><h2>Endereço de entrega</h2><p>'.esc_html($description).'</p></div><div class="aerion-address-intro__actions">';
        if($hasBilling){
            echo'<form method="post" class="aerion-address-intro__sync">';
            wp_nonce_field('aerion_use_billing_for_shipping','aerion_use_billing_nonce');
            echo'<input type="hidden" name="aerion_use_billing_for_shipping" value="1"><button class="button'.($matchesBilling?' button--secondary':'').'" type="submit">'.esc_html($matchesBilling?'Atualizar com a cobrança':'Usar endereço de cobrança').'</button></form>';
        }
        $manualAction=$hasBilling?($hasAddress?'Usar outro endereço':'Cadastrar outro endereço'):($hasAddress?'Editar endereço':'Cadastrar endereço');
        echo'<a class="button'.($hasBilling&&!$matchesBilling?' button--secondary':'').'" href="'.esc_url($shipping).'">'.esc_html($manualAction).'</a></div></section>';
    }

    public static function maybe_use_billing_for_shipping(): void
    {
        if(($_SERVER['REQUEST_METHOD']??'GET')!=='POST'||empty($_POST['aerion_use_billing_for_shipping']))return;
        if(!is_user_logged_in()){
            wp_safe_redirect(wc_get_page_permalink('myaccount'));
            exit;
        }
        $nonce=sanitize_text_field(wp_unslash((string)($_POST['aerion_use_billing_nonce']??'')));
        if(!$nonce||!wp_verify_nonce($nonce,'aerion_use_billing_for_shipping'))wp_die('Não foi possível validar a solicitação. Atualize a página e tente novamente.','Solicitação inválida',['response'=>403]);
        $userId=get_current_user_id();
        if(trim((string)get_user_meta($userId,'billing_address_1',true))===''){
            wc_add_notice('Cadastre primeiro o endereço de cobrança em Dados da conta.','error');
        }else{
            update_user_meta($userId,'_aerion_shipping_matches_billing','yes');
            self::sync_shipping_from_billing($userId);
            wc_add_notice('O endereço de cobrança também será usado para entrega.','success');
        }
        wp_safe_redirect(wc_get_account_endpoint_url('edit-address'));
        exit;
    }

    public static function customer_address_saved(int $userId,string $addressType): void
    {
        $addressType=sanitize_key($addressType);
        if(in_array($addressType,['shipping','entrega'],true)){
            update_user_meta($userId,'_aerion_shipping_matches_billing','no');
            return;
        }
        if(in_array($addressType,['billing','cobranca'],true)&&get_user_meta($userId,'_aerion_shipping_matches_billing',true)==='yes'){
            self::sync_shipping_from_billing($userId);
        }
    }

    private static function sync_shipping_from_billing(int $userId): void
    {
        $fields=['first_name','last_name','company','country','address_1','number','address_2','neighborhood','city','state','postcode','phone'];
        foreach($fields as$field){
            update_user_meta($userId,'shipping_'.$field,(string)get_user_meta($userId,'billing_'.$field,true));
        }
    }

    public static function account_orders_intro(bool $hasOrders): void
    {
        echo'<header class="aerion-account-section-header"><span>Histórico de compras</span><h2>Meus pedidos</h2><p>'.esc_html($hasOrders?'Acompanhe o andamento e consulte os detalhes das suas compras.':'Quando você realizar uma compra, o pedido aparecerá aqui com todas as atualizações.').'</p></header>';
    }

    public static function billing_details_panel(): void
    {
        $billing=wc_get_endpoint_url('edit-address','billing',wc_get_page_permalink('myaccount'));
        echo'<section class="aerion-account-billing"><div><span>Dados fiscais e de cobrança</span><h2>Dados de cobrança</h2><p>Revise o endereço, CPF ou CNPJ usados na emissão e no pagamento dos pedidos.</p></div><a class="button button--secondary" href="'.esc_url($billing).'">Revisar dados de cobrança</a></section>';
    }

    public static function email_subject(string $subject,mixed $object=null): string
    {
        $id=str_replace('woocommerce_email_subject_','',current_filter());
        $number=$object instanceof WC_Order?' #'.$object->get_order_number():'';
        $subjects=[
            'new_order'=>'[Aerion] Novo pedido'.$number,
            'cancelled_order'=>'[Aerion] Pedido cancelado'.$number,
            'customer_cancelled_order'=>'[Aerion] Pedido cancelado'.$number,
            'failed_order'=>'[Aerion] Falha no pedido'.$number,
            'customer_failed_order'=>'[Aerion] Falha no pedido'.$number,
            'customer_on_hold_order'=>'[Aerion] Pedido aguardando confirmação'.$number,
            'customer_processing_order'=>'[Aerion] Pedido recebido'.$number,
            'customer_completed_order'=>'[Aerion] Pedido concluído'.$number,
            'customer_refunded_order'=>'[Aerion] Reembolso do pedido'.$number,
            'customer_invoice'=>'[Aerion] Detalhes do pedido'.$number,
            'customer_note'=>'[Aerion] Atualização do pedido'.$number,
            'customer_reset_password'=>'[Aerion] Redefinição de senha',
            'customer_new_account'=>'[Aerion] Sua conta foi criada',
            'customer_pos_completed_order'=>'[Aerion] Compra realizada na loja'.$number,
            'customer_pos_refunded_order'=>'[Aerion] Reembolso da compra'.$number,
            'customer_verify_email'=>'[Aerion] Confirme seu endereço de e-mail',
        ];
        return$subjects[$id]??$subject;
    }

    public static function email_heading(string $heading,mixed $object=null): string
    {
        $id=str_replace('woocommerce_email_heading_','',current_filter());
        $headings=[
            'new_order'=>'Novo pedido recebido',
            'cancelled_order'=>'Pedido cancelado',
            'customer_cancelled_order'=>'Seu pedido foi cancelado',
            'failed_order'=>'Falha no pagamento do pedido',
            'customer_failed_order'=>'Não foi possível concluir seu pedido',
            'customer_on_hold_order'=>'Seu pedido está aguardando confirmação',
            'customer_processing_order'=>'Recebemos seu pedido',
            'customer_completed_order'=>'Seu pedido foi concluído',
            'customer_refunded_order'=>'Seu pedido foi reembolsado',
            'customer_invoice'=>'Detalhes do seu pedido',
            'customer_note'=>'Há uma atualização no seu pedido',
            'customer_reset_password'=>'Redefina sua senha',
            'customer_new_account'=>'Bem-vindo à Aerion',
            'customer_pos_completed_order'=>'Obrigado por sua compra na loja',
            'customer_pos_refunded_order'=>'Sua compra na loja foi reembolsada',
            'customer_verify_email'=>'Confirme seu endereço de e-mail',
        ];
        return$headings[$id]??$heading;
    }

    public static function begin_email_translation(string $heading,mixed $email=null): void
    {
        self::$emailContext=true;
    }

    public static function end_email_translation(mixed $email=null): void
    {
        self::$emailContext=false;
    }

    /**
     * Selo de sucesso no topo da pagina de pedido recebido.
     *
     * A pagina hoje abre com "Pedido recebido" em texto e nada mais — o mesmo
     * peso visual de qualquer outra pagina do site, para o momento em que o
     * cliente acabou de gastar dezenas de milhares de reais e quer uma
     * confirmacao inequivoca de que deu certo.
     *
     * A arte e a mesma do e-mail de confirmacao, de proposito: e o mesmo evento,
     * e o cliente vai ver as duas coisas com minutos de diferenca.
     *
     * `alt` vazio porque a frase ao lado ja diz o que a imagem diz — leitor de
     * tela anunciando "pedido confirmado" duas vezes e ruido, nao acessibilidade.
     */
    /**
     * Aceite dos termos como informacao, nao como caixa a marcar.
     *
     * O checkbox era uma fricção a mais no ultimo passo do checkout, que e onde
     * pedido se perde: quem esquece de marcar leva um erro depois de ja ter
     * clicado em finalizar. Concordancia por ato — clicar em "Finalizar pedido"
     * — e a pratica de praticamente todo grande varejo, e continua sendo
     * consentimento informado desde que o aviso esteja visivel ANTES do botao,
     * que e exatamente onde este bloco entra.
     *
     * Sem o checkbox o WooCommerce tambem para de renderizar o campo oculto
     * `terms-field`, e a validacao em `WC_Checkout::validate_checkout()` so
     * dispara quando ele chega no POST. Ou seja: nao fica regra orfa recusando
     * pedido por um campo que a pagina nao desenha mais.
     */
    /**
     * Checkout em duas etapas: entrega e frete primeiro, pagamento sozinho depois.
     *
     * Duas coisas se resolvem de uma vez. A primeira e de espaco: a coluna do
     * resumo tem 390px, e nela nao cabem as bandeiras, o iframe do Mercado Pago e
     * os campos de numero, validade e CVV — o resultado era um quadro cinza vazio
     * esperando um iframe sem largura para desenhar.
     *
     * A segunda e de ordem. O frete depende do CEP: com o pagamento junto, a
     * pessoa escolhe como pagar olhando um total que ainda vai mudar. Separando as
     * etapas, o endereco fecha o valor e so entao o pagamento aparece — com o
     * total ja definitivo e nada mais competindo por atencao na tela.
     *
     * A troca de etapa e so uma classe no formulario, sem recarregar e sem mexer
     * no DOM. Isso importa: `#customer_details` continua no formulario e escondido
     * por CSS, entao os campos seguem sendo enviados no POST. Uma versao que
     * removesse ou remontasse o bloco perderia os dados no envio.
     *
     * `#payment` carrega a classe `woocommerce-checkout-payment`, que e o alvo do
     * fragmento AJAX do WooCommerce. Por isso mover o bloco no DOM nao quebra a
     * atualizacao de totais — o alvo e a classe, nao a posicao.
     */
    public static function mover_pagamento(): void
    {
        if (! function_exists('is_checkout') || ! is_checkout() || is_order_received_page()) return;
        remove_action('woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10);

        remove_action('woocommerce_checkout_order_review', 'woocommerce_checkout_payment', 20);
        add_action('woocommerce_checkout_before_customer_details', [self::class, 'passos'], 5);
        add_action('woocommerce_checkout_before_order_review_heading', [self::class, 'botao_continuar'], 6);
        add_action('woocommerce_checkout_after_customer_details', [self::class, 'titulo_pagamento'], 19);
        add_action('woocommerce_checkout_after_customer_details', 'woocommerce_checkout_payment', 20);
        add_action('woocommerce_checkout_after_customer_details', [self::class, 'botao_voltar'], 25);
    }

    /**
     * Titulo da secao de pagamento.
     *
     * No lugar antigo o bloco herdava o cabecalho "Resumo do pedido"; sozinho na
     * coluna principal ele ficaria sem nome nenhum, e uma lista de radios sem
     * titulo e um formulario sem pergunta.
     *
     * O pictograma e decorativo — `alt` vazio e `aria-hidden` — porque a palavra
     * ao lado ja diz tudo. Se o arquivo nao existir, o titulo sai sozinho: a
     * secao nunca depende de um asset para funcionar.
     */
    /** Onde a pessoa esta, e quanto falta. Dois passos cabem num indicador simples. */
    public static function passos(): void
    {
        echo '<ol class="aerion-checkout-passos" aria-label="Etapas da compra">';
        echo '<li class="is-atual" data-passo="1"><span>1</span>Entrega</li>';
        echo '<li data-passo="2"><span>2</span>Pagamento</li>';
        echo '</ol>';
    }

    /**
     * A acao principal, no topo da coluna do resumo.
     *
     * Fica ACIMA do resumo e nao abaixo do formulario porque o formulario e
     * longo: no rodape dele o botao so aparece depois de rolar a pagina inteira,
     * e ninguem age no que nao ve. Aqui ele e a primeira coisa da coluna direita
     * e acompanha a rolagem — o resumo abaixo continua rolando normalmente.
     *
     * Renderiza dentro do painel (prioridade 6, depois do `order_review_panel_start`
     * que o abre na 5). O container e o mesmo para as duas etapas: na segunda, o
     * JS traz o "Finalizar pedido" para ca.
     *
     * `type="button"`: avancar de etapa nao envia o pedido.
     */
    public static function botao_continuar(): void
    {
        echo '<div class="aerion-acao-topo">';
        echo '<button type="button" class="aerion-passo-avancar" data-aerion-avancar>Continuar para pagamento</button>';
        echo '</div>';
    }

    /** Volta para a entrega sem perder nada: a etapa e uma classe, nao uma pagina. */
    public static function botao_voltar(): void
    {
        echo '<button type="button" class="aerion-passo-voltar" data-aerion-voltar>Voltar para os dados de entrega</button>';
    }

    public static function titulo_pagamento(): void
    {
        $arte = get_theme_file_path('assets/source-images/status/etapa-pagamento.png');
        $img = file_exists($arte)
            ? '<img src="' . esc_url(get_theme_file_uri('assets/source-images/status/etapa-pagamento.png')) . '" alt="" aria-hidden="true" width="38" height="38" />'
            : '';
        echo '<h3 class="aerion-etapa-pagamento">' . $img . '<span>Forma de pagamento</span></h3>';
    }

    public static function aviso_termos(): void
    {
        $termos = wc_get_page_permalink('terms');
        $privacidade = get_privacy_policy_url();
        if (! $termos && ! $privacidade) return;

        $partes = [];
        if ($termos) $partes[] = '<a href="' . esc_url($termos) . '" target="_blank" rel="noopener noreferrer">Termos de Uso</a>';
        if ($privacidade) $partes[] = '<a href="' . esc_url($privacidade) . '" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>';

        echo '<p class="aerion-aviso-termos">Ao finalizar o pedido, você concorda com os '
            . wp_kses_post(implode(' e a ', $partes)) . '.</p>';
    }

    public static function selo_de_sucesso($order_id): void
    {
        $order = wc_get_order($order_id);
        // O selo verde diz "confirmado": so vale para pedido pago. Pix pendente tem o proprio selo, em Aerion_Pix_Experience.
        if (! $order instanceof WC_Order || ! $order->is_paid()) return;

        $arquivo = get_theme_file_path('assets/source-images/status/pedido-confirmado.png');
        if (! file_exists($arquivo)) return;

        echo '<div class="aerion-pedido-selo">';
        echo '<img src="' . esc_url(get_theme_file_uri('assets/source-images/status/pedido-confirmado.png')) . '" alt="" width="64" height="64" />';
        echo '</div>';
    }

    /**
     * "Ja e cliente? Clique aqui para entrar" repete o que as abas da propria
     * introducao ja oferecem ("Entrar na minha conta"). Dois convites para a
     * mesma acao empurram o formulario para baixo e confundem quem so quer pagar.
     */
    public static function remover_aviso_de_login(): void
    {
        remove_action('woocommerce_before_checkout_form','woocommerce_checkout_login_form',10);
    }

    public static function intro(): void
    {
        if(is_user_logged_in()){
            echo'<section class="aerion-checkout-intro aerion-checkout-intro--signed"><div><h1>Finalizar compra</h1><p>Seus dados salvos já estão preenchidos. Confira a entrega, revise o pedido e escolha a forma de pagamento.</p></div></section>';
            return;
        }
        $account=add_query_arg('redirect_to',wc_get_checkout_url(),wc_get_page_permalink('myaccount'));
        echo'<section class="aerion-checkout-intro"><div><h1>Finalizar compra</h1><p>Informe seus dados, confira a entrega e escolha a forma de pagamento.</p></div><div class="aerion-checkout-intro__choices"><span><b>Continuar sem cadastro</b><small>Você poderá criar uma conta depois</small></span><a href="'.esc_url($account).'"><b>Entrar na minha conta</b><small>Usar dados já salvos</small></a></div></section>';
    }

    public static function order_review_panel_start(): void
    {
        echo'<aside class="aerion-checkout-order-panel" aria-label="Resumo do pedido">';
    }

    public static function order_review_panel_end(): void
    {
        echo'</aside>';
    }

    public static function coupon_panel(): void
    {
        if (! function_exists('wc_coupons_enabled') || ! wc_coupons_enabled()) return;

        $count = function_exists('WC') && WC()->cart ? count(WC()->cart->get_applied_coupons()) : 0;
        $status = $count === 1
            ? '1 cupom aplicado ao pedido.'
            : ($count > 1 ? $count . ' cupons aplicados ao pedido.' : 'O desconto aparecerá no resumo do pedido.');
        $iconPath = 'assets/source-images/status/etapa-cupom.png';
        $icon = file_exists(get_theme_file_path($iconPath))
            ? '<img src="' . esc_url(get_theme_file_uri($iconPath)) . '" alt="" width="38" height="38">'
            : '';

        echo '<section class="aerion-checkout-coupon' . ($count > 0 ? ' has-applied-coupon' : '') . '" data-aerion-coupon aria-busy="false">';
        echo '<header class="aerion-checkout-coupon__header">';
        echo '<span class="aerion-checkout-coupon__icon" aria-hidden="true">' . $icon . '</span>';
        echo '<span><strong>Cupom de desconto</strong><small id="aerion-coupon-status" data-aerion-coupon-status>' . esc_html($status) . '</small></span>';
        echo '</header>';
        echo '<div class="aerion-checkout-coupon__controls">';
        echo '<label class="screen-reader-text" for="coupon_code">Código do cupom</label>';
        echo '<input id="coupon_code" type="text" placeholder="Digite o código do cupom" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="aerion-coupon-status" data-aerion-coupon-code>';
        echo '<button class="button aerion-checkout-coupon__apply" type="button" data-aerion-coupon-apply>Aplicar</button>';
        echo '</div>';
        echo '<div class="aerion-checkout-coupon__feedback" aria-live="polite" data-aerion-coupon-feedback></div>';
        echo '</section>';
    }

    public static function store_url(string $url = ''): string
    {
        return home_url('/loja/');
    }

    public static function register_cep_route(): void
    {
        register_rest_route('aerion/v1','/address/cep/(?P<cep>\d{8})',[
            'methods'=>WP_REST_Server::READABLE,
            'callback'=>[self::class,'lookup_cep'],
            'permission_callback'=>'__return_true',
        ]);
    }

    public static function lookup_cep(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        $cep=preg_replace('/\D+/','',(string)$request->get_param('cep'));
        if(strlen($cep)!==8)return new WP_Error('aerion_invalid_cep','Informe um CEP com 8 dígitos.',['status'=>400]);
        $cacheKey='aerion_cep_'.$cep;
        $cached=get_transient($cacheKey);
        if(is_array($cached))return rest_ensure_response($cached);
        $response=wp_remote_get('https://viacep.com.br/ws/'.rawurlencode($cep).'/json/',[
            'headers'=>['Accept'=>'application/json'],
            'timeout'=>6,
            'user-agent'=>'Aerion Store/'.(defined('AERION_COMMERCE_VERSION')?AERION_COMMERCE_VERSION:'1.0'),
        ]);
        if(is_wp_error($response))return new WP_Error('aerion_cep_unavailable','Não foi possível consultar o CEP agora. Preencha o endereço manualmente.',['status'=>503]);
        $data=json_decode((string)wp_remote_retrieve_body($response),true);
        if(wp_remote_retrieve_response_code($response)!==200||!is_array($data))return new WP_Error('aerion_cep_unavailable','Não foi possível consultar o CEP agora. Preencha o endereço manualmente.',['status'=>503]);
        if(!empty($data['erro']))return new WP_Error('aerion_cep_not_found','CEP não encontrado. Confira os números ou preencha o endereço manualmente.',['status'=>404]);
        $address=[
            'postcode'=>sanitize_text_field((string)($data['cep']??$cep)),
            'address_1'=>sanitize_text_field((string)($data['logradouro']??'')),
            'neighborhood'=>sanitize_text_field((string)($data['bairro']??'')),
            'city'=>sanitize_text_field((string)($data['localidade']??'')),
            'state'=>sanitize_text_field((string)($data['uf']??'')),
            'country'=>'BR',
        ];
        set_transient($cacheKey,$address,7*DAY_IN_SECONDS);
        return rest_ensure_response($address);
    }

    public static function fields(array $fields): array
    {
        foreach(['billing','shipping']as$section){
            $postcode=$section.'_postcode';
            if(isset($fields[$section][$postcode])){
                $fields[$section][$postcode]['priority']=45;
                $fields[$section][$postcode]['class']=['form-row-wide'];
            }
        }
        $fields['billing']['billing_person_type']=[
            'type'=>'select',
            'label'=>'Tipo de pessoa',
            'required'=>true,
            'class'=>['form-row-first'],
            'priority'=>25,
            'options'=>['pf'=>'Pessoa física','pj'=>'Pessoa jurídica'],
        ];
        $fields['billing']['billing_document']=[
            'type'=>'text',
            'label'=>'CPF ou CNPJ',
            'required'=>true,
            'class'=>['form-row-last'],
            'priority'=>26,
            'autocomplete'=>'off',
            'custom_attributes'=>['inputmode'=>'text','maxlength'=>'18'],
        ];
        if(isset($fields['billing']['billing_company'])){
            $fields['billing']['billing_company']['label']='Razão social (para pessoa jurídica)';
            $fields['billing']['billing_company']['priority']=27;
        }
        if(isset($fields['order']['order_comments'])){
            $fields['order']['order_comments']['label']='Observações do pedido';
            $fields['order']['order_comments']['placeholder']='Informações importantes sobre a entrega ou o pedido';
        }
        $fields['account']['aerion_marketing_opt_in']=[
            'type'=>'checkbox',
            'label'=>'Quero receber lançamentos, ofertas e conteúdos da Aerion por e-mail. Posso cancelar quando quiser em Dados da conta.',
            'required'=>false,
            'default'=>1,
            'class'=>['form-row-wide','aerion-marketing-consent'],
            'priority'=>80,
        ];
        return$fields;
    }

    public static function default_address_fields(array $fields): array
    {
        if(isset($fields['postcode'])){
            $fields['postcode']['priority']=45;
            $fields['postcode']['class']=['form-row-wide'];
        }
        // Numero e bairro em campos proprios: a NF-e e o cadastro de parceiro do
        // Sankhya exigem cada um separado, e "Rua X, 123" numa linha so obrigava
        // a adivinhar onde terminava a rua. As chaves `number` e `neighborhood`
        // sao as mesmas dos plugins brasileiros, que o Melhor Envio ja le.
        if(isset($fields['address_1'])){
            $fields['address_1']['label']='Rua';
            $fields['address_1']['placeholder']='Rua, avenida, travessa…';
        }
        $fields['number']=[
            'label'=>'Número',
            'required'=>true,
            'class'=>['form-row-first'],
            'priority'=>55,
            'autocomplete'=>'off',
            'custom_attributes'=>['maxlength'=>'10'],
        ];
        $fields['neighborhood']=[
            'label'=>'Bairro',
            'required'=>true,
            'class'=>['form-row-last'],
            'priority'=>57,
        ];
        return$fields;
    }

    public static function address_formats(array $formats): array
    {
        $formats['BR']="{company}\n{name}\n{address_1}, {number}\n{address_2}\n{neighborhood}\n{city} - {state_code}\n{postcode}\n{country}";
        return$formats;
    }

    public static function address_replacements(array $replacements,array $args): array
    {
        $replacements['{number}']=(string)($args['number']??'');
        $replacements['{neighborhood}']=(string)($args['neighborhood']??'');
        return$replacements;
    }

    public static function order_address_parts(array $address,WC_Order $order): array
    {
        $type=current_filter()==='woocommerce_order_formatted_shipping_address'?'shipping':'billing';
        $address['number']=(string)$order->get_meta('_'.$type.'_number');
        $address['neighborhood']=(string)$order->get_meta('_'.$type.'_neighborhood');
        return$address;
    }

    public static function account_address_parts(array $address,int $customerId,string $type): array
    {
        $address['number']=(string)get_user_meta($customerId,$type.'_number',true);
        $address['neighborhood']=(string)get_user_meta($customerId,$type.'_neighborhood',true);
        return$address;
    }

    /** Deixa a equipe corrigir numero e bairro no pedido antes de reprocessar no Sankhya. */
    public static function admin_address_fields(array $fields): array
    {
        $ordered=[];
        foreach($fields as$key=>$field){
            $ordered[$key]=$field;
            if($key==='address_1'){
                $ordered['number']=['label'=>'Número','show'=>false];
                $ordered['neighborhood']=['label'=>'Bairro','show'=>false];
            }
        }
        return$ordered;
    }

    public static function checkout_value(mixed $value,string $input): mixed
    {
        if($value!==null&&$value!=='')return$value;
        $customerId=get_current_user_id();
        if(!$customerId)return$value;
        $aliases=[
            'billing_person_type'=>['billing_person_type','_aerion_customer_type'],
            'billing_document'=>['billing_document','_aerion_document'],
        ];
        if(!isset($aliases[$input]))return$value;
        foreach($aliases[$input]as$key){
            $saved=get_user_meta($customerId,$key,true);
            if($saved!=='')return$saved;
        }
        return$value;
    }

    public static function privacy_text(string $text,string $type='checkout'): string
    {
        $url=get_privacy_policy_url()?:home_url('/politica-privacidade/');
        if($type==='registration'){
            return'Seus dados serão usados para criar e administrar sua conta, conforme nossa <a href="'.esc_url($url).'" class="woocommerce-privacy-policy-link" target="_blank">Política de Privacidade</a>.';
        }
        return'Seus dados pessoais serão usados para processar o pedido, prestar atendimento e cumprir as finalidades descritas em nossa <a href="'.esc_url($url).'" class="woocommerce-privacy-policy-link" target="_blank">Política de Privacidade</a>.';
    }

    public static function terms_text(string $text): string
    {
        $terms=home_url('/termos-uso/');
        $privacy=get_privacy_policy_url()?:home_url('/politica-privacidade/');
        return'Li e concordo com os <a href="'.esc_url($terms).'" class="woocommerce-terms-and-conditions-link" target="_blank">Termos de Uso</a> e a <a href="'.esc_url($privacy).'" class="woocommerce-privacy-policy-link" target="_blank">Política de Privacidade</a>.';
    }

    public static function order_button_text(string $text=''): string
    {
        return'Finalizar pedido';
    }

    public static function payment_unavailable_message(string $message): string
    {
        $country=WC()->customer?trim((string)WC()->customer->get_billing_country()):'';
        if($country==='')return'Preencha os dados de cobrança para consultar as formas de pagamento.';
        return'As formas de pagamento estão temporariamente indisponíveis. Fale com o Atendimento para concluir sua compra.';
    }

    public static function payment_order_button_html(string $html): string
    {
        if(!function_exists('WC')||!WC()->cart||!WC()->cart->needs_payment()||!WC()->payment_gateways())return$html;
        if(WC()->payment_gateways()->get_available_payment_gateways())return$html;
        $country=WC()->customer?trim((string)WC()->customer->get_billing_country()):'';
        $label=$country===''?'Preencha os dados acima':'Pagamento indisponível';
        return'<button type="button" class="button alt aerion-payment-unavailable-button" id="place_order" disabled aria-disabled="true">'.esc_html($label).'</button><p class="aerion-payment-unavailable-help"><a href="'.esc_url(home_url('/contato/')).'">Falar com o Atendimento</a></p>';
    }

    public static function checkout_translation(string $translated,string $original,string $domain): string
    {
        if(self::$emailContext){
            $emailLabels=[
                'Hi %s,'=>'Olá, %s,',
                'Hello %s,'=>'Olá, %s,',
                'Order summary'=>'Resumo do pedido',
                'Product'=>'Produto',
                'Quantity'=>'Quantidade',
                'Price'=>'Preço',
                'Subtotal:'=>'Subtotal:',
                'Discount:'=>'Desconto:',
                'Shipping:'=>'Entrega:',
                'Payment method:'=>'Forma de pagamento:',
                'Total:'=>'Total:',
                'Note:'=>'Observação:',
                'Billing address'=>'Endereço de cobrança',
                'Shipping address'=>'Endereço de entrega',
                'Pay for this order'=>'Pagar este pedido',
                'Click here to reset your password'=>'Redefinir minha senha',
                'Confirm email address'=>'Confirmar endereço de e-mail',
                'Username: %s'=>'Usuário: %s',
                'Thanks for using %s!'=>'Obrigado por comprar na %s!',
                'Thanks for using {site_url}!'=>'Obrigado por comprar na Aerion!',
                'Thanks for reading.'=>'Obrigado pela atenção.',
                'Once you\'ve confirmed that %s is your email address, we\'ll link any past orders to your account.'=>'Assim que você confirmar que %s é seu endereço de e-mail, vincularemos à sua conta todos os pedidos anteriores.',
                'If you didn\'t request this email, there\'s nothing to worry about, and you can safely ignore it.'=>'Se você não solicitou este e-mail, pode ignorá-lo com segurança.',
            ];
            if(isset($emailLabels[$original]))return$emailLabels[$original];
        }
        // Erros do pacote pt_BR oficial do WooCommerce, que valem em toda a loja.
        $sitewide=[
            'You must be %1$slogged in%2$s to post a review.'=>'Você precisa %1$sentrar na sua conta%2$s para enviar uma avaliação.',
        ];
        if(isset($sitewide[$original]))return$sitewide[$original];
        if(is_admin()&&!self::$emailContext)return$translated;
        $requestPath=(string)(wp_parse_url((string)($_SERVER['REQUEST_URI']??''),PHP_URL_PATH)??'');
        $checkout=str_contains($requestPath,'/finalizar-compra')||isset($_REQUEST['wc-ajax']);
        $account=str_contains($requestPath,'/minha-conta');
        if(!$checkout&&!$account)return$translated;
        $labels=[
            'Billing details'=>'Dados de entrega',
            'Additional information'=>'Observações',
            'Your order'=>'Resumo do pedido',
            'Ship to a different address?'=>'Entregar em outro endereço?',
            'Create an account?'=>'Criar uma conta?',
            'Place order'=>'Finalizar pedido',
            'Privacy policy'=>'Política de Privacidade',
            'Terms and conditions'=>'Termos de Uso',
            'Credit card'=>'Cartão de crédito',
            'Debit card'=>'Cartão de débito',
            'Save payment information to my account for future purchases.'=>'Salvar os dados de pagamento em minha conta para compras futuras.',
            'Register'=>'Criar conta',
            'Login'=>'Entrar',
            'Username or email address'=>'E-mail',
            'Lost your password?'=>'Esqueceu sua senha?',
            'Dashboard'=>'Visão geral',
            'Orders'=>'Pedidos',
            'Downloads'=>'Arquivos digitais',
            'Addresses'=>'Endereços',
            'Account details'=>'Dados da conta',
            'Logout'=>'Sair',
            'Billing address'=>'Endereço de cobrança',
            'Shipping address'=>'Endereço de entrega',
            'Edit'=>'Editar',
            'Save changes'=>'Salvar alterações',
            'Save address'=>'Salvar endereço',
            'Password change'=>'Alterar senha',
            'Current password (leave blank to leave unchanged)'=>'Senha atual (deixe em branco para não alterar)',
            'New password (leave blank to leave unchanged)'=>'Nova senha (deixe em branco para não alterar)',
            'Confirm new password'=>'Confirmar nova senha',
            'No order has been made yet.'=>'Você ainda não fez nenhum pedido.',
            'Browse products'=>'Ver produtos',
            'Confirm email address'=>'Confirmar endereço de e-mail',
            'Confirm your email address to check for past orders and link them to your account.'=>'Confirme seu endereço de e-mail para localizar pedidos anteriores e vinculá-los à sua conta.',
            'View'=>'Ver pedido',
            'Add'=>'Cadastrar',
            'Add address'=>'Cadastrar endereço',
            'The following addresses will be used on the checkout page by default.'=>'Estes endereços serão usados por padrão na finalização da compra.',
        ];
        return$labels[$original]??$translated;
    }

    public static function registration_identity_fields(): void
    {
        $first=isset($_POST['first_name'])?sanitize_text_field(wp_unslash((string)$_POST['first_name'])):'';
        $last=isset($_POST['last_name'])?sanitize_text_field(wp_unslash((string)$_POST['last_name'])):'';
        echo'<header class="aerion-register-step aerion-register-step--details"><span>Passo 2 de 2</span><h3>Complete seus dados</h3><p>Agora informe os dados de acesso à conta.</p><button type="button" data-aerion-change-customer-type>Alterar tipo de cliente</button></header>';
        echo'<div class="aerion-register-name-fields">';
        woocommerce_form_field('first_name',[
            'type'=>'text','required'=>true,'label'=>'Nome','autocomplete'=>'given-name',
            'class'=>['form-row-first'],
        ],$first);
        woocommerce_form_field('last_name',[
            'type'=>'text','required'=>true,'label'=>'Sobrenome','autocomplete'=>'family-name',
            'class'=>['form-row-last'],
        ],$last);
        echo'</div>';
    }

    public static function registration_password_confirmation(): void
    {
        woocommerce_form_field('password_confirm',[
            'type'=>'password','required'=>true,'label'=>'Confirmar senha',
            'autocomplete'=>'new-password','class'=>['form-row-wide'],
        ]);
        $submitted=($_SERVER['REQUEST_METHOD']??'GET')==='POST';
        $checked=!$submitted||isset($_POST['aerion_marketing_opt_in']);
        /*
         * A caixa vem MARCADA, e por isso o texto nao pode dizer "quero receber".
         *
         * Caixa pre-marcada nao produz consentimento valido sob a LGPD, que exige
         * manifestacao ativa. O que sustenta o envio aqui e o legitimo interesse
         * (art. 7, IX): comunicar novidades a quem se cadastrou numa loja e uso
         * esperado do dado. Nesse regime o modelo correto e exatamente este —
         * vem ligado e sai facil.
         *
         * A redacao acompanha o regime. "Quero receber" numa caixa que ja veio
         * marcada afirma uma vontade que a pessoa nao manifestou; "voce recebera"
         * informa o que vai acontecer e mostra como sair. A diferenca e o que
         * separa uma pratica defensavel de uma questionavel.
         */
        echo'<p class="form-row form-row-wide aerion-marketing-consent"><label><input type="checkbox" name="aerion_marketing_opt_in" value="yes" '.checked($checked,true,false).'> Você receberá lançamentos, ofertas e conteúdos da Aerion por e-mail. Desmarque para não receber — dá para mudar quando quiser, em Dados da conta ou pelo link no rodapé de cada e-mail. E-mails sobre pedidos e segurança não dependem desta opção. Consulte os <a href="'.esc_url(home_url('/termos-uso/')).'" target="_blank">Termos de Uso</a> e a <a href="'.esc_url(get_privacy_policy_url()?:home_url('/politica-privacidade/')).'" target="_blank">Política de Privacidade</a>.</label></p>';
    }

    public static function validate_registration(WP_Error $errors,string $username,string $email): WP_Error
    {
        // Nome e confirmacao de senha so existem no cadastro de Minha conta; no
        // checkout o nome vem da cobranca e a senha tem campo proprio.
        if(!Aerion_B2B::is_account_registration_form())return$errors;
        $first=sanitize_text_field(wp_unslash((string)($_POST['first_name']??'')));
        $last=sanitize_text_field(wp_unslash((string)($_POST['last_name']??'')));
        $password=(string)($_POST['password']??'');
        $confirmation=(string)($_POST['password_confirm']??'');
        if($first==='')$errors->add('first_name_required','Informe seu nome.');
        if($last==='')$errors->add('last_name_required','Informe seu sobrenome.');
        if($confirmation==='')$errors->add('password_confirm_required','Confirme sua senha.');
        elseif($password!==$confirmation)$errors->add('password_mismatch','As senhas não coincidem.');
        return$errors;
    }

    public static function save_registration(int $customerId,array $customerData=[],bool $passwordGenerated=false): void
    {
        $first=sanitize_text_field(wp_unslash((string)($_POST['first_name']??'')));
        $last=sanitize_text_field(wp_unslash((string)($_POST['last_name']??'')));
        if($first!==''){
            update_user_meta($customerId,'first_name',$first);
            update_user_meta($customerId,'billing_first_name',$first);
        }
        if($last!==''){
            update_user_meta($customerId,'last_name',$last);
            update_user_meta($customerId,'billing_last_name',$last);
        }
        $email=sanitize_email((string)($customerData['user_email']??''));
        if($email===''){
            $user=get_userdata($customerId);
            $email=$user?sanitize_email((string)$user->user_email):'';
        }
        if($email!=='')update_user_meta($customerId,'billing_email',$email);
        $display=trim($first.' '.$last);
        if($display!=='')wp_update_user(['ID'=>$customerId,'display_name'=>$display]);
        self::store_marketing_preference($customerId,isset($_POST['aerion_marketing_opt_in']),'registration');
    }

    public static function marketing_preference_field(): void
    {
        $userId=get_current_user_id();
        if(!$userId)return;
        $enabled=get_user_meta($userId,'_aerion_marketing_opt_in',true)==='yes';
        echo'<section class="aerion-account-preferences"><div><span>Comunicações</span><h2>E-mails da Aerion</h2><p>Escolha se deseja receber lançamentos, ofertas e conteúdos. E-mails de pedidos e segurança continuam ativos.</p></div><label><input type="checkbox" name="aerion_marketing_opt_in" value="yes" '.checked($enabled,true,false).'> <span><strong>Receber e-mails promocionais</strong><small>Você pode desmarcar esta opção a qualquer momento.</small></span></label></section>';
    }

    public static function save_marketing_preference(int $userId): void
    {
        if($userId<=0)return;
        self::store_marketing_preference($userId,isset($_POST['aerion_marketing_opt_in']),'account');
    }

    private static function store_marketing_preference(int $userId,bool $enabled,string $source): void
    {
        update_user_meta($userId,'_aerion_marketing_opt_in',$enabled?'yes':'no');
        update_user_meta($userId,'_aerion_marketing_consent_updated_at',current_time('mysql',true));
        update_user_meta($userId,'_aerion_marketing_consent_source',sanitize_key($source));
        update_user_meta($userId,'_aerion_marketing_consent_version','2026-08-24');
    }

    public static function account_deletion_panel(): void
    {
        $user=wp_get_current_user();
        if(!$user->exists()||user_can($user,'manage_options')||user_can($user,'delete_users'))return;
        echo'<section class="aerion-account-danger"><header><span>Zona de risco</span><h2>Excluir minha conta e meus dados</h2><p>A Aerion anonimizará seus dados pessoais em pedidos e excluirá sua conta. Registros estritamente exigidos por lei poderão ser conservados sem uso promocional.</p></header><form method="post" data-aerion-delete-account-form>';
        wp_nonce_field('aerion_delete_account','aerion_delete_account_nonce');
        echo'<input type="hidden" name="aerion_delete_account" value="1"><label class="aerion-account-danger__check"><input type="checkbox" name="aerion_delete_confirm" value="yes" data-aerion-delete-confirm> <span>Entendo que perderei o acesso, endereços e histórico da conta.</span></label><label for="aerion-delete-phrase">Para confirmar novamente, digite <strong>EXCLUIR</strong></label><input id="aerion-delete-phrase" name="aerion_delete_phrase" type="text" autocomplete="off" data-aerion-delete-phrase required><button class="button aerion-account-danger__button" type="submit" data-aerion-delete-submit disabled>Excluir conta definitivamente</button></form></section>';
    }

    public static function maybe_delete_account(): void
    {
        if(($_SERVER['REQUEST_METHOD']??'GET')!=='POST'||empty($_POST['aerion_delete_account']))return;
        if(!is_user_logged_in()){
            wp_safe_redirect(wc_get_page_permalink('myaccount'));
            exit;
        }
        $nonce=sanitize_text_field(wp_unslash((string)($_POST['aerion_delete_account_nonce']??'')));
        if(!$nonce||!wp_verify_nonce($nonce,'aerion_delete_account'))wp_die('Não foi possível validar a solicitação. Atualize a página e tente novamente.','Solicitação inválida',['response'=>403]);
        $user=wp_get_current_user();
        if(!$user->exists()||user_can($user,'manage_options')||user_can($user,'delete_users')){
            wc_add_notice('Esta conta administrativa não pode ser excluída por esta tela.','error');
            wp_safe_redirect(wc_get_account_endpoint_url('edit-account'));
            exit;
        }
        $confirmed=isset($_POST['aerion_delete_confirm'])&&sanitize_key((string)$_POST['aerion_delete_confirm'])==='yes';
        $phrase=mb_strtoupper(trim(sanitize_text_field(wp_unslash((string)($_POST['aerion_delete_phrase']??'')))),'UTF-8');
        if(!$confirmed||$phrase!=='EXCLUIR'){
            wc_add_notice('Marque a confirmação e digite EXCLUIR para remover a conta.','error');
            wp_safe_redirect(wc_get_account_endpoint_url('edit-account'));
            exit;
        }
        $userId=(int)$user->ID;
        $email=sanitize_email((string)$user->user_email);
        $error=self::erase_customer_personal_data($userId,$email);
        if($error){
            wc_add_notice('Não foi possível concluir a exclusão agora. Tente novamente ou fale com o Atendimento.','error');
            wp_safe_redirect(wc_get_account_endpoint_url('edit-account'));
            exit;
        }
        require_once ABSPATH.'wp-admin/includes/user.php';
        if(get_userdata($userId)&&!wp_delete_user($userId)){
            wc_add_notice('Não foi possível remover a conta. Fale com o Atendimento.','error');
            wp_safe_redirect(wc_get_account_endpoint_url('edit-account'));
            exit;
        }
        wp_clear_auth_cookie();
        wp_set_current_user(0);
        wp_safe_redirect(add_query_arg('conta_excluida','1',wc_get_page_permalink('myaccount')));
        exit;
    }

    private static function erase_customer_personal_data(int $userId,string $email): ?WP_Error
    {
        if(function_exists('wc_get_orders')){
            $orders=wc_get_orders(['customer_id'=>$userId,'limit'=>-1,'return'=>'objects']);
            foreach($orders as$order)if($order instanceof WC_Order)do_action('woocommerce_remove_order_personal_data',$order);
        }
        if($email==='')return new WP_Error('aerion_missing_erasure_email','A conta não possui um e-mail válido para anonimização.');
        $erasers=apply_filters('wp_privacy_personal_data_erasers',[]);
        foreach($erasers as$eraser){
            $callback=is_array($eraser)?($eraser['callback']??null):null;
            if(!is_callable($callback))continue;
            $finished=false;
            for($page=1;$page<=50;$page++){
                $response=call_user_func($callback,$email,$page);
                if(is_wp_error($response))return$response;
                if(!is_array($response))return new WP_Error('aerion_invalid_eraser_response','Um apagador de dados retornou uma resposta inválida.');
                if(!empty($response['done'])){
                    $finished=true;
                    break;
                }
            }
            if(!$finished)return new WP_Error('aerion_eraser_limit','A anonimização excedeu o limite seguro de páginas.');
        }
        return null;
    }

    public static function validate(array $data,WP_Error $errors): void
    {
        $type=sanitize_key((string)($data['billing_person_type']??'pf'));
        $document=$type==='pj'
            ?Aerion_CNPJ_Service::normalize((string)($data['billing_document']??''))
            :Aerion_CNPJ_Service::digits((string)($data['billing_document']??''));
        if($type==='pj'){
            if(!Aerion_CNPJ_Service::is_valid($document))$errors->add('billing_document','Informe um CNPJ válido.');
            elseif(($inactive=Aerion_CNPJ_Service::inactive_error($document))!==null)$errors->add('billing_document',$inactive);
        }elseif(!self::valid_cpf($document)){
            $errors->add('billing_document','Informe um CPF válido.');
        }
        // Visitante criando conta no checkout segue a mesma regra do cadastro:
        // uma conta por CPF/CNPJ. Comprar sem conta continua livre.
        if(!$errors->get_error_message('billing_document')&&!is_user_logged_in()&&!empty($data['createaccount'])&&Aerion_B2B::document_owner($document)>0){
            $errors->add('billing_document',Aerion_B2B::duplicate_document_message($type));
        }
    }

    public static function save(WC_Order $order,array $data): void
    {
        $type=sanitize_key((string)($data['billing_person_type']??'pf'));
        $document=$type==='pj'
            ?Aerion_CNPJ_Service::normalize((string)($data['billing_document']??''))
            :Aerion_CNPJ_Service::digits((string)($data['billing_document']??''));
        $order->update_meta_data('_billing_person_type',$type);
        $order->update_meta_data('_billing_document',$document);
        $order->update_meta_data($type==='pj'?'_billing_cnpj':'_billing_cpf',$document);
        $customerId=$order->get_customer_id();
        if($customerId){
            update_user_meta($customerId,'billing_person_type',$type);
            update_user_meta($customerId,'billing_document',$document);
            // Cobranca no documento de outra conta (ex.: comprar para a empresa
            // de um cliente ja cadastrado) nao transfere a posse do documento.
            if(get_user_meta($customerId,'_aerion_customer_type',true)===''&&Aerion_B2B::document_owner($document,$customerId)===0){
                update_user_meta($customerId,'_aerion_customer_type',$type);
                update_user_meta($customerId,'_aerion_document',$document);
            }
        }
    }

    public static function admin_document(WC_Order $order): void
    {
        $document=(string)$order->get_meta('_billing_document');
        if($document!=='')echo'<p><strong>CPF/CNPJ:</strong> '.esc_html($document).'</p>';
    }

    private static function valid_cpf(string $digits): bool
    {
        if(strlen($digits)!==11||preg_match('/^(\d)\1{10}$/',$digits))return false;
        for($position=9;$position<=10;$position++){
            $sum=0;
            for($i=0;$i<$position;$i++)$sum+=(int)$digits[$i]*(($position+1)-$i);
            $check=(10*($sum%11))%11;
            if($check===10)$check=0;
            if((int)$digits[$position]!==$check)return false;
        }
        return true;
    }

    /**
     * O par de precos na linha do produto, igual ao card da vitrine.
     *
     * O bloco de totais ja mostrava o abatimento, mas so la embaixo: em cima, na
     * linha do item, o cliente continuava lendo o preco cheio depois de a
     * vitrine ter anunciado o preco no Pix. Aqui a linha passa a contar a mesma
     * historia — cheio riscado, no Pix em destaque.
     *
     * O que NAO muda e a aritmetica da coluna da direita: o subtotal segue
     * cheio, o desconto segue como linha propria e o total segue sendo a conta
     * dos dois. Descontar tambem no subtotal faria o abatimento entrar duas
     * vezes na leitura e o cliente nao conseguiria conferir a soma.
     */
    public static function preco_unitario_com_pix(string $html, array $item): string
    {
        $produto = $item['data'] ?? null;
        if (! $produto instanceof WC_Product) return $html;
        return self::par_de_precos($html, (float) wc_get_price_to_display($produto), 1);
    }

    public static function subtotal_com_pix(string $html, array $item): string
    {
        $produto = $item['data'] ?? null;
        if (! $produto instanceof WC_Product) return $html;
        $quantidade = max(1, (int) ($item['quantity'] ?? 1));
        return self::par_de_precos($html, (float) wc_get_price_to_display($produto), $quantidade);
    }

    /**
     * Monta "cheio riscado + no Pix", ou devolve o original se nao ha desconto.
     *
     * Depois da troca para 5%, o Pix de cada unidade e o mesmo ,99 da vitrine e
     * o subtotal e esse valor vezes a quantidade — a mesma conta do desconto
     * lancado no total, entao a coluna fecha com o total ao centavo.
     */
    private static function par_de_precos(string $html, float $unitario, int $quantidade): string
    {
        $percentual = self::percentual_vigente();
        if ($percentual <= 0 || $unitario <= 0) return $html;
        $cheio = $unitario * $quantidade;
        $comDesconto = Aerion_Pricing::migrated()
            ? Aerion_Pricing::pix_price($unitario) * $quantidade
            : $cheio * (1 - $percentual / 100);
        return '<span class="aerion-pix-price">'
            . '<del>' . wp_kses_post(wc_price($cheio)) . '</del>'
            . '<strong>' . wp_kses_post(wc_price($comDesconto)) . '</strong>'
            . '<small>no Pix</small></span>';
    }

    /**
     * Desconto do metodo que o pedido esta usando agora.
     *
     * Mesma resolucao do WooCommerce: o da sessao, ou o primeiro disponivel.
     * O resultado vale para a requisicao inteira — a sessao nao muda no meio
     * dela — e o cache evita percorrer os gateways a cada linha do carrinho.
     *
     * A trava existe porque `is_available()` de alguns gateways consulta o total
     * do carrinho, e este metodo e chamado de dentro do calculo do total.
     */
    private static function percentual_vigente(): float
    {
        if (self::$percentualVigente !== null) return self::$percentualVigente;
        if (self::$resolvendoGateway) return 0.0;
        if (! function_exists('WC') || ! WC()->payment_gateways()) return 0.0;

        self::$resolvendoGateway = true;
        $gateways = WC()->payment_gateways()->get_available_payment_gateways();
        self::$resolvendoGateway = false;
        if (! $gateways) return 0.0;

        $escolhido = WC()->session ? (string) WC()->session->get('chosen_payment_method') : '';
        $gateway = ($escolhido !== '' && isset($gateways[$escolhido])) ? $gateways[$escolhido] : current($gateways);
        self::$percentualVigente = $gateway instanceof WC_Payment_Gateway ? self::percentual_de_desconto($gateway) : 0.0;
        return self::$percentualVigente;
    }

    /**
     * Poe o Pix na frente da lista de pagamentos — e com isso ele vira o padrao.
     *
     * O WooCommerce escolhe o metodo pre-selecionado com `current($gateways)`:
     * o primeiro da lista, quando a sessao ainda nao tem escolha. Antes disso
     * caia no cartao, e o cliente chegava ao checkout com o total CHEIO depois
     * de a vitrine inteira anunciar o preco no Pix.
     *
     * A uniao de arrays (`+`) mantem a chave da esquerda quando ela se repete,
     * entao isto move o Pix para o topo sem duplicar nem reordenar o resto.
     */
    public static function pix_como_padrao(array $gateways): array
    {
        if (! isset($gateways[self::GATEWAY_PIX])) return $gateways;
        return [self::GATEWAY_PIX => $gateways[self::GATEWAY_PIX]] + $gateways;
    }

    /**
     * Recusa do antifraude do Mercado Pago (`buyer_rejected_high_risk` no Pix,
     * `buyer_cc_rejected_high_risk` no cartão).
     *
     * A tradução do plugin para essa recusa diz "O banco emissor do cartão
     * recusou o pagamento", o que é falso: quem recusou foi o sistema de
     * prevenção a fraudes do Mercado Pago, e isso vale também para o Pix, que
     * não tem cartão nem banco emissor. O cliente que lê "banco do cartão" tenta
     * outro cartão ou liga para o banco, e nenhum dos dois resolve.
     */
    public static function mensagem_de_recusa_por_seguranca($traduzido, $original = '')
    {
        if (! is_string($original) || ! str_contains($original, 'For safety reasons, your payment was declined')) {
            return $traduzido;
        }
        $contato = class_exists('Aerion_Emails') ? Aerion_Emails::contato() : 'comercial@aerion.com.br';
        return '<strong>Não foi possível concluir o pagamento</strong><br>'
            . 'O Mercado Pago recusou esta transação por segurança. Tente novamente em alguns minutos, '
            . 'escolha outro meio de pagamento ou fale com o nosso time comercial: ' . $contato . '.';
    }

    /**
     * "Desconto no Pix" no lugar de "Desconto do Mercado Pago".
     *
     * O rotulo do plugin nomeia o intermediario, nao a condicao — quem le quer
     * saber POR QUE o valor caiu, e a resposta e o meio de pagamento. Trocamos
     * na traducao para a linha do checkout (que e escrita pelo plugin) bater com
     * a do carrinho (escrita por nos, logo abaixo).
     */
    public static function rotulo_do_desconto(string $traduzido, string $original): string
    {
        return $original === 'Mercado Pago Discount' ? self::ROTULO_DESCONTO : $traduzido;
    }

    /**
     * Espelha no carrinho o desconto que o gateway so aplica no checkout.
     *
     * A vitrine anuncia o preco no Pix — e ele que aparece em destaque no card —,
     * mas o plugin do Mercado Pago se barra sozinho com `is_checkout()` e so cria
     * a linha de desconto na pagina de finalizacao. O carrinho ficava mostrando o
     * preco cheio, e entre a vitrine e o carrinho parecia que o valor tinha
     * subido sozinho.
     *
     * A condicao aqui e o COMPLEMENTO exato da do plugin (`! is_checkout()`),
     * entao os dois nunca entram no mesmo total: fora do checkout aplica este
     * metodo, dentro dele aplica o plugin. Vale lembrar que `is_checkout()` e
     * verdadeiro tambem no AJAX de `update_order_review` (o WooCommerce define
     * `WOOCOMMERCE_CHECKOUT` ali), entao trocar a forma de pagamento na tela de
     * finalizacao continua sendo trabalho do plugin, sem passar por aqui.
     *
     * O metodo considerado e o mesmo que o WooCommerce vai pre-selecionar — o da
     * sessao, ou o primeiro disponivel — de modo que trocar para cartao tira o
     * desconto do carrinho tambem, que e o comportamento combinado.
     */
    public static function desconto_do_pagamento_fora_do_checkout(WC_Cart $cart): void
    {
        // Depois da troca para 5%, o desconto e sempre da loja, no carrinho e no
        // checkout; o do plugin fica zerado (`zerar_desconto_do_gateway`). Antes
        // dela, o plugin lanca o desconto no checkout e aqui so se espelha fora.
        $propria = Aerion_Pricing::migrated();
        if (! $propria && is_checkout()) return;
        if (is_admin() && ! wp_doing_ajax()) return;
        $percentual = self::percentual_vigente();
        if ($percentual <= 0) return;

        if ($propria) {
            $desconto = self::desconto_por_item($cart, $percentual);
        } else {
            // Mesma base do plugin (`Helpers\Cart::getSubtotal`): conteudo + imposto
            // do conteudo. Usar `get_subtotal()` daria outro numero em loja com
            // imposto exibido, e o carrinho fecharia diferente do checkout por
            // centavos — o tipo de divergencia que ninguem consegue explicar depois.
            $base = (float) $cart->get_cart_contents_total() + (float) $cart->get_cart_contents_tax();
            $desconto = $base * ($percentual / 100);
        }
        if ($desconto <= 0) return;

        // Mesmo rotulo que `rotulo_do_desconto()` forca na linha do checkout,
        // para as duas telas dizerem a mesma coisa.
        $cart->add_fee(self::ROTULO_DESCONTO, -$desconto, true);
    }

    /**
     * Desconto que leva cada unidade ao seu Pix de vitrine (terminado em ,99).
     *
     * O plugin do Mercado Pago aplica a taxa sobre o total do carrinho; com
     * varias unidades o total cobrado saia alguns centavos diferente da soma dos
     * precos anunciados. Com cupom, o valor do item deixa de ser o da vitrine, e
     * a conta volta a ser sobre o total.
     */
    public static function desconto_por_item(WC_Cart $cart, float $percentual): float
    {
        if ($cart->get_applied_coupons()) {
            $base = (float) $cart->get_cart_contents_total() + (float) $cart->get_cart_contents_tax();
            return round($base * $percentual / 100, 2);
        }
        $desconto = 0.0;
        foreach ($cart->get_cart() as $item) {
            $produto = $item['data'] ?? null;
            if (! $produto instanceof WC_Product) continue;
            $unitario = (float) wc_get_price_to_display($produto);
            $desconto += ($unitario - Aerion_Pricing::pix_price($unitario)) * max(1, (int) ($item['quantity'] ?? 1));
        }
        return round($desconto, 2);
    }

    /** Desconto do metodo de pagamento, em pontos percentuais. */
    private static function percentual_de_desconto(WC_Payment_Gateway $gateway): float
    {
        if (Aerion_Pricing::migrated()) {
            return self::a_vista($gateway->id) ? Aerion_Pricing::pix_rate() : 0.0;
        }
        if ($gateway->get_option('gateway_discount_checkbox') !== 'yes') return 0.0;
        $valor = (float) $gateway->get_option('gateway_discount', '0');
        return ($valor > 0 && $valor < 100) ? $valor : 0.0;
    }

    /** Pix e boleto: os metodos com o desconto a vista. */
    private static function a_vista(string $gatewayId): bool
    {
        return in_array($gatewayId, [self::GATEWAY_PIX, 'woo-mercado-pago-ticket'], true);
    }

    /**
     * Depois da troca para 5%, o desconto e so da loja. O do plugin fica zerado
     * mesmo que alguem o religue na tela do Mercado Pago: os dois juntos dariam
     * desconto em dobro.
     */
    public static function zerar_desconto_do_gateway(mixed $settings): mixed
    {
        if (! is_array($settings) || ! Aerion_Pricing::migrated()) return $settings;
        $settings['gateway_discount'] = '0';
        $settings['gateway_discount_checkbox'] = 'no';
        return $settings;
    }

    /** O plugin deixa de escrever "(x% de desconto)" no nome do metodo; a loja escreve. */
    public static function titulo_com_desconto(string $title, string $id = ''): string
    {
        if (is_admin() && ! wp_doing_ajax()) return $title;
        if (! Aerion_Pricing::migrated() || ! self::a_vista($id) || Aerion_Pricing::pix_rate() <= 0) return $title;
        if (str_contains($title, '%')) return $title;
        return $title . ' (' . Aerion_Pricing::rate_label() . '% de desconto)';
    }

    /** Descarta o percentual guardado na requisicao (testes, troca de metodo). */
    public static function reset_cache(): void
    {
        self::$percentualVigente = null;
    }
}
