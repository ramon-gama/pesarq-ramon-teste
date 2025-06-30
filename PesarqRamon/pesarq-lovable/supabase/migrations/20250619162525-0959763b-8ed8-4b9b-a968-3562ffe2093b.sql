
-- Adicionar nova coluna responsible na tabela de metas
ALTER TABLE organization_unb_project_goals 
ADD COLUMN IF NOT EXISTS responsible TEXT,
DROP COLUMN IF EXISTS value;

-- Criar tabela para entregáveis das metas
CREATE TABLE IF NOT EXISTS organization_unb_goal_deliverables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES organization_unb_project_goals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para escopo físico das metas
CREATE TABLE IF NOT EXISTS organization_unb_goal_physical_scope (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES organization_unb_project_goals(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- tipo de serviço (classificação, digitalização, etc)
  indicator TEXT NOT NULL, -- indicador (caixas, metros lineares, etc)
  target_quantity NUMERIC NOT NULL DEFAULT 0, -- quantidade meta
  current_quantity NUMERIC NOT NULL DEFAULT 0, -- quantidade atual
  unit TEXT NOT NULL, -- unidade (caixas, metros, documentos, etc)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar coluna para tipo de progresso (manual ou automático)
ALTER TABLE organization_unb_project_goals 
ADD COLUMN IF NOT EXISTS progress_type TEXT DEFAULT 'manual';

-- Trigger para atualizar updated_at nas novas tabelas
CREATE OR REPLACE TRIGGER update_goal_deliverables_updated_at
    BEFORE UPDATE ON organization_unb_goal_deliverables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_goal_physical_scope_updated_at
    BEFORE UPDATE ON organization_unb_goal_physical_scope
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar real-time para as novas tabelas
ALTER TABLE organization_unb_goal_deliverables REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE organization_unb_goal_deliverables;

ALTER TABLE organization_unb_goal_physical_scope REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE organization_unb_goal_physical_scope;
