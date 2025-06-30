import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task, CreateTaskData, UpdateTaskData } from "./types";
import { fetchUserName } from "./useUserName";

export function useTaskOperations() {
  const { toast } = useToast();

  const createTask = async (taskData: CreateTaskData): Promise<Task | null> => {
    try {
      console.log('➕ Creating task:', taskData);
      
      // Get current user first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('❌ User not authenticated:', userError);
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para criar tarefas",
          variant: "destructive"
        });
        return null;
      }

      console.log('👤 Current user:', user.id);

      // Buscar o perfil do usuário na tabela user_profiles
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, organization_id, role')
        .eq('id', user.id)
        .single();

      if (profileError || !userProfile) {
        console.error('❌ User profile not found:', profileError);
        toast({
          title: "Erro",
          description: "Perfil de usuário não encontrado. Entre em contato com o administrador.",
          variant: "destructive"
        });
        return null;
      }

      console.log('👤 User profile:', userProfile);

      // Test both security functions for debugging
      const { data: securityFunctionResult, error: securityError } = await supabase
        .rpc('get_current_user_organization_id');

      const { data: isAdminResult, error: adminError } = await supabase
        .rpc('is_unb_admin');

      console.log('🔒 Security function results:', {
        userOrgId: securityFunctionResult,
        isAdmin: isAdminResult,
        securityError,
        adminError
      });

      // Validate organization_id
      if (!taskData.organization_id) {
        console.error('❌ Cannot create task: No organization_id provided');
        toast({
          title: "Erro",
          description: "Selecione uma organização para criar a tarefa",
          variant: "destructive"
        });
        return null;
      }

      // Minimal validation - only check for column_id
      if (!taskData.column_id) {
        console.error('❌ Cannot create task: No column_id provided');
        toast({
          title: "Erro",
          description: "Coluna da tarefa é obrigatória",
          variant: "destructive"
        });
        return null;
      }

      // Prepare task data with defaults for ALL missing fields
      const taskToInsert = {
        title: taskData.title?.trim() || 'Nova Tarefa',
        description: taskData.description?.trim() || '',
        assignee: taskData.assignee?.trim() || 'Não atribuído',
        due_date: taskData.due_date || new Date().toISOString().split('T')[0],
        priority: taskData.priority || 'medium',
        labels: Array.isArray(taskData.labels) ? taskData.labels : [],
        column_id: taskData.column_id,
        organization_id: taskData.organization_id,
        created_by: userProfile.id
      };

      console.log('📝 Task data to insert:', taskToInsert);

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskToInsert])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error creating task:', error);
        
        toast({
          title: "Erro",
          description: `Erro ao criar tarefa: ${error.message}`,
          variant: "destructive"
        });
        return null;
      }

      console.log('✅ Task created successfully:', data);

      // Fetch creator name
      const createdByName = await fetchUserName(userProfile.id);
      console.log('🏷️ Final created_by_name:', createdByName);

      const newTask: Task = {
        ...data,
        labels: Array.isArray(data.labels) ? data.labels : [],
        created_by_name: createdByName
      };

      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso"
      });

      return newTask;
    } catch (error: any) {
      console.error('💥 Error creating task:', error);
      toast({
        title: "Erro",
        description: `Não foi possível criar a tarefa: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateTask = async (taskId: string, updates: UpdateTaskData): Promise<Task | null> => {
    try {
      console.log('🔄 Updating task:', taskId, updates);

      if (!taskId) {
        console.error('❌ Cannot update task: No task ID provided');
        toast({
          title: "Erro",
          description: "ID da tarefa é obrigatório",
          variant: "destructive"
        });
        return null;
      }

      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title.trim();
      if (updates.description !== undefined) updateData.description = updates.description.trim();
      if (updates.assignee !== undefined) updateData.assignee = updates.assignee.trim();
      if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.labels !== undefined) updateData.labels = updates.labels;
      if (updates.column_id !== undefined) updateData.column_id = updates.column_id;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating task:', error);
        toast({
          title: "Erro",
          description: `Erro ao atualizar tarefa: ${error.message}`,
          variant: "destructive"
        });
        return null;
      }

      console.log('✅ Task updated successfully:', data);

      const updatedTask: Task = {
        ...data,
        labels: Array.isArray(data.labels) ? data.labels : []
      };

      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso"
      });

      return updatedTask;
    } catch (error: any) {
      console.error('💥 Error updating task:', error);
      toast({
        title: "Erro",
        description: `Não foi possível atualizar a tarefa: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting task:', taskId);

      if (!taskId) {
        console.error('❌ Cannot delete task: No task ID provided');
        toast({
          title: "Erro",
          description: "ID da tarefa é obrigatório",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('❌ Error deleting task:', error);
        toast({
          title: "Erro",
          description: `Erro ao excluir tarefa: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      console.log('✅ Task deleted successfully');

      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso"
      });

      return true;
    } catch (error: any) {
      console.error('💥 Error deleting task:', error);
      toast({
        title: "Erro",
        description: `Não foi possível excluir a tarefa: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    createTask,
    updateTask,
    deleteTask
  };
}
