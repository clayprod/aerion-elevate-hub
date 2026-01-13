# 🔄 Sistema de Backups Automáticos

Este documento explica como configurar e usar o sistema de backups automáticos do CMS.

## 📋 Funcionalidades

- ✅ **Backups Manuais**: Crie backups a qualquer momento via interface admin
- ✅ **Backups Automáticos Semanais**: Backups criados automaticamente toda segunda-feira
- ✅ **Restauração**: Restaure o site para qualquer backup anterior
- ✅ **Download**: Baixe backups como arquivos JSON
- ✅ **Limpeza Automática**: Backups antigos (acima de 12 semanas) são removidos automaticamente

## 🚀 Como Usar

### Acessar a Interface de Backups

1. Faça login como administrador
2. Acesse `/admin/backups` no menu lateral
3. Você verá:
   - Estatísticas de backups (total, tamanho, etc.)
   - Lista de todos os backups disponíveis
   - Opções para criar, restaurar, baixar ou excluir backups

### Criar um Backup Manual

1. Clique no botão **"Criar Backup"**
2. Informe um nome para o backup (ex: "Backup antes de atualização")
3. Opcionalmente, adicione uma descrição
4. Clique em **"Criar Backup"**

O backup será criado e incluirá dados de todas as tabelas principais:
- `blog_posts`
- `products`
- `solutions`
- `hero_media`
- `site_content`
- `site_settings`
- `custom_pages`
- `page_blocks`
- `brands`
- `product_families`
- `product_variants`

### Restaurar um Backup

⚠️ **ATENÇÃO**: Restaurar um backup irá **substituir todos os dados atuais** pelos dados do backup. Esta ação não pode ser desfeita.

1. Na lista de backups, encontre o backup desejado
2. Clique no ícone de **Upload** (↗️)
3. Confirme a restauração no diálogo
4. Aguarde a conclusão (a página será recarregada automaticamente)

### Baixar um Backup

1. Na lista de backups, clique no ícone de **Download** (⬇️)
2. O backup será baixado como um arquivo JSON
3. Você pode salvar este arquivo localmente para backup externo

### Excluir um Backup

1. Na lista de backups, clique no ícone de **Lixeira** (🗑️)
2. Confirme a exclusão no diálogo
3. O backup será permanentemente removido

## ⚙️ Configuração de Backups Automáticos

Os backups automáticos semanais podem ser configurados de duas formas:

### Opção 1: Usando pg_cron (Recomendado - Requer Plano Pro)

Se você tem um plano Pro do Supabase, pode usar pg_cron:

1. Execute a migration `20250117000001_backup_cron_setup.sql`
2. Descomente as linhas relacionadas ao pg_cron
3. O backup será criado automaticamente toda segunda-feira às 02:00 UTC

**Verificar se pg_cron está disponível:**
```sql
SELECT * FROM pg_available_extensions WHERE name = 'pg_cron';
```

**Listar jobs agendados:**
```sql
SELECT * FROM cron.job;
```

### Opção 2: Usando Serviço de Cron Externo (Gratuito)

Se você não tem acesso ao pg_cron, use um serviço externo:

1. **Criar Edge Function no Supabase:**
   - Acesse Supabase Dashboard > Edge Functions
   - Crie uma nova função chamada `weekly-backup`
   - Copie o conteúdo de `supabase/functions/weekly-backup/index.ts`

2. **Configurar Variáveis de Ambiente:**
   - No Supabase Dashboard, vá para Edge Functions > Settings
   - Adicione as seguintes secrets:
     - `SUPABASE_URL`: URL do seu projeto
     - `SUPABASE_SERVICE_ROLE_KEY`: Service role key (encontrada em Settings > API)
     - `BACKUP_SECRET`: Uma senha secreta para proteger o endpoint

3. **Configurar Serviço de Cron:**
   - Use um serviço como [cron-job.org](https://cron-job.org) ou [EasyCron](https://www.easycron.com)
   - Configure para executar toda segunda-feira às 02:00 UTC
   - URL: `https://[seu-projeto].supabase.co/functions/v1/weekly-backup`
   - Método: `POST`
   - Headers:
     - `Authorization: Bearer [SUPABASE_ANON_KEY]`
     - `X-Backup-Secret: [BACKUP_SECRET]`

**Exemplo de configuração no cron-job.org:**
```
URL: https://xxxxxxxxxxxxx.supabase.co/functions/v1/weekly-backup
Method: POST
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  X-Backup-Secret: sua-senha-secreta-aqui
Schedule: Every Monday at 02:00 UTC
```

## 📊 Tabelas Incluídas nos Backups

Os backups incluem todas as tabelas principais do CMS:

- **Conteúdo**: `blog_posts`, `custom_pages`, `page_blocks`
- **Produtos**: `products`, `product_families`, `product_variants`, `brands`
- **Soluções**: `solutions`
- **Mídia**: `hero_media`
- **Configurações**: `site_content`, `site_settings`

**Nota**: Tabelas de autenticação (`auth.users`, `profiles`, `user_roles`) não são incluídas por questões de segurança.

## 🔒 Segurança

- Apenas administradores podem criar, visualizar, restaurar ou excluir backups
- Backups são armazenados no banco de dados com Row Level Security (RLS)
- A função de restauração requer privilégios de administrador
- Backups automáticos podem ser protegidos com um secret token

## 📝 Notas Importantes

1. **Tamanho dos Backups**: Backups grandes podem levar alguns segundos para serem criados ou restaurados
2. **Limpeza Automática**: Backups não restaurados com mais de 12 semanas são automaticamente removidos
3. **Backups Restaurados**: Backups que foram restaurados são marcados e mantidos no histórico
4. **Armazenamento**: Backups são armazenados no banco de dados. Monitore o uso de espaço
5. **Teste de Restauração**: Sempre teste a restauração em um ambiente de desenvolvimento antes de usar em produção

## 🆘 Troubleshooting

### Erro: "Backup not found"
- Verifique se o ID do backup está correto
- Certifique-se de que você tem permissões de administrador

### Erro ao restaurar backup
- Verifique se todas as tabelas existem no banco de dados
- Certifique-se de que não há conflitos de constraints
- Verifique os logs do Supabase para mais detalhes

### Backups automáticos não estão sendo criados
- Verifique se o pg_cron está habilitado (plano Pro)
- Ou verifique se o serviço de cron externo está configurado corretamente
- Verifique os logs da Edge Function no Supabase Dashboard

### Backup muito grande
- Considere fazer backups apenas das tabelas essenciais
- Monitore o uso de espaço do banco de dados
- Exclua backups antigos que não são mais necessários

## 📚 Referências

- [Documentação do Supabase](https://supabase.com/docs)
- [pg_cron Documentation](https://github.com/citusdata/pg_cron)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)






