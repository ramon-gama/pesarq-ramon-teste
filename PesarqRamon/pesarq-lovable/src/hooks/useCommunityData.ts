
import { useState, useEffect } from 'react';
import { CommunityPost, CommunityReply } from './useCommunityPosts';
import { useCommunityPosts } from './useCommunityPosts';
import { useDemoCommunityPosts } from './useDemoCommunityPosts';
import { useToast } from './use-toast';

interface UseCommunityDataProps {
  isDemo: boolean;
}

export function useCommunityData({ isDemo }: UseCommunityDataProps) {
  const { toast } = useToast();
  const realData = useCommunityPosts();
  const demoData = useDemoCommunityPosts();
  
  // Dados fictícios para modo demo
  const mockPosts: CommunityPost[] = [
    {
      id: "demo-1",
      user_id: "demo-user",
      title: "Como implementar RDC-Arq em órgão de grande porte?",
      content: "Estamos iniciando a implementação do RDC-Arq no Ministério da Saúde e enfrentamos desafios com a quantidade de documentos. Alguém tem experiência com órgãos de grande porte? Quais foram os principais obstáculos e como superaram?",
      category: "Preservação Digital",
      subcategory: "RDC-Arq",
      type: "question",
      tags: ["rdc-arq", "implementação", "órgão-público", "preservação-digital"],
      votes: 8,
      replies: 12,
      views: 234,
      solved: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      author: {
        name: "Roberto Lima",
        organ: "Ministério da Saúde",
        role: "Gestor Documental",
        avatar: "",
        reputation: 430,
        verified: false
      }
    },
    {
      id: "demo-2",
      user_id: "demo-user-2",
      title: "Dúvida sobre classificação de processos eletrônicos",
      content: "Tenho uma dúvida específica sobre a classificação de processos que tramitam apenas eletronicamente. Como vocês estão aplicando a tabela de temporalidade para documentos nato-digitais?",
      category: "Instrumentos Arquivísticos",
      subcategory: "Classificação",
      type: "question",
      tags: ["classificação", "processos-eletrônicos", "temporalidade"],
      votes: 6,
      replies: 9,
      views: 156,
      solved: true,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      last_activity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      author: {
        name: "Fernanda Costa",
        organ: "Tribunal de Contas da União",
        role: "Analista de Arquivo",
        avatar: "",
        reputation: 580,
        verified: false
      }
    },
    {
      id: "demo-3",
      user_id: "demo-user-3",
      title: "Impactos da LGPD na gestão de arquivos universitários",
      content: "Venho observando como a Lei Geral de Proteção de Dados tem impactado significativamente a gestão de arquivos em universidades. Gostaria de abrir uma discussão sobre as principais mudanças que vocês implementaram em suas instituições e como estão lidando com a adequação dos procedimentos arquivísticos às exigências da LGPD.",
      category: "LGPD",
      subcategory: "Adequação Institucional",
      type: "discussion",
      tags: ["lgpd", "universidades", "gestão-arquivística", "adequação"],
      votes: 15,
      replies: 23,
      views: 387,
      solved: false,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      last_activity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      author: {
        name: "João Pereira",
        organ: "UnB - Faculdade de Ciência da Informação",
        role: "Professor",
        avatar: "",
        reputation: 920,
        verified: true
      }
    }
  ];

  const mockReplies: CommunityReply[] = [
    {
      id: "demo-reply-1",
      post_id: "demo-2",
      user_id: "demo-user-reply",
      content: "Ótima pergunta! Na nossa experiência, criamos uma categoria específica para documentos nato-digitais na tabela de temporalidade. O principal é manter a consistência entre os formatos físico e digital.",
      votes: 3,
      is_solution: true,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      author: {
        name: "Carlos Mendes",
        organ: "Arquivo Nacional",
        role: "Especialista",
        avatar: "",
        reputation: 650,
        verified: true
      }
    }
  ];

  // Retorna os dados corretos baseado no modo
  if (isDemo) {
    return {
      posts: mockPosts,
      loading: false,
      createPost: async (postData: Partial<CommunityPost>) => {
        toast({
          title: "Post criado no modo demo!",
          description: "Esta é apenas uma simulação. Faça login para criar posts reais.",
        });
        return Promise.resolve();
      },
      updatePost: async (postId: string, updates: Partial<CommunityPost>) => {
        toast({
          title: "Post atualizado no modo demo!",
          description: "Esta é apenas uma simulação.",
        });
        return Promise.resolve();
      },
      deletePost: async (postId: string) => {
        toast({
          title: "Post excluído no modo demo!",
          description: "Esta é apenas uma simulação.",
        });
        return Promise.resolve();
      },
      votePost: async (postId: string, voteType: 'up' | 'down') => {
        toast({
          title: "Voto registrado no modo demo!",
          description: "Esta é apenas uma simulação.",
        });
        return Promise.resolve();
      },
      incrementViews: async (postId: string) => {
        return Promise.resolve();
      },
      refetch: async () => {
        return Promise.resolve();
      },
      // Dados de replies para modo demo
      getReplies: (postId: string) => {
        return mockReplies.filter(reply => reply.post_id === postId);
      },
      createReply: async (postId: string, content: string) => {
        toast({
          title: "Resposta adicionada no modo demo!",
          description: "Esta é apenas uma simulação.",
        });
        return Promise.resolve();
      },
      voteReply: async (replyId: string, voteType: 'up' | 'down') => {
        toast({
          title: "Voto na resposta registrado no modo demo!",
          description: "Esta é apenas uma simulação.",
        });
        return Promise.resolve();
      }
    };
  }

  // Modo real - retorna os dados do hook real
  return {
    ...realData,
    getReplies: () => [], // Placeholder - será implementado pelo hook de replies específico
    createReply: async () => Promise.resolve(),
    voteReply: async () => Promise.resolve()
  };
}
