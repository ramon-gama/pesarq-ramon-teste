
-- Primeiro, vamos verificar e limpar completamente as políticas
DROP POLICY IF EXISTS "allow_anonymous_insert" ON public.access_requests;
DROP POLICY IF EXISTS "allow_authenticated_select" ON public.access_requests;
DROP POLICY IF EXISTS "allow_authenticated_update" ON public.access_requests;
DROP POLICY IF EXISTS "anonymous_can_insert_requests" ON public.access_requests;
DROP POLICY IF EXISTS "authenticated_can_view_requests" ON public.access_requests;
DROP POLICY IF EXISTS "admin_can_update_requests" ON public.access_requests;

-- Desabilitar RLS temporariamente
ALTER TABLE public.access_requests DISABLE ROW LEVEL SECURITY;

-- Garantir que as permissões básicas estão corretas
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.access_requests TO anon;

-- Reabilitar RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Criar uma política muito simples e permissiva para INSERT anônimo
CREATE POLICY "anonymous_can_insert_requests"
ON public.access_requests
FOR INSERT
TO anon
WITH CHECK (true);

-- Política para usuários autenticados verem todas as solicitações
CREATE POLICY "authenticated_can_view_requests"
ON public.access_requests
FOR SELECT
TO authenticated
USING (true);

-- Política para usuários autenticados poderem fazer UPDATE
CREATE POLICY "authenticated_can_update_requests"
ON public.access_requests
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
