import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ArrowLeft,
  Users,
  CheckCircle,
  FileText,
  Settings,
  Plus,
  Eye,
  Filter,
  Calendar,
  Info,
  Download,
  Send,
  BarChart3
} from "lucide-react";

import { WorkSectorsDashboard } from "./WorkSectorsDashboard";
import { WorkSectorsResponsesView } from "./WorkSectorsResponsesView";
import { WorkSectorsDiagnosticForm } from "./WorkSectorsDiagnosticForm";
import { DiagnosticLinkManager } from "../DiagnosticLinkManager";

interface ModularWorkSectorsDiagnosticProps {
  diagnosticTitle: string;
  onNavigateBack: () => void;
}

const diagnosticThemes = [
  {
    category: "Acervo Documental",
    themes: [
      { 
        id: "ambientes-acondicionamento", 
        name: "Ambientes e Acondicionamento",
        description: "Avalia as condições físicas de armazenamento, climatização, segurança e organização dos espaços documentais",
        questionCount: 15
      },
      { 
        id: "riscos-sinistros", 
        name: "Riscos e Sinistros",
        description: "Identifica vulnerabilidades a incêndios, inundações, pragas e outros riscos que possam danificar o acervo",
        questionCount: 12
      }
    ]
  },
  {
    category: "Organização e Recuperação",
    themes: [
      { 
        id: "organizacao-recuperacao", 
        name: "Organização e Recuperação",
        description: "Verifica sistemas de classificação, indexação e métodos de busca e recuperação de documentos",
        questionCount: 18
      }
    ]
  },
  {
    category: "Produção Documental",
    themes: [
      { 
        id: "producao-documental", 
        name: "Produção Documental",
        description: "Analisa processos de criação, padronização e controle de novos documentos organizacionais",
        questionCount: 14
      },
      { 
        id: "digitalizacao", 
        name: "Digitalização",
        description: "Avalia estratégias, equipamentos e procedimentos para conversão de documentos físicos para digitais",
        questionCount: 16
      }
    ]
  },
  {
    category: "Consulta e Acesso",
    themes: [
      { 
        id: "consulta-acesso", 
        name: "Consulta e Acesso",
        description: "Examina políticas e processos para disponibilização e acesso aos documentos por usuários internos e externos",
        questionCount: 20
      },
      { 
        id: "protecao-dados", 
        name: "Proteção de Dados",
        description: "Verifica conformidade com LGPD, políticas de privacidade e segurança da informação pessoal",
        questionCount: 22
      },
      { 
        id: "sistemas-documentos-digitais", 
        name: "Sistemas e Documentos Digitais",
        description: "Analisa plataformas digitais, GED, workflow e gestão eletrônica de documentos",
        questionCount: 19
      },
      { 
        id: "atividades-protocolo", 
        name: "Atividades de Protocolo",
        description: "Avalia processos de recebimento, registro, tramitação e controle de documentos",
        questionCount: 17
      },
      { 
        id: "servicos-arquivisticos", 
        name: "Serviços Arquivísticos Prestados",
        description: "Examina qualidade e eficiência dos serviços oferecidos pelo setor de arquivo",
        questionCount: 13
      }
    ]
  }
];

const sectors = [
  "Recursos Humanos",
  "Financeiro", 
  "Tecnologia da Informação",
  "Jurídico",
  "Administração",
  "Comunicação",
  "Planejamento",
  "Operações"
];

const collectionsHistory = [
  {
    id: "1",
    sector: "Recursos Humanos",
    themes: ["Ambientes e Acondicionamento", "Produção Documental"],
    date: "15/11/2024",
    status: "Concluído",
    responses: 8,
    completionRate: 100
  },
  {
    id: "2",
    sector: "Financeiro",
    themes: ["Organização e Recuperação", "Proteção de Dados"],
    date: "10/11/2024", 
    status: "Em andamento",
    responses: 5,
    completionRate: 65
  },
  {
    id: "3",
    sector: "Tecnologia da Informação",
    themes: ["Sistemas e Documentos Digitais", "Digitalização"],
    date: "08/11/2024",
    status: "Concluído",
    responses: 12,
    completionRate: 100
  }
];

export function ModularWorkSectorsDiagnostic({ diagnosticTitle, onNavigateBack }: ModularWorkSectorsDiagnosticProps) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [collectionMode, setCollectionMode] = useState<"complete" | "thematic">("complete");
  const [currentView, setCurrentView] = useState<"config" | "dashboard" | "responses" | "form" | "links">("config");

  const handleThemeToggle = (themeId: string) => {
    setSelectedThemes(prev => 
      prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  const handleSelectAllThemes = () => {
    const allThemeIds = diagnosticThemes.flatMap(cat => cat.themes.map(theme => theme.id));
    setSelectedThemes(allThemeIds);
  };

  const handleClearAllThemes = () => {
    setSelectedThemes([]);
  };

  const getSelectedThemesCount = () => {
    return selectedThemes.length;
  };

  const getTotalThemesCount = () => {
    return diagnosticThemes.flatMap(cat => cat.themes).length;
  };

  const getTotalQuestions = () => {
    return 98;
  };

  const getSelectedQuestionsCount = () => {
    const allThemes = diagnosticThemes.flatMap(cat => cat.themes);
    return selectedThemes.reduce((total, themeId) => {
      const theme = allThemes.find(t => t.id === themeId);
      return total + (theme?.questionCount || 0);
    }, 0);
  };

  const canStartCollection = () => {
    if (collectionMode === "complete") {
      return selectedSector !== "";
    }
    return selectedSector !== "" && selectedThemes.length > 0;
  };

  const handleStartDiagnostic = () => {
    if (collectionMode === "complete") {
      console.log("Iniciando formulário completo:", {
        mode: collectionMode,
        sector: selectedSector,
        questionCount: getTotalQuestions()
      });
      setCurrentView("form");
    } else {
      console.log("Iniciando diagnóstico por temas:", {
        mode: collectionMode,
        sector: selectedSector,
        themes: selectedThemes,
        questionCount: getSelectedQuestionsCount()
      });
      setCurrentView("dashboard");
    }
  };

  const handleViewDashboard = () => {
    setCurrentView("dashboard");
  };

  const handleViewResponses = () => {
    setCurrentView("responses");
  };

  const handleViewLinks = () => {
    setCurrentView("links");
  };

  const handleBackToConfig = () => {
    setCurrentView("config");
  };

  const handleExportData = () => {
    console.log("Exportando dados do histórico de coletas");
    // Implementação da exportação
  };

  const handleSendReminder = (collectionId: string) => {
    console.log("Enviando lembrete para coleta:", collectionId);
    // Implementação do envio de lembrete
  };

  if (currentView === "dashboard") {
    return <WorkSectorsDashboard onNavigateBack={handleBackToConfig} onViewResponses={handleViewResponses} />;
  }

  if (currentView === "responses") {
    return <WorkSectorsResponsesView onNavigateBack={() => setCurrentView("dashboard")} />;
  }

  if (currentView === "form") {
    return <WorkSectorsDiagnosticForm onNavigateBack={handleBackToConfig} selectedSector={selectedSector} />;
  }

  if (currentView === "links") {
    return (
      <DiagnosticLinkManager
        diagnosticId="setores-trabalho"
        diagnosticTitle={diagnosticTitle}
        onNavigateBack={handleBackToConfig}
      />
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onNavigateBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Diagnósticos
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{diagnosticTitle}</h1>
                <p className="text-muted-foreground">Configuração modular do diagnóstico por setores</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleViewDashboard}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Ver Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handleViewResponses}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Ver Respostas
            </Button>
          </div>
        </div>

        {/* Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Modo de Coleta</CardTitle>
            <CardDescription>
              Escolha como deseja realizar a coleta de dados para este diagnóstico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`cursor-pointer transition-all ${collectionMode === "complete" ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-4" onClick={() => setCollectionMode("complete")}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={collectionMode === "complete"} />
                    <div>
                      <h4 className="font-semibold">Diagnóstico Completo</h4>
                      <p className="text-sm text-muted-foreground">
                        Aplica todos os temas ({getTotalQuestions()} perguntas)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-all ${collectionMode === "thematic" ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-4" onClick={() => setCollectionMode("thematic")}>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={collectionMode === "thematic"} />
                    <div>
                      <h4 className="font-semibold">Diagnóstico por Temas</h4>
                      <p className="text-sm text-muted-foreground">
                        Permite escolher temas específicos para coleta direcionada
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Sector Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Seleção do Setor</CardTitle>
            <CardDescription>
              Escolha o setor que será avaliado neste diagnóstico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Theme Selection (only visible in thematic mode) */}
        {collectionMode === "thematic" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Seleção de Temas</CardTitle>
                  <CardDescription>
                    Escolha os temas específicos que deseja abordar no diagnóstico
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAllThemes}>
                    Selecionar Todos
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearAllThemes}>
                    Limpar Seleção
                  </Button>
                </div>
              </div>
              {selectedThemes.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">
                    {getSelectedThemesCount()} de {getTotalThemesCount()} temas selecionados
                  </Badge>
                  <Badge variant="outline">
                    {getSelectedQuestionsCount()} perguntas selecionadas
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {diagnosticThemes.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-semibold text-sm mb-3 text-primary">
                      {category.category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.themes.map((theme) => (
                        <div
                          key={theme.id}
                          className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                          onClick={() => handleThemeToggle(theme.id)}
                        >
                          <Checkbox
                            checked={selectedThemes.includes(theme.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium cursor-pointer">
                                {theme.name}
                              </label>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>{theme.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {theme.questionCount} perguntas
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Coleta</CardTitle>
            <CardDescription>
              {collectionMode === "complete" 
                ? `Inicie o diagnóstico completo para o setor selecionado (${getTotalQuestions()} perguntas)`
                : `Inicie o diagnóstico com ${selectedThemes.length} tema(s) selecionado(s) (${getSelectedQuestionsCount()} perguntas)`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                className="flex items-center gap-2"
                disabled={!canStartCollection()}
                onClick={handleStartDiagnostic}
              >
                <Plus className="h-4 w-4" />
                {collectionMode === "complete" ? "Iniciar Diagnóstico Completo" : "Iniciar Coleta por Temas"}
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleViewLinks}
              >
                <Settings className="h-4 w-4" />
                Gerenciar Links Públicos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Collection History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Histórico de Coletas
                </CardTitle>
                <CardDescription>
                  Acompanhe as coletas realizadas para diferentes setores e temas
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar Dados
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Setor</TableHead>
                  <TableHead>Temas Abordados</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Respostas</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collectionsHistory.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell className="font-medium">{collection.sector}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {collection.themes.map((theme, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{collection.date}</TableCell>
                    <TableCell>
                      <Badge variant={collection.status === "Concluído" ? "default" : "secondary"}>
                        {collection.status === "Concluído" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {collection.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${collection.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {collection.completionRate}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{collection.responses}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Ver Detalhes
                        </Button>
                        {collection.status === "Em andamento" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSendReminder(collection.id)}
                            className="flex items-center gap-1"
                          >
                            <Send className="h-3 w-3" />
                            Lembrete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
