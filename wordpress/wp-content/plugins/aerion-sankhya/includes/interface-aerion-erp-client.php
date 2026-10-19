<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

interface Aerion_ERP_Client
{
    /**
     * Garante o cliente do pedido no ERP e devolve o código dele.
     *
     * @return array{code:int,created:bool}|WP_Error
     */
    public function upsert_customer(WC_Order $order): array|WP_Error;

    /**
     * @return array<string,mixed>|WP_Error
     */
    public function create_sales_order(WC_Order $order, string $idempotencyKey): array|WP_Error;

    /**
     * Procura no ERP um pedido já criado para este pedido do site.
     *
     * @return array<string,mixed>|null|WP_Error
     */
    public function find_sales_order(WC_Order $order): array|WP_Error|null;

    /**
     * Health check without mutating the ERP.
     *
     * @return array<string,mixed>|WP_Error
     */
    public function health(): array|WP_Error;
}
