import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { Archive, FileText, Users, TrendingUp, TrendingDown, Building2, Target, CheckCircle, Clock, Database, Shield, Activity, Folder, HardDrive, BarChart3, AlertTriangle, MapPin, Calculator, Timer, Package, Settings, Briefcase, ClipboardList, TrendingUpIcon, ChevronLeft, ChevronRight, Search, Filter, Trash2, FolderOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Dashboard() {
  const {
    userProfile
  } = useAuth();

  // Função para determinar a saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Bom dia";
    } else if (hour >= 12 && hour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };

  // Dados arquivísticos específicos do órgão
  const archivalData = {
    paperDocumentsMeters: 1345,
    seiProcessesCount: 3234123,
    archiveTeam: 40,
    maturityLevel: 3.2,
    maxMaturityLevel: 5.0,
    maturityStatus: 'Essencial',
    monthlyComplianceRate: 87.5,
    computerizedSystems: 12,
    internalNorms: 8,
    estimatedMonthlyCost: 145000,
    costTrend: 'up',
    avgPaperRetrievalTime: 15,
    dailyDocumentProduction: 568,
    documentsEliminatedPercent: 12.3,
    eliminatedBoxes: 847, // Total de caixas eliminadas
    totalArchiveBoxes: 2847,
    totalProducts: 156,
    monthlyArchivalServices: 67,
    collectedDocuments: 1543, // Documentos recolhidos
    collectedBoxes: 423 // Caixas recolhidas
  };

  // Distribuição do volume documental - Arquivo vs Setores de Trabalho
  const volumeDistributionData = [
    {
      categoria: 'Setor de Arquivo',
      caixas: 1847,
      metrosLineares: 278
    },
    {
      categoria: 'Setor Administrativo',
      caixas: 567,
      metrosLineares: 85
    },
    {
      categoria: 'Setor Jurídico',
      caixas: 423,
      metrosLineares: 63
    },
    {
      categoria: 'Setor Técnico',
      caixas: 398,
      metrosLineares: 60
    },
    {
      categoria: 'Setor Financeiro',
      caixas: 312,
      metrosLineares: 47
    },
    {
      categoria: 'Setor de RH',
      caixas: 234,
      metrosLineares: 35
    }
  ];

  // Documentos eliminados por ano
  const eliminationByYearData = [
    {
      ano: '2019',
      caixas: 45,
      documentos: 2890
    },
    {
      ano: '2020',
      caixas: 67,
      documentos: 4320
    },
    {
      ano: '2021',
      caixas: 89,
      documentos: 5670
    },
    {
      ano: '2022',
      caixas: 123,
      documentos: 7850
    },
    {
      ano: '2023',
      caixas: 156,
      documentos: 9940
    }
  ];

  // Documentos recolhidos ao Arquivo Nacional por ano
  const collectionByYearData = [
    {
      ano: '2019',
      caixas: 23,
      documentos: 1450
    },
    {
      ano: '2020',
      caixas: 34,
      documentos: 2180
    },
    {
      ano: '2021',
      caixas: 45,
      documentos: 2890
    },
    {
      ano: '2022',
      caixas: 67,
      documentos: 4320
    },
    {
      ano: '2023',
      caixas: 89,
      documentos: 5670
    }
  ];

  // Estados brasileiros com dados de volume documental - ORDENADOS ALFABETICAMENTE
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  
  const stateDocumentVolume = [
    { estado: 'Acre', sigla: 'AC', capacidade: 70, ocupacao: 65, caixas: 1098, risco: 'alto' },
    { estado: 'Alagoas', sigla: 'AL', capacidade: 100, ocupacao: 95, caixas: 2321, risco: 'alto' },
    { estado: 'Amapá', sigla: 'AP', capacidade: 60, ocupacao: 58, caixas: 987, risco: 'alto' },
    { estado: 'Bahia', sigla: 'BA', capacidade: 290, ocupacao: 278, caixas: 6543, risco: 'alto' },
    { estado: 'Ceará', sigla: 'CE', capacidade: 200, ocupacao: 187, caixas: 3987, risco: 'médio' },
    { estado: 'Distrito Federal', sigla: 'DF', capacidade: 180, ocupacao: 145, caixas: 1654, risco: 'baixo' },
    { estado: 'Espírito Santo', sigla: 'ES', capacidade: 125, ocupacao: 89, caixas: 1321, risco: 'baixo' },
    { estado: 'Goiás', sigla: 'GO', capacidade: 170, ocupacao: 143, caixas: 2765, risco: 'médio' },
    { estado: 'Maranhão', sigla: 'MA', capacidade: 140, ocupacao: 132, caixas: 2987, risco: 'alto' },
    { estado: 'Mato Grosso', sigla: 'MT', capacidade: 150, ocupacao: 98, caixas: 1876, risco: 'médio' },
    { estado: 'Mato Grosso do Sul', sigla: 'MS', capacidade: 135, ocupacao: 87, caixas: 1765, risco: 'baixo' },
    { estado: 'Minas Gerais', sigla: 'MG', capacidade: 320, ocupacao: 298, caixas: 7654, risco: 'baixo' },
    { estado: 'Pará', sigla: 'PA', capacidade: 160, ocupacao: 145, caixas: 3654, risco: 'alto' },
    { estado: 'Paraíba', sigla: 'PB', capacidade: 120, ocupacao: 108, caixas: 2543, risco: 'médio' },
    { estado: 'Paraná', sigla: 'PR', capacidade: 250, ocupacao: 210, caixas: 4876, risco: 'baixo' },
    { estado: 'Pernambuco', sigla: 'PE', capacidade: 180, ocupacao: 165, caixas: 4321, risco: 'alto' },
    { estado: 'Piauí', sigla: 'PI', capacidade: 110, ocupacao: 89, caixas: 2109, risco: 'alto' },
    { estado: 'Rio de Janeiro', sigla: 'RJ', capacidade: 380, ocupacao: 342, caixas: 8934, risco: 'alto' },
    { estado: 'Rio Grande do Norte', sigla: 'RN', capacidade: 130, ocupacao: 112, caixas: 1987, risco: 'médio' },
    { estado: 'Rio Grande do Sul', sigla: 'RS', capacidade: 270, ocupacao: 198, caixas: 5432, risco: 'médio' },
    { estado: 'Rondônia', sigla: 'RO', capacidade: 85, ocupacao: 78, caixas: 1432, risco: 'alto' },
    { estado: 'Roraima', sigla: 'RR', capacidade: 55, ocupacao: 52, caixas: 876, risco: 'alto' },
    { estado: 'Santa Catarina', sigla: 'SC', capacidade: 190, ocupacao: 156, caixas: 3210, risco: 'baixo' },
    { estado: 'São Paulo', sigla: 'SP', capacidade: 450, ocupacao: 387, caixas: 12450, risco: 'médio' },
    { estado: 'Sergipe', sigla: 'SE', capacidade: 90, ocupacao: 76, caixas: 1543, risco: 'médio' },
    { estado: 'Tocantins', sigla: 'TO', capacidade: 95, ocupacao: 72, caixas: 1210, risco: 'médio' }
  ];

  const getRiskColor = (risco: string) => {
    switch (risco) {
      case 'alto': return 'text-red-700 bg-red-100 border-red-200';
      case 'médio': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'baixo': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (risco: string) => {
    switch (risco) {
      case 'alto': return <AlertTriangle className="h-3 w-3" />;
      case 'médio': return <AlertTriangle className="h-3 w-3" />;
      case 'baixo': return <CheckCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const nextState = () => {
    setCurrentStateIndex((prev) => (prev + 1) % stateDocumentVolume.length);
  };

  const prevState = () => {
    setCurrentStateIndex((prev) => (prev - 1 + stateDocumentVolume.length) % stateDocumentVolume.length);
  };

  const visibleStates = [
    stateDocumentVolume[currentStateIndex],
    stateDocumentVolume[(currentStateIndex + 1) % stateDocumentVolume.length],
    stateDocumentVolume[(currentStateIndex + 2) % stateDocumentVolume.length],
    stateDocumentVolume[(currentStateIndex + 3) % stateDocumentVolume.length]
  ];

  // Estados filtráveis por risco
  const [riskFilter, setRiskFilter] = useState("all");
  const [stateSearch, setStateSearch] = useState("");

  // Estados em risco baseado nos critérios mencionados
  const statesAtRisk = stateDocumentVolume.filter(state => state.risco === 'alto');

  // Filtrar estados por risco e busca
  const getFilteredStates = () => {
    let filtered = stateDocumentVolume;
    
    if (riskFilter !== "all") {
      filtered = filtered.filter(state => state.risco === riskFilter);
    }
    
    if (stateSearch) {
      filtered = filtered.filter(state => 
        state.estado.toLowerCase().includes(stateSearch.toLowerCase()) ||
        state.sigla.toLowerCase().includes(stateSearch.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Crescimento de documentos digitais
  const digitalGrowthData = [{
    ano: '2019',
    documentos: 28500
  }, {
    ano: '2020',
    documentos: 32100
  }, {
    ano: '2021',
    documentos: 37800
  }, {
    ano: '2022',
    documentos: 41200
  }, {
    ano: '2023',
    documentos: 45678
  }];

  // Projeção do crescimento de documentos no SEI até 2030
  const seiProjectionData = [{
    ano: '2024',
    documentos: 3234123,
    projecao: true
  }, {
    ano: '2025',
    documentos: 3890000,
    projecao: true
  }, {
    ano: '2026',
    documentos: 4680000,
    projecao: true
  }, {
    ano: '2027',
    documentos: 5620000,
    projecao: true
  }, {
    ano: '2028',
    documentos: 6750000,
    projecao: true
  }, {
    ano: '2029',
    documentos: 8100000,
    projecao: true
  }, {
    ano: '2030',
    documentos: 9720000,
    projecao: true
  }];

  // Perfil da equipe do arquivo
  const teamProfileData = [{
    categoria: 'Arquivistas',
    quantidade: 12,
    cor: '#15AB92'
  }, {
    categoria: 'Técnicos',
    quantidade: 18,
    cor: '#3B82F6'
  }, {
    categoria: 'Auxiliares',
    quantidade: 8,
    cor: '#8B5CF6'
  }, {
    categoria: 'Estagiários',
    quantidade: 2,
    cor: '#F59E0B'
  }];

  // Status do tratamento documental
  const documentProcessingData = [{
    status: 'Tratados',
    quantidade: 8945,
    cor: '#10B981'
  }, {
    status: 'Não Tratados',
    quantidade: 3876,
    cor: '#EF4444'
  }];

  // Serviços mais demandados
  const servicesData = [{
    servico: 'Consulta de Documentos',
    demanda: 35
  }, {
    servico: 'Empréstimo de Processos',
    demanda: 28
  }, {
    servico: 'Digitalização',
    demanda: 18
  }, {
    servico: 'Orientação Técnica',
    demanda: 12
  }, {
    servico: 'Eliminação',
    demanda: 7
  }];

  // Evolução do planejamento estratégico - dados mais claros
  const strategicPlanningData = [
    {
      trimestre: '1º Trim',
      objetivosConcluidos: 65,
      objetivosPrevistos: 80,
      metasConcluidas: 78,
      metasPrevistas: 95
    },
    {
      trimestre: '2º Trim',
      objetivosConcluidos: 78,
      objetivosPrevistos: 85,
      metasConcluidas: 85,
      metasPrevistas: 100
    },
    {
      trimestre: '3º Trim',
      objetivosConcluidos: 82,
      objetivosPrevistos: 90,
      metasConcluidas: 92,
      metasPrevistas: 105
    },
    {
      trimestre: '4º Trim',
      objetivosConcluidos: 85,
      objetivosPrevistos: 95,
      metasConcluidas: 98,
      metasPrevistas: 110
    }
  ];

  // Uso de papel por estados e setores - dados combinados
  const paperUsageByStateAndSector = [
    { estado: 'SP', setor: 'Administrativo', consumo: 2890, sigla: 'SP' },
    { estado: 'SP', setor: 'Jurídico', consumo: 2156, sigla: 'SP' },
    { estado: 'SP', setor: 'Técnico', consumo: 3245, sigla: 'SP' },
    { estado: 'RJ', setor: 'Administrativo', consumo: 1976, sigla: 'RJ' },
    { estado: 'RJ', setor: 'Jurídico', consumo: 1543, sigla: 'RJ' },
    { estado: 'RJ', setor: 'Técnico', consumo: 2187, sigla: 'RJ' },
    { estado: 'MG', setor: 'Administrativo', consumo: 1654, sigla: 'MG' },
    { estado: 'MG', setor: 'Jurídico', consumo: 1234, sigla: 'MG' },
    { estado: 'MG', setor: 'Técnico', consumo: 1876, sigla: 'MG' },
    { estado: 'BA', setor: 'Administrativo', consumo: 1432, sigla: 'BA' },
    { estado: 'BA', setor: 'Jurídico', consumo: 987, sigla: 'BA' },
    { estado: 'BA', setor: 'Técnico', consumo: 1543, sigla: 'BA' },
    { estado: 'RS', setor: 'Administrativo', consumo: 1298, sigla: 'RS' },
    { estado: 'RS', setor: 'Jurídico', consumo: 876, sigla: 'RS' },
    { estado: 'RS', setor: 'Técnico', consumo: 1387, sigla: 'RS' },
    { estado: 'PR', setor: 'Administrativo', consumo: 1156, sigla: 'PR' },
    { estado: 'PR', setor: 'Jurídico', consumo: 743, sigla: 'PR' },
    { estado: 'PR', setor: 'Técnico', consumo: 1234, sigla: 'PR' }
  ];

  // Dados de uso de papel reorganizados por estado - ORDENADOS ALFABETICAMENTE
  const paperUsageStates = [
    { 
      estado: 'Bahia', 
      sigla: 'BA', 
      administrativo: 1432, 
      juridico: 987, 
      tecnico: 1543,
      total: 3962
    },
    { 
      estado: 'Minas Gerais', 
      sigla: 'MG', 
      administrativo: 1654, 
      juridico: 1234, 
      tecnico: 1876,
      total: 4764
    },
    { 
      estado: 'Paraná', 
      sigla: 'PR', 
      administrativo: 1156, 
      juridico: 743, 
      tecnico: 1234,
      total: 3133
    },
    { 
      estado: 'Rio de Janeiro', 
      sigla: 'RJ', 
      administrativo: 1976, 
      juridico: 1543, 
      tecnico: 2187,
      total: 5706
    },
    { 
      estado: 'Rio Grande do Sul', 
      sigla: 'RS', 
      administrativo: 1298, 
      juridico: 876, 
      tecnico: 1387,
      total: 3561
    },
    { 
      estado: 'São Paulo', 
      sigla: 'SP', 
      administrativo: 2890, 
      juridico: 2156, 
      tecnico: 3245,
      total: 8291
    }
  ];

  // Filtros para o gráfico de papel
  const [paperStateFilter, setPaperStateFilter] = useState("all");
  const [paperSectorFilter, setPaperSectorFilter] = useState("all");

  // Filtrar dados do gráfico de papel
  const getFilteredPaperData = () => {
    let filtered = paperUsageStates;
    
    if (paperStateFilter !== "all") {
      filtered = filtered.filter(state => state.sigla === paperStateFilter);
    }
    
    return filtered.sort((a, b) => b.total - a.total);
  };

  return <div className="min-h-screen bg-background w-full">
      <div className="space-y-3 sm:space-y-4 md:space-y-6 p-3 sm:p-4 lg:p-6">
        {/* Welcome Header */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-[#15AB92] text-white p-4 sm:p-6 rounded-lg">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
              {getGreeting()}, {userProfile?.name || 'Usuário'}!
            </h1>
            <p className="text-green-100 text-sm sm:text-base">Bem-vindo ao BI Arquivístico - Panorama geral da gestão de documentos na sua Organização</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4 sm:mb-6">
          <Badge variant="secondary" className="text-xs">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </Badge>
        </div>

        {/* Cards Principais de Dados Arquivísticos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Documentos em Papel</CardTitle>
              <Archive className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.paperDocumentsMeters.toLocaleString()}</div>
              <p className="text-xs text-blue-500">Metros Lineares</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Documentos Digitais</CardTitle>
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.seiProcessesCount.toLocaleString()}</div>
              <p className="text-xs text-green-500">Total de Processos no SEI</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Equipe de Arquivo</CardTitle>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.archiveTeam}</div>
              <p className="text-xs text-purple-500">Colaboradores</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Taxa de Conformidade</CardTitle>
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.monthlyComplianceRate}%</div>
              <p className="text-xs text-emerald-500">da Organização</p>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Serviços e Performance - Incluindo card de Documentos Recolhidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Custo Estimado Mensal</CardTitle>
              <div className="flex items-center gap-1">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                {archivalData.costTrend === 'up' ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">R$ 145 mil</div>
              <p className="text-xs text-orange-500">Gestão de Documentos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Sistemas Informatizados</CardTitle>
              <Database className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.computerizedSystems}</div>
              <p className="text-xs text-indigo-500">Sistemas Ativos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-teal-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Normas Internas</CardTitle>
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.internalNorms}</div>
              <p className="text-xs text-teal-500">Normas Vigentes</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-violet-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Documentos Recolhidos</CardTitle>
              <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.collectedDocuments.toLocaleString()}</div>
              <p className="text-xs text-violet-500">{archivalData.collectedBoxes} caixas ao Arquivo Nacional</p>
            </CardContent>
          </Card>
        </div>

        {/* Métricas Operacionais - Card de Eliminação Atualizado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-pink-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Nível de Maturidade</CardTitle>
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.maturityLevel}/{archivalData.maxMaturityLevel}</div>
              <p className="text-xs text-pink-500">{archivalData.maturityStatus}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Tempo Médio Recuperação</CardTitle>
              <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.avgPaperRetrievalTime}</div>
              <p className="text-xs text-yellow-500">Horas (documentos papel)</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Caixas Eliminadas</CardTitle>
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.eliminatedBoxes.toLocaleString()}</div>
              <p className="text-xs text-red-500">{archivalData.documentsEliminatedPercent}% do volume total</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-slate-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Documentos Produzidos/Dia</CardTitle>
              <TrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{archivalData.dailyDocumentProduction}</div>
              <p className="text-xs text-slate-500">Média Diária</p>
            </CardContent>
          </Card>
        </div>

        {/* Novo Gráfico: Distribuição do Volume - Arquivo x Setores de Trabalho */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800">Distribuição do Volume Documental</CardTitle>
            <p className="text-xs sm:text-sm text-gray-600">Setor de Arquivo vs Setores de Trabalho (caixas e metros lineares)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={volumeDistributionData} margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 80
              }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="categoria" 
                  fontSize={12} 
                  stroke="#666" 
                  angle={-45}
                  textAnchor="end" 
                  height={80}
                />
                <YAxis fontSize={12} stroke="#666" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px'
                  }}
                  formatter={(value: any, name: string) => [
                    `${value.toLocaleString()}`,
                    name === 'caixas' ? 'Caixas-arquivo' : 'Metros Lineares'
                  ]}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
                  formatter={(value) => value === 'caixas' ? 'Caixas-arquivo' : 'Metros Lineares'}
                />
                <Bar dataKey="caixas" fill="#15AB92" name="caixas" radius={[2, 2, 0, 0]} />
                <Bar dataKey="metrosLineares" fill="#3B82F6" name="metrosLineares" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Novos Gráficos: Eliminação e Recolhimento por Ano */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Documentos Eliminados por Ano */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800">Documentos Eliminados por Ano</CardTitle>
              <p className="text-xs sm:text-sm text-gray-600">Volume de eliminação documental anual</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eliminationByYearData} margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20
                }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="ano" fontSize={12} stroke="#666" />
                  <YAxis fontSize={12} stroke="#666" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                    formatter={(value: any, name: string) => [
                      `${value.toLocaleString()}`,
                      name === 'caixas' ? 'Caixas Eliminadas' : 'Documentos Eliminados'
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
                    formatter={(value) => value === 'caixas' ? 'Caixas Eliminadas' : 'Documentos Eliminados'}
                  />
                  <Bar dataKey="caixas" fill="#EF4444" name="caixas" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="documentos" fill="#F87171" name="documentos" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Documentos Recolhidos ao Arquivo Nacional por Ano */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800">Recolhimento ao Arquivo Nacional por Ano</CardTitle>
              <p className="text-xs sm:text-sm text-gray-600">Volume de documentos recolhidos anualmente</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={collectionByYearData} margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20
                }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="ano" fontSize={12} stroke="#666" />
                  <YAxis fontSize={12} stroke="#666" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                    formatter={(value: any, name: string) => [
                      `${value.toLocaleString()}`,
                      name === 'caixas' ? 'Caixas Recolhidas' : 'Documentos Recolhidos'
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
                    formatter={(value) => value === 'caixas' ? 'Caixas Recolhidas' : 'Documentos Recolhidos'}
                  />
                  <Bar dataKey="caixas" fill="#8B5CF6" name="caixas" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="documentos" fill="#A78BFA" name="documentos" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Principais - Legendas Melhoradas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Crescimento de Documentos Digitais */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800">Crescimento Anual dos Documentos no SEI</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={digitalGrowthData} margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15AB92" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#15AB92" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="ano" fontSize={12} stroke="#666" />
                  <YAxis fontSize={12} stroke="#666" />
                  <Tooltip contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }} />
                  <Area type="monotone" dataKey="documentos" stroke="#15AB92" strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Projeção do Crescimento de Documentos no SEI até 2030 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800">Projeção do Crescimento de Documentos no SEI até 2030</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={seiProjectionData} margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
                  <defs>
                    <linearGradient id="projectionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="ano" fontSize={12} stroke="#666" />
                  <YAxis fontSize={12} stroke="#666" tickFormatter={value => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }} formatter={(value: any) => [`${value.toLocaleString()} documentos`, 'Projeção']} />
                  <Area type="monotone" dataKey="documentos" stroke="#3B82F6" strokeWidth={3} fill="url(#projectionGradient)" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Perfil da Equipe do Arquivo */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800">Perfil da Equipe do Arquivo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={teamProfileData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} fill="#8884d8" dataKey="quantidade" label={({
                  categoria,
                  quantidade,
                  percent
                }) => `${categoria}: ${quantidade} (${(percent * 100).toFixed(0)}%)`} fontSize={10}>
                    {teamProfileData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.cor} />)}
                  </Pie>
                  <Tooltip contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status do Tratamento Documental */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800">Status do Tratamento Documental</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={documentProcessingData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} fill="#8884d8" dataKey="quantidade" label={({
                  status,
                  quantidade,
                  percent
                }) => `${status}: ${quantidade.toLocaleString()} (${(percent * 100).toFixed(0)}%)`} fontSize={10}>
                    {documentProcessingData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.cor} />)}
                  </Pie>
                  <Tooltip contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Secundários - Legendas Melhoradas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Serviços Mais Demandados */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800">Serviços Mais Demandados</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={servicesData} margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 80
              }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="servico" fontSize={11} angle={-45} textAnchor="end" height={80} stroke="#666" />
                  <YAxis fontSize={12} stroke="#666" />
                  <Tooltip contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }} />
                  <Bar dataKey="demanda" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Evolução do Planejamento Estratégico */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800">Evolução do Planejamento Estratégico</CardTitle>
              <p className="text-xs sm:text-sm text-gray-600">Acompanhamento de objetivos e metas por trimestre</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={strategicPlanningData} margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="trimestre" fontSize={12} stroke="#666" />
                  <YAxis fontSize={12} stroke="#666" />
                  <Tooltip contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="objetivosConcluidos" fill="#10B981" name="Objetivos Concluídos" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="objetivosPrevistos" fill="#34D399" name="Objetivos Previstos" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="metasConcluidas" fill="#3B82F6" name="Metas Concluídas" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="metasPrevistas" fill="#60A5FA" name="Metas Previstas" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Volume Documental nos Estados - Carrossel */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-lg font-semibold text-gray-800">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#15AB92]" />
                  Volume Documental nos Estados
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Acervo em caixas-arquivo por unidade federativa (ordem alfabética)</p>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={prevState}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextState}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {visibleStates.map((local, index) => (
                <div key={local.sigla} className="p-3 sm:p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm sm:text-base">{local.estado}</h4>
                      <p className="text-xs text-gray-600">{local.sigla}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 border ${getRiskColor(local.risco)}`}>
                      {getRiskIcon(local.risco)}
                      {local.risco}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Capacidade:</span>
                      <span className="font-medium">{local.capacidade}m³</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Ocupação:</span>
                      <span className="font-medium">{local.ocupacao}m³</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Caixas-arquivo:</span>
                      <span className="font-medium text-[#15AB92]">{local.caixas.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-gradient-to-r from-[#15AB92] to-[#0d8f7a] h-2 rounded-full transition-all duration-300" style={{
                        width: `${(local.ocupacao / local.capacidade) * 100}%`
                      }}></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {Math.round((local.ocupacao / local.capacidade) * 100)}% ocupado
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <p className="text-xs text-gray-500">
                {currentStateIndex + 1} - {Math.min(currentStateIndex + 4, stateDocumentVolume.length)} de {stateDocumentVolume.length} estados
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Estados em Situação de Risco com Filtros */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-lg font-semibold text-gray-800">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  Estados em Situação de Risco
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Baseado em: sinistros, exposição a riscos, tempo de recuperação, saúde dos servidores e infraestrutura (ordem alfabética)
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por estado..."
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por risco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os níveis</SelectItem>
                    <SelectItem value="alto">Alto risco</SelectItem>
                    <SelectItem value="médio">Risco médio</SelectItem>
                    <SelectItem value="baixo">Baixo risco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {getFilteredStates().map((state, index) => (
                <div key={state.sigla} className={`flex justify-between items-center p-3 rounded-lg border ${
                  state.risco === 'alto' ? 'bg-red-50 border-red-200' : 
                  state.risco === 'médio' ? 'bg-yellow-50 border-yellow-200' : 
                  'bg-green-50 border-green-200'
                }`}>
                  <div>
                    <span className={`text-sm font-medium ${
                      state.risco === 'alto' ? 'text-red-800' : 
                      state.risco === 'médio' ? 'text-yellow-800' : 
                      'text-green-800'
                    }`}>{state.estado}</span>
                    <p className={`text-xs ${
                      state.risco === 'alto' ? 'text-red-600' : 
                      state.risco === 'médio' ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>{state.sigla}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs ${
                      state.risco === 'alto' ? 'text-red-600' : 
                      state.risco === 'médio' ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>{state.caixas.toLocaleString()} caixas</span>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {getRiskIcon(state.risco)}
                      <span className={`text-xs ${
                        state.risco === 'alto' ? 'text-red-700' : 
                        state.risco === 'médio' ? 'text-yellow-700' : 
                        'text-green-700'
                      }`}>{state.risco === 'alto' ? 'Alto risco' : state.risco === 'médio' ? 'Risco médio' : 'Baixo risco'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {getFilteredStates().length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum estado encontrado com os filtros aplicados.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Uso de Papel por Estados e Setores - GRÁFICO MELHORADO */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <CardTitle className="text-sm sm:text-lg font-semibold text-gray-800">Consumo de Papel por Estado e Setor</CardTitle>
                <p className="text-xs sm:text-sm text-gray-600">Consumo mensal de papel por estado e setor (em milhares de folhas) - ordem alfabética</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Select value={paperStateFilter} onValueChange={setPaperStateFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os estados</SelectItem>
                    {paperUsageStates.map((state) => (
                      <SelectItem key={state.sigla} value={state.sigla}>
                        {state.estado} ({state.sigla})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">Ordenado por:</span>
                  <Badge variant="secondary" className="text-xs">
                    Maior consumo
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getFilteredPaperData()} margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60
              }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="sigla" 
                  fontSize={12} 
                  stroke="#666" 
                  angle={-45}
                  textAnchor="end" 
                  height={60}
                />
                <YAxis 
                  fontSize={12} 
                  stroke="#666"
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px'
                  }}
                  formatter={(value: any, name: string, props: any) => {
                    const sectorNames = {
                      administrativo: 'Administrativo',
                      juridico: 'Jurídico', 
                      tecnico: 'Técnico',
                      total: 'Total'
                    };
                    return [
                      `${value.toLocaleString()} folhas`,
                      sectorNames[name as keyof typeof sectorNames] || name
                    ];
                  }}
                  labelFormatter={(label) => {
                    const state = paperUsageStates.find(s => s.sigla === label);
                    return state ? `${state.estado} (${state.sigla})` : label;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                  formatter={(value) => {
                    const sectorNames = {
                      administrativo: 'Setor Administrativo',
                      juridico: 'Setor Jurídico', 
                      tecnico: 'Setor Técnico'
                    };
                    return sectorNames[value as keyof typeof sectorNames] || value;
                  }}
                />
                <Bar 
                  dataKey="administrativo" 
                  stackId="a"
                  fill="#3B82F6" 
                  name="administrativo"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="juridico" 
                  stackId="a"
                  fill="#8B5CF6" 
                  name="juridico"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="tecnico" 
                  stackId="a"
                  fill="#F59E0B" 
                  name="tecnico"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm sm:text-lg font-bold text-blue-700">
                  {getFilteredPaperData().reduce((sum, state) => sum + state.administrativo, 0).toLocaleString()}
                </div>
                <p className="text-xs text-blue-600">Total Administrativo</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-sm sm:text-lg font-bold text-purple-700">
                  {getFilteredPaperData().reduce((sum, state) => sum + state.juridico, 0).toLocaleString()}
                </div>
                <p className="text-xs text-purple-600">Total Jurídico</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-sm sm:text-lg font-bold text-orange-700">
                  {getFilteredPaperData().reduce((sum, state) => sum + state.tecnico, 0).toLocaleString()}
                </div>
                <p className="text-xs text-orange-600">Total Técnico</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Executivo */}
        <Card className="bg-gradient-to-r from-[#15AB92] to-[#0d8f7a] text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg sm:text-xl font-bold">Resumo Executivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold mb-2">{archivalData.totalArchiveBoxes.toLocaleString()}</div>
                <p className="text-xs sm:text-sm text-green-100">Total de Caixas Arquivo</p>
              </div>
              
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold mb-2">{archivalData.totalProducts}</div>
                <p className="text-xs sm:text-sm text-green-100">Quantidade de Produtos</p>
              </div>
              
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold mb-2">{archivalData.monthlyComplianceRate}%</div>
                <p className="text-xs sm:text-sm text-green-100">Taxa de Conformidade</p>
              </div>
              
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold mb-2">{archivalData.monthlyArchivalServices}</div>
                <p className="text-xs sm:text-sm text-green-100">Serviços Arquivísticos</p>
              </div>
              
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold mb-2">R$ 145 mil</div>
                <p className="text-xs sm:text-sm text-green-100">Custo Mensal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}
