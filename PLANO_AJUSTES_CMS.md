# Plano de Ajustes e Melhorias do CMS AERION

## Análise Realizada via DevTools
Data: 2025-01-16
Status: Identificados múltiplos problemas críticos e áreas de melhoria

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **Link "Hero Section" ainda presente no menu**
- **Localização**: `src/components/admin/AdminLayout.tsx`
- **Problema**: O link para `/admin/hero` ainda aparece no menu lateral, mas a rota foi removida
- **Impacto**: Usuários clicam e recebem erro 404
- **Solução**: Remover completamente o item do menu

### 2. **Home Page não migrada para banco de dados**
- **Localização**: `src/pages/admin/AdminHome.tsx`
- **Problema**: Mostra "0 blocos configurado ainda", mas a home page está funcionando (hardcoded)
- **Impacto**: Conteúdo não pode ser editado via CMS
- **Solução**: Executar script de migração `migrate-home-to-blocks.js` e garantir que funcione

### 3. **Preview em tempo real não visível**
- **Localização**: `src/pages/admin/AdminHome.tsx`
- **Problema**: Botão "Mostrar Preview" não aparece ou não funciona corretamente
- **Impacto**: Admin não consegue ver mudanças em tempo real
- **Solução**: Verificar lógica de `showPreview` e garantir que o preview seja exibido corretamente

### 4. **Media Library mostra 0 arquivos**
- **Localização**: `src/pages/admin/MediaLibrary.tsx`
- **Problema**: Biblioteca mostra 0 arquivos, mas imagens existem no site
- **Impacto**: Não é possível gerenciar mídias via CMS
- **Solução**: Verificar sincronização com bucket e corrigir lógica de listagem

### 5. **Carrossel Hero não implementado na home pública**
- **Localização**: `src/components/home/DynamicHeroSection.tsx`
- **Problema**: Carrossel foi implementado no admin mas pode não estar funcionando na página pública
- **Impacto**: Home page não exibe múltiplos slides quando configurados
- **Solução**: Verificar integração do HeroCarousel na página pública

---

## 🟡 MELHORIAS NECESSÁRIAS

### 6. **Editor de Páginas de Produtos**
- **Localização**: `src/pages/admin/ProductPageEditor.tsx`
- **Problema**: Funcionalidade básica existe mas pode não estar completa
- **Melhorias**:
  - Adicionar preview em tempo real similar ao AdminHome
  - Melhorar UX do editor de blocos
  - Adicionar validação de campos obrigatórios

### 7. **Dashboard - Estatísticas**
- **Localização**: `src/pages/admin/Dashboard.tsx`
- **Problema**: Estatísticas podem não estar refletindo dados reais
- **Melhorias**:
  - Adicionar loading states mais claros
  - Melhorar tratamento de erros
  - Adicionar refresh manual de estatísticas

### 8. **Sincronização de Mídia**
- **Localização**: `src/pages/admin/MediaLibrary.tsx`
- **Melhorias**:
  - Adicionar indicador visual de sincronização em progresso
  - Melhorar feedback quando arquivos são adicionados/removidos
  - Adicionar filtros e busca na biblioteca

### 9. **Validação de Formulários**
- **Problema**: Falta validação consistente em vários formulários
- **Melhorias**:
  - Adicionar validação em tempo real
  - Mensagens de erro mais claras
  - Prevenção de submissão com dados inválidos

### 10. **Feedback Visual**
- **Problema**: Falta feedback visual em várias operações
- **Melhorias**:
  - Adicionar toasts para todas as operações CRUD
  - Indicadores de loading mais claros
  - Confirmações para ações destrutivas

---

## 🟢 MELHORIAS DE UX/UI

### 11. **Navegação do Admin**
- **Melhorias**:
  - Adicionar breadcrumbs nas páginas admin
  - Melhorar organização do menu lateral
  - Adicionar atalhos de teclado

### 12. **Formulários**
- **Melhorias**:
  - Adicionar auto-save rascunhos
  - Melhorar layout responsivo
  - Adicionar ajuda contextual (tooltips)

### 13. **Preview em Tempo Real**
- **Melhorias**:
  - Tornar preview padrão em todas as páginas de edição
  - Adicionar opção de preview em nova aba
  - Sincronizar scroll entre editor e preview

### 14. **Gerenciamento de Blocos**
- **Melhorias**:
  - Adicionar drag-and-drop para reordenar blocos
  - Adicionar duplicação de blocos
  - Adicionar histórico de alterações

---

## 📋 PLANO DE EXECUÇÃO

### Fase 1: Correções Críticas (Prioridade ALTA)
1. ✅ Remover link "Hero Section" do AdminLayout
2. ✅ Executar e verificar migração da Home Page
3. ✅ Corrigir preview em tempo real no AdminHome
4. ✅ Corrigir sincronização da Media Library
5. ✅ Verificar funcionamento do carrossel Hero na página pública

### Fase 2: Melhorias Funcionais (Prioridade MÉDIA)
6. ✅ Melhorar Editor de Páginas de Produtos
7. ✅ Aprimorar Dashboard com estatísticas precisas
8. ✅ Melhorar sincronização e feedback da Media Library
9. ✅ Adicionar validação consistente em formulários
10. ✅ Adicionar feedback visual em todas as operações

### Fase 3: Melhorias de UX (Prioridade BAIXA)
11. ✅ Melhorar navegação do admin
12. ✅ Aprimorar formulários com auto-save
13. ✅ Expandir preview em tempo real para todas as páginas
14. ✅ Adicionar drag-and-drop para blocos

---

## 🔍 VERIFICAÇÕES ADICIONAIS NECESSÁRIAS

### Banco de Dados
- [ ] Verificar se tabela `page_blocks` tem dados para `page_slug = 'home'`
- [ ] Verificar se tabela `media_library` está sincronizada com bucket
- [ ] Verificar RLS policies para todas as tabelas admin

### Frontend
- [ ] Verificar se todas as rotas admin estão protegidas
- [ ] Verificar se componentes de preview estão funcionando
- [ ] Verificar se uploads de mídia estão funcionando corretamente

### Integração
- [ ] Verificar se dados do banco estão sendo exibidos na página pública
- [ ] Verificar se alterações no admin refletem imediatamente no site
- [ ] Verificar performance de queries no dashboard

---

## 📝 NOTAS TÉCNICAS

### Arquivos Principais para Revisão
- `src/components/admin/AdminLayout.tsx` - Menu lateral
- `src/pages/admin/AdminHome.tsx` - Gerenciamento da Home
- `src/pages/admin/MediaLibrary.tsx` - Biblioteca de mídia
- `src/components/home/DynamicHeroSection.tsx` - Hero dinâmico
- `src/components/home/HeroCarousel.tsx` - Carrossel Hero
- `src/pages/admin/ProductPageEditor.tsx` - Editor de páginas
- `scripts/migrate-home-to-blocks.js` - Script de migração

### Scripts de Migração
- Verificar se `scripts/migrate-home-to-blocks.js` foi executado
- Verificar se dados foram inseridos corretamente no banco
- Verificar se estrutura de dados está correta

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após implementar as correções, validar:

- [ ] Link "Hero Section" removido do menu
- [ ] Home Page mostra blocos no admin
- [ ] Preview em tempo real funciona no AdminHome
- [ ] Media Library mostra arquivos do bucket
- [ ] Carrossel Hero funciona na página pública
- [ ] Todas as operações CRUD têm feedback visual
- [ ] Formulários têm validação adequada
- [ ] Dashboard mostra estatísticas corretas
- [ ] Upload de mídia funciona corretamente
- [ ] Alterações no admin refletem no site público

---

**Próximos Passos**: Implementar Fase 1 (Correções Críticas) imediatamente.

