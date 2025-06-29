
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, CheckCircle, XCircle, AlertCircle, Save, X } from "lucide-react";
import { type AttendanceRecord } from "@/hooks/useAttendanceControl";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAttendanceControl } from "@/hooks/useAttendanceControl";
import { useToast } from "@/hooks/use-toast";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEdit?: (record: AttendanceRecord) => void;
  onDelete?: (id: string) => void;
}

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

export function AttendanceTable({ records, onEdit, onDelete }: AttendanceTableProps) {
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editingData, setEditingData] = useState<Partial<AttendanceRecord>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { updateAttendanceRecord, loading } = useAttendanceControl();
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'presente':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'falta':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'parcial':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'presente':
        return 'bg-green-100 text-green-800';
      case 'falta':
        return 'bg-red-100 text-red-800';
      case 'parcial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'presente':
        return 'Presente';
      case 'falta':
        return 'Falta';
      case 'parcial':
        return 'Parcial';
      default:
        return status;
    }
  };

  const handleEditStart = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setEditingData({
      status: record.status,
      hours_worked: record.hours_worked,
      hours_expected: record.hours_expected,
      justification: record.justification || ''
    });
    setIsDialogOpen(true);
  };

  const handleEditCancel = () => {
    setEditingRecord(null);
    setEditingData({});
    setIsDialogOpen(false);
  };

  const handleEditSave = async () => {
    if (!editingRecord) return;

    try {
      if ((editingData.status === 'falta' || editingData.status === 'parcial') && !editingData.justification?.trim()) {
        toast({
          title: "Erro",
          description: "Justificativa é obrigatória para faltas e presenças parciais",
          variant: "destructive",
        });
        return;
      }

      await updateAttendanceRecord(editingRecord.id, editingData);
      setEditingRecord(null);
      setEditingData({});
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleStatusChange = (status: 'presente' | 'falta' | 'parcial') => {
    let newHoursWorked = editingData.hours_worked || 0;
    
    if (status === 'presente') {
      newHoursWorked = editingData.hours_expected || 0;
    } else if (status === 'falta') {
      newHoursWorked = 0;
    }

    setEditingData(prev => ({
      ...prev,
      status,
      hours_worked: newHoursWorked,
      justification: '' // Limpar justificativa quando mudar status
    }));
  };

  const getJustificationOptions = () => {
    if (editingData.status === 'parcial') {
      return PARTIAL_JUSTIFICATIONS;
    } else if (editingData.status === 'falta') {
      return ABSENCE_JUSTIFICATIONS;
    }
    return [];
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum registro de frequência encontrado.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pesquisador</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Horas</TableHead>
              <TableHead>Justificativa</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {record.researcher?.name || 'Pesquisador não encontrado'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.researcher?.modality || ''}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(record.date), "PPP", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {record.shift === 'manha' ? 'Manhã' : 'Tarde'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    <Badge className={getStatusColor(record.status)}>
                      {getStatusLabel(record.status)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{record.hours_worked}h / {record.hours_expected}h</div>
                    {record.hours_paid && record.hours_paid > 0 && (
                      <div className="text-gray-500">Pagas: {record.hours_paid}h</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    {record.justification && (
                      <p className="text-sm text-gray-600 truncate">
                        {record.justification}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditStart(record)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {onDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este registro de frequência?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDelete(record.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Registro de Frequência</DialogTitle>
          </DialogHeader>
          
          {editingRecord && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Pesquisador</label>
                <p className="text-sm text-gray-600">{editingRecord.researcher?.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Data e Turno</label>
                <p className="text-sm text-gray-600">
                  {format(new Date(editingRecord.date), "PPP", { locale: ptBR })} - {editingRecord.shift === 'manha' ? 'Manhã' : 'Tarde'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={editingData.status}
                  onValueChange={handleStatusChange}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Horas Trabalhadas</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={editingData.hours_worked || 0}
                    onChange={(e) => setEditingData(prev => ({
                      ...prev,
                      hours_worked: parseFloat(e.target.value) || 0
                    }))}
                    disabled={editingData.status === 'falta'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Horas Esperadas</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={editingData.hours_expected || 0}
                    onChange={(e) => setEditingData(prev => ({
                      ...prev,
                      hours_expected: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>
              </div>

              {(editingData.status === 'falta' || editingData.status === 'parcial') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Justificativa *</label>
                  <Select
                    value={editingData.justification || ''}
                    onValueChange={(value) => setEditingData(prev => ({
                      ...prev,
                      justification: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        editingData.status === 'falta' 
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

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleEditCancel} disabled={loading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleEditSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
