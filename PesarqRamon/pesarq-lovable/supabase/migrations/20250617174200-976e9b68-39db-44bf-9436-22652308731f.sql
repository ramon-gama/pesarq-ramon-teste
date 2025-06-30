
-- Verificar todos os usuários na tabela user_profiles
SELECT id, name, email, role, organization_id, is_active, created_at 
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Verificar todos os usuários na tabela auth.users
SELECT id, email, raw_user_meta_data, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- Verificar se há usuários com emails similares
SELECT id, name, email, role 
FROM public.user_profiles 
WHERE email ILIKE '%carlos%' OR name ILIKE '%carlos%';
