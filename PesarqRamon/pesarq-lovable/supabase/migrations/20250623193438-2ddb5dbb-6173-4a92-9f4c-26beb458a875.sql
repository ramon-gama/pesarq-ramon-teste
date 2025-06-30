
-- Desabilitar temporariamente RLS para limpar todas as políticas
ALTER TABLE public.access_requests DISABLE ROW LEVEL SECURITY;

-- Remover TODAS as políticas existentes
DO $$
DECLARE
    pol_name text;
BEGIN
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'access_requests' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON public.access_requests';
    END LOOP;
END $$;

-- Garantir permissões no nível de role primeiro
REVOKE ALL ON public.access_requests FROM anon, authenticated, service_role;
GRANT INSERT ON public.access_requests TO anon;
GRANT SELECT, UPDATE, DELETE ON public.access_requests TO authenticated;
GRANT ALL ON public.access_requests TO service_role;

-- Garantir acesso ao schema público
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Reabilitar RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Criar política super permissiva para INSERT
CREATE POLICY "allow_anonymous_insert"
  ON public.access_requests
  FOR INSERT
  WITH CHECK (true);

-- Política para SELECT (apenas usuários autenticados)
CREATE POLICY "allow_authenticated_select"
  ON public.access_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para UPDATE (apenas usuários autenticados)
CREATE POLICY "allow_authenticated_update"
  ON public.access_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
