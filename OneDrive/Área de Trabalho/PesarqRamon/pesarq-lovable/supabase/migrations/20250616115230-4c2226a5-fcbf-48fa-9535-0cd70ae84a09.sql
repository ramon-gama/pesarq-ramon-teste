
-- Adicionar campo logo_url na tabela organizations
ALTER TABLE public.organizations 
ADD COLUMN logo_url text;

-- Comentário: Este campo armazenará a URL da logo da organização
COMMENT ON COLUMN public.organizations.logo_url IS 'URL da logo da organização';
