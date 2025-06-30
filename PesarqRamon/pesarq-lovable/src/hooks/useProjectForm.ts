
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/useProjects';
import { useProposals } from '@/hooks/useProposals';
import type { ProjectFormData, ProjectStatus, NewGoalData } from '@/types/projectForm';

const defaultProjectData: ProjectFormData = {
  title: '',
  organization_id: '',
  selected_proposal_id: '',
  object: '',
  legal_instrument: '',
  instrument_number: '',
  start_date: new Date(),
  end_date: null,
  total_value: '',
  researchers_count: '',
  documents_meters: '',
  boxes_to_digitalize: '',
  boxes_to_describe: '',
  status: 'planejamento' as ProjectStatus,
  project_type: '',
  document_url: '',
  external_link: '',
  responsibles: [],
  goals: []
};

const defaultNewGoal: NewGoalData = {
  number: '',
  description: '',
  value: '',
  start_date: null,
  end_date: null,
  progress: 0,
  products: [],
  responsibles: []
};

export function useProjectForm(project?: any, proposal?: any) {
  const [formData, setFormData] = useState<ProjectFormData>(defaultProjectData);
  const [newGoal, setNewGoal] = useState<NewGoalData>(defaultNewGoal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [relatedProposal, setRelatedProposal] = useState<any>(null);
  const { createProject, updateProject } = useProjects();
  const { proposals, refetch: refetchProposals } = useProposals();
  const { toast } = useToast();

  // Força atualização das propostas quando o hook é inicializado
  useEffect(() => {
    console.log('useProjectForm: Initializing and fetching proposals...');
    refetchProposals();
  }, [refetchProposals]);

  // Efeito para carregar dados do projeto ou proposta
  useEffect(() => {
    console.log('useProjectForm: Loading data', { project, proposal });
    
    if (project) {
      loadProject(project);
    } else if (proposal) {
      loadProposalData(proposal);
    } else {
      // Reset to default when no project or proposal
      setFormData(defaultProjectData);
      setRelatedProposal(null);
    }
  }, [project, proposal]);

  // Efeito para carregar proposta relacionada quando o ID da proposta é definido
  useEffect(() => {
    if (formData.selected_proposal_id && !relatedProposal && proposals.length > 0) {
      const foundProposal = proposals.find(p => p.id === formData.selected_proposal_id);
      if (foundProposal) {
        console.log('useProjectForm: Loading related proposal', foundProposal);
        setRelatedProposal(foundProposal);
        // Auto-fill form with proposal data if not already filled
        if (!formData.title && foundProposal.title) {
          loadProposalData(foundProposal);
        }
      }
    }
  }, [formData.selected_proposal_id, proposals, relatedProposal, formData.title]);

  const updateField = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(defaultProjectData);
    setNewGoal(defaultNewGoal);
  };

  const loadProject = (projectData: any) => {
    console.log('useProjectForm: Loading project data', projectData);
    if (projectData) {
      // Carregar as metas do projeto se existirem
      const projectGoals = projectData.goals || projectData.project_goals || [];
      console.log('useProjectForm: Loading project goals', projectGoals);
      
      setFormData({
        title: projectData.title || '',
        organization_id: projectData.organization_id || '',
        selected_proposal_id: projectData.proposal_id || '',
        object: projectData.object || '',
        legal_instrument: projectData.legal_instrument || '',
        instrument_number: projectData.instrument_number || '',
        start_date: projectData.start_date ? new Date(projectData.start_date) : new Date(),
        end_date: projectData.end_date ? new Date(projectData.end_date) : null,
        total_value: projectData.total_value?.toString() || '',
        researchers_count: projectData.researchers_count?.toString() || '',
        documents_meters: projectData.documents_meters?.toString() || '',
        boxes_to_digitalize: projectData.boxes_to_digitalize?.toString() || '',
        boxes_to_describe: projectData.boxes_to_describe?.toString() || '',
        status: (projectData.status || 'planejamento') as ProjectStatus,
        project_type: projectData.project_type || '',
        document_url: projectData.document_url || '',
        external_link: projectData.external_link || '',
        responsibles: projectData.responsibles || projectData.project_responsibles?.map((r: any) => r.name) || [],
        goals: projectGoals.map((goal: any) => ({
          id: goal.id,
          project_id: goal.project_id,
          number: goal.number,
          description: goal.description,
          value: goal.value || 0,
          start_date: goal.start_date,
          end_date: goal.end_date,
          progress: goal.progress || 0,
          products: goal.products || goal.goal_products?.map((p: any) => p.name) || [],
          responsibles: goal.responsibles || goal.goal_responsibles?.map((r: any) => r.name) || []
        }))
      });

      // Carregar dados da proposta relacionada se existir
      if (projectData.proposal_id && proposals.length > 0) {
        const relatedProposalData = proposals.find(p => p.id === projectData.proposal_id);
        if (relatedProposalData) {
          console.log('useProjectForm: Loading related proposal for project', relatedProposalData);
          setRelatedProposal(relatedProposalData);
        }
      }
    }
  };

  const loadProposalData = (proposalData: any) => {
    console.log('useProjectForm: Loading proposal data', proposalData);
    if (proposalData) {
      setRelatedProposal(proposalData);
      
      // Calcular data de fim estimada baseada na duração
      let estimatedEndDate = null;
      if (proposalData.estimated_duration_months) {
        const startDate = new Date();
        estimatedEndDate = new Date(startDate);
        estimatedEndDate.setMonth(estimatedEndDate.getMonth() + proposalData.estimated_duration_months);
      }

      setFormData(prev => ({
        ...prev,
        selected_proposal_id: proposalData.id,
        title: proposalData.title || '',
        organization_id: proposalData.organization_id || '',
        total_value: proposalData.estimated_value?.toString() || '',
        project_type: proposalData.tipo_projeto || '',
        legal_instrument: proposalData.tipo_instrumento || '',
        external_link: proposalData.external_link || '',
        object: proposalData.description || '',
        end_date: estimatedEndDate
      }));
    }
  };

  const handleProposalSelect = (proposalId: string) => {
    console.log('useProjectForm: Proposal selected', proposalId);
    if (proposalId === "no-proposal") {
      setRelatedProposal(null);
      setFormData(prev => ({
        ...prev,
        selected_proposal_id: ''
      }));
    } else {
      // Find the proposal in the available proposals
      const selectedProposal = proposals.find(p => p.id === proposalId);
      if (selectedProposal) {
        setRelatedProposal(selectedProposal);
      }
      
      setFormData(prev => ({
        ...prev,
        selected_proposal_id: proposalId
      }));
    }
  };

  const handleOrganizationChange = (organizationId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      organization_id: organizationId,
      // Reset proposal selection when organization changes
      selected_proposal_id: ''
    }));
    setRelatedProposal(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.organization_id) {
      toast({
        title: "Erro",
        description: "Organização é obrigatória",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (onClose: () => void) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Converter dados do formulário para o formato da API
      const projectData = {
        title: formData.title,
        organization_id: formData.organization_id,
        proposal_id: formData.selected_proposal_id || null,
        object: formData.object,
        legal_instrument: formData.legal_instrument,
        instrument_number: formData.instrument_number,
        start_date: formData.start_date.toISOString().split('T')[0],
        end_date: formData.end_date ? formData.end_date.toISOString().split('T')[0] : null,
        total_value: parseFloat(formData.total_value) || 0,
        researchers_count: parseInt(formData.researchers_count) || 0,
        documents_meters: parseFloat(formData.documents_meters) || 0,
        boxes_to_digitalize: parseInt(formData.boxes_to_digitalize) || 0,
        boxes_to_describe: parseInt(formData.boxes_to_describe) || 0,
        status: formData.status,
        project_type: formData.project_type,
        external_link: formData.external_link || null,
        progress: 0
      };

      if (project?.id) {
        await updateProject(project.id, projectData);
      } else {
        await createProject(projectData);
      }
      
      toast({
        title: "Sucesso",
        description: project?.id ? "Projeto atualizado com sucesso" : "Projeto criado com sucesso",
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar projeto",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    newGoal,
    setNewGoal,
    isSubmitting,
    relatedProposal,
    updateField,
    resetForm,
    loadProject,
    handleProposalSelect,
    handleOrganizationChange,
    handleSubmit
  };
}
