
-- Verificar se existe perfil para o usuário
SELECT * FROM public.user_profiles WHERE email = 'carloshunb@gmail.com';

-- Se não existir, criar o perfil com role de admin
INSERT INTO public.user_profiles (id, name, email, role, organization_id, is_active)
VALUES (
  'a6b451b4-8e6b-4067-9d4a-05944a04b224',
  'Carlos Leite',
  'carloshunb@gmail.com',
  'unb_admin',
  NULL,
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'unb_admin',
  is_active = true;

-- Verificar se foi criado corretamente
SELECT * FROM public.user_profiles WHERE email = 'carloshunb@gmail.com';
