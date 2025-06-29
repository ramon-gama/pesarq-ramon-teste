
-- Inserir o Ministério da Saúde e MEC na tabela organizations se ainda não existirem
-- Usando WHERE NOT EXISTS para evitar duplicatas
INSERT INTO public.organizations (name, type, cnpj, status) 
SELECT 'Ministério da Saúde', 'federal', '00.123.456/0001-78', 'ativa'
WHERE NOT EXISTS (SELECT 1 FROM public.organizations WHERE name = 'Ministério da Saúde');

INSERT INTO public.organizations (name, type, cnpj, status) 
SELECT 'Ministério da Educação', 'federal', '00.987.654/0001-32', 'ativa'
WHERE NOT EXISTS (SELECT 1 FROM public.organizations WHERE name = 'Ministério da Educação');
