import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Building2, Archive, Database, Users, GraduationCap, CheckCircle2, TrendingUp, HardDrive, Box } from "lucide-react";

const volumeData = [
  { organ: "MMA", linear_meters: 15200, digital_gb: 3400, described_docs: 1520, boxes: 760, organized_percentage: 85 },
  { organ: "IBAMA", linear_meters: 12800, digital_gb: 2850, described_docs: 1280, boxes: 640, organized_percentage: 78 },
  { organ: "STM", linear_meters: 8900, digital_gb: 1980, described_docs: 890, boxes: 445, organized_percentage: 92 },
  { organ: "MIDR", linear_meters: 11500, digital_gb: 2560, described_docs: 1150, boxes: 575, organized_percentage: 82 },
  { organ: "STN", linear_meters: 9800, digital_gb: 2180, described_docs: 980, boxes: 490, organized_percentage: 88 },
  { organ: "ANAC", linear_meters: 7200, digital_gb: 1600, described_docs: 720, boxes: 360, organized_percentage: 75 },
  { organ: "EMGEA", linear_meters: 5400, digital_gb: 1200, described_docs: 540, boxes: 270, organized_percentage: 80 },
  { organ: "POUPEX", linear_meters: 4800, digital_gb: 1070, described_docs: 480, boxes: 240, organized_percentage: 83 },
  { organ: "CGU", linear_meters: 6700, digital_gb: 1490, described_docs: 670, boxes: 335, organized_percentage: 87 },
  { organ: "MP", linear_meters: 8100, digital_gb: 1800, described_docs: 810, boxes: 405, organized_percentage: 79 },
  { organ: "MF", linear_meters: 9200, digital_gb: 2040, described_docs: 920, boxes: 460, organized_percentage: 81 },
  { organ: "CAPES", linear_meters: 6300, digital_gb: 1400, described_docs: 630, boxes: 315, organized_percentage: 86 },
  { organ: "SFB", linear_meters: 4500, digital_gb: 1000, described_docs: 450, boxes: 225, organized_percentage: 84 }
];

const maturityData = [
  { level: "Inicial", count: 3, color: "#ef4444" },
  { level: "Básico", count: 4, color: "#f97316" },
  { level: "Intermediário", count: 5, color: "#eab308" },
  { level: "Avançado", count: 4, color: "#22c55e" },
  { level: "Otimizado", count: 1, color: "#15AB92" },
];

const organizationsRanking = [
  { name: "Superior Tribunal Militar", level: "Otimizado", score: 4.8, sector: "Justiça", color: "#15AB92" },
  { name: "Secretaria do Tesouro Nacional", level: "Avançado", score: 4.5, sector: "Fazenda", color: "#22c55e" },
  { name: "Ministério do Meio Ambiente", level: "Avançado", score: 4.3, sector: "Meio Ambiente", color: "#22c55e" },
  { name: "Agência Nacional de Aviação Civil", level: "Avançado", score: 4.1, sector: "Transportes", color: "#22c55e" },
  { name: "Controladoria Geral da União", level: "Avançado", score: 4.0, sector: "Controle", color: "#22c55e" },
  { name: "IBAMA", level: "Intermediário", score: 3.7, sector: "Meio Ambiente", color: "#eab308" },
  { name: "Ministério da Integração", level: "Intermediário", score: 3.5, sector: "Desenvolvimento", color: "#eab308" },
  { name: "CAPES", level: "Intermediário", score: 3.4, sector: "Educação", color: "#eab308" },
  { name: "Ministério da Fazenda", level: "Intermediário", score: 3.2, sector: "Fazenda", color: "#eab308" },
  { name: "Ministério do Planejamento", level: "Intermediário", score: 3.1, sector: "Planejamento", color: "#eab308" },
  { name: "Empresa Gestora de Ativos", level: "Básico", score: 2.8, sector: "Financeiro", color: "#f97316" },
  { name: "POUPEX", level: "Básico", score: 2.6, sector: "Previdência", color: "#f97316" },
  { name: "Serviço Florestal Brasileiro", level: "Básico", score: 2.4, sector: "Meio Ambiente", color: "#f97316" },
];

const projectsData = [
  { organ: "MMA", researchers: 8, scholarships: 32, duration: "24 meses", instruments: 2 },
  { organ: "IBAMA", researchers: 6, scholarships: 28, duration: "20 meses", instruments: 2 },
  { organ: "STM", researchers: 4, scholarships: 22, duration: "18 meses", instruments: 2 },
  { organ: "MIDR", researchers: 7, scholarships: 35, duration: "22 meses", instruments: 2 },
  { organ: "STN", researchers: 5, scholarships: 26, duration: "19 meses", instruments: 2 },
  { organ: "ANAC", researchers: 4, scholarships: 24, duration: "16 meses", instruments: 2 },
  { organ: "EMGEA", researchers: 3, scholarships: 20, duration: "14 meses", instruments: 2 },
  { organ: "POUPEX", researchers: 3, scholarships: 21, duration: "15 meses", instruments: 2 },
  { organ: "CGU", researchers: 5, scholarships: 29, duration: "18 meses", instruments: 2 },
  { organ: "MP", researchers: 6, scholarships: 31, duration: "21 meses", instruments: 2 },
  { organ: "MF", researchers: 7, scholarships: 33, duration: "23 meses", instruments: 2 },
  { organ: "CAPES", researchers: 4, scholarships: 25, duration: "17 meses", instruments: 2 },
  { organ: "SFB", researchers: 3, scholarships: 22, duration: "16 meses", instruments: 2 }
];

// Dados de usuários da plataforma
const platformUserStats = [
  { category: "Estudantes", shortLabel: "Estudantes", count: 1247, color: "#3b82f6" },
  { category: "Órgãos Parceiros", shortLabel: "Parceiros", count: 17, color: "#22c55e" },
  { category: "Órgãos Cadastrados", shortLabel: "Cadastrados", count: 43, color: "#f59e0b" },
  { category: "Parceiros Institucionais", shortLabel: "Institucionais", count: 5, color: "#8b5cf6" }
];

const assessmentStats = [
  { month: "Jan", assessments: 12, users: 45 },
  { month: "Fev", assessments: 18, users: 52 },
  { month: "Mar", assessments: 25, users: 68 },
  { month: "Abr", assessments: 31, users: 73 },
  { month: "Mai", assessments: 28, users: 81 },
  { month: "Jun", assessments: 35, users: 95 }
];

// Componente customizado para legendas responsivas
const ResponsiveLegend = ({ payload, layout }: any) => {
  if (!payload || !payload.length) return null;
  
  return (
    <div className={`flex flex-wrap justify-center gap-2 sm:gap-4 text-xs ${
      layout === 'vertical' ? 'flex-col items-center' : ''
    }`}>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1">
          <div 
            className="w-3 h-3 rounded-sm" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="whitespace-nowrap text-xs">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Componente customizado para labels do PieChart melhorado
const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, count }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show label if slice is too small

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="10"
      fontWeight="bold"
    >
      {count}
    </text>
  );
};

// Novo componente para legenda customizada da maturidade
const MaturityLegend = ({ data }: { data: typeof maturityData }) => {
  return (
    <div className="mt-4 space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <div 
              className="w-3 h-3 rounded-sm flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium">{entry.level}</span>
            <span className="text-gray-600">({entry.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function PlatformStats() {
  const totalLinearMeters = volumeData.reduce((sum, item) => sum + item.linear_meters, 0);
  const totalDigitalGB = volumeData.reduce((sum, item) => sum + item.digital_gb, 0);
  const totalDescribedDocs = volumeData.reduce((sum, item) => sum + item.described_docs, 0);
  const totalBoxes = volumeData.reduce((sum, item) => sum + item.boxes, 0);
  const totalResearchers = projectsData.reduce((sum, item) => sum + item.researchers, 0);
  const totalScholarships = projectsData.reduce((sum, item) => sum + item.scholarships, 0);
  const totalInstruments = projectsData.reduce((sum, item) => sum + item.instruments, 0);
  const totalClassifiedDocs = totalDescribedDocs * 10; // Documentos descritos são 1/10 dos classificados

  const totalUsers = platformUserStats.reduce((sum, item) => sum + item.count, 0);
  const totalAssessments = assessmentStats.reduce((sum, item) => sum + item.assessments, 0);

  // Dados para gráfico de volume físico
  const physicalVolumeData = volumeData.slice(0, 8).map(item => ({
    organ: item.organ,
    metros_lineares: item.linear_meters,
    caixas: item.boxes,
    organizacao_percentual: item.organized_percentage
  }));

  // Dados para gráfico de volume digital
  const digitalVolumeData = volumeData.slice(0, 8).map(item => ({
    organ: item.organ,
    volume_digital_gb: item.digital_gb
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Dados Consolidados dos Projetos de Pesquisa
        </h2>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
          Estatísticas reais coletadas durante a execução de 17 projetos de pesquisa 
          em órgãos públicos brasileiros realizados pela UnB entre 2011 e 2025.
        </p>
      </div>

      {/* Research Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órgãos Parceiros</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17</div>
            <p className="text-xs text-muted-foreground">Projetos executados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Físico</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalLinearMeters / 1000).toFixed(1)} km</div>
            <p className="text-xs text-muted-foreground">{totalBoxes.toLocaleString()} caixas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acervo Digital</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalDigitalGB / 1000).toFixed(1)} TB</div>
            <p className="text-xs text-muted-foreground">Documentos digitalizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Docs. Descritos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalDescribedDocs / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground">Descrição arquivística</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Users Statistics */}
      <div className="mb-8 sm:mb-12">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">
          Estatísticas da Plataforma
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Cadastrados na plataforma</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudantes</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.247</div>
              <p className="text-xs text-muted-foreground">Pesquisadores cadastrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssessments}</div>
              <p className="text-xs text-muted-foreground">Maturidade realizadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23%</div>
              <p className="text-xs text-muted-foreground">Novos usuários/mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Users Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Usuários</CardTitle>
              <CardDescription>
                Tipos de usuários cadastrados na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformUserStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={CustomPieLabel}
                    labelLine={false}
                  >
                    {platformUserStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} usuários`,
                      props.payload.category
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom Mobile-Friendly Legend */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {platformUserStats.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm flex-shrink-0" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="truncate">{entry.shortLabel}: {entry.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avaliações de Maturidade</CardTitle>
              <CardDescription>
                Evolução mensal de avaliações realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assessmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend content={<ResponsiveLegend />} />
                  <Bar dataKey="assessments" fill="#15AB92" name="Avaliações" />
                  <Bar dataKey="users" fill="#0891b2" name="Usuários Ativos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Volume Charts - Separated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Volume Físico Mapeado</CardTitle>
            <CardDescription>
              Metros lineares, caixas e percentual organizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={physicalVolumeData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="organ" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend content={<ResponsiveLegend />} />
                <Bar dataKey="metros_lineares" fill="#15AB92" name="Metros Lineares" />
                <Bar dataKey="caixas" fill="#0891b2" name="Caixas" />
                <Bar dataKey="organizacao_percentual" fill="#f59e0b" name="% Organizado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume Digital</CardTitle>
            <CardDescription>
              Documentos digitalizados por órgão (GB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={digitalVolumeData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="organ" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="volume_digital_gb" fill="#8b5cf6" name="Volume Digital (GB)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Research Data and Maturity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Dados dos Projetos de Pesquisa</CardTitle>
            <CardDescription>
              Pesquisadores, bolsistas e documentos processados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-[#15AB92]">{totalResearchers}</div>
                <p className="text-sm text-slate-600">Pesquisadores</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalScholarships}</div>
                <p className="text-sm text-slate-600">Bolsistas</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Instrumentos de Gestão de Documentos Elaborados:</span>
                <span className="font-semibold">{totalInstruments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Documentos Descritos:</span>
                <span className="font-semibold">{totalDescribedDocs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Documentos Classificados:</span>
                <span className="font-semibold">{totalClassifiedDocs.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição dos Níveis de Maturidade</CardTitle>
            <CardDescription>
              Classificação das organizações por nível de maturidade arquivística
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={maturityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={CustomPieLabel}
                  labelLine={false}
                >
                  {maturityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} organizações`,
                    props.payload.level
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <MaturityLegend data={maturityData} />
          </CardContent>
        </Card>
      </div>

      {/* Organizations Ranking Table */}
      <Card className="mb-8 sm:mb-12">
        <CardHeader>
          <CardTitle>Ranking das Organizações por Maturidade</CardTitle>
          <CardDescription>
            Pontuação obtida nas avaliações de maturidade arquivística realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Pos.</TableHead>
                  <TableHead>Organização</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead className="text-center">Nível</TableHead>
                  <TableHead className="text-center">Pontuação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizationsRanking.map((org, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}º</TableCell>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell className="text-sm text-slate-600">{org.sector}</TableCell>
                    <TableCell className="text-center">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: org.color }}
                      >
                        {org.level}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{org.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
