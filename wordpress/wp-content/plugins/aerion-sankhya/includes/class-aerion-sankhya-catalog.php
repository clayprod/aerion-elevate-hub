<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Estoque e cadastro de produtos vindos do Sankhya.
 *
 * O estoque reaproveita a regra da importação da planilha "SALDO EM ESTOQUE"
 * (Aerion_Inventory): mesmos SKUs controlados, mesma tradução de CODPROD e o
 * mesmo tratamento de kits. Só muda a origem do saldo.
 */
final class Aerion_Sankhya_Catalog
{
    public const STOCK_HOOK = 'aerion_sankhya_sync_stock';
    public const PRODUCTS_HOOK = 'aerion_sankhya_link_products';

    public static function boot(): void
    {
        add_action(self::STOCK_HOOK, [self::class, 'sync_stock']);
        add_action(self::PRODUCTS_HOOK, [self::class, 'link_products']);
    }

    /**
     * @return array<string,mixed>|WP_Error
     */
    public static function sync_stock(): array|WP_Error
    {
        if (Aerion_Sankhya_Sync::mode() !== 'live') {
            return new WP_Error('sankhya_not_live', 'A sincronização de estoque exige o modo live.');
        }
        if (! class_exists('Aerion_Inventory') || ! method_exists('Aerion_Inventory', 'apply_stock')) {
            return self::record('aerion_sankhya_stock_last', new WP_Error('aerion_inventory_missing', 'Módulo de estoque do Aerion Commerce indisponível.'));
        }
        $rows = (new Aerion_Sankhya_Client('live'))->stock_rows();
        if (is_wp_error($rows)) {
            return self::record('aerion_sankhya_stock_last', $rows);
        }
        $companies = self::id_list((string) get_option('aerion_sankhya_stock_companies', ''));
        $locations = self::id_list((string) get_option('aerion_sankhya_stock_locations', ''));
        $codeToSku = self::code_map();
        $whitelist = Aerion_Inventory::whitelist();
        $stock = [];
        $byLocation = [];
        $ignored = 0;
        foreach ($rows as $row) {
            if ($companies && ! in_array(absint($row['codigoEmpresa'] ?? 0), $companies, true)) {
                continue;
            }
            if ($locations && ! in_array(absint($row['codigoLocal'] ?? 0), $locations, true)) {
                continue;
            }
            $code = (string) ($row['codigoProduto'] ?? '');
            // Saldo por produto e local: o pedido sai do local que tem o produto.
            $quantity = max(0.0, (float) ($row['estoque'] ?? 0));
            $location = absint($row['codigoLocal'] ?? 0);
            if ($quantity > 0 && $location) {
                $byLocation[(string) absint($code)][(string) $location] = ($byLocation[(string) absint($code)][(string) $location] ?? 0.0) + $quantity;
            }
            $sku = $codeToSku[$code] ?? Aerion_Inventory::sku_for_code($code);
            if ($sku === '' || ! isset($whitelist[$sku])) {
                $ignored++;
                continue;
            }
            $stock[$sku] = ($stock[$sku] ?? 0) + max(0.0, (float) ($row['estoque'] ?? 0));
        }
        // apply_stock zera todo SKU ausente. Uma resposta sem nenhum produto da
        // loja (empresa errada, permissão faltando) zeraria a loja inteira.
        if (! $stock) {
            return self::record('aerion_sankhya_stock_last', new WP_Error(
                'sankhya_stock_empty',
                sprintf('O estoque do Sankhya não trouxe nenhum produto da loja (%d linha(s) recebida(s)); saldo da loja mantido.', count($rows))
            ));
        }
        update_option(Aerion_Sankhya_Mapper::STOCK_BY_LOCATION_OPTION, $byLocation, false);
        $result = Aerion_Inventory::apply_stock($stock, ['source' => 'sankhya-api', 'rows' => count($rows), 'ignored' => $ignored]);
        update_option('aerion_sankhya_stock_last', $result, false);
        return $result;
    }

    /**
     * Vincula produtos da loja ao cadastro do Sankhya e completa dados fiscais.
     *
     * Não mexe em nome, descrição nem preço: esse conteúdo é da loja. Grava o
     * código Sankhya quando falta, NCM e CEST, e o peso só em produto sem peso.
     *
     * @return array<string,mixed>|WP_Error
     */
    public static function link_products(): array|WP_Error
    {
        if (Aerion_Sankhya_Sync::mode() !== 'live') {
            return new WP_Error('sankhya_not_live', 'A consulta de produtos exige o modo live.');
        }
        $startedAt = wp_date('d/m/Y H:i');
        $rows = (new Aerion_Sankhya_Client('live'))->products((string) get_option('aerion_sankhya_products_since', ''));
        if (is_wp_error($rows)) {
            return self::record('aerion_sankhya_products_last', $rows);
        }
        $linked = 0;
        $updated = 0;
        foreach ($rows as $row) {
            $code = absint($row['codigoProduto'] ?? 0);
            $product = $code ? self::find_product($code, trim((string) ($row['referencia'] ?? ''))) : null;
            if (! $product) {
                continue;
            }
            $changed = false;
            if (! absint($product->get_meta('_aerion_sankhya_product_code'))) {
                $product->update_meta_data('_aerion_sankhya_product_code', $code);
                $linked++;
                $changed = true;
            }
            foreach (['ncm' => '_aerion_ncm', 'cest' => '_aerion_cest'] as $field => $meta) {
                $value = (string) preg_replace('/\D+/', '', (string) ($row[$field] ?? ''));
                if ($value !== '' && (string) $product->get_meta($meta) !== $value) {
                    $product->update_meta_data($meta, $value);
                    $changed = true;
                }
            }
            $weight = (float) ($row['pesoBruto'] ?? 0);
            if ($weight > 0 && (float) $product->get_weight() <= 0) {
                $product->set_weight(wc_format_decimal($weight));
                $changed = true;
            }
            if ($changed) {
                $product->save();
                $updated++;
            }
        }
        update_option('aerion_sankhya_products_since', $startedAt, false);
        $result = ['at' => current_time('mysql', true), 'received' => count($rows), 'linked' => $linked, 'updated' => $updated];
        update_option('aerion_sankhya_products_last', $result, false);
        return $result;
    }

    private static function find_product(int $code, string $reference): ?WC_Product
    {
        foreach (array_filter([$reference, (string) $code]) as $sku) {
            $id = wc_get_product_id_by_sku($sku);
            $product = $id ? wc_get_product($id) : null;
            if ($product instanceof WC_Product) {
                return $product;
            }
        }
        return null;
    }

    /**
     * Código Sankhya informado no produto → SKU, para os produtos cujo código
     * não é o próprio SKU.
     *
     * @return array<string,string>
     */
    private static function code_map(): array
    {
        global $wpdb;
        $rows = $wpdb->get_results(
            "SELECT code.meta_value AS code, sku.meta_value AS sku
             FROM {$wpdb->postmeta} code
             JOIN {$wpdb->postmeta} sku ON sku.post_id = code.post_id AND sku.meta_key = '_sku'
             WHERE code.meta_key = '_aerion_sankhya_product_code' AND code.meta_value NOT IN ('', '0') AND sku.meta_value <> ''",
            ARRAY_A
        );
        $map = [];
        foreach ((array) $rows as $row) {
            $map[(string) absint($row['code'])] = (string) $row['sku'];
        }
        return $map;
    }

    /** @return list<int> */
    private static function id_list(string $value): array
    {
        return array_values(array_filter(array_map('absint', preg_split('/[\s,;]+/', $value) ?: [])));
    }

    private static function record(string $option, WP_Error $error): WP_Error
    {
        update_option($option, ['at' => current_time('mysql', true), 'error' => $error->get_error_message()], false);
        return $error;
    }
}
