
-- Solução alternativa: Desabilitar RLS para admin e simplificar acesso
-- Remover todas as políticas e funções problemáticas

ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "user_access_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "carlos_full_access" ON public.user_profiles;
DROP POLICY IF EXISTS "users_own_profile_read" ON public.user_profiles;
DROP POLICY IF EXISTS "users_own_profile_write" ON public.user_profiles;

-- Remover função problemática
DROP FUNCTION IF EXISTS public.check_user_access(uuid);

-- Para simplicidade máxima: permitir que usuários autenticados acessem seus próprios dados
-- e que o service_role tenha acesso total (usado para operações admin)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Política super simples: usuários podem ver/editar apenas seu próprio perfil
CREATE POLICY "own_profile_only" ON public.user_profiles
FOR ALL 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Permitir acesso total para service_role (operações administrativas)
GRANT ALL ON public.user_profiles TO service_role;

-- Permitir que o postgres role tenha acesso total (para migrations e admin)
GRANT ALL ON public.user_profiles TO postgres;
