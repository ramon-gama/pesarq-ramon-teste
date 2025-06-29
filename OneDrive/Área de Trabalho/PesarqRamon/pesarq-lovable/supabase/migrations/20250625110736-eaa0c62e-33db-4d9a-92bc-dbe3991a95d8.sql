
-- Atualizar as respostas do nível 2 para remover redundância
UPDATE maturity_response_options 
SET 
  label = 'Em desenvolvimento - Existem algumas práticas informais ou iniciativas pontuais sendo implementadas.',
  explanation = 'Há reconhecimento da necessidade e algumas ações começaram a ser tomadas, mas ainda não estão formalizadas.',
  feedback = 'Continue estruturando e formalizando as práticas já iniciadas para criar processos mais consistentes.'
WHERE level = 2;

-- Verificar as atualizações
SELECT 
  'VERIFICAÇÃO - Respostas Nível 2 Atualizadas' as info,
  COUNT(*) as total_updated,
  label,
  explanation
FROM maturity_response_options 
WHERE level = 2
GROUP BY label, explanation;
