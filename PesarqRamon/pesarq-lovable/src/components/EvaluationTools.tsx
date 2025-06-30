
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaturityIndex } from "@/components/MaturityIndex";
import { ArchivalDiagnostic } from "@/components/ArchivalDiagnostic";
import { 
  FileSearch, 
  TrendingUp,
  Shield,
  Users,
  Clock,
  CheckCircle,
  FileCheck,
  Star,
  FileText,
  BarChart3,
  ArrowLeft
} from "lucide-react";

interface EvaluationToolsProps {
  onNavigateToModule?: (module: string) => void;
}

const tools = [
  {
    id: "maturity-index",
    title: "Avaliação da Maturidade em Gestão de Documentos",
    description: "Avalie o nível de maturidade da gestão de documentos da sua organização através de indicadores específicos.",
    icon: BarChart3,
    category: "evaluation",
    rating: 5,
    usageCount: 245,
    avgCompletionTime: "60-90 min"
  },
  {
    id: "archival-diagnostic",
    title: "Diagnóstico Arquivístico",
    description: "Avalie, por meio de dados quantitativos a gestão, preservação e acesso aos documentos da sua organização por meio de diferentes dados e níveis de diagnóstico.",
    icon: FileSearch,
    category: "diagnostic",
    rating: 4,
    usageCount: 120,
    avgCompletionTime: "45-60 min"
  },
  {
    id: "swot-analysis",
    title: "Análise SWOT",
    description: "Identifique forças, fraquezas, oportunidades e ameaças na gestão de documentos e arquivos.",
    icon: TrendingUp,
    category: "evaluation",
    rating: 4,
    usageCount: 180,
    avgCompletionTime: "30-45 min"
  },
  {
    id: "compliance-audit",
    title: "Auditoria de Conformidade",
    description: "Verifique a conformidade com as normas e legislações vigentes em gestão de documentos.",
    icon: Shield,
    category: "evaluation",
    rating: 5,
    usageCount: 210,
    avgCompletionTime: "75-105 min"
  },
  {
    id: "user-satisfaction",
    title: "Pesquisa de Satisfação dos Usuários",
    description: "Entenda as necessidades e expectativas dos usuários dos serviços de arquivo e gestão de documentos.",
    icon: Users,
    category: "survey",
    rating: 3,
    usageCount: 98,
    avgCompletionTime: "20-30 min"
  }
];

const diagnosticHistory = [
  {
    id: "1",
    title: "Diagnóstico dos Setores de Trabalho",
    type: "Nível 1",
    sector: "Recursos Humanos",
    startDate: "15/11/2024",
    status: "Concluído",
    result: "78% conformidade"
  },
  {
    id: "2", 
    title: "Diagnóstico do Sistema de Gestão de Documentos",
    type: "Nível 2",
    sector: "Tecnologia da Informação",
    startDate: "10/11/2024",
    status: "Em andamento",
    result: "65% progresso"
  },
  {
    id: "3",
    title: "Diagnóstico Histórico-Institucional",
    type: "Nível 1",
    sector: "Jurídico",
    startDate: "05/11/2024",
    status: "Rascunho",
    result: "30% progresso"
  }
];

export function EvaluationTools({ onNavigateToModule }: EvaluationToolsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeView, setActiveView] = useState<'tools' | 'maturity' | 'diagnostic'>('tools');

  const handleToolAccess = (toolId: string) => {
    if (toolId === "archival-diagnostic") {
      setActiveView('diagnostic');
    } else if (toolId === "maturity-index") {
      setActiveView('maturity');
    } else {
      console.log(`Acessando ferramenta: ${toolId}`);
    }
  };

  const handleBackToTools = () => {
    setActiveView('tools');
  };

  const filteredTools = selectedCategory === "all"
    ? tools
    : tools.filter(tool => tool.category === selectedCategory);

  // Renderizar o componente MaturityIndex se selecionado
  if (activeView === 'maturity') {
    return (
      <div className="space-y-6 p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handleBackToTools}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Ferramentas de Avaliação
          </Button>
        </div>
        <MaturityIndex onNavigateBack={handleBackToTools} />
      </div>
    );
  }

  // Renderizar o componente ArchivalDiagnostic se selecionado
  if (activeView === 'diagnostic') {
    return (
      <div className="space-y-6 p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handleBackToTools}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Ferramentas de Avaliação
          </Button>
        </div>
        <ArchivalDiagnostic />
      </div>
    );
  }

  return (
    <div className="space-y-3 p-2 sm:space-y-6 sm:p-4 md:p-6">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ferramentas</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tools.length}</div>
            <p className="text-xs text-muted-foreground">Ferramentas especializadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Ativas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 nova esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">+12% de conclusão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Avaliação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">+0.3 em relação ao trimestre anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="available" className="flex items-center gap-2 text-sm px-4 py-2">
            <FileCheck className="h-4 w-4" />
            Ferramentas Disponíveis
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 text-sm px-4 py-2">
            <Clock className="h-4 w-4" />
            Histórico de Aplicações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoria</label>
                  <Select defaultValue="all" onValueChange={(value) => setSelectedCategory(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      <SelectItem value="diagnostic">Diagnóstico</SelectItem>
                      <SelectItem value="evaluation">Avaliação</SelectItem>
                      <SelectItem value="survey">Pesquisa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tool.title}</CardTitle>
                          <Badge variant={tool.category === "diagnostic" ? "default" : 
                                         tool.category === "evaluation" ? "secondary" : "outline"} 
                                 className="mt-2">
                            {tool.category === "diagnostic" ? "Diagnóstico" : 
                             tool.category === "evaluation" ? "Avaliação" : "Pesquisa"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < tool.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {tool.description}
                    </CardDescription>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        {tool.usageCount} organizações utilizaram
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {tool.avgCompletionTime}
                      </span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleToolAccess(tool.id)}
                    >
                      Acessar Ferramenta
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Tabela de Histórico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de Aplicações
              </CardTitle>
              <CardDescription>
                Histórico de todas as ferramentas de avaliação aplicadas na organização
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Ferramenta</TableHead>
                      <TableHead className="min-w-[100px]">Tipo</TableHead>
                      <TableHead className="min-w-[120px]">Setor/Órgão</TableHead>
                      <TableHead className="min-w-[100px]">Iniciado em</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Resultado</TableHead>
                      <TableHead className="min-w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {diagnosticHistory.map((diagnostic) => (
                      <TableRow key={diagnostic.id}>
                        <TableCell className="font-medium">{diagnostic.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{diagnostic.type}</Badge>
                        </TableCell>
                        <TableCell>{diagnostic.sector}</TableCell>
                        <TableCell>{diagnostic.startDate}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              diagnostic.status === "Concluído" ? "default" :
                              diagnostic.status === "Em andamento" ? "secondary" : "outline"
                            }
                          >
                            {diagnostic.status === "Concluído" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {diagnostic.status === "Em andamento" && <Clock className="h-3 w-3 mr-1" />}
                            {diagnostic.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{diagnostic.result}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            {diagnostic.status === "Concluído" ? "Ver relatório" : "Continuar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
