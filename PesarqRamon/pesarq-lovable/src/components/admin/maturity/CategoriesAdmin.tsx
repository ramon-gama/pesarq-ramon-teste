
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Target, Users, MessageSquare, Settings, Activity } from "lucide-react";

const iconOptions = [
  { value: "Target", label: "Alvo", icon: Target },
  { value: "Users", label: "Usuários", icon: Users },
  { value: "MessageSquare", label: "Mensagem", icon: MessageSquare },
  { value: "Settings", label: "Configurações", icon: Settings },
  { value: "Activity", label: "Atividade", icon: Activity }
];

const colorOptions = [
  { value: "bg-blue-600", label: "Azul" },
  { value: "bg-green-600", label: "Verde" },
  { value: "bg-purple-600", label: "Roxo" },
  { value: "bg-orange-600", label: "Laranja" },
  { value: "bg-red-600", label: "Vermelho" },
  { value: "bg-indigo-600", label: "Índigo" }
];

interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
}

export function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    icon: "Target",
    color: "bg-blue-600",
    sort_order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    console.log('🚀 CategoriesAdmin mounted, loading categories...');
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      console.log('📥 [loadCategories] Iniciando carregamento das categorias...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('maturity_categories')
        .select('*')
        .order('sort_order');

      console.log('📥 [loadCategories] Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ [loadCategories] Erro ao carregar categorias:', error);
        toast({
          title: "Erro",
          description: `Não foi possível carregar as categorias: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ [loadCategories] Categorias carregadas com sucesso:', data);
      console.log('📊 [loadCategories] Total de categorias:', data?.length || 0);
      
      setCategories(data || []);
      
      console.log('🔄 [loadCategories] Estado das categorias atualizado');
      
    } catch (error: any) {
      console.error('💥 [loadCategories] Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar categorias",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 [loadCategories] Carregamento finalizado');
    }
  };

  const validateForm = () => {
    console.log('🔍 [validateForm] Validando formulário:', formData);
    
    if (!formData.title.trim()) {
      console.log('❌ [validateForm] Título vazio');
      toast({
        title: "Erro de Validação",
        description: "Título é obrigatório",
        variant: "destructive"
      });
      return false;
    }
    
    if (!editingCategory && !formData.id.trim()) {
      console.log('❌ [validateForm] ID vazio para nova categoria');
      toast({
        title: "Erro de Validação", 
        description: "ID é obrigatório para nova categoria",
        variant: "destructive"
      });
      return false;
    }
    
    console.log('✅ [validateForm] Formulário válido');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 [handleSubmit] Iniciando envio do formulário...');
    console.log('📝 [handleSubmit] Modo de edição:', !!editingCategory);
    console.log('📝 [handleSubmit] Dados do formulário:', formData);
    
    if (!validateForm()) return;
    
    try {
      if (editingCategory) {
        console.log('✏️ [handleSubmit] Atualizando categoria existente:', editingCategory.id);
        
        const updateData = {
          title: formData.title.trim(),
          description: formData.description?.trim() || "",
          icon: formData.icon,
          color: formData.color,
          sort_order: formData.sort_order
        };
        
        console.log('✏️ [handleSubmit] Dados para atualização:', updateData);
        
        const { data, error } = await supabase
          .from('maturity_categories')
          .update(updateData)
          .eq('id', editingCategory.id)
          .select();

        console.log('✏️ [handleSubmit] Resposta da atualização:', { data, error });

        if (error) {
          console.error('❌ [handleSubmit] Erro na atualização:', error);
          toast({
            title: "Erro",
            description: `Falha ao atualizar categoria: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
        
        console.log('✅ [handleSubmit] Categoria atualizada com sucesso');
        toast({ 
          title: "Sucesso", 
          description: "Categoria atualizada com sucesso"
        });
      } else {
        console.log('➕ [handleSubmit] Criando nova categoria');
        
        const insertData = {
          id: formData.id.trim(),
          title: formData.title.trim(),
          description: formData.description?.trim() || "",
          icon: formData.icon,
          color: formData.color,
          sort_order: formData.sort_order || categories.length
        };
        
        console.log('➕ [handleSubmit] Dados para inserção:', insertData);
        
        const { data, error } = await supabase
          .from('maturity_categories')
          .insert([insertData])
          .select();

        console.log('➕ [handleSubmit] Resposta da inserção:', { data, error });

        if (error) {
          console.error('❌ [handleSubmit] Erro na criação:', error);
          toast({
            title: "Erro",
            description: `Falha ao criar categoria: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
        
        console.log('✅ [handleSubmit] Categoria criada com sucesso');
        toast({ 
          title: "Sucesso", 
          description: "Categoria criada com sucesso"
        });
      }

      console.log('🔄 [handleSubmit] Recarregando categorias após operação...');
      await loadCategories();
      handleCloseDialog();
      
    } catch (error: any) {
      console.error('💥 [handleSubmit] Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado no salvamento",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: Category) => {
    console.log('✏️ [handleEdit] Editando categoria:', category);
    setEditingCategory(category);
    setFormData({
      id: category.id,
      title: category.title,
      description: category.description || "",
      icon: category.icon || "Target",
      color: category.color || "bg-blue-600", 
      sort_order: category.sort_order || 0
    });
    setIsDialogOpen(true);
    console.log('✏️ [handleEdit] Dialog aberto para edição');
  };

  const handleDelete = async (categoryId: string) => {
    console.log('🗑️ [handleDelete] Tentando excluir categoria:', categoryId);
    
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      console.log('🗑️ [handleDelete] Exclusão cancelada pelo usuário');
      return;
    }

    try {
      console.log('🗑️ [handleDelete] Executando exclusão...');
      
      const { error } = await supabase
        .from('maturity_categories')
        .delete()
        .eq('id', categoryId);

      console.log('🗑️ [handleDelete] Resposta da exclusão:', { error });

      if (error) {
        console.error('❌ [handleDelete] Erro na exclusão:', error);
        toast({
          title: "Erro",
          description: `Falha ao excluir categoria: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ [handleDelete] Categoria excluída com sucesso');
      toast({ 
        title: "Sucesso", 
        description: "Categoria excluída com sucesso"
      });
      
      console.log('🔄 [handleDelete] Recarregando categorias após exclusão...');
      await loadCategories();
    } catch (error: any) {
      console.error('💥 [handleDelete] Erro inesperado na exclusão:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado na exclusão",
        variant: "destructive"
      });
    }
  };

  const handleCloseDialog = () => {
    console.log('🚪 [handleCloseDialog] Fechando dialog');
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      id: "",
      title: "",
      description: "",
      icon: "Target",
      color: "bg-blue-600",
      sort_order: 0
    });
  };

  if (isLoading) {
    console.log('⏳ [render] Mostrando tela de carregamento');
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando categorias...</p>
        </div>
      </div>
    );
  }

  console.log('🖥️ [render] Renderizando categorias. Total:', categories.length);
  console.log('🖥️ [render] Estado atual das categorias:', categories);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Categorias ({categories.length})</h3>
          <p className="text-sm text-muted-foreground">
            Sistema de Pontuação: Não estabelecido (0-1.0), Em desenvolvimento (1.1-2.0), 
            Essencial (2.1-3.0), Consolidado (3.1-4.0), Avançado (4.1-5.0)
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              console.log('➕ [render] Abrindo dialog para nova categoria');
              setIsDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Edite as informações da categoria' : 'Crie uma nova categoria para a avaliação'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingCategory && (
                <div className="space-y-2">
                  <Label htmlFor="id">ID da Categoria *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="ex: governance"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nome da categoria"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da categoria"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${option.value}`}></div>
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {editingCategory ? 'Atualizar' : 'Criar'} Categoria
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
            <TableHead>Título</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ícone</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhuma categoria encontrada. Clique em "Nova Categoria" para começar.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => {
              const IconComponent = iconOptions.find(opt => opt.value === category.icon)?.icon || Target;
              return (
                <TableRow key={category.id}>
                  <TableCell className="font-mono text-sm">{category.id}</TableCell>
                  <TableCell className="font-medium">{category.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {category.icon}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${category.color}`}></div>
                      {category.color}
                    </div>
                  </TableCell>
                  <TableCell>{category.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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
