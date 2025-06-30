import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Researcher } from '@/types/researcher';

export function useResearcherData() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchResearchers = async () => {
    try {
      setLoading(true);
      console.log('fetchResearchers: Buscando dados...');
      
      const { data, error } = await supabase
        .from('researchers')
        .select(`
          *,
          projects:project_id (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData = (data || []).map(researcher => ({
        ...researcher,
        status: researcher.status || 'active'
      }));

      console.log('fetchResearchers: Dados carregados:', mappedData.length, 'pesquisadores');
      setResearchers(mappedData);
      
    } catch (error) {
      console.error('Erro ao buscar pesquisadores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pesquisadores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchers();
  }, []);

  const addResearcher = (newResearcher: Researcher) => {
    console.log('addResearcher: Adicionando pesquisador ao estado local', newResearcher.id);
    setResearchers(prev => {
      const exists = prev.some(r => r.id === newResearcher.id);
      if (exists) {
        console.log('addResearcher: Pesquisador já existe, substituindo...');
        return prev.map(r => r.id === newResearcher.id ? newResearcher : r);
      }
      return [newResearcher, ...prev];
    });
  };

  const updateResearcher = (id: string, updatedData: Partial<Researcher>) => {
    console.log('updateResearcher: Atualizando pesquisador no estado local', id);
    
    setResearchers(prev => {
      const updated = prev.map(researcher => {
        if (researcher.id === id) {
          const updatedResearcher = {
            ...researcher,
            ...updatedData,
            updated_at: new Date().toISOString()
          };
          console.log('updateResearcher: Pesquisador atualizado:', updatedResearcher);
          return updatedResearcher;
        }
        return researcher;
      });
      
      console.log('updateResearcher: Estado atualizado');
      return updated;
    });
  };

  const removeResearcher = (id: string) => {
    console.log('removeResearcher: Removendo pesquisador do estado local', id);
    setResearchers(prev => prev.filter(researcher => researcher.id !== id));
  };

  return {
    researchers,
    loading,
    refetch: fetchResearchers,
    addResearcher,
    updateResearcher,
    removeResearcher,
    setResearchers
  };
}
