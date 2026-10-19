<?php
/**
 * Testes do adaptador Sankhya contra respostas simuladas no formato da
 * documentação oficial (developer.sankhya.com.br).
 *
 * Nenhuma chamada sai da máquina: toda requisição HTTP é interceptada por
 * `pre_http_request` e todo e-mail por `pre_wp_mail`. Pedidos, produtos,
 * arquivos e estoque tocados pelo teste são restaurados ao final.
 *
 * Uso, a partir de wordpress/ (Git Bash: export MSYS_NO_PATHCONV=1 antes):
 *   docker exec aerion-wordpress-wordpress-1 mkdir -p /var/www/html/wp-content/aerion-tests
 *   docker cp tests/sankhya/run.php aerion-wordpress-wordpress-1:/var/www/html/wp-content/aerion-tests/sankhya-run.php
 *   docker compose run --rm -T wpcli eval-file /var/www/html/wp-content/aerion-tests/sankhya-run.php
 *
 * (Um bind mount de tests/ não funciona com o repositório no Google Drive; o
 * wpcli enxerga só o volume do WordPress. Sem declare(strict_types): o
 * eval-file executa o arquivo via eval(), onde a declaração é proibida.)
 */

if (! defined('ABSPATH')) {
    exit(1);
}

final class Aerion_Sankhya_Fake_Http
{
    /** @var list<array{method:string,path:string,url:string,body:mixed,headers:array<string,string>}> */
    public array $calls = [];

    /** @var array<string, list<mixed>> respostas enfileiradas por "MÉTODO /caminho" */
    private array $queue = [];

    public function reset(): void
    {
        $this->calls = [];
        $this->queue = [];
    }

    public function push(string $route, mixed $response): void
    {
        $this->queue[$route][] = $response;
    }

    public function handle(mixed $preempt, array $args, string $url): mixed
    {
        $method = strtoupper((string) ($args['method'] ?? 'GET'));
        $parts = wp_parse_url($url);
        $path = (string) ($parts['path'] ?? '');
        $body = $args['body'] ?? null;
        $this->calls[] = [
            'method'  => $method,
            'path'    => $path,
            'url'     => $url,
            'body'    => is_string($body) ? json_decode($body, true) : $body,
            'headers' => (array) ($args['headers'] ?? []),
        ];
        if (($parts['host'] ?? '') === 'viacep.com.br') {
            return self::json(200, [
                'cep' => '04569-011', 'logradouro' => 'Rua Quintana', 'bairro' => 'Brooklin Novo',
                'localidade' => 'São Paulo', 'uf' => 'SP', 'ibge' => '3550308',
            ]);
        }
        $route = $method . ' ' . $path;
        if (! empty($this->queue[$route])) {
            $next = array_shift($this->queue[$route]);
            return $next instanceof Closure ? $next($url) : $next;
        }
        return match ($route) {
            'POST /authenticate'          => self::json(200, ['access_token' => 'tok-' . count($this->calls), 'expires_in' => 300, 'token_type' => 'Bearer']),
            'POST /v1/parceiros/clientes' => self::json(200, ['codigoCliente' => 8115]),
            'POST /v1/vendas/pedidos'     => self::json(200, ['codigo' => 200, 'tipo' => 'SUCESSO', 'mensagem' => 'Pedido Incluído com sucesso.', 'retorno' => ['codigoPedido' => 98115]]),
            'GET /v1/vendas/pedidos'      => self::json(200, ['pedidos' => [], 'possuiMaisPaginas' => false]),
            'GET /v1/vendas/nfe'          => self::json(200, ['notas' => [], 'possuiMaisPaginas' => false]),
            'GET /v1/estoque/produtos',
            'GET /v1/produtos'            => self::json(200, []),
            default                       => self::json(404, ['statusCode' => 404, 'error' => 'rota não simulada']),
        };
    }

    public static function json(int $status, array $body): array
    {
        return self::raw($status, (string) wp_json_encode($body), 'application/json');
    }

    public static function raw(int $status, string $body, string $type): array
    {
        return [
            'headers'  => ['content-type' => $type],
            'body'     => $body,
            'response' => ['code' => $status, 'message' => ''],
            'cookies'  => [],
            'filename' => null,
        ];
    }

    public function count(string $route): int
    {
        return count(array_filter($this->calls, static fn (array $call): bool => $call['method'] . ' ' . $call['path'] === $route));
    }

    /** @return list<array<string,mixed>> */
    public function all(string $route): array
    {
        return array_values(array_filter($this->calls, static fn (array $call): bool => $call['method'] . ' ' . $call['path'] === $route));
    }

    public function last(string $route): ?array
    {
        $calls = $this->all($route);
        return $calls ? $calls[count($calls) - 1] : null;
    }
}

$passes = 0;
$failures = 0;
$check = static function (bool $ok, string $label) use (&$passes, &$failures): void {
    if ($ok) {
        $passes++;
        WP_CLI::log('  ok    ' . $label);
    } else {
        $failures++;
        WP_CLI::log('  FALHA ' . $label);
    }
};
$section = static fn (string $title) => WP_CLI::log("\n" . $title);

// --- Ambiente -----------------------------------------------------------
putenv('AERION_SANKHYA_PARTNER_KEY'); // o .env local pode trazer a chave do proxy; a suíte começa na API direta
putenv('AERION_SANKHYA_BASE_URL=https://api.sandbox.sankhya.com.br');
putenv('AERION_SANKHYA_CLIENT_ID=test-client');
putenv('AERION_SANKHYA_CLIENT_SECRET=test-secret');
putenv('AERION_SANKHYA_X_TOKEN=test-x-token');
putenv('AERION_SANKHYA_COMPANY_ID=1');
$forceLive = static fn (): string => 'live';
add_filter('aerion_sankhya_mode', $forceLive);
remove_action('woocommerce_payment_complete', [Aerion_Sankhya_Sync::class, 'queue']);
remove_action('woocommerce_order_status_processing', [Aerion_Sankhya_Sync::class, 'queue']);
// Os pedidos daqui usam preços redondos (R$ 1.000). A regra de preço da loja
// (Pix terminando em ,99) tem a suíte própria em tests/pricing.
foreach (['woocommerce_product_get_price', 'woocommerce_product_variation_get_price'] as $priceFilter) {
    remove_filter($priceFilter, [Aerion_Pricing::class, 'customer_price'], 20);
}

// Nenhum e-mail sai: o WooCommerce manda e-mail a cada mudança de status.
$mails = [];
$captureMail = static function ($short, array $atts) use (&$mails) {
    $mails[] = $atts;
    return true;
};
add_filter('pre_wp_mail', $captureMail, 10, 2);

$options = [
    'aerion_sankhya_note_model'          => 45941,
    'aerion_sankhya_seller_code'         => 0,
    'aerion_sankhya_stock_location'      => 101,
    'aerion_sankhya_payment_type_pix'    => 19,
    'aerion_sankhya_payment_type_card'   => 21,
    'aerion_sankhya_payment_type_boleto' => 22,
    'aerion_sankhya_settle_paid'         => 'yes',
    'aerion_sankhya_order_ad_field'      => 'AD_WC_ORDER_ID',
    'aerion_sankhya_stock_sync'          => 'no',
    'aerion_sankhya_stock_companies'     => '',
    'aerion_sankhya_stock_locations'     => '',
];
$snapshotOnly = [
    'aerion_sankhya_products_since', 'aerion_sankhya_products_last', 'aerion_sankhya_stock_last',
    'aerion_sankhya_invoices_last', 'aerion_sankhya_cancellations_last', 'aerion_inventory_last_import', 'aerion_inventory_has_trusted_import',
    'aerion_sankhya_stock_by_location',
];
$previousOptions = [];
foreach ($options as $name => $value) {
    $previousOptions[$name] = get_option($name, null);
    update_option($name, $value, false);
}
foreach ($snapshotOnly as $name) {
    $previousOptions[$name] = get_option($name, null);
}
delete_option('aerion_sankhya_stock_by_location'); // começa sem saldo por local; a seção 29 testa a escolha

$http = new Aerion_Sankhya_Fake_Http();
add_filter('pre_http_request', [$http, 'handle'], 10, 3);
delete_transient(Aerion_Sankhya_Client::token_cache_key());
delete_transient('aerion_sankhya_cep_04569011');

$created = ['orders' => [], 'products' => []];
$newProduct = static function (string $name, string $sku = '', ?int $code = null) use (&$created): WC_Product_Simple {
    $product = new WC_Product_Simple();
    $product->set_name($name);
    $product->set_regular_price('1000');
    $product->set_status('private');
    if ($sku !== '') {
        $product->set_sku($sku);
    }
    if ($code !== null) {
        $product->update_meta_data('_aerion_sankhya_product_code', $code);
    }
    $product->save();
    $created['products'][] = $product->get_id();
    return $product;
};
$product = $newProduct('Teste Sankhya — drone', '', 9145);

$makeOrder = static function (array $overrides = []) use ($product, &$created): WC_Order {
    $order = wc_create_order();
    $order->add_product($overrides['product'] ?? $product, 2);
    $order->set_address(array_merge([
        'first_name' => 'Ana', 'last_name' => 'Souza', 'company' => 'Drones Teste LTDA',
        'email' => 'compras@example.com', 'phone' => '+55 (11) 98765-4321',
        'address_1' => 'Rua Quintana', 'address_2' => 'Cj. 111', 'city' => 'São Paulo',
        'state' => 'SP', 'postcode' => '04569-011', 'country' => 'BR',
    ], $overrides['address'] ?? []), 'billing');
    $meta = array_merge([
        '_billing_person_type'        => 'pj',
        '_billing_document'           => '11.222.333/0001-81',
        '_billing_number'             => '887',
        '_billing_neighborhood'       => 'Brooklin Novo',
        '_billing_icms_taxpayer'      => 'contributor',
        '_billing_state_registration' => '123.456.789.110',
        '_billing_fiscal_email'       => 'nfe@example.com',
    ], $overrides['meta'] ?? []);
    foreach ($meta as $key => $value) {
        if ($value === null) {
            $order->delete_meta_data($key);
        } else {
            $order->update_meta_data($key, $value);
        }
    }
    $fee = new WC_Order_Item_Fee();
    $fee->set_name('Desconto no Pix');
    $fee->set_amount('-300');
    $fee->set_total('-300');
    $fee->set_tax_status('none');
    $order->add_item($fee);
    $shipping = new WC_Order_Item_Shipping();
    $shipping->set_method_title('Frete teste');
    $shipping->set_method_id('flat_rate');
    $shipping->set_total('50');
    $order->add_item($shipping);
    $order->set_payment_method($overrides['payment_method'] ?? 'woo-mercado-pago-pix');
    $order->set_payment_method_title('Pix');
    $order->calculate_totals(false);
    $order->set_transaction_id('MP-123456789');
    $order->set_date_paid(time());
    $order->set_status('processing');
    $order->update_meta_data('_aerion_sankhya_idempotency_key', 'test-key');
    $order->save();
    $created['orders'][] = $order->get_id();
    return $order;
};
$reload = static fn (WC_Order $order): WC_Order => wc_get_order($order->get_id());
$scheduled = static fn (WC_Order $order, int $attempt): bool =>
    (bool) as_has_scheduled_action('aerion_sankhya_push_order', [$order->get_id(), 'test-key', $attempt], 'aerion-sankhya');
$invoiceKey = str_pad('3526091122233300018155001000001234', 44, '7');
$authorizedInvoice = static fn (string $protocol = '135260000000001'): array => Aerion_Sankhya_Fake_Http::json(200, [
    'notas' => [[
        'codigoNota' => 12540, 'numero' => 1234, 'serie' => '1', 'chaveNFe' => $GLOBALS['aerionTestInvoiceKey'],
        'numeroProtocoloNFe' => $protocol, 'statusNFe' => '5', 'codigoPedidoOrigem' => 98115,
    ]],
    'possuiMaisPaginas' => false,
]);
$GLOBALS['aerionTestInvoiceKey'] = $invoiceKey;
$stockSnapshot = [];

try {
    // --- 1. Caminho feliz ------------------------------------------------
    $section('1. Pedido pago no Pix: cadastra o cliente e envia o pedido');
    $http->reset();
    $order = $makeOrder();
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $check($order->get_meta('_aerion_sankhya_remote_id') === '98115', 'código do pedido lido de retorno.codigoPedido');
    $check((int) $order->get_meta('_aerion_sankhya_partner_code') === 8115, 'código do cliente gravado no pedido');
    $check($order->get_meta('_aerion_sankhya_status') === 'created', 'status created');

    $auth = $http->last('POST /authenticate');
    $check(($auth['headers']['X-Token'] ?? '') === 'test-x-token', 'autenticação envia X-Token');
    $check(($auth['body']['grant_type'] ?? '') === 'client_credentials', 'autenticação usa client_credentials');
    $check(str_starts_with($auth['url'] ?? '', 'https://api.sandbox.sankhya.com.br/'), 'usa a URL do sandbox configurada');

    $customer = $http->last('POST /v1/parceiros/clientes')['body'] ?? [];
    $check(($customer['tipo'] ?? '') === 'PJ' && ($customer['cnpjCpf'] ?? '') === '11222333000181', 'cliente PJ com CNPJ só em dígitos');
    $check(($customer['nome'] ?? '') === 'Drones Teste LTDA' && ($customer['razao'] ?? '') === 'Drones Teste LTDA', 'nome e razão social da empresa');
    $check(($customer['ieRg'] ?? '') === '123456789110', 'inscrição estadual de contribuinte');
    $check(($customer['email'] ?? '') === 'nfe@example.com', 'e-mail fiscal da PJ');
    $check(($customer['telefoneDdd'] ?? '') === '11' && ($customer['telefoneNumero'] ?? '') === '987654321', 'telefone sem o +55, separado em DDD e número');
    $address = $customer['endereco'] ?? [];
    $check(($address['logradouro'] ?? '') === 'Rua Quintana' && ($address['numero'] ?? null) === 887, 'rua e número (inteiro) separados');
    $check(($address['bairro'] ?? '') === 'Brooklin Novo' && ($address['complemento'] ?? '') === 'Cj. 111', 'bairro e complemento');
    $check(($address['codigoIbge'] ?? '') === '3550308' && ($address['cep'] ?? '') === '04569011', 'código IBGE pelo CEP');

    $sale = $http->last('POST /v1/vendas/pedidos')['body'] ?? [];
    $check(($sale['notaModelo'] ?? 0) === 45941 && ($sale['codigoCliente'] ?? 0) === 8115, 'modelo de nota e cliente');
    $check(($sale['codigoEmpresa'] ?? 0) === 1, 'empresa do ambiente');
    $item = $sale['itens'][0] ?? [];
    $check(($item['sequencia'] ?? 0) === 1 && ($item['codigoProduto'] ?? 0) === 9145, 'item com sequência e código do produto');
    $check(($item['codigoLocalEstoque'] ?? -1) === 101 && array_key_exists('controle', $item), 'item com local de estoque e controle');
    $check((float) ($item['quantidade'] ?? 0) === 2.0 && (float) ($item['valorUnitario'] ?? 0) === 1000.0, 'quantidade e preço cheio');
    $check((float) ($item['valorDesconto'] ?? 0) === 300.0, 'desconto do Pix desceu para o item');
    $check((float) ($sale['valorFrete'] ?? 0) === 50.0 && (float) ($sale['valorTotal'] ?? 0) === 1750.0, 'frete e total do pedido');
    $computed = (float) ($sale['valorFrete'] ?? 0) + (float) ($sale['valorOutros'] ?? 0);
    foreach ((array) ($sale['itens'] ?? []) as $line) {
        $computed += (float) $line['quantidade'] * (float) $line['valorUnitario'] - (float) ($line['valorDesconto'] ?? 0);
    }
    $check(abs($computed - (float) $order->get_total()) < 0.01, 'itens + frete fecham com o valor pago');
    $financial = $sale['financeiros'][0] ?? [];
    $check(($financial['tipoPagamento'] ?? 0) === 19 && (float) ($financial['valorParcela'] ?? 0) === 1750.0, 'financeiro com tipo do Pix e valor pago');
    $check(($financial['idTransacao'] ?? '') === 'MP-123456789' && ! empty($financial['dataBaixa']), 'ID do Mercado Pago e baixa');
    $check(($sale['ad_wc_order_id'] ?? '') === (string) $order->get_order_number(), 'campo adicional com o número do pedido');
    $check(str_starts_with((string) ($sale['observacao'] ?? ''), 'Pedido site #' . $order->get_order_number()), 'observação com a marca do pedido');
    $check(! array_key_exists('chaveNfe', $sale), 'não envia campos de nota importada');

    // --- 2. Validade do token --------------------------------------------
    $section('2. Token guardado por menos que os 300s de validade');
    if (wp_using_ext_object_cache()) {
        WP_CLI::log('  pulado: cache de objetos externo não expõe o timeout do transient');
    } else {
        $ttl = (int) get_option('_transient_timeout_' . Aerion_Sankhya_Client::token_cache_key()) - time();
        $check($ttl > 200 && $ttl <= 270, sprintf('token expira em %ds', $ttl));
    }

    // --- 3. Reuso e renovação do token -----------------------------------
    $section('3. Reusa o token e renova uma vez quando o Sankhya responde 401');
    $http->reset();
    $order = $makeOrder();
    $http->push('POST /v1/vendas/pedidos', Aerion_Sankhya_Fake_Http::json(401, ['statusCode' => 401, 'error' => 'Unauthorized']));
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $check($http->count('POST /authenticate') === 1, 'autenticou só para renovar depois do 401');
    $check($http->count('POST /v1/vendas/pedidos') === 2, 'repetiu o envio uma vez');
    $check($order->get_meta('_aerion_sankhya_remote_id') === '98115', 'pedido criado depois da renovação');

    // --- 4. Endereço legado ----------------------------------------------
    $section('4. Pedido antigo com "Rua, número" numa linha e sem bairro');
    $http->reset();
    $order = $makeOrder(['address' => ['address_1' => 'Av. Paulista, 1578'], 'meta' => ['_billing_number' => null, '_billing_neighborhood' => null]]);
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $address = $http->last('POST /v1/parceiros/clientes')['body']['endereco'] ?? [];
    $check(($address['logradouro'] ?? '') === 'Av. Paulista' && ($address['numero'] ?? null) === 1578, 'número extraído da linha do endereço');
    $check(($address['bairro'] ?? '') === 'Brooklin Novo', 'bairro completado pelo CEP');

    // --- 5. Endereço sem número ------------------------------------------
    $section('5. Endereço sem número: para sem tentar de novo');
    $http->reset();
    $order = $makeOrder(['address' => ['address_1' => 'Rua Sem Numero'], 'meta' => ['_billing_number' => null]]);
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $check($order->get_meta('_aerion_sankhya_status') === 'error', 'status error');
    $check(str_contains((string) $order->get_meta('_aerion_sankhya_last_error'), 'número'), 'erro diz o que falta');
    $check($http->count('POST /v1/parceiros/clientes') === 0 && $http->count('POST /v1/vendas/pedidos') === 0, 'nada foi enviado ao Sankhya');
    $check(! $scheduled($order, 2), 'nenhuma nova tentativa agendada');

    // --- 6. Timeout no envio e recuperação sem duplicar ------------------
    $section('6. Timeout no envio: a tentativa seguinte acha o pedido em vez de duplicar');
    $http->reset();
    $order = $makeOrder();
    $http->push('POST /v1/vendas/pedidos', new WP_Error('http_request_failed', 'cURL error 28: Operation timed out'));
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $check($order->get_meta('_aerion_sankhya_uncertain') === 'yes', 'resultado marcado como incerto');
    $check($scheduled($order, 2), 'nova tentativa agendada');
    $marker = 'Pedido site #' . $order->get_order_number();
    $http->push('GET /v1/vendas/pedidos', static fn (string $url): array => Aerion_Sankhya_Fake_Http::json(200, [
        'pedidos' => [
            ['codigoNota' => 1, 'observacao' => $marker . '9'],
            ['codigoNota' => 77001, 'observacao' => $marker . ' — entregar à tarde'],
        ],
        'possuiMaisPaginas' => false,
    ]));
    $postsBefore = $http->count('POST /v1/vendas/pedidos');
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 2);
    $order = $reload($order);
    $check($order->get_meta('_aerion_sankhya_remote_id') === '77001', 'vinculou o pedido existente (sem confundir #N com #N9)');
    $check($http->count('POST /v1/vendas/pedidos') === $postsBefore, 'não reenviou o pedido');
    $check($order->get_meta('_aerion_sankhya_uncertain') === '', 'marca de incerteza removida');
    parse_str((string) wp_parse_url($http->last('GET /v1/vendas/pedidos')['url'] ?? '', PHP_URL_QUERY), $query);
    $check(($query['codigoEmpresa'] ?? '') === '1' && ($query['codigoCliente'] ?? '') === '8115', 'consulta filtra empresa e cliente');

    // --- 7. Cliente já existente -----------------------------------------
    $section('7. CPF/CNPJ já cadastrado no Sankhya (HTTP 409)');
    $http->reset();
    $order = $makeOrder();
    $http->push('POST /v1/parceiros/clientes', Aerion_Sankhya_Fake_Http::json(409, ['codigoCliente' => 5050]));
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $check((int) $order->get_meta('_aerion_sankhya_partner_code') === 5050, 'usa o código do cliente existente');
    $check(($http->last('POST /v1/vendas/pedidos')['body']['codigoCliente'] ?? 0) === 5050, 'pedido vai para o cliente existente');

    // --- 8. Erro de validação do Sankhya ---------------------------------
    $section('8. Sankhya recusa o pedido (400): mostra o motivo e não insiste');
    $http->reset();
    $order = $makeOrder();
    $http->push('POST /v1/vendas/pedidos', Aerion_Sankhya_Fake_Http::json(400, [
        'statusCode' => 400,
        'error' => 'Bad Request',
        'mensagem' => ['code' => 'INVALID_REQUEST', 'message' => 'Informação inválida.', 'details' => 'Product [9145] does not exist.'],
    ]));
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $check(str_contains((string) $order->get_meta('_aerion_sankhya_last_error'), 'Product [9145] does not exist.'), 'erro traz o detalhe devolvido pela API');
    $check($order->get_meta('_aerion_sankhya_uncertain') === '', '400 não marca incerteza');
    $check(! $scheduled($order, 2), '400 não agenda nova tentativa');

    // --- 9. Meio de pagamento sem tipo de título ---------------------------
    $section('9. Meio de pagamento sem tipo de título configurado');
    $http->reset();
    update_option('aerion_sankhya_payment_type_card', 0, false);
    $order = $makeOrder(['payment_method' => 'woo-mercado-pago-custom']);
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $check(str_contains((string) $order->get_meta('_aerion_sankhya_last_error'), 'tipo de título'), 'erro de configuração explica o que falta');
    $check($http->count('POST /v1/vendas/pedidos') === 0, 'pedido não foi enviado');
    update_option('aerion_sankhya_payment_type_card', 21, false);

    // --- 10. NF-e autorizada ---------------------------------------------
    $section('10. NF-e autorizada: guarda DANFE e XML, muda o status e manda o e-mail com anexos');
    $http->reset();
    $order = $makeOrder();
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $mails = [];
    $http->push('GET /v1/vendas/nfe', $authorizedInvoice());
    $http->push('GET /v1/vendas/nfe/12540/danfe', Aerion_Sankhya_Fake_Http::raw(200, "%PDF-1.4\n% DANFE de teste\n", 'application/pdf'));
    $http->push('GET /v1/vendas/nfe/12540', Aerion_Sankhya_Fake_Http::json(200, [
        'codigoNota' => 12540, 'chaveNFe' => $invoiceKey,
        'xmlNFe' => base64_encode('<?xml version="1.0" encoding="UTF-8"?><nfeProc><NFe/></nfeProc>'),
    ]));
    $client = new Aerion_Sankhya_Client('live');
    $result = Aerion_Sankhya_Invoices::check($order, $client);
    $order = $reload($order);
    $check($result === true, 'nota encontrada pelo pedido de origem');
    $check($order->get_status() === Aerion_Order_Status::NOTA, 'pedido foi para "Nota fiscal emitida"');
    $check($order->get_meta('_aerion_invoice_number') === '1234' && $order->get_meta('_aerion_invoice_key') === $invoiceKey, 'número e chave gravados');
    parse_str((string) wp_parse_url($http->last('GET /v1/vendas/nfe')['url'] ?? '', PHP_URL_QUERY), $query);
    $check(($query['codigoEmpresa'] ?? '') === '1' && ($query['codigoCliente'] ?? '') === '8115' && ($query['page'] ?? '') === '1', 'consulta de notas filtra empresa e cliente');
    $pdfPath = Aerion_Order_Operations::invoice_file($order, 'pdf');
    $xmlPath = Aerion_Order_Operations::invoice_file($order, 'xml');
    $check($pdfPath !== null && str_starts_with((string) file_get_contents($pdfPath), '%PDF'), 'DANFE salvo na pasta privada');
    $check($xmlPath !== null && str_contains((string) file_get_contents($xmlPath), '<nfeProc>'), 'XML decodificado e salvo');
    $check($xmlPath !== null && basename($xmlPath) === 'NFe' . $invoiceKey . '.xml', 'XML com o nome padrão NFe{chave}.xml');
    $invoiceMails = array_values(array_filter($mails, static fn (array $mail): bool => str_contains((string) ($mail['subject'] ?? ''), 'Nota fiscal do pedido')));
    $mail = $invoiceMails[0] ?? [];
    $check(count($invoiceMails) === 1, 'um e-mail de nota fiscal disparado');
    $check(count((array) ($mail['attachments'] ?? [])) === 2, 'e-mail leva DANFE e XML anexos');
    $recipients = implode(',', (array) ($mail['to'] ?? []));
    $check(str_contains($recipients, 'compras@example.com') && str_contains($recipients, 'nfe@example.com'), 'e-mail vai ao comprador e ao e-mail fiscal');
    $check(str_contains((string) ($mail['message'] ?? ''), 'seguem anexos'), 'texto do e-mail fala dos anexos');
    $admins = get_users(['role' => 'administrator', 'number' => 1, 'fields' => 'ID']);
    wp_set_current_user((int) ($admins[0] ?? 0));
    ob_start();
    Aerion_Order_Operations::customer_details($order);
    $html = (string) ob_get_clean();
    wp_set_current_user(0);
    $check(str_contains($html, 'doc=pdf') && str_contains($html, 'doc=xml'), 'área do cliente oferece DANFE e XML');
    $check(str_contains($html, $invoiceKey), 'área do cliente mostra a chave de acesso');

    // --- 11. Nota ainda sem autorização ------------------------------------
    $section('11. Nota no Sankhya sem protocolo da SEFAZ: espera');
    $http->reset();
    $order = $makeOrder();
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $http->push('GET /v1/vendas/nfe', $authorizedInvoice(''));
    $result = Aerion_Sankhya_Invoices::check($reload($order), $client);
    $order = $reload($order);
    $check($result === false && $order->get_status() === 'processing', 'pedido segue em processando');
    $check($http->count('GET /v1/vendas/nfe/12540/danfe') === 0, 'não tenta baixar DANFE');

    // --- 12. DANFE recusado (409) ------------------------------------------
    $section('12. DANFE ainda recusado (HTTP 409): tenta no próximo ciclo sem poluir o pedido');
    $http->reset();
    $http->push('GET /v1/vendas/nfe', $authorizedInvoice());
    $http->push('GET /v1/vendas/nfe/12540/danfe', Aerion_Sankhya_Fake_Http::json(409, ['statusCode' => 409, 'error' => 'Conflict']));
    $result = Aerion_Sankhya_Invoices::check($order, $client);
    $order = $reload($order);
    $check($result === false && $order->get_status() === 'processing', 'pedido segue em processando');
    $check((string) $order->get_meta('_aerion_sankhya_invoice_error') === '', 'nenhum erro anotado');

    // --- 13. Ciclo automático ----------------------------------------------
    $section('13. Ciclo automático de notas');
    $http->reset();
    $summary = Aerion_Sankhya_Invoices::poll();
    $check(is_array($summary) && ($summary['checked'] ?? 0) >= 1, sprintf('consultou %d pedido(s) pendente(s)', is_array($summary) ? $summary['checked'] : 0));
    $check(is_array(get_option('aerion_sankhya_invoices_last')), 'resumo gravado para a tela de configurações');

    // --- 14. Estoque -------------------------------------------------------
    $section('14. Estoque pelo Sankhya: soma empresas, zera ausentes e não apaga a loja com resposta vazia');
    $candidates = [];
    // A sincronização agora cobre todo produto publicado (inclusive kits e itens fora do ERP): guarda o estado de todos.
    $presaleMeta = [];
    foreach (wc_get_products(['limit' => -1, 'status' => ['publish', 'private']]) as $existing) {
        $stockSnapshot[$existing->get_id()] = [$existing->get_manage_stock(), $existing->get_stock_quantity(), $existing->get_stock_status(), $existing->get_backorders()];
        $presaleMeta[$existing->get_id()] = $existing->get_meta('_aerion_presale', true);
    }
    foreach (array_keys(Aerion_Inventory::whitelist()) as $sku) {
        $id = wc_get_product_id_by_sku((string) $sku);
        $candidate = $id ? wc_get_product($id) : null;
        if (! $candidate) {
            continue;
        }
        $bom = $candidate->get_meta('_aerion_bom', true);
        if (count($candidates) < 2 && ctype_digit((string) $sku) && ! $candidate->is_virtual() && ! (is_array($bom) && $bom)) {
            $candidates[] = $candidate;
        }
    }
    if (count($candidates) < 2) {
        WP_CLI::log('  pulado: catálogo local sem dois produtos simples com SKU numérico');
    } else {
        [$first, $second] = $candidates;
        $http->reset();
        $http->push('GET /v1/estoque/produtos', Aerion_Sankhya_Fake_Http::json(400, ['statusCode' => 400, 'error' => 'page deve ser >= 1']));
        $http->push('GET /v1/estoque/produtos', Aerion_Sankhya_Fake_Http::json(200, [
            ['codigoProduto' => (int) $first->get_sku(), 'codigoEmpresa' => 102, 'codigoLocal' => 101, 'estoque' => 7],
            ['codigoProduto' => (int) $first->get_sku(), 'codigoEmpresa' => 100, 'codigoLocal' => 101, 'estoque' => 2],
            ['codigoProduto' => 999999991, 'codigoEmpresa' => 102, 'codigoLocal' => 101, 'estoque' => 5],
        ]));
        $result = Aerion_Sankhya_Catalog::sync_stock();
        $first = wc_get_product($first->get_id());
        $second = wc_get_product($second->get_id());
        $check(! is_wp_error($result), 'sincronização concluída');
        $check((int) $first->get_stock_quantity() === 9, 'soma o saldo das duas empresas');
        $check((int) $second->get_stock_quantity() === 0 && $second->get_stock_status() === 'outofstock' && $second->get_backorders() === 'no', 'produto sem saldo no Sankhya fica esgotado (sem encomenda)');
        $check(is_array($result) && ($result['ignored'] ?? 0) === 1, 'produto fora da loja é ignorado');
        $hubsan = wc_get_product(wc_get_product_id_by_sku('HUBSAN-MINI-7'));
        if ($hubsan) {
            $check($hubsan->get_stock_status() === 'outofstock' && ! $hubsan->is_in_stock(), 'produto sem cadastro no ERP (HUBSAN) aparece sem estoque');
            $hubsan->update_meta_data('_aerion_presale', 'yes');
            $hubsan->save();
            Aerion_Inventory::apply_stock([(string) $first->get_sku() => 9]);
            $hubsan = wc_get_product($hubsan->get_id());
            $check($hubsan->get_stock_status() === 'onbackorder' && $hubsan->get_backorders() === 'notify', 'marcado como pré-venda, vende sem estoque');
            $hubsan->update_meta_data('_aerion_presale', 'no');
            $hubsan->save();
            Aerion_Inventory::apply_stock([(string) $first->get_sku() => 9]);
            $check(wc_get_product($hubsan->get_id())->get_stock_status() === 'outofstock', 'sem a marca de pré-venda, volta a esgotado');
        }
        $kitsChecked = 0;
        foreach (wc_get_products(['limit' => -1, 'status' => 'publish']) as $kit) {
            $bom = $kit->get_meta('_aerion_bom', true);
            if (is_array($bom) && $bom && ! Aerion_Inventory::presale($kit)) {
                $kitsChecked++;
                $expected = Aerion_Inventory::kit_quantity($kit);
                $check($kit->get_stock_status() === (($expected === null || $expected > 0) ? 'instock' : 'outofstock') && $kit->get_backorders() === 'no', 'kit ' . $kit->get_sku() . ': esgotado quando falta componente, sem encomenda');
                if ($kitsChecked >= 3) {
                    break;
                }
            }
        }
        $pages = array_map(static function (array $call): string {
            parse_str((string) wp_parse_url($call['url'], PHP_URL_QUERY), $q);
            return (string) ($q['page'] ?? '');
        }, $http->all('GET /v1/estoque/produtos'));
        $check($pages === ['0', '1'], 'recomeça na página 1 quando a API recusa a página 0');

        $http->reset();
        $http->push('GET /v1/estoque/produtos', Aerion_Sankhya_Fake_Http::json(200, []));
        $result = Aerion_Sankhya_Catalog::sync_stock();
        $first = wc_get_product($first->get_id());
        $check(is_wp_error($result) && $result->get_error_code() === 'sankhya_stock_empty', 'resposta vazia vira erro');
        $check((int) $first->get_stock_quantity() === 9, 'resposta vazia não zera a loja');
    }

    // --- 15. Vínculo de produtos -------------------------------------------
    $section('15. Cadastro de produtos: vincula pela referência e completa NCM e peso');
    $http->reset();
    delete_option('aerion_sankhya_products_since');
    $plain = $newProduct('Teste Sankhya — sem código', 'TESTE-SANKHYA-REF-1');
    $http->push('GET /v1/produtos', Aerion_Sankhya_Fake_Http::json(200, ['produtos' => [
        ['codigoProduto' => 777001, 'referencia' => 'TESTE-SANKHYA-REF-1', 'ncm' => '8806.21.00', 'cest' => '', 'pesoBruto' => 2.5],
    ]]));
    $result = Aerion_Sankhya_Catalog::link_products();
    $plain = wc_get_product($plain->get_id());
    $check(is_array($result) && ($result['linked'] ?? 0) === 1, 'um produto vinculado');
    $check((int) $plain->get_meta('_aerion_sankhya_product_code') === 777001, 'código Sankhya gravado no produto');
    $check($plain->get_meta('_aerion_ncm') === '88062100' && (float) $plain->get_weight() === 2.5, 'NCM e peso completados');
    $check(! str_contains((string) ($http->last('GET /v1/produtos')['url'] ?? ''), 'modifiedSince'), 'primeira execução traz o cadastro inteiro');
    $check((string) get_option('aerion_sankhya_products_since') !== '', 'próxima execução pede só os alterados');

    // --- 16. SKU numérico como código --------------------------------------
    $section('16. Produto sem código Sankhya usa o SKU numérico');
    $numeric = $newProduct('Teste Sankhya — SKU numérico', '990000123');
    $order = wc_create_order();
    $order->add_product($numeric, 1);
    $order->update_meta_data('_aerion_sankhya_partner_code', 8115);
    $order->calculate_totals(false);
    $order->save();
    $created['orders'][] = $order->get_id();
    $payload = Aerion_Sankhya_Mapper::order($order);
    $check(is_array($payload) && ($payload['itens'][0]['codigoProduto'] ?? 0) === 990000123, 'codigoProduto = SKU');
    $check(is_array($payload) && ! isset($payload['financeiros']), 'pedido não pago vai sem financeiro');

    // --- 17. Agendamentos ----------------------------------------------------
    $section('17. Agendamentos só no modo live; estoque só quando ligado');
    Aerion_Sankhya_Jobs::reset();
    Aerion_Sankhya_Jobs::ensure();
    $has = static fn (string $hook): bool => (bool) as_has_scheduled_action($hook, [], 'aerion-sankhya');
    $check($has(Aerion_Sankhya_Invoices::HOOK) && $has(Aerion_Sankhya_Catalog::PRODUCTS_HOOK), 'busca de notas e produtos agendadas');
    $check(! $has(Aerion_Sankhya_Catalog::STOCK_HOOK), 'estoque não agendado com a opção desligada');
    update_option('aerion_sankhya_stock_sync', 'yes', false);
    Aerion_Sankhya_Jobs::reset();
    Aerion_Sankhya_Jobs::ensure();
    $check($has(Aerion_Sankhya_Catalog::STOCK_HOOK), 'estoque agendado ao ligar a opção');
    remove_filter('aerion_sankhya_mode', $forceLive);
    $forceDisabled = static fn (): string => 'disabled';
    add_filter('aerion_sankhya_mode', $forceDisabled);
    Aerion_Sankhya_Jobs::reset();
    Aerion_Sankhya_Jobs::ensure();
    $check(! $has(Aerion_Sankhya_Invoices::HOOK) && ! $has(Aerion_Sankhya_Catalog::STOCK_HOOK), 'modo desativado remove os agendamentos');
    remove_filter('aerion_sankhya_mode', $forceDisabled);
    add_filter('aerion_sankhya_mode', $forceLive);

    // --- 18. Cancelamento antes da nota ------------------------------------
    $cancelOk = Aerion_Sankhya_Fake_Http::json(200, ['codigo' => 200, 'mensagem' => 'Pedido Cancelado com sucesso.', 'retorno' => ['codigoPedido' => 98115]]);
    $invoiceList = static fn (): array => Aerion_Sankhya_Fake_Http::json(200, ['notas' => [[
        'codigoNota' => 12540, 'numero' => 1234, 'serie' => '1', 'chaveNFe' => $GLOBALS['aerionTestInvoiceKey'],
        'numeroProtocoloNFe' => '135260000000001', 'dataProtocoloNFe' => '10/09/2026 14:30:00', 'statusNFe' => '5', 'codigoPedidoOrigem' => 98115,
    ]], 'possuiMaisPaginas' => false]);
    $teamMails = static function (string $subject) use (&$mails): array {
        return array_values(array_filter($mails, static fn (array $mail): bool => str_contains((string) ($mail['subject'] ?? ''), $subject)));
    };

    $section('18. Pedido cancelado antes de faturar: cancela no Sankhya e tira o envio da fila');
    $http->reset();
    $order = $makeOrder();
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    as_schedule_single_action(time() + HOUR_IN_SECONDS, 'aerion_sankhya_push_order', [$order->get_id(), 'test-key', 3], 'aerion-sankhya');
    $order = $reload($order);
    $order->update_status('cancelled', 'Teste de cancelamento.');
    $check(! $scheduled($order, 3), 'envio que estava na fila foi removido');
    $check((bool) as_has_scheduled_action(Aerion_Sankhya_Cancellations::HOOK, [$order->get_id(), 1], 'aerion-sankhya'), 'cancelamento agendado pela mudança de status');
    $http->push('POST /v1/vendas/pedidos/98115/cancela', $cancelOk);
    Aerion_Sankhya_Cancellations::run($order->get_id(), 1);
    $order = $reload($order);
    $cancel = $http->last('POST /v1/vendas/pedidos/98115/cancela');
    $check(str_contains((string) ($cancel['body']['motivo'] ?? ''), 'Pedido cancelado no site'), 'POST /cancela com motivo');
    $check($order->get_meta('_aerion_sankhya_cancelled_at') !== '' && $order->get_meta('_aerion_sankhya_status') === 'cancelled', 'pedido marcado como cancelado no Sankhya');

    // --- 19. Estorno depois da nota ------------------------------------------
    $section('19. Estorno de pedido já faturado: não cancela o pedido, avisa a equipe e acompanha a nota');
    $http->reset();
    $order = $makeOrder();
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $http->push('GET /v1/vendas/nfe', $invoiceList());
    $http->push('GET /v1/vendas/nfe/12540/danfe', Aerion_Sankhya_Fake_Http::raw(200, "%PDF-1.4\n% DANFE\n", 'application/pdf'));
    $http->push('GET /v1/vendas/nfe/12540', Aerion_Sankhya_Fake_Http::json(200, ['codigoNota' => 12540, 'xmlNFe' => base64_encode('<nfeProc><NFe/></nfeProc>')]));
    Aerion_Sankhya_Invoices::check($reload($order), $client);
    $mails = [];
    $order = $reload($order);
    $order->update_status('refunded', 'Mercado Pago: estorno de teste.');
    Aerion_Sankhya_Cancellations::run($order->get_id(), 1);
    $order = $reload($order);
    $check($http->count('POST /v1/vendas/pedidos/98115/cancela') === 0, 'não tenta cancelar pedido faturado');
    $check($order->get_meta('_aerion_sankhya_invoice_cancel_pending') === 'yes', 'nota marcada para cancelar no ERP');
    $alert = $teamMails('Cancelar NF-e')[0] ?? [];
    $check(str_contains((string) ($alert['message'] ?? ''), $invoiceKey), 'equipe recebe e-mail com a chave');
    $check(str_contains((string) ($alert['message'] ?? ''), '11/09/2026 14:30'), 'e-mail traz o prazo (24h após a autorização)');
    $check(str_contains((string) ($alert['message'] ?? ''), 'estornado no Mercado Pago'), 'e-mail traz o motivo');
    $check(count(Aerion_Order_Operations::invoice_files($order)) === 2, 'enquanto a nota vale, DANFE e XML seguem disponíveis');

    // --- 20. Nota cancelada no ERP -------------------------------------------
    $section('20. Nota cancelada no ERP: sai da área do cliente e o pedido é cancelado');
    $http->reset();
    $http->push('GET /v1/vendas/nfe/12540/danfe', Aerion_Sankhya_Fake_Http::json(409, ['statusCode' => 409, 'error' => 'NF-e não autorizada']));
    $summary = Aerion_Sankhya_Cancellations::watch();
    $order = $reload($order);
    $check(is_array($summary) && ($summary['cancelled'] ?? 0) === 1, 'cancelamento da nota detectado');
    $check($order->get_meta('_aerion_invoice_cancelled_at') !== '' && $order->get_meta('_aerion_sankhya_invoice_cancel_pending') === '', 'nota marcada como cancelada');
    $check(Aerion_Order_Operations::invoice_files($order) === [], 'DANFE e XML fora do alcance do cliente e dos e-mails');
    $check((bool) as_has_scheduled_action(Aerion_Sankhya_Cancellations::HOOK, [$order->get_id(), 1], 'aerion-sankhya'), 'cancelamento do pedido reagendado');
    $http->push('POST /v1/vendas/pedidos/98115/cancela', $cancelOk);
    Aerion_Sankhya_Cancellations::run($order->get_id(), 1);
    $order = $reload($order);
    $check($order->get_meta('_aerion_sankhya_cancelled_at') !== '', 'pedido cancelado no Sankhya depois da nota');
    wp_set_current_user((int) ($admins[0] ?? 0));
    ob_start();
    Aerion_Order_Operations::customer_details($order);
    $html = (string) ob_get_clean();
    wp_set_current_user(0);
    $check(str_contains($html, 'cancelada'), 'página do pedido informa a nota cancelada');

    // --- 21. Sankhya faturou antes de o site saber ---------------------------
    $section('21. Sankhya recusa cancelar porque já faturou: busca a nota e avisa a equipe');
    $http->reset();
    $mails = [];
    $order = $makeOrder();
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $order->update_status('cancelled', 'Teste.');
    $http->push('POST /v1/vendas/pedidos/98115/cancela', Aerion_Sankhya_Fake_Http::json(400, [
        'statusCode' => 400, 'mensagem' => ['code' => 'INVALID_REQUEST', 'message' => 'Pedidos faturados não serão cancelados.'],
    ]));
    $http->push('GET /v1/vendas/nfe', $invoiceList());
    Aerion_Sankhya_Cancellations::run($order->get_id(), 1);
    $order = $reload($order);
    $check($order->get_meta('_aerion_sankhya_invoice_cancel_pending') === 'yes', 'nota marcada para cancelar no ERP');
    $check($order->get_meta('_aerion_invoice_key') === $invoiceKey, 'chave da nota buscada no Sankhya');
    $check(count($teamMails('Cancelar NF-e')) === 1, 'equipe avisada');
    $check(! (bool) as_has_scheduled_action(Aerion_Sankhya_Cancellations::HOOK, [$order->get_id(), 2], 'aerion-sankhya'), 'sem nova tentativa inútil');

    // --- 22. Falha temporária --------------------------------------------------
    $section('22. Falha temporária ao cancelar: tenta de novo');
    $http->reset();
    $order = $makeOrder();
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $order->update_status('cancelled', 'Teste.');
    $http->push('POST /v1/vendas/pedidos/98115/cancela', Aerion_Sankhya_Fake_Http::json(503, ['statusCode' => 503, 'error' => 'Service Unavailable']));
    Aerion_Sankhya_Cancellations::run($order->get_id(), 1);
    $order = $reload($order);
    $check((string) $order->get_meta('_aerion_sankhya_cancel_error') !== '', 'erro registrado no pedido');
    $check((bool) as_has_scheduled_action(Aerion_Sankhya_Cancellations::HOOK, [$order->get_id(), 2], 'aerion-sankhya'), 'nova tentativa agendada');

    // --- 23. Cancelamento repetido ---------------------------------------------
    $section('23. Pedido que já estava cancelado no Sankhya conta como feito');
    $http->push('POST /v1/vendas/pedidos/98115/cancela', Aerion_Sankhya_Fake_Http::json(400, [
        'statusCode' => 400, 'mensagem' => ['code' => 'INVALID_REQUEST', 'message' => 'Pedido já cancelado.'],
    ]));
    Aerion_Sankhya_Cancellations::run($order->get_id(), 2);
    $order = $reload($order);
    $check($order->get_meta('_aerion_sankhya_cancelled_at') !== '', 'pedido marcado como cancelado');

    // --- 24. Pedido que nunca chegou ao Sankhya ----------------------------------
    $section('24. Pedido cancelado antes de chegar ao Sankhya: nada a cancelar, nada a enviar');
    $http->reset();
    $order = $makeOrder();
    $order->update_status('cancelled', 'Teste.');
    $check(! (bool) as_has_scheduled_action(Aerion_Sankhya_Cancellations::HOOK, [$order->get_id(), 1], 'aerion-sankhya'), 'nenhum cancelamento agendado');
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $check($http->count('POST /v1/vendas/pedidos') === 0 && $http->count('POST /v1/parceiros/clientes') === 0, 'envio ao Sankhya não acontece para pedido cancelado');

    // --- 25. Reembolso parcial ----------------------------------------------------
    $section('25. Reembolso parcial: o pedido segue ativo e a equipe é avisada');
    $http->reset();
    $mails = [];
    $order = $makeOrder();
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    wc_create_refund(['amount' => 100, 'order_id' => $order->get_id(), 'reason' => 'Teste de reembolso parcial']);
    $order = $reload($order);
    $check($order->get_status() === 'processing', 'pedido continua em processando');
    $check($http->count('POST /v1/vendas/pedidos/98115/cancela') === 0, 'nada cancelado no Sankhya');
    $check(count($teamMails('Reembolso parcial')) === 1, 'equipe avisada para ajustar no Sankhya');

    // --- 26. Modo mock -------------------------------------------------------
    $section('26. Modo mock monta os payloads sem chamar a API');
    $http->reset();
    $forceMock = static fn (): string => 'mock';
    add_filter('aerion_sankhya_mode', $forceMock);
    $order = $makeOrder();
    Aerion_Sankhya_Sync::run($order->get_id(), 'test-key', 1);
    $order = $reload($order);
    $check($order->get_meta('_aerion_sankhya_remote_id') === 'MOCK-' . $order->get_id(), 'pedido simulado');
    $check($http->count('POST /authenticate') === 0 && $http->count('POST /v1/vendas/pedidos') === 0, 'nenhuma chamada ao Sankhya');
    remove_filter('aerion_sankhya_mode', $forceMock);

    // --- 27. Proxy do parceiro ---------------------------------------
    $section('27. Proxy: X-Partner-Key no lugar do OAuth, sem NF-e');
    $http->reset();
    putenv('AERION_SANKHYA_PARTNER_KEY=chave-de-teste');
    putenv('AERION_SANKHYA_BASE_URL=https://proxy.example.test');
    try {
        $http->push('GET /health', Aerion_Sankhya_Fake_Http::json(200, ['status' => 'ok']));
        $http->push('GET /v1/empresas', Aerion_Sankhya_Fake_Http::json(200, ['empresas' => [['codigoEmpresa' => 102]]]));
        $proxyClient = new Aerion_Sankhya_Client('live');
        $health = $proxyClient->health();
        $check(is_array($health) && ! empty($health['proxy']), 'health confirma o proxy');
        $check($http->count('POST /authenticate') === 0, 'nenhum OAuth no proxy');
        $empresas = $http->last('GET /v1/empresas');
        $check(($empresas['headers']['X-Partner-Key'] ?? '') === 'chave-de-teste', 'chave de parceiro enviada');
        $check(! isset($empresas['headers']['Authorization']), 'sem Authorization Bearer');

        $http->push('GET /health', Aerion_Sankhya_Fake_Http::json(200, ['status' => 'ok']));
        $http->push('GET /v1/empresas', Aerion_Sankhya_Fake_Http::json(401, ['erro' => 'Não autorizado']));
        $bad = $proxyClient->health();
        $check(is_wp_error($bad) && str_contains($bad->get_error_message(), 'Não autorizado'), 'chave inválida (401) mostra a mensagem do proxy');
        $check($http->count('GET /v1/empresas') === 2, '401 não é repetido');

        $http->push('POST /v1/vendas/pedidos', Aerion_Sankhya_Fake_Http::json(422, ['erro' => 'CODPROD fora da allow-list do parceiro']));
        $order = $makeOrder();
        $order->update_meta_data('_aerion_sankhya_partner_code', 8115);
        $order->save();
        $sent = $proxyClient->create_sales_order($order, 'k');
        $check(is_wp_error($sent) && str_contains($sent->get_error_message(), 'allow-list'), '422 traz o motivo do proxy');
        $check(is_wp_error($sent) && empty($sent->get_error_data()['retryable']), '422 não é reenviado');

        $http->push('POST /v1/vendas/pedidos', Aerion_Sankhya_Fake_Http::json(502, ['erro' => 'falha no ERP']));
        $transient = $proxyClient->create_sales_order($order, 'k');
        $check(is_wp_error($transient) && ! empty($transient->get_error_data()['retryable']) && ! empty($transient->get_error_data()['uncertain']), '502 é transitório e incerto (confere antes de reenviar)');

        $http->push('POST /v1/parceiros/clientes', Aerion_Sankhya_Fake_Http::json(409, ['statusCode' => 409, 'error' => ['code' => 'CONFLICT', 'message' => 'Item já cadastrado!']]));
        $dupe = $proxyClient->upsert_customer($order);
        $check(is_array($dupe) && $dupe['code'] === 0 && ! empty($dupe['document']), '409 sem código no proxy: segue pelo CPF/CNPJ');
        $byDocument = $makeOrder();
        $byDocument->update_meta_data('_aerion_sankhya_partner_document', '11222333000181');
        $byDocument->save();
        $documentPayload = Aerion_Sankhya_Mapper::order($byDocument);
        $check(is_array($documentPayload) && ($documentPayload['cliente']['cnpjCpf'] ?? '') === '11222333000181' && ! isset($documentPayload['codigoCliente']), 'pedido leva o CPF/CNPJ no lugar do código do cliente');

        $http->push('POST /v1/vendas/pedidos/777/cancela', Aerion_Sankhya_Fake_Http::json(400, ['statusCode' => 400, 'error' => ['code' => 'BAD_REQUEST', 'details' => 'Não é possivel cancelar Pedido não confirmado!']]));
        $unconfirmed = $proxyClient->cancel_sales_order('777', 'teste');
        $check(is_wp_error($unconfirmed) && $unconfirmed->get_error_code() === 'sankhya_order_unconfirmed', 'pedido "a confirmar" não é cancelável pela API: erro próprio');

        // O proxy não devolve a observação: o pedido é reencontrado por cliente, total e itens.
        $payload = Aerion_Sankhya_Mapper::order($order);
        $record = [
            'codigoNota' => 52928, 'codigoCliente' => 8115, 'valorNota' => $payload['valorTotal'],
            'itens' => array_map(static fn (array $i): array => ['codProduto' => $i['codigoProduto'], 'quantidade' => $i['quantidade']], $payload['itens']),
        ];
        $http->push('GET /v1/vendas/pedidos', Aerion_Sankhya_Fake_Http::json(200, ['pedido' => [$record], 'pagination' => ['hasMore' => 'false']]));
        $found = $proxyClient->find_sales_order($order);
        $check(is_array($found) && ($found['remote_id'] ?? '') === '52928', 'pedido reencontrado sem observação (cliente + total + itens)');
        $record['valorNota'] += 5;
        $http->push('GET /v1/vendas/pedidos', Aerion_Sankhya_Fake_Http::json(200, ['pedido' => [$record], 'pagination' => ['hasMore' => 'false']]));
        $check($proxyClient->find_sales_order($order) === null, 'pedido de outro valor não é confundido');

        $check($proxyClient->find_invoice($order) === null, 'sem busca de NF-e no proxy');
        $danfe = $proxyClient->invoice_danfe('123');
        $check(is_wp_error($danfe) && $danfe->get_error_code() === 'sankhya_invoices_unsupported', 'DANFE não é pedido ao proxy');
        $check($http->count('GET /v1/vendas/nfe') === 0, 'nenhuma chamada a /v1/vendas/nfe');
        $poll = Aerion_Sankhya_Invoices::poll();
        $check(is_wp_error($poll) && $poll->get_error_code() === 'sankhya_invoices_unsupported', 'busca de notas explica que o proxy não tem NF-e');

        $http->push('GET /v1/estoque/produtos', Aerion_Sankhya_Fake_Http::json(200, [
            'estoque'    => [],
            'pagination' => ['page' => '0', 'total' => '2', 'hasMore' => 'true'],
        ]));
        $http->push('GET /v1/estoque/produtos', Aerion_Sankhya_Fake_Http::json(200, [
            'estoque'    => [['codigoProduto' => 2, 'estoque' => 5]],
            'pagination' => ['page' => '1', 'total' => '2', 'hasMore' => 'false'],
        ]));
        $rows = $proxyClient->stock_rows();
        $check(is_array($rows) && count($rows) === 1 && $http->count('GET /v1/estoque/produtos') === 2, 'página vazia com hasMore=true não encerra a paginação');
        $http->push('GET /v1/estoque/produtos', Aerion_Sankhya_Fake_Http::json(200, [
            'produtos'   => [['codigoProduto' => 1, 'estoque' => 3]],
            'pagination' => ['page' => '0', 'total' => '1', 'hasMore' => 'false'],
        ]));
        $rows = $proxyClient->stock_rows();
        $check(is_array($rows) && count($rows) === 1 && $http->count('GET /v1/estoque/produtos') === 3, 'paginação do proxy (hasMore como texto) termina');
    } finally {
        putenv('AERION_SANKHYA_PARTNER_KEY');
        putenv('AERION_SANKHYA_BASE_URL=https://api.sandbox.sankhya.com.br');
    }

    // --- 28. Recebimento da nota fiscal (n8n / e-mail do Sankhya) --------------
    $section('28. Endpoint de recebimento de NF-e');
    $route = '/aerion/v1/fiscal/nota';
    $call = static function (array $body, ?string $key) use ($route): WP_REST_Response|WP_Error {
        $request = new WP_REST_Request('POST', $route);
        $request->set_header('content-type', 'application/json');
        if ($key !== null) {
            $request->set_header('X-Aerion-Key', $key);
        }
        $request->set_body(wp_json_encode($body));
        $response = rest_do_request($request);
        return $response->is_error() ? $response->as_error() : $response;
    };
    $status = static fn (WP_REST_Response|WP_Error $r): int => $r instanceof WP_Error ? (int) ($r->get_error_data()['status'] ?? 0) : $r->get_status();
    $invoiceOrder = $makeOrder();
    $invoiceOrder->update_meta_data('_aerion_sankhya_remote_id', '88001');
    $invoiceOrder->save();
    $newKey = str_pad('3526', 44, '5');
    $payload = ['pedido' => '88001', 'chave' => $newKey, 'numero' => '321', 'serie' => '1', 'pdf_base64' => base64_encode('%PDF-1.4 teste'), 'xml_base64' => base64_encode('<NFe/>')];

    $check($status($call($payload, 'qualquer')) === 404, 'sem chave configurada o recebimento fica desligado');
    putenv('AERION_INVOICE_WEBHOOK_KEY=segredo-de-teste');
    $check($status($call($payload, 'errada')) === 401, 'chave errada é recusada');
    $check($status($call($payload, null)) === 401, 'sem chave é recusado');
    $check($status($call(['pedido' => '88001', 'chave' => '123', 'pdf_base64' => $payload['pdf_base64']], 'segredo-de-teste')) === 400, 'chave de acesso com menos de 44 dígitos é recusada');
    $check($status($call(['pedido' => '88001', 'chave' => $newKey, 'pdf_base64' => base64_encode('texto')], 'segredo-de-teste')) === 400, 'arquivo que não é PDF é recusado');
    $check($status($call(['pedido' => '99999999', 'chave' => $newKey, 'pdf_base64' => $payload['pdf_base64']], 'segredo-de-teste')) === 404, 'pedido desconhecido não recebe nota');

    $mailsBefore = count($mails);
    $ok = $call($payload, 'segredo-de-teste');
    $check($status($ok) === 200 && ($ok instanceof WP_REST_Response) && ($ok->get_data()['status'] ?? '') === 'attached', 'nota recebida e vinculada ao pedido');
    $invoiceOrder = $reload($invoiceOrder);
    $check($invoiceOrder->get_meta('_aerion_invoice_key') === $newKey && $invoiceOrder->get_meta('_aerion_invoice_number') === '321', 'chave e número gravados');
    $check(is_file((string) $invoiceOrder->get_meta('_aerion_invoice_private_path')) && is_file((string) $invoiceOrder->get_meta('_aerion_invoice_xml_path')), 'DANFE e XML gravados na pasta privada');
    $check($invoiceOrder->get_status() === 'aerion-nf', 'pedido passa a "Nota fiscal emitida"');
    $check(count($mails) > $mailsBefore, 'e-mail ao cliente disparado pela mudança de status');
    $again = $call($payload, 'segredo-de-teste');
    $check($again instanceof WP_REST_Response && ($again->get_data()['status'] ?? '') === 'already', 'mesma nota de novo não duplica');
    $other = $call(['pedido' => '88001', 'chave' => str_pad('3526', 44, '9'), 'pdf_base64' => $payload['pdf_base64']], 'segredo-de-teste');
    $check($status($other) === 409, 'outra nota para o mesmo pedido é recusada');
    $bySite = $makeOrder();
    $bySite = $call(['pedido_site' => (string) $bySite->get_id(), 'chave' => str_pad('3526', 44, '3'), 'pdf_base64' => $payload['pdf_base64']], 'segredo-de-teste');
    $check($bySite instanceof WP_REST_Response && $status($bySite) === 200, 'também aceita o número do pedido da loja');
    putenv('AERION_INVOICE_WEBHOOK_KEY');

    // --- 30. Avisos à equipe -----------------------------------------------------
    $section('30. Avisos por e-mail à equipe');
    $http->reset();
    $failing = $makeOrder(['address' => ['address_1' => 'Rua Sem Numero'], 'meta' => ['_billing_number' => null]]);
    $before = count($teamMails('não entrou no Sankhya'));
    Aerion_Sankhya_Sync::run($failing->get_id(), 'test-key', 1);
    $alerts = $teamMails('não entrou no Sankhya');
    $check(count($alerts) === $before + 1, 'falha definitiva no envio ao Sankhya avisa a equipe');
    $check(str_contains((string) (end($alerts)['message'] ?? ''), 'número'), 'o aviso traz o motivo');
    Aerion_Sankhya_Sync::run($failing->get_id(), 'test-key', 1);
    $check(count($teamMails('não entrou no Sankhya')) === $before + 1, 'o mesmo erro não é avisado duas vezes');

    $retry = $makeOrder();
    $http->push('POST /v1/parceiros/clientes', Aerion_Sankhya_Fake_Http::json(503, ['mensagem' => 'indisponível']));
    $beforeRetry = count($teamMails('não entrou no Sankhya'));
    Aerion_Sankhya_Sync::run($retry->get_id(), 'test-key', 1);
    $check(count($teamMails('não entrou no Sankhya')) === $beforeRetry, 'falha transitória (vai tentar de novo) não avisa ainda');

    $refunded = $makeOrder();
    $beforeRefund = count($teamMails('reembolsado'));
    $refunded->update_status('refunded', 'Teste.');
    $check(count($teamMails('reembolsado')) === $beforeRefund + 1, 'reembolso avisa a equipe');
    $held = $makeOrder();
    $beforeHold = count($teamMails('voltou para "Aguardando"'));
    $held->update_status('on-hold', 'Teste.');
    $check(count($teamMails('voltou para "Aguardando"')) === $beforeHold + 1, 'pedido pago que volta para aguardando (mediação) avisa a equipe');
    $fresh = $makeOrder();
    $fresh->set_status('pending');
    $fresh->save();
    $beforeFresh = count($teamMails('voltou para "Aguardando"'));
    $fresh->update_status('on-hold', 'Teste.');
    $check(count($teamMails('voltou para "Aguardando"')) === $beforeFresh, 'pedido que ainda não tinha sido pago não gera aviso');

    // --- 31. NF-e pelo proxy (quando ele expuser as rotas) -----------------------
    $section('31. Proxy com rotas de NF-e: DANFE sem XML basta');
    $http->reset();
    putenv('AERION_SANKHYA_PARTNER_KEY=chave-de-teste');
    putenv('AERION_SANKHYA_BASE_URL=https://proxy.example.test');
    try {
        $proxyOrder = $makeOrder();
        $proxyOrder->update_meta_data('_aerion_sankhya_remote_id', '66001');
        $proxyOrder->save();
        $proxyKey = str_pad('3526', 44, '4');
        $check(! Aerion_Sankhya_Client::supports_invoices(), 'sem a liberação, o proxy segue sem busca de NF-e');
        putenv('AERION_SANKHYA_PROXY_INVOICES=1');
        $check(Aerion_Sankhya_Client::supports_invoices(), 'liberada por AERION_SANKHYA_PROXY_INVOICES=1');
        $http->push('GET /v1/vendas/nfe', Aerion_Sankhya_Fake_Http::json(200, [
            'notas' => [['codigoNota' => 91001, 'numero' => 4321, 'serie' => '1', 'chaveNFe' => $proxyKey, 'numeroProtocoloNFe' => '135260000000009', 'codigoPedidoOrigem' => 66001]],
            'pagination' => ['page' => '0', 'total' => '1', 'hasMore' => 'false'],
        ]));
        $http->push('GET /v1/vendas/nfe/91001/danfe', Aerion_Sankhya_Fake_Http::raw(200, '%PDF-1.4 proxy', 'application/pdf'));
        $found = Aerion_Sankhya_Invoices::check($proxyOrder, new Aerion_Sankhya_Client('live'));
        $proxyOrder = $reload($proxyOrder);
        $nfeCall = $http->last('GET /v1/vendas/nfe');
        $check($found === true, 'nota encontrada pelo pedido de origem, sem código do cliente');
        $check(($nfeCall['url'] ?? '') !== '' && str_contains((string) $nfeCall['url'], 'page=0'), 'páginas do proxy começam em 0');
        $check($proxyOrder->get_meta('_aerion_invoice_key') === $proxyKey && is_file((string) $proxyOrder->get_meta('_aerion_invoice_private_path')), 'DANFE gravado e chave registrada');
        $check((string) $proxyOrder->get_meta('_aerion_invoice_xml_path') === '', 'sem XML: segue só com o DANFE');
        $check($proxyOrder->get_status() === 'aerion-nf', 'pedido passa a "Nota fiscal emitida"');
        $check(! isset(($http->last('GET /v1/vendas/nfe')['headers'] ?? [])['Authorization']), 'chamada pelo proxy não leva Bearer');

        // Proxy v3: a listagem não traz o pedido de origem; ele vem na consulta de cada nota.
        $http->reset();
        delete_transient('aerion_sankhya_nfe_origin_91101');
        delete_transient('aerion_sankhya_nfe_origin_91102');
        $v3Order = $makeOrder();
        $v3Order->update_meta_data('_aerion_sankhya_remote_id', '66002');
        $v3Order->save();
        $v3Key = str_pad('3526', 44, '7');
        $http->push('GET /v1/vendas/nfe', Aerion_Sankhya_Fake_Http::json(200, [
            'notas' => [
                ['codigoNota' => 91101, 'numeroNota' => '10', 'serieNota' => '1', 'chaveNFe' => str_pad('3526', 44, '1'), 'statusNFe' => 1, 'valorNota' => '10.00'],
                ['codigoNota' => 91102, 'numeroNota' => '11', 'serieNota' => '1', 'chaveNFe' => $v3Key, 'statusNFe' => 1, 'valorNota' => '20.00'],
            ],
            'pagination' => ['page' => '0', 'total' => '2', 'hasMore' => 'false'],
        ]));
        $http->push('GET /v1/vendas/nfe/91101', Aerion_Sankhya_Fake_Http::json(200, ['nota' => ['codigoNota' => '91101', 'codigoPedidoOrigem' => '66000', 'chaveNFe' => str_pad('3526', 44, '1'), 'numeroProtocoloNFe' => '135260000000100', 'statusNFe' => 1]]));
        $http->push('GET /v1/vendas/nfe/91102', Aerion_Sankhya_Fake_Http::json(200, ['nota' => ['codigoNota' => '91102', 'codigoPedidoOrigem' => '66002', 'chaveNFe' => $v3Key, 'numeroProtocoloNFe' => '135260000000101', 'statusNFe' => 1, 'numeroNota' => '11', 'serieNota' => '1']]));
        $http->push('GET /v1/vendas/nfe/91102/danfe', Aerion_Sankhya_Fake_Http::raw(200, '%PDF-1.4 v3', 'application/pdf'));
        $found = Aerion_Sankhya_Invoices::check($v3Order, new Aerion_Sankhya_Client('live'));
        $v3Order = $reload($v3Order);
        $check($found === true && $v3Order->get_meta('_aerion_invoice_key') === $v3Key, 'v3: nota ligada ao pedido pela consulta individual (codigoPedidoOrigem)');
        $check($http->count('GET /v1/vendas/nfe/91101') === 1 && $http->count('GET /v1/vendas/nfe/91102') >= 1, 'v3: consulta cada nota da listagem uma vez');
        $http->reset();
        $v3Xml = Aerion_Sankhya_Fake_Http::json(200, ['nota' => ['codigoNota' => '91102', 'xmlNFe' => base64_encode('<nfeProc><NFe/></nfeProc>')]]);
        $http->push('GET /v1/vendas/nfe/91102', $v3Xml);
        $check(str_contains((string) (new Aerion_Sankhya_Client('live'))->invoice_xml('91102'), '<nfeProc>'), 'v3: XML vem dentro de "nota"');
        $http->reset();
        $http->push('GET /v1/vendas/nfe/91102', Aerion_Sankhya_Fake_Http::json(200, ['nota' => ['xmlNFe' => '<NFe xmlns="x"><infNFe/></NFe>']]));
        $check(str_contains((string) (new Aerion_Sankhya_Client('live'))->invoice_xml('91102'), '<infNFe/>'), 'v3: XML puro (sem base64) também é aceito');
        $http->reset();
        $other = $makeOrder();
        $other->update_meta_data('_aerion_sankhya_remote_id', '66003');
        $other->save();
        $http->push('GET /v1/vendas/nfe', Aerion_Sankhya_Fake_Http::json(200, [
            'notas' => [['codigoNota' => 91101, 'chaveNFe' => str_pad('3526', 44, '1'), 'statusNFe' => 1]],
            'pagination' => ['page' => '0', 'total' => '1', 'hasMore' => 'false'],
        ]));
        Aerion_Sankhya_Invoices::check($other, new Aerion_Sankhya_Client('live'));
        $check($http->count('GET /v1/vendas/nfe/91101') === 0, 'v3: vínculo já conhecido não é consultado de novo');
        delete_transient('aerion_sankhya_nfe_origin_91101');
        delete_transient('aerion_sankhya_nfe_origin_91102');
    } finally {
        putenv('AERION_SANKHYA_PROXY_INVOICES');
        putenv('AERION_SANKHYA_PARTNER_KEY');
        putenv('AERION_SANKHYA_BASE_URL=https://api.sandbox.sankhya.com.br');
    }

    // --- 32. Intervalo e horário da busca de notas -----------------------------------
    $section('32. Busca de notas: a cada 2 horas, só em horário comercial');
    $previousInterval = get_option(Aerion_Sankhya_Jobs::INVOICE_INTERVAL_OPTION, null);
    delete_option(Aerion_Sankhya_Jobs::INVOICE_INTERVAL_OPTION);
    $check(Aerion_Sankhya_Jobs::invoice_interval() === 7200, 'padrão: 2 horas');
    update_option(Aerion_Sankhya_Jobs::INVOICE_INTERVAL_OPTION, 30, false);
    $check(Aerion_Sankhya_Jobs::invoice_interval() === 1800, 'respeita o valor configurado (30 min)');
    update_option(Aerion_Sankhya_Jobs::INVOICE_INTERVAL_OPTION, 1, false);
    $check(Aerion_Sankhya_Jobs::invoice_interval() === 600, 'não aceita menos de 10 minutos');
    update_option(Aerion_Sankhya_Jobs::INVOICE_INTERVAL_OPTION, 99999, false);
    $check(Aerion_Sankhya_Jobs::invoice_interval() === 86400, 'não aceita mais de 24 horas');
    if ($previousInterval === null) {
        delete_option(Aerion_Sankhya_Jobs::INVOICE_INTERVAL_OPTION);
    } else {
        update_option(Aerion_Sankhya_Jobs::INVOICE_INTERVAL_OPTION, $previousInterval, false);
    }
    $previousStockInterval = get_option(Aerion_Sankhya_Jobs::STOCK_INTERVAL_OPTION, null);
    delete_option(Aerion_Sankhya_Jobs::STOCK_INTERVAL_OPTION);
    $check(Aerion_Sankhya_Jobs::stock_interval() === 3600, 'estoque: padrão de 1 hora');
    update_option(Aerion_Sankhya_Jobs::STOCK_INTERVAL_OPTION, 5, false);
    $check(Aerion_Sankhya_Jobs::stock_interval() === 600, 'estoque: não aceita menos de 10 minutos');
    if ($previousStockInterval === null) {
        delete_option(Aerion_Sankhya_Jobs::STOCK_INTERVAL_OPTION);
    } else {
        update_option(Aerion_Sankhya_Jobs::STOCK_INTERVAL_OPTION, $previousStockInterval, false);
    }
    $at = static fn (string $local): int => (new DateTimeImmutable($local, wp_timezone()))->getTimestamp();
    $check(Aerion_Sankhya_Jobs::business_hours($at('2026-10-21 10:00')) === true, 'quarta 10h: horário comercial');
    $check(Aerion_Sankhya_Jobs::business_hours($at('2026-10-19 08:00')) === true, 'segunda 8h: já conta');
    $check(Aerion_Sankhya_Jobs::business_hours($at('2026-10-21 17:59')) === true, 'quarta 17h59: ainda conta');
    $check(Aerion_Sankhya_Jobs::business_hours($at('2026-10-21 18:00')) === false, 'quarta 18h: fora');
    $check(Aerion_Sankhya_Jobs::business_hours($at('2026-10-21 07:59')) === false, 'quarta 7h59: fora');
    $check(Aerion_Sankhya_Jobs::business_hours($at('2026-10-24 10:00')) === false, 'sábado: fora');
    $check(Aerion_Sankhya_Jobs::business_hours($at('2026-10-25 10:00')) === false, 'domingo: fora');
    $http->reset();
    $offHours = static fn (): bool => false;
    add_filter('aerion_sankhya_business_hours', $offHours);
    Aerion_Sankhya_Invoices::scheduled();
    $check($http->count('GET /v1/vendas/nfe') === 0 && ! $http->calls, 'fora do horário, a execução agendada não consulta o ERP');
    remove_filter('aerion_sankhya_business_hours', $offHours);

    // --- 33. Tela do Pix: conferência rápida do pagamento -------------------------
    $section('33. Tela do Pix confere o pagamento sem esperar');
    $pixOrder = $makeOrder();
    $consulta = new ReflectionMethod('Aerion_Pix_Experience', 'consulta');
    $consulta->setAccessible(true);
    $script = (string) $consulta->invoke(null, $pixOrder);
    $check(str_contains($script, 'mp_pix_payment_status'), 'consulta o mesmo endpoint do plugin do Mercado Pago (que pergunta à API do Mercado Pago)');
    $check(str_contains($script, (string) $pixOrder->get_order_key()) && str_contains($script, 'nonce'), 'envia a chave do pedido e o nonce');
    $check(str_contains($script, 'setTimeout(tick,1500)'), 'primeira conferência em 1,5 segundo (antes eram 20)');
    $check(str_contains($script, '120?3000'), 'nos primeiros 2 minutos confere a cada 3 segundos');
    $check(str_contains($script, 'window.location.reload()'), 'recarrega a tela quando aprova');
    $check(! wp_script_is('wc_mercadopago_pix_pooling', 'registered'), 'o script lento do plugin do Mercado Pago não é mais registrado');

    // --- 34. Mensagem de recusa por segurança do Mercado Pago -------------------------
    $section('34. Recusa do antifraude não pode dizer "banco emissor do cartão"');
    $original = '<strong>For safety reasons, your payment was declined</strong><br>We recommended paying with your usual payment method and device for online purchases.';
    $wrong = '<b>O banco emissor do cartão recusou o pagamento</b><br>Recomendamos que você pague com o meio de pagamento e dispositivo que costuma usar para compras on-line.';
    $fixed = apply_filters('gettext_woocommerce-mercadopago', $wrong, $original);
    $check(! str_contains($fixed, 'banco emissor') && str_contains($fixed, 'Não foi possível concluir o pagamento'), 'recusa por segurança não menciona banco emissor');
    $check(str_contains($fixed, 'comercial@aerion.com.br'), 'orienta falar com o comercial');
    $other = apply_filters('gettext_woocommerce-mercadopago', 'Seu banco precisa autorizar', '<strong>Your bank needs you to authorize the payment</strong>');
    $check($other === 'Seu banco precisa autorizar', 'outras mensagens do plugin ficam como estão');

    // --- 29. Local de estoque por saldo ------------------------------------------
    $section('29. Cada item sai do local que tem saldo');
    $previousMap = get_option(Aerion_Sankhya_Mapper::STOCK_BY_LOCATION_OPTION, null);
    update_option(Aerion_Sankhya_Mapper::STOCK_BY_LOCATION_OPTION, [
        '500' => ['10050000' => 2.0, '11030000' => 9.0],
        '501' => ['10030000' => 1.0, '11030000' => 1.0],
        '502' => ['10030000' => 3.0],
    ], false);
    $check(Aerion_Sankhya_Mapper::stock_location(500, 2.0, 101) === 11030000, 'entre locais que cobrem a quantidade, vence o de maior saldo');
    $check(Aerion_Sankhya_Mapper::stock_location(500, 5.0, 101) === 11030000, 'só um local cobre a quantidade: usa esse');
    $check(Aerion_Sankhya_Mapper::stock_location(502, 10.0, 101) === 10030000, 'nenhum cobre: usa o de maior saldo');
    $check(Aerion_Sankhya_Mapper::stock_location(999, 1.0, 101) === 101, 'produto sem saldo conhecido: local padrão');
    if ($previousMap === null) {
        delete_option(Aerion_Sankhya_Mapper::STOCK_BY_LOCATION_OPTION);
    } else {
        update_option(Aerion_Sankhya_Mapper::STOCK_BY_LOCATION_OPTION, $previousMap, false);
    }
} catch (Throwable $error) {
    $failures++;
    WP_CLI::log('  FALHA exceção: ' . $error->getMessage() . ' em ' . $error->getFile() . ':' . $error->getLine());
} finally {
    $privateRoot = defined('AERION_PRIVATE_DIR') ? AERION_PRIVATE_DIR : WP_CONTENT_DIR . '/aerion-private';
    foreach ($created['orders'] as $orderId) {
        for ($attempt = 1; $attempt <= 5; $attempt++) {
            as_unschedule_all_actions('aerion_sankhya_push_order', [$orderId, 'test-key', $attempt], 'aerion-sankhya');
            as_unschedule_all_actions(Aerion_Sankhya_Cancellations::HOOK, [$orderId, $attempt], 'aerion-sankhya');
        }
        $directory = trailingslashit($privateRoot) . 'orders/' . $orderId;
        if (is_dir($directory)) {
            array_map('unlink', glob($directory . '/*') ?: []);
            rmdir($directory);
        }
        $testOrder = wc_get_order($orderId);
        if ($testOrder) {
            $testOrder->delete(true);
        }
    }
    foreach ($created['products'] as $productId) {
        $testProduct = wc_get_product($productId);
        if ($testProduct) {
            $testProduct->delete(true);
        }
    }
    foreach ($stockSnapshot as $productId => [$manage, $quantity, $status, $backorders]) {
        $restored = wc_get_product($productId);
        if ($restored) {
            $restored->set_manage_stock($manage);
            $restored->set_stock_quantity($quantity);
            $restored->set_backorders($backorders);
            $restored->set_stock_status($status);
            $restored->update_meta_data('_aerion_presale', $presaleMeta[$productId] ?? '');
            $restored->save();
        }
    }
    foreach ([Aerion_Sankhya_Invoices::HOOK, Aerion_Sankhya_Catalog::STOCK_HOOK, Aerion_Sankhya_Catalog::PRODUCTS_HOOK] as $hook) {
        as_unschedule_all_actions($hook, [], 'aerion-sankhya');
    }
    Aerion_Sankhya_Jobs::reset();
    foreach ($previousOptions as $name => $value) {
        if ($value === null) {
            delete_option($name);
        } else {
            update_option($name, $value, false);
        }
    }
    delete_transient(Aerion_Sankhya_Client::token_cache_key());
    remove_filter('pre_http_request', [$http, 'handle'], 10);
    remove_filter('pre_wp_mail', $captureMail, 10);
}

WP_CLI::log(sprintf("\n%d verificações, %d falhas.", $passes + $failures, $failures));
if ($failures > 0) {
    WP_CLI::halt(1);
}
