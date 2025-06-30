
-- Verificar se a tabela attendance_control tem RLS habilitado e criar políticas básicas
ALTER TABLE public.attendance_control ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT para todos (já que não há autenticação implementada)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.attendance_control;
CREATE POLICY "Enable read access for all users" ON public.attendance_control
    FOR SELECT USING (true);

-- Política para permitir INSERT para todos
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.attendance_control;
CREATE POLICY "Enable insert access for all users" ON public.attendance_control
    FOR INSERT WITH CHECK (true);

-- Política para permitir UPDATE para todos
DROP POLICY IF EXISTS "Enable update access for all users" ON public.attendance_control;
CREATE POLICY "Enable update access for all users" ON public.attendance_control
    FOR UPDATE USING (true);

-- Política para permitir DELETE para todos
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.attendance_control;
CREATE POLICY "Enable delete access for all users" ON public.attendance_control
    FOR DELETE USING (true);

-- Verificar se há foreign keys que podem estar causando problemas
-- Adicionar foreign key para researchers se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'attendance_control_researcher_id_fkey'
    ) THEN
        ALTER TABLE public.attendance_control 
        ADD CONSTRAINT attendance_control_researcher_id_fkey 
        FOREIGN KEY (researcher_id) REFERENCES public.researchers(id);
    END IF;
END $$;
