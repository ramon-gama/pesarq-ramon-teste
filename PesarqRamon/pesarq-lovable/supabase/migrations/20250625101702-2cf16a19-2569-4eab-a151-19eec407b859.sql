
-- Primeiro, vamos verificar o estado atual dos IDs
SELECT 
    'maturity_questions' as table_name,
    id,
    question,
    subcategory_id
FROM maturity_questions
ORDER BY subcategory_id, sort_order;

-- Verificar as opções de resposta e seus question_ids
SELECT 
    'maturity_response_options' as table_name,
    id,
    question_id,
    level,
    label
FROM maturity_response_options
ORDER BY question_id, level;

-- Verificar se há correspondência entre os IDs
SELECT 
    q.id as question_id,
    q.question,
    COUNT(ro.id) as response_options_count
FROM maturity_questions q
LEFT JOIN maturity_response_options ro ON q.id = ro.question_id
GROUP BY q.id, q.question
ORDER BY response_options_count ASC, q.id;

-- Corrigir os IDs das opções de resposta para corresponder aos IDs das perguntas
-- Primeiro, vamos criar uma tabela temporária para mapear os IDs corretos
WITH question_mapping AS (
    SELECT 
        q.id as correct_question_id,
        q.question,
        q.subcategory_id,
        q.sort_order,
        ROW_NUMBER() OVER (ORDER BY q.subcategory_id, q.sort_order) as question_order
    FROM maturity_questions q
    ORDER BY q.subcategory_id, q.sort_order
),
response_mapping AS (
    SELECT 
        ro.id as response_id,
        ro.question_id as old_question_id,
        ro.level,
        ro.label,
        ro.feedback,
        ro.weight,
        ro.deficiency_type,
        ro.explanation,
        ROW_NUMBER() OVER (PARTITION BY ro.question_id ORDER BY ro.level) as response_order
    FROM maturity_response_options ro
    ORDER BY ro.question_id, ro.level
)
-- Agora vamos atualizar as opções de resposta com os IDs corretos das perguntas
UPDATE maturity_response_options 
SET question_id = (
    SELECT qm.correct_question_id
    FROM question_mapping qm
    WHERE qm.question_order = (
        SELECT rm.response_order
        FROM response_mapping rm
        WHERE rm.response_id = maturity_response_options.id
        AND rm.old_question_id = maturity_response_options.question_id
        LIMIT 1
    )
    LIMIT 1
)
WHERE EXISTS (
    SELECT 1 
    FROM response_mapping rm 
    WHERE rm.response_id = maturity_response_options.id
);

-- Verificar se a correção funcionou
SELECT 
    q.id as question_id,
    q.question,
    COUNT(ro.id) as response_options_count
FROM maturity_questions q
LEFT JOIN maturity_response_options ro ON q.id = ro.question_id
GROUP BY q.id, q.question
ORDER BY response_options_count ASC, q.id;

-- Se ainda houver problemas, vamos fazer uma correção mais direta
-- Atualizar os question_ids das opções de resposta para corresponder aos IDs das perguntas ordenadamente
WITH ordered_questions AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY subcategory_id, sort_order) as rn
    FROM maturity_questions
),
ordered_responses AS (
    SELECT 
        id,
        question_id,
        level,
        DENSE_RANK() OVER (ORDER BY question_id) as question_rank
    FROM maturity_response_options
    ORDER BY question_id, level
)
UPDATE maturity_response_options
SET question_id = (
    SELECT oq.id
    FROM ordered_questions oq
    WHERE oq.rn = (
        SELECT or1.question_rank
        FROM ordered_responses or1
        WHERE or1.id = maturity_response_options.id
    )
);
