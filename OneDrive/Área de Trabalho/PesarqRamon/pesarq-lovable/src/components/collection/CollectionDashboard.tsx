
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Archive, 
  FileText, 
  Trash2, 
  Shield, 
  TrendingUp, 
  Users, 
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Building,
  Target,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { useState } from "react";

// Dados simulados atualizados
const collectionStats = {
  totalDocuments: 15678,
  analogDocuments: 12456,
  permanentGuard: 4523,
  eliminationReady: 1234,
  totalBoxes: 3847, // Alterado para caixas-arquivo
  registeredUsers: 8,
  locations: 12
};

// Volume documental por estado (dados em caixas-arquivo)
const stateDocumentVolume = [
  { estado: 'São Paulo', sigla: 'SP', caixas: 12450, metros: 1876, risco: 'baixo' },
  { estado: 'Rio de Janeiro', sigla: 'RJ', caixas: 8934, metros: 1345, risco: 'médio' },
  { estado: 'Minas Gerais', sigla: 'MG', caixas: 7654, metros: 1152, risco: 'baixo' },
  { estado: 'Bahia', sigla: 'BA', caixas: 6543, metros: 985, risco: 'alto' },
  { estado: 'Rio Grande do Sul', sigla: 'RS', caixas: 5432, metros: 817, risco: 'médio' },
  { estado: 'Paraná', sigla: 'PR', caixas: 4876, metros: 734, risco: 'baixo' },
  { estado: 'Pernambuco', sigla: 'PE', caixas: 4321, metros: 650, risco: 'alto' },
  { estado: 'Ceará', sigla: 'CE', caixas: 3987, metros: 600, risco: 'médio' },
  { estado: 'Pará', sigla: 'PA', caixas: 3654, metros: 550, risco: 'alto' },
  { estado: 'Santa Catarina', sigla: 'SC', caixas: 3210, metros: 483, risco: 'baixo' },
  { estado: 'Maranhão', sigla: 'MA', caixas: 2987, metros: 450, risco: 'alto' },
  { estado: 'Goiás', sigla: 'GO', caixas: 2765, metros: 417, risco: 'médio' },
  { estado: 'Paraíba', sigla: 'PB', caixas: 2543, metros: 383, risco: 'médio' },
  { estado: 'Alagoas', sigla: 'AL', caixas: 2321, metros: 350, risco: 'alto' },
  { estado: 'Piauí', sigla: 'PI', caixas: 2109, metros: 317, risco: 'alto' },
  { estado: 'Rio Grande do Norte', sigla: 'RN', caixas: 1987, metros: 299, risco: 'médio' },
  { estado: 'Mato Grosso', sigla: 'MT', caixas: 1876, metros: 283, risco: 'médio' },
  { estado: 'Mato Grosso do Sul', sigla: 'MS', caixas: 1765, metros: 266, risco: 'baixo' },
  { estado: 'Distrito Federal', sigla: 'DF', caixas: 1654, metros: 249, risco: 'baixo' },
  { estado: 'Sergipe', sigla: 'SE', caixas: 1543, metros: 232, risco: 'médio' },
  { estado: 'Rondônia', sigla: 'RO', caixas: 1432, metros: 216, risco: 'alto' },
  { estado: 'Espírito Santo', sigla: 'ES', caixas: 1321, metros: 199, risco: 'baixo' },
  { estado: 'Tocantins', sigla: 'TO', caixas: 1210, metros: 182, risco: 'médio' },
  { estado: 'Acre', sigla: 'AC', caixas: 1098, metros: 165, risco: 'alto' },
  { estado: 'Amapá', sigla: 'AP', caixas: 987, metros: 149, risco: 'alto' },
  { estado: 'Roraima', sigla: 'RR', caixas: 876, metros: 132, risco: 'alto' }
];

// Estados em risco com base nos critérios mencionados
const statesAtRisk = stateDocumentVolume.filter(state => state.risco === 'alto');
const mediumRiskStates = stateDocumentVolume.filter(state => state.risco === 'médio');

// Top 10 códigos mais utilizados
const top10Codes = [
  { codigo: '100.1', descricao: 'Normatização e Fiscalização', quantidade: 1456 },
  { codigo: '020.2', descricao: 'Pessoal - Administração', quantidade: 1234 },
  { codigo: '030.1', descricao: 'Material - Aquisição', quantidade: 987 },
  { codigo: '040.3', descricao: 'Patrimônio - Controle', quantidade: 876 },
  { codigo: '050.1', descricao: 'Orçamento e Finanças', quantidade: 654 },
  { codigo: '010.2', descricao: 'Organização e Funcionamento', quantidade: 543 },
  { codigo: '060.1', descricao: 'Comunicações - Internas', quantidade: 432 },
  { codigo: '070.2', descricao: 'Jurídico - Processos', quantidade: 398 },
  { codigo: '080.1', descricao: 'Tecnologia da Informação', quantidade: 345 },
  { codigo: '090.3', descricao: 'Contratos e Convênios', quantidade: 298 }
];

// Top tipos documentais mais cadastrados
const topDocumentTypes = [
  { tipo: 'Relatórios Técnicos', quantidade: 3456, porcentagem: 22 },
  { tipo: 'Pareceres Jurídicos', quantidade: 2345, porcentagem: 15 },
  { tipo: 'Termos de Referência', quantidade: 1876, porcentagem: 12 },
  { tipo: 'Atas de Reunião', quantidade: 1543, porcentagem: 10 },
  { tipo: 'Ofícios Circulares', quantidade: 2234, porcentagem: 14 },
  { tipo: 'Contratos Administrativos', quantidade: 1002, porcentagem: 6 },
  { tipo: 'Portarias', quantidade: 987, porcentagem: 6 },
  { tipo: 'Memorandos', quantidade: 876, porcentagem: 6 },
  { tipo: 'Resoluções', quantidade: 765, porcentagem: 5 },
  { tipo: 'Instruções Normativas', quantidade: 594, porcentagem: 4 }
];

// Porcentagem eliminação vs guarda permanente
const retentionData = [
  { categoria: 'Guarda Permanente', quantidade: 4523, porcentagem: 79 },
  { categoria: 'Eliminação', quantidade: 1234, porcentagem: 21 }
];

// Documentos por fundos arquivísticos
const archivalFunds = [
  { fundo: 'Ministério da Saúde', quantidade: 4567, porcentagem: 29 },
  { fundo: 'ANVISA', quantidade: 3421, porcentagem: 22 },
  { fundo: 'FUNASA', quantidade: 2134, porcentagem: 14 },
  { fundo: 'FIOCRUZ', quantidade: 1876, porcentagem: 12 },
  { fundo: 'ANS', quantidade: 1543, porcentagem: 10 },
  { fundo: 'Outros Órgãos', quantidade: 2137, porcentagem: 13 }
];

// Atividades fim vs meio
const activityTypes = [
  { atividade: 'Atividades Fim', quantidade: 9406, porcentagem: 60 },
  { atividade: 'Atividades Meio', quantidade: 6272, porcentagem: 40 }
];

const monthlyProduction = [
  { mes: 'Jan', cadastrados: 456 },
  { mes: 'Fev', cadastrados: 523 },
  { mes: 'Mar', cadastrados: 612 },
  { mes: 'Abr', cadastrados: 478 },
  { mes: 'Mai', cadastrados: 634 },
  { mes: 'Jun', cadastrados: 589 }
];

const COLORS = ['#15AB92', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280', '#10B981', '#F97316', '#EC4899', '#84CC16'];

export function CollectionDashboard() {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const permanentPercentage = Math.round((collectionStats.permanentGuard / collectionStats.totalDocuments) * 100);
  
  const getRiskColor = (risco: string) => {
    switch (risco) {
      case 'alto': return 'text-red-700 bg-red-100';
      case 'médio': return 'text-yellow-700 bg-yellow-100';
      case 'baixo': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
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
    stateDocumentVolume[(currentStateIndex + 2) % stateDocumentVolume.length]
  ];
  
  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Métricas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 ml-auto text-[#15AB92]" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{collectionStats.totalDocuments.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-gray-600">
              {collectionStats.analogDocuments.toLocaleString()} analógicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Guarda Permanente</CardTitle>
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 ml-auto text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{permanentPercentage}%</div>
            <p className="text-[10px] sm:text-xs text-green-600">
              {collectionStats.permanentGuard.toLocaleString()} documentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Prontos p/ Eliminação</CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 ml-auto text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{collectionStats.eliminationReady.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-orange-600">
              Aguardando eliminação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Caixas-Arquivo</CardTitle>
            <Archive className="h-3 w-3 sm:h-4 sm:w-4 ml-auto text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{collectionStats.totalBoxes.toLocaleString()}</div>
            <p className="text-[10px] sm:text-xs text-blue-600">
              {collectionStats.locations} locais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Volume Documental por Estados - Carousel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                Volume Documental por Estado
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Acervo em caixas-arquivo por unidade federativa</CardDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleStates.map((state) => (
              <div key={state.sigla} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{state.estado}</h4>
                    <p className="text-xs text-gray-600">{state.sigla}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getRiskColor(state.risco)}`}>
                    {getRiskIcon(state.risco)}
                    {state.risco}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Caixas:</span>
                    <span className="font-medium">{state.caixas.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Metros lineares:</span>
                    <span>{state.metros.toLocaleString()}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <p className="text-xs text-gray-500">
              {currentStateIndex + 1} - {Math.min(currentStateIndex + 3, stateDocumentVolume.length)} de {stateDocumentVolume.length} estados
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Estados em Risco */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            Estados em Situação de Risco
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Baseado em: sinistros, exposição a riscos, tempo de recuperação, saúde dos servidores e infraestrutura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alto Risco ({statesAtRisk.length} estados)
              </h4>
              <div className="space-y-2">
                {statesAtRisk.map((state) => (
                  <div key={state.sigla} className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm font-medium">{state.estado}</span>
                    <span className="text-xs text-red-600">{state.caixas.toLocaleString()} caixas</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-yellow-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Risco Médio ({mediumRiskStates.length} estados)
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {mediumRiskStates.map((state) => (
                  <div key={state.sigla} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm font-medium">{state.estado}</span>
                    <span className="text-xs text-yellow-600">{state.caixas.toLocaleString()} caixas</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primeiro set de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top 10 Códigos Mais Utilizados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Top 10 Códigos Mais Utilizados
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Códigos de classificação com maior volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={top10Codes} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={10} />
                <YAxis dataKey="codigo" type="category" width={50} fontSize={8} />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#15AB92" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Tipos Documentais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              Top Tipos Documentais
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Tipos mais cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topDocumentTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" fontSize={8} angle={-45} textAnchor="end" height={80} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segundo set de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Porcentagem Eliminação vs Guarda Permanente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              Distribuição por Temporalidade
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Eliminação vs Guarda Permanente</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={retentionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                  label={({ categoria, porcentagem }) => `${categoria}: ${porcentagem}%`}
                  fontSize={9}
                >
                  {retentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Documentos por Fundos Arquivísticos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Building className="h-4 w-4 sm:h-5 sm:w-5" />
              Documentos por Fundos Arquivísticos
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Distribuição por órgão produtor</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={archivalFunds}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                  label={({ fundo, porcentagem }) => `${fundo}: ${porcentagem}%`}
                  fontSize={8}
                >
                  {archivalFunds.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Terceiro set de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Atividades Fim vs Meio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
              Atividades Fim vs Meio
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Classificação por tipo de atividade</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={activityTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                  label={({ atividade, porcentagem }) => `${atividade}: ${porcentagem}%`}
                  fontSize={10}
                >
                  {activityTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#15AB92' : '#8B5CF6'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Produção Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Cadastros Mensais
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Documentos cadastrados por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyProduction}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="cadastrados" stroke="#15AB92" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Usuários Cadastradores</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 ml-auto text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{collectionStats.registeredUsers}</div>
            <p className="text-[10px] sm:text-xs text-purple-600">
              Colaboradores ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Locais de Armazenamento</CardTitle>
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 ml-auto text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{collectionStats.locations}</div>
            <p className="text-[10px] sm:text-xs text-indigo-600">
              Ambientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Taxa de Conformidade</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 ml-auto text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">96%</div>
            <p className="text-[10px] sm:text-xs text-green-600 flex items-center">
              <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
              Metadados completos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
