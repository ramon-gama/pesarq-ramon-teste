import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Search, 
  Filter,
  Plus,
  Lock
} from "lucide-react";
import { CommunityPost } from "@/hooks/useCommunityPosts";
import { useCommunityData } from "@/hooks/useCommunityData";
import { PostCard } from "./PostCard";
import { CreatePostModal } from "./CreatePostModal";
import { PostDetailModal } from "./PostDetailModal";
import { ConnectionsHeader } from "./ConnectionsHeader";
import { CategoryFilter } from "./CategoryFilter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ConnectionsProps {
  isDemo?: boolean;
  onLoginRequired?: () => void;
}

export function Connections({ isDemo = false, onLoginRequired }: ConnectionsProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { toast } = useToast();
  const { isAuthenticated, user: authUser } = useAuth();
  
  // Usar o hook unificado
  const {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    votePost,
    incrementViews,
    refetch,
    getReplies,
    createReply,
    voteReply
  } = useCommunityData({ isDemo });

  const categories = [
    { id: "all", label: "Todas", count: posts.length },
    { id: "questions", label: "Perguntas", count: posts.filter(p => p.type === 'question').length },
    { id: "discussions", label: "Discussões", count: posts.filter(p => p.type === 'discussion').length },
    { id: "tips", label: "Dicas", count: posts.filter(p => p.type === 'practice' || p.type === 'alert').length }
  ];

  const categoryFilters = [
    { id: "all", label: "Todas as Categorias", count: posts.length },
    { id: "Gestão Documental", label: "Gestão Documental", count: posts.filter(p => p.category === 'Gestão Documental').length },
    { id: "Preservação Digital", label: "Preservação Digital", count: posts.filter(p => p.category === 'Preservação Digital').length },
    { id: "Digitalização", label: "Digitalização", count: posts.filter(p => p.category === 'Digitalização').length },
    { id: "LGPD", label: "LGPD", count: posts.filter(p => p.category === 'LGPD').length },
    { id: "Instrumentos Arquivísticos", label: "Instrumentos Arquivísticos", count: posts.filter(p => p.category === 'Instrumentos Arquivísticos').length },
    { id: "Inovações Tecnológicas", label: "Inovações Tecnológicas", count: posts.filter(p => p.category === 'Inovações Tecnológicas').length },
    { id: "Sistemas de Gestão", label: "Sistemas de Gestão", count: posts.filter(p => p.category === 'Sistemas de Gestão').length },
    { id: "Formação Profissional", label: "Formação Profissional", count: posts.filter(p => p.category === 'Formação Profissional').length },
    { id: "Políticas Arquivísticas", label: "Políticas Arquivísticas", count: posts.filter(p => p.category === 'Políticas Arquivísticas').length }
  ];

  const trendingTopics = [
    { tag: "rdc-arq", posts: 12 },
    { tag: "lgpd", posts: 18 },
    { tag: "digitalização", posts: 15 },
    { tag: "preservação-digital", posts: 14 },
    { tag: "classificação", posts: 11 },
    { tag: "sigad", posts: 9 },
    { tag: "conarq", posts: 8 },
    { tag: "capacitação", posts: 7 },
    { tag: "temporalidade", posts: 6 }
  ];

  useEffect(() => {
    if (isDemo) {
      setCurrentUser({ id: "demo-user" });
      return;
    }

    if (authUser) {
      setCurrentUser(authUser);
    }
  }, [authUser, isDemo]);

  const openCreateModal = () => {
    if (isDemo && onLoginRequired) {
      onLoginRequired();
      return;
    }
    setEditingPost(null);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setEditingPost(null);
  };

  const handlePostClick = async (post: CommunityPost) => {
    console.log('handlePostClick chamado para post:', post.id);
    setSelectedPost(post);
    setShowDetailModal(true);
    
    if (!isDemo && incrementViews) {
      try {
        await incrementViews(post.id);
      } catch (error) {
        console.error("Erro ao incrementar views:", error);
      }
    }
  };

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    console.log('handleVote chamado:', { postId, voteType, isDemo });
    
    if (isDemo && onLoginRequired) {
      onLoginRequired();
      return;
    }

    if (votePost) {
      try {
        await votePost(postId, voteType);
      } catch (error) {
        console.error("Erro ao votar:", error);
      }
    }
  };

  const handleEditPost = (post: CommunityPost) => {
    if (isDemo && onLoginRequired) {
      onLoginRequired();
      return;
    }
    setEditingPost(post);
    setSelectedPost(null);
    setShowDetailModal(false);
    setShowCreateModal(true);
  };

  const handleDeletePost = async (postId: string) => {
    console.log('handleDeletePost chamado:', { isDemo, postId });
    
    if (isDemo && onLoginRequired) {
      onLoginRequired();
      return;
    }

    if (deletePost && confirm('Tem certeza que deseja excluir este post?')) {
      try {
        await deletePost(postId);
        setShowDetailModal(false);
        setSelectedPost(null);
      } catch (error) {
        console.error("Erro ao excluir post:", error);
      }
    }
  };

  const handleSubmitPost = async (postData: Partial<CommunityPost>) => {
    console.log('handleSubmitPost iniciado:', { isDemo, postData });
    
    if (isDemo && onLoginRequired) {
      onLoginRequired();
      return;
    }
    
    try {
      if (editingPost && updatePost) {
        await updatePost(editingPost.id, postData);
      } else if (createPost) {
        await createPost(postData);
      }
      
      closeCreateModal();
      
      if (refetch) {
        await refetch();
      }
      
    } catch (error) {
      console.error('Erro ao submeter post:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === "all" || 
      (activeCategory === "questions" && post.type === "question") ||
      (activeCategory === "discussions" && post.type === "discussion") ||
      (activeCategory === "tips" && (post.type === "practice" || post.type === "alert"));
    
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-3 p-2 sm:space-y-6 sm:p-4 md:p-6">
      {/* Header */}
      <ConnectionsHeader onCreatePost={openCreateModal} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with Category Filter */}
        <div className="space-y-6">
          <CategoryFilter 
            selectedCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            isDemo={isDemo}
          />

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-[#15AB92]" />
                Tópicos em Alta
                {isDemo && <Lock className="h-3 w-3 text-orange-500" />}
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
                {isDemo && <Lock className="h-3 w-3 text-orange-500" />}
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
                  <span className="font-semibold">{posts.filter(p => {
                    const today = new Date();
                    const postDate = new Date(p.created_at);
                    return postDate.toDateString() === today.toDateString();
                  }).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total de posts</span>
                  <span className="font-semibold">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Respostas hoje</span>
                  <span className="font-semibold">{posts.reduce((acc, post) => acc + post.replies, 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
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
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={activeCategory === category.id ? "bg-[#15AB92] hover:bg-[#0d8f7a]" : ""}
                disabled={isDemo}
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">Carregando discussões...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma discussão encontrada
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onInteraction={() => handlePostClick(post)}
                  onVote={handleVote}
                  onEdit={() => handleEditPost(post)}
                  onDelete={() => handleDeletePost(post.id)}
                  currentUserId={currentUser?.id || authUser?.id}
                  isDemo={isDemo}
                />
              ))
            )}
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
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          onSubmit={handleSubmitPost}
          editingPost={editingPost}
        />
      )}

      {/* Post Detail Modal */}
      {showDetailModal && selectedPost && (
        <PostDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPost(null);
          }}
          post={selectedPost}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onVote={handleVote}
          currentUserId={currentUser?.id || authUser?.id}
          isDemo={isDemo}
          replies={getReplies(selectedPost.id)}
          onCreateReply={createReply}
          onVoteReply={voteReply}
        />
      )}
    </div>
  );
}
