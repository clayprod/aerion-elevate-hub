# Guia de Configuração do Supabase

Este guia explica como configurar o Supabase para o projeto AERION Elevate Hub.

## 🎯 Escolher Opção de Supabase

### Opção A: Supabase Cloud (Recomendado) ✅

**Vantagens:**
- Setup rápido e fácil
- Gerenciamento automático
- Backups automáticos
- SSL incluído
- Free tier generoso

**Desvantagens:**
- Requer internet
- Dados fora da sua infraestrutura

### Opção B: Self-Hosted no Easypanel

**Vantagens:**
- Controle total
- Dados na sua infraestrutura
- Sem limites de recursos

**Desvantagens:**
- Setup mais complexo
- Requer mais recursos (CPU/RAM)
- Você gerencia backups

**→ Este guia foca na Opção A (Cloud), mas inclui notas para self-hosted.**

---

## 🚀 Setup do Supabase Cloud

### 1. Criar Conta e Projeto

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Faça login com GitHub (recomendado)
4. Clique em **"New Project"**

### 2. Configurar Projeto

Preencha os dados:

- **Name**: `aerion-elevate-hub` (ou nome preferido)
- **Database Password**: Gere uma senha forte (GUARDE ESTA SENHA!)
- **Region**: Escolha mais próximo da sua AWS (ex: `us-east-1`)
- **Pricing Plan**: Free (ou Pro se precisar de mais recursos)

Clique em **"Create new project"** e aguarde ~2 minutos.

### 3. Obter Credenciais

No dashboard do projeto:

1. Vá para **Settings > API**
2. Você verá:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (NÃO USE NO FRONTEND!)
```

3. Copie o **Project URL** e **anon key**

### 4. Configurar Variáveis de Ambiente

**Para desenvolvimento local:**

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Para produção (GitHub Secrets):**

Veja [DEPLOY.md](./DEPLOY.md) para configurar no GitHub Actions.

---

## 📊 Executar Migrations

### Método 1: Via Supabase Dashboard (Fácil)

1. No dashboard, vá para **SQL Editor**
2. Clique em **"New query"**
3. Copie e cole o conteúdo de cada arquivo de migration:
   - `supabase/migrations/20251012024313_1028490f-38c5-460e-aef1-dd9a006d0b6d.sql`
   - `supabase/migrations/20251012024325_9a842418-b22d-4041-95cb-4c13e7c06ed0.sql`
   - `supabase/migrations/20251012030000_admin_tables.sql`
4. Execute cada query (clique em **"Run"** ou `Ctrl+Enter`)

### Método 2: Via Supabase CLI (Avançado)

**Instalar CLI:**

```bash
npm install -g supabase
```

**Login:**

```bash
supabase login
```

**Linkar projeto:**

```bash
supabase link --project-ref xxxxxxxxxxxxx
```

**Executar migrations:**

```bash
supabase db push
```

---

## 👤 Criar Primeiro Usuário Admin

### Opção 1: Via Dashboard (Recomendado)

1. No Supabase, vá para **Authentication > Users**
2. Clique em **"Add user"**
3. Escolha **"Create new user"**
4. Preencha:
   - Email: seu email
   - Password: senha forte
   - Auto Confirm User: ✅ (marcar)
5. Clique em **"Create user"**
6. Copie o **User UID** do usuário criado

### Adicionar Role Admin

1. Vá para **SQL Editor**
2. Execute:

```sql
-- Substitua 'USER_UID_AQUI' pelo UID copiado
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_UID_AQUI', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

3. Pronto! Este usuário agora é admin.

### Opção 2: Via Interface do Site

1. Acesse `/auth` no seu site
2. Crie uma conta normalmente
3. **O primeiro usuário automaticamente vira admin** (veja migration)
4. Usuários subsequentes são "user" por padrão

---

## 🖼️ Configurar Storage para Imagens

### 1. Criar Bucket

1. No dashboard, vá para **Storage**
2. Clique em **"New bucket"**
3. Nome: `public-images`
4. **Public bucket**: ✅ (marcar para imagens públicas)
5. Clique em **"Create bucket"**

### 2. Configurar Políticas

No SQL Editor, execute:

```sql
-- Permitir leitura pública de imagens
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'public-images' );

-- Admins podem fazer upload
CREATE POLICY "Admins can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public-images' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
);

-- Admins podem deletar
CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'public-images' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
);
```

### 3. Upload de Imagens

URLs das imagens terão formato:

```
https://xxxxxxxxxxxxx.supabase.co/storage/v1/object/public/public-images/nome-arquivo.jpg
```

---

## 🔒 Segurança

### Row Level Security (RLS)

✅ **Já configurado!** Todas as tabelas têm RLS ativado.

### Políticas Implementadas

- **Blog Posts**: Todos veem publicados, admins veem tudo
- **Products**: Todos veem ativos, admins gerenciam
- **Solutions**: Todos veem ativas, admins gerenciam
- **Hero Media**: Todos veem ativos, admins gerenciam
- **Site Settings**: Todos leem, admins gerenciam
- **User Roles**: Apenas admins veem

### Verificar Segurança

No SQL Editor:

```sql
-- Verificar RLS ativado em todas as tabelas
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Deve mostrar rowsecurity = true para todas
```

---

## 📈 Monitoramento

### Logs

- **Database**: Settings > Database > Logs
- **API**: Settings > API > Logs
- **Auth**: Authentication > Logs

### Métricas

- Dashboard principal mostra:
  - Requests por segundo
  - Usuários ativos
  - Uso de storage
  - Tamanho do database

---

## 🔄 Backups (Plano Pro)

Se você tem plano Pro:

1. Vá para **Settings > Database**
2. **Point in Time Recovery**: Ativado automaticamente
3. Pode restaurar para qualquer momento dos últimos 7 dias

No plano Free:

- Faça backups manuais via:
  ```bash
  supabase db dump > backup.sql
  ```

---

## 🌐 Self-Hosted no Easypanel (Avançado)

Se preferir self-hosted:

### 1. Criar Compose no Easypanel

```yaml
version: '3.8'

services:
  supabase:
    image: supabase/postgres:latest
    environment:
      POSTGRES_PASSWORD: your-secure-password
    volumes:
      - supabase-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  supabase-api:
    image: supabase/postgrest:latest
    environment:
      PGRST_DB_URI: postgres://postgres:your-secure-password@supabase:5432/postgres
      PGRST_JWT_SECRET: your-jwt-secret
    ports:
      - "3000:3000"

volumes:
  supabase-data:
```

### 2. Executar Migrations

Conecte ao banco e execute os arquivos SQL manualmente.

### 3. Configurar Variáveis

Use o IP/URL da sua instância Easypanel como `VITE_SUPABASE_URL`.

---

## ✅ Checklist de Setup

- [ ] Projeto Supabase criado
- [ ] Credenciais copiadas (URL + anon key)
- [ ] Migrations executadas
- [ ] Primeiro admin criado
- [ ] Storage bucket configurado
- [ ] Variáveis de ambiente configuradas localmente
- [ ] GitHub Secrets configurados (veja DEPLOY.md)
- [ ] Testado localmente com `npm run dev`

---

## 🆘 Troubleshooting

### Erro: "relation does not exist"

→ Migrations não foram executadas. Execute-as no SQL Editor.

### Erro: "JWT expired"

→ Faça login novamente na aplicação.

### Não consigo fazer login

→ Verifique se o email foi confirmado (Authentication > Users).

### Usuário não é admin

→ Execute a query SQL para adicionar role de admin.

### Imagens não carregam

→ Verifique:
1. Bucket `public-images` existe
2. Bucket está marcado como público
3. URL da imagem está correta

---

## 📚 Recursos

- [Supabase Documentation](https://supabase.com/docs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

## 🎉 Pronto!

Agora seu Supabase está configurado e pronto para uso!

Próximo passo: [Configurar Deploy](./DEPLOY.md)

