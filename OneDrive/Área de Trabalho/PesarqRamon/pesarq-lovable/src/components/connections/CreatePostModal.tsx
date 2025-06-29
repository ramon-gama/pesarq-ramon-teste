
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Star, Users, Plus, X } from "lucide-react";
import { CommunityPost } from "@/hooks/useCommunityPosts";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Partial<CommunityPost>) => void;
  editingPost?: CommunityPost | null;
}

const postTypes = [
  {
    id: "question",
    name: "Dúvida Técnica",
    icon: HelpCircle,
    description: "Faça uma pergunta e receba respostas da comunidade"
  },
  {
    id: "practice",
    name: "Dica",
    icon: Star,
    description: "Compartilhe uma experiência, solução, novidade ou inovação"
  },
  {
    id: "discussion",
    name: "Discussão",
    icon: Users,
    description: "Inicie um debate sobre propostas ou instrumentos"
  }
];

// Categorias expandidas
const categories = [
  "Gestão Documental",
  "Preservação Digital",
  "Digitalização",
  "LGPD",
  "Instrumentos Arquivísticos",
  "Inovações Tecnológicas",
  "Sistemas de Gestão",
  "Formação Profissional",
  "Políticas Arquivísticas"
];

const suggestedTags = [
  "RDC-Arq", "archivematica", "digitalização", "lgpd", "classificação",
  "preservação", "metadados", "sistemas", "implementação", "boas-práticas",
  "sigad", "conarq", "capacitação", "temporalidade", "unesco", "jhove"
];

export function CreatePostModal({ isOpen, onClose, onSubmit, editingPost }: CreatePostModalProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (editingPost) {
      setSelectedType(editingPost.type);
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setCategory(editingPost.category);
      setSubcategory(editingPost.subcategory || "");
      setTags(editingPost.tags || []);
    } else {
      resetForm();
    }
  }, [editingPost, isOpen]);

  const resetForm = () => {
    setSelectedType("");
    setTitle("");
    setContent("");
    setCategory("");
    setSubcategory("");
    setTags([]);
    setNewTag("");
  };

  const handleSubmit = () => {
    if (!selectedType || !title || !content || !category) {
      return;
    }

    const postData = {
      title,
      content,
      category,
      subcategory: subcategory || undefined,
      type: selectedType as "question" | "practice" | "discussion" | "alert",
      tags
    };

    onSubmit(postData);
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPost ? "Editar Publicação" : "Nova Publicação"}
          </DialogTitle>
          <DialogDescription>
            {editingPost ? "Edite sua publicação" : "Compartilhe conhecimento com a comunidade"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipo de Post */}
          <div>
            <label className="text-sm font-medium mb-3 block">Tipo de Publicação</label>
            <div className="grid grid-cols-1 gap-3">
              {postTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    className="h-auto p-4 justify-start"
                    onClick={() => setSelectedType(type.id)}
                    type="button"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs opacity-70">{type.description}</div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="text-sm font-medium mb-2 block">Título</label>
            <Input
              placeholder="Escreva um título claro e descritivo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="text-sm font-medium mb-2 block">Categoria</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategoria */}
          <div>
            <label className="text-sm font-medium mb-2 block">Subcategoria (Opcional)</label>
            <Input
              placeholder="Digite uma subcategoria específica..."
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="text-sm font-medium mb-2 block">Conteúdo</label>
            <Textarea
              placeholder="Descreva sua dúvida, compartilhe sua experiência ou inicie uma discussão..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => addTag(newTag)}
                  disabled={!newTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      #{tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-2">Tags sugeridas:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.filter(tag => !tags.includes(tag)).slice(0, 8).map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => addTag(tag)}
                    >
                      #{tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedType || !title || !content || !category}
          >
            {editingPost ? "Salvar Alterações" : "Publicar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
