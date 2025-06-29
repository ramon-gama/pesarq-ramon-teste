
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  TrendingUp
} from "lucide-react";

const diagnosticModels = {
  nivel1: [
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
      description: "Avaliação dos processos de gestão documental",
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

export function ArchivalDiagnostic() {
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const renderDiagnosticCards = (models: any[], level: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model) => {
        const IconComponent = model.icon;
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
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button className="w-full text-sm" size="sm">
                Aplicar Diagnóstico
              </Button>
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

  const filteredLevels = selectedLevel === "all" 
    ? Object.keys(diagnosticModels)
    : [selectedLevel];

  return (
    <div className="space-y-6">
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
          {/* Filtro por Nível */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtrar por nível de maturidade:</span>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full sm:w-80">
                    <SelectValue placeholder="Selecione um nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os níveis</SelectItem>
                    <SelectItem value="nivel1">Nível 1 – Abaixo do padrão</SelectItem>
                    <SelectItem value="nivel2">Nível 2 – Em desenvolvimento</SelectItem>
                    <SelectItem value="nivel3">Nível 3 – Essencial</SelectItem>
                    <SelectItem value="nivel4">Nível 4 – Integrado</SelectItem>
                    <SelectItem value="nivel5">Nível 5 – Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cards de Diagnósticos por Nível */}
          <div className="space-y-8">
            {filteredLevels.map((level) => (
              <div key={level} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {level.slice(-1)}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {getLevelTitle(level)}
                  </h3>
                </div>
                {renderDiagnosticCards(diagnosticModels[level as keyof typeof diagnosticModels], level)}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
