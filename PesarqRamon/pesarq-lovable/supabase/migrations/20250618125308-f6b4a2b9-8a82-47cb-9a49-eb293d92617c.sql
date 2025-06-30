
-- Solução definitiva para recursão infinita em user_profiles
-- Remover TODAS as políticas e funções problemáticas

-- Desabilitar RLS temporariamente
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Remover TODAS as políticas existentes (incluindo as mais recentes)
DROP POLICY IF EXISTS "carlos_full_access" ON public.user_profiles;
DROP POLICY IF EXISTS "users_own_profile_read" ON public.user_profiles;
DROP POLICY IF EXISTS "users_own_profile_write" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_own_profile_select" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_own_profile_insert" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_own_profile_update" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- Remover funções problemáticas
DROP FUNCTION IF EXISTS public.is_carlos_admin();
DROP FUNCTION IF EXISTS public.is_current_user_admin();
DROP FUNCTION IF EXISTS public.is_admin_or_self(uuid);

-- Criar uma função extremamente simples sem referências circulares
CREATE OR REPLACE FUNCTION public.check_user_access(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    CASE 
      -- Permitir se é o próprio usuário
      WHEN auth.uid() = target_user_id THEN true
      -- Permitir se é o Carlos (admin)
      WHEN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND email = 'carloshunb@gmail.com'
      ) THEN true
      ELSE false
    END;
$$;

-- Reabilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Criar UMA política simples que cobre tudo
CREATE POLICY "user_access_policy" ON public.user_profiles
FOR ALL 
TO authenticated
USING (public.check_user_access(id))
WITH CHECK (public.check_user_access(id));

-- Garantir permissões para service_role (para operações administrativas)
GRANT ALL ON public.user_profiles TO service_role;

-- Permitir que authenticated users façam SELECT e INSERT básicos
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
