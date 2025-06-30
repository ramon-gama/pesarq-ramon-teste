
-- Verificar se existe uma organização com o ID específico mencionado
SELECT id, name, type, status, created_at, updated_at 
FROM public.organizations 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Verificar todas as organizações que contém "Ministério da Saúde" no nome
SELECT id, name, type, status, created_at, updated_at 
FROM public.organizations 
WHERE name ILIKE '%ministério da saúde%' OR name ILIKE '%ministerio da saude%';

-- Verificar qual organização você (como usuário) está vinculado
SELECT up.id, up.name, up.email, up.role, up.organization_id, up.is_active,
       o.name as organization_name
FROM public.user_profiles up
LEFT JOIN public.organizations o ON up.organization_id = o.id
WHERE up.email = 'carloshunb@gmail.com';
