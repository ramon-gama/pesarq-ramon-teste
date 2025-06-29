import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, FileText, Settings, Download, Upload, BarChart3, Clock, Archive } from "lucide-react";
import { TemporalityEditor } from "./TemporalityEditor";
import { TemporalityViewer } from "./TemporalityViewer";
import { TemporalityApproval } from "./TemporalityApproval";
import { TemporalityVersions } from "./TemporalityVersions";

interface TemporalityTableProps {
  onBack: () => void;
}

interface TemporalityItem {
  id: string;
  codigo: string;
  tipoDocumental: string;
  prazoGuardaArquivoCorrente: string;
  prazoGuardaArquivoIntermediario: string;
  eventoDisparoCorrente?: string;
  eventoDisparoIntermediario?: string;
  destinacaoFinal: "eliminacao" | "guarda_permanente";
  justificativasDestinacao: string[];
  observacoes?: string;
  fundamentacaoLegal: string[];
  status: "ativo" | "inativo" | "pendente_aprovacao";
  versao: string;
  dataUltimaAtualizacao: Date;
  responsavelElaboracao: string;
  unidadeProducao: string[];
}

export function TemporalityTable({ onBack }: TemporalityTableProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentVersion, setCurrentVersion] = useState({
    version: "2.1",
    status: "aprovado",
    dataAprovacao: new Date("2024-01-15"),
    proximaRevisao: new Date("2026-01-15"),
    totalItens: 156
  });

  const [temporalityItems, setTemporalityItems] = useState<TemporalityItem[]>([
    {
      id: "1",
      codigo: "000.01",
      tipoDocumental: "Ata de Reunião",
      prazoGuardaArquivoCorrente: "2 anos",
      prazoGuardaArquivoIntermediario: "3 anos",
      eventoDisparoCorrente: "conclusao_atividade",
      eventoDisparoIntermediario: "aprovacao_contas_tcu",
      destinacaoFinal: "eliminacao",
      justificativasDestinacao: ["cumprimento_prazos", "recapitulacao"],
      observacoes: "Manter atas de reuniões estratégicas permanentemente",
      fundamentacaoLegal: ["Lei 8.159/1991", "Decreto 10.278/2020"],
      status: "ativo",
      versao: "2.1",
      dataUltimaAtualizacao: new Date("2024-01-15"),
      responsavelElaboracao: "João Silva",
      unidadeProducao: ["Secretaria Executiva", "Assessoria de Planejamento"]
    },
    {
      id: "2", 
      codigo: "010.02",
      tipoDocumental: "Contrato Administrativo",
      prazoGuardaArquivoCorrente: "5 anos",
      prazoGuardaArquivoIntermediario: "10 anos",
      eventoDisparoCorrente: "termino_vigencia",
      eventoDisparoIntermediario: "aprovacao_contas_tcu",
      destinacaoFinal: "guarda_permanente",
      justificativasDestinacao: ["valor_probatorio", "valor_historico"],
      fundamentacaoLegal: ["Lei 8.666/1993", "Lei 14.133/2021"],
      status: "ativo",
      versao: "2.1",
      dataUltimaAtualizacao: new Date("2024-01-15"),
      responsavelElaboracao: "Maria Santos",
      unidadeProducao: ["Departamento de Contratos", "Procuradoria"]
    },
    {
      id: "3",
      codigo: "020.01",
      tipoDocumental: "Relatório de Gestão Anual",
      prazoGuardaArquivoCorrente: "3 anos",
      prazoGuardaArquivoIntermediario: "7 anos",
      eventoDisparoCorrente: "aprovacao_contas",
      eventoDisparoIntermediario: "apresentacao_relatorio",
      destinacaoFinal: "guarda_permanente",
      justificativasDestinacao: ["valor_historico", "valor_informativo", "valor_probatorio"],
      observacoes: "Documentos essenciais para histórico institucional",
      fundamentacaoLegal: ["Lei 8.159/1991", "TCU - Instrução Normativa 63/2010"],
      status: "ativo",
      versao: "2.1",
      dataUltimaAtualizacao: new Date("2024-01-15"),
      responsavelElaboracao: "Carlos Oliveira",
      unidadeProducao: ["Controladoria", "Assessoria de Planejamento"]
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      aprovado: "bg-green-100 text-green-800",
      "em_elaboracao": "bg-yellow-100 text-yellow-800",
      "pendente_aprovacao": "bg-blue-100 text-blue-800",
      vencido: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || colors.aprovado;
  };

  const calculateDaysToReview = () => {
    const today = new Date();
    const reviewDate = currentVersion.proximaRevisao;
    const diffTime = reviewDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysToReview = calculateDaysToReview();
  const needsReview = daysToReview <= 90;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Tabela de Temporalidade
          </h1>
          <p className="text-slate-600 mt-1">
            Gestão de prazos de guarda, destinação final e justificativas de documentos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(currentVersion.status)}>
            Versão {currentVersion.version} - {currentVersion.status}
          </Badge>
          {needsReview && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Revisão em {daysToReview} dias
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <BarChart3 className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Settings className="h-4 w-4" />
            <span>Editor</span>
          </TabsTrigger>
          <TabsTrigger value="viewer" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <FileText className="h-4 w-4" />
            <span>Visualizar</span>
          </TabsTrigger>
          <TabsTrigger value="approval" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Archive className="h-4 w-4" />
            <span>Aprovação</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Clock className="h-4 w-4" />
            <span>Versões</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total de Itens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{currentVersion.totalItens}</div>
                <p className="text-sm text-gray-600 mt-1">Tipos documentais mapeados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Guarda Permanente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {temporalityItems.filter(item => item.destinacaoFinal === 'guarda_permanente').length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Documentos de valor histórico</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Eliminação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {temporalityItems.filter(item => item.destinacaoFinal === 'eliminacao').length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Documentos temporários</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Próxima Revisão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${needsReview ? 'text-red-600' : 'text-purple-600'}`}>
                  {Math.abs(daysToReview)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {daysToReview > 0 ? 'Dias restantes' : 'Dias em atraso'}
                </p>
              </CardContent>
            </Card>
          </div>

          {needsReview && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Atenção: Revisão Necessária
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700">
                  A Tabela de Temporalidade precisa ser revisada conforme o cronograma estabelecido. 
                  A próxima revisão estava prevista para {currentVersion.proximaRevisao.toLocaleDateString('pt-BR')}.
                </p>
                <Button className="mt-3" variant="outline">
                  Iniciar Processo de Revisão
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas por Destinação Final</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taxa de Guarda Permanente</span>
                  <span className="text-sm text-gray-600">
                    {Math.round((temporalityItems.filter(item => item.destinacaoFinal === 'guarda_permanente').length / temporalityItems.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${(temporalityItems.filter(item => item.destinacaoFinal === 'guarda_permanente').length / temporalityItems.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <TemporalityEditor 
            temporalityItems={temporalityItems}
            onUpdateItems={setTemporalityItems}
            currentVersion={currentVersion}
          />
        </TabsContent>

        <TabsContent value="viewer" className="space-y-6">
          <TemporalityViewer 
            temporalityItems={temporalityItems}
            currentVersion={currentVersion}
          />
        </TabsContent>

        <TabsContent value="approval" className="space-y-6">
          <TemporalityApproval 
            currentVersion={currentVersion}
            onUpdateVersion={setCurrentVersion}
          />
        </TabsContent>

        <TabsContent value="versions" className="space-y-6">
          <TemporalityVersions 
            currentVersion={currentVersion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
