# 🔧 Correção do Problema dos Posts do Blog

## Problema Identificado

Os posts do blog não estão sendo carregados devido a problemas na configuração das variáveis de ambiente do Supabase.

### Evidências do Console:
- ✅ `Using real Supabase credentials` - Credenciais carregadas
- ✅ `Supabase client initialized: true` - Cliente inicializado  
- ❌ `400 (Bad Request)` - Erro na requisição
- ❌ URL incorreta: `rijzunhodxapuiomvojd.supabase.co` (deveria ser `rsacugkufrqwrgclgbgb.supabase.co`)

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

### 2. Limpar cache e reiniciar

Após fazer a alteração no arquivo `.env`:

1. **Limpe o cache do navegador** (Ctrl+Shift+R ou F12 > Application > Storage > Clear storage)
2. Pare o servidor de desenvolvimento (Ctrl+C)
3. Inicie novamente com `npm run dev` ou `bun dev`
4. **Abra uma aba anônima/privada** para testar

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
