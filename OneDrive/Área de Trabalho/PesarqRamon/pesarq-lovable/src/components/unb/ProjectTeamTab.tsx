
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from "lucide-react";
import { ProjectFormData } from '@/types/projectForm';

interface ProjectTeamTabProps {
  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  isViewMode: boolean;
}

export function ProjectTeamTab({ formData, setFormData, isViewMode }: ProjectTeamTabProps) {
  const [newResponsible, setNewResponsible] = useState('');

  const addResponsible = () => {
    if (newResponsible.trim() && !formData.responsibles.includes(newResponsible.trim())) {
      setFormData(prev => ({
        ...prev,
        responsibles: [...prev.responsibles, newResponsible.trim()]
      }));
      setNewResponsible('');
    }
  };

  const removeResponsible = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibles: prev.responsibles.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Responsáveis</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Novo responsável"
            value={newResponsible}
            onChange={(e) => setNewResponsible(e.target.value)}
            disabled={isViewMode}
          />
          <Button type="button" onClick={addResponsible} disabled={isViewMode}>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
        <div className="mt-4 space-y-2">
          {formData.responsibles.map((responsible, index) => (
            <div key={index} className="flex items-center justify-between rounded-md border p-3">
              <span>{responsible}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeResponsible(index)}
                disabled={isViewMode}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
