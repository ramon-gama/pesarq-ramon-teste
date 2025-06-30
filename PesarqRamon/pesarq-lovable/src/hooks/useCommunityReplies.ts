
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CommunityReply } from './useCommunityPosts';

export function useCommunityReplies(postId: string) {
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReplies = async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('community_replies')
        .select(`
          *,
          community_user_profiles!inner(
            name,
            organ,
            role,
            avatar_url,
            reputation,
            verified
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      const repliesWithAuthors = data?.map(reply => ({
        ...reply,
        author: {
          name: reply.community_user_profiles.name,
          organ: reply.community_user_profiles.organ,
          role: reply.community_user_profiles.role,
          avatar: reply.community_user_profiles.avatar_url || '',
          reputation: reply.community_user_profiles.reputation,
          verified: reply.community_user_profiles.verified
        }
      })) || [];
      
      setReplies(repliesWithAuthors);
    } catch (error) {
      console.error('Error fetching replies:', error);
      toast({
        title: "Erro ao carregar respostas",
        description: "Não foi possível carregar as respostas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createReply = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('community_replies')
        .insert([{
          post_id: postId,
          user_id: user.id,
          content
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Resposta adicionada!",
        description: "Sua resposta foi publicada com sucesso."
      });

      fetchReplies();
      return data;
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: "Erro ao adicionar resposta",
        description: "Não foi possível publicar sua resposta.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateReply = async (replyId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('community_replies')
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', replyId);

      if (error) throw error;

      toast({
        title: "Resposta atualizada!",
        description: "Suas alterações foram salvas."
      });

      fetchReplies();
    } catch (error) {
      console.error('Error updating reply:', error);
      toast({
        title: "Erro ao atualizar resposta",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    }
  };

  const deleteReply = async (replyId: string) => {
    try {
      const { error } = await supabase
        .from('community_replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;

      toast({
        title: "Resposta excluída!",
        description: "A resposta foi removida com sucesso."
      });

      fetchReplies();
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast({
        title: "Erro ao excluir resposta",
        description: "Não foi possível remover a resposta.",
        variant: "destructive"
      });
    }
  };

  const voteReply = async (replyId: string, voteType: 'up' | 'down') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar se já votou
      const { data: existingVote } = await supabase
        .from('community_votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('reply_id', replyId)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remover voto se for o mesmo tipo
          await supabase
            .from('community_votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Alterar tipo do voto
          await supabase
            .from('community_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        // Criar novo voto
        await supabase
          .from('community_votes')
          .insert([{
            user_id: user.id,
            reply_id: replyId,
            vote_type: voteType
          }]);
      }

      fetchReplies();
    } catch (error) {
      console.error('Error voting reply:', error);
      toast({
        title: "Erro ao votar",
        description: "Não foi possível registrar seu voto.",
        variant: "destructive"
      });
    }
  };

  const markAsSolution = async (replyId: string) => {
    try {
      const { error } = await supabase
        .from('community_replies')
        .update({ is_solution: true })
        .eq('id', replyId);

      if (error) throw error;

      // Marcar o post como resolvido
      await supabase
        .from('community_posts')
        .update({ solved: true })
        .eq('id', postId);

      toast({
        title: "Solução marcada!",
        description: "Esta resposta foi marcada como solução."
      });

      fetchReplies();
    } catch (error) {
      console.error('Error marking as solution:', error);
      toast({
        title: "Erro ao marcar solução",
        description: "Não foi possível marcar como solução.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchReplies();

    // Configurar escuta em tempo real
    const channel = supabase
      .channel('community_replies_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_replies',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchReplies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return {
    replies,
    loading,
    createReply,
    updateReply,
    deleteReply,
    voteReply,
    markAsSolution,
    refetch: fetchReplies
  };
}
