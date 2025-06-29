
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle, Clock, Send } from "lucide-react";
import { type MonthlyReport } from "@/hooks/useAttendanceControl";

interface MonthlyReportsTableProps {
  reports: MonthlyReport[];
  onGenerateReport: (researcherId: string, month: number, year: number) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aprovado
        </Badge>
      );
    case 'submitted':
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Send className="h-3 w-3 mr-1" />
          Enviado
        </Badge>
      );
    case 'draft':
      return (
        <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          Rascunho
        </Badge>
      );
    default:
      return <Badge variant="outline">Não informado</Badge>;
  }
};

const getMonthName = (month: number) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1] || '';
};

export function MonthlyReportsTable({ reports, onGenerateReport }: MonthlyReportsTableProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum relatório mensal encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Pesquisador</TableHead>
            <TableHead className="min-w-[120px]">Período</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[120px]">Horas</TableHead>
            <TableHead className="min-w-[100px]">Frequência</TableHead>
            <TableHead className="min-w-[120px]">Presença</TableHead>
            <TableHead className="min-w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map(report => (
            <TableRow key={report.id}>
              <TableCell>
                <div className="font-medium">{report.researcher?.name || 'Pesquisador não encontrado'}</div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{getMonthName(report.month)}</div>
                  <div className="text-gray-500">{report.year}</div>
                </div>
              </TableCell>
              
              <TableCell>
                {getStatusBadge(report.status)}
                {report.approved_at && (
                  <div className="text-xs text-gray-500 mt-1">
                    Aprovado em {new Date(report.approved_at).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </TableCell>
              
              <TableCell>
                <div className="text-sm">
                  <div>Trabalhadas: {report.total_hours_worked}h</div>
                  <div className="text-gray-500">Esperadas: {report.total_hours_expected}h</div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm font-medium">
                  {report.attendance_rate.toFixed(1)}%
                </div>
                <div className={`text-xs ${
                  report.attendance_rate >= 85 ? 'text-green-600' : 
                  report.attendance_rate >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {report.attendance_rate >= 85 ? 'Excelente' : 
                   report.attendance_rate >= 70 ? 'Adequada' : 'Abaixo do esperado'}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm">
                  <div className="text-green-600">Presentes: {report.total_present_days}</div>
                  <div className="text-red-600">Faltas: {report.total_absent_days}</div>
                  {report.total_partial_days > 0 && (
                    <div className="text-yellow-600">Parciais: {report.total_partial_days}</div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onGenerateReport(report.researcher_id, report.month, report.year)}
                  title="Regenerar relatório"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
