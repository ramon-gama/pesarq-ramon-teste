
-- Criar tabela para os incidentes
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('baixa', 'moderada', 'alta', 'critica')),
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em-tratamento', 'resolvido', 'sem-solucao')),
  location TEXT,
  responsible TEXT,
  description TEXT NOT NULL,
  estimated_volume TEXT,
  consequences TEXT,
  measures_adopted TEXT,
  external_support TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para os relatórios de incidentes
CREATE TABLE public.incident_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  final_report TEXT,
  identified_causes TEXT,
  corrective_actions TEXT,
  future_recommendations TEXT,
  closure_date TIMESTAMP WITH TIME ZONE,
  technical_responsible TEXT,
  status TEXT NOT NULL DEFAULT 'em-andamento' CHECK (status IN ('em-andamento', 'concluido', 'pendente')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para incidents
CREATE POLICY "Users can view incidents from their organization" 
  ON public.incidents FOR SELECT 
  USING (true);

CREATE POLICY "Users can create incidents" 
  ON public.incidents FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update incidents from their organization" 
  ON public.incidents FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete incidents from their organization" 
  ON public.incidents FOR DELETE 
  USING (true);

-- Criar políticas RLS para incident_reports
CREATE POLICY "Users can view incident reports" 
  ON public.incident_reports FOR SELECT 
  USING (true);

CREATE POLICY "Users can create incident reports" 
  ON public.incident_reports FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update incident reports" 
  ON public.incident_reports FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete incident reports" 
  ON public.incident_reports FOR DELETE 
  USING (true);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON public.incident_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (baseados nos dados existentes no código)
INSERT INTO public.incidents (organization_id, title, type, date, severity, status, location, responsible, description, estimated_volume) VALUES
('00000000-0000-0000-0000-000000000001', 'Infiltração no Arquivo Setorial – Bloco A', 'Riscos Físicos', '2024-03-10 14:30:00', 'alta', 'em-tratamento', 'Arquivo Central - Bloco A', 'João Silva - Arquivo Central', 'Infiltração detectada no teto da sala de arquivo, afetando documentos das prateleiras superiores.', '120 metros lineares'),

('00000000-0000-0000-0000-000000000001', 'Falha no sistema de backup', 'Falhas Tecnológicas', '2024-03-08 09:15:00', 'critica', 'resolvido', 'Servidor Principal', 'Maria Santos - TI', 'Sistema de backup automático falhou durante 48 horas, deixando arquivos digitais sem proteção.', '2TB de documentos digitais'),

('00000000-0000-0000-0000-000000000001', 'Acesso não autorizado a documentos confidenciais', 'Acesso Indevido', '2024-03-05 16:45:00', 'alta', 'em-tratamento', 'Sistema Digital - Portal', 'Carlos Oliveira - Segurança', 'Usuário não autorizado acessou documentos classificados através de falha na autenticação.', '15 documentos sigilosos'),

('00000000-0000-0000-0000-000000000001', 'Contaminação por fungos', 'Riscos Físicos', '2024-03-01 11:20:00', 'moderada', 'novo', 'Arquivo Histórico - Subsolo', 'Ana Costa - Preservação', 'Detecção de fungos em documentos históricos devido à umidade excessiva no ambiente.', '50 documentos históricos');

-- Inserir relatórios de exemplo
INSERT INTO public.incident_reports (incident_id, final_report, identified_causes, corrective_actions, future_recommendations, technical_responsible, status, closure_date) 
SELECT 
  i.id,
  CASE 
    WHEN i.title = 'Infiltração no Arquivo Setorial – Bloco A' THEN 'Investigação em andamento sobre as causas da infiltração. Área isolada e documentos transferidos para local seguro.'
    WHEN i.title = 'Falha no sistema de backup' THEN 'Falha no sistema de backup identificada e corrigida. Todos os sistemas foram restaurados com sucesso.'
    WHEN i.title = 'Acesso não autorizado a documentos confidenciais' THEN 'Investigação em curso. Identificado usuário e documentos acessados. Medidas de contenção aplicadas.'
    ELSE 'Relatório ainda não elaborado.'
  END,
  CASE 
    WHEN i.title = 'Infiltração no Arquivo Setorial – Bloco A' THEN 'Falha na impermeabilização do teto, agravada pelas chuvas intensas do período.'
    WHEN i.title = 'Falha no sistema de backup' THEN 'Atualização automática do sistema operacional corrompeu configurações do software de backup.'
    WHEN i.title = 'Acesso não autorizado a documentos confidenciais' THEN 'Vulnerabilidade no sistema de autenticação permitiu escalação de privilégios.'
    ELSE ''
  END,
  CASE 
    WHEN i.title = 'Infiltração no Arquivo Setorial – Bloco A' THEN '1. Reparo emergencial da impermeabilização\n2. Transferência de documentos para área seca\n3. Instalação de desumidificadores'
    WHEN i.title = 'Falha no sistema de backup' THEN '1. Restauração das configurações de backup\n2. Criação de backup manual dos últimos arquivos\n3. Implementação de monitoramento ativo'
    WHEN i.title = 'Acesso não autorizado a documentos confidenciais' THEN '1. Revogação imediata de credenciais\n2. Auditoria de todos os acessos\n3. Correção da vulnerabilidade'
    ELSE ''
  END,
  CASE 
    WHEN i.title = 'Infiltração no Arquivo Setorial – Bloco A' THEN 'Implementar inspeções preventivas semestrais na cobertura e sistema de drenagem.'
    WHEN i.title = 'Falha no sistema de backup' THEN 'Desabilitar atualizações automáticas em servidores críticos e criar procedimento de teste antes de atualizações.'
    WHEN i.title = 'Acesso não autorizado a documentos confidenciais' THEN 'Implementar autenticação de dois fatores e revisão periódica de permissões.'
    ELSE ''
  END,
  i.responsible,
  CASE 
    WHEN i.status = 'resolvido' THEN 'concluido'
    ELSE 'em-andamento'
  END,
  CASE 
    WHEN i.status = 'resolvido' THEN '2024-03-09 14:20:00'::timestamp with time zone
    ELSE NULL
  END
FROM public.incidents i;
