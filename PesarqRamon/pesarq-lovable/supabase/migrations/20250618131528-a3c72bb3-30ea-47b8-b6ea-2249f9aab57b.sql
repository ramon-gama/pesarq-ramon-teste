
-- Verificar e remover a constraint de foreign key problemática
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Verificar se existem outras constraints similares
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Garantir que a coluna id seja do tipo UUID e tenha um default
ALTER TABLE public.user_profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Criar índice para performance (sem constraint)
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON public.user_profiles (id);

-- Remover trigger problemático se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Garantir permissões adequadas
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.user_profiles TO postgres;
GRANT ALL ON public.user_profiles TO authenticated;
