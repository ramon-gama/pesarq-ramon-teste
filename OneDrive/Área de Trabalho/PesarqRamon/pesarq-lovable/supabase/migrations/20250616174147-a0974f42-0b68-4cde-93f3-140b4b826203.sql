
-- Verificar e criar políticas RLS para a tabela access_requests
-- Permitir que administradores UnB vejam todas as solicitações

-- Primeiro, habilitar RLS se não estiver habilitado
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Política para permitir que administradores UnB vejam todas as solicitações
CREATE POLICY "Administradores UnB podem ver todas as solicitações" 
  ON public.access_requests 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'unb_admin'
      AND user_profiles.is_active = true
    )
  );

-- Política para permitir que administradores UnB atualizem solicitações
CREATE POLICY "Administradores UnB podem atualizar solicitações" 
  ON public.access_requests 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'unb_admin'
      AND user_profiles.is_active = true
    )
  );

-- Política para permitir inserção de novas solicitações (para o formulário público)
CREATE POLICY "Qualquer pessoa pode criar solicitações" 
  ON public.access_requests 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);
