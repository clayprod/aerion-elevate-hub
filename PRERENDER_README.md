# Prerendering Estático - Documentação

## Visão Geral

Este projeto agora suporta **prerendering estático** para melhorar o SEO. Todas as rotas são pré-renderizadas em HTML estático durante o build, permitindo que o Google indexe todo o conteúdo sem precisar executar JavaScript.

## Como Funciona

1. **Build**: Durante o build (`npm run build`), o Vite gera os assets estáticos
2. **Prerendering**: Após o build, o script `prerender.js` executa:
   - Busca todos os posts do blog do Supabase
   - Inicia um servidor preview local
   - Usa Puppeteer para renderizar cada rota
   - Salva o HTML renderizado em arquivos estáticos
3. **Deploy**: Os HTMLs pré-renderizados são servidos pelo Nginx

## Estrutura de Arquivos Gerados

Após o prerendering, a estrutura `dist/` terá:

```
dist/
  index.html                    # Rota /
  produtos/
    index.html                   # Rota /produtos
    evo-lite-enterprise/
      index.html
    evo-max-v2/
      index.html
    ...
  blog/
    index.html                   # Rota /blog
    post-slug-1/
      index.html                 # Rota /blog/post-slug-1
    post-slug-2/
      index.html
  ...
```

## Scripts Disponíveis

- `npm run prerender` - Executa apenas o prerendering (requer build prévio)
- `npm run build` - Build completo + prerendering
- `npm run build:prod` - Build de produção + prerendering

## Regeneração Automática

Quando um novo post é publicado no blog, um webhook automaticamente dispara rebuild e deploy:

1. Admin publica post no Supabase
2. Trigger do Supabase detecta mudança
3. Webhook chama GitHub Actions ou Easypanel diretamente
4. Build completo é executado (incluindo prerendering)
5. Deploy automático acontece
6. Google indexa novo conteúdo

Veja [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) para configurar o webhook.

## Requisitos

- Node.js 20+
- Puppeteer (instalado automaticamente)
- Chromium (instalado automaticamente no Docker)

## Variáveis de Ambiente

O script de prerendering precisa das seguintes variáveis durante o build:

- `VITE_SUPABASE_URL` - URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase

Essas variáveis já estão configuradas no GitHub Secrets e Dockerfile.

## Troubleshooting

### Erro: "Diretório dist não encontrado"

Execute `vite build` antes de executar o prerendering, ou use `npm run build` que faz ambos.

### Erro: "Porta 4173 já em uso"

O servidor preview pode já estar rodando. Pare processos na porta 4173 ou aguarde alguns segundos.

### Puppeteer não encontra Chromium

No Docker, o Chromium é instalado automaticamente. Localmente, o Puppeteer baixa o Chromium na primeira execução.

### Posts do blog não aparecem no prerendering

Verifique:
- Variáveis de ambiente do Supabase estão configuradas
- Posts estão com `published = true` no Supabase
- Conexão com Supabase está funcionando

### HTMLs pré-renderizados não estão sendo servidos

Verifique:
- Nginx está configurado corretamente (veja `nginx.conf`)
- Arquivos HTML foram gerados em `dist/`
- Estrutura de pastas está correta

## Desenvolvimento Local

Para testar o prerendering localmente:

```bash
# Build
npm run build

# Os HTMLs pré-renderizados estarão em dist/
# Você pode servir com:
npx vite preview
```

## Notas Importantes

- O prerendering adiciona tempo ao processo de build (~30-60 segundos dependendo do número de rotas)
- HTMLs pré-renderizados são regenerados a cada build
- Meta tags SEO dinâmicas são incluídas nos HTMLs pré-renderizados
- O React ainda funciona normalmente após o carregamento (hydration)

## Próximos Passos

1. Configure o webhook seguindo [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md)
2. Teste publicando um novo post e verificando se o rebuild acontece automaticamente
3. Verifique no Google Search Console se o conteúdo está sendo indexado corretamente








