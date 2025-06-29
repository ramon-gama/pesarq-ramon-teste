
import { useState } from "react";
import { SearchableSelect } from "./SearchableSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { DEFAULT_SECTORS } from "@/types/service";

interface SectorSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  sectors?: string[];
  onAddSector?: (sector: string) => void;
}

export function SectorSelect({ 
  value, 
  onValueChange, 
  sectors = DEFAULT_SECTORS,
  onAddSector 
}: SectorSelectProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSector, setNewSector] = useState("");

  const sectorOptions = sectors.sort().map(sector => ({
    value: sector,
    label: sector
  }));

  const handleAddSector = () => {
    if (newSector.trim() && !sectors.includes(newSector.trim())) {
      onAddSector?.(newSector.trim());
      onValueChange(newSector.trim());
      setNewSector("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <SearchableSelect
          value={value}
          onValueChange={onValueChange}
          placeholder="Selecione o setor"
          options={sectorOptions}
          searchPlaceholder="Buscar setor..."
        />
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Setor</DialogTitle>
            <DialogDescription>
              Digite o nome do novo setor para adicionar à lista.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newSector">Nome do Setor</Label>
              <Input
                id="newSector"
                value={newSector}
                onChange={(e) => setNewSector(e.target.value)}
                placeholder="Ex: Marketing"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSector();
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                onClick={handleAddSector}
                disabled={!newSector.trim() || sectors.includes(newSector.trim())}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
