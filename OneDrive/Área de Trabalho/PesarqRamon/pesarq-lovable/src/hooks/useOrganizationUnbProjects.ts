
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationContext } from '@/contexts/OrganizationContext';

export interface OrganizationUnbProjectGoal {
  id: string;
  number: string;
  title?: string;
  description: string;
  progress: number;
  responsible?: string;
  start_date?: string;
  end_date?: string;
  progress_type: 'manual' | 'automatic';
  created_at: string;
  updated_at: string;
  deliverables?: Array<{
    id: string;
    name: string;
    description?: string;
    completed: boolean;
  }>;
  physical_scope?: Array<{
    id: string;
    service_type: string;
    indicator: string;
    target_quantity: number;
    current_quantity: number;
    unit: string;
  }>;
}

export interface CreateOrganizationUnbProjectGoal {
  number: string;
  title?: string;
  description: string;
  responsible?: string;
  start_date?: string;
  end_date?: string;
  progress: number;
  progress_type: 'manual' | 'automatic';
  deliverables?: Array<{
    name: string;
    description?: string;
    completed: boolean;
  }>;
  physical_scope?: Array<{
    service_type: string;
    indicator: string;
    target_quantity: number;
    current_quantity: number;
    unit: string;
  }>;
}

export interface OrganizationUnbProject {
  id: string;
  title: string;
  description?: string;
  legal_instrument?: string;
  instrument_number?: string;
  status: 'planejamento' | 'andamento' | 'finalizado' | 'suspenso' | 'cancelado';
  start_date: string;
  end_date?: string;
  total_value?: number;
  progress: number;
  project_type?: string;
  external_link?: string;
  organization_id: string;
  object?: string;
  documents_meters?: number;
  boxes_to_describe?: number;
  boxes_to_digitalize?: number;
  researchers_count?: number;
  created_at: string;
  updated_at: string;
  goals?: OrganizationUnbProjectGoal[];
  responsibles?: Array<{
    id: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    organization?: string;
  }>;
}

// Global channel reference to prevent multiple subscriptions
let globalChannelRef: any = null;
let subscribersCount = 0;
const subscribers = new Set<() => void>();

export function useOrganizationUnbProjects() {
  const [projects, setProjects] = useState<OrganizationUnbProject[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentOrganization } = useOrganizationContext();
  const cleanupRef = useRef<(() => void) | null>(null);

  const loadProjects = async () => {
    if (!currentOrganization?.id) {
      console.log('🔍 Nenhuma organização selecionada, limpando projetos');
      setProjects([]);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Carregando projetos UnB para organização:', currentOrganization.id);
      
      const { data: projectsData, error } = await supabase
        .from('organization_unb_projects')
        .select(`
          *,
          organization_unb_project_goals (
            id,
            number,
            title,
            description,
            progress,
            responsible,
            start_date,
            end_date,
            progress_type,
            created_at,
            updated_at
          ),
          organization_unb_project_responsibles (
            id,
            name
          )
        `)
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar projetos:', error);
        throw error;
      }

      const processedProjects = (projectsData || []).map(project => ({
        ...project,
        goals: project.organization_unb_project_goals?.map(goal => ({
          ...goal,
          deliverables: [],
          physical_scope: []
        })) || [],
        responsibles: project.organization_unb_project_responsibles?.map(resp => ({
          id: resp.id,
          name: resp.name,
          role: '',
          email: '',
          phone: '',
          organization: ''
        })) || []
      }));

      console.log('✅ Projetos encontrados:', processedProjects.length);
      setProjects(processedProjects);
    } catch (error: any) {
      console.error('💥 Erro ao carregar projetos:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os projetos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<OrganizationUnbProject, 'id' | 'created_at' | 'updated_at' | 'goals' | 'responsibles'>) => {
    if (!currentOrganization?.id) {
      toast({
        title: "Erro",
        description: "Nenhuma organização selecionada.",
        variant: "destructive"
      });
      return null;
    }

    try {
      console.log('➕ Criando novo projeto:', projectData);
      
      const { data, error } = await supabase
        .from('organization_unb_projects')
        .insert([{
          ...projectData,
          organization_id: currentOrganization.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar projeto:', error);
        throw error;
      }

      console.log('✅ Projeto criado com sucesso:', data);
      
      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso!"
      });

      await loadProjects();
      return data;
    } catch (error: any) {
      console.error('💥 Erro ao criar projeto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar projeto.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<OrganizationUnbProject>) => {
    try {
      console.log('🔄 Atualizando projeto:', id, updates);
      
      const { data, error } = await supabase
        .from('organization_unb_projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar projeto:', error);
        throw error;
      }

      console.log('✅ Projeto atualizado com sucesso:', data);
      
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!"
      });

      await loadProjects();
      return data;
    } catch (error: any) {
      console.error('💥 Erro ao atualizar projeto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar projeto.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      console.log('🗑️ Excluindo projeto:', id);
      
      const { error } = await supabase
        .from('organization_unb_projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao excluir projeto:', error);
        throw error;
      }

      console.log('✅ Projeto excluído com sucesso');
      
      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso!"
      });

      await loadProjects();
    } catch (error: any) {
      console.error('💥 Erro ao excluir projeto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir projeto.",
        variant: "destructive"
      });
    }
  };

  const createGoal = async (projectId: string, goalData: CreateOrganizationUnbProjectGoal) => {
    try {
      console.log('🎯 Criando meta para projeto:', projectId);
      
      const { data, error } = await supabase
        .from('organization_unb_project_goals')
        .insert([{
          ...goalData,
          project_id: projectId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar meta:', error);
        throw error;
      }

      console.log('✅ Meta criada com sucesso:', data);
      
      toast({
        title: "Sucesso",
        description: "Meta criada com sucesso!"
      });

      await loadProjects();
      return data;
    } catch (error: any) {
      console.error('💥 Erro ao criar meta:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar meta.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateGoal = async (goalId: string, goalData: Partial<OrganizationUnbProjectGoal>) => {
    try {
      console.log('📝 Atualizando meta:', goalId);
      
      const { data, error } = await supabase
        .from('organization_unb_project_goals')
        .update({
          ...goalData,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar meta:', error);
        throw error;
      }

      console.log('✅ Meta atualizada com sucesso:', data);
      
      toast({
        title: "Sucesso",
        description: "Meta atualizada com sucesso!"
      });

      await loadProjects();
      return data;
    } catch (error: any) {
      console.error('💥 Erro ao atualizar meta:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar meta.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      console.log('🗑️ Excluindo meta:', goalId);
      
      const { error } = await supabase
        .from('organization_unb_project_goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('❌ Erro ao excluir meta:', error);
        throw error;
      }

      console.log('✅ Meta excluída com sucesso');
      
      toast({
        title: "Sucesso",
        description: "Meta excluída com sucesso!"
      });

      await loadProjects();
    } catch (error: any) {
      console.error('💥 Erro ao excluir meta:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir meta.",
        variant: "destructive"
      });
    }
  };

  const refreshProjects = async () => {
    await loadProjects();
  };

  // Setup realtime subscription with global channel management
  useEffect(() => {
    if (!currentOrganization?.id) {
      setProjects([]);
      return;
    }

    // Load projects initially
    loadProjects();

    // Create reload callback for this instance
    const reloadCallback = () => {
      console.log('📡 Recarregando projetos via real-time');
      loadProjects();
    };

    // Add this instance to subscribers
    subscribers.add(reloadCallback);
    subscribersCount++;

    // Setup global channel if not exists
    if (!globalChannelRef && subscribersCount === 1) {
      console.log('📡 Criando canal global para projetos UnB');
      
      globalChannelRef = supabase
        .channel('organization-unb-projects-global')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'organization_unb_projects'
          },
          (payload) => {
            console.log('📡 Mudança detectada em projetos:', payload);
            // Notify all subscribers
            subscribers.forEach(callback => callback());
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'organization_unb_project_goals'
          },
          (payload) => {
            console.log('📡 Mudança detectada em metas:', payload);
            // Notify all subscribers
            subscribers.forEach(callback => callback());
          }
        )
        .subscribe((status) => {
          console.log('📡 Status do canal global:', status);
        });
    }

    // Cleanup function
    cleanupRef.current = () => {
      subscribers.delete(reloadCallback);
      subscribersCount--;
      
      // Remove global channel when no more subscribers
      if (subscribersCount === 0 && globalChannelRef) {
        console.log('📡 Removendo canal global (sem mais assinantes)');
        supabase.removeChannel(globalChannelRef);
        globalChannelRef = null;
      }
    };

    return cleanupRef.current;
  }, [currentOrganization?.id]);

  return {
    projects,
    loading,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshProjects
  };
}
