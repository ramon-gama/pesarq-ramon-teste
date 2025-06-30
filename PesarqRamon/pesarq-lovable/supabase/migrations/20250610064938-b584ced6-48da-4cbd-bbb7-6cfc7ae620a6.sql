
-- Adicionar os novos campos necessários para o fundo arquivístico
ALTER TABLE archival_funds 
ADD COLUMN IF NOT EXISTS description_level text DEFAULT 'fundo',
ADD COLUMN IF NOT EXISTS extension_number text,
ADD COLUMN IF NOT EXISTS extension_unit text,
ADD COLUMN IF NOT EXISTS support_type text,
ADD COLUMN IF NOT EXISTS producer_name text,
ADD COLUMN IF NOT EXISTS origin_trajectory text,
ADD COLUMN IF NOT EXISTS constitution_nature text,
ADD COLUMN IF NOT EXISTS constitution_other text,
ADD COLUMN IF NOT EXISTS scope_content text,
ADD COLUMN IF NOT EXISTS organization text,
ADD COLUMN IF NOT EXISTS evaluation_temporality text,
ADD COLUMN IF NOT EXISTS access_restrictions text,
ADD COLUMN IF NOT EXISTS predominant_languages text,
ADD COLUMN IF NOT EXISTS research_instruments jsonb DEFAULT '{"inventory": false, "guide": false, "catalog": false, "other": false}',
ADD COLUMN IF NOT EXISTS research_instruments_description text,
ADD COLUMN IF NOT EXISTS related_funds text,
ADD COLUMN IF NOT EXISTS complementary_notes text,
ADD COLUMN IF NOT EXISTS description_responsible text,
ADD COLUMN IF NOT EXISTS description_date date,
ADD COLUMN IF NOT EXISTS used_standards text,
ADD COLUMN IF NOT EXISTS last_update_date date,
ADD COLUMN IF NOT EXISTS extensions jsonb DEFAULT '[]';

-- Criar uma tabela separada para armazenar múltiplas extensões/suportes
CREATE TABLE IF NOT EXISTS archival_fund_extensions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_id uuid REFERENCES archival_funds(id) ON DELETE CASCADE,
  quantity text,
  unit text,
  support_type text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE TRIGGER update_archival_fund_extensions_updated_at
    BEFORE UPDATE ON archival_fund_extensions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
