
-- Adicionar campo para imagem das autoridades
ALTER TABLE authorities 
ADD COLUMN image_url text;

-- Adicionar novos campos para setores
ALTER TABLE organization_sectors 
ADD COLUMN acronym text,
ADD COLUMN state text,
ADD COLUMN city text,
ADD COLUMN siorg_code text,
ADD COLUMN parent_siorg_code text,
ADD COLUMN competence text,
ADD COLUMN purpose text,
ADD COLUMN mission text,
ADD COLUMN area_type text CHECK (area_type IN ('finalistica', 'suporte')),
ADD COLUMN contact_email text,
ADD COLUMN contact_phone text;

-- Criar bucket para armazenar imagens das autoridades
INSERT INTO storage.buckets (id, name, public)
VALUES ('authority-images', 'authority-images', true);

-- Política para permitir upload de imagens
CREATE POLICY "Allow public uploads to authority-images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'authority-images');

-- Política para permitir visualização de imagens
CREATE POLICY "Allow public access to authority-images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'authority-images');

-- Política para permitir updates de imagens
CREATE POLICY "Allow public updates to authority-images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'authority-images');

-- Política para permitir delete de imagens
CREATE POLICY "Allow public deletes to authority-images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'authority-images');
