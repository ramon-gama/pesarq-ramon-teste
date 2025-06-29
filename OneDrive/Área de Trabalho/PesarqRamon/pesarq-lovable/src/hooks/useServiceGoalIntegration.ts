
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizationContext } from '@/contexts/OrganizationContext';
import { useOrganizationUnbProjects } from './useOrganizationUnbProjects';

// Mapeamento entre tipos de serviços e tipos de escopo físico das metas
const SERVICE_TO_GOAL_MAPPING = {
  'classificacao': 'Classificação',
  'digitalizacao': 'Digitalização', 
  'descricao': 'Descrição',
  'arranjo': 'Arranjo',
  'higienizacao': 'Higienização',
  'acondicionamento': 'Acondicionamento'
};

export function useServiceGoalIntegration() {
  const { currentOrganization } = useOrganizationContext();
  const { projects, updateGoal } = useOrganizationUnbProjects();

  // Função para atualizar progresso da meta baseado nos serviços
  const updateGoalProgressFromServices = async (serviceType: string, quantity: number = 1) => {
    if (!currentOrganization?.id) return;

    console.log('🔄 Atualizando progresso da meta para serviço:', serviceType, 'quantidade:', quantity);

    try {
      // Buscar projetos ativos da organização
      const activeProjects = projects.filter(p => p.status === 'andamento');

      for (const project of activeProjects) {
        if (!project.goals) continue;

        // Buscar metas que têm escopo físico relacionado ao tipo de serviço
        for (const goal of project.goals) {
          if (!goal.physical_scope) continue;

          const relatedScope = goal.physical_scope.find(scope => 
            scope.service_type === SERVICE_TO_GOAL_MAPPING[serviceType as keyof typeof SERVICE_TO_GOAL_MAPPING]
          );

          if (relatedScope) {
            console.log('📊 Meta encontrada para atualizar:', goal.id, goal.number);

            // Atualizar quantidade atual
            const newCurrentQuantity = relatedScope.current_quantity + quantity;
            
            // Atualizar no banco de dados
            const { error } = await supabase
              .from('organization_unb_goal_physical_scope')
              .update({ 
                current_quantity: newCurrentQuantity,
                updated_at: new Date().toISOString()
              })
              .eq('id', relatedScope.id);

            if (error) {
              console.error('❌ Erro ao atualizar escopo físico:', error);
              continue;
            }

            // Se o tipo de progresso for automático, recalcular o progresso da meta
            if (goal.progress_type === 'automatic') {
              const updatedPhysicalScope = goal.physical_scope.map(scope => 
                scope.id === relatedScope.id ? { ...scope, current_quantity: newCurrentQuantity } : scope
              );

              // Calcular novo progresso baseado no escopo físico
              const totalProgress = updatedPhysicalScope.reduce((sum, scope) => {
                const scopeProgress = scope.target_quantity > 0 ? (scope.current_quantity / scope.target_quantity) * 100 : 0;
                return sum + scopeProgress;
              }, 0);

              const newProgress = Math.min(100, Math.round(totalProgress / updatedPhysicalScope.length));

              // Atualizar progresso da meta
              await updateGoal(goal.id, { 
                progress: newProgress,
                physical_scope: updatedPhysicalScope
              });

              console.log('✅ Progresso da meta atualizado:', goal.number, 'para', newProgress + '%');
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao integrar serviço com metas:', error);
    }
  };

  // Função para registrar um serviço e atualizar as metas relacionadas
  const registerServiceAndUpdateGoals = async (serviceData: {
    type: string;
    target_sector: string;
    quantity?: number;
    description?: string;
  }) => {
    console.log('📝 Registrando serviço e atualizando metas:', serviceData);

    try {
      // Primeiro, registrar o serviço
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .insert([{
          organization_id: currentOrganization?.id,
          title: `Serviço de ${SERVICE_TO_GOAL_MAPPING[serviceData.type as keyof typeof SERVICE_TO_GOAL_MAPPING] || serviceData.type}`,
          type: serviceData.type,
          target_sector: serviceData.target_sector,
          description: serviceData.description || '',
          status: 'concluido',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0],
          responsible_person: 'Sistema',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (serviceError) {
        console.error('❌ Erro ao registrar serviço:', serviceError);
        throw serviceError;
      }

      console.log('✅ Serviço registrado:', service.id);

      // Depois, atualizar as metas relacionadas
      await updateGoalProgressFromServices(serviceData.type, serviceData.quantity || 1);

      return service;
    } catch (error) {
      console.error('❌ Erro ao registrar serviço e atualizar metas:', error);
      throw error;
    }
  };

  return {
    updateGoalProgressFromServices,
    registerServiceAndUpdateGoals,
    SERVICE_TO_GOAL_MAPPING
  };
}
