
-- Criar tabela específica para projetos UnB gerenciados pelos órgãos
CREATE TABLE public.organization_unb_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  object text, -- objeto do projeto/contrato
  legal_instrument text, -- tipo de instrumento legal (convênio, termo, etc)
  instrument_number text, -- número do instrumento
  start_date date NOT NULL,
  end_date date,
  total_value numeric,
  status text NOT NULL DEFAULT 'planejamento',
  project_type text, -- tipo do projeto
  external_link text, -- link para documentos externos
  
  -- Escopo físico específico para projetos arquivísticos
  documents_meters numeric DEFAULT 0,
  boxes_to_describe integer DEFAULT 0,
  boxes_to_digitalize integer DEFAULT 0,
  researchers_count integer DEFAULT 0,
  
  -- Controle de progresso
  progress integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para metas dos projetos UnB dos órgãos
CREATE TABLE public.organization_unb_project_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.organization_unb_projects(id) ON DELETE CASCADE,
  number text NOT NULL,
  description text NOT NULL,
  value numeric DEFAULT 0,
  start_date date,
  end_date date,
  progress integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para responsáveis dos projetos UnB dos órgãos
CREATE TABLE public.organization_unb_project_responsibles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.organization_unb_projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para produtos das metas
CREATE TABLE public.organization_unb_goal_products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id uuid NOT NULL REFERENCES public.organization_unb_project_goals(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE public.organization_unb_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_unb_project_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_unb_project_responsibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_unb_goal_products ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - usuários só veem projetos da sua organização
CREATE POLICY "Users can view their organization projects" 
  ON public.organization_unb_projects 
  FOR SELECT 
  USING (organization_id = get_current_user_organization_id());

CREATE POLICY "Users can create projects for their organization" 
  ON public.organization_unb_projects 
  FOR INSERT 
  WITH CHECK (organization_id = get_current_user_organization_id());

CREATE POLICY "Users can update their organization projects" 
  ON public.organization_unb_projects 
  FOR UPDATE 
  USING (organization_id = get_current_user_organization_id());

CREATE POLICY "Users can delete their organization projects" 
  ON public.organization_unb_projects 
  FOR DELETE 
  USING (organization_id = get_current_user_organization_id());

-- Políticas para metas
CREATE POLICY "Users can view goals of their organization projects" 
  ON public.organization_unb_project_goals 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.organization_unb_projects 
    WHERE id = project_id AND organization_id = get_current_user_organization_id()
  ));

CREATE POLICY "Users can manage goals of their organization projects" 
  ON public.organization_unb_project_goals 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.organization_unb_projects 
    WHERE id = project_id AND organization_id = get_current_user_organization_id()
  ));

-- Políticas para responsáveis
CREATE POLICY "Users can view responsibles of their organization projects" 
  ON public.organization_unb_project_responsibles 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.organization_unb_projects 
    WHERE id = project_id AND organization_id = get_current_user_organization_id()
  ));

CREATE POLICY "Users can manage responsibles of their organization projects" 
  ON public.organization_unb_project_responsibles 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.organization_unb_projects 
    WHERE id = project_id AND organization_id = get_current_user_organization_id()
  ));

-- Políticas para produtos das metas
CREATE POLICY "Users can view goal products of their organization projects" 
  ON public.organization_unb_goal_products 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.organization_unb_project_goals g
    JOIN public.organization_unb_projects p ON g.project_id = p.id
    WHERE g.id = goal_id AND p.organization_id = get_current_user_organization_id()
  ));

CREATE POLICY "Users can manage goal products of their organization projects" 
  ON public.organization_unb_goal_products 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.organization_unb_project_goals g
    JOIN public.organization_unb_projects p ON g.project_id = p.id
    WHERE g.id = goal_id AND p.organization_id = get_current_user_organization_id()
  ));

-- Criar índices para melhor performance
CREATE INDEX idx_organization_unb_projects_org ON public.organization_unb_projects(organization_id);
CREATE INDEX idx_organization_unb_project_goals_project ON public.organization_unb_project_goals(project_id);
CREATE INDEX idx_organization_unb_project_responsibles_project ON public.organization_unb_project_responsibles(project_id);
CREATE INDEX idx_organization_unb_goal_products_goal ON public.organization_unb_goal_products(goal_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organization_unb_projects_updated_at 
  BEFORE UPDATE ON public.organization_unb_projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_unb_project_goals_updated_at 
  BEFORE UPDATE ON public.organization_unb_project_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
