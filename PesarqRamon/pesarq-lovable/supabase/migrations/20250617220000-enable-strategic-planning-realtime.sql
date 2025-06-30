
-- Habilitar realtime para as tabelas de planejamento estratégico
ALTER TABLE public.strategic_plans REPLICA IDENTITY FULL;
ALTER TABLE public.strategic_plan_objectives REPLICA IDENTITY FULL;
ALTER TABLE public.strategic_plan_actions REPLICA IDENTITY FULL;
ALTER TABLE public.strategic_plan_team_members REPLICA IDENTITY FULL;

-- Adicionar as tabelas à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.strategic_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.strategic_plan_objectives;
ALTER PUBLICATION supabase_realtime ADD TABLE public.strategic_plan_actions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.strategic_plan_team_members;
