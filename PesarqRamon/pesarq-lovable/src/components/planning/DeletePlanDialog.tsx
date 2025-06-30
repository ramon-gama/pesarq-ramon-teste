
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useStrategicPlanning, StrategicPlan } from "@/hooks/useStrategicPlanning";
import { useState } from "react";

interface DeletePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  plan: StrategicPlan | null;
}

export function DeletePlanDialog({ open, onOpenChange, organizationId, plan }: DeletePlanDialogProps) {
  const { deletePlan } = useStrategicPlanning(organizationId);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!plan) return;

    setIsDeleting(true);
    
    try {
      await deletePlan(plan.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting plan:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Planejamento</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o planejamento "{plan?.name}"? 
            Esta ação não pode ser desfeita e todos os objetivos e membros da equipe associados também serão removidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
