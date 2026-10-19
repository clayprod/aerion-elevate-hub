<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Cliente da API REST do Sankhya (https://developer.sankhya.com.br).
 *
 * Fala com a API direta (OAuth + X-Token) ou, quando AERION_SANKHYA_PARTNER_KEY
 * está definida, com o proxy do parceiro (header X-Partner-Key; empresa 102 e
 * catálogo restrito aplicados por ele). O proxy não expõe NF-e: nesse modo a
 * nota e o cancelamento da nota ficam com o time fiscal.
 *
 * Todo erro devolvido carrega em `data` duas marcas lidas pelo sync:
 * - `retryable`  vale tentar de novo sozinho (rede, 429, 5xx);
 * - `uncertain`  a escrita pode ter sido gravada mesmo com a falha, então a
 *                próxima tentativa procura o pedido antes de reenviar.
 */
final class Aerion_Sankhya_Client implements Aerion_ERP_Client
{
    private string $baseUrl;

    public function __construct(private readonly string $mode)
    {
        $this->baseUrl = self::base_url();
    }

    public static function base_url(): string
    {
        // O proxy não tem endereço padrão: sandbox e produção são URLs distintas.
        $default = self::is_proxy() ? '' : 'https://api.sankhya.com.br';
        return rtrim((string) (getenv('AERION_SANKHYA_BASE_URL') ?: $default), '/');
    }

    /**
     * Um token por ambiente: trocar sandbox por produção não pode reaproveitar
     * o token emitido para o outro.
     */
    /** Proxy do parceiro em vez da API direta. */
    public static function is_proxy(): bool
    {
        return (string) getenv('AERION_SANKHYA_PARTNER_KEY') !== '';
    }

    /**
     * A API direta traz nota e DANFE. O proxy devolveu 404 em /v1/vendas/nfe até
     * expor essas rotas: com AERION_SANKHYA_PROXY_INVOICES=1 o plugin passa a
     * buscá-las também por ele (e o XML, que o proxy pode não ter, vira opcional).
     */
    public static function supports_invoices(): bool
    {
        return ! self::is_proxy() || (string) getenv('AERION_SANKHYA_PROXY_INVOICES') === '1';
    }

    public static function token_cache_key(): string
    {
        return 'aerion_sankhya_token_' . substr(hash('sha256', self::base_url() . '|' . getenv('AERION_SANKHYA_CLIENT_ID') . '|' . (self::is_proxy() ? 'proxy' : 'direct')), 0, 16);
    }

    public function upsert_customer(WC_Order $order): array|WP_Error
    {
        if ($this->mode === 'disabled') {
            return self::disabled();
        }
        $payload = Aerion_Sankhya_Mapper::customer($order);
        if (is_wp_error($payload)) {
            return $payload;
        }
        if ($this->mode === 'mock') {
            return ['code' => (int) substr($payload['cnpjCpf'], -6) ?: 1, 'created' => true];
        }
        // Para CPF/CNPJ já cadastrado o Sankhya responde 409 com o código do
        // parceiro existente, então esta chamada é segura de repetir.
        $response = $this->request('POST', '/v1/parceiros/clientes', $payload);
        if (is_wp_error($response)) {
            return $response;
        }
        $body = $response['body'];
        $code = absint($body['codigoCliente'] ?? $body['retorno']['codigoCliente'] ?? 0);
        if (in_array($response['status'], [200, 201, 409], true) && $code) {
            return ['code' => $code, 'created' => $response['status'] !== 409];
        }
        // O proxy responde 409 sem o código do parceiro e não tem rota para
        // consultá-lo; o pedido aceita o CPF/CNPJ no lugar do código.
        if ($response['status'] === 409 && self::is_proxy()) {
            return ['code' => 0, 'created' => false, 'document' => (string) $payload['cnpjCpf']];
        }
        return self::failure('sankhya_customer_failed', 'Cadastro do cliente', $response);
    }

    /**
     * A API não aceita chave de idempotência. A proteção contra pedido
     * duplicado está em find_sales_order(), consultada pelo sync quando uma
     * tentativa anterior terminou em resultado incerto.
     */
    public function create_sales_order(WC_Order $order, string $idempotencyKey): array|WP_Error
    {
        if ($this->mode === 'disabled') {
            return self::disabled();
        }
        $payload = Aerion_Sankhya_Mapper::order($order);
        if (is_wp_error($payload)) {
            return $payload;
        }
        if ($this->mode === 'mock') {
            return [
                'remote_id'    => 'MOCK-' . $order->get_id(),
                'status'       => 'mocked',
                'payload_hash' => hash('sha256', (string) wp_json_encode($payload)),
            ];
        }
        $response = $this->request('POST', '/v1/vendas/pedidos', $payload);
        // O proxy repassa o título sem validar; se o ERP recusar a baixa embutida, o pedido
        // entra com o título em aberto (o financeiro baixa) em vez de ficar parado.
        if (! is_wp_error($response) && in_array($response['status'], [400, 422], true) && isset($payload['financeiros'][0]['dataBaixa']) && stripos((string) wp_json_encode($response['body']), 'baixa') !== false) {
            unset($payload['financeiros'][0]['dataBaixa']);
            $retry = $this->request('POST', '/v1/vendas/pedidos', $payload);
            if (! is_wp_error($retry) && $retry['status'] >= 200 && $retry['status'] < 300) {
                $order->add_order_note('Sankhya: o ERP não aceitou a baixa do título; pedido enviado com o título em aberto (baixar no financeiro).');
                $response = $retry;
            }
        }
        if (is_wp_error($response)) {
            return $response;
        }
        $body = $response['body'];
        $remoteId = sanitize_text_field((string) ($body['retorno']['codigoPedido'] ?? $body['codigoPedido'] ?? ''));
        $accepted = $response['status'] >= 200 && $response['status'] < 300;
        if ($accepted && $remoteId !== '') {
            return ['remote_id' => $remoteId, 'status' => 'created'];
        }
        if ($accepted) {
            return new WP_Error(
                'sankhya_order_unconfirmed',
                'Sankhya aceitou o pedido sem devolver o código; a próxima tentativa confere antes de reenviar.',
                ['retryable' => true, 'uncertain' => true]
            );
        }
        return self::failure('sankhya_order_failed', 'Envio do pedido', $response);
    }

    public function find_sales_order(WC_Order $order): array|WP_Error|null
    {
        if ($this->mode !== 'live') {
            return null;
        }
        // O proxy força a empresa 102; a API direta precisa do código.
        $company = self::is_proxy() ? 102 : absint(getenv('AERION_SANKHYA_COMPANY_ID'));
        $partner = absint($order->get_meta('_aerion_sankhya_partner_code'));
        $document = (string) $order->get_meta('_aerion_sankhya_partner_document');
        if (! $company || (! $partner && $document === '')) {
            return new WP_Error(
                'sankhya_lookup_unavailable',
                'Uma tentativa anterior pode ter criado o pedido no Sankhya e não há como conferir automaticamente '
                . '(defina AERION_SANKHYA_COMPANY_ID). Confira no Sankhya antes de reprocessar.'
            );
        }
        $marker = '/' . preg_quote(Aerion_Sankhya_Mapper::order_marker($order), '/') . '(?!\d)/';
        $adField = Aerion_Sankhya_Mapper::ad_field();
        $day = wp_date('d/m/Y', Aerion_Sankhya_Mapper::order_timestamp($order));
        $payload = Aerion_Sankhya_Mapper::order($order);
        $expected = is_array($payload) ? [
            'total' => (float) ($payload['valorTotal'] ?? 0),
            'items' => self::quantities(array_map(
                static fn (array $item): array => ['code' => $item['codigoProduto'] ?? 0, 'quantity' => $item['quantidade'] ?? 0],
                (array) ($payload['itens'] ?? [])
            )),
        ] : null;
        // O proxy numera as páginas a partir de 0 e responde 404 quando nenhum pedido bate com o filtro.
        $first = self::is_proxy() ? 0 : 1;
        for ($page = $first; $page < $first + 10; $page++) {
            $response = $this->request('GET', '/v1/vendas/pedidos', null, array_filter([
                'page'                 => $page,
                'codigoEmpresa'        => $company,
                'codigoCliente'        => $partner ?: null,
                'dataNegociacaoInicio' => $day,
                'dataNegociacaoFinal'  => $day,
            ], static fn ($value): bool => $value !== null));
            if (is_wp_error($response)) {
                return $response;
            }
            if ($response['status'] === 404 && self::is_proxy()) {
                break;
            }
            if ($response['status'] !== 200) {
                return self::failure('sankhya_lookup_failed', 'Consulta de pedidos', $response);
            }
            foreach (self::records($response['body']) as $record) {
                $note = (string) ($record['observacao'] ?? '');
                $ad = $adField !== '' ? (string) ($record[$adField] ?? $record[strtoupper($adField)] ?? '') : '';
                // O proxy não devolve a observação na consulta: sem ela, o pedido
                // é reconhecido pelo cliente, pelo total e pelos itens.
                $byContent = ! array_key_exists('observacao', $record) && self::same_content($record, $partner, $document, $expected);
                if (preg_match($marker, $note) || ($ad !== '' && $ad === (string) $order->get_order_number()) || $byContent) {
                    return [
                        'remote_id' => sanitize_text_field((string) ($record['codigoNota'] ?? $record['codigoPedido'] ?? '')),
                        'status'    => 'recovered',
                    ];
                }
            }
            $more = $response['body']['possuiMaisPaginas'] ?? $response['body']['pagination']['hasMore'] ?? false;
            if (empty($more) || $more === 'false') {
                break;
            }
        }
        return null;
    }

    /**
     * NF-e (modelo 55) autorizada que o Sankhya gerou a partir do pedido do site.
     *
     * A nota aponta para o pedido por `codigoPedidoOrigem`. Só conta como
     * autorizada com chave de 44 dígitos e protocolo da SEFAZ: nota digitada e
     * ainda não transmitida existe no Sankhya sem protocolo.
     *
     * @return array{code:string,number:string,series:string,key:string,protocol:string,status:string}|null|WP_Error
     */
    public function find_invoice(WC_Order $order): array|WP_Error|null
    {
        if ($this->mode !== 'live' || ! self::supports_invoices()) {
            return null;
        }
        // O proxy força a empresa 102 e conhece o cliente só pelo documento quando o ERP não devolveu o código.
        $company = self::is_proxy() ? 102 : absint(getenv('AERION_SANKHYA_COMPANY_ID'));
        if (! $company) {
            return new WP_Error('sankhya_lookup_unavailable', 'Defina AERION_SANKHYA_COMPANY_ID para buscar as notas fiscais.');
        }
        $partner = absint($order->get_meta('_aerion_sankhya_partner_code'));
        $salesOrder = (string) $order->get_meta('_aerion_sankhya_remote_id');
        if ($salesOrder === '' || (! $partner && ! self::is_proxy())) {
            return null;
        }
        $query = array_filter([
            'codigoEmpresa'        => $company,
            'codigoCliente'        => $partner ?: null,
            'dataNegociacaoInicio' => wp_date('d/m/Y', Aerion_Sankhya_Mapper::order_timestamp($order)),
            'dataNegociacaoFinal'  => wp_date('d/m/Y'),
        ], static fn ($value): bool => $value !== null);
        $first = self::is_proxy() ? 0 : 1;
        $lookups = 0;
        for ($page = $first; $page < $first + 20; $page++) {
            $response = $this->request('GET', '/v1/vendas/nfe', null, $query + ['page' => $page]);
            if (is_wp_error($response)) {
                return $response;
            }
            if ($response['status'] === 404 && self::is_proxy()) {
                break;
            }
            if ($response['status'] !== 200) {
                return self::failure('sankhya_invoice_lookup_failed', 'Consulta de notas fiscais', $response);
            }
            foreach (self::records($response['body']) as $record) {
                // A listagem do proxy não traz o pedido de origem: ele vem só na consulta da nota.
                if (self::is_proxy() && ! array_key_exists('codigoPedidoOrigem', $record)) {
                    $record = $this->proxy_invoice_detail($record, $lookups);
                    if (is_wp_error($record)) {
                        return $record;
                    }
                }
                if ((string) ($record['codigoPedidoOrigem'] ?? '') !== $salesOrder) {
                    continue;
                }
                $key = self::digits((string) ($record['chaveNFe'] ?? ''));
                $protocol = trim((string) ($record['numeroProtocoloNFe'] ?? ''));
                if (strlen($key) !== 44 || $protocol === '') {
                    return null;
                }
                return [
                    'code'     => (string) ($record['codigoNota'] ?? ''),
                    'number'   => (string) ($record['numero'] ?? $record['numeroNota'] ?? ''),
                    'series'   => (string) ($record['serie'] ?? $record['serieNota'] ?? ''),
                    'key'      => $key,
                    'protocol' => $protocol,
                    'status'   => (string) ($record['statusNFe'] ?? ''),
                    'protocol_date' => (string) ($record['dataProtocoloNFe'] ?? ''),
                ];
            }
            $more = $response['body']['possuiMaisPaginas'] ?? $response['body']['pagination']['hasMore'] ?? false;
            if (empty($more) || $more === 'false') {
                break;
            }
        }
        return null;
    }

    /**
     * Completa uma nota da listagem do proxy com a consulta individual, que traz
     * `codigoPedidoOrigem`, o protocolo e a chave. O vínculo nota → pedido não muda,
     * então fica guardado: cada nota é consultada uma vez só. Notas autorizadas de
     * outros pedidos são a maioria; o teto por busca evita uma rajada de chamadas.
     *
     * @param array<string,mixed> $record
     * @return array<string,mixed>|WP_Error
     */
    private function proxy_invoice_detail(array $record, int &$lookups): array|WP_Error
    {
        $code = (string) ($record['codigoNota'] ?? '');
        if ($code === '') {
            return $record;
        }
        $known = get_transient('aerion_sankhya_nfe_origin_' . $code);
        if (is_array($known)) {
            return array_merge($record, $known);
        }
        if ($lookups >= 40) {
            return $record;
        }
        $lookups++;
        $response = $this->request('GET', '/v1/vendas/nfe/' . rawurlencode($code));
        if (is_wp_error($response)) {
            return $response;
        }
        if ($response['status'] === 404) {
            return $record;
        }
        if ($response['status'] !== 200) {
            return self::failure('sankhya_invoice_lookup_failed', 'Consulta da nota fiscal', $response);
        }
        $nota = $response['body']['nota'] ?? $response['body']['retorno']['nota'] ?? $response['body'];
        if (! is_array($nota) || ! isset($nota['codigoPedidoOrigem'])) {
            return $record;
        }
        $detail = array_intersect_key($nota, array_flip([
            'codigoPedidoOrigem', 'chaveNFe', 'numeroProtocoloNFe', 'dataProtocoloNFe', 'statusNFe', 'numeroNota', 'serieNota', 'numero', 'serie',
        ]));
        // Nota ainda sem protocolo pode ser autorizada depois: só o vínculo é definitivo.
        $final = strlen(self::digits((string) ($detail['chaveNFe'] ?? ''))) === 44 && trim((string) ($detail['numeroProtocoloNFe'] ?? '')) !== '';
        set_transient('aerion_sankhya_nfe_origin_' . $code, $detail, $final ? 30 * DAY_IN_SECONDS : 10 * MINUTE_IN_SECONDS);
        return array_merge($record, $detail);
    }

    /**
     * Cancela o pedido de venda. O Sankhya recusa pedido já faturado; esse caso
     * volta como `sankhya_order_invoiced`, porque pede outra providência
     * (cancelar a nota no ERP) e não uma nova tentativa.
     *
     * @return array{status:string}|WP_Error
     */
    public function cancel_sales_order(string $code, string $reason): array|WP_Error
    {
        if ($this->mode === 'disabled') {
            return self::disabled();
        }
        if ($this->mode === 'mock' || str_starts_with($code, 'MOCK-')) {
            return ['status' => 'mocked'];
        }
        $response = $this->request('POST', '/v1/vendas/pedidos/' . rawurlencode($code) . '/cancela', ['motivo' => mb_substr($reason, 0, 250)]);
        if (is_wp_error($response)) {
            return $response;
        }
        if ($response['status'] >= 200 && $response['status'] < 300) {
            return ['status' => 'cancelled'];
        }
        $error = self::failure('sankhya_cancel_failed', 'Cancelamento do pedido', $response);
        // "Faturado" primeiro: a própria recusa ("Pedidos faturados não serão
        // cancelados") contém "cancelad" e seria lida como pedido já cancelado.
        if ($response['status'] === 400 && preg_match('/fatur/iu', $error->get_error_message())) {
            return new WP_Error('sankhya_order_invoiced', $error->get_error_message(), ['http_status' => 400]);
        }
        // A API cria o pedido "a confirmar" e não cancela pedido nesse estado
        // (não há rota para confirmar): só a equipe resolve, no Sankhya.
        if ($response['status'] === 400 && preg_match('/n[aã]o\s+confirmad/iu', $error->get_error_message())) {
            return new WP_Error('sankhya_order_unconfirmed', $error->get_error_message(), ['http_status' => 400]);
        }
        if ($response['status'] === 400 && preg_match('/j[aá]\s+(est[aá]\s+)?cancelad/iu', $error->get_error_message())) {
            return ['status' => 'already_cancelled'];
        }
        return $error;
    }

    /**
     * Pedido do ERP com o mesmo cliente, total e itens do pedido do site.
     *
     * @param array<string,mixed>                                  $record
     * @param array{total:float,items:array<string,float>}|null    $expected
     */
    private static function same_content(array $record, int $partner, string $document, ?array $expected): bool
    {
        if ($expected === null || $expected['items'] === []) {
            return false;
        }
        if ($partner) {
            if (absint($record['codigoCliente'] ?? 0) !== $partner) {
                return false;
            }
        } elseif (self::digits((string) ($record['cliente']['cnpjCpf'] ?? '')) !== self::digits($document)) {
            return false;
        }
        if (abs((float) ($record['valorNota'] ?? 0) - $expected['total']) > 0.01) {
            return false;
        }
        $items = self::quantities(array_map(
            static fn (array $item): array => ['code' => $item['codProduto'] ?? $item['codigoProduto'] ?? 0, 'quantity' => $item['quantidade'] ?? 0],
            array_values(array_filter((array) ($record['itens'] ?? []), 'is_array'))
        ));
        return $items === $expected['items'];
    }

    /**
     * @param list<array{code:mixed,quantity:mixed}> $lines
     * @return array<string,float> código do produto → quantidade, em ordem fixa
     */
    private static function quantities(array $lines): array
    {
        $sum = [];
        foreach ($lines as $line) {
            $code = (string) absint($line['code']);
            $sum[$code] = ($sum[$code] ?? 0.0) + (float) $line['quantity'];
        }
        ksort($sum);
        return $sum;
    }

    /** XML da NF-e, que a API devolve em base64 no detalhe da nota. */
    public function invoice_xml(string $code): string|WP_Error
    {
        if (! self::supports_invoices()) {
            return self::invoices_unsupported();
        }
        $response = $this->request('GET', '/v1/vendas/nfe/' . rawurlencode($code));
        if (is_wp_error($response)) {
            return $response;
        }
        if ($response['status'] !== 200) {
            return self::failure('sankhya_invoice_failed', 'Consulta da NF-e', $response);
        }
        $body = $response['body'];
        $raw = trim((string) ($body['xmlNFe'] ?? $body['nota']['xmlNFe'] ?? $body['retorno']['xmlNFe'] ?? ''));
        // A API direta devolve base64; o proxy devolve o XML puro.
        $xml = str_starts_with($raw, '<') ? $raw : base64_decode($raw, true);
        if ($xml === false || ! str_contains($xml, '<')) {
            return new WP_Error('sankhya_invoice_xml_missing', 'O Sankhya não devolveu o XML da NF-e.', ['retryable' => true]);
        }
        return $xml;
    }

    /**
     * PDF do DANFE. `$code` aceita o código interno da nota ou a chave de 44 dígitos.
     * HTTP 409 significa nota ainda não autorizada.
     */
    public function invoice_danfe(string $code): string|WP_Error
    {
        if (! self::supports_invoices()) {
            return self::invoices_unsupported();
        }
        $response = $this->request('GET', '/v1/vendas/nfe/' . rawurlencode($code) . '/danfe', null, [], 'application/pdf');
        if (is_wp_error($response)) {
            return $response;
        }
        if ($response['status'] === 409) {
            return new WP_Error('sankhya_danfe_not_ready', 'NF-e ainda não autorizada para gerar o DANFE.', ['retryable' => true]);
        }
        if ($response['status'] !== 200) {
            return self::failure('sankhya_danfe_failed', 'Download do DANFE', $response);
        }
        if (! str_starts_with($response['raw'], '%PDF')) {
            return new WP_Error('sankhya_danfe_invalid', 'O Sankhya devolveu um DANFE que não é PDF.', ['retryable' => true]);
        }
        return $response['raw'];
    }

    /**
     * Saldo de estoque de todos os produtos com movimentação.
     *
     * @return list<array<string,mixed>>|WP_Error
     */
    public function stock_rows(): array|WP_Error
    {
        if ($this->mode !== 'live') {
            return new WP_Error('sankhya_not_live', 'A sincronização de estoque exige o modo live.');
        }
        return $this->paginate('/v1/estoque/produtos', [], 'Consulta de estoque');
    }

    /**
     * Cadastro de produtos, opcionalmente só os alterados desde uma data ("d/m/Y H:i").
     *
     * @return list<array<string,mixed>>|WP_Error
     */
    public function products(string $modifiedSince = ''): array|WP_Error
    {
        if ($this->mode !== 'live') {
            return new WP_Error('sankhya_not_live', 'A consulta de produtos exige o modo live.');
        }
        return $this->paginate('/v1/produtos', $modifiedSince !== '' ? ['modifiedSince' => $modifiedSince] : [], 'Consulta de produtos');
    }

    public function health(): array|WP_Error
    {
        if ($this->mode === 'disabled') {
            return ['mode' => 'disabled', 'ready' => false];
        }
        if ($this->mode === 'mock') {
            return ['mode' => 'mock', 'ready' => true];
        }
        if (self::is_proxy()) {
            return $this->proxy_health();
        }
        $token = $this->access_token();
        return is_wp_error($token)
            ? $token
            : ['mode' => 'live', 'ready' => true, 'authenticated' => true, 'base_url' => $this->baseUrl];
    }

    /**
     * /health é público e só prova que o proxy está no ar; /v1/empresas exige a
     * chave e responde 401 se ela estiver errada.
     *
     * @return array<string,mixed>|WP_Error
     */
    private function proxy_health(): array|WP_Error
    {
        if ($this->baseUrl === '') {
            return new WP_Error('sankhya_credentials_missing', 'Defina AERION_SANKHYA_BASE_URL com o endereço do proxy.');
        }
        $up = wp_remote_get($this->baseUrl . '/health', ['timeout' => 10, 'redirection' => 0]);
        if (is_wp_error($up) || (int) wp_remote_retrieve_response_code($up) !== 200) {
            return new WP_Error('sankhya_unreachable', 'O proxy do Sankhya não respondeu em /health.', ['retryable' => true]);
        }
        $response = $this->request('GET', '/v1/empresas');
        if (is_wp_error($response)) {
            return $response;
        }
        if ($response['status'] !== 200) {
            return self::failure('sankhya_auth_failed', 'Autenticação no proxy', $response);
        }
        return ['mode' => 'live', 'ready' => true, 'authenticated' => true, 'proxy' => true, 'base_url' => $this->baseUrl];
    }

    private static function invoices_unsupported(): WP_Error
    {
        return new WP_Error('sankhya_invoices_unsupported', 'O proxy do Sankhya não expõe NF-e; a nota é tratada fora do site.');
    }

    /**
     * Percorre uma listagem paginada. A documentação diverge sobre a primeira
     * página (0 em produtos, 1 em pedidos); começa em 0 e, se a API recusar,
     * recomeça em 1.
     *
     * @param array<string,scalar> $query
     * @return list<array<string,mixed>>|WP_Error
     */
    private function paginate(string $path, array $query, string $action): array|WP_Error
    {
        $rows = [];
        for ($page = 0, $guard = 0; $guard < 400; $page++, $guard++) {
            $response = $this->request('GET', $path, null, $query + ['page' => $page]);
            // Leitura é segura de repetir: uma oscilação de rede numa varredura de
            // dezenas de páginas não deve jogar fora o que já foi lido.
            if (is_wp_error($response) && $response->get_error_code() === 'sankhya_unreachable') {
                $response = $this->request('GET', $path, null, $query + ['page' => $page]);
            }
            if (is_wp_error($response)) {
                return $response;
            }
            if ($page === 0 && $response['status'] === 400) {
                continue;
            }
            if ($response['status'] !== 200) {
                return self::failure('sankhya_list_failed', $action, $response);
            }
            $records = self::records($response['body']);
            array_push($rows, ...$records);
            $more = $response['body']['possuiMaisPaginas'] ?? $response['body']['temMaisRegistros'] ?? $response['body']['pagination']['hasMore'] ?? null;
            if (is_string($more)) {
                $more = filter_var($more, FILTER_VALIDATE_BOOLEAN);
            }
            // O proxy filtra cada página pela lista autorizada: página vazia com
            // hasMore=true não é o fim, só uma página sem produto da loja.
            if ($more === false || ($records === [] && ! (self::is_proxy() && $more === true)) || ($more === null && count($records) < 50)) {
                break;
            }
        }
        return $rows;
    }

    /**
     * @param array<string,mixed>|null $body
     * @param array<string,scalar>     $query
     * @return array{method:string,status:int,body:array<string,mixed>,raw:string}|WP_Error
     */
    private function request(
        string $method,
        string $path,
        ?array $body = null,
        array $query = [],
        string $accept = 'application/json',
        bool $retried = false
    ): array|WP_Error {
        $args = [
            'method'      => $method,
            'timeout'     => 25,
            'redirection' => 0,
            'headers'     => ['Accept' => $accept],
        ];
        if (self::is_proxy()) {
            if ($this->baseUrl === '') {
                return new WP_Error('sankhya_credentials_missing', 'Defina AERION_SANKHYA_BASE_URL com o endereço do proxy.');
            }
            $args['headers']['X-Partner-Key'] = (string) getenv('AERION_SANKHYA_PARTNER_KEY');
        } else {
            $token = $this->access_token($retried);
            if (is_wp_error($token)) {
                return $token;
            }
            $args['headers']['Authorization'] = 'Bearer ' . $token;
        }
        if ($body !== null) {
            $args['headers']['Content-Type'] = 'application/json';
            $args['body'] = wp_json_encode($body);
        }
        $url = $this->baseUrl . $path . ($query ? '?' . http_build_query($query) : '');
        $response = wp_remote_request($url, $args);
        if (is_wp_error($response)) {
            return new WP_Error(
                'sankhya_unreachable',
                'Sankhya não respondeu: ' . $response->get_error_message(),
                ['retryable' => true, 'uncertain' => $method !== 'GET']
            );
        }
        $status = (int) wp_remote_retrieve_response_code($response);
        // Token revogado ou expirado antes do previsto: renova uma vez. Um 401
        // significa que nada foi gravado, então repetir a escrita é seguro.
        if ($status === 401 && ! $retried && ! self::is_proxy()) {
            return $this->request($method, $path, $body, $query, $accept, true);
        }
        $raw = (string) wp_remote_retrieve_body($response);
        // Erros vêm em JSON mesmo quando o pedido era de um PDF.
        $decoded = $accept === 'application/json' || $status >= 400 ? json_decode($raw, true) : null;
        return ['method' => $method, 'status' => $status, 'body' => is_array($decoded) ? $decoded : [], 'raw' => $raw];
    }

    private function access_token(bool $refresh = false): string|WP_Error
    {
        $cacheKey = self::token_cache_key();
        if (! $refresh) {
            $cached = get_transient($cacheKey);
            if (is_string($cached) && $cached !== '') {
                return $cached;
            }
        }
        $clientId = (string) getenv('AERION_SANKHYA_CLIENT_ID');
        $clientSecret = (string) getenv('AERION_SANKHYA_CLIENT_SECRET');
        $xToken = (string) getenv('AERION_SANKHYA_X_TOKEN');
        if (! $clientId || ! $clientSecret || ! $xToken) {
            return new WP_Error('sankhya_credentials_missing', 'Credenciais Sankhya incompletas.');
        }
        $response = wp_remote_post($this->baseUrl . '/authenticate', [
            'timeout'     => 15,
            'redirection' => 0,
            'headers'     => [
                'Content-Type' => 'application/x-www-form-urlencoded',
                'Accept'       => 'application/json',
                'X-Token'      => $xToken,
            ],
            'body' => [
                'grant_type'    => 'client_credentials',
                'client_id'     => $clientId,
                'client_secret' => $clientSecret,
            ],
        ]);
        if (is_wp_error($response)) {
            return new WP_Error('sankhya_unreachable', 'Sankhya não respondeu: ' . $response->get_error_message(), ['retryable' => true]);
        }
        $status = (int) wp_remote_retrieve_response_code($response);
        $body = json_decode((string) wp_remote_retrieve_body($response), true);
        $body = is_array($body) ? $body : [];
        $token = (string) ($body['access_token'] ?? '');
        if ($status !== 200 || $token === '') {
            $detail = self::api_message($body);
            return new WP_Error(
                'sankhya_auth_failed',
                sprintf('Autenticação Sankhya retornou HTTP %d%s', $status, $detail !== '' ? ': ' . $detail : '.'),
                ['http_status' => $status, 'retryable' => $status === 429 || $status >= 500]
            );
        }
        // O token vale 5 minutos (expires_in=300). Guardá-lo além disso fazia
        // toda chamada depois do 5º minuto voltar 401.
        $ttl = max(30, (int) ($body['expires_in'] ?? 300) - 30);
        set_transient($cacheKey, $token, $ttl);
        return $token;
    }

    /**
     * @param array{method:string,status:int,body:array<string,mixed>} $response
     */
    private static function failure(string $code, string $action, array $response): WP_Error
    {
        $status = $response['status'];
        $detail = self::api_message($response['body']);
        return new WP_Error(
            $code,
            sprintf('%s: Sankhya retornou HTTP %d%s', $action, $status, $detail !== '' ? ': ' . $detail : '.'),
            [
                'http_status' => $status,
                'retryable'   => $status === 429 || $status >= 500,
                'uncertain'   => $status >= 500 && $response['method'] !== 'GET',
            ]
        );
    }

    /**
     * Mensagem legível dos dois formatos de erro da API
     * (`mensagem.message/details` e `mensagem.descricao`).
     *
     * @param array<string,mixed> $body
     */
    private static function api_message(array $body): string
    {
        $message = $body['mensagem'] ?? $body['message'] ?? $body['error_description'] ?? $body['error'] ?? $body['erro'] ?? '';
        if (is_array($message)) {
            $parts = array_filter([
                (string) ($message['message'] ?? $message['descricao'] ?? ''),
                (string) ($message['details'] ?? ''),
            ]);
            $message = implode(' — ', array_unique($parts));
        }
        return sanitize_text_field(mb_substr((string) $message, 0, 300));
    }

    /**
     * Registros de uma listagem. O nome da chave não é garantido pela
     * documentação, então aceita a própria lista ou a primeira lista de objetos.
     *
     * @param array<mixed> $body
     * @return list<array<string,mixed>>
     */
    private static function records(array $body): array
    {
        if (array_is_list($body)) {
            return array_values(array_filter($body, 'is_array'));
        }
        foreach ($body as $value) {
            if (is_array($value) && array_is_list($value) && isset($value[0]) && is_array($value[0])) {
                return $value;
            }
        }
        // O proxy devolve um objeto, não uma lista, quando o filtro acha um único registro.
        if (isset($body['nota']) && is_array($body['nota']) && ! array_is_list($body['nota'])) {
            return [$body['nota']];
        }
        return [];
    }

    private static function digits(string $value): string
    {
        return (string) preg_replace('/\D+/', '', $value);
    }

    private static function disabled(): WP_Error
    {
        return new WP_Error('sankhya_disabled', 'Integração Sankhya desativada.');
    }
}
