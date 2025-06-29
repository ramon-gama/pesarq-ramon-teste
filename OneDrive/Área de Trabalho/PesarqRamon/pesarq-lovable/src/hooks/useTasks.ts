import { useTaskData } from "./useTasks/useTaskData";
import { useTaskOperations } from "./useTasks/useTaskOperations";
import { useTaskColumns } from "./useTasks/useTaskColumns";
import { Task, Column, CreateTaskData } from "./useTasks/types";

export type { Task, Column };

export function useTasks(organizationId?: string) {
  const { tasks, setTasks, isLoading, refetchTasks } = useTaskData(organizationId);
  const { createTask: createTaskOp, updateTask: updateTaskOp, deleteTask: deleteTaskOp } = useTaskOperations();
  const columns = useTaskColumns(tasks);

  const createTask = async (taskData: CreateTaskData) => {
    if (!organizationId) {
      console.error('❌ Cannot create task: No organization ID provided');
      return;
    }

    // Ensure organization_id and column_id are set - minimal validation
    const taskWithOrgId = {
      ...taskData,
      organization_id: organizationId,
      column_id: taskData.column_id || 'todo' // Default to 'todo' if no column specified
    };

    console.log('🚀 Creating task with minimal validation:', taskWithOrgId);

    const newTask = await createTaskOp(taskWithOrgId);

    if (newTask) {
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!organizationId) {
      console.error('❌ Cannot update task: No organization ID provided');
      return;
    }

    if (!taskId) {
      console.error('❌ Cannot update task: No task ID provided');
      return;
    }

    const updatedTask = await updateTaskOp(taskId, updates);

    if (updatedTask) {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!organizationId) {
      console.error('❌ Cannot delete task: No organization ID provided');
      return;
    }

    if (!taskId) {
      console.error('❌ Cannot delete task: No task ID provided');
      return;
    }

    const success = await deleteTaskOp(taskId);

    if (success) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const moveTask = async (taskId: string, newColumnId: string) => {
    try {
      console.log('🔄 Moving task:', taskId, 'to column:', newColumnId);
      
      if (!taskId || !newColumnId) {
        console.error('❌ Cannot move task: Missing task ID or column ID');
        return;
      }

      await updateTask(taskId, { column_id: newColumnId });
    } catch (error) {
      console.error('💥 Error moving task:', error);
    }
  };

  return {
    tasks,
    columns,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    refetchTasks
  };
}
