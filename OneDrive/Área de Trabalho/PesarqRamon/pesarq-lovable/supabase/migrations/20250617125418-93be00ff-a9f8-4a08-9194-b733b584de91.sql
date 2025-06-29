
-- Verificar se a coluna organization_id existe na tabela tasks
-- Se não existir, vamos adicioná-la
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id);

-- Habilitar RLS na tabela tasks se ainda não estiver habilitado
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete organization tasks" ON public.tasks;

-- Criar políticas RLS para tarefas por organização
-- Política para visualizar tarefas da organização do usuário
CREATE POLICY "Users can view organization tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (
    organization_id = (
      SELECT organization_id 
      FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Política para criar tarefas na organização do usuário
CREATE POLICY "Users can create organization tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (
    organization_id = (
      SELECT organization_id 
      FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Política para atualizar tarefas da organização do usuário
CREATE POLICY "Users can update organization tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (
    organization_id = (
      SELECT organization_id 
      FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Política para deletar tarefas da organização do usuário
CREATE POLICY "Users can delete organization tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (
    organization_id = (
      SELECT organization_id 
      FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );
