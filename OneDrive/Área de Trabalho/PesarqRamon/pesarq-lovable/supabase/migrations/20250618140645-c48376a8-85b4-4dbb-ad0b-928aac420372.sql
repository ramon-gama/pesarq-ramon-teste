
-- Corrigir referências de auth.users para user_profiles nas tabelas restantes
-- 1. Tabela tasks - campo created_by
ALTER TABLE public.tasks 
DROP CONSTRAINT IF EXISTS tasks_created_by_fkey;

ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- 2. Tabela access_requests - campo reviewed_by
ALTER TABLE public.access_requests 
DROP CONSTRAINT IF EXISTS access_requests_reviewed_by_fkey;

ALTER TABLE public.access_requests 
ADD CONSTRAINT access_requests_reviewed_by_fkey 
FOREIGN KEY (reviewed_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- 3. Tabela maturity_evaluations - campo user_id
ALTER TABLE public.maturity_evaluations 
DROP CONSTRAINT IF EXISTS maturity_evaluations_user_id_fkey;

ALTER TABLE public.maturity_evaluations 
ADD CONSTRAINT maturity_evaluations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- 4. Tabela researcher_allocations - campo created_by
ALTER TABLE public.researcher_allocations 
DROP CONSTRAINT IF EXISTS researcher_allocations_created_by_fkey;

ALTER TABLE public.researcher_allocations 
ADD CONSTRAINT researcher_allocations_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- 5. Tabela community_posts - campo user_id
ALTER TABLE public.community_posts 
DROP CONSTRAINT IF EXISTS community_posts_user_id_fkey;

ALTER TABLE public.community_posts 
ADD CONSTRAINT community_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- 6. Tabela community_replies - campo user_id
ALTER TABLE public.community_replies 
DROP CONSTRAINT IF EXISTS community_replies_user_id_fkey;

ALTER TABLE public.community_replies 
ADD CONSTRAINT community_replies_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- 7. Tabela community_votes - campo user_id
ALTER TABLE public.community_votes 
DROP CONSTRAINT IF EXISTS community_votes_user_id_fkey;

ALTER TABLE public.community_votes 
ADD CONSTRAINT community_votes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- 8. Tabela community_user_profiles - campo user_id
ALTER TABLE public.community_user_profiles 
DROP CONSTRAINT IF EXISTS community_user_profiles_user_id_fkey;

ALTER TABLE public.community_user_profiles 
ADD CONSTRAINT community_user_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;
