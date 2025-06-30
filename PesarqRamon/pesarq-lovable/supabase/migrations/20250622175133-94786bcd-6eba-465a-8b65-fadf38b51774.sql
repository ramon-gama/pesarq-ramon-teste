
-- Verificar e ajustar as políticas RLS para a tabela organization_unb_projects
-- Primeiro, vamos remover as políticas existentes se houver
DROP POLICY IF EXISTS "Users can create organization projects" ON public.organization_unb_projects;
DROP POLICY IF EXISTS "Users can view organization projects" ON public.organization_unb_projects;
DROP POLICY IF EXISTS "Users can update organization projects" ON public.organization_unb_projects;
DROP POLICY IF EXISTS "Users can delete organization projects" ON public.organization_unb_projects;

-- Criar função para verificar se o usuário é admin UnB
CREATE OR REPLACE FUNCTION public.is_unb_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = auth.uid() 
    AND role = 'unb_admin'
    AND is_active = true
  );
$$;

-- Criar função para obter a organização do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id
  FROM public.user_profiles
  WHERE id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

-- Política para SELECT: Admin pode ver todos os projetos, usuários normais só da sua organização
CREATE POLICY "Allow project viewing" 
  ON public.organization_unb_projects 
  FOR SELECT 
  USING (
    public.is_unb_admin() OR 
    organization_id = public.get_user_organization_id()
  );

-- Política para INSERT: Admin pode criar em qualquer organização, usuários normais só na sua
CREATE POLICY "Allow project creation" 
  ON public.organization_unb_projects 
  FOR INSERT 
  WITH CHECK (
    public.is_unb_admin() OR 
    organization_id = public.get_user_organization_id()
  );

-- Política para UPDATE: Admin pode atualizar qualquer projeto, usuários normais só da sua organização
CREATE POLICY "Allow project updates" 
  ON public.organization_unb_projects 
  FOR UPDATE 
  USING (
    public.is_unb_admin() OR 
    organization_id = public.get_user_organization_id()
  );

-- Política para DELETE: Admin pode deletar qualquer projeto, usuários normais só da sua organização
CREATE POLICY "Allow project deletion" 
  ON public.organization_unb_projects 
  FOR DELETE 
  USING (
    public.is_unb_admin() OR 
    organization_id = public.get_user_organization_id()
  );

-- Garantir que RLS está habilitado
ALTER TABLE public.organization_unb_projects ENABLE ROW LEVEL SECURITY;
