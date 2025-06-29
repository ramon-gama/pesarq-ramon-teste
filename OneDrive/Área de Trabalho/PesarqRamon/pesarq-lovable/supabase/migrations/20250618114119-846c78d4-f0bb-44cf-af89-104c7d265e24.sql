
-- Remover todas as políticas problemáticas que causam recursão
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Criar função security definer para evitar recursão
CREATE OR REPLACE FUNCTION public.is_admin_or_self(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'carloshunb@gmail.com'
    );
$$;

-- Criar políticas RLS simples e sem recursão
CREATE POLICY "user_profiles_select_safe" ON public.user_profiles
FOR SELECT USING (public.is_admin_or_self(id));

CREATE POLICY "user_profiles_insert_safe" ON public.user_profiles
FOR INSERT WITH CHECK (public.is_admin_or_self(id));

CREATE POLICY "user_profiles_update_safe" ON public.user_profiles
FOR UPDATE USING (public.is_admin_or_self(id));

-- Garantir que RLS está habilitado
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
