
-- Primeiro, vamos adicionar a coluna avatar_url se não existir
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Remover todas as políticas RLS existentes que podem estar causando recursão
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Criar políticas RLS mais simples e seguras
CREATE POLICY "Enable read access for users based on user_id" ON public.user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for users based on user_id" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id);
