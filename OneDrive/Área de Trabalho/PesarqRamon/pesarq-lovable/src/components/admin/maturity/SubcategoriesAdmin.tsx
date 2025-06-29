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
import { Plus, Edit, Trash2 } from "lucide-react";

interface Subcategory {
  id: string;
  title: string;
  description: string;
  category_id: string;
  sort_order: number;
}

interface Category {
  id: string;
  title: string;
}

export function SubcategoriesAdmin() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    category_id: "",
    sort_order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('🔄 Carregando subcategorias e categorias...');
      setIsLoading(true);
      
      // Carregar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('maturity_categories')
        .select('id, title')
        .order('sort_order');

      if (categoriesError) {
        console.error('❌ Erro ao carregar categorias:', categoriesError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias",
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ Categorias carregadas:', categoriesData);
      setCategories(categoriesData || []);

      // Carregar subcategorias
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('maturity_subcategories')
        .select('*')
        .order('category_id, sort_order');

      if (subcategoriesError) {
        console.error('❌ Erro ao carregar subcategorias:', subcategoriesError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as subcategorias",
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ Subcategorias carregadas:', subcategoriesData);
      setSubcategories(subcategoriesData || []);
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
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
    if (!formData.title.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Título é obrigatório",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.category_id) {
      toast({
        title: "Erro de Validação",
        description: "Categoria é obrigatória",
        variant: "destructive"
      });
      return false;
    }
    
    if (!editingSubcategory && !formData.id.trim()) {
      toast({
        title: "Erro de Validação", 
        description: "ID é obrigatório para nova subcategoria",
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
      const subcategoryData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        category_id: formData.category_id,
        sort_order: formData.sort_order || subcategories.filter(s => s.category_id === formData.category_id).length
      };

      if (editingSubcategory) {
        console.log('📝 Atualizando subcategoria:', editingSubcategory.id, subcategoryData);
        
        const { data, error } = await supabase
          .from('maturity_subcategories')
          .update(subcategoryData)
          .eq('id', editingSubcategory.id)
          .select();

        console.log('📝 Resultado da atualização:', { data, error });

        if (error) {
          console.error('❌ Erro na atualização:', error);
          toast({
            title: "Erro",
            description: `Falha ao atualizar subcategoria: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
        
        toast({ 
          title: "Sucesso", 
          description: "Subcategoria atualizada com sucesso"
        });
      } else {
        console.log('➕ Criando nova subcategoria:', formData);
        
        const insertData = {
          id: formData.id.trim(),
          ...subcategoryData
        };
        
        const { data, error } = await supabase
          .from('maturity_subcategories')
          .insert([insertData])
          .select();

        console.log('➕ Resultado da criação:', { data, error });

        if (error) {
          console.error('❌ Erro na criação:', error);
          toast({
            title: "Erro",
            description: `Falha ao criar subcategoria: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
        
        toast({ 
          title: "Sucesso", 
          description: "Subcategoria criada com sucesso"
        });
      }

      console.log('🔄 Recarregando dados após operação...');
      await loadData();
      handleCloseDialog();
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado no salvamento",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (subcategory: Subcategory) => {
    console.log('✏️ Editando subcategoria:', subcategory);
    setEditingSubcategory(subcategory);
    setFormData({
      id: subcategory.id,
      title: subcategory.title,
      description: subcategory.description || "",
      category_id: subcategory.category_id,
      sort_order: subcategory.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (subcategoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta subcategoria?')) return;

    try {
      console.log('🗑️ Excluindo subcategoria:', subcategoryId);
      
      const { error } = await supabase
        .from('maturity_subcategories')
        .delete()
        .eq('id', subcategoryId);

      if (error) {
        console.error('❌ Erro na exclusão:', error);
        toast({
          title: "Erro",
          description: `Falha ao excluir subcategoria: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      toast({ 
        title: "Sucesso", 
        description: "Subcategoria excluída com sucesso"
      });
      
      console.log('🔄 Recarregando dados após exclusão...');
      await loadData();
    } catch (error) {
      console.error('❌ Erro inesperado na exclusão:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado na exclusão",
        variant: "destructive"
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSubcategory(null);
    setFormData({
      id: "",
      title: "",
      description: "",
      category_id: "",
      sort_order: 0
    });
  };

  const getCategoryTitle = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.title || categoryId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando subcategorias...</p>
        </div>
      </div>
    );
  }

  console.log('🖥️ Renderizando subcategorias:', subcategories);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Subcategorias ({subcategories.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Subcategoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSubcategory ? 'Editar Subcategoria' : 'Nova Subcategoria'}
              </DialogTitle>
              <DialogDescription>
                {editingSubcategory ? 'Edite as informações da subcategoria' : 'Crie uma nova subcategoria'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Categoria *</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!editingSubcategory && (
                <div className="space-y-2">
                  <Label htmlFor="id">ID da Subcategoria *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="ex: data-policy"
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
                  placeholder="Nome da subcategoria"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da subcategoria"
                />
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
                  {editingSubcategory ? 'Atualizar' : 'Criar'} Subcategoria
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
            <TableHead>Categoria</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhuma subcategoria encontrada. Clique em "Nova Subcategoria" para começar.
              </TableCell>
            </TableRow>
          ) : (
            subcategories.map((subcategory) => (
              <TableRow key={subcategory.id}>
                <TableCell className="font-mono text-sm">{subcategory.id}</TableCell>
                <TableCell className="font-medium">{subcategory.title}</TableCell>
                <TableCell>{getCategoryTitle(subcategory.category_id)}</TableCell>
                <TableCell className="max-w-xs truncate">{subcategory.description}</TableCell>
                <TableCell>{subcategory.sort_order}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(subcategory)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(subcategory.id)}
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
