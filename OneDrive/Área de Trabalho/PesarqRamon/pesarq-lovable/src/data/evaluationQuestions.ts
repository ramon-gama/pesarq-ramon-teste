
// Este arquivo foi mantido apenas para referência histórica
// O sistema agora usa exclusivamente dados do Supabase

export interface EvaluationQuestion {
  id: string;
  question: string;
  responses: {
    level: number;
    label: string;
    feedback: string;
  }[];
}

export interface EvaluationSubcategory {
  id: string;
  title: string;
  questions: EvaluationQuestion[];
}

export interface EvaluationCategory {
  id: string;
  title: string;
  subcategories: EvaluationSubcategory[];
}

// Dados movidos para o banco Supabase
// Usar useMaturityEvaluation() para acessar os dados atuais
export const evaluationData: EvaluationCategory[] = [];
