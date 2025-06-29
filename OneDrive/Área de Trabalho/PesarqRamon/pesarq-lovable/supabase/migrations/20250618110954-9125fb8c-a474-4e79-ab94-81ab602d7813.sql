
-- Primeiro, limpar todas as políticas existentes da tabela access_requests
DROP POLICY IF EXISTS "Anyone can create access requests" ON public.access_requests;
DROP POLICY IF EXISTS "UnB admins can view all access requests" ON public.access_requests;
DROP POLICY IF EXISTS "UnB admins can update access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Administradores UnB podem ver todas as solicitações" ON public.access_requests;
DROP POLICY IF EXISTS "Administradores UnB podem atualizar solicitações" ON public.access_requests;
DROP POLICY IF EXISTS "Qualquer pessoa pode criar solicitações" ON public.access_requests;

-- Garantir que RLS está habilitado
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Política simples para permitir inserção por qualquer pessoa (incluindo anônimos)
CREATE POLICY "Permitir criação de solicitações" 
  ON public.access_requests 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Política para permitir que usuários autenticados vejam todas as solicitações
-- (temporariamente permissiva para debug)
CREATE POLICY "Usuários autenticados podem ver solicitações" 
  ON public.access_requests 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política para permitir que usuários autenticados atualizem solicitações
-- (temporariamente permissiva para debug)
CREATE POLICY "Usuários autenticados podem atualizar solicitações" 
  ON public.access_requests 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Garantir permissões adequadas
GRANT INSERT ON public.access_requests TO anon;
GRANT SELECT, UPDATE ON public.access_requests TO authenticated;

-- Verificar se os triggers de notificação existem
-- Se não existirem, criar novamente
DROP TRIGGER IF EXISTS access_request_created_trigger ON public.access_requests;
DROP TRIGGER IF EXISTS access_request_status_changed_trigger ON public.access_requests;

CREATE TRIGGER access_request_created_trigger
  AFTER INSERT ON public.access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.create_access_request_notification();

CREATE TRIGGER access_request_status_changed_trigger
  AFTER UPDATE ON public.access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_access_request_status_change();
