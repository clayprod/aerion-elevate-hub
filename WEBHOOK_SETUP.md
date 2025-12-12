# Configuração de Webhook para Rebuild Automático

Este documento explica como configurar o webhook do Supabase para disparar rebuild automático quando um post do blog é publicado.

## Opção 1: Edge Function do Supabase (Recomendado)

### 1. Criar Edge Function

No Supabase Dashboard:

1. Vá para **Edge Functions** > **Create a new function**
2. Nome: `trigger-deploy`
3. Cole o seguinte código:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const EASYPANEL_WEBHOOK_URL = Deno.env.get('EASYPANEL_WEBHOOK_URL') || 
  'http://3.22.177.77:3000/api/deploy/39afd64789632715720dd3009dc3f6b1ac22cffade6c57e8'

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    // Verificar se o post está publicado
    if (record.published === true) {
      console.log(`📝 Post publicado: ${record.slug}`)
      
      // Chamar webhook do Easypanel
      const response = await fetch(EASYPANEL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: 'ghcr.io/[seu-usuario]/aerion-elevate-hub:latest',
          tag: 'latest'
        })
      })
      
      if (response.ok) {
        console.log('✅ Webhook chamado com sucesso')
        return new Response(
          JSON.stringify({ success: true, message: 'Deploy triggered' }),
          { headers: { 'Content-Type': 'application/json' }, status: 200 }
        )
      } else {
        throw new Error(`Webhook failed: ${response.status}`)
      }
    }
    
    return new Response(
      JSON.stringify({ success: false, message: 'Post not published' }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('❌ Erro:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

4. Adicione a variável de ambiente `EASYPANEL_WEBHOOK_URL` nas configurações da função

### 2. Configurar Database Webhook

No Supabase Dashboard:

1. Vá para **Database** > **Webhooks**
2. Clique em **Create a new webhook**
3. Configure:
   - **Name**: `blog-post-deploy-trigger`
   - **Table**: `blog_posts`
   - **Events**: `INSERT`, `UPDATE`
   - **Type**: `HTTP Request`
   - **Method**: `POST`
   - **URL**: `https://[seu-projeto].supabase.co/functions/v1/trigger-deploy`
   - **HTTP Headers**: 
     ```
     Authorization: Bearer [seu-anon-key]
     Content-Type: application/json
     ```
   - **HTTP Request Body**: 
     ```json
     {
       "record": {
         "id": "{{ $1.id }}",
         "slug": "{{ $1.slug }}",
         "title": "{{ $1.title }}",
         "published": {{ $1.published }}
       }
     }
     ```

## Opção 2: Chamar GitHub Actions diretamente

Se preferir usar GitHub Actions ao invés de Easypanel diretamente:

### 1. Criar Personal Access Token no GitHub

1. Vá para GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Crie um token com permissão `repo` e `workflow`
3. Salve o token

### 2. Configurar Edge Function

Use o mesmo código da Opção 1, mas altere a URL para:

```typescript
const GITHUB_REPO = '[seu-usuario]/aerion-elevate-hub'
const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN')

const response = await fetch(
  `https://api.github.com/repos/${GITHUB_REPO}/dispatches`,
  {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_type: 'blog-post-published',
      client_payload: {
        slug: record.slug,
        title: record.title
      }
    })
  }
)
```

### 3. Adicionar GITHUB_TOKEN nas variáveis de ambiente da Edge Function

## Opção 3: Usar Supabase Database Webhooks (Mais Simples)

O Supabase tem suporte nativo para webhooks HTTP:

1. Vá para **Database** > **Webhooks** no Supabase Dashboard
2. Clique em **Create a new webhook**
3. Configure:
   - **Name**: `deploy-trigger`
   - **Table**: `blog_posts`
   - **Events**: `INSERT`, `UPDATE`
   - **Type**: `HTTP Request`
   - **Method**: `POST`
   - **URL**: `http://3.22.177.77:3000/api/deploy/39afd64789632715720dd3009dc3f6b1ac22cffade6c57e8`
   - **HTTP Headers**: 
     ```
     Content-Type: application/json
     ```
   - **Filter**: `published = true`

**Nota**: Esta opção pode não funcionar se o Supabase não conseguir acessar URLs internas. Use Edge Function (Opção 1) se isso acontecer.

## Testando o Webhook

1. Publique um novo post no blog via admin
2. Verifique os logs no Supabase Dashboard > Edge Functions > Logs
3. Verifique se o deploy foi disparado no GitHub Actions ou Easypanel

## Troubleshooting

### Webhook não está sendo chamado

- Verifique se o trigger está ativo no Supabase Dashboard
- Verifique os logs da Edge Function
- Confirme que `published = true` está sendo salvo corretamente

### Deploy não acontece

- Verifique se o webhook do Easypanel está correto
- Verifique se o GitHub Actions workflow está configurado corretamente
- Veja os logs do GitHub Actions para erros

### Erro de CORS ou conexão

- Edge Functions do Supabase podem ter problemas com URLs HTTP (não HTTPS)
- Considere usar um serviço intermediário ou configurar HTTPS no Easypanel

