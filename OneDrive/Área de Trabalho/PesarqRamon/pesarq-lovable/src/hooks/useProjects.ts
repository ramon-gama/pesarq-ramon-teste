import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationContext } from '@/contexts/OrganizationContext';

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  organization_id?: string;
  start_date: string;
  end_date?: string;
  total_value?: number;
  researchers_count?: number;
  progress?: number;
  created_at: string;
  updated_at: string;
  project_type?: string;
  legal_instrument?: string;
  instrument_number?: string;
  object?: string;
  external_link?: string;
  documents_meters?: number;
  boxes_to_digitalize?: number;
  boxes_to_describe?: number;
  objectives?: string;
  goals?: ProjectGoal[];
  responsibles?: string[];
}

export interface ProjectGoal {
  id: string;
  project_id: string;
  number: string;
  description: string;
  value: number;
  start_date?: string;
  end_date?: string;
  progress: number;
  products?: string[];
  responsibles?: string[];
}

export interface ProjectAmendment {
  id: string;
  project_id: string;
  amendment_number: number;
  title: string;
  description?: string;
  amendment_type: 'prazo' | 'valor' | 'escopo' | 'outro';
  original_value?: number;
  new_value?: number;
  original_end_date?: string;
  new_end_date?: string;
  justification?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  requested_at: string;
  approved_at?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  const { currentOrganization } = useOrganizationContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!currentOrganization?.id) {
      setProjects([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_goals(*),
          project_responsibles(*)
        `)
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const projectsWithGoalsAndResponsibles = data?.map(project => ({
        ...project,
        goals: project.project_goals || [],
        responsibles: project.project_responsibles?.map((r: any) => r.name) || []
      })) || [];
      
      setProjects(projectsWithGoalsAndResponsibles);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar projetos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentOrganization?.id) {
      toast({
        title: "Erro",
        description: "Nenhuma organização selecionada",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, organization_id: currentOrganization.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso",
      });

      await fetchProjects();
      return data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar projeto",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .eq('organization_id', currentOrganization?.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso",
      });

      await fetchProjects();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('organization_id', currentOrganization?.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso",
      });

      await fetchProjects();
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir projeto",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createProjectAmendment = async (amendmentData: Omit<ProjectAmendment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('project_amendments')
        .insert([amendmentData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aditivo criado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar aditivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar aditivo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getProjectAmendments = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_amendments')
        .select('*')
        .eq('project_id', projectId)
        .order('amendment_number', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar aditivos:', error);
      throw error;
    }
  };

  const updateProjectAmendment = async (id: string, amendmentData: Partial<ProjectAmendment>) => {
    try {
      const { data, error } = await supabase
        .from('project_amendments')
        .update(amendmentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aditivo atualizado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar aditivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar aditivo",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentOrganization?.id]);

  return {
    projects,
    loading,
    fetchProjects,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    createProjectAmendment,
    getProjectAmendments,
    updateProjectAmendment
  };
}
