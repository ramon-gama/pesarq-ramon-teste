
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useStrategicPlanning, StrategicPlanAction } from "@/hooks/useStrategicPlanning";

interface CreateActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objectiveId: string;
  editingAction?: StrategicPlanAction | null;
}

export function CreateActionModal({ open, onOpenChange, objectiveId, editingAction }: CreateActionModalProps) {
  const { createAction, updateAction } = useStrategicPlanning();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsible_person: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    serviceType: "",
    targetMetric: "",
    progressType: "manual",
    progress: 0,
    status: "pending"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingAction && open) {
      setFormData({
        title: editingAction.title,
        description: editingAction.description || "",
        responsible_person: editingAction.responsible_person || "",
        startDate: editingAction.start_date ? new Date(editingAction.start_date) : null,
        endDate: editingAction.end_date ? new Date(editingAction.end_date) : null,
        serviceType: editingAction.service_type || "",
        targetMetric: editingAction.target_metric || "",
        progressType: editingAction.progress_type || "manual",
        progress: editingAction.progress || 0,
        status: editingAction.status || "pending"
      });
    } else if (!editingAction && open) {
      setFormData({
        title: "",
        description: "",
        responsible_person: "",
        startDate: null,
        endDate: null,
        serviceType: "",
        targetMetric: "",
        progressType: "manual",
        progress: 0,
        status: "pending"
      });
    }
  }, [editingAction, open]);

  const serviceTypes = [
    { value: "classification", label: "Classificação de Documentos" },
    { value: "digitization", label: "Digitalização" },
    { value: "lending", label: "Empréstimo de Documentos" },
    { value: "description", label: "Descrição Arquivística" },
    { value: "preservation", label: "Preservação" },
    { value: "consultation", label: "Consulta" },
    { value: "temporality", label: "Gestão de Temporalidade" },
    { value: "security", label: "Segurança da Informação" },
    { value: "training", label: "Capacitação" },
    { value: "other", label: "Outro" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.responsible_person) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const actionData = {
        title: formData.title,
        description: formData.description,
        responsible_person: formData.responsible_person,
        start_date: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null,
        end_date: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : null,
        service_type: formData.serviceType,
        target_metric: formData.targetMetric,
        progress_type: formData.progressType,
        progress: formData.progress,
        status: formData.status,
        current_value: editingAction?.current_value || 0,
        objective_id: objectiveId
      };

      if (editingAction) {
        await updateAction(editingAction.id, actionData);
      } else {
        await createAction(actionData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {editingAction ? "Editar Ação" : "Nova Ação"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {editingAction ? "Edite as informações da ação" : "Crie uma nova ação para o objetivo"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm">Título da Ação *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Aquisição de equipamentos de digitalização"
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
                placeholder="Descreva detalhadamente a ação"
                rows={3}
                className="text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="responsible_person" className="text-sm">Responsável *</Label>
                <Input
                  id="responsible_person"
                  value={formData.responsible_person}
                  onChange={(e) => setFormData({...formData, responsible_person: e.target.value})}
                  placeholder="Nome do responsável"
                  required
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-sm">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="delayed">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="progressType" className="text-sm">Tipo de Progresso</Label>
                <Select 
                  value={formData.progressType} 
                  onValueChange={(value) => setFormData({...formData, progressType: value})}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automático (baseado em serviços)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="progress" className="text-sm">Progresso (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                  placeholder="0"
                  className="text-sm"
                />
              </div>
            </div>

            {formData.progressType === "automatic" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="serviceType" className="text-sm">Tipo de Serviço</Label>
                  <Select 
                    value={formData.serviceType} 
                    onValueChange={(value) => setFormData({...formData, serviceType: value})}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Selecione o tipo de serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetMetric" className="text-sm">Meta Numérica</Label>
                  <Input
                    id="targetMetric"
                    type="number"
                    value={formData.targetMetric}
                    onChange={(e) => setFormData({...formData, targetMetric: e.target.value})}
                    placeholder="Ex: 1000"
                    className="text-sm"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm">Data de Início</Label>
                <Popover>
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
                      onSelect={(date) => setFormData({...formData, startDate: date || null})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="endDate" className="text-sm">Data de Término</Label>
                <Popover>
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
                      onSelect={(date) => setFormData({...formData, endDate: date || null})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-sm">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#15AB92] hover:bg-[#0d8f7a] text-sm" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : editingAction ? "Salvar Alterações" : "Criar Ação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
