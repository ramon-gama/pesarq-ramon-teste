
-- Verificar e corrigir a foreign key na tabela archival_fund_extensions
ALTER TABLE archival_fund_extensions 
DROP CONSTRAINT IF EXISTS archival_fund_extensions_fund_id_fkey;

ALTER TABLE archival_fund_extensions 
ADD CONSTRAINT archival_fund_extensions_fund_id_fkey 
FOREIGN KEY (fund_id) REFERENCES archival_funds(id) ON DELETE CASCADE;
