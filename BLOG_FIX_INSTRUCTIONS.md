# 🔧 Correção do Problema dos Posts do Blog

## Problema Identificado

Os posts do blog não estão sendo carregados devido a um problema na configuração das variáveis de ambiente do Supabase.

## Solução

### 1. Corrigir o arquivo `.env`

O arquivo `.env` está usando `VITE_SUPABASE_PUBLISHABLE_KEY` mas o código espera `VITE_SUPABASE_ANON_KEY`.

**Altere esta linha no arquivo `.env`:**
```bash
# ❌ Incorreto (linha atual)
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ✅ Correto (substitua por esta)
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Reiniciar o servidor de desenvolvimento

Após fazer a alteração no arquivo `.env`:

1. Pare o servidor de desenvolvimento (Ctrl+C)
2. Inicie novamente com `npm run dev` ou `bun dev`

### 3. Verificar a correção

1. Acesse a página `/blog`
2. Você verá um painel de debug no canto inferior direito
3. O painel deve mostrar:
   - ✅ Status: Connected
   - Total posts: [número de posts]
   - Published posts: [número de posts publicados]

### 4. Remover o componente de debug (opcional)

Após confirmar que está funcionando, você pode remover o componente de debug:

1. Remova a linha `import DebugSupabase from "@/components/DebugSupabase";` do arquivo `src/pages/Blog.tsx`
2. Remova a linha `<DebugSupabase />` do JSX
3. Delete o arquivo `src/components/DebugSupabase.tsx`

## Arquivos Modificados

- ✅ `src/pages/Blog.tsx` - Adicionado tratamento de erro e logs de debug
- ✅ `src/components/DebugSupabase.tsx` - Componente temporário para debug

## Verificação Final

Após aplicar a correção, os posts do blog devem carregar normalmente na página `/blog`.
