
-- Criar políticas RLS para a tabela organization_unb_project_responsibles

-- Política para SELECT: permitir ver responsáveis dos projetos que o usuário pode ver
CREATE POLICY "Allow viewing project responsibles" 
  ON public.organization_unb_project_responsibles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_projects p 
      WHERE p.id = project_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

-- Política para INSERT: permitir criar responsáveis para projetos que o usuário pode gerenciar
CREATE POLICY "Allow creating project responsibles" 
  ON public.organization_unb_project_responsibles 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_unb_projects p 
      WHERE p.id = project_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

-- Política para UPDATE: permitir atualizar responsáveis dos projetos que o usuário pode gerenciar
CREATE POLICY "Allow updating project responsibles" 
  ON public.organization_unb_project_responsibles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_projects p 
      WHERE p.id = project_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

-- Política para DELETE: permitir excluir responsáveis dos projetos que o usuário pode gerenciar
CREATE POLICY "Allow deleting project responsibles" 
  ON public.organization_unb_project_responsibles 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_projects p 
      WHERE p.id = project_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

-- Garantir que RLS está habilitado na tabela
ALTER TABLE public.organization_unb_project_responsibles ENABLE ROW LEVEL SECURITY;
