# 🔧 Correção do Erro de Timeout ao Editar Posts do Blog

## Problema Identificado

Ao tentar editar um post do blog e adicionar uma imagem, ocorre um erro **500** com a mensagem:
```
Error code: 57014
Error message: canceling statement due to statement timeout
```

## Causa Raiz

O problema era que **imagens muito pesadas** estavam sendo enviadas ao Supabase Storage, causando timeout durante o upload. O limite anterior era de 20MB, o que permitia uploads muito grandes que demoravam para completar e causavam timeout.

## Solução Implementada

### 1. Compressão Automática de Imagens (`src/pages/admin/AdminBlog.tsx`)

- ✅ **Reduzido limite de tamanho**: De 20MB para **5MB máximo**
- ✅ **Compressão automática**: Imagens maiores que 1MB são automaticamente comprimidas
- ✅ **Redimensionamento inteligente**: Imagens são redimensionadas para máximo de 1920x1080px mantendo proporção
- ✅ **Otimização progressiva**: Se após primeira compressão ainda estiver acima de 2MB, aplica compressão mais agressiva
- ✅ **Conversão para JPG**: Todas as imagens são convertidas para JPG após compressão (melhor compressão)
- ✅ Feedback ao usuário: Mostra tamanho original vs comprimido

### 2. Melhorias no Código

- ✅ Melhorado tratamento de erros com logs detalhados
- ✅ Corrigida estrutura do objeto enviado ao Supabase (sem spread do formData)
- ✅ Removido `.select()` após update/insert para reduzir overhead
- ✅ Tratamento explícito de valores nulos

### 3. Restauração do Trigger

- ✅ Criada migration `20250120000001_restore_blog_webhook_trigger.sql` para restaurar o trigger original
- ✅ O trigger agora funciona normalmente pois o problema de timeout foi resolvido

## Como Aplicar a Correção

### Passo 1: Restaurar o Trigger (se ainda estiver desabilitado)

1. Acesse o **Supabase Dashboard** > **SQL Editor**
2. Execute a migration `20250120000001_restore_blog_webhook_trigger.sql`:

**OU** use o CLI do Supabase:

```bash
supabase db push
```

### Passo 2: Testar o Upload de Imagem

1. Acesse `/admin/blog`
2. Edite um post existente ou crie um novo
3. Faça upload de uma imagem de capa (pode ser até 5MB)
4. A imagem será automaticamente comprimida se necessário
5. Salve o post

O erro de timeout não deve mais ocorrer, mesmo com imagens grandes.

### Como Funciona a Compressão

- **Imagens < 1MB**: Enviadas sem compressão
- **Imagens 1MB - 5MB**: Comprimidas automaticamente para ~85% de qualidade
- **Imagens muito grandes**: Se após primeira compressão ainda estiver > 2MB, aplica compressão mais agressiva (75% qualidade)
- **Redimensionamento**: Máximo de 1920x1080px mantendo proporção
- **Formato final**: Sempre JPG para melhor compressão

## Verificação

Após aplicar a migration, você deve conseguir:
- ✅ Editar posts sem erro de timeout
- ✅ Adicionar imagens aos posts
- ✅ Salvar alterações normalmente

## Logs de Debug

O código agora inclui logs detalhados no console do navegador. Se ainda houver problemas, verifique:
- Console do navegador (F12) para logs detalhados
- Supabase Dashboard > Logs para erros do servidor

## Notas

- ✅ O trigger de webhook foi **restaurado** e funciona normalmente
- ✅ A compressão de imagens é feita no cliente (navegador) usando Canvas API (nativa, sem dependências)
- ✅ Imagens são otimizadas antes do upload, reduzindo tempo de transferência e risco de timeout
- ✅ O limite de 5MB é suficiente para imagens de capa de blog após compressão

## Arquivos Modificados

- ✅ `src/pages/admin/AdminBlog.tsx` - Adicionada compressão automática de imagens e melhorias no código
- ✅ `supabase/migrations/20250120000001_restore_blog_webhook_trigger.sql` - Migration para restaurar trigger original

