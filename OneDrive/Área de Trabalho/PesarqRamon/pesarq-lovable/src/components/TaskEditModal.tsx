
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Save, X, MoveRight, Trash2 } from "lucide-react";
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
import { Task, Column } from "@/hooks/useTasks";

interface TaskEditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onMove?: (taskId: string, newColumnId: string) => void;
  onDelete?: (taskId: string) => void;
  columns?: Column[];
  currentColumnId?: string;
}

export function TaskEditModal({ 
  task, 
  isOpen, 
  onClose, 
  onSave, 
  onMove, 
  onDelete,
  columns = [], 
  currentColumnId 
}: TaskEditModalProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    if (task && task.id) {
      // Editando tarefa existente - preencher com dados da tarefa
      setEditedTask({ ...task });
    } else if (isOpen) {
      // Criando nova tarefa - campos vazios
      setEditedTask({
        id: "",
        title: "",
        description: "",
        assignee: "",
        due_date: "",
        priority: "medium",
        labels: [],
        column_id: currentColumnId || "",
        organization_id: "",
        created_by: "",
        created_by_name: "",
        created_at: "",
        updated_at: ""
      });
    }
  }, [task, isOpen, currentColumnId]);

  if (!editedTask) return null;

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask);
      onClose();
    }
  };

  const handleMove = (newColumnId: string) => {
    if (onMove && task?.id) {
      onMove(task.id, newColumnId);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete && task?.id) {
      onDelete(task.id);
      onClose();
    }
  };

  const addLabel = () => {
    if (newLabel.trim() && editedTask) {
      setEditedTask({
        ...editedTask,
        labels: [...(editedTask.labels || []), newLabel.trim()]
      });
      setNewLabel("");
    }
  };

  const removeLabel = (labelToRemove: string) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        labels: (editedTask.labels || []).filter(label => label !== labelToRemove)
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const isNewTask = !task?.id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isNewTask ? 'Nova Tarefa' : 'Editar Tarefa'}
          </DialogTitle>
          <DialogDescription>
            {isNewTask ? 'Crie uma nova tarefa' : 'Faça as alterações necessárias na tarefa'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Título</Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              placeholder="Digite o título da tarefa..."
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Descrição</Label>
            <Textarea
              id="description"
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              placeholder="Descreva a tarefa..."
              className="text-sm min-h-20"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee" className="text-sm font-medium">Responsável</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="assignee"
                  value={editedTask.assignee}
                  onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                  placeholder="Nome do responsável..."
                  className="pl-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">Data de Entrega</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="dueDate"
                  type="date"
                  value={editedTask.due_date}
                  onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">Prioridade</Label>
            <Select 
              value={editedTask.priority} 
              onValueChange={(value: "high" | "medium" | "low") => 
                setEditedTask({ ...editedTask, priority: value })
              }
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Selecione a prioridade..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high" className={getPriorityColor("high")}>Alta</SelectItem>
                <SelectItem value="medium" className={getPriorityColor("medium")}>Média</SelectItem>
                <SelectItem value="low" className={getPriorityColor("low")}>Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {onMove && columns.length > 0 && !isNewTask && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Mover para Coluna</Label>
              <div className="grid grid-cols-2 gap-2">
                {columns.map((column) => (
                  <Button
                    key={column.id}
                    variant={currentColumnId === column.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMove(column.id)}
                    disabled={currentColumnId === column.id}
                    className="text-xs"
                  >
                    <MoveRight className="h-3 w-3 mr-1" />
                    {column.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Etiquetas</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(editedTask.labels || []).map((label, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-2 py-1 cursor-pointer hover:bg-red-100"
                  onClick={() => removeLabel(label)}
                >
                  {label}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Nova etiqueta..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLabel()}
                className="text-sm flex-1"
              />
              <Button size="sm" onClick={addLabel} variant="outline">
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1 sm:flex-none">
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          {!isNewTask && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1 sm:flex-none">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a tarefa "{editedTask.title}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
