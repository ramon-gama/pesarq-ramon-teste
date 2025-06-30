import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
  Calendar,
  Eye,
  AlertCircle,
  Building2
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { calculateCriticality } from "@/utils/criticalityClassification";
import { SectorResponsesDetail } from "../SectorResponsesDetail";

interface SectorSelectionDashboardProps {
  onNavigateBack: () => void;
  onViewResponses: () => void;
}

// Dados de exemplo com respostas detalhadas para cálculo de criticidade
const sectorData = [
  { 
    sector: "Recursos Humanos", 
    respondido: true, 
    ano: 2024,
    estado: "SP",
    responses: [
      { pergunta: "Você considera que seu Setor enfrenta problemas relacionados à gestão, preservação e/ou acesso aos documentos?", resposta: "Desafios Significativos" },
      { pergunta: "O seu setor guarda documentos em papel dentro das salas de trabalho ou em áreas próximas?", resposta: "Sim" },
      { pergunta: "Qual é a característica do(s) ambiente(s) onde o seu setor guarda os documentos?", resposta: "Espaço da própria organização" },
      { pergunta: "Qual é a quantidade aproximada de documentos em papel no seu setor (em número de caixas-arquivo)?", resposta: "De 1001 a 2000 caixas" },
      { pergunta: "Como está o estado de conservação dos documentos em papel no seu Setor?", resposta: "Regular" },
      { pergunta: "Como estão as condições dos locais onde seu setor guarda os documentos em papel?", resposta: "Razoável" },
      { pergunta: "O seu setor ainda produz ou recebe documentos em papel nas atividades do dia a dia?", resposta: "Sim" },
      { pergunta: "Com que frequência os documentos do seu setor são consultados?", resposta: "Frequente" }
    ]
  },
  { 
    sector: "Financeiro", 
    respondido: true, 
    ano: 2024,
    estado: "RJ",
    responses: [
      { pergunta: "Você considera que seu Setor enfrenta problemas relacionados à gestão, preservação e/ou acesso aos documentos?", resposta: "Problemas Moderados" },
      { pergunta: "O seu setor guarda documentos em papel dentro das salas de trabalho ou em áreas próximas?", resposta: "Sim" },
      { pergunta: "Qual é a característica do(s) ambiente(s) onde o seu setor guarda os documentos?", resposta: "Espaço da própria organização" },
      { pergunta: "Qual é a quantidade aproximada de documentos em papel no seu setor (em número de caixas-arquivo)?", resposta: "De 201 a 500 caixas" },
      { pergunta: "Como está o estado de conservação dos documentos em papel no seu Setor?", resposta: "Regular" },
      { pergunta: "Como estão as condições dos locais onde seu setor guarda os documentos em papel?", resposta: "Razoável" },
      { pergunta: "O seu setor ainda produz ou recebe documentos em papel nas atividades do dia a dia?", resposta: "Sim" },
      { pergunta: "Com que frequência os documentos do seu setor são consultados?", resposta: "Frequente" }
    ]
  },
  { 
    sector: "Tecnologia da Informação", 
    respondido: false, 
    ano: 2024,
    estado: "SP",
    responses: []
  },
  { 
    sector: "Jurídico", 
    respondido: true, 
    ano: 2024,
    estado: "MG",
    responses: [
      { pergunta: "Você considera que seu Setor enfrenta problemas relacionados à gestão, preservação e/ou acesso aos documentos?", resposta: "Poucos Problemas" },
      { pergunta: "O seu setor guarda documentos em papel dentro das salas de trabalho ou em áreas próximas?", resposta: "Não" },
      { pergunta: "Qual é a característica do(s) ambiente(s) onde o seu setor guarda os documentos?", resposta: "Arquivo dedicado" },
      { pergunta: "Qual é a quantidade aproximada de documentos em papel no seu setor (em número de caixas-arquivo)?", resposta: "Até 200 caixas" },
      { pergunta: "Como está o estado de conservação dos documentos em papel no seu Setor?", resposta: "Bom" },
      { pergunta: "Como estão as condições dos locais onde seu setor guarda os documentos em papel?", resposta: "Bom" },
      { pergunta: "O seu setor ainda produz ou recebe documentos em papel nas atividades do dia a dia?", resposta: "Ocasionalmente" },
      { pergunta: "Com que frequência os documentos do seu setor são consultados?", resposta: "Ocasional" }
    ]
  },
  { 
    sector: "Administração", 
    respondido: true, 
    ano: 2024,
    estado: "SP",
    responses: [
      { pergunta: "Você considera que seu Setor enfrenta problemas relacionados à gestão, preservação e/ou acesso aos documentos?", resposta: "Problemas Moderados" },
      { pergunta: "O seu setor guarda documentos em papel dentro das salas de trabalho ou em áreas próximas?", resposta: "Sim" },
      { pergunta: "Qual é a característica do(s) ambiente(s) onde o seu setor guarda os documentos?", resposta: "Espaço da própria organização" },
      { pergunta: "Qual é a quantidade aproximada de documentos em papel no seu setor (em número de caixas-arquivo)?", resposta: "De 501 a 1000 caixas" },
      { pergunta: "Como está o estado de conservação dos documentos em papel no seu Setor?", resposta: "Regular" },
      { pergunta: "Como estão as condições dos locais onde seu setor guarda os documentos em papel?", resposta: "Razoável" },
      { pergunta: "O seu setor ainda produz ou recebe documentos em papel nas atividades do dia a dia?", resposta: "Sim" },
      { pergunta: "Com que frequência os documentos do seu setor são consultados?", resposta: "Frequente" }
    ]
  },
  { 
    sector: "Comunicação", 
    respondido: false, 
    ano: 2024,
    estado: "RJ",
    responses: []
  },
];

const yearlyStats = [
  { ano: 2022, setoresRespondidos: 8, totalSetores: 12 },
  { ano: 2023, setoresRespondidos: 10, totalSetores: 12 },
  { ano: 2024, setoresRespondidos: 4, totalSetores: 6 },
];

const recentActivities = [
  {
    id: "1",
    setor: "Recursos Humanos",
    acao: "Diagnóstico Concluído",
    usuario: "Maria Silva",
    data: "Hoje, 14:30",
    status: "success"
  },
  {
    id: "2", 
    setor: "Financeiro",
    acao: "Respostas atualizadas",
    usuario: "João Santos",
    data: "Hoje, 11:20",
    status: "info"
  },
  {
    id: "3",
    setor: "Tecnologia da Informação",
    acao: "Diagnóstico pendente",
    usuario: "Ana Costa",
    data: "Ontem, 16:45",
    status: "warning"
  }
];

export function SectorSelectionDashboard({ onNavigateBack, onViewResponses }: SectorSelectionDashboardProps) {
  const [selectedSectorDetails, setSelectedSectorDetails] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState("2024");

  const filteredData = sectorData.filter(item => item.ano.toString() === selectedYear);
  
  // Calcular criticidade para cada setor respondido
  const sectorsWithCriticality = filteredData.map(sector => {
    if (!sector.respondido || sector.responses.length === 0) {
      return { ...sector, criticality: null };
    }
    
    const criticality = calculateCriticality(sector.responses);
    return { ...sector, criticality };
  });

  const setoresAlta = sectorsWithCriticality.filter(s => s.criticality?.level === 'alta').length;
  const setoresModerada = sectorsWithCriticality.filter(s => s.criticality?.level === 'moderada').length;
  const setoresBaixa = sectorsWithCriticality.filter(s => s.criticality?.level === 'baixa').length;
  const setoresRespondidos = filteredData.filter(s => s.respondido).length;
  const totalSetores = filteredData.length;
  const porcentagemRespondidos = Math.round((setoresRespondidos / totalSetores) * 100);

  const pieData = [
    { name: "Alta Criticidade", value: setoresAlta, color: "#ef4444" },
    { name: "Criticidade Moderada", value: setoresModerada, color: "#f59e0b" },
    { name: "Sem Criticidade", value: setoresBaixa, color: "#10b981" },
  ];

  const getCriticalityIcon = (level: string) => {
    switch (level) {
      case 'alta': return AlertTriangle;
      case 'moderada': return TrendingUp;
      case 'baixa': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getCriticalityBadgeVariant = (level: string) => {
    switch (level) {
      case 'alta': return "destructive";
      case 'moderada': return "secondary";
      case 'baixa': return "default";
      default: return "outline";
    }
  };

  if (selectedSectorDetails) {
    return (
      <SectorResponsesDetail
        sectorName={selectedSectorDetails}
        onNavigateBack={() => setSelectedSectorDetails(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Padronizado */}
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
              <h1 className="text-2xl font-bold">Dashboard - Diagnóstico de Seleção de Setores</h1>
              <p className="text-muted-foreground">Monitoramento e análise dos resultados</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onViewResponses}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver Respostas
          </Button>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
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

      {/* Métricas Gerais Padronizadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Setores Respondidos</p>
                <p className="text-2xl font-bold">{setoresRespondidos}</p>
                <p className="text-xs text-muted-foreground">
                  de {totalSetores} setores ({porcentagemRespondidos}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alta Criticidade</p>
                <p className="text-2xl font-bold text-red-600">{setoresAlta}</p>
                <p className="text-xs text-muted-foreground">setores críticos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Criticidade Moderada</p>
                <p className="text-2xl font-bold text-yellow-600">{setoresModerada}</p>
                <p className="text-xs text-muted-foreground">setores moderados</p>
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
                <p className="text-sm text-muted-foreground">Sem Criticidade</p>
                <p className="text-2xl font-bold text-green-600">{setoresBaixa}</p>
                <p className="text-xs text-muted-foreground">setores seguros</p>
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
                <p className="text-sm text-muted-foreground">Taxa de Participação</p>
                <p className="text-2xl font-bold text-blue-600">{porcentagemRespondidos}%</p>
                <p className="text-xs text-muted-foreground">dos setores participaram</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Padronizados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Criticidade</CardTitle>
            <CardDescription>Setores categorizados por nível de criticidade arquivística</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Evolução de Respostas por Ano</CardTitle>
            <CardDescription>Participação dos setores ao longo dos anos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ano" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="setoresRespondidos" fill="#3b82f6" name="Respondidos" />
                <Bar dataKey="totalSetores" fill="#e5e7eb" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes Padronizadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
          <CardDescription>Últimas ações realizadas nos diagnósticos</CardDescription>
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
                  <TableCell className="font-medium">{activity.setor}</TableCell>
                  <TableCell>{activity.acao}</TableCell>
                  <TableCell>{activity.usuario}</TableCell>
                  <TableCell>{activity.data}</TableCell>
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

      {/* Detalhamento por Setor */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Setor</CardTitle>
          <CardDescription>
            Status e classificação de criticidade arquivística para o ano {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setor</TableHead>
                <TableHead>Criticidade Arquivística</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pontuação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectorsWithCriticality.map((sector, index) => {
                const IconComponent = sector.criticality ? getCriticalityIcon(sector.criticality.level) : AlertCircle;
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{sector.sector}</TableCell>
                    <TableCell>
                      {sector.criticality ? (
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={getCriticalityBadgeVariant(sector.criticality.level)}
                            className="flex items-center gap-1"
                          >
                            <IconComponent className="h-3 w-3" />
                            {sector.criticality.level === 'alta' ? 'Alta Criticidade' :
                             sector.criticality.level === 'moderada' ? 'Criticidade Moderada' :
                             sector.criticality.level === 'baixa' ? 'Sem Criticidade' : 'Revisar'}
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="outline">Não avaliado</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sector.respondido ? "default" : "outline"}>
                        {sector.respondido ? "Respondido" : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sector.criticality ? `${sector.criticality.score}%` : '-'}
                    </TableCell>
                    <TableCell>
                      {sector.respondido ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedSectorDetails(sector.sector)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Ver Respostas
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          Enviar Lembrete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
