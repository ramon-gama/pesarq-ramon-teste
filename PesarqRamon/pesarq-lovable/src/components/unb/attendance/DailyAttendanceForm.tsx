
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle, AlertCircle, Clock, Users } from "lucide-react";
import { useAttendanceControl } from "@/hooks/useAttendanceControl";
import { type Researcher } from "@/hooks/useResearchers";
import { useToast } from "@/hooks/use-toast";

interface DailyAttendanceFormProps {
  researchers: Researcher[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

interface AttendanceEntry {
  researcher_id: string;
  status: 'presente' | 'falta' | 'parcial';
  hours_worked: number;
  hours_expected: number;
  justification: string;
  observations: string;
  shift: 'manha' | 'tarde';
  is_medical_leave: boolean;
}

export function DailyAttendanceForm({ researchers, selectedDate, onDateChange }: DailyAttendanceFormProps) {
  const { createAttendanceRecord, fetchAttendanceRecords } = useAttendanceControl();
  const { toast } = useToast();
  
  const [selectedShift, setSelectedShift] = useState<'manha' | 'tarde'>('manha');
  const [attendanceEntries, setAttendanceEntries] = useState<Record<string, AttendanceEntry>>({});
  const [existingRecords, setExistingRecords] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  // Inicializar entradas de frequência para todos os pesquisadores
  useEffect(() => {
    const initialEntries: Record<string, AttendanceEntry> = {};
    researchers.forEach(researcher => {
      initialEntries[researcher.id] = {
        researcher_id: researcher.id,
        status: 'presente',
        hours_worked: researcher.workload || 4,
        hours_expected: researcher.workload || 4,
        justification: '',
        observations: '',
        shift: selectedShift,
        is_medical_leave: false
      };
    });
    setAttendanceEntries(initialEntries);
  }, [researchers, selectedShift]);

  // Buscar registros existentes para a data selecionada
  useEffect(() => {
    const loadExistingRecords = async () => {
      if (selectedDate) {
        const records = await fetchAttendanceRecords({ 
          date: selectedDate,
          shift: selectedShift 
        });
        const recordsMap: Record<string, any> = {};
        records.forEach(record => {
          recordsMap[`${record.researcher_id}_${record.shift}`] = record;
        });
        setExistingRecords(recordsMap);
      }
    };
    loadExistingRecords();
  }, [selectedDate, selectedShift, fetchAttendanceRecords]);

  const updateAttendanceEntry = (researcherId: string, field: keyof AttendanceEntry, value: any) => {
    setAttendanceEntries(prev => ({
      ...prev,
      [researcherId]: {
        ...prev[researcherId],
        [field]: value,
        // Ajustar horas automaticamente baseado no status
        ...(field === 'status' && {
          hours_worked: value === 'presente' ? prev[researcherId].hours_expected :
                       value === 'falta' ? 0 : prev[researcherId].hours_worked
        })
      }
    }));
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      const entries = Object.values(attendanceEntries);
      const pendingSubmissions = [];

      for (const entry of entries) {
        const existingKey = `${entry.researcher_id}_${entry.shift}`;
        if (!existingRecords[existingKey]) {
          pendingSubmissions.push(createAttendanceRecord({
            ...entry,
            date: selectedDate,
            created_by: 'Sistema'
          }));
        }
      }

      await Promise.all(pendingSubmissions);
      
      toast({
        title: "Sucesso",
        description: `${pendingSubmissions.length} registros de frequência salvos com sucesso`,
      });

      // Recarregar registros existentes
      const records = await fetchAttendanceRecords({ 
        date: selectedDate,
        shift: selectedShift 
      });
      const recordsMap: Record<string, any> = {};
      records.forEach(record => {
        recordsMap[`${record.researcher_id}_${record.shift}`] = record;
      });
      setExistingRecords(recordsMap);

    } catch (error) {
      console.error('Erro ao salvar registros:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar registros de frequência",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'presente':
        return 'bg-green-50 border-green-200';
      case 'falta':
        return 'bg-red-50 border-red-200';
      case 'parcial':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const pendingRecords = researchers.filter(researcher => 
    !existingRecords[`${researcher.id}_${selectedShift}`]
  );

  return (
    <div className="space-y-6">
      {/* Controles de Data e Turno */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shift">Turno</Label>
          <Select
            value={selectedShift}
            onValueChange={(value: 'manha' | 'tarde') => setSelectedShift(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manha">Manhã</SelectItem>
              <SelectItem value="tarde">Tarde</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <Button 
            onClick={handleSubmitAll}
            disabled={submitting || pendingRecords.length === 0}
            className="w-full"
          >
            {submitting ? 'Salvando...' : `Salvar Frequência (${pendingRecords.length})`}
          </Button>
        </div>
      </div>

      {/* Informações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">{researchers.length}</p>
                <p className="text-sm text-gray-600">Total de Pesquisadores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">{researchers.length - pendingRecords.length}</p>
                <p className="text-sm text-gray-600">Já Registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium">{pendingRecords.length}</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pesquisadores */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Frequência dos Pesquisadores</h3>
        
        {researchers.map(researcher => {
          const existingKey = `${researcher.id}_${selectedShift}`;
          const hasExistingRecord = existingRecords[existingKey];
          const entry = attendanceEntries[researcher.id];

          if (!entry) return null;

          return (
            <Card 
              key={researcher.id}
              className={`${
                hasExistingRecord 
                  ? 'bg-green-50 border-green-200' 
                  : getStatusColor(entry.status)
              }`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(hasExistingRecord ? hasExistingRecord.status : entry.status)}
                    <div>
                      <span>{researcher.name}</span>
                      <p className="text-sm font-normal text-gray-600">
                        {researcher.function} • Carga: {researcher.workload}h/semana
                      </p>
                    </div>
                  </div>
                  {hasExistingRecord && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Registrado
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              {!hasExistingRecord && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={entry.status}
                        onValueChange={(value: 'presente' | 'falta' | 'parcial') => 
                          updateAttendanceEntry(researcher.id, 'status', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="presente">Presente</SelectItem>
                          <SelectItem value="falta">Falta</SelectItem>
                          <SelectItem value="parcial">Parcial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Horas Trabalhadas</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={entry.hours_worked}
                        onChange={(e) => 
                          updateAttendanceEntry(researcher.id, 'hours_worked', parseFloat(e.target.value) || 0)
                        }
                        disabled={entry.status === 'falta'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Horas Esperadas</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={entry.hours_expected}
                        onChange={(e) => 
                          updateAttendanceEntry(researcher.id, 'hours_expected', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>

                  {(entry.status === 'falta' || entry.status === 'parcial') && (
                    <div className="space-y-4">
                      {entry.status === 'falta' && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`medical-${researcher.id}`}
                            checked={entry.is_medical_leave}
                            onCheckedChange={(checked) => 
                              updateAttendanceEntry(researcher.id, 'is_medical_leave', checked)
                            }
                          />
                          <Label htmlFor={`medical-${researcher.id}`} className="text-sm">
                            Falta por motivos médicos (não requer compensação de horas)
                          </Label>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Justificativa *</Label>
                        <Textarea
                          value={entry.justification}
                          onChange={(e) => 
                            updateAttendanceEntry(researcher.id, 'justification', e.target.value)
                          }
                          placeholder={
                            entry.status === 'falta' 
                              ? "Motivo da falta..." 
                              : "Motivo da presença parcial..."
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      value={entry.observations}
                      onChange={(e) => 
                        updateAttendanceEntry(researcher.id, 'observations', e.target.value)
                      }
                      placeholder="Observações adicionais..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              )}

              {hasExistingRecord && (
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Status:</span>
                      <p className="capitalize">{hasExistingRecord.status}</p>
                    </div>
                    <div>
                      <span className="font-medium">Horas:</span>
                      <p>{hasExistingRecord.hours_worked}h / {hasExistingRecord.hours_expected}h</p>
                    </div>
                    {hasExistingRecord.justification && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Justificativa:</span>
                        <p>{hasExistingRecord.justification}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {pendingRecords.length === 0 && researchers.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Frequência Completa!
            </h3>
            <p className="text-green-700">
              Todos os pesquisadores já têm seus registros de frequência para {selectedDate} no turno da {selectedShift === 'manha' ? 'manhã' : 'tarde'}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
