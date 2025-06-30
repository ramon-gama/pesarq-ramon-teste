import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface MaturityCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  subcategories: MaturitySubcategory[];
}

interface MaturitySubcategory {
  id: string;
  title: string;
  description: string;
  questions: MaturityQuestion[];
}

interface MaturityQuestion {
  id: string;
  question: string;
  deficiency_types: string[];
  responses: MaturityResponseOption[];
}

interface MaturityResponseOption {
  id: string;
  level: number;
  label: string;
  feedback: string;
  explanation?: string;
  deficiency_type: string[];
}

interface MaturityEvaluation {
  id: string;
  title: string;
  description: string;
  organization_id: string | null;
  status: 'em_andamento' | 'concluida';
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

interface MaturityEvaluationResponse {
  id: string;
  evaluation_id: string;
  question_id: string;
  response_option_id: string;
  notes: string | null;
  answered_at: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEYS = {
  evaluations: 'maturity_evaluations_offline',
  responses: 'maturity_responses_offline'
};

export function useMaturityEvaluation() {
  const [categories, setCategories] = useState<MaturityCategory[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<MaturityEvaluation | null>(null);
  const [responses, setResponses] = useState<Record<string, MaturityEvaluationResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Carregar categorias com subcategorias, perguntas e opções de resposta
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('maturity_categories')
        .select(`
          *,
          subcategories:maturity_subcategories(*),
          questions:maturity_questions(
            *,
            responses:maturity_response_options(*)
          )
        `)
        .order('sort_order', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Organizar dados
      const formattedCategories: MaturityCategory[] = (categoriesData || []).map(cat => ({
        id: cat.id,
        title: cat.title,
        description: cat.description || '',
        icon: cat.icon || 'Target',
        color: cat.color || '#3B82F6',
        subcategories: cat.subcategories?.map((sub: any) => ({
          id: sub.id,
          title: sub.title,
          description: sub.description || '',
          questions: cat.questions?.filter((q: any) => q.subcategory_id === sub.id)
            ?.map((q: any) => ({
              id: q.id,
              question: q.question,
              deficiency_types: q.deficiency_types || [],
              responses: q.responses || []
            })) || []
        })) || []
      }));

      setCategories(formattedCategories);

      // Carregar avaliação em andamento se existir
      const { data: evaluationData } = await supabase
        .from('maturity_evaluations')
        .select('*')
        .eq('status', 'em_andamento')
        .maybeSingle();

      if (evaluationData) {
        setCurrentEvaluation(evaluationData);
        
        // Carregar respostas da avaliação
        const { data: responsesData } = await supabase
          .from('maturity_evaluation_responses')
          .select('*')
          .eq('evaluation_id', evaluationData.id);

        if (responsesData) {
          const responsesMap: Record<string, MaturityEvaluationResponse> = {};
          responsesData.forEach(response => {
            responsesMap[response.question_id] = response;
          });
          setResponses(responsesMap);
        }
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Carregar dados offline se disponível
      loadOfflineData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadOfflineData = () => {
    try {
      const savedEvaluation = localStorage.getItem(STORAGE_KEYS.evaluations);
      const savedResponses = localStorage.getItem(STORAGE_KEYS.responses);

      if (savedEvaluation) {
        setCurrentEvaluation(JSON.parse(savedEvaluation));
      }

      if (savedResponses) {
        setResponses(JSON.parse(savedResponses));
      }
    } catch (error) {
      console.error('Erro ao carregar dados offline:', error);
    }
  };

  const saveToOffline = (evaluation: MaturityEvaluation | null, currentResponses: Record<string, MaturityEvaluationResponse>) => {
    try {
      if (evaluation) {
        localStorage.setItem(STORAGE_KEYS.evaluations, JSON.stringify(evaluation));
      }
      localStorage.setItem(STORAGE_KEYS.responses, JSON.stringify(currentResponses));
    } catch (error) {
      console.error('Erro ao salvar offline:', error);
    }
  };

  const createEvaluation = async (title: string, description: string, organizationId?: string) => {
    try {
      const evaluationData = {
        title,
        description,
        organization_id: organizationId,
        status: 'em_andamento' as const,
        started_at: new Date().toISOString()
      };

      // Tentar salvar no banco primeiro
      const { data, error } = await supabase
        .from('maturity_evaluations')
        .insert(evaluationData)
        .select()
        .single();

      if (error) throw error;

      const newEvaluation = data as MaturityEvaluation;
      setCurrentEvaluation(newEvaluation);
      saveToOffline(newEvaluation, responses);

      return newEvaluation;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      
      // Fallback: criar avaliação offline
      const offlineEvaluation: MaturityEvaluation = {
        id: `offline-${Date.now()}`,
        title,
        description,
        organization_id: organizationId || null,
        status: 'em_andamento',
        started_at: new Date().toISOString(),
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: null
      };

      setCurrentEvaluation(offlineEvaluation);
      saveToOffline(offlineEvaluation, responses);
      
      return offlineEvaluation;
    }
  };

  const saveResponse = async (questionId: string, responseOptionId: string, notes?: string) => {
    if (!currentEvaluation) return;

    const responseData = {
      evaluation_id: currentEvaluation.id,
      question_id: questionId,
      response_option_id: responseOptionId,
      notes: notes || null,
      answered_at: new Date().toISOString()
    };

    try {
      // Tentar salvar no banco
      if (!currentEvaluation.id.startsWith('offline-')) {
        const { data, error } = await supabase
          .from('maturity_evaluation_responses')
          .upsert(responseData, { 
            onConflict: 'evaluation_id,question_id',
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (error) throw error;

        // Atualizar estado local
        const newResponses = {
          ...responses,
          [questionId]: data as MaturityEvaluationResponse
        };
        setResponses(newResponses);
        saveToOffline(currentEvaluation, newResponses);
      } else {
        // Salvamento offline
        const offlineResponse: MaturityEvaluationResponse = {
          id: `offline-${Date.now()}`,
          ...responseData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const newResponses = {
          ...responses,
          [questionId]: offlineResponse
        };
        setResponses(newResponses);
        saveToOffline(currentEvaluation, newResponses);
      }

    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      
      // Fallback offline sem toast
      const offlineResponse: MaturityEvaluationResponse = {
        id: `offline-${Date.now()}`,
        ...responseData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const newResponses = {
        ...responses,
        [questionId]: offlineResponse
      };
      setResponses(newResponses);
      saveToOffline(currentEvaluation, newResponses);
    }
  };

  const completeEvaluation = async () => {
    if (!currentEvaluation) return;

    try {
      const completedEvaluation = {
        ...currentEvaluation,
        status: 'concluida' as const,
        completed_at: new Date().toISOString()
      };

      // Tentar salvar no banco
      if (!currentEvaluation.id.startsWith('offline-')) {
        const { error } = await supabase
          .from('maturity_evaluations')
          .update({
            status: 'concluida',
            completed_at: new Date().toISOString()
          })
          .eq('id', currentEvaluation.id);

        if (error) throw error;
      }

      setCurrentEvaluation(completedEvaluation);
      saveToOffline(completedEvaluation, responses);

    } catch (error) {
      console.error('Erro ao finalizar avaliação:', error);
      
      // Finalizar offline
      const completedEvaluation = {
        ...currentEvaluation,
        status: 'concluida' as const,
        completed_at: new Date().toISOString()
      };

      setCurrentEvaluation(completedEvaluation);
      saveToOffline(completedEvaluation, responses);
    }
  };

  return {
    categories,
    currentEvaluation,
    responses,
    isLoading,
    createEvaluation,
    saveResponse,
    completeEvaluation,
    setCurrentEvaluation
  };
}
