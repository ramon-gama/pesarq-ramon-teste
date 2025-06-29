import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Save, X, FileText, GripVertical } from "lucide-react";

interface Question {
  id: string;
  text: string;
  category: string;
  type: "text" | "textarea" | "select";
  options?: string[];
}

const mockQuestions: Question[] = [
  {
    id: "1",
    text: "Qual o nível de organização dos documentos?",
    category: "Organização",
    type: "select",
    options: ["Baixo", "Médio", "Alto"],
  },
  {
    id: "2",
    text: "Como é feita a gestão de documentos digitais?",
    category: "Gestão Documental",
    type: "textarea",
  },
  {
    id: "3",
    text: "Utiliza alguma ferramenta de gestão?",
    category: "Tecnologia",
    type: "select",
    options: ["Sim", "Não"],
  },
];

interface Category {
  id: string;
  name: string;
  description: string;
}

const mockCategories: Category[] = [
  { id: "1", name: "Organização", description: "Perguntas sobre organização" },
  { id: "2", name: "Gestão Documental", description: "Perguntas sobre gestão" },
  { id: "3", name: "Tecnologia", description: "Perguntas sobre tecnologia" },
];

const QuestionsAdmin = () => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: "",
    text: "",
    category: "",
    type: "text",
    options: [],
  });
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  const handleAddQuestion = () => {
    if (newQuestion.text && newQuestion.category && newQuestion.type) {
      const newId = Date.now().toString();
      setQuestions([...questions, { ...newQuestion, id: newId }]);
      setNewQuestion({ id: "", text: "", category: "", type: "text", options: [] });
    }
  };

  const handleEditQuestion = (id: string) => {
    setEditingQuestionId(id);
    const questionToEdit = questions.find((q) => q.id === id);
    if (questionToEdit) {
      setNewQuestion(questionToEdit);
    }
  };

  const handleUpdateQuestion = () => {
    if (newQuestion.id && newQuestion.text && newQuestion.category && newQuestion.type) {
      const updatedQuestions = questions.map((q) =>
        q.id === newQuestion.id ? newQuestion : q
      );
      setQuestions(updatedQuestions);
      setNewQuestion({ id: "", text: "", category: "", type: "text", options: [] });
      setEditingQuestionId(null);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
  };

  const handleAddCategory = () => {
    // Implementar lógica para adicionar categoria
  };

  const handleEditCategory = (id: string) => {
    // Implementar lógica para editar categoria
  };

  const handleDeleteCategory = (id: string) => {
    // Implementar lógica para excluir categoria
  };

  const handleSettingsUpdate = () => {
    // Implementar lógica para atualizar configurações
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Administração de Perguntas</h2>
          <p className="text-gray-600 mt-2">
            Gerencie as perguntas do diagnóstico arquivístico
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Pergunta
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista de Perguntas</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Pergunta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question-text">Pergunta</Label>
                <Input
                  id="question-text"
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, text: e.target.value })
                  }
                  placeholder="Ex: Qual o nível de organização..."
                />
              </div>
              <div>
                <Label htmlFor="question-category">Categoria</Label>
                <Select onValueChange={(value) =>
                    setNewQuestion({ ...newQuestion, category: value })
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="question-type">Tipo de Resposta</Label>
                <Select onValueChange={(value: "text" | "textarea" | "select") =>
                    setNewQuestion({ ...newQuestion, type: value })
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto Curto</SelectItem>
                    <SelectItem value="textarea">Texto Longo</SelectItem>
                    <SelectItem value="select">Seleção Única</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newQuestion.type === "select" && (
                <div>
                  <Label htmlFor="question-options">Opções (separadas por vírgula)</Label>
                  <Input
                    id="question-options"
                    placeholder="Opção 1, Opção 2, Opção 3"
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        options: e.target.value.split(",").map((o) => o.trim()),
                      })
                    }
                  />
                </div>
              )}
              <div className="flex gap-2">
                {editingQuestionId ? (
                  <>
                    <Button onClick={handleUpdateQuestion}>
                      <Save className="h-4 w-4 mr-2" />
                      Atualizar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingQuestionId(null);
                        setNewQuestion({ id: "", text: "", category: "", type: "text", options: [] });
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAddQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Perguntas</CardTitle>
              <CardDescription>
                Arraste para reordenar, edite ou exclua as perguntas existentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {questions.map((question) => (
                  <Card key={question.id} className="shadow-sm border">
                    <CardHeader className="flex items-center justify-between">
                      <div className="flex items-center">
                        <GripVertical className="h-5 w-5 mr-2 text-gray-400 cursor-grab" />
                        <CardTitle className="text-lg font-medium">{question.text}</CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleEditQuestion(question.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Badge>{question.category}</Badge>
                      <p className="text-sm text-gray-500">
                        Tipo: {question.type}
                        {question.type === "select" && question.options && (
                          <>
                            <br />
                            Opções: {question.options.join(", ")}
                          </>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Categorias</CardTitle>
              <CardDescription>
                Adicione, edite ou exclua categorias de perguntas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Implementar formulário e lista de categorias */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Ajuste as configurações do questionário
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Implementar configurações */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionsAdmin;
