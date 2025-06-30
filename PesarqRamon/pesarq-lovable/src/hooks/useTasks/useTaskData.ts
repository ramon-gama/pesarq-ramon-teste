
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task, Column } from "./types";
import { fetchUserName } from "./useUserName";

export function useTaskData(organizationId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!organizationId) {
      console.log('⚠️ No organization ID provided for fetching tasks');
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching tasks for organization:', organizationId);
      setIsLoading(true);
      
      // Buscar tarefas primeiro
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('❌ Error fetching tasks:', tasksError);
        throw tasksError;
      }

      console.log('📋 Tasks fetched:', tasksData?.length || 0);

      // Para cada tarefa, buscar o nome completo do criador
      const tasksWithCreators = await Promise.all(
        (tasksData || []).map(async (task) => {
          let createdByName = 'Usuário desconhecido';
          
          if (task.created_by) {
            console.log('🔍 Getting name for user:', task.created_by);
            createdByName = await fetchUserName(task.created_by);
            console.log('🏷️ Final name for task:', task.id, ':', createdByName);
          }

          return {
            ...task,
            labels: Array.isArray(task.labels) ? task.labels : [],
            organization_id: task.organization_id || organizationId,
            created_by_name: createdByName
          };
        })
      );

      console.log('✅ Tasks with creator names:', tasksWithCreators.map(t => ({
        id: t.id,
        title: t.title,
        created_by: t.created_by,
        created_by_name: t.created_by_name
      })));

      setTasks(tasksWithCreators);
    } catch (error) {
      console.error('💥 Error fetching tasks:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tarefas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchTasks();
    } else {
      setTasks([]);
      setIsLoading(false);
    }
  }, [organizationId]);

  return {
    tasks,
    setTasks,
    isLoading,
    refetchTasks: fetchTasks
  };
}
