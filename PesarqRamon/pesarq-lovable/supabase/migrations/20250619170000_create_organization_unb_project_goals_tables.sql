
-- Criar tabela de metas de projetos UnB (caso não exista)
CREATE TABLE IF NOT EXISTS public.organization_unb_project_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.organization_unb_projects(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  title TEXT,
  description TEXT NOT NULL,
  responsible TEXT,
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  progress_type TEXT DEFAULT 'manual' CHECK (progress_type IN ('manual', 'automatic')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de entregáveis das metas (caso não exista)
CREATE TABLE IF NOT EXISTS public.organization_unb_goal_deliverables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.organization_unb_project_goals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de escopo físico das metas (caso não exista)
CREATE TABLE IF NOT EXISTS public.organization_unb_goal_physical_scope (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.organization_unb_project_goals(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  indicator TEXT NOT NULL,
  target_quantity NUMERIC NOT NULL DEFAULT 0,
  current_quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_organization_unb_project_goals_updated_at') THEN
        CREATE TRIGGER update_organization_unb_project_goals_updated_at
            BEFORE UPDATE ON public.organization_unb_project_goals
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_organization_unb_goal_deliverables_updated_at') THEN
        CREATE TRIGGER update_organization_unb_goal_deliverables_updated_at
            BEFORE UPDATE ON public.organization_unb_goal_deliverables
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_organization_unb_goal_physical_scope_updated_at') THEN
        CREATE TRIGGER update_organization_unb_goal_physical_scope_updated_at
            BEFORE UPDATE ON public.organization_unb_goal_physical_scope
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Habilitar RLS nas tabelas
ALTER TABLE public.organization_unb_project_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_unb_goal_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_unb_goal_physical_scope ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para metas de projetos
DROP POLICY IF EXISTS "Users can view goals from their organization projects" ON public.organization_unb_project_goals;
CREATE POLICY "Users can view goals from their organization projects" 
ON public.organization_unb_project_goals FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_unb_projects p
    JOIN public.user_profiles up ON up.organization_id = p.organization_id
    WHERE p.id = project_id AND up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert goals in their organization projects" ON public.organization_unb_project_goals;
CREATE POLICY "Users can insert goals in their organization projects" 
ON public.organization_unb_project_goals FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organization_unb_projects p
    JOIN public.user_profiles up ON up.organization_id = p.organization_id
    WHERE p.id = project_id AND up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update goals from their organization projects" ON public.organization_unb_project_goals;
CREATE POLICY "Users can update goals from their organization projects" 
ON public.organization_unb_project_goals FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_unb_projects p
    JOIN public.user_profiles up ON up.organization_id = p.organization_id
    WHERE p.id = project_id AND up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete goals from their organization projects" ON public.organization_unb_project_goals;
CREATE POLICY "Users can delete goals from their organization projects" 
ON public.organization_unb_project_goals FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_unb_projects p
    JOIN public.user_profiles up ON up.organization_id = p.organization_id
    WHERE p.id = project_id AND up.id = auth.uid()
  )
);

-- Políticas para entregáveis
DROP POLICY IF EXISTS "Users can manage deliverables from their organization project goals" ON public.organization_unb_goal_deliverables;
CREATE POLICY "Users can manage deliverables from their organization project goals" 
ON public.organization_unb_goal_deliverables FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_unb_project_goals g
    JOIN public.organization_unb_projects p ON p.id = g.project_id
    JOIN public.user_profiles up ON up.organization_id = p.organization_id
    WHERE g.id = goal_id AND up.id = auth.uid()
  )
);

-- Políticas para escopo físico
DROP POLICY IF EXISTS "Users can manage physical scope from their organization project goals" ON public.organization_unb_goal_physical_scope;
CREATE POLICY "Users can manage physical scope from their organization project goals" 
ON public.organization_unb_goal_physical_scope FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_unb_project_goals g
    JOIN public.organization_unb_projects p ON p.id = g.project_id
    JOIN public.user_profiles up ON up.organization_id = p.organization_id
    WHERE g.id = goal_id AND up.id = auth.uid()
  )
);

-- Habilitar realtime para as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE public.organization_unb_project_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.organization_unb_goal_deliverables;
ALTER PUBLICATION supabase_realtime ADD TABLE public.organization_unb_goal_physical_scope;

-- Configurar REPLICA IDENTITY para realtime
ALTER TABLE public.organization_unb_project_goals REPLICA IDENTITY FULL;
ALTER TABLE public.organization_unb_goal_deliverables REPLICA IDENTITY FULL;
ALTER TABLE public.organization_unb_goal_physical_scope REPLICA IDENTITY FULL;
