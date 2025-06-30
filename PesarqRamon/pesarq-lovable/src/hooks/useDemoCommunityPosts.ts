
import { useState } from 'react';
import { CommunityPost } from './useCommunityPosts';
import { useToast } from './use-toast';

export function useDemoCommunityPosts() {
  const [posts] = useState<CommunityPost[]>([]);
  const [loading] = useState(false);
  const { toast } = useToast();

  const createPost = async (postData: Partial<CommunityPost>) => {
    console.log('Demo createPost chamado:', postData);
    
    toast({
      title: "Post criado no modo demo!",
      description: "Esta é apenas uma simulação. Faça login para criar posts reais.",
    });
    
    return Promise.resolve();
  };

  const updatePost = async (postId: string, updates: Partial<CommunityPost>) => {
    console.log('Demo updatePost chamado:', { postId, updates });
    
    toast({
      title: "Post atualizado no modo demo!",
      description: "Esta é apenas uma simulação.",
    });
    
    return Promise.resolve();
  };

  const deletePost = async (postId: string) => {
    console.log('Demo deletePost chamado:', postId);
    
    toast({
      title: "Post excluído no modo demo!",
      description: "Esta é apenas uma simulação.",
    });
    
    return Promise.resolve();
  };

  const votePost = async (postId: string, voteType: 'up' | 'down') => {
    console.log('Demo votePost chamado:', { postId, voteType });
    
    toast({
      title: "Voto registrado no modo demo!",
      description: "Esta é apenas uma simulação.",
    });
    
    return Promise.resolve();
  };

  const incrementViews = async (postId: string) => {
    console.log('Demo incrementViews chamado:', postId);
    return Promise.resolve();
  };

  const refetch = async () => {
    console.log('Demo refetch chamado');
    return Promise.resolve();
  };

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    votePost,
    incrementViews,
    refetch
  };
}
