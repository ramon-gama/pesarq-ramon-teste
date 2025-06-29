
-- Criar ou atualizar a função que retorna o ID da organização do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT organization_id
  FROM public.user_profiles
  WHERE id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

-- Verificar se a tabela user_profiles existe e tem os campos necessários
-- Se não existir, vamos criar uma estrutura básica
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
    CREATE TABLE public.user_profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      organization_id uuid REFERENCES public.organizations(id),
      role text DEFAULT 'user',
      is_active boolean DEFAULT true,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );
    
    -- Habilitar RLS na tabela user_profiles
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Política para que usuários vejam apenas seu próprio perfil
    CREATE POLICY "Users can view own profile" 
      ON public.user_profiles 
      FOR SELECT 
      USING (auth.uid() = id);
      
    -- Política para que usuários atualizem apenas seu próprio perfil
    CREATE POLICY "Users can update own profile" 
      ON public.user_profiles 
      FOR UPDATE 
      USING (auth.uid() = id);
  END IF;
END
$$;
