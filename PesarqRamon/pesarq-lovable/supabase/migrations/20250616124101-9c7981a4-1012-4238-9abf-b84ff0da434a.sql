
-- Agora vamos corrigir a constraint da tabela access_requests
ALTER TABLE public.access_requests 
DROP CONSTRAINT IF EXISTS access_requests_requested_role_check;

ALTER TABLE public.access_requests 
ADD CONSTRAINT access_requests_requested_role_check 
CHECK (requested_role IN ('unb_admin', 'unb_researcher', 'partner_admin', 'partner_user'));

-- Remover políticas existentes
DROP POLICY IF EXISTS "Admins can view all access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Admins can update access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Users can create access requests" ON public.access_requests;
DROP POLICY IF EXISTS "UnB admins can view all access requests" ON public.access_requests;
DROP POLICY IF EXISTS "UnB admins can update access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Public can create access requests" ON public.access_requests;

-- Política para administradores UnB verem todas as solicitações
CREATE POLICY "UnB admins can view all access requests" 
  ON public.access_requests 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'unb_admin'
    )
  );

-- Política para administradores UnB atualizarem solicitações
CREATE POLICY "UnB admins can update access requests" 
  ON public.access_requests 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'unb_admin'
    )
  );

-- Política para qualquer pessoa autenticada criar solicitações
CREATE POLICY "Users can create access requests" 
  ON public.access_requests 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Permitir criação pública de solicitações (para o formulário público)
CREATE POLICY "Public can create access requests" 
  ON public.access_requests 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Função corrigida para processar aprovação de solicitação
CREATE OR REPLACE FUNCTION public.approve_access_request(request_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_data access_requests%ROWTYPE;
  new_user_id uuid;
BEGIN
  -- Buscar dados da solicitação
  SELECT * INTO request_data 
  FROM public.access_requests 
  WHERE id = request_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Solicitação não encontrada ou já processada';
  END IF;
  
  -- Gerar ID para o novo usuário
  new_user_id := gen_random_uuid();
  
  -- Criar perfil de usuário diretamente
  INSERT INTO public.user_profiles (
    id, 
    name, 
    email, 
    role, 
    organization_id, 
    is_active
  ) VALUES (
    new_user_id,
    request_data.name,
    request_data.email,
    request_data.requested_role::user_role,
    request_data.organization_id,
    true
  );
  
  -- Atualizar status da solicitação
  UPDATE public.access_requests 
  SET 
    status = 'approved',
    reviewed_by = auth.uid(),
    reviewed_at = now()
  WHERE id = request_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro ao aprovar solicitação: %', SQLERRM;
END;
$$;

-- Criar tabela para notificações do sistema
CREATE TABLE IF NOT EXISTS public.system_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('access_request_created', 'access_request_approved', 'access_request_rejected')),
  title text NOT NULL,
  message text NOT NULL,
  recipient_email text NOT NULL,
  recipient_role text,
  data jsonb DEFAULT '{}'::jsonb,
  sent boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sent_at timestamp with time zone
);

-- Habilitar RLS na tabela de notificações
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;

-- Política para administradores verem todas as notificações
CREATE POLICY "Admins can view all notifications" 
  ON public.system_notifications 
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'unb_admin'
    )
  );

-- Função para criar notificações automaticamente
CREATE OR REPLACE FUNCTION public.create_access_request_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Notificar administradores sobre nova solicitação
  INSERT INTO public.system_notifications (
    type,
    title,
    message,
    recipient_email,
    recipient_role,
    data
  ) VALUES (
    'access_request_created',
    'Nova Solicitação de Acesso',
    'Uma nova solicitação de acesso foi criada por ' || NEW.name || ' (' || NEW.email || ')',
    'admin@sistema.gov.br',
    'unb_admin',
    jsonb_build_object(
      'request_id', NEW.id,
      'requester_name', NEW.name,
      'requester_email', NEW.email,
      'requested_role', NEW.requested_role
    )
  );
  
  -- Notificar o solicitante sobre o recebimento
  INSERT INTO public.system_notifications (
    type,
    title,
    message,
    recipient_email,
    data
  ) VALUES (
    'access_request_created',
    'Solicitação de Acesso Recebida',
    'Sua solicitação de acesso foi recebida e está sendo analisada. Você receberá uma resposta em breve.',
    NEW.email,
    jsonb_build_object(
      'request_id', NEW.id,
      'requester_name', NEW.name
    )
  );
  
  RETURN NEW;
END;
$$;

-- Trigger para criar notificações quando uma solicitação é criada
CREATE TRIGGER access_request_notification_trigger
  AFTER INSERT ON public.access_requests
  FOR EACH ROW EXECUTE FUNCTION public.create_access_request_notification();

-- Função para notificar sobre mudanças de status
CREATE OR REPLACE FUNCTION public.notify_access_request_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o status mudou
  IF OLD.status != NEW.status THEN
    
    -- Notificar o solicitante sobre aprovação/rejeição
    INSERT INTO public.system_notifications (
      type,
      title,
      message,
      recipient_email,
      data
    ) VALUES (
      CASE 
        WHEN NEW.status = 'approved' THEN 'access_request_approved'
        WHEN NEW.status = 'rejected' THEN 'access_request_rejected'
        ELSE 'access_request_created'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Solicitação Aprovada!'
        WHEN NEW.status = 'rejected' THEN 'Solicitação Rejeitada'
        ELSE 'Status Atualizado'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Parabéns! Sua solicitação de acesso foi aprovada. Você receberá instruções de login em breve.'
        WHEN NEW.status = 'rejected' THEN 'Sua solicitação de acesso foi rejeitada. Entre em contato conosco para mais informações.'
        ELSE 'O status da sua solicitação foi atualizado.'
      END,
      NEW.email,
      jsonb_build_object(
        'request_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'requester_name', NEW.name
      )
    );
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para notificar sobre mudanças de status
CREATE TRIGGER access_request_status_change_trigger
  AFTER UPDATE ON public.access_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_access_request_status_change();
