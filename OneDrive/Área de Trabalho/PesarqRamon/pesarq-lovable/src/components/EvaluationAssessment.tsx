import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight, Info, Star, Target, TrendingUp, BarChart3, MessageSquare } from "lucide-react";
import { useMaturityEvaluation } from "@/hooks/useMaturityEvaluation";
import { useCategoryEvaluation } from "@/hooks/useCategoryEvaluation";
import { MaturityResultsCharts } from "./maturity/MaturityResultsCharts";

interface EvaluationAssessmentProps {
  categoryId: string;
  onBack: () => void;
}

export function EvaluationAssessment({ categoryId, onBack }: EvaluationAssessmentProps) {
  const { categories, currentEvaluation, responses } = useMaturityEvaluation();
  const {
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
  } = useCategoryEvaluation(categoryId);

  const categoryData = categories.find(cat => cat.id === categoryId);
  const categoryScore = getCategoryScore();

  // Debug logs melhorados - removidos para evitar spam no console
  useEffect(() => {
    if (currentQuestion && process.env.NODE_ENV === 'development') {
      console.log('🔍 Current Question ID:', currentQuestion.id);
      console.log('🔍 Selected Response:', selectedResponse);
    }
  }, [currentQuestion, selectedResponse]);

  // Função para obter status das outras categorias
  const getOtherCategoriesStatus = () => {
    return categories.map(category => {
      if (category.id === categoryId) return null;
      
      const allQuestions = category.subcategories.flatMap(sub => sub.questions);
      const questionsWithResponses = allQuestions.filter(q => q.responses && q.responses.length > 0);
      const answeredQuestions = questionsWithResponses.filter(q => responses[q.id]);
      
      const isComplete = answeredQuestions.length === questionsWithResponses.length && questionsWithResponses.length > 0;
      const progress = questionsWithResponses.length > 0 ? Math.round((answeredQuestions.length / questionsWithResponses.length) * 100) : 0;
      
      let status = "Não iniciada";
      let color = "bg-gray-500";
      
      if (isComplete) {
        status = "Concluída";
        color = "bg-green-600";
      } else if (answeredQuestions.length > 0) {
        status = "Em andamento";
        color = "bg-blue-500";
      }
      
      return {
        id: category.id,
        title: category.title,
        status,
        color,
        progress,
        answeredQuestions: answeredQuestions.length,
        totalQuestions: questionsWithResponses.length
      };
    }).filter(Boolean);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-20 p-4 lg:p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <p className="text-center mt-4">Carregando avaliação...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Categoria não encontrada
  if (!categoryData) {
    return (
      <div className="pt-20 p-4 lg:p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold">Categoria Não Encontrada</h3>
            </div>
            <p className="mb-4">A categoria solicitada não foi encontrada no sistema.</p>
            <Button onClick={onBack}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sem dados de avaliação
  if (!evaluationData) {
    return (
      <div className="pt-20 p-4 lg:p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">Carregando Dados</h3>
            </div>
            <p className="mb-4">Aguarde enquanto carregamos os dados da avaliação...</p>
            <Button onClick={onBack}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Categoria sem perguntas com respostas
  if (evaluationData.questionsWithResponses === 0) {
    return (
      <div className="pt-20 p-4 lg:p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">Categoria em Configuração</h3>
            </div>
            <p className="mb-4">
              Esta categoria possui {evaluationData.totalQuestions} pergunta(s), mas nenhuma delas tem opções de resposta configuradas ainda.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Entre em contato com o administrador do sistema para configurar as opções de resposta.
            </p>
            <Button onClick={onBack}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Avaliação completa - mostrar resultados
  if (evaluationData?.isComplete && categoryScore) {
    const otherCategories = getOtherCategoriesStatus();
    const totalCategoriesCompleted = otherCategories.filter(cat => cat?.status === "Concluída").length + 1;
    const totalCategories = categories.length;

    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Categoria Concluída: {categoryData?.title}</span>
              </div>
              <Badge className={`${getMaturityColor(categoryScore.maturityLevel)} text-white border-0`}>
                {categoryScore.maturityLevel}
              </Badge>
            </CardTitle>
            <CardDescription>
              Parabéns! Você concluiu a avaliação da categoria {categoryData?.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Resultado da Categoria */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold">Resultado da Avaliação</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-6 bg-white rounded-lg border">
                    <div className="text-4xl font-bold text-blue-600">{categoryScore.averageScore}</div>
                    <div className="text-sm text-muted-foreground mt-2">Pontuação Média</div>
                    <div className="text-xs text-muted-foreground">Escala de 1 a 5</div>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-lg border">
                    <div className={`text-2xl font-bold text-white px-4 py-2 rounded-lg ${getMaturityColor(categoryScore.maturityLevel)}`}>
                      {categoryScore.maturityLevel}
                    </div>
                    <div className="text-sm text-muted-foreground mt-3">Nível de Maturidade</div>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-lg border">
                    <div className="text-4xl font-bold text-green-600">{categoryScore.answeredQuestions}</div>
                    <div className="text-sm text-muted-foreground">Perguntas Respondidas</div>
                    <div className="text-xs text-muted-foreground mt-1">de {categoryScore.totalQuestions} disponíveis</div>
                  </div>
                </div>

                {/* Análise de Deficiências */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Análise de Deficiências Identificadas
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
                      <div className="font-medium text-red-800">Técnica</div>
                      <div className="text-2xl font-bold text-red-600">{categoryScore.deficiencies.tecnica}</div>
                      <div className="text-xs text-red-600">Conhecimentos e habilidades</div>
                    </div>
                    
                    <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                      <div className="font-medium text-orange-800">Comportamental</div>
                      <div className="text-2xl font-bold text-orange-600">{categoryScore.deficiencies.comportamental}</div>
                      <div className="text-xs text-orange-600">Cultura e práticas</div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                      <div className="font-medium text-yellow-800">Ferramental</div>
                      <div className="text-2xl font-bold text-yellow-600">{categoryScore.deficiencies.ferramental}</div>
                      <div className="text-xs text-yellow-600">Recursos e tecnologias</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos e Análises Detalhadas */}
              <div className="bg-slate-50 p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-slate-600" />
                  <h3 className="text-xl font-semibold">Análise Gráfica Detalhada</h3>
                </div>
                
                <MaturityResultsCharts 
                  categoryScore={categoryScore}
                  categoryTitle={categoryData?.title || ''}
                />
              </div>

              {/* Status das Outras Categorias */}
              <div className="bg-slate-50 p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-slate-600" />
                  <h3 className="text-xl font-semibold">Progresso Geral da Avaliação</h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Categorias Concluídas</span>
                    <span className="text-sm text-muted-foreground">{totalCategoriesCompleted} de {totalCategories}</span>
                  </div>
                  <Progress value={(totalCategoriesCompleted / totalCategories) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {otherCategories.map((category) => (
                    <div key={category?.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex-1">
                        <div className="font-medium">{category?.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {category?.answeredQuestions} de {category?.totalQuestions} perguntas
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${category?.color} text-white border-0 text-xs`}>
                          {category?.status}
                        </Badge>
                        {category?.status === "Em andamento" && (
                          <span className="text-xs text-muted-foreground">
                            {category?.progress}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {totalCategoriesCompleted < totalCategories && (
                  <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800">
                      <strong>Próximo passo:</strong> Continue avaliando as demais categorias para obter sua pontuação geral de maturidade.
                    </p>
                  </div>
                )}

                {totalCategoriesCompleted === totalCategories && (
                  <div className="mt-4 p-3 bg-green-50 rounded border-l-4 border-green-500">
                    <p className="text-sm text-green-800">
                      <strong>🎉 Avaliação Completa!</strong> Você concluiu todas as categorias. Acesse o dashboard para ver sua pontuação geral.
                    </p>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={onBack} size="lg">
                  {totalCategoriesCompleted < totalCategories ? "Avaliar Outras Categorias" : "Ver Dashboard Completo"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestionIndex(0)}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Acessar Feedbacks Detalhados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Interface da avaliação em andamento
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{categoryData?.title}</CardTitle>
          <CardDescription>
            Pergunta {currentQuestionIndex + 1} de {evaluationData?.questionsWithResponses}
            {evaluationData && evaluationData.questionsWithResponses < evaluationData.totalQuestions && (
              <span className="block text-yellow-600 mt-1">
                ⚠️ {evaluationData.totalQuestions - evaluationData.questionsWithResponses} pergunta(s) ainda não possuem opções de resposta
              </span>
            )}
          </CardDescription>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent>
          {currentQuestion && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">{currentQuestion.subcategoryTitle}</Badge>
                  {currentQuestion.deficiencyTypes.length > 0 && (
                    <div className="flex gap-1">
                      {currentQuestion.deficiencyTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-6">{currentQuestion.question}</h3>
                
                <div className="space-y-4">
                  {currentQuestion.responses.length === 0 ? (
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Esta pergunta não possui opções de resposta configuradas ainda.
                      </p>
                    </div>
                  ) : (
                    currentQuestion.responses.map((response, index) => (
                      <div key={response.id} className="space-y-2">
                        <div 
                          className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
                            selectedResponse === response.id 
                              ? 'border-primary bg-primary/10 shadow-md' 
                              : 'border-border hover:bg-muted/50 hover:border-muted-foreground/50'
                          }`}
                          onClick={() => handleResponseSelection(response.id)}
                        >
                          <div className="flex items-center h-5">
                            <input
                              type="radio"
                              id={`response-${response.id}`}
                              name={`evaluation-response-${currentQuestion.id}`}
                              value={response.id}
                              checked={selectedResponse === response.id}
                              onChange={(e) => handleResponseSelection(e.target.value)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 focus:ring-2"
                            />
                          </div>
                          <div className="flex-1">
                            <Label 
                              htmlFor={`response-${response.id}`}
                              className="cursor-pointer font-medium text-sm leading-relaxed block"
                            >
                              <span className="font-semibold">Opção {index + 1}:</span> {response.label}
                            </Label>
                          </div>
                        </div>
                        
                        {selectedResponse === response.id && response.explanation && (
                          <div className="ml-7 mt-2 animate-in slide-in-from-top-2 duration-200">
                            <div className="text-xs text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-md border-l-2 border-primary">
                              <strong>O que isso significa:</strong> {response.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <Button 
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="text-sm text-muted-foreground text-center">
                    {evaluationData?.answeredQuestions} de {evaluationData?.questionsWithResponses} respondidas
                    {selectedResponse && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                          ✓ Resposta selecionada
                        </span>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleNextQuestion}
                    disabled={!selectedResponse || currentQuestion.responses.length === 0}
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    {currentQuestionIndex === (evaluationData?.questionsWithResponses || 0) - 1 
                      ? "Finalizar Avaliação" 
                      : "Próxima"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
