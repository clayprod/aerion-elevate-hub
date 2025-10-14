# 🚀 Quick Start - AERION Elevate Hub

Guia rápido para colocar tudo no ar em 30 minutos!

## ⏱️ Checklist Rápido (30 min)

### ☐ Passo 1: Supabase (10 min)

```bash
# 1. Acesse https://supabase.com e crie projeto "aerion-elevate-hub"
# 2. Aguarde ~2 min para o projeto ficar pronto
# 3. Vá para Settings > API e copie:
#    - Project URL
#    - anon/public key
```

**Executar migrations:**
1. SQL Editor no Supabase
2. Copiar e executar cada arquivo de `supabase/migrations/`
3. ✅ Ver tabelas criadas em Table Editor

### ☐ Passo 2: GitHub Secrets (5 min)

No GitHub, vá para: `Settings` → `Secrets and variables` → `Actions`

Adicionar 3 secrets:

```
VITE_SUPABASE_URL = https://[seu-projeto].supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOi...
EASYPANEL_WEBHOOK_URL = [copiar no passo 3]
```

### ☐ Passo 3: Easypanel (10 min)

1. **Criar projeto:**
   - Nome: `aerion-elevate-hub`
   - Type: Docker Image

2. **Configurar:**
   - Image: `ghcr.io/clayprod/aerion-elevate-hub:latest`
<<<<<<< HEAD
   - Webhook: `https://hook.csvoa5.easypanel.host/api/deploy/39afd64789632715720dd3009dc3f6b1ac22cffade6c57e8`
=======
>>>>>>> 72257d27b7535ca1066cc15f5cb7ff666c60ad26
   - Port: `80`

3. **Variáveis de ambiente no Easypanel:**
   ```
   VITE_SUPABASE_URL=https://rijzunhodxapuiomvojd.supabase.co
   VITE_SUPABASE_ANON_KEY=[sua-chave-anon]
   ```

4. **Copiar Webhook URL:**
   - Encontrar em configurações do projeto
   - Formato: `https://[domain].easypanel.host/api/deploy/[token]`
   - Adicionar como secret no GitHub (voltar passo 2)

### ☐ Passo 4: Primeiro Deploy (5 min)

```bash
# Fazer commit e push
git add .
git commit -m "feat: Setup CI/CD and admin area"
git push origin main

# Acompanhar progresso
# GitHub → Actions → Ver workflow rodando
```

**Aguardar ~5-10 min** para primeiro build completar.

### ☐ Passo 5: Criar Admin (2 min)

1. Acessar site (URL do Easypanel)
2. Ir para `/auth`
3. Criar primeira conta
4. **Primeiro usuário vira admin automaticamente! 🎉**

### ☐ Passo 6: Testar Admin

1. Acessar `/admin`
2. Explorar o dashboard
3. Adicionar primeiro produto em `/admin/products`
4. Configurar hero em `/admin/hero`
5. Criar primeiro post em `/admin/blog`

---

## 🎯 URLs Importantes

Salve estas URLs:

```
Site: https://[seu-easypanel].com
Admin: https://[seu-easypanel].com/admin
Supabase: https://app.supabase.com/project/[id]
GitHub Actions: https://github.com/[user]/[repo]/actions
```

---

## 📋 Comandos Git Úteis

### Desenvolvimento Local

```bash
# Clonar repositório
git clone [URL]
cd aerion-elevate-hub

# Instalar dependências
npm install

# Criar .env.local
cp env.template .env.local
# Editar .env.local com suas credenciais

# Rodar localmente
npm run dev
# Acessar http://localhost:8080
```

### Deploy Automático

```bash
# Qualquer push na main faz deploy automático!
git add .
git commit -m "feat: [descrição]"
git push origin main

# Ver logs do deploy
# GitHub → Actions → Último workflow
```

### Branches de Feature (Recomendado)

```bash
# Criar branch para nova feature
git checkout -b feature/minha-feature

# Desenvolver e commitar
git add .
git commit -m "feat: Minha nova feature"
git push origin feature/minha-feature

# Abrir Pull Request no GitHub
# Após aprovação, merge → Deploy automático!
```

---

## 🔍 Verificar Se Tudo Está OK

### ✅ GitHub Actions
```bash
# Ver se workflow está configurado
ls -la .github/workflows/deploy.yml
# Deve existir ✅
```

### ✅ Docker Files
```bash
ls -la Dockerfile nginx.conf docker-compose.yml
# Todos devem existir ✅
```

### ✅ Admin Pages
```bash
ls -la src/pages/admin/
# Deve ter: Dashboard, AdminBlog, AdminHero, AdminProducts, 
#           AdminSolutions, AdminSettings ✅
```

### ✅ Migrations
```bash
ls -la supabase/migrations/
# Deve ter 3 arquivos .sql ✅
```

---

## 🐛 Troubleshooting Rápido

### Build Falha no GitHub Actions
```bash
# Verificar:
1. GitHub Secrets estão configurados?
2. Secrets têm valores corretos?
3. Ver logs detalhados no Actions
```

### Site Não Carrega
```bash
# Verificar:
1. Easypanel está rodando?
2. Variáveis de ambiente no Easypanel corretas?
3. Ver logs do container no Easypanel
```

### Não Consigo Fazer Login
```bash
# Verificar:
1. Supabase URL está correta no .env.local?
2. Email foi confirmado? (auto-confirm no Supabase)
3. Ver Authentication > Users no Supabase
```

### Não Sou Admin
```bash
# Se não for o primeiro usuário, executar no SQL Editor:
INSERT INTO public.user_roles (user_id, role)
VALUES ('[SEU_USER_ID]', 'admin');
```

---

## 📚 Documentação Completa

Se precisar de mais detalhes:

- **Deploy**: [DEPLOY.md](./DEPLOY.md)
- **Supabase**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Implementação**: [IMPLEMENTATION.md](./IMPLEMENTATION.md)
- **Projeto**: [README.md](./README.md)

---

## 🎉 Pronto!

Em ~30 minutos você tem:

✅ Site rodando em produção
✅ Admin funcional
✅ Deploy automático configurado
✅ Banco de dados gerenciado
✅ CI/CD completo

**Qualquer push na main → Deploy automático! 🚀**

---

## 💡 Dicas

### Desenvolvimento
```bash
# Sempre trabalhe em branches
git checkout -b feature/nome

# Commit semântico
git commit -m "feat: Nova funcionalidade"
git commit -m "fix: Corrige bug X"
git commit -m "docs: Atualiza documentação"
```

### Produção
```bash
# Merge em main = deploy em produção!
# Seja cuidadoso ou use Pull Requests
```

### Backup
```bash
# Backup do Supabase (via CLI)
supabase db dump > backup-$(date +%Y%m%d).sql
```

### Monitoramento
- GitHub Actions: Ver histórico de deploys
- Easypanel: Ver logs em tempo real
- Supabase: Ver métricas de uso

---

## 🆘 Ajuda

1. **Documentação**: Ler os arquivos .md na raiz
2. **Logs**: GitHub Actions e Easypanel
3. **Supabase**: Ver Authentication e Table Editor
4. **GitHub Issues**: Abrir issue no repositório

---

**Desenvolvido com ❤️ para a AERION**

Sucesso! 🎊

