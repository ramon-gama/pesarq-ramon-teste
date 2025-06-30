
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useResearchers } from "@/hooks/useResearchers";
import { useAttendanceControl, type AttendanceRecord } from "@/hooks/useAttendanceControl";

interface AttendanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord?: AttendanceRecord | null;
}

export function AttendanceForm({ isOpen, onClose, editingRecord }: AttendanceFormProps) {
  const { activeResearchers } = useResearchers();
  const { createAttendanceRecord, updateAttendanceRecord } = useAttendanceControl();
  
  const [formData, setFormData] = useState({
    researcher_id: "",
    date: new Date().toISOString().split('T')[0],
    shift: "manha" as "manha" | "tarde",
    status: "presente" as "presente" | "falta" | "parcial",
    hours_worked: 0,
    hours_expected: 0,
    justification: "",
    observations: "",
    is_medical_leave: false
  });

  const [submitting, setSubmitting] = useState(false);

  // Reset form when editing record changes
  useEffect(() => {
    if (editingRecord) {
      setFormData({
        researcher_id: editingRecord.researcher_id,
        date: editingRecord.date,
        shift: editingRecord.shift,
        status: editingRecord.status,
        hours_worked: editingRecord.hours_worked,
        hours_expected: editingRecord.hours_expected,
        justification: editingRecord.justification || "",
        observations: editingRecord.observations || "",
        is_medical_leave: false // Este campo não existe no record atual, assumindo false
      });
    } else {
      setFormData({
        researcher_id: "",
        date: new Date().toISOString().split('T')[0],
        shift: "manha",
        status: "presente",
        hours_worked: 0,
        hours_expected: 0,
        justification: "",
        observations: "",
        is_medical_leave: false
      });
    }
  }, [editingRecord, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.researcher_id) {
      return;
    }

    // Validação: falta ou parcial deve ter justificativa
    if ((formData.status === 'falta' || formData.status === 'parcial') && !formData.justification.trim()) {
      alert('Justificativa é obrigatória para faltas ou presenças parciais');
      return;
    }

    setSubmitting(true);
    
    try {
      const dataToSave = {
        researcher_id: formData.researcher_id,
        date: formData.date,
        shift: formData.shift,
        status: formData.status,
        hours_worked: formData.hours_worked,
        hours_expected: formData.hours_expected,
        justification: formData.justification,
        observations: formData.observations,
        created_by: 'Sistema' // Aqui poderia vir do contexto de usuário
      };

      if (editingRecord) {
        await updateAttendanceRecord(editingRecord.id, dataToSave);
      } else {
        await createAttendanceRecord(dataToSave);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedResearcher = activeResearchers.find(r => r.id === formData.researcher_id);

  const handleResearcherChange = (researcherId: string) => {
    const researcher = activeResearchers.find(r => r.id === researcherId);
    setFormData(prev => ({
      ...prev,
      researcher_id: researcherId,
      hours_expected: researcher?.workload || 4,
      hours_worked: prev.status === 'presente' ? (researcher?.workload || 4) : 
                   prev.status === 'falta' ? 0 : prev.hours_worked
    }));
  };

  const handleStatusChange = (status: "presente" | "falta" | "parcial") => {
    setFormData(prev => ({
      ...prev,
      status,
      hours_worked: status === 'presente' ? prev.hours_expected :
                   status === 'falta' ? 0 : prev.hours_worked,
      justification: status === 'presente' ? '' : prev.justification,
      is_medical_leave: status !== 'falta' ? false : prev.is_medical_leave
    }));
  };

  const handleShiftChange = (shift: "manha" | "tarde") => {
    setFormData(prev => ({
      ...prev,
      shift
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingRecord ? 'Editar Registro de Frequência' : 'Novo Registro de Frequência'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="researcher">Pesquisador *</Label>
            <Select
              value={formData.researcher_id}
              onValueChange={handleResearcherChange}
              disabled={!!editingRecord} // Não permite alterar pesquisador ao editar
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pesquisador" />
              </SelectTrigger>
              <SelectContent>
                {activeResearchers.map((researcher) => (
                  <SelectItem key={researcher.id} value={researcher.id}>
                    {researcher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                disabled={!!editingRecord} // Não permite alterar data ao editar
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Turno *</Label>
              <Select
                value={formData.shift}
                onValueChange={handleShiftChange}
                disabled={!!editingRecord} // Não permite alterar turno ao editar
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manha">Manhã</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presente">Presente</SelectItem>
                <SelectItem value="falta">Falta</SelectItem>
                <SelectItem value="parcial">Parcial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours_expected">Horas Esperadas</Label>
              <Input
                id="hours_expected"
                type="number"
                min="0"
                step="0.5"
                value={formData.hours_expected}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  hours_expected: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours_worked">Horas Trabalhadas</Label>
              <Input
                id="hours_worked"
                type="number"
                min="0"
                step="0.5"
                value={formData.hours_worked}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  hours_worked: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0"
                disabled={formData.status === 'falta'}
              />
            </div>
          </div>

          {formData.status === 'falta' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medical-leave"
                  checked={formData.is_medical_leave}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_medical_leave: !!checked }))
                  }
                />
                <Label htmlFor="medical-leave" className="text-sm">
                  Falta por motivos médicos (não requer compensação de horas)
                </Label>
              </div>
            </div>
          )}

          {(formData.status === 'falta' || formData.status === 'parcial') && (
            <div className="space-y-2">
              <Label htmlFor="justification">
                Justificativa *
                {formData.status === 'falta' && formData.is_medical_leave && (
                  <span className="text-green-600 text-xs ml-2">
                    (Atestado médico - sem compensação de horas)
                  </span>
                )}
              </Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
                placeholder={
                  formData.status === 'falta' 
                    ? "Motivo da falta..." 
                    : "Motivo da presença parcial..."
                }
                rows={3}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Observações adicionais..."
              rows={2}
            />
          </div>

          {selectedResearcher && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium">{selectedResearcher.name}</p>
              <p className="text-xs text-gray-600">
                Carga horária: {selectedResearcher.workload || 0}h/semana | {selectedResearcher.modality}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Salvando...' : editingRecord ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
