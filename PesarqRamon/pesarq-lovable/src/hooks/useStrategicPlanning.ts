
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StrategicPlan {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  duration: number;
  start_date: string;
  end_date?: string;
  status: string;
  progress: number;
  mission?: string;
  vision?: string;
  values?: string[];
  created_at: string;
  updated_at: string;
  objectives?: number;
  completedObjectives?: number;
  team?: number;
  startDate?: string;
  endDate?: string;
}

export interface StrategicPlanObjective {
  id: string;
  plan_id: string;
  title: string;
  description?: string;
  progress: number;
  completed: boolean;
  start_date?: string;
  end_date?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface StrategicPlanAction {
  id: string;
  objective_id: string;
  title: string;
  description?: string;
  progress: number;
  progress_type: string;
  service_type?: string;
  target_metric?: string;
  current_value?: number;
  responsible_person?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StrategicPlanTeamMember {
  id: string;
  plan_id: string;
  name: string;
  role?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// Cache global para evitar refetch desnecessário
const dataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 segundos

export function useStrategicPlanning(organizationId?: string) {
  const [plans, setPlans] = useState<StrategicPlan[]>([]);
  const [objectives, setObjectives] = useState<StrategicPlanObjective[]>([]);
  const [actions, setActions] = useState<StrategicPlanAction[]>([]);
  const [teamMembers, setTeamMembers] = useState<StrategicPlanTeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Refs para controlar estado
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const lastFetchRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const currentOrgIdRef = useRef<string | undefined>(undefined);
  const isCleaningUpRef = useRef(false);

  console.log('useStrategicPlanning: hook inicializado com organizationId:', organizationId);

  // Função debounced para buscar dados
  const debouncedFetch = useCallback((orgId: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      fetchPlansOptimized(orgId);
    }, 300);
  }, []);

  // Cache helper functions
  const getCachedData = (key: string) => {
    const cached = dataCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  const setCachedData = (key: string, data: any) => {
    dataCache.set(key, { data, timestamp: Date.now() });
  };

  // Função otimizada para buscar planos com estatísticas em uma única query
  const fetchPlansOptimized = async (orgId: string) => {
    const now = Date.now();
    if (now - lastFetchRef.current < 1000) {
      console.log('Ignorando fetch - muito recente');
      return;
    }
    lastFetchRef.current = now;

    const cacheKey = `plans_${orgId}`;
    const cachedPlans = getCachedData(cacheKey);
    
    if (cachedPlans) {
      console.log('Usando dados do cache');
      setPlans(cachedPlans);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Buscando planos otimizados para organização:', orgId);
      
      // Query otimizada: busca planos com contadores em uma única consulta
      const { data: plansData, error: plansError } = await supabase
        .from('strategic_plans')
        .select(`
          *,
          objectives:strategic_plan_objectives(id, completed, progress),
          team_members:strategic_plan_team_members(id)
        `)
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      if (plansError) {
        console.error('Erro ao buscar planos:', plansError);
        throw plansError;
      }

      if (!plansData || plansData.length === 0) {
        console.log('Nenhum plano encontrado');
        setPlans([]);
        setCachedData(cacheKey, []);
        return;
      }

      // Processar dados de forma otimizada
      const processedPlans = plansData.map((plan: any) => {
        const planObjectives = plan.objectives || [];
        const completedObjectives = planObjectives.filter((obj: any) => obj.completed).length;
        const averageProgress = planObjectives.length 
          ? Math.round(planObjectives.reduce((sum: number, obj: any) => sum + obj.progress, 0) / planObjectives.length)
          : 0;

        return {
          ...plan,
          objectives: planObjectives.length,
          completedObjectives,
          team: plan.team_members?.length || 0,
          progress: averageProgress,
          startDate: plan.start_date,
          endDate: plan.end_date
        };
      });

      console.log('Planos processados com sucesso:', processedPlans.length);
      setPlans(processedPlans);
      setCachedData(cacheKey, processedPlans);
      
    } catch (error) {
      console.error('Erro ao buscar planejamentos estratégicos:', error);
      setError('Erro ao carregar planejamentos estratégicos');
      toast({
        title: "Erro",
        description: "Erro ao carregar planejamentos estratégicos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar objetivos de forma otimizada
  const fetchObjectives = useCallback(async (planId: string) => {
    const cacheKey = `objectives_${planId}`;
    const cachedObjectives = getCachedData(cacheKey);
    
    if (cachedObjectives) {
      setObjectives(prev => {
        const filtered = prev.filter(obj => obj.plan_id !== planId);
        return [...filtered, ...cachedObjectives];
      });
      return cachedObjectives;
    }

    try {
      console.log('Buscando objetivos para o plano:', planId);
      
      const { data, error } = await supabase
        .from('strategic_plan_objectives')
        .select('*')
        .eq('plan_id', planId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setObjectives(prev => {
        const filtered = prev.filter(obj => obj.plan_id !== planId);
        return [...filtered, ...(data || [])];
      });
      
      setCachedData(cacheKey, data || []);
      console.log('Objetivos carregados:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar objetivos:', error);
      return [];
    }
  }, []);

  // Função para buscar ações de forma otimizada
  const fetchActions = useCallback(async (objectiveId: string) => {
    const cacheKey = `actions_${objectiveId}`;
    const cachedActions = getCachedData(cacheKey);
    
    if (cachedActions) {
      setActions(prev => {
        const filtered = prev.filter(action => action.objective_id !== objectiveId);
        return [...filtered, ...cachedActions];
      });
      return cachedActions;
    }

    try {
      console.log('Buscando ações para o objetivo:', objectiveId);
      
      const { data, error } = await supabase
        .from('strategic_plan_actions')
        .select('*')
        .eq('objective_id', objectiveId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setActions(prev => {
        const filtered = prev.filter(action => action.objective_id !== objectiveId);
        return [...filtered, ...(data || [])];
      });
      
      setCachedData(cacheKey, data || []);
      console.log('Ações carregadas:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar ações:', error);
      return [];
    }
  }, []);

  // Limpar cache quando necessário
  const clearCache = useCallback((pattern?: string) => {
    if (pattern) {
      for (const key of dataCache.keys()) {
        if (key.includes(pattern)) {
          dataCache.delete(key);
        }
      }
    } else {
      dataCache.clear();
    }
  }, []);

  // CRUD Operations - mantendo a mesma interface mas otimizadas

  const createPlan = async (planData: {
    organization_id: string;
    name: string;
    description?: string;
    duration: number;
    start_date: string;
    status: string;
    progress: number;
    mission?: string;
    vision?: string;
    values?: string[];
  }) => {
    try {
      console.log('Criando plano:', planData);
      
      const { data, error } = await supabase
        .from('strategic_plans')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;

      console.log('Plano criado com sucesso:', data);
      toast({
        title: "Sucesso",
        description: "Planejamento criado com sucesso",
      });

      // Limpar cache e refetch
      clearCache(`plans_${planData.organization_id}`);
      setTimeout(() => debouncedFetch(planData.organization_id), 100);

      return data;
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar planejamento",
        variant: "destructive",
      });
      return null;
    }
  };

  const updatePlan = async (id: string, planData: Partial<StrategicPlan>) => {
    try {
      console.log('Atualizando plano:', id, planData);
      
      const { data, error } = await supabase
        .from('strategic_plans')
        .update(planData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Planejamento atualizado com sucesso",
      });

      // Limpar cache e refetch
      if (organizationId) {
        clearCache(`plans_${organizationId}`);
        setTimeout(() => debouncedFetch(organizationId), 100);
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar planejamento",
        variant: "destructive",
      });
      return null;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      console.log('Excluindo plano:', id);
      
      const { error } = await supabase
        .from('strategic_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Planejamento excluído com sucesso",
      });

      // Limpar cache e refetch
      if (organizationId) {
        clearCache(`plans_${organizationId}`);
        setTimeout(() => debouncedFetch(organizationId), 100);
      }

      return true;
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir planejamento",
        variant: "destructive",
      });
      return false;
    }
  };

  const createObjective = async (objectiveData: Omit<StrategicPlanObjective, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Criando objetivo:', objectiveData);
      
      const { data, error } = await supabase
        .from('strategic_plan_objectives')
        .insert([objectiveData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Objetivo criado com sucesso",
      });
      
      clearCache(`objectives_${objectiveData.plan_id}`);
      return data;
    } catch (error) {
      console.error('Erro ao criar objetivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar objetivo",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateObjective = async (id: string, objectiveData: Partial<StrategicPlanObjective>) => {
    try {
      console.log('Atualizando objetivo:', id, objectiveData);
      
      const { data, error } = await supabase
        .from('strategic_plan_objectives')
        .update(objectiveData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Objetivo atualizado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar objetivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar objetivo",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteObjective = async (id: string, planId: string) => {
    try {
      console.log('Excluindo objetivo:', id);
      
      const { error } = await supabase
        .from('strategic_plan_objectives')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Objetivo excluído com sucesso",
      });

      clearCache(`objectives_${planId}`);
      return true;
    } catch (error) {
      console.error('Erro ao excluir objetivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir objetivo",
        variant: "destructive",
      });
      return false;
    }
  };

  const createAction = async (actionData: Omit<StrategicPlanAction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Criando ação:', actionData);
      
      const { data, error } = await supabase
        .from('strategic_plan_actions')
        .insert([actionData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ação criada com sucesso",
      });
      
      clearCache(`actions_${actionData.objective_id}`);
      return data;
    } catch (error) {
      console.error('Erro ao criar ação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar ação",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAction = async (id: string, actionData: Partial<StrategicPlanAction>) => {
    try {
      console.log('Atualizando ação:', id, actionData);
      
      const { data, error } = await supabase
        .from('strategic_plan_actions')
        .update(actionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ação atualizada com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar ação:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ação",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAction = async (id: string, objectiveId: string) => {
    try {
      console.log('Excluindo ação:', id);
      
      const { error } = await supabase
        .from('strategic_plan_actions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ação excluída com sucesso",
      });

      clearCache(`actions_${objectiveId}`);
      return true;
    } catch (error) {
      console.error('Erro ao excluir ação:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir ação",
        variant: "destructive",
      });
      return false;
    }
  };

  const createTeamMember = async (memberData: Omit<StrategicPlanTeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Criando membro da equipe:', memberData);
      
      const { data, error } = await supabase
        .from('strategic_plan_team_members')
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Membro da equipe adicionado com sucesso",
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao adicionar membro da equipe:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar membro da equipe",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTeamMember = async (id: string, memberData: Partial<StrategicPlanTeamMember>) => {
    try {
      console.log('Atualizando membro da equipe:', id, memberData);
      
      const { data, error } = await supabase
        .from('strategic_plan_team_members')
        .update(memberData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Membro da equipe atualizado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar membro da equipe:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar membro da equipe",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTeamMember = async (id: string, planId: string) => {
    try {
      console.log('Excluindo membro da equipe:', id);
      
      const { error } = await supabase
        .from('strategic_plan_team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Membro da equipe removido com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Erro ao remover membro da equipe:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover membro da equipe",
        variant: "destructive",
      });
      return false;
    }
  };

  // Cleanup function melhorada
  const cleanup = useCallback(() => {
    if (isCleaningUpRef.current) {
      console.log('⏳ Cleanup já em andamento, ignorando...');
      return;
    }
    
    isCleaningUpRef.current = true;
    console.log('🔄 Removendo canal real-time');
    
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
        console.log('✅ Canal removido com sucesso');
      } catch (error) {
        console.warn('⚠️ Erro ao remover canal:', error);
      }
      channelRef.current = null;
    }
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = undefined;
    }
    
    isSubscribedRef.current = false;
    currentOrgIdRef.current = undefined;
    isCleaningUpRef.current = false;
  }, []);

  // Effect principal - melhorado para evitar múltiplas subscriptions
  useEffect(() => {
    console.log('🔄 useStrategicPlanning useEffect executado:', { 
      organizationId, 
      loading,
      isSubscribed: isSubscribedRef.current,
      currentOrgId: currentOrgIdRef.current
    });
    
    if (!organizationId) {
      console.log('❌ Sem organização, limpando dados');
      setPlans([]);
      setObjectives([]);
      setActions([]);
      setTeamMembers([]);
      cleanup();
      return;
    }

    // Se a organização mudou, limpar subscription anterior
    if (currentOrgIdRef.current && currentOrgIdRef.current !== organizationId) {
      console.log('🔄 Organização mudou de', currentOrgIdRef.current, 'para', organizationId, '- limpando subscription anterior');
      cleanup();
    }

    currentOrgIdRef.current = organizationId;

    // Debounced fetch
    debouncedFetch(organizationId);

    // Setup realtime - apenas se não estiver já subscrito para esta organização
    if (!isSubscribedRef.current && !isCleaningUpRef.current) {
      console.log('🔔 Configurando subscription realtime para organização:', organizationId);
      
      try {
        const channelName = `strategic_planning_${organizationId}_${Date.now()}`;
        console.log('📡 Criando canal:', channelName);
        
        const channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'strategic_plans',
              filter: `organization_id=eq.${organizationId}`
            },
            (payload) => {
              console.log('🔄 Realtime: strategic_plans atualizado:', payload);
              clearCache(`plans_${organizationId}`);
              debouncedFetch(organizationId);
            }
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'strategic_plan_objectives'
            },
            (payload) => {
              console.log('🔄 Realtime: objectives atualizado:', payload);
              // Limpar cache relevante com verificação de tipo
              const newRecord = payload.new as any;
              const oldRecord = payload.old as any;
              
              if (newRecord && typeof newRecord === 'object' && 'plan_id' in newRecord) {
                clearCache(`objectives_${newRecord.plan_id}`);
              }
              if (oldRecord && typeof oldRecord === 'object' && 'plan_id' in oldRecord) {
                clearCache(`objectives_${oldRecord.plan_id}`);
              }
              if (organizationId) {
                clearCache(`plans_${organizationId}`);
                debouncedFetch(organizationId);
              }
            }
          );

        // Subscribe apenas uma vez com callback melhorado
        channel.subscribe((status, err) => {
          console.log('📡 Strategic planning channel status:', status, err ? `Error: ${err}` : '');
          
          if (status === 'SUBSCRIBED') {
            isSubscribedRef.current = true;
            channelRef.current = channel;
            console.log('✅ Subscription realtime configurada com sucesso para:', organizationId);
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Erro no canal realtime:', err);
            isSubscribedRef.current = false;
            channelRef.current = null;
          } else if (status === 'TIMED_OUT') {
            console.warn('⏰ Timeout no canal realtime');
            isSubscribedRef.current = false;
            channelRef.current = null;
          }
        });
        
      } catch (error) {
        console.error('❌ Erro ao configurar subscription realtime:', error);
        isSubscribedRef.current = false;
      }
    } else if (isSubscribedRef.current) {
      console.log('ℹ️ Subscription já configurada para organização:', organizationId);
    }

    return cleanup;
  }, [organizationId]); // Removendo dependências desnecessárias

  // Memoizar o retorno para evitar re-renders desnecessários
  const returnValue = useMemo(() => ({
    plans,
    objectives,
    actions,
    teamMembers,
    loading,
    error,
    fetchPlans: () => organizationId && debouncedFetch(organizationId),
    fetchObjectives,
    fetchActions,
    createPlan,
    updatePlan,
    deletePlan,
    createObjective,
    updateObjective,
    deleteObjective,
    createAction,
    updateAction,
    deleteAction,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    clearCache
  }), [
    plans,
    objectives, 
    actions,
    teamMembers,
    loading,
    error,
    organizationId,
    debouncedFetch,
    fetchObjectives,
    fetchActions,
    createPlan,
    updatePlan,
    deletePlan,
    createObjective,
    updateObjective,
    deleteObjective,
    createAction,
    updateAction,
    deleteAction,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    clearCache
  ]);

  console.log('📊 useStrategicPlanning retornando:', { 
    plansCount: plans.length, 
    loading, 
    error,
    organizationId,
    isSubscribed: isSubscribedRef.current
  });

  return returnValue;
}
