
-- Verificar e corrigir a função is_unb_admin para funcionar corretamente nas políticas RLS

-- Primeiro, vamos verificar se a função existe e como está implementada
SELECT proname, prosrc FROM pg_proc WHERE proname = 'is_unb_admin';

-- Recriar a função is_unb_admin com SECURITY DEFINER para evitar problemas de RLS
CREATE OR REPLACE FUNCTION public.is_unb_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = auth.uid() 
    AND role = 'unb_admin'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Verificar se as políticas estão usando corretamente a função
-- Recriar as políticas para garantir que funcionem corretamente

-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can create organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete organization tasks" ON public.tasks;

-- Política para SELECT: usuários podem ver tarefas da sua organização OU admins UnB podem ver todas
CREATE POLICY "Users can view organization tasks" 
ON public.tasks 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  (
    organization_id = public.get_current_user_organization_id() OR
    public.is_unb_admin() = true
  )
);

-- Política para INSERT: usuários podem criar tarefas para sua organização OU admins UnB para qualquer organização
CREATE POLICY "Users can create organization tasks" 
ON public.tasks 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  organization_id IS NOT NULL AND
  (
    organization_id = public.get_current_user_organization_id() OR
    public.is_unb_admin() = true
  )
);

-- Política para UPDATE: usuários podem atualizar tarefas da sua organização OU admins UnB podem atualizar todas
CREATE POLICY "Users can update organization tasks" 
ON public.tasks 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  (
    organization_id = public.get_current_user_organization_id() OR
    public.is_unb_admin() = true
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  (
    organization_id = public.get_current_user_organization_id() OR
    public.is_unb_admin() = true
  )
);

-- Política para DELETE: usuários podem deletar tarefas da sua organização OU admins UnB podem deletar todas
CREATE POLICY "Users can delete organization tasks" 
ON public.tasks 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  (
    organization_id = public.get_current_user_organization_id() OR
    public.is_unb_admin() = true
  )
);

-- Verificar se as políticas foram criadas corretamente
SELECT schemaname, tablename, policyname, permissive, cmd, qual 
FROM pg_policies 
WHERE tablename = 'tasks' 
ORDER BY policyname;

-- Testar as funções de segurança
SELECT 
  auth.uid() as current_user,
  public.get_current_user_organization_id() as user_org_id,
  public.is_unb_admin() as is_admin;
