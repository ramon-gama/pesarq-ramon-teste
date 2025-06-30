
-- Verificar dados na tabela user_profiles
SELECT id, name, email, role, organization_id, is_active 
FROM public.user_profiles 
WHERE email = 'carloshunb@gmail.com';

-- Verificar metadados do usuário na tabela auth.users (corrigido)
SELECT id, email, raw_user_meta_data, created_at 
FROM auth.users 
WHERE email = 'carloshunb@gmail.com';
