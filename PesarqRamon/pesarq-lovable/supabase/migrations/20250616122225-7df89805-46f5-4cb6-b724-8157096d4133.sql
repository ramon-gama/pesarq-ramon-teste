
-- Criar tabela para solicitações de acesso
CREATE TABLE IF NOT EXISTS public.access_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  organization_id uuid REFERENCES public.organizations(id),
  requested_role text NOT NULL CHECK (requested_role IN ('unb_researcher', 'partner_admin', 'partner_user')),
  justification text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  documents jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamp with time zone
);

-- Habilitar RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Política para administradores verem todas as solicitações
CREATE POLICY "Admins can view all access requests" 
  ON public.access_requests 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Política para administradores atualizarem solicitações
CREATE POLICY "Admins can update access requests" 
  ON public.access_requests 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Política para usuários criarem suas próprias solicitações
CREATE POLICY "Users can create access requests" 
  ON public.access_requests 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_access_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_access_requests_updated_at
  BEFORE UPDATE ON public.access_requests
  FOR EACH ROW EXECUTE FUNCTION update_access_requests_updated_at();

-- Inserir alguns dados de exemplo
INSERT INTO public.access_requests (name, email, organization_id, requested_role, justification, status, documents) VALUES
('João Silva', 'joao.silva@prefeitura.gov.br', (SELECT id FROM public.organizations LIMIT 1), 'partner_admin', 'Necessito de acesso para implementar sistema de gestão documental na prefeitura.', 'pending', '["comprovante-vinculo.pdf", "carta-autorizacao.pdf"]'::jsonb),
('Maria Santos', 'maria.santos@empresa.com.br', (SELECT id FROM public.organizations LIMIT 1), 'partner_user', 'Parceria para desenvolvimento de projetos arquivísticos.', 'pending', '["contrato-parceria.pdf"]'::jsonb),
('Pedro Costa', 'pedro.costa@estado.gov.br', (SELECT id FROM public.organizations LIMIT 1), 'partner_admin', 'Implementação de políticas arquivísticas estaduais.', 'approved', '["portaria-designacao.pdf"]'::jsonb);
