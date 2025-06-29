
-- Remover todas as políticas RLS problemáticas que causam recursão infinita
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_safe" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_safe" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_safe" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Remover função que pode estar causando problemas
DROP FUNCTION IF EXISTS public.is_admin_or_self(uuid);

-- Criar função security definer mais simples para verificar admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'carloshunb@gmail.com'
  );
$$;

-- Criar políticas RLS simples e sem recursão
CREATE POLICY "allow_own_profile_select" ON public.user_profiles
FOR SELECT USING (
  auth.uid() = id OR public.is_current_user_admin()
);

CREATE POLICY "allow_own_profile_insert" ON public.user_profiles
FOR INSERT WITH CHECK (
  auth.uid() = id OR public.is_current_user_admin()
);

CREATE POLICY "allow_own_profile_update" ON public.user_profiles
FOR UPDATE USING (
  auth.uid() = id OR public.is_current_user_admin()
);

-- Garantir que RLS está habilitado
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
