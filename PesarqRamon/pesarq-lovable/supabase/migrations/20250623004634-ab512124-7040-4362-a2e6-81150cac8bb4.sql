
-- Criar trigger para enviar email automaticamente quando solicitação é aprovada
CREATE OR REPLACE FUNCTION public.send_approval_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o status mudou para aprovado
  IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
    
    -- Chamar a edge function para enviar email de boas-vindas
    PERFORM
      net.http_post(
        url := 'https://cestnycgnhgoraefojke.supabase.co/functions/v1/send-welcome-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlc3RueWNnbmhnb3JhZWZvamtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDcyMDEsImV4cCI6MjA2NDg4MzIwMX0.qfuYfkYZbcSdOzMRGN-foDLznCYJWCHpXune1l8P34U'
        ),
        body := jsonb_build_object(
          'userName', NEW.name,
          'userEmail', NEW.email,
          'resetPasswordUrl', 'https://cestnycgnhgoraefojke.supabase.co/reset-password?email=' || NEW.email
        )
      );
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar o trigger na tabela access_requests
DROP TRIGGER IF EXISTS send_approval_email_trigger ON public.access_requests;
CREATE TRIGGER send_approval_email_trigger
  AFTER UPDATE ON public.access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.send_approval_email();

-- Habilitar a extensão pg_net se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pg_net;
