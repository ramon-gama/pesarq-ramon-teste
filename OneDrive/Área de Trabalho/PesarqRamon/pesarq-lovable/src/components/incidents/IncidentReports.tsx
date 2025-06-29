
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Edit, CheckCircle, Clock, AlertTriangle, User, FileSpreadsheet } from "lucide-react";
import { useIncidents } from "@/hooks/useIncidents";
import { useToast } from "@/hooks/use-toast";
import { generateIncidentReportPDF, generateAllIncidentReportsPDF, exportIncidentReportsToExcel } from "@/utils/incidentReportsPdfGenerator";

interface IncidentReportWithIncident {
  id: string;
  incident_id: string;
  final_report: string | null;
  identified_causes: string | null;
  corrective_actions: string | null;
  future_recommendations: string | null;
  closure_date: string | null;
  technical_responsible: string | null;
  status: 'em-andamento' | 'concluido' | 'pendente';
  created_at: string;
  updated_at: string;
  incidents: {
    title: string;
    id: string;
    date: string;
    severity: string;
    type: string;
    location: string | null;
    responsible: string | null;
  };
}

export function IncidentReports() {
  const { incidentReports, updateIncidentReport } = useIncidents('00000000-0000-0000-0000-000000000001');
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<IncidentReportWithIncident | null>(null);
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [reportForm, setReportForm] = useState({
    final_report: "",
    identified_causes: "",
    corrective_actions: "",
    future_recommendations: "",
    technical_responsible: ""
  });

  const statusConfig = {
    "em-andamento": { label: "Em Andamento", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
    "concluido": { label: "Concluído", color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3" /> },
    "pendente": { label: "Pendente", color: "bg-gray-100 text-gray-800", icon: <AlertTriangle className="h-3 w-3" /> }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Não definido";
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleSaveReport = async () => {
    if (!selectedReport || !reportForm.final_report || !reportForm.identified_causes) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha pelo menos o relatório final e as causas identificadas.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateIncidentReport(selectedReport.incident_id, {
        final_report: reportForm.final_report,
        identified_causes: reportForm.identified_causes,
        corrective_actions: reportForm.corrective_actions,
        future_recommendations: reportForm.future_recommendations,
        technical_responsible: reportForm.technical_responsible,
        status: reportForm.final_report && reportForm.identified_causes ? 'concluido' : 'em-andamento'
      });

      toast({
        title: "Relatório salvo",
        description: "O relatório foi atualizado com sucesso."
      });

      setIsEditingReport(false);
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o relatório. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleExportReport = (report: IncidentReportWithIncident) => {
    try {
      generateIncidentReportPDF(report);
      toast({
        title: "PDF gerado",
        description: "O relatório foi exportado em PDF com sucesso."
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleExportAllReports = () => {
    try {
      generateAllIncidentReportsPDF(reportsWithIncidents);
      toast({
        title: "PDF consolidado gerado",
        description: "Todos os relatórios foram exportados em um PDF consolidado."
      });
    } catch (error) {
      console.error('Error exporting all reports:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o PDF consolidado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleExportToExcel = () => {
    try {
      exportIncidentReportsToExcel(reportsWithIncidents);
      toast({
        title: "Excel gerado",
        description: "Os dados foram exportados para Excel com sucesso."
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo Excel. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Cast the incidentReports to include the incidents data
  const reportsWithIncidents = incidentReports as unknown as IncidentReportWithIncident[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Relatórios e Medidas Corretivas</h2>
          <p className="text-muted-foreground">
            Acompanhe a evolução e resolução dos incidentes registrados
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportToExcel} variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button onClick={handleExportAllReports} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Todos (PDF)
          </Button>
        </div>
      </div>

      {/* Lista de Relatórios */}
      <div className="grid gap-4">
        {reportsWithIncidents.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{report.incidents?.title || 'Incidente não encontrado'}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span>Relatório: {report.id.slice(0, 8)}</span>
                    <span>Atualizado: {formatDate(report.updated_at)}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusConfig[report.status].color}>
                    <span className="flex items-center gap-1">
                      {statusConfig[report.status].icon}
                      {statusConfig[report.status].label}
                    </span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Relatório Final</h4>
                  <p className="text-sm text-muted-foreground">
                    {report.final_report || "Relatório ainda não elaborado."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Responsável Técnico</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {report.technical_responsible || "Não definido"}
                    </div>
                  </div>
                  {report.closure_date && (
                    <div>
                      <h4 className="font-medium mb-2">Data de Encerramento</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(report.closure_date)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Relatório Detalhado - {report.id.slice(0, 8)}</DialogTitle>
                        <DialogDescription>
                          {report.incidents?.title}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Tabs defaultValue="report" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="report">Relatório</TabsTrigger>
                          <TabsTrigger value="actions">Ações</TabsTrigger>
                          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
                        </TabsList>

                        <TabsContent value="report" className="space-y-4">
                          <div>
                            <Label>Relatório Final do Incidente</Label>
                            <Textarea
                              value={isEditingReport ? reportForm.final_report : (report.final_report || '')}
                              onChange={(e) => setReportForm({ ...reportForm, final_report: e.target.value })}
                              readOnly={!isEditingReport}
                              rows={4}
                              className={isEditingReport ? "" : "resize-none"}
                            />
                          </div>

                          <div>
                            <Label>Causas Identificadas</Label>
                            <Textarea
                              value={isEditingReport ? reportForm.identified_causes : (report.identified_causes || '')}
                              onChange={(e) => setReportForm({ ...reportForm, identified_causes: e.target.value })}
                              readOnly={!isEditingReport}
                              rows={3}
                              className={isEditingReport ? "" : "resize-none"}
                            />
                          </div>

                          <div>
                            <Label>Responsável Técnico</Label>
                            <Input
                              value={isEditingReport ? reportForm.technical_responsible : (report.technical_responsible || '')}
                              onChange={(e) => setReportForm({ ...reportForm, technical_responsible: e.target.value })}
                              readOnly={!isEditingReport}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="actions" className="space-y-4">
                          <div>
                            <Label>Ações Corretivas Realizadas</Label>
                            <Textarea
                              value={isEditingReport ? reportForm.corrective_actions : (report.corrective_actions || '')}
                              onChange={(e) => setReportForm({ ...reportForm, corrective_actions: e.target.value })}
                              readOnly={!isEditingReport}
                              rows={6}
                              className={isEditingReport ? "" : "resize-none"}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="recommendations" className="space-y-4">
                          <div>
                            <Label>Recomendações Futuras</Label>
                            <Textarea
                              value={isEditingReport ? reportForm.future_recommendations : (report.future_recommendations || '')}
                              onChange={(e) => setReportForm({ ...reportForm, future_recommendations: e.target.value })}
                              readOnly={!isEditingReport}
                              rows={5}
                              className={isEditingReport ? "" : "resize-none"}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="flex justify-end gap-2 pt-4 border-t">
                        {isEditingReport ? (
                          <>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsEditingReport(false)}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={handleSaveReport}>
                              Salvar Alterações
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="outline"
                              onClick={() => {
                                setReportForm({
                                  final_report: report.final_report || '',
                                  identified_causes: report.identified_causes || '',
                                  corrective_actions: report.corrective_actions || '',
                                  future_recommendations: report.future_recommendations || '',
                                  technical_responsible: report.technical_responsible || ''
                                });
                                setIsEditingReport(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button onClick={() => handleExportReport(report)}>
                              <Download className="h-4 w-4 mr-2" />
                              Exportar PDF
                            </Button>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportReport(report)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>

                  {report.status !== "concluido" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setReportForm({
                          final_report: report.final_report || '',
                          identified_causes: report.identified_causes || '',
                          corrective_actions: report.corrective_actions || '',
                          future_recommendations: report.future_recommendations || '',
                          technical_responsible: report.technical_responsible || ''
                        });
                        setIsEditingReport(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reportsWithIncidents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum relatório encontrado</h3>
            <p className="text-muted-foreground text-center">
              Quando incidentes forem registrados, os relatórios aparecerão aqui para acompanhamento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
