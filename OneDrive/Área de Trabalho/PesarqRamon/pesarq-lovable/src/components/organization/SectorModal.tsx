
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingSector?: any;
  organizationId: string;
  sectors: any[];
}

export function SectorModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingSector, 
  organizationId, 
  sectors 
}: SectorModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    acronym: "",
    code: "",
    siorg_code: "",
    description: "",
    area_type: "",
    parent_sector_id: "",
    state: "",
    city: "",
    contact_email: "",
    contact_phone: "",
    status: "ativo"
  });

  useEffect(() => {
    if (editingSector) {
      console.log('SectorModal: Loading editing sector data:', editingSector);
      setFormData({
        name: editingSector.name || "",
        acronym: editingSector.acronym || "",
        code: editingSector.code || "",
        siorg_code: editingSector.siorg_code || "",
        description: editingSector.description || "",
        area_type: editingSector.area_type || "",
        parent_sector_id: editingSector.parent_sector_id || "",
        state: editingSector.state || "",
        city: editingSector.city || "",
        contact_email: editingSector.contact_email || "",
        contact_phone: editingSector.contact_phone || "",
        status: editingSector.status || "ativo"
      });
    } else {
      console.log('SectorModal: Resetting form for new sector');
      setFormData({
        name: "",
        acronym: "",
        code: "",
        siorg_code: "",
        description: "",
        area_type: "",
        parent_sector_id: "",
        state: "",
        city: "",
        contact_email: "",
        contact_phone: "",
        status: "ativo"
      });
    }
  }, [editingSector, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do setor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('SectorModal: Submitting form data:', formData);
      const dataToSave = {
        ...formData,
        organization_id: organizationId,
        parent_sector_id: formData.parent_sector_id || null,
      };
      
      await onSave(dataToSave);
      console.log('SectorModal: Form submitted successfully');
    } catch (error) {
      console.error('SectorModal: Error submitting form:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar setor",
        variant: "destructive",
      });
    }
  };

  // Filter parent sectors to exclude current sector and ensure valid values
  const parentSectorOptions = sectors
    .filter(sector => {
      // Exclude current sector if editing and ensure sector has valid id and name
      return sector.id && 
             sector.id.trim() !== "" && 
             sector.name && 
             sector.name.trim() !== "" &&
             (!editingSector || sector.id !== editingSector.id);
    })
    .map(sector => ({
      value: sector.id,
      label: sector.name
    }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSector ? 'Editar Setor' : 'Novo Setor'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do setor
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do setor"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="acronym">Sigla</Label>
              <Input
                id="acronym"
                value={formData.acronym}
                onChange={(e) => setFormData(prev => ({ ...prev, acronym: e.target.value }))}
                placeholder="Sigla do setor"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Código do setor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siorg_code">Código SIORG</Label>
              <Input
                id="siorg_code"
                value={formData.siorg_code}
                onChange={(e) => setFormData(prev => ({ ...prev, siorg_code: e.target.value }))}
                placeholder="Código SIORG"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do setor"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area_type">Tipo de Área</Label>
              <Select value={formData.area_type} onValueChange={(value) => setFormData(prev => ({ ...prev, area_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finalistica">Finalística</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_sector_id">Setor Pai</Label>
              <Select value={formData.parent_sector_id} onValueChange={(value) => setFormData(prev => ({ ...prev, parent_sector_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor pai" />
                </SelectTrigger>
                <SelectContent>
                  {parentSectorOptions.length > 0 ? (
                    parentSectorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      Nenhum setor disponível
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="Estado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Cidade"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email de Contato</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Telefone de Contato</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingSector ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
