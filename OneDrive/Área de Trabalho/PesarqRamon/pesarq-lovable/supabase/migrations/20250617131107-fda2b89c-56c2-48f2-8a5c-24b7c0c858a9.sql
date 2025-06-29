
-- Remover as políticas existentes que estão causando recursão
DROP POLICY IF EXISTS "Users can view organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete organization tasks" ON public.tasks;

-- Criar políticas mais simples que funcionam com a função de segurança existente
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
