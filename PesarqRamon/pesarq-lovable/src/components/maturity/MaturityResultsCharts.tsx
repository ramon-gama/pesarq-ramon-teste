
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from "recharts";
import { TrendingUp, AlertCircle, CheckCircle2, Target, MessageSquare, Eye } from "lucide-react";

interface CategoryScore {
  averageScore: number;
  maturityLevel: string;
  deficiencies: {
    tecnica: number;
    comportamental: number;
    ferramental: number;
  };
  answeredQuestions: number;
  totalQuestions: number;
}

interface MaturityResultsChartsProps {
  categoryScore: CategoryScore;
  categoryTitle: string;
}

// Cores progressivas do pior (vermelho) para o melhor (verde)
const PROGRESSIVE_COLORS = [
  '#dc2626', // Vermelho mais escuro (pior)
  '#ea580c', // Laranja escuro
  '#d97706', // Amarelo escuro  
  '#16a34a', // Verde
  '#15803d'  // Verde mais escuro (melhor)
];

const COLORS = {
  tecnica: '#ef4444',
  comportamental: '#f97316', 
  ferramental: '#eab308'
};

const MATURITY_COLORS = {
  'Não estabelecido': '#dc2626',
  'Em desenvolvimento': '#ea580c',
  'Essencial': '#d97706',
  'Consolidado': '#16a34a',
  'Avançado': '#15803d'
};

export function MaturityResultsCharts({ categoryScore, categoryTitle }: MaturityResultsChartsProps) {
  // Preparar dados para gráfico de deficiências com cores progressivas
  const deficiencyData = [
    {
      name: 'Técnica',
      value: categoryScore.deficiencies.tecnica,
      description: 'Conhecimentos e habilidades',
      fill: COLORS.tecnica
    },
    {
      name: 'Comportamental', 
      value: categoryScore.deficiencies.comportamental,
      description: 'Cultura e práticas',
      fill: COLORS.comportamental
    },
    {
      name: 'Ferramental',
      value: categoryScore.deficiencies.ferramental, 
      description: 'Recursos e tecnologias',
      fill: COLORS.ferramental
    }
  ].sort((a, b) => b.value - a.value); // Ordenar do maior para o menor

  // Dados para gráfico de maturidade
  const maturityData = [
    {
      name: categoryScore.maturityLevel,
      value: categoryScore.averageScore,
      fill: MATURITY_COLORS[categoryScore.maturityLevel as keyof typeof MATURITY_COLORS] || '#64748b'
    }
  ];

  // Dados para gráfico de níveis de maturidade (5 barras) com cores progressivas
  const maturityLevelsData = [
    {
      name: 'Não estabelecido',
      shortName: 'Nível 1',
      range: '1.0 - 1.0',
      color: PROGRESSIVE_COLORS[0],
      isCurrent: categoryScore.maturityLevel === 'Não estabelecido',
      value: categoryScore.maturityLevel === 'Não estabelecido' ? categoryScore.averageScore : 1.0
    },
    {
      name: 'Em desenvolvimento',
      shortName: 'Nível 2',
      range: '1.1 - 2.0',
      color: PROGRESSIVE_COLORS[1],
      isCurrent: categoryScore.maturityLevel === 'Em desenvolvimento',
      value: categoryScore.maturityLevel === 'Em desenvolvimento' ? categoryScore.averageScore : 1.5
    },
    {
      name: 'Essencial',
      shortName: 'Nível 3',
      range: '2.1 - 3.0',
      color: PROGRESSIVE_COLORS[2],
      isCurrent: categoryScore.maturityLevel === 'Essencial',
      value: categoryScore.maturityLevel === 'Essencial' ? categoryScore.averageScore : 2.5
    },
    {
      name: 'Consolidado',
      shortName: 'Nível 4',
      range: '3.1 - 4.0',
      color: PROGRESSIVE_COLORS[3],
      isCurrent: categoryScore.maturityLevel === 'Consolidado',
      value: categoryScore.maturityLevel === 'Consolidado' ? categoryScore.averageScore : 3.5
    },
    {
      name: 'Avançado',
      shortName: 'Nível 5',
      range: '4.1 - 5.0',
      color: PROGRESSIVE_COLORS[4],
      isCurrent: categoryScore.maturityLevel === 'Avançado',
      value: categoryScore.maturityLevel === 'Avançado' ? categoryScore.averageScore : 4.5
    }
  ];

  // Dados para progresso
  const progressData = [
    {
      name: 'Respondidas',
      value: categoryScore.answeredQuestions,
      fill: '#22c55e'
    },
    {
      name: 'Não respondidas',
      value: categoryScore.totalQuestions - categoryScore.answeredQuestions,
      fill: '#e5e7eb'
    }
  ];

  const totalDeficiencies = categoryScore.deficiencies.tecnica + 
                           categoryScore.deficiencies.comportamental + 
                           categoryScore.deficiencies.ferramental;

  const chartConfig = {
    tecnica: {
      label: "Técnica",
      color: COLORS.tecnica,
    },
    comportamental: {
      label: "Comportamental", 
      color: COLORS.comportamental,
    },
    ferramental: {
      label: "Ferramental",
      color: COLORS.ferramental,
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Níveis de Maturidade com cores progressivas */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Níveis de Maturidade - Posição Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maturityLevelsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="shortName" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 5]}
                />
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm text-muted-foreground">Faixa: {data.range}</p>
                          {data.isCurrent && (
                            <>
                              <p className="text-sm font-medium text-green-600">✓ NÍVEL ATUAL</p>
                              <p className="text-sm">Sua pontuação: <strong>{categoryScore.averageScore}</strong></p>
                            </>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {maturityLevelsData.map((entry, index) => (
                    <Cell 
                      key={`maturity-bar-${index}`}
                      fill={entry.isCurrent ? entry.color : `${entry.color}60`}
                      stroke={entry.isCurrent ? entry.color : 'transparent'}
                      strokeWidth={entry.isCurrent ? 3 : 0}
                      opacity={entry.isCurrent ? 1 : 0.4}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2">
            {maturityLevelsData.map((level, index) => (
              <div 
                key={level.name} 
                className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                  level.isCurrent 
                    ? 'border-current bg-current/10 shadow-md' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
                style={{ 
                  borderColor: level.isCurrent ? level.color : undefined,
                  backgroundColor: level.isCurrent ? `${level.color}20` : undefined 
                }}
              >
                <div className="font-medium text-sm">{level.shortName}</div>
                <div className="text-xs text-muted-foreground mt-1">{level.range}</div>
                {level.isCurrent && (
                  <Badge className="mt-2 text-xs text-white border-0" style={{ backgroundColor: level.color }}>
                    ATUAL
                  </Badge>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-green-500"></div>
              <span className="text-sm font-medium">Escala de Cores:</span>
            </div>
            <p className="text-xs text-muted-foreground">
              As cores variam do <strong className="text-red-600">vermelho (nível mais baixo)</strong> ao <strong className="text-green-600">verde (nível mais alto)</strong>, 
              facilitando a visualização do progresso de maturidade.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Deficiências com cores progressivas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Deficiências por Tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deficiencyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {deficiencyData.map((entry, index) => (
                    <Cell key={`deficiency-bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="mt-4 space-y-2">
            {deficiencyData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <Badge variant="outline">{item.value} deficiências</Badge>
              </div>
            ))}
            <div className="mt-3 p-2 bg-amber-50 rounded text-xs text-amber-700 border border-amber-200">
              <strong>Dica:</strong> As barras são ordenadas da maior para a menor quantidade de deficiências para facilitar a priorização.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Distribuição de Deficiências */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Distribuição de Deficiências
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalDeficiencies > 0 ? (
            <>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deficiencyData.filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deficiencyData.filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 border rounded shadow">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">{data.description}</p>
                              <p className="text-sm">
                                <strong>{data.value}</strong> deficiências 
                                ({((data.value / totalDeficiencies) * 100).toFixed(1)}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-slate-700">{totalDeficiencies}</div>
                <div className="text-sm text-muted-foreground">Total de Deficiências</div>
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-green-700">Excelente!</div>
                <div className="text-sm text-muted-foreground">Nenhuma deficiência identificada</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico Radial - Nível de Maturidade */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Nível de Maturidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ maturity: { label: "Maturidade", color: maturityData[0].fill } }} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={maturityData}>
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={maturityData[0].fill}
                  max={5}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="mt-4 text-center space-y-2">
            <div className="text-3xl font-bold" style={{ color: maturityData[0].fill }}>
              {categoryScore.averageScore}
            </div>
            <Badge 
              className="text-white border-0"
              style={{ backgroundColor: maturityData[0].fill }}
            >
              {categoryScore.maturityLevel}
            </Badge>
            <div className="text-xs text-muted-foreground">
              Pontuação em escala de 1 a 5
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progresso das Perguntas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
            Progresso da Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ 
            respondidas: { label: "Respondidas", color: "#22c55e" },
            total: { label: "Total", color: "#e5e7eb" }
          }} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm">
                            <strong>{data.value}</strong> perguntas
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="mt-4 text-center space-y-2">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((categoryScore.answeredQuestions / categoryScore.totalQuestions) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">
              {categoryScore.answeredQuestions} de {categoryScore.totalQuestions} perguntas respondidas
            </div>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Avaliação Completa
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Card de Acesso aos Feedbacks - Movido para o final */}
      <Card className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Acesso aos Feedbacks Detalhados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-100">
              <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Como Visualizar Feedbacks</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Para acessar os feedbacks detalhados de cada resposta que você selecionou durante a avaliação:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Clique em <strong>"Revisar Respostas"</strong> abaixo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Navegue pelas perguntas respondidas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Veja o feedback específico de cada opção escolhida</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-indigo-100">
              <Target className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Informações dos Feedbacks</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Cada feedback contém informações valiosas sobre:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span><strong>Explicação</strong> da sua escolha</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span><strong>Recomendações</strong> para melhoria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span><strong>Próximos passos</strong> sugeridos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
