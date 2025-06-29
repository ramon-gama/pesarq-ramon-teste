import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectGanttChart } from "./ProjectGanttChart";
import { AttendanceTable } from "./attendance/AttendanceTable";
import { MonthlyReportsTable } from "./attendance/MonthlyReportsTable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Users, FileText, Calendar, Target, DollarSign, Building2, AlertTriangle, CheckCircle, UserCheck, X, Clock, UserX, ClockIcon, Filter, CalendarDays } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useAttendanceControl } from "@/hooks/useAttendanceControl";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ProjectsDashboard() {
  const { projects } = useProjects();
  const { 
    attendanceRecords, 
    monthlyReports, 
    loading, 
    fetchAttendanceRecords, 
    deleteAttendanceRecord, 
    generateMonthlyReport 
  } = useAttendanceControl();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Estados para filtros de período
  const [filterType, setFilterType] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Função para filtrar projetos por período
  const getFilteredProjects = () => {
    const now = new Date();
    
    return projects.filter(project => {
      const projectStartDate = new Date(project.start_date);
      const projectEndDate = project.end_date ? new Date(project.end_date) : now;
      
      switch (filterType) {
        case "this_week":
          const weekStart = startOfWeek(now, { locale: ptBR });
          const weekEnd = endOfWeek(now, { locale: ptBR });
          return isWithinInterval(projectStartDate, { start: weekStart, end: weekEnd }) ||
                 isWithinInterval(projectEndDate, { start: weekStart, end: weekEnd }) ||
                 (projectStartDate <= weekStart && projectEndDate >= weekEnd);
        
        case "last_week":
          const lastWeekStart = startOfWeek(subWeeks(now, 1), { locale: ptBR });
          const lastWeekEnd = endOfWeek(subWeeks(now, 1), { locale: ptBR });
          return isWithinInterval(projectStartDate, { start: lastWeekStart, end: lastWeekEnd }) ||
                 isWithinInterval(projectEndDate, { start: lastWeekStart, end: lastWeekEnd }) ||
                 (projectStartDate <= lastWeekStart && projectEndDate >= lastWeekEnd);
        
        case "this_month":
          const monthStart = startOfMonth(now);
          const monthEnd = endOfMonth(now);
          return isWithinInterval(projectStartDate, { start: monthStart, end: monthEnd }) ||
                 isWithinInterval(projectEndDate, { start: monthStart, end: monthEnd }) ||
                 (projectStartDate <= monthStart && projectEndDate >= monthEnd);
        
        case "last_month":
          const lastMonthStart = startOfMonth(subMonths(now, 1));
          const lastMonthEnd = endOfMonth(subMonths(now, 1));
          return isWithinInterval(projectStartDate, { start: lastMonthStart, end: lastMonthEnd }) ||
                 isWithinInterval(projectEndDate, { start: lastMonthStart, end: lastMonthEnd }) ||
                 (projectStartDate <= lastMonthStart && projectEndDate >= lastMonthEnd);
        
        case "custom":
          if (!customStartDate || !customEndDate) return true;
          const customStart = new Date(customStartDate);
          const customEnd = new Date(customEndDate);
          return isWithinInterval(projectStartDate, { start: customStart, end: customEnd }) ||
                 isWithinInterval(projectEndDate, { start: customStart, end: customEnd }) ||
                 (projectStartDate <= customStart && projectEndDate >= customEnd);
        
        default:
          return true;
      }
    });
  };

  const filteredProjects = getFilteredProjects();

  // Calcular estatísticas dos projetos filtrados
  const projectStats = {
    total: filteredProjects.length,
    planejamento: filteredProjects.filter(p => p.status === 'planejamento').length,
    andamento: filteredProjects.filter(p => p.status === 'andamento').length,
    finalizado: filteredProjects.filter(p => p.status === 'finalizado').length,
    suspenso: filteredProjects.filter(p => p.status === 'suspenso').length,
    cancelado: filteredProjects.filter(p => p.status === 'cancelado').length
  };

  // Dados simulados para frequência dos pesquisadores
  const attendanceStatusData = [
    { status: "Presente", percentage: 72, color: "#10b981" },
    { status: "Falta", percentage: 18, color: "#ef4444" },
    { status: "Parcial", percentage: 10, color: "#f59e0b" }
  ];

  // Dados simulados para justificativas de faltas
  const absenceJustificationData = [
    { justificativa: "Doença", quantidade: 45 },
    { justificativa: "Compromisso Acadêmico", quantidade: 32 },
    { justificativa: "Problema Familiar", quantidade: 18 },
    { justificativa: "Viagem", quantidade: 12 },
    { justificativa: "Outros", quantidade: 8 }
  ];

  // Dados simulados para histórico de presença mensal
  const monthlyAttendanceData = [
    { mes: "Jan", presente: 85, falta: 15, parcial: 8 },
    { mes: "Fev", presente: 78, falta: 22, parcial: 12 },
    { mes: "Mar", presente: 82, falta: 18, parcial: 10 },
    { mes: "Abr", presente: 88, falta: 12, parcial: 6 },
    { mes: "Mai", presente: 75, falta: 25, parcial: 14 },
    { mes: "Jun", presente: 80, falta: 20, parcial: 9 }
  ];

  // Dados simulados para projetos com maiores faltas
  const projectAbsenceData = [
    { projeto: "Arquivo Digital MS", faltas: 28 },
    { projeto: "Gestão Documental", faltas: 22 },
    { projeto: "Preservação Digital", faltas: 18 },
    { projeto: "Classificação", faltas: 15 },
    { projeto: "Outros Projetos", faltas: 12 }
  ];

  // Distribuição UnB vs Outras Instituições (baseada nos projetos filtrados)
  const institutionDistribution = filteredProjects.reduce((acc, project) => {
    const unbResearchers = Math.floor(project.researchers_count * 0.6); // Simulando 60% UnB
    const otherResearchers = project.researchers_count - unbResearchers;
    acc.unb += unbResearchers;
    acc.outras += otherResearchers;
    return acc;
  }, { unb: 0, outras: 0 });

  const totalResearchers = institutionDistribution.unb + institutionDistribution.outras;
  const unbPercentage = totalResearchers > 0 ? (institutionDistribution.unb / totalResearchers) * 100 : 0;
  const otherPercentage = totalResearchers > 0 ? (institutionDistribution.outras / totalResearchers) * 100 : 0;

  const institutionData = [
    { nome: "UnB", percentual: unbPercentage, quantidade: institutionDistribution.unb, cor: "#15AB92" },
    { nome: "Outras IFEs", percentual: otherPercentage, quantidade: institutionDistribution.outras, cor: "#3b82f6" }
  ];

  // Verificar conformidade normativa (1/3 mínimo da UnB)
  const isCompliant = unbPercentage >= 33.33;

  // Dados para status dos projetos (baseado nos projetos filtrados)
  const projectStatusData = [
    { name: "Planejamento", value: projectStats.planejamento, color: "#fbbf24" },
    { name: "Em Andamento", value: projectStats.andamento, color: "#3b82f6" },
    { name: "Finalizados", value: projectStats.finalizado, color: "#10b981" },
    { name: "Suspensos", value: projectStats.suspenso, color: "#f59e0b" },
    { name: "Cancelados", value: projectStats.cancelado, color: "#ef4444" }
  ].filter(item => item.value > 0);

  const monthlyProgressData = [
    { month: "Jan", progress: 10, budget: 12 },
    { month: "Fev", progress: 18, budget: 20 },
    { month: "Mar", progress: 25, budget: 28 },
    { month: "Abr", progress: 35, budget: 35 },
    { month: "Mai", progress: 42, budget: 45 },
    { month: "Jun", progress: 48, budget: 50 }
  ];

  const totalBudget = filteredProjects.reduce((acc, project) => acc + (project.total_value || 0), 0);
  const totalResearchersAll = filteredProjects.reduce((acc, project) => acc + (project.researchers_count || 0), 0);

  // Dados simulados para métricas de frequência
  const attendanceMetrics = {
    averageAbsencesPerMonth: 18.5,
    totalOwedHours: 245.5
  };

  // Renderizar label customizado para gráficos de pizza
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Criar um projeto simulado para o Gantt quando há projetos disponíveis
  const sampleProject = filteredProjects.length > 0 ? {
    ...filteredProjects[0],
    startDate: filteredProjects[0].start_date || "2024-01-01",
    endDate: filteredProjects[0].end_date || "2024-12-31",
    progress: 45
  } : null;

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteAttendanceRecord(id);
      await fetchAttendanceRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleGenerateReport = async (researcherId: string, month: number, year: number) => {
    try {
      await generateMonthlyReport(researcherId, month, year);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const getPeriodLabel = () => {
    switch (filterType) {
      case "this_week":
        return "Esta Semana";
      case "last_week":
        return "Semana Passada";
      case "this_month":
        return "Este Mês";
      case "last_month":
        return "Mês Passado";
      case "custom":
        if (customStartDate && customEndDate) {
          return `${format(new Date(customStartDate), "dd/MM/yyyy")} - ${format(new Date(customEndDate), "dd/MM/yyyy")}`;
        }
        return "Período Personalizado";
      default:
        return "Todos os Projetos";
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Filtro de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            Filtro por Período - {getPeriodLabel()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="filter-type">Tipo de Período</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Projetos</SelectItem>
                  <SelectItem value="this_week">Esta Semana</SelectItem>
                  <SelectItem value="last_week">Semana Passada</SelectItem>
                  <SelectItem value="this_month">Este Mês</SelectItem>
                  <SelectItem value="last_month">Mês Passado</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterType === "custom" && (
              <>
                <div>
                  <Label htmlFor="start-date">Data Inicial</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Data Final</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDays className="h-4 w-4" />
              <span>{filteredProjects.length} projetos encontrados</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerta de Conformidade Normativa */}
      {!isCompliant && totalResearchers > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Atenção:</strong> A proporção de pesquisadores da UnB está em {unbPercentage.toFixed(1)}%. 
            Por questões normativas, pelo menos 33,3% dos pesquisadores devem ser da UnB.
          </AlertDescription>
        </Alert>
      )}

      {/* Cards de Resumo Executivo */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Total de Projetos</CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{projectStats.total}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">no período</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Em Andamento</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{projectStats.andamento}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">projetos ativos</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Finalizados</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{projectStats.finalizado}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">concluídos</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Média Faltas/Mês</CardTitle>
            <UserX className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{attendanceMetrics.averageAbsencesPerMonth}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">faltas mensais</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Horas Devidas</CardTitle>
            <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{attendanceMetrics.totalOwedHours}h</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">total acumulado</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Orçamento Total</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-sm sm:text-base lg:text-lg font-bold">
              R$ {(totalBudget / 1000000).toFixed(1)}M
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">investido</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Gráficos de Frequência */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status da Frequência em % */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              Status da Frequência dos Pesquisadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attendanceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {attendanceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Justificativas de Faltas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              Justificativas de Faltas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={absenceJustificationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="justificativa" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={10}
                />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Histórico de Presença Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              Histórico de Presença Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" fontSize={12} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Legend />
                <Bar dataKey="presente" fill="#10b981" name="Presente" />
                <Bar dataKey="falta" fill="#ef4444" name="Falta" />
                <Bar dataKey="parcial" fill="#f59e0b" name="Parcial" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Projetos com Maiores Faltas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Projetos com Maiores Faltas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectAbsenceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={10} />
                <YAxis 
                  dataKey="projeto" 
                  type="category" 
                  width={100}
                  fontSize={10}
                />
                <Tooltip />
                <Bar dataKey="faltas" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Status e Distribuição Institucional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status dos Projetos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Status dos Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição Institucional */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Distribuição Institucional de Pesquisadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={institutionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percentual }) => `${nome}: ${percentual.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {institutionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, 'Pesquisadores']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cronograma de Projetos */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">Cronograma</TabsTrigger>
          <TabsTrigger value="progress">Progresso Mensal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Cronograma dos Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              {sampleProject ? (
                <ProjectGanttChart project={sampleProject} />
              ) : (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <p>Nenhum projeto disponível para exibir o cronograma no período selecionado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Progresso Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#15AB92" 
                    strokeWidth={2}
                    name="Progresso Real"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Orçamento Executado"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
