
import { useState, useEffect, useMemo } from "react";
import { useMaturityEvaluation } from "./useMaturityEvaluation";
import { useToast } from "./use-toast";

interface CategoryEvaluationData {
  totalQuestions: number;
  questionsWithResponses: number;
  answeredQuestions: number;
  isComplete: boolean;
}

interface CategoryScore {
  averageScore: number;
  maturityLevel: string;
  deficiencies: {
    tecnica: number;
    comportamental: number;
    ferramental: number;
  };
  answeredQuestions: number;
  totalQuestions: number;
}

interface CurrentQuestionData {
  id: string;
  question: string;
  subcategoryTitle: string;
  deficiencyTypes: string[];
  responses: Array<{
    id: string;
    level: number;
    label: string;
    feedback: string;
    explanation?: string;
    deficiency_type: string[];
  }>;
}

export function useCategoryEvaluation(categoryId: string) {
  const { 
    categories, 
    currentEvaluation, 
    responses, 
    createEvaluation, 
    saveResponse, 
    completeEvaluation,
    setCurrentEvaluation 
  } = useMaturityEvaluation();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const categoryData = categories.find(cat => cat.id === categoryId);

  // Calcular dados da avaliação para esta categoria
  const evaluationData = useMemo((): CategoryEvaluationData | null => {
    if (!categoryData) return null;

    const allQuestions = categoryData.subcategories.flatMap(sub => sub.questions);
    const questionsWithResponses = allQuestions.filter(q => q.responses && q.responses.length > 0);
    const answeredQuestions = questionsWithResponses.filter(q => responses[q.id]);

    return {
      totalQuestions: allQuestions.length,
      questionsWithResponses: questionsWithResponses.length,
      answeredQuestions: answeredQuestions.length,
      isComplete: answeredQuestions.length === questionsWithResponses.length && questionsWithResponses.length > 0
    };
  }, [categoryData, responses]);

  // Lista de perguntas com respostas para navegação
  const questionsWithResponses = useMemo(() => {
    if (!categoryData) return [];
    return categoryData.subcategories.flatMap(sub => 
      sub.questions.filter(q => q.responses && q.responses.length > 0)
        .map(q => ({
          ...q,
          subcategoryTitle: sub.title
        }))
    );
  }, [categoryData]);

  // Pergunta atual
  const currentQuestion = useMemo((): CurrentQuestionData | null => {
    const question = questionsWithResponses[currentQuestionIndex];
    if (!question) return null;

    return {
      id: question.id,
      question: question.question,
      subcategoryTitle: question.subcategoryTitle,
      deficiencyTypes: question.deficiency_types || [],
      responses: question.responses || []
    };
  }, [questionsWithResponses, currentQuestionIndex]);

  // Progresso da avaliação
  const progress = useMemo(() => {
    if (!evaluationData || evaluationData.questionsWithResponses === 0) return 0;
    return Math.round((currentQuestionIndex + 1) / evaluationData.questionsWithResponses * 100);
  }, [currentQuestionIndex, evaluationData]);

  // Garantir que existe uma avaliação ativa
  useEffect(() => {
    const initializeEvaluation = async () => {
      try {
        setIsLoading(true);
        
        if (!currentEvaluation && categoryData) {
          await createEvaluation(
            `Avaliação de Maturidade - ${categoryData.title}`,
            `Avaliação da categoria ${categoryData.title}`,
            categoryData.id
          );
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar avaliação:', error);
        // Não mostrar toast de erro para não interromper o usuário
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryData) {
      initializeEvaluation();
    }
  }, [categoryId, currentEvaluation, createEvaluation, categoryData]);

  // Carregar resposta selecionada quando pergunta muda
  useEffect(() => {
    if (currentQuestion && responses[currentQuestion.id]) {
      setSelectedResponse(responses[currentQuestion.id].response_option_id);
    } else {
      setSelectedResponse("");
    }
  }, [currentQuestion, responses]);

  // Funções de navegação
  const handleNextQuestion = async () => {
    if (!currentQuestion || !selectedResponse || !currentEvaluation) return;

    try {
      // Salvar resposta atual silenciosamente
      await saveResponse(currentQuestion.id, selectedResponse);

      // Verificar se é a última pergunta
      if (currentQuestionIndex === questionsWithResponses.length - 1) {
        await completeEvaluation();
        
        toast({
          title: "Avaliação Concluída!",
          description: "Sua avaliação foi salva com sucesso",
          variant: "default"
        });
      } else {
        // Ir para próxima pergunta
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('❌ Erro ao processar resposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a resposta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleResponseSelection = (responseId: string) => {
    setSelectedResponse(responseId);
  };

  // Calcular score da categoria
  const getCategoryScore = (): CategoryScore | null => {
    if (!evaluationData?.isComplete || !categoryData) return null;

    const questionsAnswered = questionsWithResponses.filter(q => responses[q.id]);
    if (questionsAnswered.length === 0) return null;

    let totalScore = 0;
    let deficienciesTecnica = 0;
    let deficienciasComportamental = 0;
    let deficienciasFerramental = 0;

    questionsAnswered.forEach(question => {
      const response = responses[question.id];
      if (response) {
        // Encontrar a opção de resposta selecionada
        const selectedOption = question.responses.find(opt => opt.id === response.response_option_id);
        if (selectedOption) {
          totalScore += selectedOption.level;
          
          // Contar deficiências
          const deficiencies = selectedOption.deficiency_type || [];
          if (deficiencies.includes('tecnica')) deficienciesTecnica++;
          if (deficiencies.includes('comportamental')) deficienciasComportamental++;
          if (deficiencies.includes('ferramental')) deficienciasFerramental++;
        }
      }
    });

    const averageScore = Number((totalScore / questionsAnswered.length).toFixed(1));
    const maturityLevel = getMaturityLevel(averageScore);

    return {
      averageScore,
      maturityLevel,
      deficiencies: {
        tecnica: deficienciesTecnica,
        comportamental: deficienciasComportamental,
        ferramental: deficienciasFerramental
      },
      answeredQuestions: questionsAnswered.length,
      totalQuestions: questionsWithResponses.length
    };
  };

  const getMaturityLevel = (score: number): string => {
    if (score >= 4.1) return "Avançado";
    if (score >= 3.1) return "Consolidado";
    if (score >= 2.1) return "Essencial";
    if (score >= 1.1) return "Em desenvolvimento";
    return "Não estabelecido";
  };

  const getMaturityColor = (level: string): string => {
    switch (level) {
      case "Avançado": return "bg-green-600";
      case "Consolidado": return "bg-green-500";
      case "Essencial": return "bg-yellow-500";
      case "Em desenvolvimento": return "bg-orange-500";
      case "Não estabelecido": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return {
    evaluationData,
    currentQuestionIndex,
    selectedResponse,
    isLoading,
    currentQuestion,
    progress,
    getCategoryScore,
    getMaturityLevel,
    getMaturityColor,
    handleResponseSelection,
    handleNextQuestion,
    handlePreviousQuestion,
    setCurrentQuestionIndex
  };
}
