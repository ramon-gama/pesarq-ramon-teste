
-- Primeiro, verificar se RLS está habilitado e desabilitar temporariamente
ALTER TABLE public.access_requests DISABLE ROW LEVEL SECURITY;

-- Remover TODAS as políticas existentes (incluindo possíveis duplicatas)
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

-- Verificar e garantir que as permissões básicas estão corretas
REVOKE ALL ON public.access_requests FROM anon, authenticated, service_role;
GRANT INSERT ON public.access_requests TO anon;
GRANT SELECT, UPDATE, DELETE ON public.access_requests TO authenticated;
GRANT ALL ON public.access_requests TO service_role;

-- Reabilitar RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Criar uma política super permissiva para INSERT que definitivamente funcione
CREATE POLICY "allow_insert_access_requests" 
  ON public.access_requests 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Política para SELECT apenas para usuários autenticados
CREATE POLICY "allow_select_access_requests" 
  ON public.access_requests 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política para UPDATE apenas para usuários autenticados  
CREATE POLICY "allow_update_access_requests" 
  ON public.access_requests 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verificar se as políticas foram criadas corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'access_requests' 
AND schemaname = 'public'
ORDER BY policyname;
