
-- Habilitar Row Level Security na tabela organization_unb_projects
ALTER TABLE public.organization_unb_projects ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam projetos de sua organização
CREATE POLICY "Users can view organization projects" 
  ON public.organization_unb_projects 
  FOR SELECT 
  USING (
    organization_id = get_current_user_organization_id()
  );

-- Política para permitir que usuários criem projetos em sua organização
CREATE POLICY "Users can create organization projects" 
  ON public.organization_unb_projects 
  FOR INSERT 
  WITH CHECK (
    organization_id = get_current_user_organization_id()
  );

-- Política para permitir que usuários atualizem projetos de sua organização
CREATE POLICY "Users can update organization projects" 
  ON public.organization_unb_projects 
  FOR UPDATE 
  USING (
    organization_id = get_current_user_organization_id()
  );

-- Política para permitir que usuários deletem projetos de sua organização
CREATE POLICY "Users can delete organization projects" 
  ON public.organization_unb_projects 
  FOR DELETE 
  USING (
    organization_id = get_current_user_organization_id()
  );

-- Habilitar RLS e criar políticas para tabelas relacionadas
ALTER TABLE public.organization_unb_project_responsibles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage project responsibles" 
  ON public.organization_unb_project_responsibles 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_projects 
      WHERE id = project_id 
      AND organization_id = get_current_user_organization_id()
    )
  );

-- Políticas para metas dos projetos
ALTER TABLE public.organization_unb_project_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage project goals" 
  ON public.organization_unb_project_goals 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_projects 
      WHERE id = project_id 
      AND organization_id = get_current_user_organization_id()
    )
  );

-- Políticas para entregáveis das metas
ALTER TABLE public.organization_unb_goal_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage goal deliverables" 
  ON public.organization_unb_goal_deliverables 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND p.organization_id = get_current_user_organization_id()
    )
  );

-- Políticas para escopo físico das metas
ALTER TABLE public.organization_unb_goal_physical_scope ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage goal physical scope" 
  ON public.organization_unb_goal_physical_scope 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND p.organization_id = get_current_user_organization_id()
    )
  );
