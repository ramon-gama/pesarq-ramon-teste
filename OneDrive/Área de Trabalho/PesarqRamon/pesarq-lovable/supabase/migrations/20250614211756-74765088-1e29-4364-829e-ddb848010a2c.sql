
-- Habilitar RLS nas tabelas de maturidade (se não estiver habilitado)
ALTER TABLE public.maturity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_response_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_evaluation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_category_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_subcategory_results ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas para administradores (permitir todas as operações)
-- Categorias
DROP POLICY IF EXISTS "Allow all operations on maturity_categories" ON public.maturity_categories;
CREATE POLICY "Allow all operations on maturity_categories" ON public.maturity_categories FOR ALL USING (true) WITH CHECK (true);

-- Subcategorias
DROP POLICY IF EXISTS "Allow all operations on maturity_subcategories" ON public.maturity_subcategories;
CREATE POLICY "Allow all operations on maturity_subcategories" ON public.maturity_subcategories FOR ALL USING (true) WITH CHECK (true);

-- Perguntas
DROP POLICY IF EXISTS "Allow all operations on maturity_questions" ON public.maturity_questions;
CREATE POLICY "Allow all operations on maturity_questions" ON public.maturity_questions FOR ALL USING (true) WITH CHECK (true);

-- Opções de resposta
DROP POLICY IF EXISTS "Allow all operations on maturity_response_options" ON public.maturity_response_options;
CREATE POLICY "Allow all operations on maturity_response_options" ON public.maturity_response_options FOR ALL USING (true) WITH CHECK (true);

-- Avaliações
DROP POLICY IF EXISTS "Allow all operations on maturity_evaluations" ON public.maturity_evaluations;
CREATE POLICY "Allow all operations on maturity_evaluations" ON public.maturity_evaluations FOR ALL USING (true) WITH CHECK (true);

-- Respostas de avaliação
DROP POLICY IF EXISTS "Allow all operations on maturity_evaluation_responses" ON public.maturity_evaluation_responses;
CREATE POLICY "Allow all operations on maturity_evaluation_responses" ON public.maturity_evaluation_responses FOR ALL USING (true) WITH CHECK (true);

-- Resultados de categoria
DROP POLICY IF EXISTS "Allow all operations on maturity_category_results" ON public.maturity_category_results;
CREATE POLICY "Allow all operations on maturity_category_results" ON public.maturity_category_results FOR ALL USING (true) WITH CHECK (true);

-- Resultados de subcategoria
DROP POLICY IF EXISTS "Allow all operations on maturity_subcategory_results" ON public.maturity_subcategory_results;
CREATE POLICY "Allow all operations on maturity_subcategory_results" ON public.maturity_subcategory_results FOR ALL USING (true) WITH CHECK (true);

-- Adicionar constraints de chave estrangeira para garantir integridade (se não existirem)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_subcategory_category'
    ) THEN
        ALTER TABLE public.maturity_subcategories 
        ADD CONSTRAINT fk_subcategory_category 
        FOREIGN KEY (category_id) REFERENCES public.maturity_categories(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_question_subcategory'
    ) THEN
        ALTER TABLE public.maturity_questions 
        ADD CONSTRAINT fk_question_subcategory 
        FOREIGN KEY (subcategory_id) REFERENCES public.maturity_subcategories(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_response_question'
    ) THEN
        ALTER TABLE public.maturity_response_options 
        ADD CONSTRAINT fk_response_question 
        FOREIGN KEY (question_id) REFERENCES public.maturity_questions(id) 
        ON DELETE CASCADE;
    END IF;
END $$;
