
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  FileSearch,
  ExternalLink,
  Plus,
  TrendingUp,
  FileText,
  Clock,
  Users,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { DiagnosticLinkManager } from "../DiagnosticLinkManager";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";

interface DocumentProductionMonitoringProps {
  diagnosticTitle: string;
  onNavigateBack: () => void;
}

const productionData = [
  { mes: "Jan", documentosGerados: 1250, documentosProcessados: 1180, eficiencia: 94 },
  { mes: "Fev", documentosGerados: 1380, documentosProcessados: 1320, eficiencia: 96 },
  { mes: "Mar", documentosGerados: 1450, documentosProcessados: 1380, eficiencia: 95 },
  { mes: "Abr", documentosGerados: 1320, documentosProcessados: 1250, eficiencia: 95 },
  { mes: "Mai", documentosGerados: 1480, documentosProcessados: 1420, eficiencia: 96 },
  { mes: "Jun", documentosGerados: 1590, documentosProcessados: 1520, eficiencia: 96 },
];

const departmentData = [
  { departamento: "Recursos Humanos", documentosMes: 245, tempoMedio: 2.5, gargalos: 3 },
  { departamento: "Financeiro", documentosMes: 380, tempoMedio: 1.8, gargalos: 1 },
  { departamento: "Jurídico", documentosMes: 150, tempoMedio: 4.2, gargalos: 5 },
  { departamento: "Tecnologia", documentosMes: 95, tempoMedio: 3.1, gargalos: 2 },
  { departamento: "Administração", documentosMes: 420, tempoMedio: 2.1, gargalos: 2 },
];

export function DocumentProductionMonitoring({ diagnosticTitle, onNavigateBack }: DocumentProductionMonitoringProps) {
  const [showLinkManager, setShowLinkManager] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("ultimos-6-meses");

  const totalDocuments = productionData.reduce((acc, curr) => acc + curr.documentosGerados, 0);
  const avgEfficiency = productionData.reduce((acc, curr) => acc + curr.eficiencia, 0) / productionData.length;
  const totalBottlenecks = departmentData.reduce((acc, curr) => acc + curr.gargalos, 0);

  if (showLinkManager) {
    return (
      <DiagnosticLinkManager
        diagnosticId="producao-documental"
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
              <FileSearch className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold truncate">{diagnosticTitle}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Avaliação dos processos de criação e tramitação de documentos
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultimos-6-meses">Últimos 6 meses</SelectItem>
              <SelectItem value="ultimo-ano">Último ano</SelectItem>
              <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Documentos Gerados</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{totalDocuments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">últimos 6 meses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Eficiência Média</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{avgEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">processamento vs geração</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Departamentos Ativos</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{departmentData.length}</div>
            <p className="text-xs text-muted-foreground">em monitoramento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Gargalos Identificados</CardTitle>
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-yellow-600">{totalBottlenecks}</div>
            <p className="text-xs text-muted-foreground">pontos de atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Principais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Ações do Diagnóstico</CardTitle>
          <CardDescription className="text-sm">
            Inicie uma nova análise da produção documental ou gerencie links para coleta de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Iniciar Análise de Produção</span>
              <span className="sm:hidden">Análise</span>
            </Button>
            <Button variant="outline" onClick={() => setShowLinkManager(true)} className="flex items-center gap-2 w-full sm:w-auto">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Gerenciar Links Públicos</span>
              <span className="sm:hidden">Links</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="production" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="production" className="text-xs sm:text-sm">Produção</TabsTrigger>
          <TabsTrigger value="departments" className="text-xs sm:text-sm">Departamentos</TabsTrigger>
          <TabsTrigger value="efficiency" className="text-xs sm:text-sm">Eficiência</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Produção Mensal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Produção vs Processamento</CardTitle>
                <CardDescription className="text-sm">Comparativo mensal de documentos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="documentosGerados" fill="#3b82f6" name="Gerados" />
                    <Bar dataKey="documentosProcessados" fill="#10b981" name="Processados" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Eficiência */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Evolução da Eficiência</CardTitle>
                <CardDescription className="text-sm">Percentual de processamento mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" fontSize={12} />
                    <YAxis domain={[90, 100]} fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="eficiencia" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Performance por Departamento</CardTitle>
              <CardDescription className="text-sm">Análise detalhada da produção documental por setor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Departamento</TableHead>
                      <TableHead className="text-xs sm:text-sm">Docs/Mês</TableHead>
                      <TableHead className="text-xs sm:text-sm">Tempo (dias)</TableHead>
                      <TableHead className="text-xs sm:text-sm">Gargalos</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentData.map((dept, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-xs sm:text-sm">{dept.departamento}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{dept.documentosMes}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{dept.tempoMedio}</TableCell>
                        <TableCell>
                          <Badge variant={dept.gargalos > 3 ? "destructive" : dept.gargalos > 1 ? "secondary" : "default"} className="text-xs">
                            {dept.gargalos}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={dept.gargalos <= 1 ? "default" : "outline"} className="text-xs">
                            {dept.gargalos <= 1 ? "Otimizado" : "Atenção"}
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

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Análise de Eficiência</CardTitle>
              <CardDescription className="text-sm">Insights sobre o processo de produção documental</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 text-sm sm:text-base">Alta Performance</h4>
                  <p className="text-xs sm:text-sm text-green-700">
                    A eficiência média de {avgEfficiency.toFixed(1)}% está acima da meta organizacional de 90%.
                    O departamento Financeiro apresenta o melhor desempenho.
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 text-sm sm:text-base">Departamentos de Atenção</h4>
                  <p className="text-xs sm:text-sm text-yellow-700">
                    O setor Jurídico apresenta 5 gargalos e tempo médio de 4.2 dias, 
                    necessitando intervenção para otimização dos processos.
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 text-sm sm:text-base">Tendência Positiva</h4>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Observa-se crescimento constante na produção documental nos últimos meses,
                    indicando aumento da atividade organizacional.
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
