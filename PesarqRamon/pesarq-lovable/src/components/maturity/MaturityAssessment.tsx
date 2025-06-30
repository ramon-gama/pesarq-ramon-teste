import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Users, MessageSquare, Settings, Activity } from "lucide-react";
import { useMaturityEvaluation } from "@/hooks/useMaturityEvaluation";

interface MaturityAssessmentProps {
  onStartCategoryEvaluation: (categoryId: string) => void;
}

const iconMap = {
  Target,
  Users,
  MessageSquare,
  Settings,
  Activity
};

export function MaturityAssessment({ onStartCategoryEvaluation }: MaturityAssessmentProps) {
  const { categories, isLoading, createEvaluation, responses } = useMaturityEvaluation();

  const getMaturityLevel = (categoryId: string) => {
    // Verificar se há respostas para esta categoria
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return { level: "Não avaliado", color: "bg-gray-500" };
    
    const categoryQuestions = category.subcategories.flatMap(sub => sub.questions);
    const answeredQuestions = categoryQuestions.filter(q => responses[q.id]);
    
    if (answeredQuestions.length === 0) {
      return { level: "Não avaliado", color: "bg-gray-500" };
    }
    
    // Se há respostas parciais
    const questionsWithResponses = categoryQuestions.filter(q => q.responses.length > 0);
    if (answeredQuestions.length < questionsWithResponses.length) {
      return { level: "Em andamento", color: "bg-blue-500" };
    }
    
    // Se todas foram respondidas, calcular nível baseado na média
    const totalScore = answeredQuestions.reduce((sum, question) => {
      const response = responses[question.id];
      const responseOption = question.responses.find(r => r.id === response.response_option_id);
      return sum + (responseOption?.level || 0);
    }, 0);
    
    const averageScore = totalScore / answeredQuestions.length;
    
    if (averageScore >= 4.1) return { level: "Avançado", color: "bg-green-600" };
    if (averageScore >= 3.1) return { level: "Consolidado", color: "bg-green-500" };
    if (averageScore >= 2.1) return { level: "Essencial", color: "bg-yellow-500" };
    if (averageScore >= 1.1) return { level: "Em desenvolvimento", color: "bg-orange-500" };
    return { level: "Não estabelecido", color: "bg-red-500" };
  };

  const getCategoryProgress = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return { answered: 0, total: 0, withResponses: 0 };
    
    const allQuestions = category.subcategories.flatMap(sub => sub.questions);
    const questionsWithResponses = allQuestions.filter(q => q.responses.length > 0);
    const answeredQuestions = questionsWithResponses.filter(q => responses[q.id]);
    
    return {
      answered: answeredQuestions.length,
      total: allQuestions.length,
      withResponses: questionsWithResponses.length
    };
  };

  const handleStartEvaluation = async (categoryId: string) => {
    console.log('Starting evaluation for category:', categoryId);
    try {
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) return;
      
      // Criar nova avaliação se não existir uma ativa
      const evaluation = await createEvaluation(
        `Avaliação de Maturidade - ${category.title}`,
        `Avaliação da categoria ${category.title}`,
        category.id
      );
      console.log('Evaluation created/loaded:', evaluation);
      
      if (evaluation) {
        onStartCategoryEvaluation(categoryId);
      }
    } catch (error) {
      console.error('Error starting evaluation:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecione uma Categoria para Avaliar</CardTitle>
        <CardDescription>
          Cada categoria contém subcategorias com perguntas específicas. Responda todas as perguntas para obter sua pontuação de maturidade na escala de 1 a 5.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Target;
            const progress = getCategoryProgress(category.id);
            const maturity = getMaturityLevel(category.id);
            
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className={`p-3 ${category.color} rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {category.subcategories.length} subcategorias • {progress.withResponses} perguntas
                      </span>
                      <Badge variant="outline" className={`${maturity.color} text-white border-0`}>
                        {maturity.level}
                      </Badge>
                    </div>
                    
                    {progress.answered > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Progresso: {progress.answered}/{progress.withResponses} perguntas respondidas
                      </div>
                    )}
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleStartEvaluation(category.id)}
                    >
                      {progress.answered === 0 ? 'Iniciar Avaliação' : 
                       progress.answered === progress.withResponses ? 'Ver Resultados' : 'Continuar Avaliação'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
