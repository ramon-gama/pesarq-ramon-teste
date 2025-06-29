
-- Primeiro, vamos verificar se a função de segurança está funcionando corretamente
-- e se as políticas RLS estão adequadas para criação de tarefas

-- Verificar o resultado da função de segurança para o usuário atual
SELECT 
  auth.uid() as current_user_id,
  public.get_current_user_organization_id() as user_org_id;

-- Verificar o perfil do usuário atual
SELECT 
  id,
  organization_id,
  role,
  is_active
FROM public.user_profiles 
WHERE id = auth.uid();

-- Verificar as políticas RLS atuais da tabela tasks
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'tasks';

-- Recriar as políticas RLS de forma mais robusta
DROP POLICY IF EXISTS "Users can create organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete organization tasks" ON public.tasks;

-- Política para SELECT: usuários podem ver tarefas da sua organização
CREATE POLICY "Users can view organization tasks" 
ON public.tasks 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  organization_id = public.get_current_user_organization_id()
);

-- Política para INSERT: usuários podem criar tarefas para sua organização
CREATE POLICY "Users can create organization tasks" 
ON public.tasks 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  organization_id IS NOT NULL AND
  organization_id = public.get_current_user_organization_id()
);

-- Política para UPDATE: usuários podem atualizar tarefas da sua organização
CREATE POLICY "Users can update organization tasks" 
ON public.tasks 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  organization_id = public.get_current_user_organization_id()
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  organization_id = public.get_current_user_organization_id()
);

-- Política para DELETE: usuários podem deletar tarefas da sua organização
CREATE POLICY "Users can delete organization tasks" 
ON public.tasks 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  organization_id = public.get_current_user_organization_id()
);

-- Verificar se RLS está habilitado
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
