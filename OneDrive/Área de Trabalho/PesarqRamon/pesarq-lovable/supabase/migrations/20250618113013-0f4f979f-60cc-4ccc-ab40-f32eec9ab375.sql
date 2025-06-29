
-- Desabilitar RLS temporariamente para configurar permissões
ALTER TABLE public.access_requests DISABLE ROW LEVEL SECURITY;

-- Garantir que o usuário anônimo tenha permissão básica na tabela
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Conceder permissões específicas na tabela
GRANT INSERT ON public.access_requests TO anon;
GRANT SELECT, UPDATE, DELETE ON public.access_requests TO authenticated;
GRANT ALL ON public.access_requests TO service_role;

-- Garantir permissões na sequência (se houver)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Reabilitar RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "allow_insert_access_requests" ON public.access_requests;
DROP POLICY IF EXISTS "allow_select_access_requests" ON public.access_requests;
DROP POLICY IF EXISTS "allow_update_access_requests" ON public.access_requests;

-- Criar política super permissiva para INSERT (qualquer um pode inserir)
CREATE POLICY "public_insert_access_requests" 
  ON public.access_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Política para SELECT (usuários autenticados podem ver)
CREATE POLICY "authenticated_select_access_requests" 
  ON public.access_requests 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política para UPDATE (usuários autenticados podem atualizar)
CREATE POLICY "authenticated_update_access_requests" 
  ON public.access_requests 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verificar as permissões na tabela (corrigido)
SELECT 
  table_schema,
  table_name,
  grantor,
  grantee,
  privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'access_requests'
ORDER BY grantee, privilege_type;
