<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

if (! class_exists('WC_Email')) {
    return;
}

/**
 * E-mail de nota fiscal emitida.
 *
 * Reaproveita os templates do WooCommerce (`customer-processing-order.php`) em
 * vez de trazer os proprios: o layout, o resumo do pedido e os enderecos ja saem
 * prontos e continuam acompanhando as atualizacoes do WooCommerce. O que muda e
 * o assunto, o titulo e o paragrafo de abertura — que e onde este e-mail
 * realmente difere dos outros.
 */
class Aerion_Email_Nota_Fiscal extends WC_Email
{
    public function __construct()
    {
        $this->id             = 'aerion_nota_fiscal';
        $this->customer_email = true;
        $this->title          = __('Nota fiscal emitida', 'aerion-commerce');
        $this->description    = __('Avisa o cliente de que a NF-e do pedido foi emitida, com o número e a chave.', 'aerion-commerce');
        $this->template_html  = 'emails/aerion-status-order.php';
        $this->template_plain = 'emails/plain/aerion-status-order.php';
        $this->placeholders   = ['{order_date}' => '', '{order_number}' => ''];

        add_action('woocommerce_order_status_' . Aerion_Order_Status::NOTA . '_notification', [$this, 'trigger'], 10, 2);

        parent::__construct();
    }

    public function get_default_subject(): string
    {
        return __('[{site_title}] Nota fiscal do pedido #{order_number}', 'aerion-commerce');
    }

    public function get_default_heading(): string
    {
        return __('Sua nota fiscal foi emitida', 'aerion-commerce');
    }

    public function get_default_additional_content(): string
    {
        return __('Se precisar do arquivo XML da nota, é só responder este e-mail.', 'aerion-commerce');
    }

    /**
     * Com DANFE e XML anexos, o texto padrão ("peça o XML") contradiria o
     * próprio e-mail. O WooCommerce congela o padrão ao montar o e-mail, antes
     * de haver pedido, então a troca acontece aqui, na hora do envio. Um texto
     * que alguém tenha escrito no admin é respeitado.
     */
    public function get_additional_content()
    {
        $content = (string) parent::get_additional_content();
        if (count($this->arquivos()) > 1 && trim(wp_strip_all_tags($content)) === $this->get_default_additional_content()) {
            return __('O DANFE (PDF) e o XML da nota seguem anexos e também ficam disponíveis em Minha conta, na página do pedido.', 'aerion-commerce');
        }
        return $content;
    }

    /**
     * DANFE e XML anexados ao e-mail.
     *
     * A contabilidade do revendedor escritura a nota pelo XML; mandá-lo junto
     * evita o "me envia o XML" que vinha logo depois deste aviso.
     */
    public function get_attachments()
    {
        return array_merge((array) parent::get_attachments(), $this->arquivos());
    }

    /** @return list<string> */
    private function arquivos(): array
    {
        return $this->object instanceof WC_Order && class_exists('Aerion_Order_Operations')
            ? Aerion_Order_Operations::invoice_files($this->object)
            : [];
    }

    /**
     * Numero e chave da NF-e, acima da tabela do pedido.
     *
     * Sem isto o e-mail anuncia a nota e nao a entrega — e o cliente escreve
     * pedindo o numero, que e exatamente o contato que este e-mail existe para
     * evitar. A chave de 44 digitos vem junto porque e com ela que a
     * contabilidade baixa o XML no portal da Receita.
     *
     * Enganchado so durante a montagem DESTE e-mail e desenganchado em seguida:
     * `woocommerce_email_before_order_table` e global.
     */
    public function bloco_nota($order, $sent_to_admin, $plain_text): void
    {
        if (! $order instanceof WC_Order) {
            return;
        }
        $numero = trim((string) $order->get_meta('_aerion_invoice_number'));
        $chave  = trim((string) $order->get_meta('_aerion_invoice_key'));
        if ($numero === '' && $chave === '') {
            return;
        }

        if ($plain_text) {
            $linhas = [];
            if ($numero !== '') $linhas[] = __('Nota fiscal:', 'aerion-commerce') . ' ' . $numero;
            if ($chave !== '')  $linhas[] = __('Chave da NF-e:', 'aerion-commerce') . ' ' . $chave;
            echo PHP_EOL . esc_html(implode(PHP_EOL, $linhas)) . PHP_EOL;
            return;
        }

        echo '<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin:0 0 24px;background:#f2f8fb;border-radius:8px">';
        echo '<tr><td style="padding:18px 20px">';
        if ($numero !== '') {
            echo '<p style="margin:0 0 6px;font-size:13px;color:#54697a">' . esc_html__('Nota fiscal', 'aerion-commerce') . '</p>';
            echo '<p style="margin:0;font-size:19px;font-weight:700;color:#071d2d">' . esc_html($numero) . '</p>';
        }
        if ($chave !== '') {
            echo '<p style="margin:' . ($numero !== '' ? '14px' : '0') . ' 0 6px;font-size:13px;color:#54697a">' . esc_html__('Chave de acesso', 'aerion-commerce') . '</p>';
            echo '<p style="margin:0;font-size:13px;line-height:1.5;word-break:break-all;color:#14293a;font-family:monospace">' . esc_html($chave) . '</p>';
        }
        echo '</td></tr></table>';
    }

    /** A frase de abertura. E a unica parte do corpo que e nossa. */
    private function intro(): string
    {
        return __('A nota fiscal do seu pedido foi emitida. Os dados estão abaixo, e o pedido segue para separação.', 'aerion-commerce');
    }

    public function trigger($order_id, $order = false): void
    {
        $this->setup_locale();

        if ($order_id && ! is_a($order, 'WC_Order')) {
            $order = wc_get_order($order_id);
        }

        if (is_a($order, 'WC_Order')) {
            $this->object                         = $order;
            $this->recipient                      = $order->get_billing_email();
            // O "E-mail para XML e NF-e" que a empresa informou no checkout
            // existe para isto: a nota chega também a quem escritura.
            $fiscal = sanitize_email((string) $order->get_meta('_billing_fiscal_email'));
            if ($fiscal !== '' && strcasecmp($fiscal, (string) $this->recipient) !== 0) {
                $this->recipient = trim($this->recipient . ',' . $fiscal, ',');
            }
            $this->placeholders['{order_date}']   = wc_format_datetime($order->get_date_created());
            $this->placeholders['{order_number}'] = $order->get_order_number();
        }

        if ($this->is_enabled() && $this->get_recipient()) {
            $this->send($this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments());
        }

        $this->restore_locale();
    }

    public function get_content_html(): string
    {
        add_action('woocommerce_email_before_order_table', [$this, 'bloco_nota'], 5, 3);
        $saida = wc_get_template_html($this->template_html, [
            'order'              => $this->object,
            'email_heading'      => $this->get_heading(),
            'additional_content' => $this->get_additional_content(),
            'sent_to_admin'      => false,
            'plain_text'         => false,
            'email'              => $this,
            'intro'              => $this->intro(),
        ]);
        remove_action('woocommerce_email_before_order_table', [$this, 'bloco_nota'], 5);
        return $saida;
    }

    public function get_content_plain(): string
    {
        add_action('woocommerce_email_before_order_table', [$this, 'bloco_nota'], 5, 3);
        $saida = wc_get_template_html($this->template_plain, [
            'order'              => $this->object,
            'email_heading'      => $this->get_heading(),
            'additional_content' => $this->get_additional_content(),
            'sent_to_admin'      => false,
            'plain_text'         => true,
            'email'              => $this,
            'intro'              => $this->intro(),
        ]);
        remove_action('woocommerce_email_before_order_table', [$this, 'bloco_nota'], 5);
        return $saida;
    }
}
