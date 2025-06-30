import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Researcher, CreateResearcherData, UpdateResearcherData } from '@/types/researcher';

interface UseResearcherOperationsProps {
  onOptimisticAdd: (researcher: Researcher) => void;
  onOptimisticUpdate: (id: string, data: Partial<Researcher>) => void;
  onOptimisticRemove: (id: string) => void;
  onRevert: () => Promise<void>;
}

export function useResearcherOperations({ 
  onOptimisticAdd,
  onOptimisticUpdate,
  onOptimisticRemove,
  onRevert
}: UseResearcherOperationsProps) {
  const { toast } = useToast();

  const createResearcher = async (researcherData: CreateResearcherData) => {
    try {
      console.log('createResearcher: Criando pesquisador...');
      
      const tempId = `temp-${Date.now()}`;
      const optimisticResearcher: Researcher = {
        ...researcherData,
        id: tempId,
        is_active: true,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      onOptimisticAdd(optimisticResearcher);

      const { data, error } = await supabase
        .from('researchers')
        .insert([{
          ...researcherData,
          is_active: true,
          status: 'active'
        }])
        .select(`
          *,
          projects:project_id (
            id,
            title
          )
        `)
        .single();

      if (error) throw error;

      console.log('createResearcher: Pesquisador criado com sucesso', data);

      onOptimisticRemove(tempId);
      onOptimisticAdd(data);

      toast({
        title: "Sucesso",
        description: "Pesquisador cadastrado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar pesquisador:', error);
      await onRevert();
      toast({
        title: "Erro",
        description: "Erro ao cadastrar pesquisador",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateResearcherData = async (id: string, researcherData: UpdateResearcherData) => {
    try {
      console.log('updateResearcher: Atualizando pesquisador', id, researcherData);
      
      // Fazer a atualização no servidor PRIMEIRO (sem otimismo para edições)
      const { data, error } = await supabase
        .from('researchers')
        .update(researcherData)
        .eq('id', id)
        .select(`
          *,
          projects:project_id (
            id,
            title
          )
        `)
        .single();

      if (error) throw error;

      console.log('updateResearcher: Dados recebidos do servidor:', data);

      // Aplicar os dados completos do servidor no estado local
      const serverData = {
        ...data,
        status: data.status || 'active'
      };
      
      onOptimisticUpdate(id, serverData);

      console.log('updateResearcher: Estado local atualizado');

      toast({
        title: "Sucesso",
        description: "Pesquisador atualizado com sucesso",
      });

      return serverData;
    } catch (error) {
      console.error('Erro ao atualizar pesquisador:', error);
      await onRevert();
      toast({
        title: "Erro",
        description: "Erro ao atualizar pesquisador",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteResearcher = async (id: string) => {
    try {
      console.log('deleteResearcher: Removendo pesquisador', id);
      
      onOptimisticRemove(id);
      
      const { error } = await supabase
        .from('researchers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('deleteResearcher: Pesquisador removido com sucesso');

      toast({
        title: "Sucesso",
        description: "Pesquisador removido com sucesso",
      });
      
    } catch (error) {
      console.error('Erro ao deletar pesquisador:', error);
      await onRevert();
      toast({
        title: "Erro",
        description: "Erro ao remover pesquisador",
        variant: "destructive",
      });
      throw error;
    }
  };

  const dismissResearcher = async (id: string, reason: string, dismissedBy: string) => {
    try {
      const updateData = {
        is_active: false,
        status: 'dismissed' as const,
        dismissal_reason: reason,
        dismissal_date: new Date().toISOString().split('T')[0],
        dismissed_by: dismissedBy
      };

      await updateResearcherData(id, updateData);
      
      toast({
        title: "Sucesso",
        description: "Pesquisador desligado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao desligar pesquisador:', error);
      toast({
        title: "Erro",
        description: "Erro ao desligar pesquisador",
        variant: "destructive",
      });
    }
  };

  return {
    createResearcher,
    updateResearcher: updateResearcherData,
    deleteResearcher,
    dismissResearcher
  };
}
