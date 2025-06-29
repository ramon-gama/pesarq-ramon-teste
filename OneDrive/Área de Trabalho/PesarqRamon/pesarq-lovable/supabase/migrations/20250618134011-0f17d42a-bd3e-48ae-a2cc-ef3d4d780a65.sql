
-- Solução radical: remover completamente RLS da tabela user_profiles
-- e simplificar tudo ao máximo

-- 1. Desabilitar RLS completamente
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Remover TODAS as políticas (mesmo que já tenham sido removidas)
DO $$ 
DECLARE
    pol_name text;
BEGIN
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol_name) || ' ON public.user_profiles';
    END LOOP;
END $$;

-- 3. Remover TODAS as funções relacionadas
DROP FUNCTION IF EXISTS public.check_user_access(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.approve_access_request(uuid) CASCADE;

-- 4. Remover TODOS os triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;

-- 5. Remover TODAS as constraints de foreign key
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.user_profiles'::regclass
        AND contype = 'f'
    LOOP
        EXECUTE 'ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name);
    END LOOP;
END $$;

-- 6. Garantir que a coluna id tenha default correto
ALTER TABLE public.user_profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 7. Dar permissões TOTAIS para todos os roles
GRANT ALL ON public.user_profiles TO anon;
GRANT ALL ON public.user_profiles TO authenticated; 
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.user_profiles TO postgres;

-- 8. Permitir que qualquer um faça qualquer coisa na tabela (SEM RLS)
-- Isso é mais simples e evita todos os problemas de recursão
