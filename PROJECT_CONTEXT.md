# PROJECT_CONTEXT.md

> **Documentação Completa do Projeto AERION Elevate Hub**  
> Este arquivo serve como referência completa para desenvolvedores e IAs entenderem o projeto, suas decisões técnicas, políticas e melhores práticas.

---

## 📋 Índice

1. [Sobre o Site](#sobre-o-site)
2. [Stack Tecnológica e Motivos das Escolhas](#stack-tecnológica-e-motivos-das-escolhas)
3. [Arquitetura e Decisões de Design](#arquitetura-e-decisões-de-design)
4. [Políticas de SEO](#políticas-de-seo)
5. [Políticas de Core Web Vitals](#políticas-de-core-web-vitals)
6. [Políticas de Usabilidade e Acessibilidade](#políticas-de-usabilidade-e-acessibilidade)
7. [Políticas de Imagens e Mídia](#políticas-de-imagens-e-mídia)
8. [Políticas de Código](#políticas-de-código)
9. [Políticas de Segurança](#políticas-de-segurança)
10. [Políticas de Deploy](#políticas-de-deploy)
11. [Design System e Brand Identity](#design-system-e-brand-identity)
12. [Guia para Melhorias Futuras](#guia-para-melhorias-futuras)

---

## 🎯 Sobre o Site

### Propósito
Site institucional e plataforma de conteúdo da **AERION Technologies**, distribuidor oficial Autel no Brasil. O site serve como vitrine digital para produtos de drones profissionais e soluções enterprise.

### Público-Alvo
- **Primário**: Empresas e profissionais que precisam de drones profissionais para operações enterprise
- **Secundário**: Profissionais de construção, topografia, inspeção industrial, segurança pública e resgate
- **Perfil**: Tomadores de decisão técnicos, gestores de operações, profissionais especializados

### Objetivos Principais
1. **Apresentar produtos Autel** de forma técnica e profissional
2. **Gerar leads qualificados** através de formulários de contato
3. **Estabelecer autoridade** no mercado brasileiro de drones profissionais
4. **Fornecer informações técnicas** detalhadas sobre produtos e soluções
5. **Manter blog** com conteúdo relevante sobre tecnologia aérea

### Tom de Voz
- **Profissional**: Linguagem técnica mas acessível
- **Confiança**: Foco em resultados e especificações técnicas
- **Enterprise**: Direcionado a operações de grande escala
- **Local**: Suporte técnico brasileiro, conteúdo em português

---

## 🚀 Stack Tecnológica e Motivos das Escolhas

### Frontend

#### React 18 + TypeScript
**Por quê?**
- **Tipagem forte**: TypeScript previne erros em tempo de desenvolvimento
- **Componentes reutilizáveis**: Arquitetura baseada em componentes facilita manutenção
- **Ecossistema maduro**: Grande comunidade, bibliotecas abundantes
- **Performance**: React 18 com Concurrent Features e Suspense
- **Developer Experience**: Hot Module Replacement, ferramentas excelentes

#### Vite
**Por quê?**
- **Build extremamente rápida**: Usa esbuild (Go) para transpilação
- **HMR instantâneo**: Hot Module Replacement sem perder estado
- **Otimizações automáticas**: Code splitting, tree shaking, minificação
- **Melhor que Create React App**: Mais rápido, configuração mais simples
- **ESM nativo**: Suporte moderno a módulos ES

#### React Router DOM v6
**Por quê?**
- **SPA routing**: Navegação sem reload de página
- **Lazy loading**: Suporte nativo para code splitting por rota
- **Type-safe**: Integração perfeita com TypeScript
- **Padrão da indústria**: Solução mais popular e estável

### UI/Design System

#### Tailwind CSS
**Por quê?**
- **Utility-first**: Desenvolvimento rápido, menos CSS customizado
- **Purge automático**: Remove CSS não usado em produção
- **Responsive fácil**: Classes mobile-first (sm:, md:, lg:)
- **Consistência**: Design tokens centralizados
- **Performance**: CSS otimizado, sem runtime overhead

#### shadcn/ui + Radix UI
**Por quê?**
- **Acessibilidade por padrão**: Componentes seguem WAI-ARIA
- **Customizável**: Código no projeto, não dependência opaca
- **Sem runtime**: Apenas componentes React, sem JavaScript adicional
- **Type-safe**: Totalmente tipado com TypeScript
- **Design system**: Componentes consistentes e profissionais

#### Lucide React
**Por quê?**
- **Leve**: Ícones SVG otimizados
- **Tree-shakeable**: Apenas ícones usados são incluídos no bundle
- **Consistente**: Estilo unificado
- **Type-safe**: Autocomplete completo no TypeScript

### Backend/Database

#### Supabase
**Por quê?**
- **PostgreSQL gerenciado**: Banco SQL real, não NoSQL
- **Auth integrado**: JWT, Row Level Security (RLS), políticas granulares
- **Storage**: Armazenamento de imagens e arquivos
- **Real-time**: Capacidades de real-time (futuro)
- **Free tier generoso**: Suficiente para começar
- **Alternativa ao Firebase**: Mais controle, SQL familiar
- **Open Source**: Pode migrar para self-hosted se necessário

### State Management

#### TanStack Query (React Query)
**Por quê?**
- **Cache inteligente**: Cache automático de dados do servidor
- **Sincronização**: Refetch automático, stale-while-revalidate
- **Menos boilerplate**: Não precisa Redux para dados do servidor
- **Otimistic updates**: Atualizações otimistas nativas
- **DevTools**: Ferramentas de debug excelentes

### Formulários

#### React Hook Form + Zod
**Por quê?**
- **Performance**: Menos re-renders (uncontrolled components)
- **Validação type-safe**: Zod schemas integrados com TypeScript
- **Menos código**: Menos boilerplate que Formik ou outros
- **Integração perfeita**: Funciona perfeitamente com shadcn/ui

### Deploy/Infraestrutura

#### Docker
**Por quê?**
- **Consistência**: Mesmo ambiente em dev, staging e produção
- **Isolamento**: Dependências isoladas, sem conflitos
- **Portabilidade**: Funciona em qualquer lugar (AWS, GCP, Azure, local)
- **Multi-stage builds**: Imagens finais leves (~50MB)

#### Nginx
**Por quê?**
- **Leve e performático**: Servidor web minimalista
- **Ideal para SPA**: Configuração simples para React Router
- **Compressão**: Gzip/Brotli nativos
- **Cache**: Headers de cache configuráveis
- **Estável**: Servidor web mais usado no mundo

#### GitHub Actions
**Por quê?**
- **Gratuito**: Para repositórios públicos e privados
- **Integrado**: Funciona diretamente com GitHub
- **Flexível**: Pipeline configurável via YAML
- **Cache**: Cache de layers Docker para builds rápidos

#### Easypanel
**Por quê?**
- **Simplicidade**: Interface visual para gerenciar containers
- **AWS**: Infraestrutura confiável e escalável
- **Webhooks**: Deploy automático via GitHub Actions
- **Custo-benefício**: Mais simples que Kubernetes, mais poderoso que Heroku

#### AWS
**Por quê?**
- **Confiável**: 99.99% de uptime
- **Escalável**: Escala conforme necessidade
- **Suporte brasileiro**: Suporte local disponível
- **Ecossistema**: Integração com outros serviços AWS se necessário

---

## 🏗️ Arquitetura e Decisões de Design

### Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── home/           # Componentes específicos da home
│   ├── products/       # Componentes de produtos
│   └── SEO/            # Componentes de SEO
├── pages/              # Páginas/rotas da aplicação
│   ├── admin/          # Páginas administrativas (lazy loaded)
│   ├── products/       # Páginas de produtos
│   └── solucoes/       # Páginas de soluções
├── integrations/       # Integrações externas
│   └── supabase/       # Cliente Supabase e tipos
├── hooks/              # Custom hooks reutilizáveis
├── lib/                # Utilitários e helpers
├── contexts/           # Contextos React (Auth, Cookies)
└── data/               # Dados estáticos (products.ts)
```

### Padrões de Código

#### Componentes Funcionais
- **Sempre usar hooks**: Evitar classes, usar functional components
- **TypeScript estrito**: Tipagem explícita, evitar `any`
- **Props tipadas**: Interfaces para todas as props
- **Componentes pequenos**: Um componente = uma responsabilidade

#### Lazy Loading
- **Rotas admin**: Todas as rotas `/admin/*` são lazy loaded
- **Componentes pesados**: Componentes grandes separados em chunks
- **Code splitting**: Vendor chunks separados (Radix, Supabase, etc)

#### Nomenclatura
- **Componentes**: PascalCase (`ProductHeader.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useProductImages.ts`)
- **Utilitários**: camelCase (`utils.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`BASE_URL`)

---

## 🔍 Políticas de SEO

### Meta Tags

#### Obrigatório em Todas as Páginas
- **Title**: Único, descritivo, < 60 caracteres
- **Description**: Resumo claro, < 160 caracteres
- **Keywords**: Relevantes ao conteúdo (opcional mas recomendado)
- **Canonical**: URL canônica para evitar duplicação

#### Open Graph e Twitter Cards
- **og:title**: Título para redes sociais
- **og:description**: Descrição para compartilhamento
- **og:image**: Imagem de preview (1200x630px recomendado)
- **og:type**: `website` ou `article` conforme contexto
- **twitter:card**: `summary_large_image`

#### Meta Robots
- **Padrão**: `index, follow` (definido em `index.html`)
- **Admin**: `noindex, nofollow` (via prop `noindex` no `SEOHead`)
- **Páginas públicas**: Sempre indexáveis

### Estrutura Semântica

#### Hierarquia de Títulos
- **h1**: Título principal da página (apenas um por página)
- **h2**: Seções principais
- **h3**: Subseções
- **h4**: Sub-subseções
- **Regra**: Nunca pular níveis (ex: h1 → h3 sem h2)

#### Breadcrumbs
- **Obrigatório**: Todas as páginas internas (exceto home)
- **Schema.org**: Dados estruturados BreadcrumbList
- **Microdata**: Atributos `itemscope`, `itemprop` no HTML
- **JSON-LD**: Dados estruturados também em JSON-LD

#### Schema.org Structured Data
- **BreadcrumbList**: Em todas as páginas com breadcrumbs
- **Product**: Em páginas de produtos
- **Article**: Em posts de blog
- **Organization**: Na home (futuro)

### Sitemap

#### Geração Automática
- **Script**: `scripts/generate-sitemap.js` executa durante build
- **Trigger**: `prebuild` hook no `package.json`
- **Formato**: XML estático servido diretamente pelo Nginx
- **Conteúdo**: Rotas estáticas + posts de blog dinâmicos do Supabase

#### Estrutura
- **Rotas estáticas**: Definidas em `scripts/generate-sitemap.js`
- **Posts de blog**: Buscados do Supabase durante build
- **Prioridades**: Home (1.0), Páginas principais (0.9), Secundárias (0.8), Blog (0.7)
- **Changefreq**: Semanal para conteúdo dinâmico, mensal para estático

### URLs

#### Estrutura
- **Amigáveis**: `/produtos/autel-alpha` ao invés de `/produtos?id=1`
- **Descritivas**: URLs que descrevem o conteúdo
- **Slugs**: Gerados automaticamente a partir de títulos
- **Canonical**: Sempre definir URL canônica para evitar duplicação

---

## ⚡ Políticas de Core Web Vitals

### LCP (Largest Contentful Paint)

#### Meta
- **Desktop**: < 2.5s (idealmente < 2.0s)
- **Mobile**: < 2.5s (crítico - atualmente 4.9s, precisa otimização urgente)

#### Estratégias Implementadas
- **Preload de recursos críticos**: Logo, CSS crítico
- **Preconnect**: Domínios críticos (aerion.com.br, fonts.googleapis.com)
- **Lazy load de vídeo hero**: Mobile usa imagem estática ao invés de vídeo
- **Imagens responsivas**: srcset com múltiplos tamanhos
- **Poster image**: Vídeo hero tem imagem estática como fallback

#### Estratégias Futuras
- **CSS crítico inline**: Extrair CSS above-the-fold e colocar inline
- **Defer CSS não crítico**: Carregar CSS abaixo do fold de forma assíncrona
- **Otimização de imagens**: WebP/AVIF com fallback

### FCP (First Contentful Paint)

#### Meta
- **Desktop**: < 1.8s (atual: 0.9s ✅)
- **Mobile**: < 1.8s (atual: 4.1s ❌ - crítico)

#### Estratégias
- **CSS crítico inline**: Reduzir renderização bloqueante
- **Defer JavaScript**: Scripts não críticos com `defer` ou `async`
- **Minimizar renderização bloqueante**: CSS e JS críticos apenas
- **Preload de fontes**: Fontes críticas pré-carregadas

### TBT (Total Blocking Time)

#### Meta
- **Desktop**: < 200ms (atual: ~281ms - precisa melhorar)
- **Mobile**: < 200ms (atual: 280ms - precisa melhorar)

#### Estratégias
- **Code splitting agressivo**: Separar vendor chunks
- **Quebrar tarefas longas**: Nenhuma tarefa > 50ms
- **Lazy load de código não crítico**: Admin, componentes pesados
- **Defer Google Tag Manager**: Carregar após renderização inicial
- **requestIdleCallback**: Para tarefas não críticas

### CLS (Cumulative Layout Shift)

#### Meta
- **< 0.1** (atual: 0 ✅ - manter!)

#### Estratégias (já implementadas)
- **Width/height explícitas**: Todas as imagens têm dimensões definidas
- **Aspect ratio**: Definido via CSS ou atributo HTML
- **Reservar espaço**: Placeholders para conteúdo dinâmico
- **Evitar inserção acima do fold**: Conteúdo crítico estático

#### Manter
- **Sempre definir dimensões**: Novas imagens devem ter width/height
- **Aspect ratio containers**: Usar containers com aspect-ratio CSS
- **Loading states**: Skeleton screens mantêm layout estável

---

## ♿ Políticas de Usabilidade e Acessibilidade

### Acessibilidade (WCAG AA)

#### Contraste de Cores
- **Texto normal**: Mínimo 4.5:1 de contraste
- **Texto grande**: Mínimo 3:1 de contraste (18pt+ ou 14pt+ bold)
- **Cores problemáticas identificadas**:
  - `text-blue-medium`: Precisa ajuste para melhor contraste
  - `text-gray-medium`: Precisa ajuste para melhor contraste
  - Badges `bg-blue-medium/10 text-blue-medium`: Precisa melhor contraste

#### Navegação por Teclado
- **Todos os elementos interativos**: Acessíveis via Tab
- **Focus visible**: Indicadores de foco claros
- **Ordem lógica**: Tab order segue ordem visual
- **Skip links**: Links para pular navegação (futuro)

#### Screen Readers
- **aria-label**: Em botões sem texto visível
- **aria-describedby**: Para contexto adicional quando necessário
- **Roles semânticos**: Usar elementos HTML semânticos (nav, main, article)
- **Alt text**: Todas as imagens com texto alternativo descritivo

#### Ordem de Títulos
- **Hierarquia correta**: h1 → h2 → h3 → h4 (sem pular níveis)
- **Problemas identificados**:
  - `h3` em HeroSection sem `h2` anterior → Converter para `h2`
  - `h4` em Footer sem `h3` anterior → Converter para `h2` ou `h3`

#### Vídeos
- **Tracks de legendas**: `<track kind="captions">` em todos os vídeos
- **Estrutura correta**: Mesmo que legendas vazias, estrutura deve existir
- **Controles acessíveis**: Player com controles de acessibilidade

### Performance Percebida

#### Loading States
- **Todas as operações assíncronas**: Mostrar loading state
- **Skeleton screens**: Para conteúdo carregando (melhor que spinner)
- **Progress indicators**: Para operações longas

#### Transições
- **Suaves**: Transições CSS (não abruptas)
- **Consistentes**: Mesma duração e easing em elementos similares
- **Não bloqueantes**: Transições não devem bloquear interação

#### Feedback Visual
- **Imediato**: Feedback em < 100ms
- **Claro**: Usuário deve entender o que aconteceu
- **Toasts**: Para ações bem-sucedidas ou erros

### Mobile-First

#### Design Responsivo
- **Obrigatório**: Todas as páginas devem funcionar em mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch targets**: Mínimo 44x44px para elementos clicáveis

#### Otimizações Mobile
- **Vídeo hero**: Desabilitado em mobile, usar imagem estática
- **Imagens menores**: Servir tamanhos menores para mobile via srcset
- **Lazy load agressivo**: Carregar menos conteúdo inicialmente
- **Testar em dispositivos reais**: Não apenas emuladores

---

## 🖼️ Políticas de Imagens e Mídia

### Formatos

#### Prioridade
1. **WebP**: Formato moderno, melhor compressão (prioridade)
2. **AVIF**: Formato mais moderno ainda (futuro)
3. **JPEG/PNG**: Fallback para navegadores antigos

#### Vídeos
- **Formato**: MP4 (H.264) para máxima compatibilidade
- **Codec**: H.264 para compatibilidade universal
- **Resolução**: 720p para desktop, considerar 480p para mobile

### Tamanhos e Responsividade

#### Estratégia Responsiva
- **Múltiplos tamanhos**: Gerar 400w, 800w, 1200w de cada imagem
- **srcset**: Usar `srcset` para servir tamanho apropriado
- **Picture element**: Para formatos modernos com fallback

#### Otimização
- **Redimensionar**: Não servir imagem 2500px para exibir 300px
- **Compressão**: Otimizar JPEG (qualidade 80-85), PNG (otimização)
- **Lazy loading**: Todas as imagens abaixo do fold com `loading="lazy"`

### Componente ResponsiveImage

#### Uso Obrigatório
- **Novas imagens**: Sempre usar componente `ResponsiveImage`
- **Width/height explícitas**: Obrigatórias para evitar CLS
- **srcset**: Suporte automático a múltiplos tamanhos
- **Formatos modernos**: WebP/AVIF com fallback automático

#### API do Componente
```typescript
<ResponsiveImage
  src="/images/product.jpg"
  alt="Descrição"
  width={800}
  height={600}
  loading="lazy"
  srcset={{
    small: "/images/product-400w.webp 400w",
    medium: "/images/product-800w.webp 800w",
    large: "/images/product-1200w.webp 1200w"
  }}
/>
```

---

## 💻 Políticas de Código

### TypeScript

#### Regras
- **Tipos explícitos**: Sempre que possível, evitar inferência complexa
- **Interfaces**: Para props de componentes e objetos complexos
- **Evitar `any`**: Usar `unknown` se tipo realmente desconhecido
- **Type guards**: Para validação de tipos em runtime

#### Exemplo
```typescript
// ✅ Bom
interface ProductProps {
  name: string;
  price: number;
  image: string;
}

// ❌ Evitar
const Product = (props: any) => { ... }
```

### Componentes React

#### Estrutura
- **Props tipadas**: Sempre definir interface para props
- **Componentes pequenos**: Um componente = uma responsabilidade
- **Custom hooks**: Lógica reutilizável em hooks
- **Memoização**: Apenas quando necessário (React.memo, useMemo, useCallback)

#### Padrão
```typescript
interface ComponentProps {
  title: string;
  description?: string;
}

export const Component: React.FC<ComponentProps> = ({ title, description }) => {
  // Lógica do componente
  return <div>...</div>;
};
```

### Estilização

#### Tailwind CSS
- **Utility-first**: Preferir classes Tailwind sobre CSS customizado
- **Design tokens**: Cores e espaçamentos em `tailwind.config.ts`
- **Responsive**: Mobile-first (sm:, md:, lg:)
- **Evitar CSS inline**: Apenas quando absolutamente necessário

#### Cores Customizadas
- **HSL format**: Todas as cores em HSL (definidas em `src/index.css`)
- **CSS variables**: Usar variáveis CSS para temas
- **Contraste**: Verificar contraste antes de usar novas cores

---

## 🔒 Políticas de Segurança

### Frontend

#### Credenciais
- **Nunca expor**: service_role key do Supabase
- **Apenas anon key**: No frontend (segura para exposição pública)
- **Secrets**: Variáveis sensíveis apenas em GitHub Secrets

#### Validação
- **Cliente E servidor**: Validação em ambos os lados
- **Sanitização**: Sanitizar todos os inputs do usuário
- **HTTPS**: Obrigatório em produção

### Backend (Supabase)

#### Row Level Security (RLS)
- **Todas as tabelas**: RLS habilitado
- **Políticas explícitas**: Definir quem pode ler/escrever
- **Público vs Admin**: Separar políticas claramente

#### Autenticação
- **JWT tokens**: Com expiração automática
- **Roles**: Verificação de role no servidor (não confiar apenas no cliente)
- **Funções SECURITY DEFINER**: Para operações sensíveis

---

## 🚀 Políticas de Deploy

### CI/CD

#### GitHub Actions
- **Trigger**: Push para branch `main`
- **Build**: Docker build com cache de layers
- **Deploy**: Webhook para Easypanel apenas se build bem-sucedido
- **Versionamento**: Tags Docker (latest + commit SHA)

#### Variáveis de Ambiente
- **GitHub Secrets**: Nunca commitadas no código
- **Build args**: Injetadas durante build do Docker
- **Template**: `env.template` para referência (sem valores reais)

### Docker

#### Multi-stage Build
- **Stage 1**: Build da aplicação (Node.js)
- **Stage 2**: Servir com Nginx (imagem final leve)

#### Otimizações
- **.dockerignore**: Ignorar node_modules, .git, etc
- **Cache de layers**: Para builds mais rápidos
- **Health checks**: Endpoint `/health` para monitoramento

---

## 🎨 Design System e Brand Identity

### Paleta de Cores

#### Cores Principais (HSL)
- **navy-deep**: `230 62% 10%` - Footer, logo, textos principais
- **blue-dark**: `191 100% 28%` - Acentos escuros
- **blue-medium**: `195 74% 47%` - Cor primária, links
- **blue-bright**: `195 100% 62%` - CTAs, destaques
- **blue-light**: `195 100% 78%` - Backgrounds claros
- **blue-pale**: `180 100% 90%` - Backgrounds muito claros

#### Cores Neutras
- **gray-dark**: `200 6% 29%` - Textos secundários
- **gray-medium**: `0 0% 60%` - Textos terciários (⚠️ precisa ajuste de contraste)
- **gray-light**: `0 0% 96%` - Bordas e backgrounds

#### Cores de Sistema
- **green-success**: `151 100% 50%` - Mensagens de sucesso
- **action**: `var(--blue-bright)` - Botões de ação principais

### Tipografia

#### Fontes
- **Heading**: Montserrat (400, 600, 700, 800)
- **Body**: Open Sans (400, 600, 700)
- **Carregamento**: Google Fonts com `display=swap`

#### Escala
- **h1**: 4xl/5xl (36px/48px)
- **h2**: 3xl/4xl (30px/36px)
- **h3**: 2xl/3xl (24px/30px)
- **h4**: xl/2xl (20px/24px)

### Espaçamento

#### Sistema Base (8px)
- **xs**: 0.5rem (8px)
- **sm**: 1rem (16px)
- **md**: 1.5rem (24px)
- **lg**: 2rem (32px)
- **xl**: 3rem (48px)
- **xxl**: 5rem (80px)

### Componentes

#### Padrões
- **Border radius**: 0.5rem (8px) padrão
- **Shadows**: Sistema de sombras (sm, md, lg, glow)
- **Transitions**: 300ms ease-in-out padrão

---

## 📈 Métricas e Monitoramento

### Core Web Vitals

#### Monitoramento
- **Google Search Console**: Métricas reais de usuários
- **Lighthouse CI**: Em pull requests (futuro)
- **Alertas**: Se métricas degradarem abaixo dos thresholds

#### Thresholds Atuais
- **LCP Desktop**: 2.1s → Meta: < 2.0s
- **LCP Mobile**: 4.9s → Meta: < 2.5s (crítico)
- **FCP Desktop**: 0.9s ✅
- **FCP Mobile**: 4.1s → Meta: < 1.8s (crítico)
- **TBT**: 280ms → Meta: < 200ms
- **CLS**: 0 ✅

### Performance

#### Bundle Size
- **Monitorar**: Tamanho dos chunks JavaScript
- **Limite**: Alertar se chunk > 200KB
- **Code splitting**: Separar vendor chunks

#### Asset Size
- **Imagens**: Monitorar tamanho total de imagens
- **Vídeos**: Considerar alternativas para vídeos grandes
- **Fontes**: Usar apenas pesos necessários

---

## 🔄 Guia para Melhorias Futuras

### Ao Adicionar Novas Features

#### Checklist
1. ✅ **Core Web Vitals**: Verificar impacto em LCP, FCP, TBT, CLS
2. ✅ **Acessibilidade**: Garantir WCAG AA (contraste, aria-labels, ordem de títulos)
3. ✅ **Otimização de imagens**: Usar ResponsiveImage, formatos modernos
4. ✅ **TypeScript**: Adicionar tipos explícitos
5. ✅ **Mobile**: Testar em dispositivos móveis reais
6. ✅ **SEO**: Adicionar SEOHead com meta tags apropriadas
7. ✅ **Sitemap**: Atualizar se nova rota pública

#### Exemplo de Fluxo
```typescript
// 1. Criar componente tipado
interface NewFeatureProps {
  title: string;
}

export const NewFeature: React.FC<NewFeatureProps> = ({ title }) => {
  // 2. Usar ResponsiveImage para imagens
  // 3. Garantir acessibilidade (aria-labels, contraste)
  // 4. Testar em mobile
  // 5. Adicionar SEOHead se for página
};
```

### Ao Otimizar Performance

#### Processo
1. **Medir antes**: Lighthouse, PageSpeed Insights
2. **Identificar gargalos**: Network, JavaScript, CSS, imagens
3. **Implementar otimizações**: Baseado em dados reais
4. **Medir depois**: Verificar melhorias
5. **Não quebrar**: Manter funcionalidades existentes
6. **Documentar**: Explicar mudanças significativas

### Ao Refatorar

#### Princípios
1. **Manter API pública**: Não quebrar props de componentes existentes
2. **Migrações de dados**: Se mudar estrutura, criar migração
3. **Compatibilidade**: Manter compatibilidade com admin panel
4. **Testes**: Testar todas as rotas/páginas afetadas
5. **Gradual**: Refatorar em pequenos passos, não tudo de uma vez

---

## 🎯 Princípios Fundamentais

### Performance First
- **Mobile-first**: Otimizar para mobile primeiro (maior impacto)
- **Above-the-fold**: Conteúdo crítico carrega primeiro
- **Lazy everything**: Carregar apenas o necessário inicialmente

### Acessibilidade First
- **WCAG AA**: Mínimo obrigatório
- **Keyboard navigation**: Funcionar sem mouse
- **Screen readers**: Testar com leitores de tela

### SEO First
- **Semantic HTML**: Usar elementos corretos
- **Structured data**: Schema.org sempre que aplicável
- **Meta tags**: Completas e otimizadas

### Developer Experience
- **TypeScript**: Tipagem forte para prevenir erros
- **Componentes reutilizáveis**: DRY (Don't Repeat Yourself)
- **Documentação**: Código auto-documentado, comentários quando necessário

---

## 📚 Referências e Recursos

### Documentação Oficial
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### Ferramentas de Análise
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse)
- [WebPageTest](https://www.webpagetest.org)
- [WAVE](https://wave.webaim.org) - Acessibilidade

### Guias de Referência
- [Web.dev - Core Web Vitals](https://web.dev/vitals)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
- [MDN Web Docs](https://developer.mozilla.org)

---

## 📝 Notas Finais

Este documento deve ser atualizado sempre que:
- Nova tecnologia é adicionada
- Políticas mudam
- Decisões arquiteturais importantes são tomadas
- Novos padrões são estabelecidos

**Última atualização**: Dezembro 2024

**Versão do documento**: 1.0

---

*Este arquivo serve como fonte única de verdade sobre o projeto. Qualquer desenvolvedor ou IA trabalhando no projeto deve consultar este documento antes de fazer mudanças significativas.*


