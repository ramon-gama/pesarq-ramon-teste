
-- Criar tabela para planejamentos estratégicos
CREATE TABLE public.strategic_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para objetivos dos planejamentos
CREATE TABLE public.strategic_plan_objectives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.strategic_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para membros da equipe dos planejamentos
CREATE TABLE public.strategic_plan_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.strategic_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.strategic_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_plan_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_plan_team_members ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para strategic_plans
CREATE POLICY "Users can view strategic plans" 
  ON public.strategic_plans 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create strategic plans" 
  ON public.strategic_plans 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update strategic plans" 
  ON public.strategic_plans 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete strategic plans" 
  ON public.strategic_plans 
  FOR DELETE 
  USING (true);

-- Políticas RLS para strategic_plan_objectives
CREATE POLICY "Users can view plan objectives" 
  ON public.strategic_plan_objectives 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create plan objectives" 
  ON public.strategic_plan_objectives 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update plan objectives" 
  ON public.strategic_plan_objectives 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete plan objectives" 
  ON public.strategic_plan_objectives 
  FOR DELETE 
  USING (true);

-- Políticas RLS para strategic_plan_team_members
CREATE POLICY "Users can view plan team members" 
  ON public.strategic_plan_team_members 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create plan team members" 
  ON public.strategic_plan_team_members 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update plan team members" 
  ON public.strategic_plan_team_members 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete plan team members" 
  ON public.strategic_plan_team_members 
  FOR DELETE 
  USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_strategic_plans_updated_at BEFORE UPDATE ON public.strategic_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_strategic_plan_objectives_updated_at BEFORE UPDATE ON public.strategic_plan_objectives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_strategic_plan_team_members_updated_at BEFORE UPDATE ON public.strategic_plan_team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados exemplo (os mesmos que estão atualmente no mock)
INSERT INTO public.strategic_plans (id, organization_id, name, description, duration, start_date, end_date, status, progress) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Planejamento Estratégico 2024-2028', 'Planejamento principal da organização para os próximos 5 anos', 5, '2024-01-01', '2028-12-31', 'in_progress', 35),
('550e8400-e29b-41d4-a716-446655440002', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Planejamento Arquivístico 2024', 'Foco na modernização dos processos arquivísticos', 1, '2024-01-01', '2024-12-31', 'in_progress', 78),
('550e8400-e29b-41d4-a716-446655440003', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Planejamento Digitalização 2023', 'Projeto de digitalização de documentos físicos', 1, '2023-01-01', '2023-12-31', 'completed', 100),
('550e8400-e29b-41d4-a716-446655440004', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Planejamento Sustentabilidade 2025-2027', 'Iniciativas de sustentabilidade e responsabilidade ambiental', 3, '2025-01-01', '2027-12-31', 'draft', 0);

-- Inserir objetivos exemplo
INSERT INTO public.strategic_plan_objectives (plan_id, title, description, progress, completed) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Modernizar infraestrutura', 'Atualizar sistemas e equipamentos', 40, false),
('550e8400-e29b-41d4-a716-446655440001', 'Capacitar equipe', 'Treinamentos e certificações', 60, false),
('550e8400-e29b-41d4-a716-446655440001', 'Implementar novos processos', 'Otimizar fluxos de trabalho', 20, false),
('550e8400-e29b-41d4-a716-446655440002', 'Digitalizar acervo', 'Converter documentos físicos para digital', 80, false),
('550e8400-e29b-41d4-a716-446655440002', 'Implementar sistema de gestão', 'Novo software de gestão arquivística', 75, false);

-- Inserir membros da equipe exemplo
INSERT INTO public.strategic_plan_team_members (plan_id, name, role, email) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Carlos Leite', 'Coordenador Geral', 'carlos.leite@ms.gov.br'),
('550e8400-e29b-41d4-a716-446655440001', 'Ana Silva', 'Analista de Processos', 'ana.silva@ms.gov.br'),
('550e8400-e29b-41d4-a716-446655440002', 'João Santos', 'Especialista em Arquivo', 'joao.santos@ms.gov.br'),
('550e8400-e29b-41d4-a716-446655440002', 'Maria Oliveira', 'Coordenadora de Digitalização', 'maria.oliveira@ms.gov.br');
