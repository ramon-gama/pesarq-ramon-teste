
-- Verificar se existem tarefas na base de dados
SELECT COUNT(*) as total_tasks FROM public.tasks;

-- Verificar tarefas por organização
SELECT 
  t.organization_id,
  o.name as organization_name,
  COUNT(*) as task_count
FROM public.tasks t
LEFT JOIN public.organizations o ON t.organization_id = o.id
GROUP BY t.organization_id, o.name;

-- Verificar se a organização Ministério da Saúde existe
SELECT id, name FROM public.organizations WHERE name ILIKE '%ministério%saúde%';

-- Verificar o perfil do usuário atual e sua organização
SELECT 
  up.id,
  up.organization_id,
  o.name as organization_name,
  up.role
FROM public.user_profiles up
LEFT JOIN public.organizations o ON up.organization_id = o.id
WHERE up.id = auth.uid();

-- Testar a função de segurança
SELECT public.get_current_user_organization_id() as current_org_id;
