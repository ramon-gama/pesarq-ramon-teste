
export interface SectorResponse {
  pergunta: string;
  resposta: string;
}

export interface CriticalityResult {
  level: 'alta' | 'moderada' | 'baixa' | 'revisar';
  score: number;
  reasons: string[];
  color: string;
  icon: string;
  tooltip: string;
}

export function calculateCriticality(responses: SectorResponse[]): CriticalityResult {
  console.log('Calculating criticality for responses:', responses);
  
  const reasons: string[] = [];
  let criticalityScore = 0;
  
  // Mapear respostas por tipo para facilitar a análise
  const responseMap: { [key: string]: string } = {};
  responses.forEach((response, index) => {
    responseMap[`pergunta_${index + 1}`] = response.resposta;
  });
  
  // Extrair informações específicas das respostas
  const problemasGestao = responseMap.pergunta_1 || '';
  const volumeDocumental = responseMap.pergunta_4 || '';
  const estadoConservacao = responseMap.pergunta_5 || '';
  const condicoesLocal = responseMap.pergunta_6 || '';
  
  // Converter volume para número para comparação
  let volumeNumerico = 0;
  if (volumeDocumental.includes('201 a 500')) volumeNumerico = 350;
  else if (volumeDocumental.includes('501 a 1000')) volumeNumerico = 750;
  else if (volumeDocumental.includes('1001 a 2000')) volumeNumerico = 1500;
  else if (volumeDocumental.includes('Mais de 2000')) volumeNumerico = 2500;
  else if (volumeDocumental.includes('Até 200')) volumeNumerico = 100;
  
  console.log('Volume numérico calculado:', volumeNumerico);
  
  // 🔺 CRITÉRIOS DE ALTA CRITICIDADE (classificação automática)
  
  // 1. Problemas significativos + volume alto
  if ((problemasGestao.includes('Desafios Significativos') || problemasGestao.includes('Alta Criticidade')) 
      && volumeNumerico > 1000) {
    reasons.push('Desafios significativos com volume documental elevado');
    return {
      level: 'alta',
      score: 100,
      reasons,
      color: '#ef4444',
      icon: 'AlertTriangle',
      tooltip: 'Exposição elevada a riscos documentais. Ação imediata recomendada.'
    };
  }
  
  // 2. Volume extremamente elevado
  if (volumeNumerico > 2000) {
    reasons.push('Volume documental extremamente elevado (>2000 caixas)');
    return {
      level: 'alta',
      score: 100,
      reasons,
      color: '#ef4444',
      icon: 'AlertTriangle',
      tooltip: 'Exposição elevada a riscos documentais. Ação imediata recomendada.'
    };
  }
  
  // 3. Estado de conservação ou condições ruins
  if (estadoConservacao === 'Ruim' || condicoesLocal === 'Ruim' || condicoesLocal === 'Inadequado') {
    reasons.push('Estado de conservação ou condições do local inadequadas');
    return {
      level: 'alta',
      score: 100,
      reasons,
      color: '#ef4444',
      icon: 'AlertTriangle',
      tooltip: 'Exposição elevada a riscos documentais. Ação imediata recomendada.'
    };
  }
  
  // Contar respostas de alta criticidade
  let respostasAltaCriticidade = 0;
  responses.forEach(response => {
    if (response.resposta.includes('Desafios Significativos') || 
        response.resposta.includes('Alta Criticidade') ||
        response.resposta === 'Ruim' ||
        response.resposta === 'Inadequado') {
      respostasAltaCriticidade++;
    }
  });
  
  // 4. Mais de 3 respostas de alta criticidade
  if (respostasAltaCriticidade >= 3) {
    reasons.push(`${respostasAltaCriticidade} respostas classificadas como alta criticidade`);
    return {
      level: 'alta',
      score: 100,
      reasons,
      color: '#ef4444',
      icon: 'AlertTriangle',
      tooltip: 'Exposição elevada a riscos documentais. Ação imediata recomendada.'
    };
  }
  
  // 🟡 CRITÉRIOS DE CRITICIDADE MODERADA
  
  // Contar respostas de criticidade moderada
  let respostasModeradas = 0;
  responses.forEach(response => {
    if (response.resposta.includes('Regular') || 
        response.resposta.includes('Razoável') ||
        response.resposta.includes('Moderada') ||
        response.resposta === 'Sim' && response.pergunta.includes('ainda produz')) {
      respostasModeradas++;
    }
  });
  
  // Volume entre 201 e 1000 + pelo menos 2 respostas moderadas
  if (volumeNumerico >= 201 && volumeNumerico <= 1000 && respostasModeradas >= 2) {
    reasons.push('Volume moderado com condições que requerem atenção');
    return {
      level: 'moderada',
      score: 60,
      reasons,
      color: '#f59e0b',
      icon: 'TrendingUp',
      tooltip: 'Necessário monitoramento e ações pontuais de melhoria.'
    };
  }
  
  // 🟢 CRITÉRIOS SEM CRITICIDADE (estável)
  
  let criteriosEstaveis = 0;
  const criteriosVerificacao: string[] = [];
  
  // 1. Volume inferior a 200 caixas
  if (volumeNumerico <= 200) {
    criteriosEstaveis++;
    criteriosVerificacao.push('Volume documental baixo');
  }
  
  // 2. Condições físicas boas ou razoáveis
  if (estadoConservacao === 'Bom' || estadoConservacao === 'Razoável' ||
      condicoesLocal === 'Bom' || condicoesLocal === 'Razoável') {
    criteriosEstaveis++;
    criteriosVerificacao.push('Condições físicas adequadas');
  }
  
  // 3. Frequência de uso baixa
  const frequenciaUso = responseMap.pergunta_8 || '';
  if (frequenciaUso.includes('Ocasional') || frequenciaUso.includes('Baixa')) {
    criteriosEstaveis++;
    criteriosVerificacao.push('Frequência de uso controlada');
  }
  
  // 4. Sem problemas significativos
  if (!problemasGestao.includes('Desafios Significativos') && 
      !problemasGestao.includes('Alta Criticidade')) {
    criteriosEstaveis++;
    criteriosVerificacao.push('Sem problemas significativos relatados');
  }
  
  console.log('Critérios estáveis atendidos:', criteriosEstaveis);
  
  // Pelo menos 3 critérios de estabilidade atendidos
  if (criteriosEstaveis >= 3) {
    reasons.push(...criteriosVerificacao);
    return {
      level: 'baixa',
      score: 20,
      reasons,
      color: '#10b981',
      icon: 'CheckCircle',
      tooltip: 'Situação controlada e aderente às boas práticas.'
    };
  }
  
  // Caso não se enquadre em nenhuma categoria específica
  reasons.push('Setor requer análise manual detalhada');
  return {
    level: 'revisar',
    score: 50,
    reasons,
    color: '#6b7280',
    icon: 'AlertCircle',
    tooltip: 'Setor requer revisão manual para classificação adequada.'
  };
}
