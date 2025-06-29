
-- Desabilitar RLS temporariamente para limpeza
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Remover TODAS as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_safe" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_safe" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_safe" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_own_profile_select" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_own_profile_insert" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_own_profile_update" ON public.user_profiles;
DROP POLICY IF EXISTS "UnB admins can view all profiles" ON public.user_profiles;

-- Remover funções problemáticas
DROP FUNCTION IF EXISTS public.is_admin_or_self(uuid);
DROP FUNCTION IF EXISTS public.is_current_user_admin();

-- Criar função mais simples e robusta para verificar se é Carlos
CREATE OR REPLACE FUNCTION public.is_carlos_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'carloshunb@gmail.com',
    false
  );
$$;

-- Reabilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas ultra-simples sem referências circulares
CREATE POLICY "carlos_full_access" ON public.user_profiles
FOR ALL 
TO authenticated
USING (public.is_carlos_admin())
WITH CHECK (public.is_carlos_admin());

CREATE POLICY "users_own_profile_read" ON public.user_profiles
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "users_own_profile_write" ON public.user_profiles
FOR ALL 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Permitir inserções para service role (para aprovação de solicitações)
GRANT ALL ON public.user_profiles TO service_role;
