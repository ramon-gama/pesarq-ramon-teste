
-- Adicionar coluna archival_fund_id à tabela services
ALTER TABLE public.services 
ADD COLUMN archival_fund_id uuid REFERENCES public.archival_funds(id);

-- Atualizar trigger de updated_at se necessário
CREATE OR REPLACE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
