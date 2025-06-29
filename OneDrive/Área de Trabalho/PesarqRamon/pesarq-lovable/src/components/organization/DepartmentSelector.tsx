
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useOrganizationSectors } from "@/hooks/useOrganizationSectors";
import { useToast } from "@/hooks/use-toast";

interface DepartmentSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  organizationId: string;
  sectors?: any[];
  onSectorCreated?: () => void;
}

export function DepartmentSelector({ 
  value, 
  onValueChange, 
  organizationId,
  sectors = [],
  onSectorCreated 
}: DepartmentSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSectorName, setNewSectorName] = useState("");
  const { createSector } = useOrganizationSectors(organizationId);
  const { toast } = useToast();

  const handleCreateSector = async () => {
    if (!newSectorName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do setor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSector({
        name: newSectorName.trim(),
        organization_id: organizationId,
        status: 'ativo'
      });
      
      setNewSectorName("");
      setIsDialogOpen(false);
      onValueChange(newSectorName.trim());
      
      if (onSectorCreated) {
        onSectorCreated();
      }
    } catch (error) {
      console.error('Erro ao criar setor:', error);
    }
  };

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="flex-1 text-sm">
          <SelectValue placeholder="Selecione ou crie um setor" />
        </SelectTrigger>
        <SelectContent>
          {sectors.map((sector) => (
            <SelectItem key={sector.id} value={sector.name} className="text-sm">
              {sector.name}
            </SelectItem>
          ))}
          {sectors.length === 0 && (
            <SelectItem value="" disabled>
              Nenhum setor cadastrado
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="icon" className="flex-shrink-0 h-9 w-9">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Novo Setor</DialogTitle>
            <DialogDescription className="text-sm">
              Criar um novo setor para a organização
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sector-name" className="text-sm">Nome do Setor</Label>
              <Input
                id="sector-name"
                value={newSectorName}
                onChange={(e) => setNewSectorName(e.target.value)}
                placeholder="Ex: Recursos Humanos"
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button onClick={handleCreateSector} className="w-full sm:w-auto">
              Criar Setor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
