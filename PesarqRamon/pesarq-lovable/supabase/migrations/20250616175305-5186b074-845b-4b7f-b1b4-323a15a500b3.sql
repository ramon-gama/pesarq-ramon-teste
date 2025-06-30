
-- Criar função para lidar com novos usuários do Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, role, organization_id, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'partner_user'),
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'organization_id' IS NOT NULL 
      THEN (NEW.raw_user_meta_data ->> 'organization_id')::uuid
      ELSE NULL
    END,
    true
  );
  RETURN NEW;
END;
$$;

-- Criar trigger para criar perfil automaticamente quando usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criar enum para user_role se não existir
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('unb_admin', 'unb_researcher', 'partner_admin', 'partner_user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Habilitar RLS na tabela user_profiles se não estiver habilitado
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes e recriar
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Criar políticas RLS para user_profiles
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Política para permitir que administradores vejam todos os perfis
CREATE POLICY "Admins can view all profiles" 
  ON public.user_profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'unb_admin'
      AND user_profiles.is_active = true
    )
  );
