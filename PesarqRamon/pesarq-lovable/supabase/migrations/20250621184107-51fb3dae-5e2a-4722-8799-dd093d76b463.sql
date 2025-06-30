
-- Criar tabela para locais de armazenamento
CREATE TABLE public.storage_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  responsible_person TEXT,
  capacity_percentage INTEGER DEFAULT 0 CHECK (capacity_percentage >= 0 AND capacity_percentage <= 100),
  total_documents INTEGER DEFAULT 0,
  document_types JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'manutencao')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS
ALTER TABLE public.storage_locations ENABLE ROW LEVEL SECURITY;

-- Política para visualizar locais de armazenamento (temporariamente permissiva)
CREATE POLICY "Users can view storage locations" 
  ON public.storage_locations 
  FOR SELECT 
  USING (true);

-- Política para inserir locais de armazenamento (temporariamente permissiva)
CREATE POLICY "Users can create storage locations" 
  ON public.storage_locations 
  FOR INSERT 
  WITH CHECK (true);

-- Política para atualizar locais de armazenamento (temporariamente permissiva)
CREATE POLICY "Users can update storage locations" 
  ON public.storage_locations 
  FOR UPDATE 
  USING (true);

-- Política para deletar locais de armazenamento (temporariamente permissiva)
CREATE POLICY "Users can delete storage locations" 
  ON public.storage_locations 
  FOR DELETE 
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_storage_locations_updated_at
  BEFORE UPDATE ON public.storage_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
