<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Identidade visual dos e-mails transacionais.
 *
 * Nada aqui e um template forkado, de proposito. O WooCommerce 11 ja roda o
 * layout novo (`email_improvements`), que e responsivo e bem espacado; o que
 * faltava era marca, cor e imagem. Copiar `email-header.php` para o tema
 * resolveria a mesma coisa e passaria a exigir que alguem reconcilie o arquivo
 * a cada atualizacao do WooCommerce — o proprio cabecalho do template avisa
 * isso. Ajuste por opcao e por hook nao tem esse custo.
 *
 * A arte de estado entra por `woocommerce_email_before_order_table`, um hook so
 * que atende todos os e-mails de pedido. Um override por e-mail seria o mesmo
 * HTML cinco vezes.
 */
final class Aerion_Emails
{
    /** Azul Aerion. O padrao do WooCommerce era um ciano generico. */
    private const AZUL = '#0877bd';

    private const NAVY = '#071d2d';

    public static function boot(): void
    {
        add_action('init', [self::class, 'sincronizar_opcoes']);
        add_filter('woocommerce_email_styles', [self::class, 'estilos'], 20, 2);
        add_action('woocommerce_email_before_order_table', [self::class, 'arte_de_estado'], 8, 4);
        add_action('woocommerce_email_footer', [self::class, 'rodape_descadastro'], 20, 1);
        add_filter('woocommerce_mail_content', [self::class, 'endereco_de_contato']);
        add_filter('woocommerce_email_headers', [self::class, 'responder_para_contato']);
        if (defined('WP_CLI') && WP_CLI) {
            WP_CLI::add_command('aerion-emails', [self::class, 'cli']);
        }
    }

    /**
     * As cores e a logo do cabecalho sao opcoes do WooCommerce, nao constantes.
     *
     * Escrever no banco a cada `init` seria desperdicio, entao so grava o que
     * estiver diferente — e deixa de gravar de novo se um operador ajustar a
     * cor pelo admin depois, porque a comparacao e com o valor atual, nao com
     * uma marca de "ja rodou".
     */
    public static function sincronizar_opcoes(): void
    {
        $logo = self::url_logo();
        $alvo = [
            'woocommerce_email_base_color'            => self::AZUL,
            'woocommerce_email_background_color'      => '#f2f6f8',
            'woocommerce_email_body_background_color' => '#ffffff',
            'woocommerce_email_text_color'            => '#14293a',
        ];
        // Sem arquivo, a opção fica vazia: um endereço salvo que dá 404 vira ícone quebrado no e-mail.
        $alvo['woocommerce_email_header_image'] = $logo;
        foreach ($alvo as $chave => $valor) {
            if (get_option($chave) !== $valor) {
                update_option($chave, $valor);
            }
        }
    }

    /**
     * A logo do cabecalho precisa de URL absoluta e publica: o cliente de
     * e-mail busca a imagem de fora, sem sessao e sem cookie nenhum.
     */
    private static function url_logo(): string
    {
        return self::url_ativo('assets/images/logo-aerion.png');
    }

    /**
     * URL pública de um arquivo do tema, ou '' se o arquivo não existir.
     *
     * AERION_EMAIL_ASSET_BASE troca a origem (ex.: https://loja.exemplo.com.br)
     * quando o site é servido por um endereço que o cliente de e-mail não alcança,
     * como um ambiente local atrás de túnel.
     */
    public static function url_ativo(string $relativo): string
    {
        if (! file_exists(get_theme_file_path($relativo))) {
            return '';
        }
        $url = get_theme_file_uri($relativo);
        $base = rtrim((string) getenv('AERION_EMAIL_ASSET_BASE'), '/');
        return $base !== '' ? $base . (string) wp_parse_url($url, PHP_URL_PATH) : $url;
    }

    /** Endereço para o cliente escrever. Nunca o do remetente, que não recebe respostas. */
    public static function contato(): string
    {
        $contato = sanitize_email((string) getenv('AERION_MAIL_REPLY_TO'));
        return $contato !== '' ? $contato : 'comercial@aerion.com.br';
    }

    /**
     * O modelo novo do WooCommerce preenche "entre em contato pelo e-mail ..."
     * com o endereço remetente (`naoresponda@`). Só o corpo é reescrito; o
     * remetente do cabeçalho continua o mesmo.
     */
    public static function endereco_de_contato($conteudo)
    {
        $remetente = sanitize_email((string) get_option('woocommerce_email_from_address'));
        $contato = self::contato();
        if (! is_string($conteudo) || $remetente === '' || strcasecmp($remetente, $contato) === 0) {
            return $conteudo;
        }
        return str_ireplace($remetente, $contato, $conteudo);
    }

    /**
     * "Responder" não pode cair em `naoresponda@`. O WooCommerce põe o remetente
     * no Reply-To; só esse caso é trocado, para não mexer no Reply-To de e-mails
     * da equipe, que respondem ao cliente.
     */
    public static function responder_para_contato($cabecalhos)
    {
        $remetente = sanitize_email((string) get_option('woocommerce_email_from_address'));
        if (! is_string($cabecalhos) || $remetente === '') {
            return $cabecalhos;
        }
        $contato = self::contato();
        return (string) preg_replace_callback(
            '/^(Reply-to:\s*)(.*)$/im',
            static fn (array $m): string => stripos($m[2], $remetente) !== false
                ? $m[1] . (string) (getenv('AERION_MAIL_FROM_NAME') ?: 'Aerion Technologies') . ' <' . $contato . '>'
                : $m[0],
            $cabecalhos
        );
    }

    /** Endereços de imagem que os e-mails usam. @return array<string,string> */
    private static function imagens(): array
    {
        return [
            'logo do cabeçalho'  => self::url_logo(),
            'selo de pedido'     => self::url_ativo('assets/source-images/status/pedido-confirmado.png'),
        ];
    }

    /** O cliente de e-mail busca a imagem de fora: localhost, IP privado e http não servem. */
    private static function alcance_publico(string $url): ?string
    {
        $parts = wp_parse_url($url);
        $host = strtolower((string) ($parts['host'] ?? ''));
        if (($parts['scheme'] ?? '') !== 'https') {
            return 'endereço sem https';
        }
        if ($host === 'localhost' || str_ends_with($host, '.local') || str_ends_with($host, '.test') || str_ends_with($host, '.internal')) {
            return 'endereço local, que o cliente de e-mail não alcança';
        }
        if (filter_var($host, FILTER_VALIDATE_IP) && ! filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return 'IP privado, que o cliente de e-mail não alcança';
        }
        return null;
    }

    /**
     * Confere se cada imagem dos e-mails abre pelo mesmo link que o e-mail usa.
     *
     * ## EXAMPLES
     *
     *     wp aerion-emails check-assets
     *
     * @subcommand check-assets
     */
    public static function cli(array $args): void
    {
        $falhas = 0;
        foreach (self::imagens() as $nome => $url) {
            if ($url === '') {
                WP_CLI::warning(sprintf('%s: arquivo ausente no tema; o e-mail sairia sem a imagem.', $nome));
                $falhas++;
                continue;
            }
            $resposta = wp_remote_get($url, ['timeout' => 15, 'redirection' => 3, 'sslverify' => true]);
            $status = is_wp_error($resposta) ? 0 : (int) wp_remote_retrieve_response_code($resposta);
            $tipo = is_wp_error($resposta) ? '' : (string) wp_remote_retrieve_header($resposta, 'content-type');
            $bytes = is_wp_error($resposta) ? 0 : strlen((string) wp_remote_retrieve_body($resposta));
            $ok = $status === 200 && str_starts_with($tipo, 'image/') && $bytes > 0;
            WP_CLI::log(sprintf('%s: %s → HTTP %d %s %dB %s', $nome, $url, $status, $tipo, $bytes, $ok ? 'OK' : 'FALHOU'));
            $falhas += $ok ? 0 : 1;
            $alcance = self::alcance_publico($url);
            if ($alcance !== null) {
                WP_CLI::warning(sprintf('%s: %s. Em produção o site precisa responder por um endereço https público.', $nome, $alcance));
                if (wp_get_environment_type() !== 'local') {
                    $falhas++;
                }
            }
        }
        $falhas > 0 ? WP_CLI::error(sprintf('%d imagem(ns) com problema.', $falhas)) : WP_CLI::success('Imagens dos e-mails acessíveis.');
    }

    /**
     * Arte de estado e o proximo passo, acima da tabela de itens.
     *
     * A linha aqui NAO repete o que o e-mail ja disse. O titulo e o primeiro
     * paragrafo do WooCommerce ja anunciam o estado — um terceiro "recebemos seu
     * pedido" so faria o leitor pular o bloco inteiro. Entao o texto avanca a
     * historia: diz o que acontece em seguida e o que o cliente precisa fazer,
     * que e a duvida real de quem acabou de comprar.
     *
     * So para o cliente: o e-mail que vai para a equipe e uma ficha de trabalho,
     * e um selo grande ali atrapalha quem esta despachando. E so em HTML —
     * a versao texto puro recebe `$plain_text = true` e nao tem onde por imagem.
     */
    public static function arte_de_estado($order, $sent_to_admin = false, $plain_text = false, $email = null): void
    {
        if ($sent_to_admin || $plain_text || ! $order instanceof WC_Order) {
            return;
        }

        $id = $email instanceof WC_Email ? $email->id : '';
        $estados = [
            'customer_processing_order' => ['pedido-confirmado', 'Você recebe o código de rastreio por aqui assim que o pedido for despachado.'],
            'customer_on_hold_order'    => ['aguardando-pagamento', 'Seu pedido está reservado, mas só é confirmado quando o pagamento for identificado. Depois disso a separação começa, sem mais nada a fazer.'],
            'customer_completed_order'  => ['pedido-confirmado', 'O rastreio está no seu histórico de pedidos, na sua conta.'],
        ];
        if (! isset($estados[$id])) {
            return;
        }
        [$arte, $linha] = $estados[$id];

        $src = self::url_ativo("assets/source-images/status/{$arte}.png");
        if ($src === '') {
            return;
        }

        // Tabela, e nao div: Outlook no Windows renderiza com o motor do Word,
        // que ignora boa parte de flex, grid e margin colapsada.
        echo '<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin:6px 0 24px">';
        echo '<tr><td align="center" style="padding:4px 0 14px">';
        echo '<img src="' . esc_url($src) . '" alt="" width="76" height="76" style="display:block;width:76px;height:76px;border:0;outline:none;text-decoration:none" />';
        echo '</td></tr>';
        echo '<tr><td align="center" style="padding:0 16px;font-size:14px;line-height:1.6;color:#54697a">' . esc_html($linha) . '</td></tr>';
        echo '</table>';
    }

    /**
     * Estilo extra injetado no `<style>` do e-mail.
     *
     * Vale so para clientes que leem `<style>` — Gmail web, Apple Mail. Onde nao
     * vale, o e-mail continua legivel pelo estilo inline do proprio WooCommerce;
     * por isso nada essencial mora aqui.
     */
    public static function estilos(string $css, $email = null): string
    {
        return $css . '
#template_header_image img { max-width: 168px !important; height: auto !important; margin: 0 auto 4px; }
#template_container { border-radius: 10px !important; }
#body_content h1, #body_content h2, #body_content h3 { color: ' . self::NAVY . ' !important; font-weight: 700 !important; }
#body_content td ul.wc-item-meta { color: #6a7b88; }
.td, #body_content table th { color: ' . self::NAVY . '; }
#template_footer #credit { color: #7c8b97 !important; font-size: 12px !important; line-height: 1.65 !important; }
';
    }


    /**
     * A linha de descadastro no rodape de todo e-mail.
     *
     * A caixa de comunicacoes vem marcada no cadastro, o que so se sustenta sob
     * legitimo interesse — e legitimo interesse exige que a oposicao seja
     * simples. O lugar onde a pessoa decide parar de receber e o proprio e-mail,
     * nao a area logada: quem se incomodou esta olhando a mensagem, e mandar
     * essa pessoa procurar um menu e criar atrito de proposito.
     *
     * O texto separa as duas coisas explicitamente. Sem isso a duvida aparece na
     * hora — "se eu cancelar, paro de receber a nota fiscal?" — e o medo de
     * perder documento de compra faz a pessoa nao clicar, o que anula o canal.
     *
     * Aparece so para quem tem conta E aceita promocionais. Para pedido de
     * visitante nao ha preferencia a cancelar, e para quem ja cancelou a linha
     * seria ruido.
     */
    public static function rodape_descadastro($email = null): void
    {
        if (! class_exists('Aerion_Descadastro')) {
            return;
        }
        $userId = self::destinatario($email);
        if ($userId <= 0 || ! Aerion_Descadastro::aceita($userId)) {
            return;
        }
        $url = Aerion_Descadastro::url($userId);
        if ($url === '') {
            return;
        }
        printf(
            '<p style="color:#6b7c88;font-size:12px;line-height:1.6;margin:18px 0 0;text-align:center">'
            . 'E-mails sobre seus pedidos, notas fiscais e segurança continuam sendo enviados.<br>'
            . 'Para não receber mais lançamentos e ofertas, <a href="%s" style="color:#6b7c88">cancele aqui</a>.'
            . '</p>',
            esc_url($url)
        );
    }

    /**
     * De quem e o e-mail que esta sendo enviado agora.
     *
     * `woocommerce_email_footer` entrega o proprio objeto do e-mail, e e dele que
     * sai o destinatario — o pedido, quando o e-mail e de pedido, ou o usuario
     * que o e-mail carrega. Pedido feito por visitante devolve 0, e a linha de
     * descadastro nao sai: nao ha preferencia de marketing a cancelar.
     */
    private static function destinatario($email): int
    {
        $objeto = $email instanceof WC_Email ? $email->object : null;

        if ($objeto instanceof WC_Order) {
            return (int) $objeto->get_customer_id();
        }
        if ($objeto instanceof WP_User) {
            return (int) $objeto->ID;
        }
        // `customer_new_account` guarda so o id no proprio e-mail.
        if ($email instanceof WC_Email && isset($email->user_id)) {
            return (int) $email->user_id;
        }
        return 0;
    }
}
