
-- Adicionar colunas de missão, visão e valores à tabela strategic_plans
ALTER TABLE strategic_plans 
ADD COLUMN mission text,
ADD COLUMN vision text,
ADD COLUMN values jsonb DEFAULT '[]'::jsonb;
