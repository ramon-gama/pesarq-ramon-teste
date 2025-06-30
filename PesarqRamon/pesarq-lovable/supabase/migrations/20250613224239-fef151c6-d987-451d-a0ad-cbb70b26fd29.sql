
-- Verificar e adicionar campos necessários na tabela organization_team
ALTER TABLE organization_team 
ADD COLUMN IF NOT EXISTS formation_area TEXT,
ADD COLUMN IF NOT EXISTS employment_type TEXT;

-- Verificar se a coluna department está configurada corretamente
-- Ela já existe na tabela, mas vamos garantir que pode referenciar os setores
