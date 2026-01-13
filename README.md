# AERION Elevate Hub

Site institucional e plataforma de conteúdo da AERION, com sistema de administração completo.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **Backend**: Supabase (Auth + Database + Storage)
- **Deploy**: Docker + GitHub Actions + Easypanel (AWS)
- **Database**: PostgreSQL (via Supabase)

## 📋 Funcionalidades

### Público
- ✅ Landing page com hero section dinâmico
- ✅ Catálogo de produtos
- ✅ Soluções oferecidas
- ✅ Blog com posts e categorias
- ✅ Página de contato
- ✅ Sobre a empresa

### Administrativo
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de blog posts
- ✅ Gerenciamento de hero section e mídia
- ✅ CRUD de produtos
- ✅ CRUD de soluções
- ✅ Configurações do site (SEO, contato, redes sociais)
- ✅ Sistema de autenticação e roles (admin/user)

## 🛠️ Setup Local

### Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase (veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))

### Instalação

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>
cd aerion-elevate-hub

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Copie o conteúdo abaixo para .env.local
cat > .env.local << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
EOF

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:8080`

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- `blog_posts` - Posts do blog
- `products` - Catálogo de produtos
- `solutions` - Soluções oferecidas
- `hero_media` - Mídias do hero section (carousel/vídeos)
- `site_content` - Conteúdo dinâmico das páginas
- `site_settings` - Configurações globais do site
- `user_roles` - Roles dos usuários (admin/user)
- `profiles` - Perfis de usuários

### Segurança

- Row Level Security (RLS) ativado em todas as tabelas
- Políticas configuradas para acesso público vs. admin
- Primeiro usuário criado automaticamente vira admin

## 🎨 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── home/            # Seções da home
│   ├── Header.tsx       # Cabeçalho
│   ├── Footer.tsx       # Rodapé
│   └── ProtectedRoute.tsx # Rota protegida por auth
├── pages/
│   ├── Index.tsx        # Home
│   ├── Produtos.tsx     # Página de produtos
│   ├── Solucoes.tsx     # Página de soluções
│   ├── Blog.tsx         # Listagem do blog
│   ├── BlogPost.tsx     # Post individual
│   ├── Auth.tsx         # Login/Registro
│   └── admin/           # Páginas administrativas
│       ├── Dashboard.tsx
│       ├── AdminBlog.tsx
│       ├── AdminHero.tsx
│       ├── AdminProducts.tsx
│       ├── AdminSolutions.tsx
│       └── AdminSettings.tsx
├── contexts/
│   └── AuthContext.tsx  # Context de autenticação
├── integrations/
│   └── supabase/        # Cliente Supabase
└── lib/
    └── utils.ts         # Utilitários
```

## 🔐 Autenticação e Admin

### Criar Primeiro Admin

O primeiro usuário que se registrar automaticamente vira admin. Para adicionar admins adicionais, execute no SQL Editor do Supabase:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_UID_AQUI', 'admin');
```

### Rotas Admin

- `/admin` - Dashboard principal
- `/admin/blog` - Gerenciar blog
- `/admin/hero` - Gerenciar hero section
- `/admin/products` - Gerenciar produtos
- `/admin/solutions` - Gerenciar soluções
- `/admin/settings` - Configurações do site

Todas as rotas admin são protegidas e requerem autenticação + role de admin.

## 🐳 Docker

### Build Local

```bash
# Build da imagem
npm run docker:build

# Executar container
npm run docker:run

# Com docker-compose
npm run docker:compose
```

### Variáveis de Build

A imagem Docker aceita build args para as variáveis de ambiente:

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://xxx.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=eyJxxx \
  -t aerion-elevate-hub .
```

## 🚀 Deploy

### CI/CD Automático

Este projeto possui CI/CD totalmente configurado:

1. **Push na branch `main`** → Trigger automático
2. **GitHub Actions** → Build da imagem Docker
3. **GitHub Container Registry** → Armazena a imagem
4. **Easypanel (AWS)** → Deploy automático via webhook

### Configuração do Deploy

Veja o guia completo: [DEPLOY.md](./DEPLOY.md)

**Resumo rápido:**

1. Configure GitHub Secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `EASYPANEL_WEBHOOK_URL`

2. Crie projeto `aerion-elevate-hub` no Easypanel

3. Push para `main` → Deploy automático! 🎉

## 📚 Documentação

- [DEPLOY.md](./DEPLOY.md) - Guia completo de deploy no Easypanel
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Configuração do Supabase

## 🧪 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (porta 8080)
npm run build        # Build de produção
npm run build:prod   # Build de produção (explícito)
npm run preview      # Preview do build
npm run lint         # Lint do código

# Docker
npm run docker:build   # Build da imagem Docker
npm run docker:run     # Executar container
npm run docker:compose # Docker compose up
```

## 🎨 Padrão de Cores

Definido em `tailwind.config.ts`:

- **navy-deep**: Azul escuro principal
- **action**: Laranja para CTAs
- **gray-dark**: Texto secundário
- **gray-medium**: Texto terciário
- **gray-light**: Bordas e backgrounds

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
2. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
3. Push para a branch: `git push origin feature/nova-feature`
4. Abra um Pull Request

**Nota**: Pushes na `main` disparam deploy automático em produção!

## 📝 Licença

Propriedade da AERION. Todos os direitos reservados.

## 🆘 Suporte

Para problemas ou dúvidas:

1. Verifique a documentação em [DEPLOY.md](./DEPLOY.md) e [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Veja os logs no GitHub Actions
3. Verifique os logs no Easypanel
4. Abra uma issue neste repositório

## 🎯 Roadmap

- [x] Setup inicial do projeto
- [x] Sistema de autenticação
- [x] Área administrativa completa
- [x] CI/CD com GitHub Actions
- [x] Deploy automático no Easypanel
- [ ] Upload de imagens para Supabase Storage
- [ ] Editor de texto rico para blog posts
- [ ] Sistema de notificações
- [ ] Analytics e métricas
- [ ] PWA (Progressive Web App)

---

Desenvolvido com ❤️ para a AERION
