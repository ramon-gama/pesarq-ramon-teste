
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Clock } from "lucide-react";

export function IncidentStatistics() {
  // Mock data para os gráficos
  const incidentsByType = [
    { name: "Riscos Físicos", total: 18, resolved: 12, pending: 6 },
    { name: "Falhas Tecnológicas", total: 12, resolved: 8, pending: 4 },
    { name: "Acesso Indevido", total: 8, resolved: 5, pending: 3 },
    { name: "Violação Integridade", total: 6, resolved: 4, pending: 2 },
    { name: "Erros Humanos", total: 3, resolved: 2, pending: 1 }
  ];

  const incidentsBySeverity = [
    { name: "Baixa", value: 15, color: "#22c55e" },
    { name: "Moderada", value: 20, color: "#eab308" },
    { name: "Alta", value: 10, color: "#f97316" },
    { name: "Crítica", value: 2, color: "#ef4444" }
  ];

  const incidentTrend = [
    { month: "Jan", incidents: 5, resolved: 4 },
    { month: "Fev", incidents: 8, resolved: 6 },
    { month: "Mar", incidents: 12, resolved: 9 },
    { month: "Abr", incidents: 7, resolved: 8 },
    { month: "Mai", incidents: 10, resolved: 7 },
    { month: "Jun", incidents: 5, resolved: 6 }
  ];

  const sectorHeatmap = [
    { sector: "Arquivo Central", incidents: 15, severity: "alta" },
    { sector: "Arquivo Setorial A", incidents: 8, severity: "moderada" },
    { sector: "Arquivo Histórico", incidents: 12, severity: "alta" },
    { sector: "Sistema Digital", incidents: 6, severity: "critica" },
    { sector: "Protocolo", incidents: 4, severity: "baixa" },
    { sector: "Expedição", incidents: 2, severity: "baixa" }
  ];

  const resolutionRate = 85;
  const averageResolutionTime = 5.2;
  const totalIncidents = 47;
  const criticalIncidents = 3;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "baixa": return "bg-green-100 text-green-800";
      case "moderada": return "bg-yellow-100 text-yellow-800";
      case "alta": return "bg-orange-100 text-orange-800";
      case "critica": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolutionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +5% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio Resolução</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageResolutionTime} dias</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              -1.2 dias vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Incidentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIncidents}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-orange-500" />
              +12% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalIncidents}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              -2 vs mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Incidentes por Tipo</CardTitle>
            <CardDescription>
              Distribuição dos incidentes por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                total: { label: "Total", color: "#8884d8" },
                resolved: { label: "Resolvidos", color: "#82ca9d" },
                pending: { label: "Pendentes", color: "#ffc658" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="resolved" fill="#22c55e" name="Resolvidos" />
                  <Bar dataKey="pending" fill="#eab308" name="Pendentes" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico por Gravidade */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Gravidade</CardTitle>
            <CardDescription>
              Proporção de incidentes por nível de gravidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Quantidade" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentsBySeverity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidentsBySeverity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendência Temporal */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência Temporal</CardTitle>
          <CardDescription>
            Evolução dos incidentes registrados e resolvidos nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              incidents: { label: "Registrados", color: "#ef4444" },
              resolved: { label: "Resolvidos", color: "#22c55e" }
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incidentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Registrados"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Resolvidos"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Mapa de Calor por Setores */}
      <Card>
        <CardHeader>
          <CardTitle>Incidentes por Setor</CardTitle>
          <CardDescription>
            Setores com maior incidência de problemas arquivísticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectorHeatmap.map((sector, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-red-500 rounded" style={{
                    backgroundColor: sector.incidents > 10 ? "#ef4444" : 
                                   sector.incidents > 5 ? "#f97316" : "#22c55e"
                  }} />
                  <div>
                    <h4 className="font-medium">{sector.sector}</h4>
                    <p className="text-sm text-muted-foreground">
                      {sector.incidents} incidentes registrados
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(sector.severity)}>
                    Gravidade {sector.severity}
                  </Badge>
                  <div className="text-right">
                    <div className="text-lg font-bold">{sector.incidents}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
