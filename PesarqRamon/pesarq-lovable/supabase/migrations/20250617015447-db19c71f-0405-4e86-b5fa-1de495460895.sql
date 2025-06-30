
-- Adicionar campo acronym (sigla) à tabela organizations
ALTER TABLE public.organizations 
ADD COLUMN acronym text;

-- Comentário: Este campo armazenará a sigla/acrônimo da organização
COMMENT ON COLUMN public.organizations.acronym IS 'Sigla ou acrônimo da organização';
