
-- Primeiro, vamos encontrar o ID do Ministério da Saúde
-- Se não existir, vamos criar
DO $$
DECLARE
    ministerio_saude_id uuid;
BEGIN
    -- Tentar encontrar o Ministério da Saúde existente
    SELECT id INTO ministerio_saude_id 
    FROM organizations 
    WHERE name ILIKE '%ministério da saúde%' OR name ILIKE '%ministerio da saude%'
    LIMIT 1;
    
    -- Se não encontrar, criar o Ministério da Saúde
    IF ministerio_saude_id IS NULL THEN
        INSERT INTO organizations (name, type, status, acronym)
        VALUES ('Ministério da Saúde', 'federal', 'ativa', 'MS')
        RETURNING id INTO ministerio_saude_id;
    END IF;
    
    -- Atualizar todos os usuários que não são unb_admin para ter organization_id do Ministério da Saúde
    UPDATE user_profiles 
    SET organization_id = ministerio_saude_id
    WHERE role != 'unb_admin' 
    AND (organization_id IS NULL OR organization_id != ministerio_saude_id);
    
    -- Manter usuários unb_admin sem organization_id específico (para navegar por todas)
    UPDATE user_profiles 
    SET organization_id = NULL
    WHERE role = 'unb_admin';
    
END $$;
