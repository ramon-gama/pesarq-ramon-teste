
-- Verificar e adicionar valores em falta ao enum user_role
-- Primeiro, vamos adicionar os valores que podem estar faltando

-- Adicionar 'partner_admin' se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'partner_admin' AND enumtypid = 'user_role'::regtype) THEN
        ALTER TYPE user_role ADD VALUE 'partner_admin';
    END IF;
END $$;

-- Adicionar 'partner_user' se não existir  
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'partner_user' AND enumtypid = 'user_role'::regtype) THEN
        ALTER TYPE user_role ADD VALUE 'partner_user';
    END IF;
END $$;

-- Verificar quais valores existem atualmente no enum
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'user_role'::regtype ORDER BY enumsortorder;
