
-- Verificar e ajustar a estrutura da tabela authorities
-- Adicionando as colunas que estão faltando baseado no código
ALTER TABLE authorities 
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date,
ADD COLUMN IF NOT EXISTS fund_id uuid;

-- Remover colunas que não são mais necessárias se existirem
ALTER TABLE authorities 
DROP COLUMN IF EXISTS birth_date,
DROP COLUMN IF EXISTS death_date,
DROP COLUMN IF EXISTS department;
