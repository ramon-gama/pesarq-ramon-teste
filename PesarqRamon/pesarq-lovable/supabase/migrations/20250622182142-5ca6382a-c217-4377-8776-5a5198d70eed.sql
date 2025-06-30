
-- Criar políticas RLS para outras tabelas relacionadas aos projetos UnB

-- Políticas para organization_unb_project_goals
DROP POLICY IF EXISTS "Allow viewing project goals" ON public.organization_unb_project_goals;
DROP POLICY IF EXISTS "Allow creating project goals" ON public.organization_unb_project_goals;
DROP POLICY IF EXISTS "Allow updating project goals" ON public.organization_unb_project_goals;
DROP POLICY IF EXISTS "Allow deleting project goals" ON public.organization_unb_project_goals;

CREATE POLICY "Allow viewing project goals" 
  ON public.organization_unb_project_goals 
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

CREATE POLICY "Allow creating project goals" 
  ON public.organization_unb_project_goals 
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

CREATE POLICY "Allow updating project goals" 
  ON public.organization_unb_project_goals 
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

CREATE POLICY "Allow deleting project goals" 
  ON public.organization_unb_project_goals 
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

-- Políticas para organization_unb_goal_products
DROP POLICY IF EXISTS "Allow viewing goal products" ON public.organization_unb_goal_products;
DROP POLICY IF EXISTS "Allow creating goal products" ON public.organization_unb_goal_products;
DROP POLICY IF EXISTS "Allow updating goal products" ON public.organization_unb_goal_products;
DROP POLICY IF EXISTS "Allow deleting goal products" ON public.organization_unb_goal_products;

CREATE POLICY "Allow viewing goal products" 
  ON public.organization_unb_goal_products 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

CREATE POLICY "Allow creating goal products" 
  ON public.organization_unb_goal_products 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

CREATE POLICY "Allow updating goal products" 
  ON public.organization_unb_goal_products 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

CREATE POLICY "Allow deleting goal products" 
  ON public.organization_unb_goal_products 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

-- Políticas para organization_unb_goal_deliverables
DROP POLICY IF EXISTS "Allow viewing goal deliverables" ON public.organization_unb_goal_deliverables;
DROP POLICY IF EXISTS "Allow creating goal deliverables" ON public.organization_unb_goal_deliverables;
DROP POLICY IF EXISTS "Allow updating goal deliverables" ON public.organization_unb_goal_deliverables;
DROP POLICY IF EXISTS "Allow deleting goal deliverables" ON public.organization_unb_goal_deliverables;

CREATE POLICY "Allow viewing goal deliverables" 
  ON public.organization_unb_goal_deliverables 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

CREATE POLICY "Allow creating goal deliverables" 
  ON public.organization_unb_goal_deliverables 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

CREATE POLICY "Allow updating goal deliverables" 
  ON public.organization_unb_goal_deliverables 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

CREATE POLICY "Allow deleting goal deliverables" 
  ON public.organization_unb_goal_deliverables 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

-- Políticas para organization_unb_goal_physical_scope
DROP POLICY IF EXISTS "Allow viewing goal physical scope" ON public.organization_unb_goal_physical_scope;
DROP POLICY IF EXISTS "Allow creating goal physical scope" ON public.organization_unb_goal_physical_scope;
DROP POLICY IF EXISTS "Allow updating goal physical scope" ON public.organization_unb_goal_physical_scope;
DROP POLICY IF EXISTS "Allow deleting goal physical scope" ON public.organization_unb_goal_physical_scope;

CREATE POLICY "Allow viewing goal physical scope" 
  ON public.organization_unb_goal_physical_scope 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

CREATE POLICY "Allow creating goal physical scope" 
  ON public.organization_unb_goal_physical_scope 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

CREATE POLICY "Allow updating goal physical scope" 
  ON public.organization_unb_goal_physical_scope 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

CREATE POLICY "Allow deleting goal physical scope" 
  ON public.organization_unb_goal_physical_scope 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_unb_project_goals g
      JOIN public.organization_unb_projects p ON p.id = g.project_id
      WHERE g.id = goal_id 
      AND (
        public.is_unb_admin() OR 
        p.organization_id = public.get_user_organization_id()
      )
    )
  );

-- Garantir que RLS está habilitado em todas as tabelas
ALTER TABLE public.organization_unb_project_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_unb_goal_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_unb_goal_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_unb_goal_physical_scope ENABLE ROW LEVEL SECURITY;
