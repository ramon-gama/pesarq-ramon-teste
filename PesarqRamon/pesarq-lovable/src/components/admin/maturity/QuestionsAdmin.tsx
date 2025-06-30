
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Question {
  id: string;
  question: string;
  subcategory_id: string;
  deficiency_types: string[];
  sort_order: number;
}

interface Subcategory {
  id: string;
  title: string;
  category_id: string;
}

interface Category {
  id: string;
  title: string;
}

const deficiencyTypes = [
  { value: "tecnica", label: "Técnica" },
  { value: "ferramental", label: "Ferramental" },
  { value: "comportamental", label: "Comportamental" }
];

export function QuestionsAdmin() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    question: "",
    subcategory_id: "",
    deficiency_types: [] as string[],
    sort_order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Carregar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('maturity_categories')
        .select('id, title')
        .order('sort_order');

      if (categoriesError) {
        console.error('Erro ao carregar categorias:', categoriesError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias",
          variant: "destructive"
        });
        return;
      }
      
      setCategories(categoriesData || []);

      // Carregar subcategorias
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('maturity_subcategories')
        .select('*')
        .order('sort_order');

      if (subcategoriesError) {
        console.error('Erro ao carregar subcategorias:', subcategoriesError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as subcategorias",
          variant: "destructive"
        });
        return;
      }
      
      setSubcategories(subcategoriesData || []);

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
    if (!formData.question.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Pergunta é obrigatória",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.subcategory_id) {
      toast({
        title: "Erro de Validação",
        description: "Subcategoria é obrigatória",
        variant: "destructive"
      });
      return false;
    }
    
    if (!editingQuestion && !formData.id.trim()) {
      toast({
        title: "Erro de Validação", 
        description: "ID é obrigatório para nova pergunta",
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
      const questionData = {
        question: formData.question.trim(),
        subcategory_id: formData.subcategory_id,
        deficiency_types: formData.deficiency_types,
        sort_order: formData.sort_order || questions.filter(q => q.subcategory_id === formData.subcategory_id).length
      };

      if (editingQuestion) {
        const { error } = await supabase
          .from('maturity_questions')
          .update(questionData)
          .eq('id', editingQuestion.id);

        if (error) {
          console.error('Erro na atualização:', error);
          toast({
            title: "Erro",
            description: `Falha ao atualizar pergunta: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
        
        toast({ 
          title: "Sucesso", 
          description: "Pergunta atualizada com sucesso"
        });
      } else {
        const insertData = {
          id: formData.id.trim(),
          ...questionData
        };
        
        const { error } = await supabase
          .from('maturity_questions')
          .insert([insertData]);

        if (error) {
          console.error('Erro na criação:', error);
          toast({
            title: "Erro",
            description: `Falha ao criar pergunta: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
        
        toast({ 
          title: "Sucesso", 
          description: "Pergunta criada com sucesso"
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

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      id: question.id,
      question: question.question,
      subcategory_id: question.subcategory_id,
      deficiency_types: question.deficiency_types || [],
      sort_order: question.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return;

    try {
      const { error } = await supabase
        .from('maturity_questions')
        .delete()
        .eq('id', questionId);

      if (error) {
        console.error('Erro na exclusão:', error);
        toast({
          title: "Erro",
          description: `Falha ao excluir pergunta: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      toast({ 
        title: "Sucesso", 
        description: "Pergunta excluída com sucesso"
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
    setEditingQuestion(null);
    setFormData({
      id: "",
      question: "",
      subcategory_id: "",
      deficiency_types: [],
      sort_order: 0
    });
  };

  const getSubcategoryInfo = (subcategoryId: string) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    const category = categories.find(cat => cat.id === subcategory?.category_id);
    return {
      subcategoryTitle: subcategory?.title || subcategoryId,
      categoryTitle: category?.title || ""
    };
  };

  const handleDeficiencyTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      deficiency_types: checked 
        ? [...prev.deficiency_types, type]
        : prev.deficiency_types.filter(t => t !== type)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando perguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Perguntas ({questions.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Pergunta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? 'Editar Pergunta' : 'Nova Pergunta'}
              </DialogTitle>
              <DialogDescription>
                {editingQuestion ? 'Edite as informações da pergunta' : 'Crie uma nova pergunta'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subcategory_id">Subcategoria *</Label>
                <Select value={formData.subcategory_id} onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => {
                      const categoryTitle = categories.find(cat => cat.id === subcategory.category_id)?.title;
                      return (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {categoryTitle} → {subcategory.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {!editingQuestion && (
                <div className="space-y-2">
                  <Label htmlFor="id">ID da Pergunta *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="ex: q1-governance-policy"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="question">Pergunta *</Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Digite a pergunta"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipos de Deficiência</Label>
                <div className="flex flex-wrap gap-4">
                  {deficiencyTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={formData.deficiency_types.includes(type.value)}
                        onCheckedChange={(checked) => handleDeficiencyTypeChange(type.value, checked as boolean)}
                      />
                      <Label htmlFor={type.value}>{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">Ordem de Exibição</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingQuestion ? 'Atualizar' : 'Criar'} Pergunta
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Pergunta</TableHead>
            <TableHead>Categoria/Subcategoria</TableHead>
            <TableHead>Deficiências</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhuma pergunta encontrada. Clique em "Nova Pergunta" para começar.
              </TableCell>
            </TableRow>
          ) : (
            questions.map((question) => {
              const { subcategoryTitle, categoryTitle } = getSubcategoryInfo(question.subcategory_id);
              return (
                <TableRow key={question.id}>
                  <TableCell className="font-mono text-sm">{question.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{question.question}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{categoryTitle}</div>
                      <div className="text-sm text-muted-foreground">{subcategoryTitle}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {question.deficiency_types?.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {deficiencyTypes.find(dt => dt.value === type)?.label || type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{question.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
