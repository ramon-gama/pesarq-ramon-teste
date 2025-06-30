
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  Users,
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3,
  Calendar,
  Eye,
  Download,
  Building2
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface WorkSectorsDashboardProps {
  onNavigateBack: () => void;
  onViewResponses: () => void;
}

// Dados fictícios para demonstração
const dashboardData = {
  totalSectors: 12,
  completedDiagnostics: 8,
  inProgress: 4,
  totalResponses: 186,
  averageCompletion: 82
};

const themeProgressData = [
  { theme: "Ambientes e Acondicionamento", completed: 8, total: 12, percentage: 66.7 },
  { theme: "Riscos e Sinistros", completed: 6, total: 12, percentage: 50 },
  { theme: "Organização e Recuperação", completed: 10, total: 12, percentage: 83.3 },
  { theme: "Produção Documental", completed: 7, total: 12, percentage: 58.3 },
  { theme: "Digitalização", completed: 5, total: 12, percentage: 41.7 },
  { theme: "Consulta e Acesso", completed: 9, total: 12, percentage: 75 },
  { theme: "Proteção de Dados", completed: 11, total: 12, percentage: 91.7 },
  { theme: "Sistemas e Documentos Digitais", completed: 8, total: 12, percentage: 66.7 }
];

const sectorStatusData = [
  { name: "Concluído", value: 8, color: "#22c55e" },
  { name: "Em Andamento", value: 4, color: "#f59e0b" },
  { name: "Pendente", value: 0, color: "#ef4444" }
];

const recentActivities = [
  {
    id: "1",
    sector: "Recursos Humanos",
    action: "Diagnóstico Concluído",
    user: "Ana Silva",
    date: "Hoje, 15:20",
    status: "success"
  },
  {
    id: "2", 
    sector: "Tecnologia da Informação",
    action: "25 respostas enviadas",
    user: "Carlos Santos",
    date: "Hoje, 13:45",
    status: "info"
  },
  {
    id: "3",
    sector: "Financeiro",
    action: "Diagnóstico Iniciado",
    user: "Mariana Costa",
    date: "Ontem, 17:30",
    status: "warning"
  }
];

export function WorkSectorsDashboard({ onNavigateBack, onViewResponses }: WorkSectorsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onNavigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Configuração
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard - Diagnóstico de Setores</h1>
              <p className="text-muted-foreground">Visão geral dos diagnósticos por setor de trabalho</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewResponses} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Ver Respostas Detalhadas
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Setores</p>
                <p className="text-2xl font-bold">{dashboardData.totalSectors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diagnósticos Concluídos</p>
                <p className="text-2xl font-bold">{dashboardData.completedDiagnostics}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Respostas</p>
                <p className="text-2xl font-bold">{dashboardData.totalResponses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Setores em Andamento</p>
                <p className="text-2xl font-bold">{dashboardData.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progresso por Tema */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso por Tema</CardTitle>
            <CardDescription>Percentual de conclusão de cada tema diagnóstico nos setores</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                percentage: {
                  label: "Conclusão (%)",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themeProgressData} layout="horizontal">
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="theme" type="category" width={120} fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="percentage" fill="var(--color-percentage)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status dos Setores */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Setores</CardTitle>
            <CardDescription>Distribuição dos setores por status de diagnóstico</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                concluido: {
                  label: "Concluído",
                  color: "#22c55e",
                },
                andamento: {
                  label: "Em Andamento", 
                  color: "#f59e0b",
                },
                pendente: {
                  label: "Pendente",
                  color: "#ef4444",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sectorStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              {sectorStatusData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
          <CardDescription>Últimas ações realizadas nos diagnósticos por setor</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setor</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.sector}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        activity.status === "success" ? "default" : 
                        activity.status === "warning" ? "secondary" : "outline"
                      }
                    >
                      {activity.status === "success" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {activity.status === "warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {activity.status === "success" ? "Concluído" :
                       activity.status === "warning" ? "Em Andamento" : "Pendente"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
