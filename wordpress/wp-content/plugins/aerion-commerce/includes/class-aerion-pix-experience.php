<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Tela de pedido recebido e e-mail do Pix, na ordem em que o cliente precisa.
 *
 * Com Pix o pedido NAO esta confirmado quando a tela abre: ele so existe de
 * verdade depois que o banco avisa o pagamento. Por isso, enquanto o pedido
 * esta pendente, a tela diz "Aguardando pagamento" e poe o QR e o codigo no
 * topo — e o selo verde de confirmacao so aparece para pedido pago.
 *
 * O Mercado Pago imprime o proprio bloco do Pix (passo a passo em duas colunas
 * e um QR grande depois da tabela do pedido). Aqui esse bloco e desligado na
 * tela e no e-mail e substituido por um unico painel, com QR menor e centrado
 * e uma caixa de "copia e cola". O que fica do plugin e o que ele faz bem:
 * gerar o Pix e checar o pagamento (o script de consulta continua registrado).
 */
final class Aerion_Pix_Experience
{
    private const GATEWAY = 'woo-mercado-pago-pix';

    public static function boot(): void
    {
        add_action('woocommerce_before_thankyou', [self::class, 'topo'], 1);
        add_filter('woocommerce_endpoint_order-received_title', [self::class, 'titulo'], 20);
        add_filter('woocommerce_thankyou_order_received_title', [self::class, 'titulo_do_bloco'], 20, 2);
        add_filter('woocommerce_thankyou_order_received_text', [self::class, 'texto'], 20, 2);
        add_filter('gettext_woocommerce', [self::class, 'corrigir_traducao'], 20, 2);
        add_action('woocommerce_account_view-order_endpoint', [self::class, 'topo_da_conta'], 5);
        // O e-mail do Pix ja leva o QR; o bloco do Mercado Pago (imagem por URL) sai de todos os e-mails.
        add_action('woocommerce_email_before_order_table', [self::class, 'desligar_no_email'], 1);

        add_filter('woocommerce_email_classes', [self::class, 'registrar_email']);
        add_action('woocommerce_new_customer_note_notification', [self::class, 'enviar_email_do_pix'], 5, 1);
        add_filter('woocommerce_email_enabled_customer_note', [self::class, 'suprimir_nota_do_pix'], 10, 3);
    }

    /* ---------------------------------------------------------------- dados */

    /** Meta do Mercado Pago como texto: o plugin as grava como lista. */
    private static function meta(WC_Order $order, string $chave): string
    {
        $valor = $order->get_meta($chave);
        if (is_array($valor)) {
            $valor = end($valor);
        }
        return is_scalar($valor) ? trim((string) $valor) : '';
    }

    /**
     * Quando o Pix vence, como timestamp.
     *
     * O Mercado Pago grava a validade como DURACAO ("30 minutes"), nao como data.
     * Passar isso direto a strtotime() devolve "agora + 30 min" a cada abertura da
     * pagina — um "vale ate" que anda junto com o relogio. A duracao conta a partir
     * da criacao do pedido; uma data absoluta, se vier, vale como esta.
     */
    private static function validade(WC_Order $order): ?int
    {
        $bruto = self::meta($order, 'checkout_pix_date_expiration');
        if ($bruto === '') {
            return null;
        }
        if (preg_match('/^\d+\s*(minutes?|hours?|days?)$/i', $bruto)) {
            $criado = $order->get_date_created();
            $ts = $criado ? strtotime('+' . $bruto, $criado->getTimestamp()) : false;
        } else {
            $ts = strtotime($bruto);
        }
        return $ts !== false ? $ts : null;
    }

    /** @return array{code:string,qr:string,expira:string,expirado:bool,valor:float}|null */
    public static function dados(WC_Order $order): ?array
    {
        if ($order->get_payment_method() !== self::GATEWAY) {
            return null;
        }
        $code = self::meta($order, 'mp_pix_qr_code');
        if ($code === '') {
            return null;
        }
        $ts = self::validade($order);
        // O valor que o cliente vai pagar e o que o Mercado Pago embutiu no codigo, nao necessariamente o total atual do pedido.
        $pago = self::meta($order, 'mp_transaction_amount');
        return [
            'code'     => $code,
            'qr'       => self::meta($order, 'mp_pix_qr_base64'),
            'expira'   => $ts ? wp_date('d/m/Y \à\s H:i', $ts) : '',
            'expirado' => $ts !== null && time() > $ts,
            'valor'    => is_numeric($pago) && (float) $pago > 0 ? (float) $pago : (float) $order->get_total(),
        ];
    }

    private static function vencido(WC_Order $order): bool
    {
        $pix = self::dados($order);
        return $pix !== null && $pix['expirado'];
    }

    /** Pendente ou em espera: o pedido existe, mas nada foi pago. */
    public static function aguardando(WC_Order $order): bool
    {
        return ! $order->is_paid() && $order->has_status(['pending', 'on-hold']);
    }

    private static function pedido_da_pagina(): ?WC_Order
    {
        $id = absint(get_query_var('order-received'));
        $order = $id > 0 ? wc_get_order($id) : false;
        return $order instanceof WC_Order ? $order : null;
    }

    /* ----------------------------------------------------------------- tela */

    public static function titulo($titulo)
    {
        $order = self::pedido_da_pagina();
        if (! $order) {
            return $titulo;
        }
        if ($order->is_paid()) {
            return 'Pedido confirmado';
        }
        if (self::aguardando($order)) {
            return self::vencido($order) ? 'Pix expirado' : 'Aguardando pagamento';
        }
        return $order->has_status(['failed', 'cancelled']) ? 'Pedido não concluído' : $titulo;
    }

    /** O bloco de confirmacao passa o pedido; o titulo da aba usa o da URL. */
    public static function titulo_do_bloco($titulo, $order = null)
    {
        if (! $order instanceof WC_Order) {
            return $titulo;
        }
        if ($order->is_paid()) {
            return 'Pedido confirmado';
        }
        if (self::aguardando($order)) {
            return self::vencido($order) ? 'Pix expirado' : 'Aguardando pagamento';
        }
        return $order->has_status(['failed', 'cancelled']) ? 'Pedido não concluído' : $titulo;
    }

    public static function texto($texto, $order)
    {
        if (! $order instanceof WC_Order) {
            return $texto;
        }
        if ($order->is_paid()) {
            return 'Pagamento identificado. Já estamos separando o seu pedido.';
        }
        if (self::aguardando($order)) {
            if (self::vencido($order)) {
                return 'O código Pix deste pedido venceu e não vale mais. Faça um novo pedido ou fale com o nosso atendimento.';
            }
            return self::dados($order)
                ? 'Seu pedido está reservado, mas só é confirmado quando o Pix for pago. Use o QR Code ou o código abaixo.'
                : 'Seu pedido foi registrado e será confirmado quando o pagamento for identificado.';
        }
        return $texto;
    }

    /** O WooCommerce Blocks traduz "Order #:" como "Pedidor #:". */
    public static function corrigir_traducao($traduzido, $original)
    {
        if ($original === 'Order #:') {
            return 'Pedido nº:';
        }
        // Data das "atualizacoes do pedido": saia por extenso, "segunda-feira 19 de outubro de 2026, 12:36pm".
        if ($original === 'l jS \o\f F Y, h:ia') {
            return 'd/m/Y \à\s H:i';
        }
        return $traduzido;
    }

    /**
     * "Ver pedido" na conta: o Mercado Pago imprime ali o QR grande colado na
     * tabela de acoes. Pedido Pix pendente recebe o mesmo painel da tela de
     * pedido recebido, no topo da pagina.
     */
    public static function topo_da_conta($order_id): void
    {
        $order = wc_get_order(absint($order_id));
        if (! $order instanceof WC_Order || (int) $order->get_user_id() !== get_current_user_id()) {
            return;
        }

        self::desligar_saidas_do_mercado_pago();

        $pix = self::aguardando($order) ? self::dados($order) : null;
        if ($pix) {
            self::painel($order, $pix);
        }
    }

    /**
     * Topo da tela: selo de espera e painel do Pix. O selo verde fica com
     * Aerion_Checkout::selo_de_sucesso, que agora so sai para pedido pago.
     */
    public static function topo($order_id): void
    {
        $order = wc_get_order($order_id);
        if (! $order instanceof WC_Order) {
            return;
        }

        self::desligar_saidas_do_mercado_pago();

        if (! self::aguardando($order)) {
            return;
        }

        $src = get_theme_file_path('assets/source-images/status/aguardando-pagamento.png');
        if (file_exists($src)) {
            echo '<div class="aerion-pedido-selo aerion-pedido-selo--espera"><img src="'
                . esc_url(get_theme_file_uri('assets/source-images/status/aguardando-pagamento.png'))
                . '" alt="" width="64" height="64" /></div>';
        }

        $pix = self::dados($order);
        if ($pix) {
            self::painel($order, $pix);
        }
    }

    /**
     * Script que confere o pagamento e recarrega a tela quando aprova.
     *
     * Usa a mesma consulta do plugin do Mercado Pago (`mp_pix_payment_status`),
     * que pergunta o pagamento direto à API do Mercado Pago e, ao ver "approved",
     * já move o pedido para Processando. O script do próprio plugin só começava
     * depois de 20 segundos, conferia a cada 5 e desistia em 5 minutos; este
     * começa logo, confere a cada 3 segundos nos primeiros 2 minutos (o caso
     * normal: o cliente paga com o app aberto), desacelera depois e segue por
     * 3 horas. Com a aba em segundo plano pausa, e confere de imediato ao voltar.
     */
    private static function consulta(WC_Order $order): string
    {
        $dados = [
            'url'   => WC_AJAX::get_endpoint('mp_pix_payment_status'),
            'order' => $order->get_id(),
            'key'   => $order->get_order_key(),
            'nonce' => wp_create_nonce('mp_pix_polling_nonce'),
        ];
        $js = '(function(d){var t0=Date.now(),busy=false,timer=null,max=3*3600*1000;'
            . 'function wait(){var s=(Date.now()-t0)/1000;return s<120?3000:(s<600?6000:15000)}'
            . 'function next(){clearTimeout(timer);if(Date.now()-t0<max)timer=setTimeout(tick,wait())}'
            . 'function tick(){if(document.hidden){next();return}if(busy)return;busy=true;'
            . 'var f=new FormData();f.append("order_id",d.order);f.append("order_key",d.key);f.append("nonce",d.nonce);'
            . 'fetch(d.url,{method:"POST",body:f,credentials:"same-origin"}).then(function(r){'
            . 'if(r.status===403){busy=false;return null}return r.json()}).then(function(j){busy=false;'
            . 'if(j===null)return;if(j&&j.success&&j.data&&j.data.status==="approved"){window.location.reload();return}next()})'
            . '.catch(function(){busy=false;next()})}'
            . 'document.addEventListener("visibilitychange",function(){if(!document.hidden){clearTimeout(timer);tick()}});'
            . 'timer=setTimeout(tick,1500)})(' . wp_json_encode($dados) . ');';
        return '<script>' . $js . '</script>';
    }

    /**
     * Tira os blocos do Mercado Pago (passo a passo e QR grande) da tela.
     *
     * O plugin usa metodos de objeto, entao nao ha como desligar por nome:
     * procura-se, em cada gancho, o callback cujo objeto e o gateway do Pix.
     */
    public static function desligar_no_email(): void
    {
        self::desligar_saidas_do_mercado_pago();
    }

    private static function desligar_saidas_do_mercado_pago(): void
    {
        global $wp_filter;
        foreach (['woocommerce_thankyou_' . self::GATEWAY, 'woocommerce_order_details_after_order_table', 'woocommerce_email_before_order_table'] as $gancho) {
            if (empty($wp_filter[$gancho]) || ! $wp_filter[$gancho] instanceof WP_Hook) {
                continue;
            }
            foreach ($wp_filter[$gancho]->callbacks as $prioridade => $callbacks) {
                foreach ($callbacks as $callback) {
                    $funcao = $callback['function'];
                    if (is_array($funcao) && is_object($funcao[0]) && str_ends_with(get_class($funcao[0]), 'PixGateway')) {
                        remove_action($gancho, $funcao, (int) $prioridade);
                    }
                }
            }
        }
    }

    private static function painel(WC_Order $order, array $pix): void
    {
        if ($pix['expirado']) {
            echo '<section class="aerion-pix aerion-pix--vencido" aria-labelledby="aerion-pix-titulo">';
            echo '<span class="aerion-pix__chip aerion-pix__chip--vencido">Código expirado</span>';
            echo '<h2 id="aerion-pix-titulo">Este Pix venceu</h2>';
            echo '<p class="aerion-pix__sub">O código deste pedido não vale mais' . ($pix['expira'] !== '' ? ' (venceu em ' . esc_html($pix['expira']) . ')' : '')
                . '. Faça um novo pedido ou fale com o nosso atendimento para gerar outro pagamento.</p>';
            echo '</section>';
            return;
        }

        $total = wc_price($pix['valor']);
        $imagem = $pix['qr'] !== '' ? 'data:image/png;base64,' . $pix['qr'] : '';

        echo '<section class="aerion-pix" aria-labelledby="aerion-pix-titulo">';
        echo '<span class="aerion-pix__chip">Aguardando pagamento</span>';
        echo '<h2 id="aerion-pix-titulo">Pague ' . wp_kses_post($total) . ' com Pix</h2>';
        echo '<p class="aerion-pix__sub">' . ($pix['expira'] !== '' ? 'Este código vale até ' . esc_html($pix['expira']) . '. ' : '')
            . 'Quando o pagamento for identificado, esta página atualiza sozinha.</p>';
        if ($imagem !== '') {
            echo '<img class="aerion-pix__qr" src="' . esc_attr($imagem) . '" width="176" height="176" alt="QR Code do Pix" />';
        }
        echo '<div class="aerion-pix__copia"><label for="aerion-pix-codigo">Pix copia e cola</label>';
        echo '<div class="aerion-pix__linha"><input id="aerion-pix-codigo" type="text" readonly value="' . esc_attr($pix['code']) . '" />';
        echo '<button type="button" class="aerion-pix__botao" data-aerion-copiar="aerion-pix-codigo">Copiar código</button></div></div>';
        echo '<ol class="aerion-pix__passos"><li>Abra o app do seu banco e escolha pagar com Pix.</li>'
            . '<li>Escaneie o QR Code ou cole o código copiado.</li>'
            . '<li>Confirme o valor e finalize o pagamento.</li></ol>';
        echo '</section>';
        echo self::consulta($order);
        // Sem dependencia: a tela de pedido nao carrega jQuery para isso.
        echo '<script>document.addEventListener("click",function(e){var b=e.target.closest("[data-aerion-copiar]");if(!b)return;'
            . 'var i=document.getElementById(b.getAttribute("data-aerion-copiar"));if(!i)return;i.select();i.setSelectionRange(0,99999);'
            . 'var ok=function(){var t=b.textContent;b.textContent="Copiado ✓";b.classList.add("is-ok");setTimeout(function(){b.textContent=t;b.classList.remove("is-ok")},2200)};'
            . 'if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(i.value).then(ok,function(){document.execCommand("copy");ok()})}else{document.execCommand("copy");ok()}});</script>';
    }

    /* --------------------------------------------------------------- e-mail */

    public static function registrar_email(array $emails): array
    {
        require_once __DIR__ . '/class-aerion-email-pix.php';
        $emails['Aerion_Email_Pix'] = new Aerion_Email_Pix();
        return $emails;
    }

    /** Texto puro da observacao: o plugin a grava as vezes embrulhada em <div><p>. */
    private static function texto_da_nota(string $nota): string
    {
        return strtolower(trim((string) preg_replace('/\s+/', ' ', wp_strip_all_tags($nota))));
    }

    /** Observacao ao cliente gravada pelo Mercado Pago (instrucao do Pix, "esperando pagamento"...). */
    private static function nota_do_mercado_pago(string $nota): bool
    {
        return str_starts_with(self::texto_da_nota($nota), 'mercado pago:');
    }

    /**
     * Manda o e-mail do Pix quando a observacao do Mercado Pago chega com o QR ja gravado.
     *
     * @param array{order_id?:int,customer_note?:string} $args
     */
    public static function enviar_email_do_pix($args): void
    {
        $order_id = (int) ($args['order_id'] ?? 0);
        $nota = (string) ($args['customer_note'] ?? '');
        $order = $order_id > 0 ? wc_get_order($order_id) : false;
        if (! $order instanceof WC_Order || ! self::nota_do_mercado_pago($nota) || ! self::dados($order) || ! self::aguardando($order)) {
            return;
        }

        $emails = WC()->mailer()->get_emails();
        $email = $emails['Aerion_Email_Pix'] ?? null;
        if ($email instanceof Aerion_Email_Pix) {
            $email->trigger($order_id, $order);
        }
    }

    /**
     * O e-mail "Atualizacao do pedido" nao diz nada que o e-mail do Pix e a tela
     * do pedido nao digam: o estado ja esta implicito. O Mercado Pago grava mais
     * de uma observacao por pedido ("Agora e so pagar com o Pix", "Esperando o
     * pagamento via Pix"), entao a regra vale para todas, e nao so para a que
     * dispara o e-mail do Pix.
     *
     * @param bool          $ativo
     * @param WC_Order|null $order
     * @param WC_Email|null $email
     */
    public static function suprimir_nota_do_pix($ativo, $order = null, $email = null)
    {
        if (! $ativo || ! $order instanceof WC_Order || $order->get_payment_method() !== self::GATEWAY || $order->is_paid()) {
            return $ativo;
        }
        $nota = is_object($email) && isset($email->customer_note) ? (string) $email->customer_note : '';
        return self::nota_do_mercado_pago($nota) ? false : $ativo;
    }
}
