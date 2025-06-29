
-- Adicionar colunas para unidade personalizada e suporte
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS custom_unit TEXT,
ADD COLUMN IF NOT EXISTS support_type TEXT;

-- Atualizar alguns registros existentes para demonstrar os novos campos
UPDATE public.services 
SET custom_unit = unit, support_type = 'Papel'
WHERE id = '00000000-0000-0000-0000-000000000001';

UPDATE public.services 
SET custom_unit = unit, support_type = 'Digital'
WHERE id = '00000000-0000-0000-0000-000000000002';

UPDATE public.services 
SET custom_unit = unit, support_type = 'Papel'
WHERE id = '00000000-0000-0000-0000-000000000003';
