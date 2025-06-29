
-- Criar tabela para tokens de configuração de senha
CREATE TABLE IF NOT EXISTS public.password_setup_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_password_setup_tokens_email ON public.password_setup_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_setup_tokens_token ON public.password_setup_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_setup_tokens_used ON public.password_setup_tokens(used);

-- Habilitar RLS
ALTER TABLE public.password_setup_tokens ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - apenas admins podem gerenciar tokens
CREATE POLICY "Admins can manage password setup tokens" 
  ON public.password_setup_tokens 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'unb_admin' 
      AND is_active = true
    )
  );
