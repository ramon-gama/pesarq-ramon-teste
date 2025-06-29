
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Eye, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Share2,
  BookOpen,
  Edit,
  Trash2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CommunityPost } from "@/hooks/useCommunityPosts";

interface PostCardProps {
  post: CommunityPost;
  isDemo?: boolean;
  onInteraction?: () => void;
  onVote?: (postId: string, voteType: 'up' | 'down') => void;
  onEdit?: () => void;
  onDelete?: () => void;
  currentUserId?: string;
}

export function PostCard({ 
  post, 
  isDemo = false, 
  onInteraction, 
  onVote, 
  onEdit, 
  onDelete,
  currentUserId 
}: PostCardProps) {
  console.log("PostCard: Renderizado com props:", {
    postId: post.id,
    hasOnInteraction: !!onInteraction,
    hasOnVote: !!onVote,
    hasOnEdit: !!onEdit,
    hasOnDelete: !!onDelete,
    currentUserId,
    isDemo
  });

  const getTypeIcon = () => {
    switch (post.type) {
      case "question":
        return <HelpCircle className="h-4 w-4 text-blue-500" />;
      case "practice":
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case "discussion":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (post.type) {
      case "question":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "practice":
        return "bg-green-50 text-green-700 border-green-200";
      case "discussion":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "alert":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    console.log("PostCard: Card clicado - iniciando handler");
    
    // Evita propagação se clicou em um botão
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      console.log("PostCard: Clique foi em um botão, ignorando");
      return;
    }
    
    console.log("PostCard: Executando onInteraction");
    if (onInteraction) {
      onInteraction();
    } else {
      console.log("PostCard: onInteraction não definido");
    }
  };

  const handleVoteUp = () => {
    console.log("PostCard: handleVoteUp chamado para post:", post.id);
    if (onVote) {
      console.log("PostCard: Executando onVote UP");
      onVote(post.id, 'up');
    } else {
      console.log("PostCard: onVote não definido");
    }
  };

  const handleVoteDown = () => {
    console.log("PostCard: handleVoteDown chamado para post:", post.id);
    if (onVote) {
      console.log("PostCard: Executando onVote DOWN");
      onVote(post.id, 'down');
    } else {
      console.log("PostCard: onVote não definido");
    }
  };

  const handleEdit = () => {
    console.log("PostCard: handleEdit chamado para post:", post.id);
    if (onEdit) {
      console.log("PostCard: Executando onEdit");
      onEdit();
    } else {
      console.log("PostCard: onEdit não definido");
    }
  };

  const handleDelete = () => {
    console.log("PostCard: handleDelete chamado para post:", post.id);
    if (onDelete) {
      console.log("PostCard: Executando onDelete");
      onDelete();
    } else {
      console.log("PostCard: onDelete não definido");
    }
  };

  const handleCommentsClick = () => {
    console.log("PostCard: handleCommentsClick chamado para post:", post.id);
    if (onInteraction) {
      console.log("PostCard: Executando onInteraction para comentários");
      onInteraction();
    } else {
      console.log("PostCard: onInteraction não definido");
    }
  };

  const isOwner = currentUserId === post.user_id;

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {post.author?.name.split(" ").map(n => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
                {post.solved && (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span className="font-medium">{post.author?.name}</span>
                <span>•</span>
                <span>{post.author?.organ}</span>
                <span>•</span>
                <span>{post.author?.role}</span>
                {post.author?.verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getTypeColor()}`}>
            {getTypeIcon()}
            <span className="capitalize">
              {post.type === "practice" ? "Prática" : 
               post.type === "question" ? "Pergunta" : 
               post.type === "discussion" ? "Discussão" : "Alerta"}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.content}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {post.category}
          </Badge>
          {post.subcategory && (
            <Badge variant="outline" className="text-xs">
              {post.subcategory}
            </Badge>
          )}
          {post.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {post.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{post.tags.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("PostCard: Botão UP clicado");
                  handleVoteUp();
                }}
                className="h-auto p-1 hover:text-green-600 transition-colors"
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <span>{post.votes}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("PostCard: Botão DOWN clicado");
                  handleVoteDown();
                }}
                className="h-auto p-1 hover:text-red-600 transition-colors"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                console.log("PostCard: Botão COMMENTS clicado");
                handleCommentsClick();
              }}
              className="h-auto p-1 flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.replies}</span>
            </Button>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(post.last_activity), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("PostCard: Botão SHARE clicado");
                }}
                className="h-auto p-1"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              {isOwner && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("PostCard: Botão EDIT clicado");
                      handleEdit();
                    }}
                    className="h-auto p-1 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("PostCard: Botão DELETE clicado");
                      handleDelete();
                    }}
                    className="h-auto p-1 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
