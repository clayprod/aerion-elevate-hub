---
name: Otimização Core Web Vitals e Acessibilidade
overview: Implementar otimizações completas de Core Web Vitals (LCP, FCP, TBT, CLS) e acessibilidade (WCAG AA) para melhorar performance mobile e desktop, corrigir problemas de contraste, heading hierarchy, botões sem accessible names, vídeos sem legendas e otimizar carregamento de recursos.
todos:
  - id: create-context-file
    content: Criar arquivo PROJECT_CONTEXT.md na raiz com toda a documentação do projeto, stack, políticas e guias
    status: pending
---

# Otimização Core Web Vitals e Acessibilidade

## Objetivo

Melhorar significativamente as métricas de Core Web Vitals (especialmente mobile) e corrigir todos os problemas de acessibilidade identificados pelo Lighthouse, garantindo conformidade com WCAG AA.

## Problemas Identificados

### Desktop

- LCP: 2.1s (meta: < 2.0s)
- Maximum critical path latency: 763ms
- Unused JavaScript: 260 KiB
- Unused CSS: 15 KiB
- Large network payloads: vídeo hero carregado múltiplas vezes (13.7MB, 6.0MB, 1.9MB, 1.6MB)
- Imagens sem width/height explícitas
- Buttons sem accessible name
- Long main thread tasks (3 encontradas)
- Contraste de cores insuficiente
- Heading hierarchy incorreta
- Vídeos sem tracks de legendas

### Mobile (Crítico)

- Performance: 66 (meta: 90+)
- FCP: 4.1s (meta: < 1.8s)
- LCP: 4.9s (meta: < 2.5s)
- TBT: 280ms (meta: < 200ms)
- Speed Index: 4.4s
- Render-blocking requests
- Image delivery issues
- Unused JavaScript: 262 KiB
- Unused CSS: 15 KiB
- Large network payloads: 24.734 KiB
- Long main thread tasks: 6 encontradas

## Implementação

### 1. Otimização de Recursos Críticos (LCP/FCP)

#### 1.1 Preconnect e DNS Prefetch

**Arquivo**: `index.html`

- Adicionar preconnect para Supabase (se usado no carregamento inicial)
- Adicionar preconnect para domínios de imagens/vídeos se externos
- Manter preconnects existentes (Google Fonts, GTM)

#### 1.2 Preload de Recursos Críticos

**Arquivo**: `index.html`

- Preload do logo principal (`/images/logos/logo-aerion.png`)
- Preload de CSS crítico inline (extrair CSS above-the-fold)
- Preload de fonte crítica (Montserrat 700 para headings)

#### 1.3 Defer Google Tag Manager

**Arquivo**: `index.html`

- Mover script do GTM para carregar após DOMContentLoaded
- Usar `defer` ou carregar via `requestIdleCallback`

### 2. Otimização de Vídeo Hero (LCP Crítico)

#### 2.1 Vídeo Hero Mobile

**Arquivo**: `src/components/home/HeroSection.tsx`

- Detectar mobile via `useMediaQuery` ou `window.matchMedia`
- Em mobile: usar imagem estática (poster) ao invés de vídeo
- Lazy load vídeo apenas em desktop
- Adicionar `preload="metadata"` ou `preload="none"` em vídeo

#### 2.2 Vídeo Background Component

**Arquivo**: `src/components/VideoBackground.tsx`

- Adicionar prop `poster` para imagem de fallback
- Adicionar `preload="metadata"` (não "auto")
- Adicionar `<track kind="captions">` vazio para acessibilidade
- Implementar lazy loading: carregar vídeo apenas quando visível (IntersectionObserver)
- Adicionar `loading="lazy"` equivalente para vídeo

#### 2.3 Otimização de Vídeo

**Arquivo**: `public/videos/products/evo_max/Introducing EVO Max 4T_720.mp4`

- Considerar criar versão menor para mobile (480p)
- Usar `<source>` com múltiplas resoluções e `media` queries
- Adicionar poster image otimizada

### 3. Otimização de Imagens (LCP/CLS)

#### 3.1 Width/Height Explícitas

**Arquivos**:

- `src/components/Footer.tsx` (logo sem width/height)
- `src/components/AutelLogo.tsx` (se existir)
- Todos os componentes que usam `<img>` diretamente

**Ação**: Adicionar `width` e `height` explícitos em todas as imagens ou usar `OptimizedImage`

#### 3.2 Responsive Images

**Arquivo**: `src/components/OptimizedImage.tsx`

- Adicionar suporte a `srcset` para múltiplos tamanhos
- Adicionar suporte a formatos modernos (WebP com fallback)
- Garantir que todas as imagens críticas usem este componente

#### 3.3 Lazy Loading

- Garantir `loading="lazy"` em todas as imagens abaixo do fold
- Manter `loading="eager"` ou `fetchPriority="high"` apenas para LCP

### 4. Code Splitting e Tree Shaking (TBT/Unused JS)

#### 4.1 Code Splitting Melhorado

**Arquivo**: `vite.config.ts`

- Revisar `manualChunks` para separar melhor vendors
- Considerar separar Google Tag Manager em chunk próprio
- Separar componentes pesados (ex: ProductVideoGallery) em chunks

#### 4.2 Remover JavaScript Não Usado

**Arquivo**: `vite.config.ts`

- Habilitar tree shaking agressivo
- Verificar imports não usados em componentes
- Considerar usar `sideEffects: false` no package.json

#### 4.3 Lazy Load de Componentes Não Críticos

**Arquivo**: `src/App.tsx`

- Já tem lazy loading para admin, verificar se outros componentes pesados podem ser lazy loaded
- Considerar lazy load de ProductVideoGallery, ProductPhotoGallery

### 5. CSS Otimização (Render-blocking)

#### 5.1 CSS Crítico Inline

**Arquivo**: `index.html`

- Extrair CSS crítico acima do fold (hero section, header)
- Colocar inline no `<head>`
- Defer CSS não crítico

#### 5.2 Remover CSS Não Usado

**Arquivo**: `tailwind.config.ts`

- Verificar se todas as classes usadas estão no `content`
- Executar PurgeCSS manualmente se necessário
- Revisar imports de CSS não usados

### 6. Acessibilidade - Contraste de Cores

#### 6.1 Ajustar Cores com Baixo Contraste

**Arquivo**: `src/index.css`

- `text-blue-medium`: Ajustar para garantir 4.5:1 de contraste
- `text-gray-medium`: Ajustar para garantir 4.5:1 de contraste
- `bg-blue-medium/10 text-blue-medium`: Ajustar para melhor contraste em badges

**Solução**: Escurecer cores ou usar variantes mais escuras para texto

#### 6.2 Verificar Todas as Cores de Texto

- Criar utilitário para verificar contraste automaticamente
- Revisar todos os componentes que usam cores customizadas

### 7. Acessibilidade - Botões Sem Accessible Name

#### 7.1 Adicionar aria-label

**Arquivos**:

- `src/components/products/ProductVideoGallery.tsx` (botão de fechar modal)
- `src/components/Header.tsx` (botão de menu mobile se existir)
- Qualquer botão sem texto visível

**Ação**: Adicionar `aria-label` descritivo em todos os botões sem texto

#### 7.2 Combobox Button

**Arquivo**: `src/components/ui/command.tsx` ou componentes que usam combobox

- Verificar se combobox tem `aria-label` ou `aria-labelledby`
- Adicionar se necessário

### 8. Acessibilidade - Heading Hierarchy

#### 8.1 Corrigir Hierarquia

**Arquivo**: `src/components/home/HeroSection.tsx`

- `h3` sem `h2` anterior → Converter para `h2` ou adicionar `h2` antes

**Arquivo**: `src/components/Footer.tsx`

- `h4` sem `h3` anterior → Converter para `h2` ou `h3`

**Ação**: Revisar todas as páginas e garantir ordem sequencial (h1 → h2 → h3 → h4)

### 9. Acessibilidade - Vídeos Sem Legendas

#### 9.1 Adicionar Tracks de Legendas

**Arquivo**: `src/components/VideoBackground.tsx`

- Adicionar `<track kind="captions" src="" srclang="pt-BR" label="Português" />` mesmo que vazio

**Arquivo**: `src/components/products/ProductVideoGallery.tsx`

- Adicionar tracks nos iframes do YouTube (via parâmetros da URL)

### 10. Otimização de Long Tasks (TBT)

#### 10.1 Quebrar Tarefas Longas

- Identificar código que executa > 50ms
- Usar `requestIdleCallback` para tarefas não críticas
- Usar `setTimeout` para quebrar loops longos
- Considerar Web Workers para processamento pesado

#### 10.2 Defer Google Tag Manager

**Arquivo**: `index.html`

- Carregar GTM apenas após `requestIdleCallback` ou após 2s de delay

### 11. Otimização Nginx (Payloads Grandes)

#### 11.1 Brotli Compression

**Arquivo**: `nginx.conf`

- Adicionar compressão Brotli além de Gzip
- Configurar níveis de compressão apropriados

#### 11.2 Cache de Vídeos

**Arquivo**: `nginx.conf`

- Adicionar cache headers para vídeos MP4
- Configurar cache longo para assets estáticos

### 12. Otimização Mobile Específica

#### 12.1 Conditional Loading

- Detectar mobile e carregar recursos menores
- Servir imagens menores para mobile via srcset
- Desabilitar vídeo hero em mobile (já mencionado)

#### 12.2 Resource Hints Mobile

- Preconnect apenas para recursos críticos em mobile
- Reduzir número de preconnects em mobile

## Arquivos a Modificar

1. `index.html` - Preconnects, preloads, defer GTM, CSS crítico inline
2. `vite.config.ts` - Code splitting melhorado
3. `nginx.conf` - Brotli, cache de vídeos
4. `src/components/home/HeroSection.tsx` - Vídeo mobile, heading hierarchy
5. `src/components/VideoBackground.tsx` - Lazy load, poster, tracks, preload
6. `src/components/Footer.tsx` - Width/height logo, heading hierarchy
7. `src/components/OptimizedImage.tsx` - srcset, WebP support
8. `src/index.css` - Ajustar cores para contraste
9. `src/components/products/ProductVideoGallery.tsx` - aria-label botões, tracks
10. `src/components/Header.tsx` - aria-label botões se necessário
11. Todos os componentes com `<img>` - Adicionar width/height ou usar OptimizedImage

## Métricas Esperadas Após Implementação

### Desktop

- LCP: < 2.0s (de 2.1s)
- FCP: < 1.8s (já 0.9s ✅)
- TBT: < 200ms (de ~281ms)
- CLS: 0 (manter ✅)

### Mobile (Crítico)

- Performance: 85+ (de 66)
- FCP: < 2.0s (de 4.1s)
- LCP: < 2.5s (de 4.9s)
- TBT: < 200ms (de 280ms)
- Speed Index: < 3.0s (de 4.4s)

## Ordem de Implementação Recomendada

1. **Fase 1 - Quick Wins** (maior impacto, menor esforço):

- Preconnect/preload críticos
- Width/height em imagens
- aria-labels em botões
- Heading hierarchy
- Vídeo mobile → imagem

2. **Fase 2 - Otimizações Médias**:

- CSS crítico inline
- Defer GTM
- Ajustar contraste de cores
- Tracks de legendas em vídeos

3. **Fase 3 - Otimizações Avançadas**:

- Code splitting melhorado
- Lazy load vídeo hero
- Brotli compression
- srcset e WebP em imagens