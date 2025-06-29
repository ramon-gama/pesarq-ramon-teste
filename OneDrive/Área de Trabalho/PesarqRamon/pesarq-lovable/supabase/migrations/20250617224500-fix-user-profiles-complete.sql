
-- Primeiro, vamos remover todas as políticas existentes completamente
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles;

-- Garantir que todas as colunas existem
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Desabilitar RLS temporariamente para teste
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Reabilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS simples e funcionais
CREATE POLICY "user_profiles_select_policy" ON public.user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "user_profiles_insert_policy" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_update_policy" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Garantir que o trigger handle_new_user funciona corretamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    name, 
    email, 
    role, 
    organization_id, 
    is_active,
    bio,
    phone,
    position,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    CASE 
      WHEN NEW.email = 'carloshunb@gmail.com' THEN 'unb_admin'
      ELSE COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'partner_user')
    END,
    CASE 
      WHEN NEW.email = 'carloshunb@gmail.com' THEN NULL
      WHEN NEW.raw_user_meta_data ->> 'organization_id' IS NOT NULL 
      THEN (NEW.raw_user_meta_data ->> 'organization_id')::uuid
      ELSE NULL
    END,
    true,
    NULL, -- bio
    NULL, -- phone
    NULL, -- position
    NULL, -- avatar_url
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;
