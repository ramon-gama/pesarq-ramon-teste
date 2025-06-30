
-- Verificar se existe um perfil para o usuário atual
SELECT id, name, email, role, organization_id, is_active 
FROM public.user_profiles 
WHERE email = 'carloshunb@gmail.com';

-- Se não existir, vamos criar um perfil para este usuário
INSERT INTO public.user_profiles (id, name, email, role, organization_id, is_active)
SELECT 
  id,
  'Carlos Leite',  -- Nome completo que você quer ver
  email,
  'unb_admin',
  NULL,
  true
FROM auth.users 
WHERE email = 'carloshunb@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE user_profiles.id = auth.users.id
);

-- Atualizar o nome se o perfil já existir mas o nome estiver incorreto
UPDATE public.user_profiles 
SET name = 'Carlos Leite'
WHERE email = 'carloshunb@gmail.com' 
AND (name IS NULL OR name = '' OR name = 'carloshunb@gmail.com');
