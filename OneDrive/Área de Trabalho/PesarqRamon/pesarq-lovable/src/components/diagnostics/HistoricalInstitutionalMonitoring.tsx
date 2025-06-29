
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  Building2,
  ExternalLink,
  Plus,
  TrendingUp,
  Clock,
  FileText,
  Users,
  Calendar,
  BarChart3
} from "lucide-react";
import { DiagnosticLinkManager } from "../DiagnosticLinkManager";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";

interface HistoricalInstitutionalMonitoringProps {
  diagnosticTitle: string;
  onNavigateBack: () => void;
}

const institutionalData = [
  { periodo: "1990-2000", documentosArquivados: 1200, normasEstabelecidas: 15, estruturaScore: 60 },
  { periodo: "2000-2010", documentosArquivados: 2800, normasEstabelecidas: 32, estruturaScore: 72 },
  { periodo: "2010-2020", documentosArquivados: 4500, normasEstabelecidas: 48, estruturaScore: 85 },
  { periodo: "2020-2024", documentosArquivados: 6200, normasEstabelecidas: 65, estruturaScore: 92 },
];

const diagnosticHistory = [
  { id: 1, ano: 2024, orgaoAvaliado: "Ministério da Saúde", status: "Concluído", score: 88 },
  { id: 2, ano: 2024, orgaoAvaliado: "MIDR", status: "Em andamento", score: 76 },
  { id: 3, ano: 2023, orgaoAvaliado: "Ibama", status: "Concluído", score: 82 },
  { id: 4, ano: 2023, orgaoAvaliado: "Ministério da Educação", status: "Concluído", score: 79 },
];

export function HistoricalInstitutionalMonitoring({ diagnosticTitle, onNavigateBack }: HistoricalInstitutionalMonitoringProps) {
  const [showLinkManager, setShowLinkManager] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024");

  const avgScore = diagnosticHistory
    .filter(d => d.ano.toString() === selectedYear)
    .reduce((acc, curr) => acc + curr.score, 0) / 
    diagnosticHistory.filter(d => d.ano.toString() === selectedYear).length;

  if (showLinkManager) {
    return (
      <DiagnosticLinkManager
        diagnosticId="historico-institucional"
        diagnosticTitle={diagnosticTitle}
        onNavigateBack={() => setShowLinkManager(false)}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={onNavigateBack}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar para Diagnósticos</span>
            <span className="sm:hidden">Voltar</span>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold truncate">{diagnosticTitle}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Análise da evolução histórica e estrutura institucional
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Órgãos Avaliados</CardTitle>
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {diagnosticHistory.filter(d => d.ano.toString() === selectedYear).length}
            </div>
            <p className="text-xs text-muted-foreground">no ano {selectedYear}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Score Médio</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{avgScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">pontuação institucional</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Diagnósticos Concluídos</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {diagnosticHistory.filter(d => d.status === "Concluído").length}
            </div>
            <p className="text-xs text-muted-foreground">total histórico</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Evolução Estrutural</CardTitle>
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">score atual (2020-2024)</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Principais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Ações do Diagnóstico</CardTitle>
          <CardDescription className="text-sm">
            Inicie uma nova avaliação ou gerencie links públicos para coleta de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Iniciar Nova Avaliação</span>
              <span className="sm:hidden">Nova Avaliação</span>
            </Button>
            <Button variant="outline" onClick={() => setShowLinkManager(true)} className="flex items-center gap-2 w-full sm:w-auto">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Gerenciar Links Públicos</span>
              <span className="sm:hidden">Links</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="evolution" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="evolution" className="text-xs sm:text-sm">Evolução</TabsTrigger>
          <TabsTrigger value="organizations" className="text-xs sm:text-sm">Órgãos</TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs sm:text-sm">Análise</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Evolução da Estrutura */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Evolução da Estrutura Institucional</CardTitle>
                <CardDescription className="text-sm">Desenvolvimento ao longo dos períodos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={institutionalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="estruturaScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Documentos Arquivados */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Documentos Arquivados por Período</CardTitle>
                <CardDescription className="text-sm">Volume de documentação institucional</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={institutionalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="documentosArquivados" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Resumo dos Indicadores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Indicadores por Período</CardTitle>
              <CardDescription className="text-sm">Evolução detalhada dos principais métricas institucionais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Período</TableHead>
                      <TableHead className="text-xs sm:text-sm">Documentos Arquivados</TableHead>
                      <TableHead className="text-xs sm:text-sm">Normas Estabelecidas</TableHead>
                      <TableHead className="text-xs sm:text-sm">Score Estrutural</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {institutionalData.map((period, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-xs sm:text-sm">{period.periodo}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{period.documentosArquivados.toLocaleString()}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{period.normasEstabelecidas}</TableCell>
                        <TableCell>
                          <Badge variant={period.estruturaScore >= 80 ? "default" : "secondary"} className="text-xs">
                            {period.estruturaScore}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Histórico de Avaliações</CardTitle>
              <CardDescription className="text-sm">Órgãos que passaram pelo diagnóstico histórico-institucional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Ano</TableHead>
                      <TableHead className="text-xs sm:text-sm">Órgão</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm">Score Final</TableHead>
                      <TableHead className="text-xs sm:text-sm">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {diagnosticHistory.map((diagnostic) => (
                      <TableRow key={diagnostic.id}>
                        <TableCell className="text-xs sm:text-sm">{diagnostic.ano}</TableCell>
                        <TableCell className="font-medium text-xs sm:text-sm">{diagnostic.orgaoAvaliado}</TableCell>
                        <TableCell>
                          <Badge variant={diagnostic.status === "Concluído" ? "default" : "secondary"} className="text-xs">
                            {diagnostic.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={diagnostic.score >= 80 ? "default" : "outline"} className="text-xs">
                            {diagnostic.score}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="text-xs">
                            {diagnostic.status === "Concluído" ? "Ver Relatório" : "Continuar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Análise Comparativa</CardTitle>
              <CardDescription className="text-sm">Insights sobre a evolução institucional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 text-sm sm:text-base">Crescimento Consistente</h4>
                  <p className="text-xs sm:text-sm text-green-700">
                    Observa-se um crescimento consistente na estrutura institucional ao longo das décadas, 
                    com destaque para o período 2010-2020 que apresentou maior evolução.
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 text-sm sm:text-base">Modernização dos Processos</h4>
                  <p className="text-xs sm:text-sm text-blue-700">
                    O período mais recente (2020-2024) mostra uma consolidação dos processos 
                    arquivísticos com score de 92%, indicando maturidade institucional.
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 text-sm sm:text-base">Áreas de Melhoria</h4>
                  <p className="text-xs sm:text-sm text-orange-700">
                    Alguns órgãos ainda apresentam scores abaixo de 80%, indicando 
                    necessidade de intervenções específicas na estrutura arquivística.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
