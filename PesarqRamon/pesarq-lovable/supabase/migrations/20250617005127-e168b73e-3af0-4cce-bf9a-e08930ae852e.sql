
-- Verificar se a tabela já existe e criar se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'archive_sectors') THEN
        -- Criar tabela específica para dados do setor de arquivo
        CREATE TABLE public.archive_sectors (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
          manager TEXT,
          location TEXT,
          working_hours TEXT,
          team_size TEXT,
          storage_capacity TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          UNIQUE(organization_id) -- Garantir que cada organização tenha apenas um setor de arquivo
        );

        -- Adicionar RLS
        ALTER TABLE public.archive_sectors ENABLE ROW LEVEL SECURITY;

        -- Política para visualizar dados do setor de arquivo (temporariamente permissiva)
        CREATE POLICY "Users can view archive sectors" 
          ON public.archive_sectors 
          FOR SELECT 
          USING (true);

        -- Política para inserir dados do setor de arquivo (temporariamente permissiva)
        CREATE POLICY "Users can create archive sectors" 
          ON public.archive_sectors 
          FOR INSERT 
          WITH CHECK (true);

        -- Política para atualizar dados do setor de arquivo (temporariamente permissiva)
        CREATE POLICY "Users can update archive sectors" 
          ON public.archive_sectors 
          FOR UPDATE 
          USING (true);

        -- Política para deletar dados do setor de arquivo (temporariamente permissiva)
        CREATE POLICY "Users can delete archive sectors" 
          ON public.archive_sectors 
          FOR DELETE 
          USING (true);

        -- Verificar se a função update_updated_at_column existe antes de criar o trigger
        IF EXISTS (SELECT FROM information_schema.routines WHERE routine_name = 'update_updated_at_column') THEN
            -- Trigger para atualizar updated_at
            CREATE TRIGGER update_archive_sectors_updated_at
              BEFORE UPDATE ON public.archive_sectors
              FOR EACH ROW
              EXECUTE FUNCTION public.update_updated_at_column();
        END IF;
    END IF;
END $$;
