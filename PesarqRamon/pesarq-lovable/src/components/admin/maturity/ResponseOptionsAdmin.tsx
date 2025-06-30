
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

interface ResponseOption {
  id: string;
  question_id: string;
  level: number;
  label: string;
  explanation: string;
  feedback: string;
  weight: number;
  deficiency_type: string[];
}

interface Question {
  id: string;
  question: string;
  subcategory_id: string;
}

export function ResponseOptionsAdmin() {
  const [responseOptions, setResponseOptions] = useState<ResponseOption[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ResponseOption | null>(null);
  const [formData, setFormData] = useState({
    question_id: "",
    level: 1,
    label: "",
    explanation: "",
    feedback: "",
    weight: 1.0,
    deficiency_type: [] as string[]
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Carregar perguntas
      const { data: questionsData, error: questionsError } = await supabase
        .from('maturity_questions')
        .select('*')
        .order('subcategory_id, sort_order');

      if (questionsError) {
        console.error('Erro ao carregar perguntas:', questionsError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as perguntas",
          variant: "destructive"
        });
        return;
      }
      
      setQuestions(questionsData || []);

      // Carregar opções de resposta
      const { data: optionsData, error: optionsError } = await supabase
        .from('maturity_response_options')
        .select('*')
        .order('question_id, level');

      if (optionsError) {
        console.error('Erro ao carregar opções:', optionsError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as opções de resposta",
          variant: "destructive"
        });
        return;
      }
      
      setResponseOptions(optionsData || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.question_id) {
      toast({
        title: "Erro de Validação",
        description: "Pergunta é obrigatória",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.label.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Texto da resposta é obrigatório",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.feedback.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Feedback é obrigatório",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const optionData = {
        question_id: formData.question_id,
        level: formData.level,
        label: formData.label.trim(),
        explanation: formData.explanation?.trim() || "",
        feedback: formData.feedback.trim(),
        weight: Number(formData.weight),
        deficiency_type: formData.deficiency_type
      };

      if (editingOption) {
        const { error } = await supabase
          .from('maturity_response_options')
          .update(optionData)
          .eq('id', editingOption.id);

        if (error) {
          console.error('Erro na atualização:', error);
          toast({
            title: "Erro",
            description: `Falha ao atualizar opção: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
        
        toast({ 
          title: "Sucesso", 
          description: "Opção de resposta atualizada com sucesso"
        });
      } else {
        const { error } = await supabase
          .from('maturity_response_options')
          .insert([optionData]);

        if (error) {
          console.error('Erro na criação:', error);
          toast({
            title: "Erro",
            description: `Falha ao criar opção: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
        
        toast({ 
          title: "Sucesso", 
          description: "Opção de resposta criada com sucesso"
        });
      }

      await loadData();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado no salvamento",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (option: ResponseOption) => {
    setEditingOption(option);
    setFormData({
      question_id: option.question_id,
      level: option.level,
      label: option.label,
      explanation: option.explanation || "",
      feedback: option.feedback,
      weight: option.weight || 1.0,
      deficiency_type: option.deficiency_type || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (optionId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta opção de resposta?')) return;

    try {
      const { error } = await supabase
        .from('maturity_response_options')
        .delete()
        .eq('id', optionId);

      if (error) {
        console.error('Erro na exclusão:', error);
        toast({
          title: "Erro",
          description: `Falha ao excluir opção: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      toast({ 
        title: "Sucesso", 
        description: "Opção de resposta excluída com sucesso"
      });
      
      await loadData();
    } catch (error) {
      console.error('Erro inesperado na exclusão:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado na exclusão",
        variant: "destructive"
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingOption(null);
    setFormData({
      question_id: "",
      level: 1,
      label: "",
      explanation: "",
      feedback: "",
      weight: 1.0,
      deficiency_type: []
    });
  };

  const getQuestionText = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question ? question.question : questionId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando opções de resposta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Opções de Resposta ({responseOptions.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Opção de Resposta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOption ? 'Editar Opção de Resposta' : 'Nova Opção de Resposta'}
              </DialogTitle>
              <DialogDescription>
                {editingOption ? 'Edite as informações da opção' : 'Crie uma nova opção de resposta'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question_id">Pergunta *</Label>
                <Select value={formData.question_id} onValueChange={(value) => setFormData(prev => ({ ...prev, question_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma pergunta" />
                  </SelectTrigger>
                  <SelectContent>
                    {questions.map((question) => (
                      <SelectItem key={question.id} value={question.id}>
                        <div className="max-w-md truncate">
                          {question.id}: {question.question}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Nível (1-5) *</Label>
                  <Select value={formData.level.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, level: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          Nível {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 1.0 }))}
                    placeholder="1.0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Texto da Resposta *</Label>
                <Textarea
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Ex: Não existe nenhuma política formal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Explicação (mostrada durante a avaliação)</Label>
                <Textarea
                  id="explanation"
                  value={formData.explanation}
                  onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                  placeholder="Explique o que significa escolher esta opção"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (mostrado no resultado final) *</Label>
                <Textarea
                  id="feedback"
                  value={formData.feedback}
                  onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="Feedback a ser exibido no resultado final"
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingOption ? 'Atualizar' : 'Criar'} Opção
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pergunta</TableHead>
            <TableHead>Nível</TableHead>
            <TableHead>Resposta</TableHead>
            <TableHead>Explicação</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead>Peso</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responseOptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhuma opção de resposta encontrada. Clique em "Nova Opção de Resposta" para começar.
              </TableCell>
            </TableRow>
          ) : (
            responseOptions.map((option) => (
              <TableRow key={option.id}>
                <TableCell className="max-w-xs truncate">
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-muted-foreground">{option.question_id}</div>
                    <div className="text-sm">{getQuestionText(option.question_id)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Nível {option.level}</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{option.label}</TableCell>
                <TableCell className="max-w-xs truncate">{option.explanation}</TableCell>
                <TableCell className="max-w-xs truncate">{option.feedback}</TableCell>
                <TableCell>{option.weight}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(option)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(option.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
