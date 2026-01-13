# Sistema de Override de Páginas Estáticas via CMS

## Visão Geral

O sistema permite que **qualquer página estática** (exceto blog e admin) possa ser editada dinamicamente via CMS, sobrescrevendo o conteúdo estático original.

## Como Funciona

### 1. Sistema de Verificação em Camadas

Quando uma rota estática é acessada:

1. **StaticPageWrapper** verifica se existe uma página customizada publicada no banco com o mesmo `path`
2. Se existir → renderiza **DynamicPage** (conteúdo do CMS)
3. Se não existir → renderiza o componente estático original

### 2. Páginas que Podem ser Sobrescritas

Todas as páginas estáticas podem ter versões customizadas via CMS:

- `/` (Home)
- `/produtos` e todas as subpáginas de produtos
- `/solucoes` e todas as subpáginas de soluções
- `/sobre`
- `/contato`
- `/politica-privacidade`
- `/termos-uso`

### 3. Páginas que NÃO Podem ser Sobrescritas

- `/blog` e `/blog/*` - Tem sistema próprio de gerenciamento
- `/admin/*` - Área administrativa protegida
- `/auth` - Página de autenticação

## Como Usar

### Criar Override de Página Estática

1. Acesse `/admin/pages`
2. Clique em "Nova Página"
3. Preencha:
   - **Título**: Ex: "Sobre Nós"
   - **Path**: Use o mesmo path da página estática (ex: `/sobre`)
   - **Conteúdo**: Edite o conteúdo usando o editor rico
   - **SEO**: Configure metadados
4. Publique a página

### Resultado

- Quando alguém acessar `/sobre`, verá o conteúdo do CMS ao invés do componente estático
- O componente estático `Sobre.tsx` só será usado se não houver página customizada
- A página customizada será pré-renderizada e incluída no sitemap

## Prerender e Webhook

- **Prerender**: Páginas customizadas que sobrescrevem estáticas são incluídas no prerender
- **Sitemap**: Aparecem no sitemap.xml automaticamente
- **Webhook**: Criar/atualizar página customizada dispara rebuild automático

## Vantagens

1. **Flexibilidade**: Admin pode editar qualquer página sem hardcoding
2. **Backward Compatible**: Se não houver override, usa componente estático original
3. **SEO**: Páginas customizadas são pré-renderizadas e indexadas
4. **Performance**: Cache de queries e prerender garantem performance

## Exemplo Prático

### Antes (Hardcoded)
```tsx
// src/pages/Sobre.tsx - conteúdo fixo
const Sobre = () => {
  return <div>Conteúdo estático...</div>
}
```

### Depois (CMS Override)
1. Admin cria página no CMS com path `/sobre`
2. Sistema verifica: existe página customizada? Sim!
3. Renderiza conteúdo do CMS ao invés do componente estático
4. Se admin despublicar ou deletar, volta a usar componente estático

## Migração de Conteúdo

Para migrar conteúdo de páginas estáticas para o CMS:

1. Copie o conteúdo HTML da página estática
2. Crie nova página no CMS com o mesmo path
3. Cole o conteúdo no editor rico
4. Publique
5. A página estática agora é sobrescrita pelo CMS

## Notas Técnicas

- O `StaticPageWrapper` usa React Query com cache de 5 minutos
- Verificação é feita client-side (não bloqueia renderização inicial)
- Se houver erro na busca, fallback para componente estático
- Paths devem seguir validação (não podem ser rotas protegidas)








