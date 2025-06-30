
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Eye, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  Edit,
  Trash2,
  Send,
  Lock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CommunityPost, CommunityReply } from "@/hooks/useCommunityPosts";
import { useToast } from "@/hooks/use-toast";

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPost | null;
  onEdit?: (post: CommunityPost) => void;
  onDelete?: (postId: string) => void;
  onVote?: (postId: string, voteType: 'up' | 'down') => void;
  currentUserId?: string;
  isDemo?: boolean;
  replies?: CommunityReply[];
  onCreateReply?: (postId: string, content: string) => Promise<void>;
  onVoteReply?: (replyId: string, voteType: 'up' | 'down') => Promise<void>;
}

export function PostDetailModal({ 
  isOpen, 
  onClose, 
  post, 
  onEdit, 
  onDelete, 
  onVote,
  currentUserId,
  isDemo = false,
  replies = [],
  onCreateReply,
  onVoteReply
}: PostDetailModalProps) {
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();

  if (!post) return null;

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

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    
    if (isDemo) {
      toast({
        title: "Resposta adicionada no modo demo!",
        description: "Esta é apenas uma simulação. Faça login para interagir.",
      });
      setReplyContent("");
      return;
    }
    
    if (onCreateReply) {
      try {
        await onCreateReply(post.id, replyContent);
        setReplyContent("");
      } catch (error) {
        console.error('Error submitting reply:', error);
      }
    }
  };

  const handleVoteReply = async (replyId: string, voteType: 'up' | 'down') => {
    if (isDemo) {
      toast({
        title: "Voto registrado no modo demo!",
        description: "Esta é apenas uma simulação.",
      });
      return;
    }

    if (onVoteReply) {
      try {
        await onVoteReply(replyId, voteType);
      } catch (error) {
        console.error('Error voting reply:', error);
      }
    }
  };

  const isOwner = currentUserId === post.user_id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between gap-4">
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
                  {isDemo && <Lock className="h-4 w-4 text-orange-500" />}
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
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Post Content */}
          <div className="space-y-4">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {post.content}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {post.category}
              </Badge>
              {post.subcategory && (
                <Badge variant="outline" className="text-xs">
                  {post.subcategory}
                </Badge>
              )}
              {post.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button 
                  onClick={() => onVote?.(post.id, 'up')}
                  className={`flex items-center gap-1 transition-colors ${
                    isDemo ? 'cursor-not-allowed opacity-50' : 'hover:text-green-600'
                  }`}
                  disabled={isDemo}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.votes}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.replies}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </span>
                </div>
                
                {isOwner && !isDemo && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit?.(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete?.(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Replies Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Respostas ({replies.length})</h4>
            
            {/* New Reply Form */}
            <div className="space-y-3">
              <Textarea
                placeholder={isDemo ? "Faça login para responder..." : "Escreva sua resposta..."}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[100px]"
                disabled={isDemo}
              />
              <Button 
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || isDemo}
                className="ml-auto flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isDemo ? "Login para Responder" : "Responder"}
              </Button>
            </div>

            <Separator />

            {/* Replies List */}
            {replies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma resposta ainda. Seja o primeiro a responder!
              </div>
            ) : (
              <div className="space-y-4">
                {replies.map((reply) => (
                  <div key={reply.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {reply.author?.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{reply.author?.name}</span>
                            {reply.author?.verified && (
                              <CheckCircle className="h-3 w-3 text-blue-500" />
                            )}
                            {reply.is_solution && (
                              <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                Solução
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {reply.author?.organ} • {reply.author?.role}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(reply.created_at), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleVoteReply(reply.id, 'up')}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            isDemo ? 'cursor-not-allowed opacity-50' : 'hover:text-green-600'
                          }`}
                          disabled={isDemo}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>{reply.votes}</span>
                        </button>
                        <button 
                          onClick={() => handleVoteReply(reply.id, 'down')}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            isDemo ? 'cursor-not-allowed opacity-50' : 'hover:text-red-600'
                          }`}
                          disabled={isDemo}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isDemo && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4 text-center">
                <Lock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-800">
                  Faça login para interagir com as respostas e participar da discussão
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
