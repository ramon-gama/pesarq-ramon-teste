
-- Criar tabela para solicitações de novos tipos de serviços
CREATE TABLE public.service_type_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requested_type_name text NOT NULL,
  description text,
  justification text,
  suggested_unit text,
  suggested_indicator text,
  examples text,
  organization_id uuid REFERENCES public.organizations(id),
  requested_by uuid,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.service_type_requests ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem suas próprias solicitações
CREATE POLICY "Users can view their own service type requests" 
  ON public.service_type_requests 
  FOR SELECT 
  USING (requested_by = auth.uid() OR organization_id IN (
    SELECT organization_id FROM user_profiles WHERE id = auth.uid()
  ));

-- Política para usuários criarem solicitações
CREATE POLICY "Users can create service type requests" 
  ON public.service_type_requests 
  FOR INSERT 
  WITH CHECK (requested_by = auth.uid());

-- Política para administradores verem todas as solicitações
CREATE POLICY "Admins can view all service type requests" 
  ON public.service_type_requests 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_service_type_requests_updated_at
  BEFORE UPDATE ON public.service_type_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
