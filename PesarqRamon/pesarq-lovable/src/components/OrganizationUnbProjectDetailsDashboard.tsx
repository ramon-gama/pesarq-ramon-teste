
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowLeft, Package, FileText, Search, Calendar, TrendingUp, Check } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { OrganizationUnbProject } from "@/hooks/useOrganizationUnbProjects";

interface OrganizationUnbProjectDetailsDashboardProps {
  project: OrganizationUnbProject;
  onBack: () => void;
}

export function OrganizationUnbProjectDetailsDashboard({ project, onBack }: OrganizationUnbProjectDetailsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calcular estatísticas do projeto
  const totalBoxes = (project.boxes_to_describe || 0) + (project.boxes_to_digitalize || 0);
  const classifiedBoxes = Math.round((totalBoxes * (project.progress || 0)) / 100);
  const orderedBoxes = Math.round(classifiedBoxes * 0.8); // Assumindo 80% das classificadas estão ordenadas
  const indexedBoxes = Math.round(orderedBoxes * 0.6); // Assumindo 60% das ordenadas estão indexadas

  // Dados para gráficos
  const boxesProgressData = [
    { name: 'Contratadas', value: totalBoxes, color: '#e5e7eb' },
    { name: 'Classificadas', value: classifiedBoxes, color: '#3b82f6' },
    { name: 'Ordenadas', value: orderedBoxes, color: '#10b981' },
    { name: 'Indexadas', value: indexedBoxes, color: '#8b5cf6' }
  ];

  // Dados do gráfico de progresso temporal
  const timelineData = project.goals?.map((goal, index) => ({
    meta: `Meta ${goal.number}`,
    progresso: goal.progress,
    prazo: goal.end_date ? differenceInDays(parseISO(goal.end_date), new Date()) : 0
  })) || [];

  // Dados para o gráfico de Gantt simplificado
  const ganttData = project.goals?.map(goal => {
    const startDate = goal.start_date ? parseISO(goal.start_date) : parseISO(project.start_date);
    const endDate = goal.end_date ? parseISO(goal.end_date) : (project.end_date ? parseISO(project.end_date) : new Date());
    const totalDays = differenceInDays(endDate, startDate);
    const progressDays = Math.round((totalDays * goal.progress) / 100);
    
    return {
      meta: `Meta ${goal.number}`,
      inicio: format(startDate, 'dd/MM/yyyy'),
      fim: format(endDate, 'dd/MM/yyyy'),
      progresso: goal.progress,
      diasRestantes: Math.max(0, differenceInDays(endDate, new Date())),
      diasTotais: totalDays,
      diasConcluidos: progressDays
    };
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'planejamento': { label: 'Planejamento', variant: 'secondary' as const },
      'andamento': { label: 'Em Andamento', variant: 'default' as const },
      'finalizado': { label: 'Finalizado', variant: 'secondary' as const },
      'suspenso': { label: 'Suspenso', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planejamento;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600">Dashboard de Acompanhamento do Projeto</p>
          </div>
        </div>
        {getStatusBadge(project.status)}
      </div>

      {/* Cards de Progresso */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Caixas Classificadas</p>
                <p className="text-3xl font-bold text-blue-600">{classifiedBoxes}</p>
                <p className="text-xs text-gray-500">de {totalBoxes} contratadas</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <Progress value={(classifiedBoxes / totalBoxes) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Caixas Ordenadas</p>
                <p className="text-3xl font-bold text-green-600">{orderedBoxes}</p>
                <p className="text-xs text-gray-500">de {classifiedBoxes} classificadas</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Progress value={classifiedBoxes > 0 ? (orderedBoxes / classifiedBoxes) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Caixas Indexadas</p>
                <p className="text-3xl font-bold text-purple-600">{indexedBoxes}</p>
                <p className="text-xs text-gray-500">de {orderedBoxes} ordenadas</p>
              </div>
              <Search className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <Progress value={orderedBoxes > 0 ? (indexedBoxes / orderedBoxes) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progresso Geral</p>
                <p className="text-3xl font-bold text-orange-600">{project.progress || 0}%</p>
                <p className="text-xs text-gray-500">do projeto</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-4">
              <Progress value={project.progress || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Abas de conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">📊 Visão Geral</TabsTrigger>
          <TabsTrigger value="progress">📈 Progresso das Etapas</TabsTrigger>
          <TabsTrigger value="gantt">📅 Cronograma (Gantt)</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Informações do Projeto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Período de Execução</h4>
                  <p className="text-sm text-gray-600">
                    {format(parseISO(project.start_date), "dd/MM/yyyy", { locale: ptBR })}
                    {project.end_date && (
                      <> até {format(parseISO(project.end_date), "dd/MM/yyyy", { locale: ptBR })}</>
                    )}
                  </p>
                </div>

                {project.total_value && (
                  <div>
                    <h4 className="font-semibold mb-2">Valor Total</h4>
                    <p className="text-lg font-medium text-green-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(project.total_value)}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Escopo Físico</h4>
                  <div className="space-y-1 text-sm">
                    {project.documents_meters && (
                      <p>📏 {project.documents_meters} metros lineares</p>
                    )}
                    {project.boxes_to_describe && (
                      <p>📦 {project.boxes_to_describe} caixas para descrição</p>
                    )}
                    {project.boxes_to_digitalize && (
                      <p>💾 {project.boxes_to_digitalize} caixas para digitalização</p>
                    )}
                  </div>
                </div>

                {project.responsibles && project.responsibles.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Responsáveis</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.responsibles.map((responsible, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {responsible.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição das Caixas</CardTitle>
                <CardDescription>Status atual do processamento</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={boxesProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progresso por Meta */}
            <Card>
              <CardHeader>
                <CardTitle>Progresso por Meta</CardTitle>
                <CardDescription>Acompanhamento individual das metas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="meta" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progresso" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Evolução Temporal */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução Temporal</CardTitle>
                <CardDescription>Progresso ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="meta" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="progresso" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Lista detalhada das metas */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento das Metas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.goals?.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Meta {goal.number}</h4>
                      <Badge variant="outline">{goal.progress}% concluída</Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progresso</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    {goal.responsible && (
                      <div className="mt-3 text-sm">
                        <span className="text-gray-600">Responsável: </span>
                        <span className="font-medium">{goal.responsible}</span>
                      </div>
                    )}

                    {goal.deliverables && goal.deliverables.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-1">Entregáveis:</h5>
                        <div className="space-y-1">
                          {goal.deliverables.map((deliverable, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              {deliverable.completed ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <div className="h-3 w-3 border rounded" />
                              )}
                              <span className={deliverable.completed ? 'line-through text-gray-500' : ''}>
                                {deliverable.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gantt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cronograma do Projeto (Gráfico de Gantt)
              </CardTitle>
              <CardDescription>
                Visualização temporal das metas e seus prazos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ganttData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-sm">{item.meta}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.progresso}%
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.inicio} - {item.fim}
                      </div>
                    </div>
                    
                    <div className="relative">
                      {/* Barra de progresso estilo Gantt */}
                      <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${item.progresso}%` }}
                        >
                          {item.progresso > 15 && `${item.progresso}%`}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-700">
                          {item.diasRestantes > 0 ? `${item.diasRestantes} dias restantes` : 'Prazo expirado'}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Dias concluídos: {item.diasConcluidos}</span>
                      <span>Total: {item.diasTotais} dias</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
