
-- Desabilitar temporariamente RLS para debug
ALTER TABLE public.access_requests DISABLE ROW LEVEL SECURITY;

-- Limpar todas as políticas existentes
DROP POLICY IF EXISTS "Permitir criação de solicitações" ON public.access_requests;
DROP POLICY IF EXISTS "Usuários autenticados podem ver solicitações" ON public.access_requests;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar solicitações" ON public.access_requests;
DROP POLICY IF EXISTS "Anyone can create access requests" ON public.access_requests;
DROP POLICY IF EXISTS "UnB admins can view all access requests" ON public.access_requests;
DROP POLICY IF EXISTS "UnB admins can update access requests" ON public.access_requests;

-- Reabilitar RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Criar política mais permissiva para INSERT (qualquer pessoa pode criar)
CREATE POLICY "access_requests_insert_policy" 
  ON public.access_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Criar política para SELECT (todos usuários autenticados podem ver)
CREATE POLICY "access_requests_select_policy" 
  ON public.access_requests 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Criar política para UPDATE (todos usuários autenticados podem atualizar)
CREATE POLICY "access_requests_update_policy" 
  ON public.access_requests 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Garantir permissões no nível de role
GRANT INSERT ON public.access_requests TO anon;
GRANT SELECT, UPDATE ON public.access_requests TO authenticated;
GRANT ALL ON public.access_requests TO service_role;

-- Verificar se a tabela tem as colunas corretas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'access_requests' 
AND table_schema = 'public';
