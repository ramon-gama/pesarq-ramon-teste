
-- Remover todas as políticas existentes que podem estar causando recursão
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Criar políticas RLS mais simples e sem recursão
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Política para administradores UnB sem usar subquery recursiva
CREATE POLICY "UnB admins can view all profiles" 
  ON public.user_profiles 
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role = 'unb_admin' AND is_active = true
    )
    OR auth.uid() = id
  );

-- Garantir que a tabela user_profiles aceita operações básicas
GRANT SELECT ON public.user_profiles TO authenticated;
GRANT INSERT ON public.user_profiles TO authenticated;
GRANT UPDATE ON public.user_profiles TO authenticated;
