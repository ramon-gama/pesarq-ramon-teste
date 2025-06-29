
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProjectFormData } from '@/types/projectForm';

interface ProjectDetailsTabProps {
  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  isViewMode: boolean;
}

export function ProjectDetailsTab({ formData, setFormData, isViewMode }: ProjectDetailsTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="legal_instrument">Instrumento Legal</Label>
          <Input
            id="legal_instrument"
            value={formData.legal_instrument}
            onChange={(e) => setFormData(prev => ({ ...prev, legal_instrument: e.target.value }))}
            disabled={isViewMode}
          />
        </div>

        <div>
          <Label htmlFor="instrument_number">Número do Instrumento</Label>
          <Input
            id="instrument_number"
            value={formData.instrument_number}
            onChange={(e) => setFormData(prev => ({ ...prev, instrument_number: e.target.value }))}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <Label htmlFor="total_value">Valor Total (R$)</Label>
          <Input
            id="total_value"
            type="number"
            step="0.01"
            value={formData.total_value}
            onChange={(e) => setFormData(prev => ({ ...prev, total_value: e.target.value }))}
            disabled={isViewMode}
          />
        </div>

        <div>
          <Label htmlFor="researchers_count">Pesquisadores</Label>
          <Input
            id="researchers_count"
            type="number"
            value={formData.researchers_count}
            onChange={(e) => setFormData(prev => ({ ...prev, researchers_count: e.target.value }))}
            disabled={isViewMode}
          />
        </div>

        <div>
          <Label htmlFor="documents_meters">Docs. a Tratar (m)</Label>
          <Input
            id="documents_meters"
            type="number"
            step="0.01"
            value={formData.documents_meters}
            onChange={(e) => setFormData(prev => ({ ...prev, documents_meters: e.target.value }))}
            disabled={isViewMode}
          />
        </div>

        <div>
          <Label htmlFor="boxes_to_digitalize">Caixas p/ Digitalizar</Label>
          <Input
            id="boxes_to_digitalize"
            type="number"
            value={formData.boxes_to_digitalize}
            onChange={(e) => setFormData(prev => ({ ...prev, boxes_to_digitalize: e.target.value }))}
            disabled={isViewMode}
          />
        </div>

        <div>
          <Label htmlFor="boxes_to_describe">Caixas p/ Descrever</Label>
          <Input
            id="boxes_to_describe"
            type="number"
            value={formData.boxes_to_describe}
            onChange={(e) => setFormData(prev => ({ ...prev, boxes_to_describe: e.target.value }))}
            disabled={isViewMode}
          />
        </div>
      </div>
    </div>
  );
}
