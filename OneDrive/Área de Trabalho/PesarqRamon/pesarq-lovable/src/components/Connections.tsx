import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Search, 
  Filter,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  Clock,
  User,
  Plus,
  ArrowRight,
  BookOpen,
  Archive,
  FileText,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  Eye,
  Lock
} from "lucide-react";

interface ConnectionsProps {
  isDemo?: boolean;
  onLoginRequired?: () => void;
}

export function Connections({ isDemo = false, onLoginRequired }: ConnectionsProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "Todas", count: 234 },
    { id: "questions", label: "Perguntas", count: 89, icon: HelpCircle },
    { id: "discussions", label: "Discussões", count: 67, icon: MessageCircle },
    { id: "tips", label: "Dicas", count: 45, icon: Lightbulb },
    { id: "resources", label: "Recursos", count: 33, icon: BookOpen }
  ];

  const posts = [
    {
      id: 1,
      title: "Como organizar documentos digitais nascidos digitais?",
      content: "Estou com dificuldades para estabelecer uma metodologia de organização para documentos que já nascem em formato digital...",
      author: "Maria Santos",
      role: "Arquivista - Ministério da Saúde",
      category: "questions",
      likes: 12,
      replies: 8,
      views: 156,
      createdAt: "2024-01-15",
      tags: ["digitalização", "metodologia", "documentos-digitais"]
    },
    {
      id: 2,
      title: "Experiência com implementação de GED em órgão público",
      content: "Gostaria de compartilhar nossa experiência na implementação de um sistema de Gestão Eletrônica de Documentos...",
      author: "João Oliveira",
      role: "Coordenador de Arquivo - INSS",
      category: "discussions",
      likes: 23,
      replies: 15,
      views: 289,
      createdAt: "2024-01-14",
      tags: ["ged", "implementação", "setor-público"]
    },
    {
      id: 3,
      title: "Dica: Ferramenta gratuita para análise de metadados",
      content: "Descobri uma ferramenta muito útil para análise automática de metadados em documentos PDF...",
      author: "Ana Costa",
      role: "Pesquisadora - UnB",
      category: "tips",
      likes: 34,
      replies: 6,
      views: 198,
      createdAt: "2024-01-13",
      tags: ["metadados", "ferramenta", "pdf"]
    },
    {
      id: 4,
      title: "Recursos para capacitação em preservação digital",
      content: "Compilei uma lista de cursos, artigos e materiais sobre preservação digital que podem ser úteis...",
      author: "Carlos Silva",
      role: "Professor - UFRJ",
      category: "resources",
      likes: 45,
      replies: 12,
      views: 367,
      createdAt: "2024-01-12",
      tags: ["preservação-digital", "capacitação", "recursos"]
    }
  ];

  const trendingTopics = [
    { tag: "lei-geral-de-proteção-de-dados", posts: 23 },
    { tag: "digitalização", posts: 18 },
    { tag: "classificação-documental", posts: 15 },
    { tag: "preservação-digital", posts: 12 },
    { tag: "gestão-eletrônica", posts: 10 }
  ];

  const handleCreatePost = () => {
    if (isDemo && onLoginRequired) {
      onLoginRequired();
    }
  };

  const handleInteraction = () => {
    if (isDemo && onLoginRequired) {
      onLoginRequired();
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || MessageCircle;
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-3 p-2 sm:space-y-6 sm:p-4 md:p-6">
      {isDemo && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Comunidade Arquivística</h3>
                <p className="text-sm text-blue-800">
                  Visualize as discussões da comunidade - Faça login para participar e interagir
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Discussões da Comunidade</h2>
              <p className="text-slate-600">Conecte-se com profissionais e compartilhe conhecimento</p>
            </div>
            <Button 
              onClick={handleCreatePost} 
              className="bg-[#15AB92] hover:bg-[#0d8f7a]"
              disabled={isDemo}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isDemo ? "Login para Participar" : "Nova Discussão"}
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Buscar discussões, perguntas, dicas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={isDemo}
              />
            </div>
            <Button variant="outline" disabled={isDemo}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon || MessageCircle;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={activeCategory === category.id ? "bg-[#15AB92] hover:bg-[#0d8f7a]" : ""}
                  disabled={isDemo}
                >
                  {category.icon && <Icon className="h-3 w-3 mr-1" />}
                  {category.label} ({category.count})
                </Button>
              );
            })}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const CategoryIcon = getCategoryIcon(post.category);
              return (
                <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <CategoryIcon className="h-4 w-4 text-[#15AB92]" />
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.id === post.category)?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                    <CardDescription className="text-sm">{post.content}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{post.author}</span>
                          <span className="text-xs">• {post.role}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <button 
                          onClick={handleInteraction} 
                          className={`flex items-center gap-1 ${isDemo ? 'cursor-not-allowed opacity-50' : 'hover:text-[#15AB92]'}`}
                          disabled={isDemo}
                        >
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </button>
                        <button 
                          onClick={handleInteraction} 
                          className={`flex items-center gap-1 ${isDemo ? 'cursor-not-allowed opacity-50' : 'hover:text-[#15AB92]'}`}
                          disabled={isDemo}
                        >
                          <MessageSquare className="h-4 w-4" />
                          {post.replies}
                        </button>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {isDemo && (
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="pt-6 text-center">
                <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Quer participar das discussões?</h3>
                <p className="text-slate-600 mb-4">
                  Faça login para curtir, comentar e criar suas próprias discussões
                </p>
                <Button 
                  onClick={onLoginRequired}
                  className="bg-[#15AB92] hover:bg-[#0d8f7a]"
                >
                  Fazer Login
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-[#15AB92]" />
                Tópicos em Alta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <div key={topic.tag} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">#{topic.tag}</span>
                    <Badge variant="secondary" className="text-xs">
                      {topic.posts}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-[#15AB92]" />
                Comunidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Membros ativos</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Discussões hoje</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Respostas hoje</span>
                  <span className="font-semibold">156</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
