
-- Adicionar campo created_by na tabela tasks para rastrear quem criou a tarefa
ALTER TABLE public.tasks 
ADD COLUMN created_by uuid REFERENCES auth.users(id);

-- Atualizar tarefas existentes (opcional - pode definir como NULL ou um valor padrão)
-- UPDATE public.tasks SET created_by = (SELECT id FROM auth.users LIMIT 1) WHERE created_by IS NULL;

-- Adicionar índice para melhor performance nas consultas
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON public.tasks(created_by);

-- Atualizar as políticas RLS para considerar o criador da tarefa
DROP POLICY IF EXISTS "Users can update organization tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete organization tasks" ON public.tasks;

-- Política de atualização: usuário pode atualizar tarefas da sua organização ou que ele criou
CREATE POLICY "Users can update organization tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND (
      organization_id = public.get_current_user_organization_id() OR
      created_by = auth.uid()
    )
  );

-- Política de exclusão: usuário pode deletar tarefas da sua organização ou que ele criou
CREATE POLICY "Users can delete organization tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND (
      organization_id = public.get_current_user_organization_id() OR
      created_by = auth.uid()
    )
  );
