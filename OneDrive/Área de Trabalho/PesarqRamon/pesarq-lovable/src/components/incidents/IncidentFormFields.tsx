
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface IncidentFormFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: string) => void;
  incidentTypes: Array<{ value: string; label: string; description: string }>;
  severityLevels: Array<{ value: string; label: string; color: string }>;
  externalSupportOptions: Array<{ value: string; label: string }>;
}

export function IncidentFormFields({
  formData,
  onFieldChange,
  incidentTypes,
  severityLevels,
  externalSupportOptions
}: IncidentFormFieldsProps) {
  
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título do Incidente *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="Ex: Infiltração no Arquivo Setorial – Bloco A"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Tipo de Incidente *</Label>
          <Select value={formData.type || ''} onValueChange={(value) => onFieldChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de incidente" />
            </SelectTrigger>
            <SelectContent>
              {incidentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="date">Data do Incidente *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date || ''}
              onChange={(e) => onFieldChange('date', e.target.value)}
              max={getCurrentDate()}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Hora do Incidente</Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time || ''}
              onChange={(e) => onFieldChange('time', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Local do Incidente</Label>
          <Input
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={(e) => onFieldChange('location', e.target.value)}
            placeholder="Ex: Arquivo Central - Sala 205"
          />
        </div>

        <div>
          <Label htmlFor="responsible">Responsável pelo Relato</Label>
          <Input
            id="responsible"
            name="responsible"
            value={formData.responsible || ''}
            onChange={(e) => onFieldChange('responsible', e.target.value)}
            placeholder="Ex: João Silva - Arquivo Central"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="severity">Classificação da Gravidade *</Label>
          <Select value={formData.severity || ''} onValueChange={(value) => onFieldChange('severity', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a gravidade" />
            </SelectTrigger>
            <SelectContent>
              {severityLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  <div className="flex items-center gap-2">
                    <Badge className={level.color}>{level.label}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estimated_volume">Volume Estimado Afetado</Label>
          <Input
            id="estimated_volume"
            name="estimated_volume"
            value={formData.estimated_volume || ''}
            onChange={(e) => onFieldChange('estimated_volume', e.target.value)}
            placeholder="Ex: 50 metros lineares, 200 caixas"
          />
        </div>

        <div>
          <Label htmlFor="consequences">Consequências Imediatas</Label>
          <Textarea
            id="consequences"
            name="consequences"
            value={formData.consequences || ''}
            onChange={(e) => onFieldChange('consequences', e.target.value)}
            placeholder="Descreva as consequências observadas..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="measures_adopted">Medidas Adotadas</Label>
          <Textarea
            id="measures_adopted"
            name="measures_adopted"
            value={formData.measures_adopted || ''}
            onChange={(e) => onFieldChange('measures_adopted', e.target.value)}
            placeholder="Descreva as medidas já tomadas..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="external_support">Necessidade de Apoio Externo</Label>
          <Select value={formData.external_support || ''} onValueChange={(value) => onFieldChange('external_support', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione se precisa de apoio externo" />
            </SelectTrigger>
            <SelectContent>
              {externalSupportOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
