
-- Criar função de segurança para obter a organização do usuário atual
-- Isso evita recursão nas políticas RLS
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

-- Remover políticas existentes que estão causando recursão
DROP POLICY IF EXISTS "Users can view organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete organization tasks" ON public.tasks;

-- Recriar políticas usando a função de segurança
CREATE POLICY "Users can view organization tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (organization_id = public.get_current_user_organization_id());

CREATE POLICY "Users can create organization tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (organization_id = public.get_current_user_organization_id());

CREATE POLICY "Users can update organization tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (organization_id = public.get_current_user_organization_id());

CREATE POLICY "Users can delete organization tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (organization_id = public.get_current_user_organization_id());
