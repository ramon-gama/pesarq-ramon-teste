
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, XCircle, AlertCircle, Clock, DollarSign, Plus, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface AttendanceEntry {
  researcher_id: string;
  status: 'presente' | 'falta' | 'parcial' | null;
  hours_worked: number;
  hours_expected: number;
  hours_paid: number;
  justification: string;
  observations: string;
  shift: 'manha' | 'tarde';
}

interface Researcher {
  id: string;
  name: string;
  function: string;
  workload?: number;
}

interface ResearcherCardProps {
  researcher: Researcher;
  entry?: AttendanceEntry;
  existingRecord?: any;
  onUpdateEntry: (researcherId: string, field: keyof AttendanceEntry, value: any) => void;
}

const getStatusIcon = (status: string | null | undefined) => {
  switch (status) {
    case 'presente':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'falta':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'parcial':
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case 'presente':
      return "border-green-200 bg-green-50";
    case 'falta':
      return "border-red-200 bg-red-50";
    case 'parcial':
      return "border-yellow-200 bg-yellow-50";
    default:
      return "border-gray-200 bg-gray-50";
  }
};

const getStatusLabel = (status: string | null | undefined) => {
  switch (status) {
    case 'presente':
      return 'Presente';
    case 'falta':
      return 'Falta';
    case 'parcial':
      return 'Parcial';
    default:
      return 'Não Definido';
  }
};

const PARTIAL_JUSTIFICATIONS = [
  "Atraso por transporte público",
  "Aula ou compromisso acadêmico parcial",
  "Consulta médica",
  "Atividade externa do projeto",
  "Chegada tardia autorizada",
  "Saída antecipada por compromisso",
  "Jornada parcial combinada previamente",
  "Outros"
];

const ABSENCE_JUSTIFICATIONS = [
  "Atestado médico",
  "Compromisso acadêmico (aula, prova, TCC)",
  "Problemas pessoais",
  "Problemas de saúde",
  "Problemas de transporte",
  "Evento institucional autorizado",
  "Reunião externa do projeto",
  "Motivo familiar (emergência)",
  "Viagem previamente autorizada",
  "Ausência justificada com aviso prévio",
  "Outros"
];

export const ResearcherCard = memo(function ResearcherCard({
  researcher,
  entry,
  existingRecord,
  onUpdateEntry
}: ResearcherCardProps) {
  const [showExtraHours, setShowExtraHours] = useState(false);

  // Se já existe registro, mostrar como somente leitura
  if (existingRecord) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(existingRecord.status)}
              <div>
                <span className="font-medium">{researcher.name}</span>
                <p className="text-sm text-gray-600">
                  {researcher.function} • Carga: {researcher.workload}h/semana
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              Já Registrado - {getStatusLabel(existingRecord.status)}
            </Badge>
          </div>
          {existingRecord.justification && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <strong>Justificativa:</strong> {existingRecord.justification}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Se não há entry, não renderizar nada
  if (!entry) {
    return null;
  }

  const handleStatusChange = (newStatus: 'presente' | 'falta' | 'parcial') => {
    onUpdateEntry(researcher.id, 'status', newStatus);
    // Limpar justificativa quando mudar status
    onUpdateEntry(researcher.id, 'justification', '');
  };

  const cardColor = entry.status === null ? "border-gray-200 bg-white" : getStatusColor(entry.status);
  const shouldShowJustification = entry.status === 'falta' || entry.status === 'parcial';
  const shouldShowHoursWorked = entry.status === 'parcial';

  const getJustificationOptions = () => {
    if (entry.status === 'parcial') {
      return PARTIAL_JUSTIFICATIONS;
    } else if (entry.status === 'falta') {
      return ABSENCE_JUSTIFICATIONS;
    }
    return [];
  };

  return (
    <TooltipProvider>
      <Card className={cardColor}>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(entry.status)}
              <div>
                <span className="font-medium">{researcher.name}</span>
                <p className="text-sm text-gray-600">
                  {researcher.function} • {researcher.workload}h/semana
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {entry.status && (
                <Badge variant={entry.status === 'presente' ? "default" : 
                              entry.status === 'falta' ? "destructive" : 
                              entry.status === 'parcial' ? "secondary" : "outline"}>
                  {getStatusLabel(entry.status)}
                </Badge>
              )}
              {!entry.status && (
                <Badge variant="outline" className="text-gray-500 border-gray-300">
                  Aguardando Definição
                </Badge>
              )}
              
              {!showExtraHours && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowExtraHours(true)}
                      className="p-2 h-8 w-8 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adicionar Horas Extras/Devidas</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Status de Presença *</Label>
            
            <RadioGroup
              value={entry.status || ''}
              onValueChange={(value) => {
                if (value === 'presente' || value === 'falta' || value === 'parcial') {
                  handleStatusChange(value);
                }
              }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="presente" id={`presente-${researcher.id}`} />
                <Label htmlFor={`presente-${researcher.id}`} className="text-sm cursor-pointer">
                  Presente
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="falta" id={`falta-${researcher.id}`} />
                <Label htmlFor={`falta-${researcher.id}`} className="text-sm cursor-pointer">
                  Falta
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="parcial" id={`parcial-${researcher.id}`} />
                <Label htmlFor={`parcial-${researcher.id}`} className="text-sm cursor-pointer">
                  Presença Parcial
                </Label>
              </div>
            </RadioGroup>
          </div>

          {shouldShowHoursWorked && (
            <div className="space-y-2">
              <Label>Horas Trabalhadas</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                max={entry.hours_expected}
                value={entry.hours_worked}
                onChange={(e) => onUpdateEntry(researcher.id, 'hours_worked', parseFloat(e.target.value) || 0)}
                placeholder="Quantas horas trabalhou"
              />
            </div>
          )}

          {showExtraHours && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Horas Extras/Devidas
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowExtraHours(false);
                    onUpdateEntry(researcher.id, 'hours_paid', 0);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={entry.hours_paid}
                onChange={(e) => onUpdateEntry(researcher.id, 'hours_paid', parseFloat(e.target.value) || 0)}
                placeholder="Horas extras trabalhadas para compensação"
                className="bg-blue-50 border-blue-200"
              />
              <p className="text-xs text-blue-600">
                Para registrar horas extras trabalhadas ou compensação de horas devidas
              </p>
            </div>
          )}

          {shouldShowJustification && (
            <div className="space-y-2">
              <Label>Justificativa * (obrigatória)</Label>
              <Select
                value={entry.justification}
                onValueChange={(value) => onUpdateEntry(researcher.id, 'justification', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    entry.status === 'falta' 
                      ? "Selecione o motivo da falta..." 
                      : "Selecione o motivo da presença parcial..."
                  } />
                </SelectTrigger>
                <SelectContent>
                  {getJustificationOptions().map((justification) => (
                    <SelectItem key={justification} value={justification}>
                      {justification}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
});
