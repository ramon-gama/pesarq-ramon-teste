
-- Remover a política existente e recriar com estrutura mais simples
DROP POLICY IF EXISTS "own_profile_only" ON public.user_profiles;

-- Desabilitar RLS temporariamente
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Remover todas as outras políticas que possam existir
DROP POLICY IF EXISTS "user_access_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "carlos_full_access" ON public.user_profiles;
DROP POLICY IF EXISTS "users_own_profile_read" ON public.user_profiles;
DROP POLICY IF EXISTS "users_own_profile_write" ON public.user_profiles;

-- Remover função problemática se existir
DROP FUNCTION IF EXISTS public.check_user_access(uuid);

-- Reabilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Criar nova política mais simples para usuários autenticados
CREATE POLICY "users_can_manage_own_profile" ON public.user_profiles
FOR ALL 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Permitir acesso total para service_role (operações administrativas)
GRANT ALL ON public.user_profiles TO service_role;

-- Permitir que admins (postgres role) tenham acesso total
GRANT ALL ON public.user_profiles TO postgres;
