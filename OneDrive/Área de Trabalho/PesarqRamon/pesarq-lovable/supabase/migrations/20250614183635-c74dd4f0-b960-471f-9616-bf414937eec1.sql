
-- Adicionar campos para explicação das respostas e tipo de deficiência nas perguntas
ALTER TABLE maturity_response_options 
ADD COLUMN IF NOT EXISTS explanation text;

ALTER TABLE maturity_questions 
ADD COLUMN IF NOT EXISTS deficiency_types text[] DEFAULT '{}';

-- Comentários para explicar os novos campos:
-- explanation: Explicação do que cada opção de resposta significa (mostrada durante a avaliação)
-- deficiency_types: Array de tipos de deficiência associados à pergunta ['tecnica', 'ferramental', 'comportamental']

-- O campo 'feedback' existente será usado para o feedback final da avaliação
-- O campo 'deficiency_type' nas response_options será mantido para compatibilidade mas o novo sistema usará deficiency_types nas questions
