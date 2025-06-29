import { useState } from "react";
import { ResearcherForm } from "../ResearcherForm";
import { useResearchers, type Researcher } from "@/hooks/useResearchers";
import { useProjects } from "@/hooks/useProjects";

interface ResearcherFormContainerProps {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
  editingResearcher?: Researcher | null;
}

export function ResearcherFormContainer({ 
  isOpen, 
  onClose, 
  editingResearcher 
}: ResearcherFormContainerProps) {
  const { createResearcher, updateResearcher } = useResearchers();
  const { projects } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (researcherData: any) => {
    try {
      setIsSubmitting(true);
      console.log('ResearcherFormContainer: Salvando dados...', { 
        isEditing: !!editingResearcher,
        researcherId: editingResearcher?.id
      });
      
      const processedData = {
        name: researcherData.name,
        email: researcherData.email,
        phone: researcherData.phone,
        cpf: researcherData.cpf,
        course: researcherData.course,
        function: researcherData.function,
        academic_level: researcherData.academic_level,
        academic_status: researcherData.academic_status,
        specialization: researcherData.specialization,
        institution: researcherData.institution,
        lattes_url: researcherData.lattes_url,
        project_id: researcherData.project_ids?.[0] || null,
        start_date: researcherData.start_date,
        end_date: researcherData.end_date || null,
        workload: researcherData.workload,
        shift: researcherData.shift,
        modality: researcherData.modality,
        selected_goals: researcherData.selected_goals || [],
        observations: researcherData.observations
      };

      if (editingResearcher) {
        console.log('ResearcherFormContainer: Atualizando pesquisador existente');
        await updateResearcher(editingResearcher.id, processedData);
        
        // Para edições, força refetch para garantir sincronização
        console.log('ResearcherFormContainer: Solicitando refetch devido à edição');
        setTimeout(() => {
          onClose(true); // true = fazer refetch
        }, 300);
      } else {
        console.log('ResearcherFormContainer: Criando novo pesquisador');
        await createResearcher(processedData);
        
        // Para criação, não precisa de refetch
        onClose(false);
      }
      
    } catch (error) {
      console.error('ResearcherFormContainer: Erro ao salvar pesquisador:', error);
      // Não fecha o modal em caso de erro
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    console.log('ResearcherFormContainer: Fechando formulário sem salvar');
    onClose(false);
  };

  const mockProjects = projects.map(project => ({
    id: project.id,
    title: project.title,
    goals: project.goals?.map(goal => goal.description) || []
  }));

  return (
    <ResearcherForm
      isOpen={isOpen}
      onClose={handleClose}
      onSave={handleSave}
      editingResearcher={editingResearcher}
      projects={mockProjects}
      isSubmitting={isSubmitting}
    />
  );
}
