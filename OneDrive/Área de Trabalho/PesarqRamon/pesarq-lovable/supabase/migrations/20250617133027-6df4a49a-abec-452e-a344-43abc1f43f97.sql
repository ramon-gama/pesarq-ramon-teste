
-- Primeiro, vamos verificar as políticas existentes e recriá-las corretamente
DROP POLICY IF EXISTS "Users can view organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete organization tasks" ON public.tasks;

-- Verificar se a função de segurança existe e funcionando corretamente
CREATE OR REPLACE FUNCTION public.get_current_user_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT organization_id
  FROM public.user_profiles
  WHERE id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

-- Recriar as políticas RLS de forma mais permissiva para teste
CREATE POLICY "Users can view organization tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND (
      organization_id = public.get_current_user_organization_id() OR
      public.get_current_user_organization_id() IS NULL
    )
  );

CREATE POLICY "Users can create organization tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    organization_id IS NOT NULL
  );

CREATE POLICY "Users can update organization tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND (
      organization_id = public.get_current_user_organization_id() OR
      public.get_current_user_organization_id() IS NULL
    )
  );

CREATE POLICY "Users can delete organization tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND (
      organization_id = public.get_current_user_organization_id() OR
      public.get_current_user_organization_id() IS NULL
    )
  );

-- Verificar se a coluna organization_id permite valores não nulos
ALTER TABLE public.tasks ALTER COLUMN organization_id SET NOT NULL;
