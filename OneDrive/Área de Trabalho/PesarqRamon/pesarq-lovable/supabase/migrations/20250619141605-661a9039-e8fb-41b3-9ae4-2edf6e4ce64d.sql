
-- Habilitar real-time para a tabela de projetos UnB
ALTER TABLE public.organization_unb_projects REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.organization_unb_projects;

-- Habilitar real-time para a tabela de metas dos projetos
ALTER TABLE public.organization_unb_project_goals REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.organization_unb_project_goals;

-- Habilitar real-time para a tabela de responsáveis dos projetos
ALTER TABLE public.organization_unb_project_responsibles REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.organization_unb_project_responsibles;

-- Habilitar real-time para a tabela de produtos das metas
ALTER TABLE public.organization_unb_goal_products REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.organization_unb_goal_products;
