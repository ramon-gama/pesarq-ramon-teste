
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface OrganizationInfo {
  name: string;
  acronym: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

interface OrganizationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: OrganizationInfo) => Promise<void>;
  currentData: OrganizationInfo;
}

export function OrganizationInfoModal({ isOpen, onClose, onSave, currentData }: OrganizationInfoModalProps) {
  const [formData, setFormData] = useState<OrganizationInfo>({
    name: '',
    acronym: '',
    cnpj: '',
    address: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Inicializar dados quando o modal abrir
  useEffect(() => {
    if (isOpen && !isInitialized) {
      console.log('OrganizationInfoModal: Modal opened, initializing with:', currentData);
      setFormData({
        name: currentData.name || '',
        acronym: currentData.acronym || '',
        cnpj: currentData.cnpj || '',
        address: currentData.address || '',
        phone: currentData.phone || '',
        email: currentData.email || ''
      });
      setIsInitialized(true);
    } else if (!isOpen) {
      // Reset quando fechar
      setIsInitialized(false);
    }
  }, [isOpen, currentData, isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da organização é obrigatório",
        variant: "destructive",
      });
      return;
    }

    console.log('OrganizationInfoModal: Submitting data:', formData);
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      console.log('OrganizationInfoModal: Data saved successfully');
      onClose();
    } catch (error) {
      console.error('OrganizationInfoModal: Error saving data:', error);
      // O toast de erro já é mostrado pelo hook useOrganization
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof OrganizationInfo, value: string) => {
    console.log(`OrganizationInfoModal: Changing ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    console.log('OrganizationInfoModal: Closing modal');
    setIsInitialized(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Informações da Organização</DialogTitle>
          <DialogDescription>
            Atualize as informações básicas da organização
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Ex: Ministério da Saúde"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acronym">Sigla</Label>
            <Input
              id="acronym"
              value={formData.acronym}
              onChange={(e) => handleFieldChange('acronym', e.target.value)}
              placeholder="Ex: MS"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => handleFieldChange('cnpj', e.target.value)}
              placeholder="00.000.000/0001-00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              placeholder="Endereço completo da organização"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="(00) 0000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="contato@organizacao.gov.br"
              />
            </div>
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
