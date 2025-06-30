import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  FileSearch, 
  Plus, 
  Filter,
  Clock,
  CheckCircle,
  Building2,
  Users,
  Archive,
  Shield,
  Database,
  HardDrive,
  Search,
  Eye,
  Settings,
  ChevronDown,
  BarChart3,
  Calendar,
  TrendingUp,
  ArrowLeft,
  MapPin,
  ExternalLink,
  Monitor
} from "lucide-react";
import { SectorSelectionMonitoring } from "./diagnostics/SectorSelectionMonitoring";
import { HistoricalInstitutionalMonitoring } from "./diagnostics/HistoricalInstitutionalMonitoring";
import { DocumentProductionMonitoring } from "./diagnostics/DocumentProductionMonitoring";
import { ModularWorkSectorsDiagnostic } from "./diagnostics/ModularWorkSectorsDiagnostic";
import { ModularArchiveSectorDiagnostic } from "./diagnostics/ModularArchiveSectorDiagnostic";

interface ArchivalDiagnosticProps {
  onNavigateBack?: () => void;
}

const diagnosticModels = {
  nivel1: [
    {
      id: "selecao-setores",
      title: "Diagnóstico de Seleção de Setores",
      description: "Identificação dos setores mais críticos para diagnóstico aprofundado",
      icon: MapPin
    },
    {
      id: "historico-institucional",
      title: "Diagnóstico Histórico-Institucional",
      description: "Análise da evolução histórica e estrutura institucional",
      icon: Building2
    },
    {
      id: "producao-documental",
      title: "Diagnóstico da Produção Documental",
      description: "Avaliação dos processos de criação e tramitação de documentos",
      icon: FileSearch
    },
    {
      id: "setores-trabalho",
      title: "Diagnóstico dos Setores de Trabalho",
      description: "Mapeamento das práticas documentais por setor",
      icon: Users
    },
    {
      id: "preservacao-analogicos",
      title: "Diagnóstico de Preservação e Conservação de Documentos Analógicos",
      description: "Estado de conservação e condições de armazenamento",
      icon: Archive
    },
    {
      id: "setor-arquivo",
      title: "Diagnóstico do Setor de Arquivo",
      description: "Estrutura e funcionamento do arquivo central",
      icon: Archive
    },
    {
      id: "setores-atribuicoes-arquivo",
      title: "Diagnóstico dos Setores com Atribuições de Arquivo",
      description: "Identificação de setores com funções arquivísticas",
      icon: Settings
    }
  ],
  nivel2: [
    {
      id: "sistema-gestao-documentos",
      title: "Diagnóstico do Sistema de Gestão de Documentos",
      description: "Avaliação dos processos de gestão de documentos",
      icon: Database
    },
    {
      id: "analise-fundos-acervos",
      title: "Diagnóstico de Análise dos Fundos Arquivísticos e Acervos",
      description: "Estrutura e organização dos fundos documentais",
      icon: Archive
    },
    {
      id: "processo-digitalizacao",
      title: "Diagnóstico do Processo e das Ações de Digitalização",
      description: "Procedimentos e qualidade da digitalização",
      icon: HardDrive
    },
    {
      id: "conformidade-politicas",
      title: "Diagnóstico de Conformidade das Políticas, Normas e Manuais",
      description: "Aderência às normativas arquivísticas",
      icon: Shield
    }
  ],
  nivel3: [
    {
      id: "sistemas-negocios-digitais",
      title: "Diagnóstico dos Sistemas de Negócios e Documentos Digitais",
      description: "Integração entre sistemas e gestão de documentos digitais",
      icon: Database
    },
    {
      id: "preservacao-digital",
      title: "Diagnóstico da Preservação Digital",
      description: "Estratégias e práticas de preservação digital",
      icon: HardDrive
    },
    {
      id: "comportamento-usuarios",
      title: "Diagnóstico do Comportamento dos Usuários de Arquivos",
      description: "Análise das necessidades e comportamentos dos usuários",
      icon: Users
    }
  ],
  nivel4: [
    {
      id: "taxonomia-recuperacao",
      title: "Diagnóstico da Taxonomia, Pontos de Acesso e Recuperação",
      description: "Sistemas de classificação e recuperação da informação",
      icon: Search
    },
    {
      id: "niveis-acesso-transparencia",
      title: "Diagnóstico de Níveis de Acesso e Transparência",
      description: "Políticas de acesso e transparência dos registros",
      icon: Eye
    }
  ],
  nivel5: [
    {
      id: "programa-gestao-completo",
      title: "Diagnóstico do Programa de Gestão, Preservação e Acesso",
      description: "Avaliação integral do programa arquivístico institucional",
      icon: Settings
    }
  ]
};

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

export function ArchivalDiagnostic({ onNavigateBack }: ArchivalDiagnosticProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedDiagnosticMonitoring, setSelectedDiagnosticMonitoring] = useState<string | null>(null);
  const [showModularDiagnostic, setShowModularDiagnostic] = useState<string | null>(null);

  const handleDiagnosticMonitoring = (diagnosticId: string) => {
    setSelectedDiagnosticMonitoring(diagnosticId);
  };

  const handleBackFromMonitoring = () => {
    setSelectedDiagnosticMonitoring(null);
  };

  const handleModularDiagnostic = (diagnosticId: string) => {
    setShowModularDiagnostic(diagnosticId);
  };

  const handleBackFromModular = () => {
    setShowModularDiagnostic(null);
  };

  // Se estamos na visualização modular
  if (showModularDiagnostic) {
    const diagnostic = Object.values(diagnosticModels)
      .flat()
      .find(d => d.id === showModularDiagnostic);
    
    if (diagnostic) {
      switch (showModularDiagnostic) {
        case "setores-trabalho":
          return (
            <ModularWorkSectorsDiagnostic
              diagnosticTitle={diagnostic.title}
              onNavigateBack={handleBackFromModular}
            />
          );
        case "setor-arquivo":
          return (
            <ModularArchiveSectorDiagnostic
              diagnosticTitle={diagnostic.title}
              onNavigateBack={handleBackFromModular}
            />
          );
      }
    }
  }

  // Renderizar página de monitoramento específica
  if (selectedDiagnosticMonitoring) {
    const diagnostic = Object.values(diagnosticModels)
      .flat()
      .find(d => d.id === selectedDiagnosticMonitoring);
    
    if (diagnostic) {
      switch (selectedDiagnosticMonitoring) {
        case "selecao-setores":
          return (
            <SectorSelectionMonitoring
              diagnosticTitle={diagnostic.title}
              onNavigateBack={handleBackFromMonitoring}
            />
          );
        case "historico-institucional":
          return (
            <HistoricalInstitutionalMonitoring
              diagnosticTitle={diagnostic.title}
              onNavigateBack={handleBackFromMonitoring}
            />
          );
        case "producao-documental":
          return (
            <DocumentProductionMonitoring
              diagnosticTitle={diagnostic.title}
              onNavigateBack={handleBackFromMonitoring}
            />
          );
        default:
          // Para diagnósticos que ainda não têm página específica
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  onClick={handleBackFromMonitoring}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para Diagnósticos
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Monitoramento - {diagnostic.title}</CardTitle>
                  <CardDescription>
                    A página de monitoramento para este diagnóstico está sendo desenvolvida.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Em breve você terá acesso a dados detalhados, gráficos e estatísticas específicas para este diagnóstico.
                  </p>
                </CardContent>
              </Card>
            </div>
          );
      }
    }
  }

  const renderDiagnosticCards = (models: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model) => {
        const IconComponent = model.icon;
        const isModular = model.id === "setores-trabalho" || model.id === "setor-arquivo";
        
        return (
          <Card key={model.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <IconComponent className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium leading-tight">
                    {model.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-xs leading-relaxed">
                    {model.description}
                  </CardDescription>
                  {isModular && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Diagnóstico Modular
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex gap-2">
                <Button 
                  className="flex-1 text-sm" 
                  size="sm"
                  onClick={() => isModular ? handleModularDiagnostic(model.id) : handleDiagnosticMonitoring(model.id)}
                >
                  <Monitor className="h-4 w-4 mr-1" />
                  {isModular ? "Configurar Diagnóstico" : "Acessar Diagnóstico"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const getLevelTitle = (level: string) => {
    const titles = {
      nivel1: "Nível 1 – Abaixo do padrão (0–20%)",
      nivel2: "Nível 2 – Em desenvolvimento (20,1–40%)",
      nivel3: "Nível 3 – Essencial (40,1–60%)",
      nivel4: "Nível 4 – Integrado (60,1–80%)",
      nivel5: "Nível 5 – Avançado (80,1–100%)"
    };
    return titles[level as keyof typeof titles];
  };

  const getLevelDescription = (level: string) => {
    const descriptions = {
      nivel1: "Diagnósticos fundamentais para identificar problemas básicos na gestão de documentos",
      nivel2: "Avaliações de sistemas e processos em desenvolvimento na organização",
      nivel3: "Diagnósticos de práticas essenciais e preservação digital",
      nivel4: "Análises avançadas de taxonomia, acesso e transparência",
      nivel5: "Avaliação integral e completa do programa arquivístico"
    };
    return descriptions[level as keyof typeof descriptions];
  };

  const getLevelCount = (level: string) => {
    return diagnosticModels[level as keyof typeof diagnosticModels]?.length || 0;
  };

  const getLevelColorClasses = (level: string) => {
    const colorMap = {
      nivel1: "bg-red-500 text-white", // Crítico - Vermelho
      nivel2: "bg-orange-500 text-white", // Preocupante - Laranja
      nivel3: "bg-yellow-500 text-white", // Moderado - Amarelo
      nivel4: "bg-blue-500 text-white", // Bom - Azul
      nivel5: "bg-green-500 text-white" // Excelente - Verde
    };
    return colorMap[level as keyof typeof colorMap] || "bg-gray-500 text-white";
  };

  return (
    <div className="space-y-6">
      {/* Botão de voltar */}
      {onNavigateBack && (
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={onNavigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Ferramentas de Avaliação
          </Button>
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Diagnósticos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 desde o mês passado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 novos esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">+12% de conclusão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Conformidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">+5% em relação ao trimestre anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="history" className="flex items-center gap-2 text-sm px-4 py-2">
            <Clock className="h-4 w-4" />
            Diagnósticos Realizados
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2 text-sm px-4 py-2">
            <Plus className="h-4 w-4" />
            Novo Diagnóstico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          {/* Filtros Recolhíveis */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tipo de diagnóstico</label>
                      <Select defaultValue="all-types">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-types">Todos os tipos</SelectItem>
                          <SelectItem value="level1">Nível 1</SelectItem>
                          <SelectItem value="level2">Nível 2</SelectItem>
                          <SelectItem value="level3">Nível 3</SelectItem>
                          <SelectItem value="level4">Nível 4</SelectItem>
                          <SelectItem value="level5">Nível 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <Select defaultValue="all-status">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-status">Todos os status</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="in-progress">Em andamento</SelectItem>
                          <SelectItem value="draft">Rascunho</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Setor/Unidade</label>
                      <Select defaultValue="all-sectors">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-sectors">Todos os setores</SelectItem>
                          <SelectItem value="rh">Recursos Humanos</SelectItem>
                          <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                          <SelectItem value="juridico">Jurídico</SelectItem>
                          <SelectItem value="administrativo">Administrativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Período</label>
                      <Select defaultValue="all-dates">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-dates">Todos os períodos</SelectItem>
                          <SelectItem value="last-30">Últimos 30 dias</SelectItem>
                          <SelectItem value="last-90">Últimos 90 dias</SelectItem>
                          <SelectItem value="last-year">Último ano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Tabela de Histórico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Diagnósticos Realizados
              </CardTitle>
              <CardDescription>
                Histórico de todos os diagnósticos arquivísticos aplicados na organização
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Diagnóstico</TableHead>
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

        <TabsContent value="new" className="space-y-6">
          {/* Informação sobre a organização por níveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Selecione o Tipo de Diagnóstico
              </CardTitle>
              <CardDescription>
                Os diagnósticos estão organizados por níveis de maturidade. Escolha o nível adequado para sua organização e selecione o diagnóstico específico que deseja aplicar.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Accordion com os níveis */}
          <Accordion type="multiple" className="space-y-4">
            {Object.keys(diagnosticModels).map((level) => (
              <AccordionItem key={level} value={level} className="border rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${getLevelColorClasses(level)}`}>
                        {level.slice(-1)}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-base">
                          {getLevelTitle(level)}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getLevelDescription(level)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {getLevelCount(level)} diagnósticos
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {renderDiagnosticCards(diagnosticModels[level as keyof typeof diagnosticModels])}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
