<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Tarefas periódicas do Sankhya e seus gatilhos manuais (admin e WP-CLI).
 *
 * O Sankhya não tem webhook: nota emitida, nota cancelada e estoque só chegam
 * perguntando. Os agendamentos existem apenas no modo live e são removidos
 * fora dele.
 */
final class Aerion_Sankhya_Jobs
{
    private const GROUP = 'aerion-sankhya';
    private const CHECKED = 'aerion_sankhya_jobs_checked';
    /** Intervalos com que cada tarefa foi agendada: mudou a configuração, reagenda. */
    private const SCHEDULED = 'aerion_sankhya_jobs_intervals';
    /** Minutos entre as buscas de nota fiscal. A nota sai à mão do fiscal; não há pressa de segundos. */
    public const INVOICE_INTERVAL_OPTION = 'aerion_sankhya_invoice_interval';
    /** Minutos entre as sincronizações de estoque. */
    public const STOCK_INTERVAL_OPTION = 'aerion_sankhya_stock_interval';

    private const TASKS = [
        'health'        => 'Testar conexão',
        'invoices'      => 'Buscar notas agora',
        'cancellations' => 'Conferir notas a cancelar',
        'stock'         => 'Sincronizar estoque agora',
        'products'      => 'Vincular produtos agora',
    ];

    public static function boot(): void
    {
        add_action('init', [self::class, 'ensure'], 20);
        add_action('woocommerce_update_options_advanced_aerion_sankhya', [self::class, 'reset']);
        add_action('admin_post_aerion_sankhya_task', [self::class, 'admin_task']);
        add_action('admin_notices', [self::class, 'admin_notice']);
        if (defined('WP_CLI') && WP_CLI) {
            WP_CLI::add_command('aerion-sankhya', [self::class, 'cli']);
        }
    }

    /** Liga ou desliga os agendamentos conforme o modo; confere no máximo a cada 10 minutos. */
    public static function ensure(): void
    {
        if (! function_exists('as_schedule_recurring_action') || get_transient(self::CHECKED)) {
            return;
        }
        set_transient(self::CHECKED, 1, 10 * MINUTE_IN_SECONDS);
        $live = Aerion_Sankhya_Sync::mode() === 'live';
        $known = get_option(self::SCHEDULED, []);
        $known = is_array($known) ? $known : [];
        foreach (self::jobs() as $hook => [$interval, $enabled]) {
            $scheduled = as_has_scheduled_action($hook, [], self::GROUP);
            if ($scheduled && isset($known[$hook]) && (int) $known[$hook] !== $interval) {
                as_unschedule_all_actions($hook, [], self::GROUP);
                $scheduled = false;
            }
            if ($live && $enabled && ! $scheduled) {
                as_schedule_recurring_action(time() + MINUTE_IN_SECONDS, $interval, $hook, [], self::GROUP, true);
                $known[$hook] = $interval;
            } elseif ((! $live || ! $enabled) && $scheduled) {
                as_unschedule_all_actions($hook, [], self::GROUP);
            }
        }
        update_option(self::SCHEDULED, $known, false);
    }

    public static function reset(): void
    {
        delete_transient(self::CHECKED);
    }

    /** Segundos entre as buscas de nota: de 10 minutos a 24 horas (padrão 2 horas). */
    public static function invoice_interval(): int
    {
        return self::interval(self::INVOICE_INTERVAL_OPTION);
    }

    /** Segundos entre as sincronizações de estoque: de 10 minutos a 24 horas (padrão 1 hora, a qualquer horário). */
    public static function stock_interval(): int
    {
        return self::interval(self::STOCK_INTERVAL_OPTION, 60);
    }

    private static function interval(string $option, int $default = 120): int
    {
        $minutes = (int) get_option($option, $default);
        return max(10, min(1440, $minutes)) * MINUTE_IN_SECONDS;
    }

    /**
     * Segunda a sexta, das 8h às 18h (início inclusive, fim exclusivo), no fuso do site.
     * A nota sai à mão do fiscal; fora do expediente não há o que buscar.
     * Horários em AERION_SANKHYA_BUSINESS_START / _END (horas cheias).
     */
    public static function business_hours(?int $timestamp = null): bool
    {
        $moment = (new DateTimeImmutable('@' . ($timestamp ?? time())))->setTimezone(wp_timezone());
        $start = (int) (getenv('AERION_SANKHYA_BUSINESS_START') ?: 8);
        $end = (int) (getenv('AERION_SANKHYA_BUSINESS_END') ?: 18);
        $hour = (int) $moment->format('G');
        $weekday = (int) $moment->format('N'); // 1 = segunda ... 7 = domingo
        $open = $weekday <= 5 && $hour >= $start && $hour < $end;
        return (bool) apply_filters('aerion_sankhya_business_hours', $open, $moment);
    }

    /** @return array<string, array{0:int,1:bool}> */
    private static function jobs(): array
    {
        $invoices = Aerion_Sankhya_Client::supports_invoices();
        return [
            Aerion_Sankhya_Invoices::HOOK            => [self::invoice_interval(), $invoices],
            Aerion_Sankhya_Cancellations::WATCH_HOOK => [30 * MINUTE_IN_SECONDS, $invoices],
            Aerion_Sankhya_Catalog::STOCK_HOOK       => [self::stock_interval(), get_option('aerion_sankhya_stock_sync', 'no') === 'yes'],
            Aerion_Sankhya_Catalog::PRODUCTS_HOOK    => [DAY_IN_SECONDS, true],
        ];
    }

    /** @return list<string> Ganchos recorrentes, para quem precisa limpá-los. */
    public static function hooks(): array
    {
        return array_keys(self::jobs());
    }

    /** @return array<string,mixed>|WP_Error */
    public static function run_task(string $task): array|WP_Error
    {
        return match ($task) {
            'health'        => (new Aerion_Sankhya_Client(Aerion_Sankhya_Sync::mode()))->health(),
            'invoices'      => Aerion_Sankhya_Invoices::poll(),
            'cancellations' => Aerion_Sankhya_Cancellations::watch(),
            'stock'         => Aerion_Sankhya_Catalog::sync_stock(),
            'products'      => Aerion_Sankhya_Catalog::link_products(),
            default         => new WP_Error('aerion_sankhya_unknown_task', 'Tarefa desconhecida. Use: ' . implode(', ', array_keys(self::TASKS)) . '.'),
        };
    }

    /** Botões da tela de configurações. */
    public static function buttons_html(): string
    {
        $html = '';
        foreach (self::TASKS as $task => $label) {
            $url = wp_nonce_url(admin_url('admin-post.php?action=aerion_sankhya_task&task=' . $task), 'aerion_sankhya_task');
            $html .= '<a class="button" href="' . esc_url($url) . '">' . esc_html($label) . '</a> ';
        }
        return $html;
    }

    public static function admin_task(): void
    {
        if (! current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('Acesso negado.', 'aerion-sankhya'), '', ['response' => 403]);
        }
        check_admin_referer('aerion_sankhya_task');
        $task = sanitize_key(wp_unslash($_GET['task'] ?? ''));
        $result = self::run_task($task);
        set_transient('aerion_sankhya_notice_' . get_current_user_id(), [
            'type'    => is_wp_error($result) ? 'error' : 'success',
            'message' => is_wp_error($result) ? $result->get_error_message() : self::describe($task, $result),
        ], 5 * MINUTE_IN_SECONDS);
        wp_safe_redirect(admin_url('admin.php?page=wc-settings&tab=advanced&section=aerion_sankhya'));
        exit;
    }

    public static function admin_notice(): void
    {
        $key = 'aerion_sankhya_notice_' . get_current_user_id();
        $notice = get_transient($key);
        if (! is_array($notice)) {
            return;
        }
        delete_transient($key);
        printf(
            '<div class="notice notice-%s is-dismissible"><p><strong>Sankhya:</strong> %s</p></div>',
            ($notice['type'] ?? '') === 'error' ? 'error' : 'success',
            esc_html((string) ($notice['message'] ?? ''))
        );
    }

    /**
     * Executa uma tarefa do Sankhya.
     *
     * ## OPTIONS
     *
     * <tarefa>
     * : health, invoices, cancellations, stock ou products.
     */
    public static function cli(array $args): void
    {
        $task = (string) ($args[0] ?? 'health');
        $result = self::run_task($task);
        if (is_wp_error($result)) {
            WP_CLI::error($result->get_error_message());
        }
        WP_CLI::log((string) wp_json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        WP_CLI::success(self::describe($task, $result));
    }

    /** @param array<string,mixed> $result */
    public static function describe(string $task, array $result): string
    {
        return match ($task) {
            'health' => ! empty($result['authenticated'])
                ? sprintf('conexão OK com %s.', $result['base_url'] ?? 'o Sankhya')
                : sprintf('modo %s; nenhuma chamada ao Sankhya.', $result['mode'] ?? '?'),
            'invoices'      => sprintf('%d pedido(s) consultado(s), %d nota(s) nova(s).', $result['checked'] ?? 0, $result['found'] ?? 0),
            'cancellations' => sprintf('%d nota(s) a cancelar conferida(s), %d já cancelada(s) no ERP.', $result['checked'] ?? 0, $result['cancelled'] ?? 0),
            'stock'         => sprintf('estoque de %d produto(s) atualizado (%d linha(s) recebida(s), %d fora da loja).', $result['skus'] ?? 0, $result['rows'] ?? 0, $result['ignored'] ?? 0),
            'products'      => sprintf('%d produto(s) recebido(s), %d vinculado(s), %d atualizado(s).', $result['received'] ?? 0, $result['linked'] ?? 0, $result['updated'] ?? 0),
            default         => 'concluído.',
        };
    }

    /** @return list<string> Resumo das últimas execuções para a tela de configurações. */
    public static function status_lines(): array
    {
        $lines = [];
        $options = [
            'aerion_sankhya_invoices_last'      => ['Notas fiscais', 'invoices'],
            'aerion_sankhya_cancellations_last' => ['Notas a cancelar', 'cancellations'],
            'aerion_sankhya_stock_last'         => ['Estoque', 'stock'],
            'aerion_sankhya_products_last'      => ['Produtos', 'products'],
        ];
        foreach ($options as $option => [$label, $task]) {
            $last = get_option($option);
            if (! is_array($last)) {
                $lines[] = $label . ': ainda não executado.';
                continue;
            }
            $lines[] = sprintf(
                '%s (%s UTC): %s',
                $label,
                (string) ($last['at'] ?? '?'),
                isset($last['error']) ? 'erro: ' . $last['error'] : self::describe($task, $last)
            );
        }
        return $lines;
    }
}
