
-- Remover campos redundantes da tabela de objetivos
-- Manter apenas campos estratégicos nos objetivos
ALTER TABLE strategic_plan_objectives 
DROP COLUMN IF EXISTS service_type,
DROP COLUMN IF EXISTS target_metric,
DROP COLUMN IF EXISTS progress_type,
DROP COLUMN IF EXISTS responsible_person;

-- Garantir que as ações tenham todos os campos de controle necessários
-- Estes campos já existem, mas vamos garantir que estão configurados corretamente
ALTER TABLE strategic_plan_actions 
ALTER COLUMN progress_type SET DEFAULT 'manual',
ALTER COLUMN status SET DEFAULT 'pending';

-- Criar função para calcular progresso do objetivo baseado nas ações
CREATE OR REPLACE FUNCTION calculate_objective_progress(objective_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  avg_progress INTEGER;
BEGIN
  SELECT COALESCE(ROUND(AVG(progress)), 0)
  INTO avg_progress
  FROM strategic_plan_actions
  WHERE objective_id = objective_id_param;
  
  RETURN avg_progress;
END;
$$ LANGUAGE plpgsql;

-- Criar função para verificar se objetivo está completo
CREATE OR REPLACE FUNCTION is_objective_completed(objective_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  all_completed BOOLEAN;
BEGIN
  SELECT COALESCE(bool_and(status = 'completed'), false)
  INTO all_completed
  FROM strategic_plan_actions
  WHERE objective_id = objective_id_param;
  
  RETURN all_completed;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente o progresso do objetivo quando uma ação muda
CREATE OR REPLACE FUNCTION update_objective_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar progresso do objetivo baseado nas ações
  UPDATE strategic_plan_objectives 
  SET 
    progress = calculate_objective_progress(COALESCE(NEW.objective_id, OLD.objective_id)),
    completed = is_objective_completed(COALESCE(NEW.objective_id, OLD.objective_id)),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.objective_id, OLD.objective_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para manter objetivos sincronizados
DROP TRIGGER IF EXISTS trigger_update_objective_progress ON strategic_plan_actions;
CREATE TRIGGER trigger_update_objective_progress
  AFTER INSERT OR UPDATE OR DELETE ON strategic_plan_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_objective_progress();
