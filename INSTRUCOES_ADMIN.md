# 👤 Criar Usuário Admin: marketing@aerion.com.br

## 📋 Credenciais
- **Email:** marketing@aerion.com.br
- **Senha:** @erion@2025

## 🚀 Métodos para Criar o Usuário Admin

### Método 1: Via Supabase Dashboard (RECOMENDADO)

1. **Acesse o Supabase Dashboard**
   - Vá para [supabase.com](https://supabase.com)
   - Entre no seu projeto

2. **Criar o Usuário**
   - Vá para **Authentication > Users**
   - Clique em **"Add user"**
   - Escolha **"Create new user"**
   - Preencha:
     - Email: `marketing@aerion.com.br`
     - Password: `@erion@2025`
     - Auto Confirm User: ✅ (marcar)
   - Clique em **"Create user"**

3. **Adicionar Role Admin**
   - Vá para **SQL Editor**
   - Execute o script `create_admin_user_simple.sql`
   - Ou execute manualmente:

```sql
-- Adicionar role de admin
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT 
  u.id,
  'admin',
  now()
FROM auth.users u
WHERE u.email = 'marketing@aerion.com.br'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Método 2: Via SQL Completo (AVANÇADO)

Se você tem permissões de super admin no Supabase:

1. **Execute o script completo**
   - Use o arquivo `create_admin_user.sql`
   - Execute no **SQL Editor** do Supabase

2. **Verificar criação**
   - Execute a query de verificação no final do script

### Método 3: Via Interface do Site

1. **Acesse a página de registro**
   - Vá para `/auth` no seu site
   - Registre com `marketing@aerion.com.br` e `@erion@2025`

2. **Se for o primeiro usuário**
   - Automaticamente vira admin (conforme migration)

3. **Se não for o primeiro**
   - Execute o SQL do Método 1 para adicionar role admin

## ✅ Verificar se Funcionou

Execute esta query no SQL Editor:

```sql
SELECT 
  u.email,
  ur.role,
  p.full_name,
  u.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'marketing@aerion.com.br';
```

**Resultado esperado:**
- email: marketing@aerion.com.br
- role: admin
- full_name: Marketing Aerion (ou similar)

## 🔐 Testar Login

1. Acesse `/auth` no site
2. Faça login com:
   - Email: `marketing@aerion.com.br`
   - Senha: `@erion@2025`
3. Deve redirecionar para `/admin` (dashboard administrativo)

## 🚨 Troubleshooting

### Erro: "User already exists"
- O usuário já existe, apenas execute o SQL para adicionar role admin

### Erro: "Permission denied"
- Use o Método 1 (via Dashboard) que é mais seguro

### Erro: "Role already exists"
- O usuário já tem role admin, está tudo certo!

## 📞 Suporte

Se tiver problemas, verifique:
1. Se as migrations foram executadas corretamente
2. Se o projeto Supabase está ativo
3. Se as variáveis de ambiente estão configuradas
