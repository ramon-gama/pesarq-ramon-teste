
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArchiveSectorData } from "@/hooks/useArchiveSectorData";
import { useToast } from "@/hooks/use-toast";

interface ArchiveSectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ArchiveSectorData) => Promise<void>;
  currentData: ArchiveSectorData;
}

export function ArchiveSectorModal({ isOpen, onClose, onSave, currentData }: ArchiveSectorModalProps) {
  const [formData, setFormData] = useState<ArchiveSectorData>({
    manager: '',
    location: '',
    workingHours: '',
    teamSize: '',
    storageCapacity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Inicializar dados quando o modal abrir
  useEffect(() => {
    if (isOpen && !isInitialized) {
      console.log('ArchiveSectorModal: Modal opened, initializing with:', currentData);
      setFormData({
        manager: currentData.manager || '',
        location: currentData.location || '',
        workingHours: currentData.workingHours || '',
        teamSize: currentData.teamSize || '',
        storageCapacity: currentData.storageCapacity || ''
      });
      setIsInitialized(true);
    } else if (!isOpen) {
      // Reset quando fechar
      setIsInitialized(false);
    }
  }, [isOpen, currentData, isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.manager.trim()) {
      toast({
        title: "Erro",
        description: "Campo responsável é obrigatório",
        variant: "destructive",
      });
      return;
    }

    console.log('ArchiveSectorModal: Submitting data:', formData);
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      console.log('ArchiveSectorModal: Data saved successfully');
      onClose();
    } catch (error) {
      console.error('ArchiveSectorModal: Error saving data:', error);
      // O toast de erro já é mostrado pelo hook useArchiveSectorData
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof ArchiveSectorData, value: string) => {
    console.log(`ArchiveSectorModal: Changing ${field} to:`, value);
    setFormData(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  const handleClose = () => {
    console.log('ArchiveSectorModal: Closing modal');
    setIsInitialized(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Informações do Setor de Arquivo</DialogTitle>
          <DialogDescription>
            Atualize as informações do setor responsável pelo arquivo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manager">Responsável *</Label>
            <Input
              id="manager"
              value={formData.manager}
              onChange={(e) => handleFieldChange('manager', e.target.value)}
              placeholder="Ex: João Silva - Arquivista Chefe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="Ex: Subsolo, Bloco G - Sala 001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workingHours">Horário de Funcionamento</Label>
            <Input
              id="workingHours"
              value={formData.workingHours}
              onChange={(e) => handleFieldChange('workingHours', e.target.value)}
              placeholder="Ex: Segunda a Sexta: 8h às 18h"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamSize">Tamanho da Equipe</Label>
            <Input
              id="teamSize"
              value={formData.teamSize}
              onChange={(e) => handleFieldChange('teamSize', e.target.value)}
              placeholder="Ex: 5 colaboradores"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storageCapacity">Capacidade de Armazenamento</Label>
            <Input
              id="storageCapacity"
              value={formData.storageCapacity}
              onChange={(e) => handleFieldChange('storageCapacity', e.target.value)}
              placeholder="Ex: 10.000 caixas arquivo"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
