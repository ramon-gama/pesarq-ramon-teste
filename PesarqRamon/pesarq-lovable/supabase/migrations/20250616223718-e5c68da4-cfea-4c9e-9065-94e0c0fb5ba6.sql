
-- Primeiro, vamos desabilitar RLS temporariamente e recriar as políticas
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Recriar políticas RLS mais simples para evitar recursão
CREATE POLICY "Enable read access for authenticated users" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id OR is_admin_user());

CREATE POLICY "Enable insert for authenticated users" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id OR is_admin_user());

-- Verificar se as organizações estão sendo retornadas corretamente
-- e garantir que as políticas RLS não estão bloqueando o acesso
ALTER TABLE public.organizations DISABLE ROW LEVEL SECURITY;

-- Habilitar RLS novamente com políticas mais permissivas para organizações
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users on organizations" ON public.organizations
    FOR SELECT USING (true);

CREATE POLICY "Enable all operations for authenticated users on organizations" ON public.organizations
    FOR ALL USING (auth.role() = 'authenticated');
