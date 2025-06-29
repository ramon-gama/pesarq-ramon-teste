
-- Verificar e adicionar constraints que não existem
DO $$
BEGIN
    -- Adicionar constraint para community_replies -> community_posts se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'community_replies_post_id_fkey'
    ) THEN
        ALTER TABLE community_replies 
        ADD CONSTRAINT community_replies_post_id_fkey 
        FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
    END IF;

    -- Adicionar constraint para community_votes -> community_posts se não existir  
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'community_votes_post_id_fkey'
    ) THEN
        ALTER TABLE community_votes 
        ADD CONSTRAINT community_votes_post_id_fkey 
        FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
    END IF;

    -- Adicionar constraint para community_votes -> community_replies se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'community_votes_reply_id_fkey'
    ) THEN
        ALTER TABLE community_votes 
        ADD CONSTRAINT community_votes_reply_id_fkey 
        FOREIGN KEY (reply_id) REFERENCES community_replies(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Corrigir políticas RLS para permitir criação de posts e perfis
DROP POLICY IF EXISTS "Users can create posts" ON community_posts;
DROP POLICY IF EXISTS "Users can create their own profile" ON community_user_profiles;

-- Política mais permissiva para criação de posts
CREATE POLICY "Authenticated users can create posts" 
ON community_posts FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Política mais permissiva para criação de perfis
CREATE POLICY "Authenticated users can create profiles" 
ON community_user_profiles FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Permitir que usuários vejam todos os perfis (necessário para o JOIN)
DROP POLICY IF EXISTS "Anyone can view profiles" ON community_user_profiles;
CREATE POLICY "Authenticated users can view all profiles" 
ON community_user_profiles FOR SELECT 
TO authenticated 
USING (true);

-- Habilitar realtime se não estiver habilitado
ALTER TABLE community_posts REPLICA IDENTITY FULL;
ALTER TABLE community_replies REPLICA IDENTITY FULL;
ALTER TABLE community_votes REPLICA IDENTITY FULL;
ALTER TABLE community_user_profiles REPLICA IDENTITY FULL;
