
-- Primeiro, vamos ver o estado atual dos dados
SELECT 'ESTADO ATUAL - Perguntas' as info;
SELECT id, question, subcategory_id, sort_order FROM maturity_questions ORDER BY subcategory_id, sort_order LIMIT 10;

SELECT 'ESTADO ATUAL - Opções de Resposta' as info;
SELECT id, question_id, level, label FROM maturity_response_options ORDER BY question_id, level LIMIT 10;

-- Verificar se há correspondência
SELECT 'VERIFICAÇÃO DE CORRESPONDÊNCIA' as info;
SELECT 
    q.id as question_id,
    q.question,
    COUNT(ro.id) as options_count
FROM maturity_questions q
LEFT JOIN maturity_response_options ro ON q.id = ro.question_id
GROUP BY q.id, q.question
ORDER BY options_count, q.id
LIMIT 10;

-- Corrigir o problema de forma mais direta
-- Primeiro, vamos limpar as opções existentes que estão desconectadas
DELETE FROM maturity_response_options 
WHERE question_id NOT IN (SELECT id FROM maturity_questions);

-- Agora vamos recriar as opções de resposta para cada pergunta
-- Inserir opções padrão para todas as perguntas que não têm opções
WITH questions_without_options AS (
    SELECT q.id as question_id
    FROM maturity_questions q
    LEFT JOIN maturity_response_options ro ON q.id = ro.question_id
    WHERE ro.id IS NULL
),
standard_responses AS (
    SELECT 
        1 as level, 
        'Não estabelecido - Não existe nenhuma política, processo ou prática formal relacionada a este aspecto.' as label,
        'Este é o nível mais básico, indicando ausência completa de práticas formais.' as explanation,
        'Recomenda-se iniciar o desenvolvimento de políticas e processos básicos para este aspecto.' as feedback,
        1.0 as weight,
        ARRAY['tecnica', 'ferramental', 'comportamental'] as deficiency_type
    UNION ALL
    SELECT 
        2 as level,
        'Em desenvolvimento - Existe alguma iniciativa inicial ou processo informal.' as label,
        'Há reconhecimento da necessidade e algumas ações iniciais foram tomadas.' as explanation,
        'Continue desenvolvendo e formalizando os processos existentes.' as feedback,
        2.0 as weight,
        ARRAY['tecnica', 'ferramental'] as deficiency_type
    UNION ALL
    SELECT 
        3 as level,
        'Essencial - Existe um processo formal básico implementado.' as label,
        'Há processos formais estabelecidos e sendo seguidos pela organização.' as explanation,
        'Busque aprimorar e otimizar os processos existentes.' as feedback,
        3.0 as weight,
        ARRAY['ferramental'] as deficiency_type
    UNION ALL
    SELECT 
        4 as level,
        'Consolidado - O processo está bem estabelecido e é seguido consistentemente.' as label,
        'Os processos estão maduros e são aplicados de forma consistente.' as explanation,
        'Mantenha as boas práticas e busque inovações incrementais.' as feedback,
        4.0 as weight,
        ARRAY[]::text[] as deficiency_type
    UNION ALL
    SELECT 
        5 as level,
        'Avançado - O processo é otimizado, monitorado e continuamente melhorado.' as label,
        'Representa o mais alto nível de maturidade com melhoria contínua.' as explanation,
        'Excelente! Continue com as práticas de melhoria contínua e compartilhe conhecimento.' as feedback,
        5.0 as weight,
        ARRAY[]::text[] as deficiency_type
)
INSERT INTO maturity_response_options (question_id, level, label, explanation, feedback, weight, deficiency_type)
SELECT 
    qwo.question_id,
    sr.level,
    sr.label,
    sr.explanation,
    sr.feedback,
    sr.weight,
    sr.deficiency_type
FROM questions_without_options qwo
CROSS JOIN standard_responses sr;

-- Verificar o resultado final
SELECT 'VERIFICAÇÃO FINAL' as info;
SELECT 
    q.id as question_id,
    q.question,
    COUNT(ro.id) as options_count
FROM maturity_questions q
LEFT JOIN maturity_response_options ro ON q.id = ro.question_id
GROUP BY q.id, q.question
ORDER BY options_count DESC, q.id
LIMIT 15;

-- Mostrar algumas opções criadas
SELECT 'EXEMPLO DE OPÇÕES CRIADAS' as info;
SELECT 
    ro.question_id,
    ro.level,
    ro.label,
    q.question
FROM maturity_response_options ro
JOIN maturity_questions q ON ro.question_id = q.id
ORDER BY ro.question_id, ro.level
LIMIT 10;
