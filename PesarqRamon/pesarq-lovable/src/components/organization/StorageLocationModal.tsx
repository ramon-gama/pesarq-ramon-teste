import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { StorageLocation } from "@/hooks/useStorageLocations";
interface StorageLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<StorageLocation, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate?: (id: string, data: Partial<StorageLocation>) => Promise<void>;
  organizationId: string;
  location?: StorageLocation | null;
  mode: 'create' | 'edit';
}
export function StorageLocationModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  organizationId,
  location,
  mode
}: StorageLocationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    responsible_person: '',
    capacity_percentage: 0,
    total_documents: 0,
    document_types: [] as string[],
    status: 'ativo' as 'ativo' | 'inativo' | 'manutencao'
  });
  const [newDocumentType, setNewDocumentType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (location && mode === 'edit') {
      setFormData({
        name: location.name,
        description: location.description || '',
        address: location.address || '',
        responsible_person: location.responsible_person || '',
        capacity_percentage: location.capacity_percentage,
        total_documents: location.total_documents,
        document_types: location.document_types || [],
        status: location.status
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        address: '',
        responsible_person: '',
        capacity_percentage: 0,
        total_documents: 0,
        document_types: [],
        status: 'ativo'
      });
    }
  }, [location, mode, isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'edit' && location && onUpdate) {
        await onUpdate(location.id, formData);
      } else {
        await onSave({
          ...formData,
          organization_id: organizationId
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving storage location:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const addDocumentType = () => {
    if (newDocumentType.trim() && !formData.document_types.includes(newDocumentType.trim())) {
      setFormData(prev => ({
        ...prev,
        document_types: [...prev.document_types, newDocumentType.trim()]
      }));
      setNewDocumentType('');
    }
  };
  const removeDocumentType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      document_types: prev.document_types.filter(t => t !== type)
    }));
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar Local de Armazenamento' : 'Novo Local de Armazenamento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))} placeholder="Nome do local" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'ativo' | 'inativo' | 'manutencao') => setFormData(prev => ({
              ...prev,
              status: value
            }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={formData.description} onChange={e => setFormData(prev => ({
            ...prev,
            description: e.target.value
          }))} placeholder="Descrição do local" rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" value={formData.address} onChange={e => setFormData(prev => ({
            ...prev,
            address: e.target.value
          }))} placeholder="Endereço completo" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Input id="responsible" value={formData.responsible_person} onChange={e => setFormData(prev => ({
            ...prev,
            responsible_person: e.target.value
          }))} placeholder="Nome do responsável" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade Utilizada (%)</Label>
              <Input id="capacity" type="number" min="0" max="100" value={formData.capacity_percentage} onChange={e => setFormData(prev => ({
              ...prev,
              capacity_percentage: parseInt(e.target.value) || 0
            }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documents">Total de Caixas Arquivo</Label>
              <Input id="documents" type="number" min="0" value={formData.total_documents} onChange={e => setFormData(prev => ({
              ...prev,
              total_documents: parseInt(e.target.value) || 0
            }))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipos de Documentos</Label>
            <div className="flex gap-2">
              <Input value={newDocumentType} onChange={e => setNewDocumentType(e.target.value)} placeholder="Adicionar tipo de documento" onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addDocumentType())} />
              <Button type="button" onClick={addDocumentType} variant="outline">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.document_types.map(type => <Badge key={type} variant="secondary" className="flex items-center gap-1">
                  {type}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeDocumentType(type)} />
                </Badge>)}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : mode === 'edit' ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}