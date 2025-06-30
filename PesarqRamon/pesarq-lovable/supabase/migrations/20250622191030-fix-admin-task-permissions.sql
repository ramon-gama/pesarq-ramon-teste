
-- Ajustar políticas RLS para permitir que admins UnB gerenciem tarefas de todas as organizações

-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can create organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete organization tasks" ON public.tasks;

-- Política para SELECT: usuários podem ver tarefas da sua organização OU admins podem ver todas
CREATE POLICY "Users can view organization tasks" 
ON public.tasks 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  (
    organization_id = public.get_current_user_organization_id() OR
    public.is_unb_admin()
  )
);

-- Política para INSERT: usuários podem criar tarefas para sua organização OU admins para qualquer organização
CREATE POLICY "Users can create organization tasks" 
ON public.tasks 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  organization_id IS NOT NULL AND
  (
    organization_id = public.get_current_user_organization_id() OR
    public.is_unb_admin()
  )
);

-- Política para UPDATE: usuários podem atualizar tarefas da sua organização OU admins podem atualizar todas
CREATE POLICY "Users can update organization tasks" 
ON public.tasks 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  (
    organization_id = public.get_current_user_organization_id() OR
    public.is_unb_admin()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  (
    organization_id = public.get_current_user_organization_id() OR
    public.is_unb_admin()
  )
);

-- Política para DELETE: usuários podem deletar tarefas da sua organização OU admins podem deletar todas
CREATE POLICY "Users can delete organization tasks" 
ON public.tasks 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  (
    organization_id = public.get_current_user_organization_id() OR
    public.is_unb_admin()
  )
);
