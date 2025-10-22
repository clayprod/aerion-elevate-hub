-- SQL para criar usuário admin: marketing@aerion.com.br
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Criar usuário na tabela auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'marketing@aerion.com.br',
  crypt('@erion@2025', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Marketing Aerion"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- 2. Obter o ID do usuário criado
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Buscar o ID do usuário criado
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = 'marketing@aerion.com.br';
  
  -- 3. Criar perfil do usuário
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (user_uuid, 'Marketing Aerion', now(), now())
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    updated_at = now();
  
  -- 4. Adicionar role de admin
  INSERT INTO public.user_roles (user_id, role, created_at)
  VALUES (user_uuid, 'admin', now())
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Mostrar resultado
  RAISE NOTICE 'Usuário admin criado com sucesso!';
  RAISE NOTICE 'Email: marketing@aerion.com.br';
  RAISE NOTICE 'Senha: @erion@2025';
  RAISE NOTICE 'User ID: %', user_uuid;
END $$;
