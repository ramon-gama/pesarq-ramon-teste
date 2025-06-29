
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useStrategicPlanning, StrategicPlanObjective } from "@/hooks/useStrategicPlanning";

interface CreateObjectiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  editingObjective?: StrategicPlanObjective | null;
}

export function CreateObjectiveModal({ open, onOpenChange, planId, editingObjective }: CreateObjectiveModalProps) {
  const { createObjective, updateObjective } = useStrategicPlanning();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  useEffect(() => {
    if (editingObjective && open) {
      setFormData({
        title: editingObjective.title,
        description: editingObjective.description || "",
        startDate: editingObjective.start_date ? new Date(editingObjective.start_date) : null,
        endDate: editingObjective.end_date ? new Date(editingObjective.end_date) : null,
      });
    } else if (!editingObjective && open) {
      setFormData({
        title: "",
        description: "",
        startDate: null,
        endDate: null,
      });
    }
  }, [editingObjective, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const objectiveData = {
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null,
        end_date: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : null,
        status: editingObjective?.status || 'in_progress',
        progress: editingObjective?.progress || 0,
        completed: editingObjective?.completed || false,
        plan_id: planId
      };

      if (editingObjective) {
        await updateObjective(editingObjective.id, objectiveData);
      } else {
        await createObjective(objectiveData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving objective:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {editingObjective ? "Editar Objetivo" : "Novo Objetivo Estratégico"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {editingObjective ? "Edite as informações do objetivo" : "Crie um novo objetivo estratégico. O controle detalhado será feito através das ações."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm">Título do Objetivo *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Digitalizar acervo histórico"
              required
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva o objetivo estratégico"
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate" className="text-sm">Data de Início</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate || undefined}
                    onSelect={(date) => {
                      setFormData({...formData, startDate: date || null});
                      setStartDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="endDate" className="text-sm">Data de Término</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate || undefined}
                    onSelect={(date) => {
                      setFormData({...formData, endDate: date || null});
                      setEndDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-sm">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#15AB92] hover:bg-[#0d8f7a] text-sm" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : editingObjective ? "Salvar Alterações" : "Criar Objetivo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
