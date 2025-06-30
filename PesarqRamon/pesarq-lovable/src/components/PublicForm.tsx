
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Building, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  respondentName: string;
  department: string;
  email: string;
  answers: Record<string, string>;
}

const PublicForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    respondentName: '',
    department: '',
    email: '',
    answers: {}
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Perguntas de exemplo (em produção viriam do banco de dados)
  const questions = [
    {
      id: '1',
      text: 'Existe um sistema de protocolo implantado no órgão?',
      type: 'boolean',
      category: 'Gestão Documental'
    },
    {
      id: '2',
      text: 'Como você avalia o nível de organização dos arquivos?',
      type: 'scale',
      category: 'Organização'
    },
    {
      id: '3',
      text: 'Qual o principal desafio enfrentado na gestão documental?',
      type: 'multiple',
      category: 'Desafios',
      options: ['Falta de espaço', 'Falta de pessoal', 'Sistema inadequado', 'Falta de treinamento']
    },
    {
      id: '4',
      text: 'Descreva as principais dificuldades encontradas no arquivo:',
      type: 'text',
      category: 'Observações'
    }
  ];

  const totalSteps = questions.length + 2; // +2 para identificação e confirmação
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep === 0) {
      // Validar dados de identificação
      if (!formData.respondentName || !formData.department) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));
  };

  const handleSubmit = () => {
    // Aqui integraria com Supabase para salvar as respostas
    console.log('Submitting form:', formData);
    setIsSubmitted(true);
    toast({
      title: "Sucesso!",
      description: "Suas respostas foram enviadas com sucesso."
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-2xl mb-4">Diagnóstico Enviado!</CardTitle>
            <CardDescription className="text-lg mb-6">
              Obrigado pela sua participação. Suas respostas foram registradas com sucesso.
            </CardDescription>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Resumo da Submissão:</h4>
              <p><strong>Respondente:</strong> {formData.respondentName}</p>
              <p><strong>Setor:</strong> {formData.department}</p>
              <p><strong>Total de respostas:</strong> {Object.keys(formData.answers).length}</p>
              <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Diagnóstico Arquivístico
          </CardTitle>
          <CardDescription>
            Responda as perguntas para auxiliar no diagnóstico da situação arquivística do seu setor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso</span>
              <span>{currentStep + 1} de {totalSteps}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {currentStep === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Identificação
              </h3>
              
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.respondentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, respondentName: e.target.value }))}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <Label htmlFor="department">Setor/Departamento *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Ex: Secretaria de Administração"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          )}

          {currentStep > 0 && currentStep <= questions.length && (
            <div className="space-y-4">
              {(() => {
                const question = questions[currentStep - 1];
                return (
                  <div>
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {question.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">
                      {question.text}
                    </h3>

                    {question.type === 'boolean' && (
                      <RadioGroup
                        value={formData.answers[question.id] || ''}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="sim" />
                          <Label htmlFor="sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="nao" />
                          <Label htmlFor="nao">Não</Label>
                        </div>
                      </RadioGroup>
                    )}

                    {question.type === 'scale' && (
                      <RadioGroup
                        value={formData.answers[question.id] || ''}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                      >
                        <div className="grid grid-cols-5 gap-4">
                          {[1, 2, 3, 4, 5].map(num => (
                            <div key={num} className="flex flex-col items-center space-y-2">
                              <RadioGroupItem value={num.toString()} id={num.toString()} />
                              <Label htmlFor={num.toString()} className="text-center">
                                {num}
                                {num === 1 && <div className="text-xs text-gray-500">Muito baixo</div>}
                                {num === 3 && <div className="text-xs text-gray-500">Regular</div>}
                                {num === 5 && <div className="text-xs text-gray-500">Muito alto</div>}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    )}

                    {question.type === 'multiple' && question.options && (
                      <RadioGroup
                        value={formData.answers[question.id] || ''}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                      >
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {question.type === 'text' && (
                      <Textarea
                        value={formData.answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Digite sua resposta..."
                        rows={4}
                      />
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {currentStep === totalSteps - 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Confirmar Envio</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Respondente:</strong> {formData.respondentName}</p>
                <p><strong>Setor:</strong> {formData.department}</p>
                {formData.email && <p><strong>E-mail:</strong> {formData.email}</p>}
                <p><strong>Respostas registradas:</strong> {Object.keys(formData.answers).length} de {questions.length}</p>
              </div>
              
              <p className="text-sm text-gray-600">
                Ao confirmar, suas respostas serão enviadas para análise. 
                Você poderá visualizar um resumo após o envio.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>

            {currentStep < totalSteps - 1 ? (
              <Button onClick={handleNext}>
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Enviar Diagnóstico
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicForm;
