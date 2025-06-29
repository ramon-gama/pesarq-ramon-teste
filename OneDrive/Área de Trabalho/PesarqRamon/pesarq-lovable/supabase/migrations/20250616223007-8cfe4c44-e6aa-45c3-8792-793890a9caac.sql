
-- Verificar todas as organizações existentes no banco
SELECT id, name, type, status, created_at 
FROM public.organizations 
ORDER BY created_at DESC;

-- Verificar todos os perfis de usuário existentes
SELECT id, name, email, role, organization_id, is_active 
FROM public.user_profiles 
ORDER BY created_at DESC;

-- Verificar se existem usuários na tabela auth (para debug)
SELECT COUNT(*) as total_auth_users FROM auth.users;
