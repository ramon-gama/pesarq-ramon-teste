import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  type: 'question' | 'practice' | 'discussion' | 'alert';
  tags: string[];
  votes: number;
  replies: number;
  views: number;
  solved: boolean;
  created_at: string;
  updated_at: string;
  last_activity: string;
  author?: {
    name: string;
    organ: string;
    role: string;
    avatar: string;
    reputation: number;
    verified: boolean;
  };
}

export interface CommunityReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  votes: number;
  is_solution: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    name: string;
    organ: string;
    role: string;
    avatar: string;
    reputation: number;
    verified: boolean;
  };
}

export function useCommunityPosts() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      console.log('Buscando posts da comunidade...');
      setLoading(true);
      
      // Fazer consulta simples primeiro, sem JOIN
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .order('last_activity', { ascending: false });
      
      if (postsError) {
        console.error('Erro ao buscar posts:', postsError);
        throw postsError;
      }
      
      console.log('Posts retornados:', postsData?.length || 0);
      
      // Buscar perfis separadamente
      const { data: profilesData, error: profilesError } = await supabase
        .from('community_user_profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Erro ao buscar perfis:', profilesError);
        // Não falhar se perfis não existirem, usar dados padrão
      }
      
      // Mapear posts com autores
      const postsWithAuthors = postsData?.map(post => {
        const profile = profilesData?.find(p => p.user_id === post.user_id);
        return {
          ...post,
          author: profile ? {
            name: profile.name,
            organ: profile.organ,
            role: profile.role,
            avatar: profile.avatar_url || '',
            reputation: profile.reputation,
            verified: profile.verified
          } : {
            name: 'Usuário',
            organ: 'Não informado',
            role: 'Membro',
            avatar: '',
            reputation: 0,
            verified: false
          }
        };
      }) || [];
      
      setPosts(postsWithAuthors);
      console.log('Posts processados e definidos:', postsWithAuthors.length);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      toast({
        title: "Erro ao carregar posts",
        description: "Não foi possível carregar os posts da comunidade.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const ensureUserProfile = async (user: any) => {
    try {
      console.log('Verificando perfil do usuário:', user.id);
      
      const { data: profile, error: fetchError } = await supabase
        .from('community_user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Erro ao verificar perfil:', fetchError);
        throw fetchError;
      }

      if (!profile) {
        console.log('Criando perfil para usuário:', user.id);
        
        const { error: insertError } = await supabase
          .from('community_user_profiles')
          .insert([{
            user_id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            organ: 'Órgão não informado',
            role: 'Membro da comunidade'
          }]);

        if (insertError) {
          console.error('Erro ao criar perfil:', insertError);
          throw insertError;
        }

        console.log('Perfil criado com sucesso');
      } else {
        console.log('Perfil já existe:', profile);
      }
    } catch (error) {
      console.error('Erro ao garantir perfil do usuário:', error);
      throw error; // Re-throw para ser capturado pela função que chama
    }
  };

  const createPost = async (postData: Partial<CommunityPost>) => {
    try {
      console.log('Iniciando criação de post:', postData);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Erro de autenticação:', userError);
        throw new Error('Usuário não autenticado');
      }

      console.log('Usuário autenticado:', user.id);

      // Garantir que o perfil do usuário existe antes de criar o post
      await ensureUserProfile(user);

      console.log('Perfil verificado, criando post...');

      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          user_id: user.id,
          title: postData.title,
          content: postData.content,
          category: postData.category,
          subcategory: postData.subcategory,
          type: postData.type,
          tags: postData.tags || []
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar post no banco:', error);
        throw error;
      }

      console.log('Post criado com sucesso:', data);
      
      toast({
        title: "Post criado!",
        description: "Seu post foi publicado com sucesso."
      });

      await fetchPosts();
      return data;
    } catch (error) {
      console.error('Erro completo ao criar post:', error);
      
      // Mensagem de erro mais específica
      let errorMessage = "Não foi possível publicar seu post.";
      if (error.message?.includes('permission')) {
        errorMessage = "Você não tem permissão para criar posts. Verifique se está logado.";
      } else if (error.message?.includes('validation')) {
        errorMessage = "Dados do post inválidos. Verifique se todos os campos estão preenchidos.";
      }
      
      toast({
        title: "Erro ao criar post",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePost = async (postId: string, updates: Partial<CommunityPost>) => {
    try {
      console.log('Atualizando post:', postId, updates);
      
      const { error } = await supabase
        .from('community_posts')
        .update({
          title: updates.title,
          content: updates.content,
          category: updates.category,
          subcategory: updates.subcategory,
          tags: updates.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) {
        console.error('Erro ao atualizar post:', error);
        throw error;
      }

      console.log('Post atualizado com sucesso');
      
      toast({
        title: "Post atualizado!",
        description: "Suas alterações foram salvas."
      });

      await fetchPosts();
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      toast({
        title: "Erro ao atualizar post",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    }
  };

  const deletePost = async (postId: string) => {
    try {
      console.log('Excluindo post:', postId);
      
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Erro ao excluir post:', error);
        throw error;
      }

      console.log('Post excluído com sucesso');
      
      toast({
        title: "Post excluído!",
        description: "O post foi removido com sucesso."
      });

      await fetchPosts();
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      toast({
        title: "Erro ao excluir post",
        description: "Não foi possível remover o post.",
        variant: "destructive"
      });
    }
  };

  const votePost = async (postId: string, voteType: 'up' | 'down') => {
    try {
      console.log('Registrando voto:', { postId, voteType });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Verificando voto existente...');
      
      // Verificar se já votou
      const { data: existingVote, error: voteError } = await supabase
        .from('community_votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle();

      if (voteError) {
        console.error('Erro ao verificar voto existente:', voteError);
        throw voteError;
      }

      console.log('Voto existente:', existingVote);

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remover voto se for o mesmo tipo
          console.log('Removendo voto duplicado');
          const { error } = await supabase
            .from('community_votes')
            .delete()
            .eq('id', existingVote.id);
          
          if (error) throw error;
        } else {
          // Alterar tipo do voto
          console.log('Alterando tipo do voto');
          const { error } = await supabase
            .from('community_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
          
          if (error) throw error;
        }
      } else {
        // Criar novo voto
        console.log('Criando novo voto');
        const { error } = await supabase
          .from('community_votes')
          .insert([{
            user_id: user.id,
            post_id: postId,
            vote_type: voteType
          }]);
        
        if (error) throw error;
      }

      console.log('Voto processado com sucesso');
      await fetchPosts();
    } catch (error) {
      console.error('Erro ao votar:', error);
      toast({
        title: "Erro ao votar",
        description: "Não foi possível registrar seu voto.",
        variant: "destructive"
      });
    }
  };

  const incrementViews = async (postId: string) => {
    try {
      console.log('Incrementando views para post:', postId);
      
      // Usar rpc para incrementar atomicamente
      const { error } = await supabase.rpc('increment_post_views', {
        post_id: postId
      });

      if (error) {
        console.error('Erro ao incrementar views:', error);
        // Fallback: buscar e atualizar manualmente
        const { data: currentPost, error: fetchError } = await supabase
          .from('community_posts')
          .select('views')
          .eq('id', postId)
          .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
          .from('community_posts')
          .update({ views: (currentPost.views || 0) + 1 })
          .eq('id', postId);

        if (updateError) throw updateError;
      }

      console.log('Views incrementadas com sucesso');
    } catch (error) {
      console.error('Erro ao incrementar views:', error);
    }
  };

  useEffect(() => {
    console.log('Inicializando useCommunityPosts...');
    fetchPosts();

    // Configurar escuta em tempo real
    const channel = supabase
      .channel('community_posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts'
        },
        (payload) => {
          console.log('Mudança em tempo real detectada:', payload);
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      console.log('Limpando canal de tempo real');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    votePost,
    incrementViews,
    refetch: fetchPosts
  };
}
