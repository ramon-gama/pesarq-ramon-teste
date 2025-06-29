import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, User, AlertCircle, Edit, Trash2, UserCheck } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TaskEditModal } from "./TaskEditModal";
import { useTasks, Task, Column } from "@/hooks/useTasks";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { useAuth } from "@/hooks/useAuth";

function TaskCard({ task, onEdit, onDelete, currentUserId }: { 
  task: Task; 
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  currentUserId?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isCreatedByCurrentUser = task.created_by === currentUserId;

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    if ((e.target as Element).closest('[data-edit-button]') || 
        (e.target as Element).closest('[data-delete-button]') ||
        (e.target as Element).closest('[role="dialog"]')) {
      return;
    }
    onEdit(task);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 sm:p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow touch-manipulation group ${
        isDragging ? "opacity-50" : ""
      } ${isCreatedByCurrentUser ? "border-l-4 border-l-blue-500" : ""}`}
      onClick={handleCardClick}
    >
      <div 
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-manipulation"
      >
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-medium text-sm sm:text-base line-clamp-2 flex-1">{task.title}</h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              {isCreatedByCurrentUser && (
                <div className="flex items-center" title="Criada por você">
                  <UserCheck className="h-3 w-3 text-blue-600" />
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 opacity-70 group-hover:opacity-100 hover:bg-gray-100"
                onClick={handleEditClick}
                data-edit-button
              >
                <Edit className="h-3 w-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 opacity-70 group-hover:opacity-100 hover:bg-red-100 text-red-600"
                    onClick={handleDeleteClick}
                    data-delete-button
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a tarefa "{task.title}"? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
              </Badge>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{task.description}</p>
          
          <div className="flex flex-wrap gap-1">
            {task.labels?.map((label, index) => (
              <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                {label}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{task.assignee}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {task.created_by_name && (
            <div className="flex items-center gap-1 text-xs text-gray-400 border-t pt-2">
              <UserCheck className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">Criado por {task.created_by_name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ column, onEditTask, onAddTask, onDeleteTask, currentUserId }: { 
  column: Column; 
  onEditTask: (task: Task) => void;
  onAddTask: (columnId: string) => void;
  onDeleteTask: (taskId: string) => void;
  currentUserId?: string;
}) {
  const { setNodeRef } = useSortable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 rounded-lg p-3 sm:p-4 min-w-72 sm:min-w-80 group"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900">{column.title}</h3>
          <Badge variant="secondary" className="text-xs">{column.tasks.length}</Badge>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 w-6 p-0"
          onClick={() => onAddTask(column.id)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 sm:space-y-3">
          {column.tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export function TasksTracking() {
  const { currentOrganization, loading: contextLoading } = useOrganizationContext();
  const { user, isAuthenticated } = useAuth();
  const { columns, isLoading, createTask, updateTask, deleteTask, moveTask } = useTasks(currentOrganization?.id);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = columns
      .flatMap(col => col.tasks)
      .find(task => task.id === active.id);
    
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = active.id as string;
    
    let destinationColumnId = over.id as string;
    
    const targetTask = columns.flatMap(col => col.tasks).find(task => task.id === over.id);
    if (targetTask) {
      const targetColumn = columns.find(col => col.tasks.some(task => task.id === over.id));
      if (targetColumn) {
        destinationColumnId = targetColumn.id;
      }
    }

    const sourceColumn = columns.find(col => 
      col.tasks.some(task => task.id === activeTaskId)
    );
    
    const destinationColumn = columns.find(col => col.id === destinationColumnId);

    if (!sourceColumn || !destinationColumn) return;

    if (sourceColumn.id !== destinationColumn.id) {
      moveTask(activeTaskId, destinationColumn.id);
    }
  };

  const handleEditTask = (task: Task) => {
    console.log('✏️ Opening edit modal for task:', task);
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleAddTask = (columnId?: string) => {
    console.log('➕ Adding new task for column:', columnId);
    
    if (!isAuthenticated) {
      console.warn('⚠️ User not authenticated');
      return;
    }

    if (!currentOrganization) {
      console.warn('⚠️ Cannot add task: no organization selected');
      return;
    }

    const targetColumnId = columnId || "todo";
    const newTask: Task = {
      id: '',
      title: "",
      description: "",
      assignee: "",
      due_date: new Date().toISOString().split('T')[0],
      priority: "medium",
      labels: [],
      column_id: targetColumnId,
      organization_id: currentOrganization.id
    };
    
    console.log('🆕 Creating new task template:', newTask);
    setEditingTask(newTask);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      console.log('💾 Saving task:', updatedTask);
      
      if (!updatedTask.id) {
        // Creating new task
        const result = await createTask(updatedTask);
        if (result) {
          console.log('✅ Task created successfully');
          setEditingTask(null);
          setIsEditModalOpen(false);
        }
      } else {
        // Updating existing task
        const result = await updateTask(updatedTask.id, updatedTask);
        if (result) {
          console.log('✅ Task updated successfully');
          setEditingTask(null);
          setIsEditModalOpen(false);
        }
      }
    } catch (error) {
      console.error('💥 Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log('🗑️ Deleting task:', taskId);
      await deleteTask(taskId);
    } catch (error) {
      console.error('💥 Error deleting task:', error);
    }
  };

  const handleMoveTask = async (taskId: string, newColumnId: string) => {
    try {
      console.log('🔄 Moving task:', taskId, 'to column:', newColumnId);
      await moveTask(taskId, newColumnId);
    } catch (error) {
      console.error('💥 Error moving task:', error);
    }
  };

  const getCurrentColumnId = (task: Task | null) => {
    if (!task) return undefined;
    return task.column_id;
  };

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Acesso Negado
            </h3>
            <p className="text-yellow-700">
              Você precisa estar logado para acessar o gerenciamento de tarefas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (contextLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando organização...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Nenhuma organização selecionada
            </h3>
            <p className="text-yellow-700">
              Selecione uma organização para visualizar e gerenciar as tarefas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando tarefas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            Gestão de Tarefas
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Sistema Kanban para gestão de atividades - {currentOrganization.name}
          </p>
        </div>
        <Button 
          className="flex items-center gap-2 self-start"
          onClick={() => handleAddTask()}
        >
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {columns.reduce((acc, col) => acc + col.tasks.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {columns.find(col => col.id === "inprogress")?.tasks.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {columns.find(col => col.id === "done")?.tasks.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Atrasadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {columns
                .flatMap(col => col.tasks)
                .filter(task => new Date(task.due_date) < new Date() && task.column_id !== 'done')
                .length}
            </div>
          </CardContent>
        </Card>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4">
          <SortableContext items={columns.map(col => col.id)} strategy={verticalListSortingStrategy}>
            {columns.map((column) => (
              <KanbanColumn 
                key={column.id} 
                column={column} 
                onEditTask={handleEditTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                currentUserId={user?.id}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard 
              task={activeTask} 
              onEdit={() => {}} 
              onDelete={() => {}}
              currentUserId={user?.id}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskEditModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => {
          console.log('❌ Closing task edit modal');
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        onMove={handleMoveTask}
        onDelete={handleDeleteTask}
        columns={columns}
        currentColumnId={getCurrentColumnId(editingTask)}
      />
    </div>
  );
}
