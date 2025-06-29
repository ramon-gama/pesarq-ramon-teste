
-- Criar tabela para categorias de avaliação
CREATE TABLE public.maturity_categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para subcategorias
CREATE TABLE public.maturity_subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.maturity_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para perguntas
CREATE TABLE public.maturity_questions (
  id TEXT PRIMARY KEY,
  subcategory_id TEXT NOT NULL REFERENCES public.maturity_subcategories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para opções de resposta
CREATE TABLE public.maturity_response_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES public.maturity_questions(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
  label TEXT NOT NULL,
  feedback TEXT NOT NULL,
  weight NUMERIC DEFAULT 1.0,
  deficiency_type TEXT[] DEFAULT '{}', -- Array com: 'tecnica', 'comportamental', 'ferramental'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(question_id, level)
);

-- Criar tabela para avaliações (sessões de avaliação)
CREATE TABLE public.maturity_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  organization_id UUID REFERENCES public.organizations(id),
  title TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'concluida', 'pausada')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para respostas das avaliações
CREATE TABLE public.maturity_evaluation_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_id UUID NOT NULL REFERENCES public.maturity_evaluations(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES public.maturity_questions(id),
  response_option_id UUID NOT NULL REFERENCES public.maturity_response_options(id),
  notes TEXT,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(evaluation_id, question_id)
);

-- Criar tabela para resultados calculados por categoria
CREATE TABLE public.maturity_category_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_id UUID NOT NULL REFERENCES public.maturity_evaluations(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES public.maturity_categories(id),
  average_score NUMERIC NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  answered_questions INTEGER NOT NULL DEFAULT 0,
  maturity_level TEXT,
  deficiencies_tecnica INTEGER DEFAULT 0,
  deficiencies_comportamental INTEGER DEFAULT 0,
  deficiencies_ferramental INTEGER DEFAULT 0,
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(evaluation_id, category_id)
);

-- Criar tabela para resultados calculados por subcategoria
CREATE TABLE public.maturity_subcategory_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_id UUID NOT NULL REFERENCES public.maturity_evaluations(id) ON DELETE CASCADE,
  subcategory_id TEXT NOT NULL REFERENCES public.maturity_subcategories(id),
  average_score NUMERIC NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  answered_questions INTEGER NOT NULL DEFAULT 0,
  maturity_level TEXT,
  deficiencies_tecnica INTEGER DEFAULT 0,
  deficiencies_comportamental INTEGER DEFAULT 0,
  deficiencies_ferramental INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(evaluation_id, subcategory_id)
);

-- Criar triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_maturity_categories_updated_at 
  BEFORE UPDATE ON public.maturity_categories 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maturity_subcategories_updated_at 
  BEFORE UPDATE ON public.maturity_subcategories 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maturity_questions_updated_at 
  BEFORE UPDATE ON public.maturity_questions 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maturity_response_options_updated_at 
  BEFORE UPDATE ON public.maturity_response_options 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maturity_evaluations_updated_at 
  BEFORE UPDATE ON public.maturity_evaluations 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maturity_evaluation_responses_updated_at 
  BEFORE UPDATE ON public.maturity_evaluation_responses 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maturity_category_results_updated_at 
  BEFORE UPDATE ON public.maturity_category_results 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maturity_subcategory_results_updated_at 
  BEFORE UPDATE ON public.maturity_subcategory_results 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados das categorias existentes
INSERT INTO public.maturity_categories (id, title, description, icon, color, sort_order) VALUES 
('estrategia', 'Estratégia', 'Políticas, governança e alinhamento estratégico da gestão de documentos', 'Target', 'bg-blue-500', 1),
('ciclo-vida', 'Ciclo de Vida', 'Gestão completa do ciclo de vida dos documentos', 'Activity', 'bg-green-500', 2),
('comunicacao', 'Comunicação', 'Transparência, acesso e comunicação organizacional', 'MessageSquare', 'bg-purple-500', 3),
('operacao', 'Operação', 'Processos operacionais e tecnologia de gestão de documentos', 'Settings', 'bg-orange-500', 4),
('pessoal', 'Pessoal', 'Competências, treinamento e recursos humanos', 'Users', 'bg-red-500', 5);

-- Inserir subcategorias de Estratégia
INSERT INTO public.maturity_subcategories (id, category_id, title, sort_order) VALUES 
('analise-ambiente', 'estrategia', 'Análise de Ambiente', 1),
('estrategia-curto-prazo', 'estrategia', 'Estratégia de Curto Prazo', 2);

-- Inserir perguntas da subcategoria Análise de Ambiente
INSERT INTO public.maturity_questions (id, subcategory_id, question, sort_order) VALUES 
('metodos-analise-estrategica', 'analise-ambiente', 'A Unidade de Arquivo utiliza métodos de análise estratégica (como SWOT, PESTEL, VRIO/VRIOT, etc.) para compreender seu ambiente interno e externo?', 1),
('avaliacao-requisitos-legais', 'analise-ambiente', 'Existe uma avaliação constante dos requisitos legais e normativos que impactam a gestão de documentos e do arquivo na Organização?', 2),
('tendencias-tecnologicas', 'analise-ambiente', 'A Unidade de Arquivo está a par das tendências tecnológicas que podem afetar a gestão, preservação e acesso aos documentos?', 3),
('benchmarking', 'analise-ambiente', 'A Unidade de Arquivo já realizou algum tipo de benchmarking para comparar suas práticas com outros Órgãos/Entidades semelhantes?', 4);

-- Inserir perguntas da subcategoria Estratégia de Curto Prazo
INSERT INTO public.maturity_questions (id, subcategory_id, question, sort_order) VALUES 
('diretrizes-estrategicas', 'estrategia-curto-prazo', 'A Unidade de Arquivo possui diretrizes estratégicas claras e compreendidas por todo Organização (visão, missão e objetivos a serem alcançados)?', 1),
('plano-acao', 'estrategia-curto-prazo', 'A Unidade de Arquivo possui e implementa um Plano de Ação (documento formal que descreve as ações, prazos, responsabilidades e recursos necessários para alcançar objetivos específicos)?', 2),
('recursos-suficientes', 'estrategia-curto-prazo', 'A Unidade de Arquivo tem recursos (orçamento, pessoal e infraestrutura) suficientes para implementar uma estratégia de curto prazo?', 3),
('mecanismo-priorizacao', 'estrategia-curto-prazo', 'A Unidade de Arquivo possui algum mecanismo para priorizar atividades emergenciais na ausência de uma estratégia de curto prazo?', 4);

-- Inserir opções de resposta para todas as perguntas (exemplo para a primeira pergunta)
INSERT INTO public.maturity_response_options (question_id, level, label, feedback, weight, deficiency_type) VALUES 
('metodos-analise-estrategica', 1, 'Não', 'É crucial que a unidade de Arquivo considere adotar ferramentas de análise estratégica. Compreender seu ambiente interno e externo é vital para se adaptar às mudanças, identificar oportunidades e abordar ameaças de forma proativa. A ausência dessas análises pode comprometer a capacidade da unidade de tomar decisões assertivas e planejar o futuro.', 1.0, '{"tecnica", "ferramental"}'),
('metodos-analise-estrategica', 2, 'Parcialmente', 'É um começo positivo que a unidade de Arquivo esteja explorando métodos de análise estratégica. No entanto, para obter uma visão mais clara e abrangente, seria benéfico implementar essas ferramentas de maneira mais consistente. Isso permitirá identificar e responder mais efetivamente às oportunidades e ameaças.', 2.0, '{"tecnica"}'),
('metodos-analise-estrategica', 3, 'Sim', 'A Unidade de Arquivo está no caminho certo! A implementação regular de métodos de análise estratégica demonstra um compromisso em compreender e responder ao ambiente da unidade de Arquivo. Para aprimorar ainda mais, considere revisões periódicas para garantir que as ferramentas estejam atualizadas e sejam as mais relevantes para os desafios atuais.', 3.0, '{}'),
('metodos-analise-estrategica', 5, 'Sim, Otimizado', 'Parabéns!! A Unidade de Arquivo possui o nível máximo nesse quesito! A otimização dos métodos de análise estratégica indica uma abordagem proativa e altamente estratégica. Continuem buscando melhorias e adaptações conforme o ambiente evolui, e considerem compartilhar melhores práticas com outras unidades ou departamentos para promover uma cultura de análise estratégica em toda a organização.', 5.0, '{}');

-- Habilitar RLS nas tabelas
ALTER TABLE public.maturity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_response_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_evaluation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_category_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_subcategory_results ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para leitura pública das estruturas de avaliação
CREATE POLICY "Anyone can view maturity categories" ON public.maturity_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view maturity subcategories" ON public.maturity_subcategories FOR SELECT USING (true);
CREATE POLICY "Anyone can view maturity questions" ON public.maturity_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can view maturity response options" ON public.maturity_response_options FOR SELECT USING (true);

-- Políticas RLS para avaliações (apenas usuários autenticados)
CREATE POLICY "Users can view their own evaluations" ON public.maturity_evaluations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own evaluations" ON public.maturity_evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own evaluations" ON public.maturity_evaluations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own evaluations" ON public.maturity_evaluations FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para respostas
CREATE POLICY "Users can view responses from their evaluations" ON public.maturity_evaluation_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.maturity_evaluations WHERE id = evaluation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create responses for their evaluations" ON public.maturity_evaluation_responses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.maturity_evaluations WHERE id = evaluation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update responses from their evaluations" ON public.maturity_evaluation_responses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.maturity_evaluations WHERE id = evaluation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete responses from their evaluations" ON public.maturity_evaluation_responses FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.maturity_evaluations WHERE id = evaluation_id AND user_id = auth.uid())
);

-- Políticas RLS para resultados de categoria
CREATE POLICY "Users can view results from their evaluations" ON public.maturity_category_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.maturity_evaluations WHERE id = evaluation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create results for their evaluations" ON public.maturity_category_results FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.maturity_evaluations WHERE id = evaluation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update results from their evaluations" ON public.maturity_category_results FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.maturity_evaluations WHERE id = evaluation_id AND user_id = auth.uid())
);

-- Políticas RLS para resultados de subcategoria
CREATE POLICY "Users can view subcategory results from their evaluations" ON public.maturity_subcategory_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.maturity_evaluations WHERE id = evaluation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create subcategory results for their evaluations" ON public.maturity_subcategory_results FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.maturity_evaluations WHERE id = evaluation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update subcategory results from their evaluations" ON public.maturity_subcategory_results FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.maturity_evaluations WHERE id = evaluation_id AND user_id = auth.uid())
);
