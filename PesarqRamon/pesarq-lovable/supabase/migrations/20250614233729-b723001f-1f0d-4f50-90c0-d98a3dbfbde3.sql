
-- Criar tabela para ações dos objetivos estratégicos
CREATE TABLE public.strategic_plan_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  objective_id UUID NOT NULL REFERENCES public.strategic_plan_objectives(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  progress_type TEXT DEFAULT 'manual', -- 'manual' ou 'automatic'
  service_type TEXT, -- para cálculo automático baseado em serviços
  target_metric TEXT, -- meta numérica para o objetivo
  current_value INTEGER DEFAULT 0,
  responsible_person TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar colunas aos objetivos estratégicos
ALTER TABLE public.strategic_plan_objectives ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE public.strategic_plan_objectives ADD COLUMN IF NOT EXISTS target_metric TEXT;
ALTER TABLE public.strategic_plan_objectives ADD COLUMN IF NOT EXISTS progress_type TEXT DEFAULT 'manual';
ALTER TABLE public.strategic_plan_objectives ADD COLUMN IF NOT EXISTS responsible_person TEXT;
ALTER TABLE public.strategic_plan_objectives ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.strategic_plan_objectives ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.strategic_plan_objectives ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress';

-- Habilitar RLS para actions
ALTER TABLE public.strategic_plan_actions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para strategic_plan_actions
CREATE POLICY "Users can view plan actions" 
  ON public.strategic_plan_actions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create plan actions" 
  ON public.strategic_plan_actions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update plan actions" 
  ON public.strategic_plan_actions 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete plan actions" 
  ON public.strategic_plan_actions 
  FOR DELETE 
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_strategic_plan_actions_updated_at BEFORE UPDATE ON public.strategic_plan_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Atualizar objetivos existentes com dados exemplo
UPDATE public.strategic_plan_objectives SET 
  service_type = 'digitization',
  target_metric = '10000',
  progress_type = 'automatic',
  responsible_person = 'João Silva',
  start_date = '2024-01-01',
  end_date = '2024-12-31',
  status = 'in_progress'
WHERE title = 'Digitalizar acervo';

UPDATE public.strategic_plan_objectives SET 
  service_type = 'classification',
  target_metric = '5000',
  progress_type = 'automatic',
  responsible_person = 'Carlos Lima',
  start_date = '2024-02-01',
  end_date = '2024-10-31',
  status = 'in_progress'
WHERE title = 'Modernizar infraestrutura';

-- Inserir ações exemplo
INSERT INTO public.strategic_plan_actions (objective_id, title, description, progress, progress_type, responsible_person, start_date, end_date, status) 
SELECT 
  id,
  'Aquisição de equipamentos de digitalização',
  'Scanner profissional e software de OCR adquiridos',
  100,
  'manual',
  'Maria Santos',
  '2024-01-01',
  '2024-03-31',
  'completed'
FROM public.strategic_plan_objectives 
WHERE title = 'Digitalizar acervo' 
LIMIT 1;

INSERT INTO public.strategic_plan_actions (objective_id, title, description, progress, progress_type, responsible_person, start_date, end_date, status)
SELECT 
  id,
  'Treinamento da equipe',
  'Capacitação em ferramentas de digitalização e qualidade',
  80,
  'manual',
  'Pedro Costa',
  '2024-02-01',
  '2024-04-30',
  'in_progress'
FROM public.strategic_plan_objectives 
WHERE title = 'Digitalizar acervo' 
LIMIT 1;
