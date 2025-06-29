
-- Corrigir políticas RLS para access_requests
-- Primeiro, limpar políticas conflitantes
DROP POLICY IF EXISTS "public_insert_access_requests" ON public.access_requests;
DROP POLICY IF EXISTS "authenticated_select_access_requests" ON public.access_requests;  
DROP POLICY IF EXISTS "authenticated_update_access_requests" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_insert_policy" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_select_policy" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_update_policy" ON public.access_requests;

-- Garantir que RLS está habilitado
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Política para permitir que qualquer pessoa (incluindo anônimos) crie solicitações
CREATE POLICY "Anyone can create access requests"
  ON public.access_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para administradores UnB verem todas as solicitações
CREATE POLICY "UnB admins can view all requests"
  ON public.access_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'unb_admin'
      AND is_active = true
    )
  );

-- Política para administradores UnB atualizarem solicitações
CREATE POLICY "UnB admins can update requests"
  ON public.access_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'unb_admin'
      AND is_active = true
    )
  );

-- Garantir permissões adequadas
GRANT INSERT ON public.access_requests TO anon;
GRANT SELECT, UPDATE ON public.access_requests TO authenticated;
