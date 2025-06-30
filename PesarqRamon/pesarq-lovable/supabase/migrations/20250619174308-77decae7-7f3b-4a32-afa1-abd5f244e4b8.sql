
-- Adicionar a coluna 'title' na tabela organization_unb_project_goals
ALTER TABLE public.organization_unb_project_goals 
ADD COLUMN IF NOT EXISTS title TEXT;
