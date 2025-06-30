
-- Corrigir as políticas RLS da tabela access_requests para permitir inserção
DROP POLICY IF EXISTS "anonymous_can_insert_requests" ON public.access_requests;
DROP POLICY IF EXISTS "authenticated_can_view_requests" ON public.access_requests;
DROP POLICY IF EXISTS "authenticated_can_update_requests" ON public.access_requests;

-- Criar política para permitir que administradores UnB insiram solicitações
CREATE POLICY "unb_admins_can_insert_requests" 
  ON public.access_requests 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'unb_admin'
      AND is_active = true
    )
  );

-- Criar política para permitir que administradores UnB vejam todas as solicitações
CREATE POLICY "unb_admins_can_view_requests" 
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

-- Criar política para permitir que administradores UnB atualizem solicitações
CREATE POLICY "unb_admins_can_update_requests" 
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
GRANT INSERT, SELECT, UPDATE ON public.access_requests TO authenticated;
