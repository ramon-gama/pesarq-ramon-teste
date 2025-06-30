
-- Verificar quantas tarefas existem sem organização
SELECT COUNT(*) as tarefas_sem_organizacao 
FROM public.tasks 
WHERE organization_id IS NULL;

-- Ver detalhes das tarefas sem organização
SELECT id, title, assignee, created_at 
FROM public.tasks 
WHERE organization_id IS NULL 
ORDER BY created_at DESC;

-- Excluir tarefas que não estão vinculadas a nenhuma organização
DELETE FROM public.tasks 
WHERE organization_id IS NULL;
