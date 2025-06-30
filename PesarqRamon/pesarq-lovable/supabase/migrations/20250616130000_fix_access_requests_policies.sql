
-- Remover políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "UnB admins can view all access requests" ON public.access_requests;
DROP POLICY IF EXISTS "UnB admins can update access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Users can create access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Public can create access requests" ON public.access_requests;

-- Política para permitir que qualquer pessoa (incluindo anônimos) crie solicitações
CREATE POLICY "Anyone can create access requests" 
  ON public.access_requests 
  FOR INSERT 
  TO public
  WITH CHECK (true);

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

-- Garantir que a tabela aceita operações públicas
GRANT INSERT ON public.access_requests TO anon;
GRANT SELECT ON public.access_requests TO authenticated;
GRANT UPDATE ON public.access_requests TO authenticated;
