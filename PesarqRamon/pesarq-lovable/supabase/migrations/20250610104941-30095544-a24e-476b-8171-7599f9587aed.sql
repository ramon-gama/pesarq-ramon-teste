
-- Criar tabela para armazenar as tarefas
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT NOT NULL,
  due_date DATE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  labels JSONB DEFAULT '[]'::jsonb,
  column_id TEXT NOT NULL CHECK (column_id IN ('todo', 'inprogress', 'review', 'done')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON public.tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais das tarefas existentes
INSERT INTO public.tasks (title, description, assignee, due_date, priority, labels, column_id) VALUES 
('Revisar documentos de arquivo', 'Revisar e catalogar novos documentos recebidos', 'João Silva', '2024-04-15', 'high', '["Urgente", "Documentação"]', 'todo'),
('Atualizar tabela de temporalidade', 'Incluir novos tipos documentais na tabela', 'Maria Santos', '2024-04-20', 'medium', '["Planejamento"]', 'todo'),
('Digitalização de processos', 'Digitalizar processos administrativos do setor', 'Pedro Costa', '2024-04-18', 'medium', '["Digitalização", "Processos"]', 'inprogress'),
('Validar plano de classificação', 'Verificar adequação do novo plano de classificação', 'Ana Oliveira', '2024-04-12', 'high', '["Revisão", "Classificação"]', 'review'),
('Treinamento de usuários', 'Capacitar equipe no novo sistema', 'Carlos Lima', '2024-04-10', 'low', '["Treinamento", "Concluído"]', 'done');
