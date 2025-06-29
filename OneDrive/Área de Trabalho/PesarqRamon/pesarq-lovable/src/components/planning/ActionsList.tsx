
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateActionModal } from "./CreateActionModal";
import { ActionCard } from "./ActionCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useStrategicPlanning, StrategicPlanAction } from "@/hooks/useStrategicPlanning";

interface ActionsListProps {
  objectiveId: string;
}

export function ActionsList({ objectiveId }: ActionsListProps) {
  const { actions, fetchActions, deleteAction } = useStrategicPlanning();
  const [showActionModal, setShowActionModal] = useState(false);
  const [editingAction, setEditingAction] = useState<StrategicPlanAction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (objectiveId) {
      fetchActions(objectiveId);
    }
  }, [objectiveId, fetchActions]);

  const handleDeleteAction = async () => {
    if (actionToDelete) {
      await deleteAction(actionToDelete, objectiveId);
      setDeleteDialogOpen(false);
      setActionToDelete(null);
    }
  };

  const handleEditAction = (action: StrategicPlanAction) => {
    setEditingAction(action);
    setShowActionModal(true);
  };

  const handleDeleteClick = (actionId: string) => {
    setActionToDelete(actionId);
    setDeleteDialogOpen(true);
  };

  const objectiveActions = actions.filter(action => action.objective_id === objectiveId);

  if (objectiveActions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <Plus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>Nenhuma ação criada ainda</p>
          <p className="text-sm">Adicione ações para detalhar como este objetivo será alcançado</p>
        </div>
        <Button
          onClick={() => setShowActionModal(true)}
          className="bg-[#15AB92] hover:bg-[#0d8f7a]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Criar Primeira Ação
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">
            Ações ({objectiveActions.length})
          </h4>
          <Button
            onClick={() => setShowActionModal(true)}
            size="sm"
            className="bg-[#15AB92] hover:bg-[#0d8f7a]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Ação
          </Button>
        </div>

        <div className="grid gap-4">
          {objectiveActions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onEdit={handleEditAction}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      <CreateActionModal
        open={showActionModal}
        onOpenChange={(open) => {
          setShowActionModal(open);
          if (!open) setEditingAction(null);
        }}
        objectiveId={objectiveId}
        editingAction={editingAction}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Ação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAction}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
