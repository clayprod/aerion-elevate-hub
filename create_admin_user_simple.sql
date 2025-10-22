-- SQL SIMPLES para criar usuário admin: marketing@aerion.com.br
-- Execute este script no SQL Editor do Supabase Dashboard

-- Método 1: Se você já tem o usuário criado via interface do Supabase
-- Substitua 'USER_UID_AQUI' pelo UID do usuário marketing@aerion.com.br

-- Adicionar role de admin para usuário existente
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT 
  u.id,
  'admin',
  now()
FROM auth.users u
WHERE u.email = 'marketing@aerion.com.br'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verificar se foi criado
SELECT 
  u.email,
  ur.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'marketing@aerion.com.br';
