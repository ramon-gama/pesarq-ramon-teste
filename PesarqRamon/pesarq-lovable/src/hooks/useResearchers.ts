
import { Researcher, UpdateResearcherData } from '@/types/researcher';
import { useResearcherData } from './useResearcherData';
import { useResearcherOperations } from './useResearcherOperations';
import { useResearcherFilters } from './useResearcherFilters';

export function useResearchers() {
  const { 
    researchers, 
    loading, 
    refetch,
    addResearcher,
    updateResearcher: updateResearcherLocal,
    removeResearcher
  } = useResearcherData();
  
  // Passa as funções de atualização otimista para as operações
  const { createResearcher, updateResearcher, deleteResearcher, dismissResearcher } = useResearcherOperations({
    onOptimisticAdd: addResearcher,
    onOptimisticUpdate: updateResearcherLocal,
    onOptimisticRemove: removeResearcher,
    onRevert: refetch
  });
  
  const { activeResearchers, inactiveResearchers, dismissedResearchers } = useResearcherFilters(researchers);

  const handleCreateResearcher = async (researcherData: any) => {
    const result = await createResearcher(researcherData);
    return result;
  };

  const handleUpdateResearcher = async (id: string, researcherData: UpdateResearcherData) => {
    const result = await updateResearcher(id, researcherData);
    return result;
  };

  const handleDeleteResearcher = async (id: string) => {
    await deleteResearcher(id);
  };

  const toggleResearcherStatus = async (id: string, isActive: boolean) => {
    try {
      const currentResearcher = researchers.find(r => r.id === id);
      
      let updateData: UpdateResearcherData = {
        is_active: isActive,
        status: isActive ? 'active' : 'inactive'
      };

      if (isActive && currentResearcher?.status === 'dismissed') {
        updateData = {
          ...updateData,
          dismissal_reason: undefined,
          dismissal_date: undefined,
          dismissed_by: undefined
        };
      }

      await handleUpdateResearcher(id, updateData);
    } catch (error) {
      console.error('Erro ao alterar status do pesquisador:', error);
    }
  };

  const handleDismissResearcher = async (id: string, reason: string, dismissedBy: string) => {
    await dismissResearcher(id, reason, dismissedBy);
  };

  return {
    researchers,
    activeResearchers,
    inactiveResearchers,
    dismissedResearchers,
    loading,
    createResearcher: handleCreateResearcher,
    updateResearcher: handleUpdateResearcher,
    deleteResearcher: handleDeleteResearcher,
    toggleResearcherStatus,
    dismissResearcher: handleDismissResearcher,
    refetch
  };
}

// Export the Researcher type for backwards compatibility
export type { Researcher } from '@/types/researcher';
