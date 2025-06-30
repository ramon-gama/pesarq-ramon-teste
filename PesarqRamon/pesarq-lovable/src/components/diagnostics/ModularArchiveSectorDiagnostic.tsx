import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ArrowLeft,
  Archive,
  CheckCircle,
  Camera,
  Settings,
  Plus,
  Eye,
  Upload,
  Calendar,
  Info,
  Download,
  Send,
  Image,
  BarChart3
} from "lucide-react";
import { ArchiveDiagnosticDashboard } from "./ArchiveDiagnosticDashboard";
import { ArchiveResponsesView } from "./ArchiveResponsesView";
import { DiagnosticLinkManager } from "../DiagnosticLinkManager";
import { ArchiveSectorDiagnosticForm } from "./ArchiveSectorDiagnosticForm";

interface ModularArchiveSectorDiagnosticProps {
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
        requiresEnvironment: true,
        description: "Avalia condições físicas de armazenamento, temperatura, umidade, iluminação e organização espacial",
        questionCount: 14
      },
      { 
        id: "riscos-sinistros", 
        name: "Riscos e Sinistros", 
        requiresEnvironment: true,
        description: "Identifica vulnerabilidades a incêndios, inundações, pragas, roubos e outros riscos ambientais",
        questionCount: 8
      }
    ]
  },
  {
    category: "Organização e Recuperação", 
    themes: [
      { 
        id: "organizacao-recuperacao", 
        name: "Organização e Recuperação", 
        requiresEnvironment: false,
        description: "Verifica sistemas de classificação, catalogação, indexação e métodos de busca documental",
        questionCount: 11
      }
    ]
  },
  {
    category: "Gestão Institucional",
    themes: [
      { 
        id: "estrutura-organizacional", 
        name: "Estrutura Organizacional", 
        requiresEnvironment: false,
        description: "Analisa atribuições, funções arquivísticas e estrutura do setor",
        questionCount: 8
      },
      { 
        id: "gestao-pessoal", 
        name: "Gestão de Pessoal", 
        requiresEnvironment: false,
        description: "Avalia composição da equipe, qualificação e rotatividade",
        questionCount: 6
      },
      { 
        id: "historico-diagnosticos", 
        name: "Histórico de Diagnósticos", 
        requiresEnvironment: false,
        description: "Verifica diagnósticos anteriores e avaliações SIGA",
        questionCount: 10
      }
    ]
  },
  {
    category: "Políticas e Processos",
    themes: [
      { 
        id: "politicas-instrumentos", 
        name: "Políticas e Instrumentos", 
        requiresEnvironment: false,
        description: "Examina políticas de arquivo, instrumentos normativos e diretrizes",
        questionCount: 6
      },
      { 
        id: "transferencia-recolhimento", 
        name: "Transferência e Recolhimento", 
        requiresEnvironment: false,
        description: "Analisa processos de transferência e recolhimento de documentos",
        questionCount: 12
      },
      { 
        id: "eliminacao", 
        name: "Eliminação", 
        requiresEnvironment: false,
        description: "Verifica processos de eliminação e descarte de documentos",
        questionCount: 4
      },
      { 
        id: "cpad", 
        name: "CPAD", 
        requiresEnvironment: false,
        description: "Avalia funcionamento da Comissão Permanente de Avaliação de Documentos",
        questionCount: 8
      }
    ]
  },
  {
    category: "Serviços e Produtos",
    themes: [
      { 
        id: "servicos-produtos", 
        name: "Serviços e Produtos", 
        requiresEnvironment: false,
        description: "Examina serviços oferecidos e produtos arquivísticos disponíveis",
        questionCount: 6
      },
      { 
        id: "acesso-consulta", 
        name: "Acesso e Consulta", 
        requiresEnvironment: false,
        description: "Avalia atendimento ao público e processos de consulta",
        questionCount: 11
      },
      { 
        id: "projetos-investimentos", 
        name: "Projetos e Investimentos", 
        requiresEnvironment: false,
        description: "Analisa projetos realizados e investimentos em gestão documental",
        questionCount: 5
      }
    ]
  }
];

const collectionsHistory = [
  {
    id: "1",
    environment: "Arquivo Central",
    themes: ["Ambientes e Acondicionamento", "Organização e Recuperação"],
    date: "15/11/2024",
    status: "Concluído",
    responses: 12,
    photos: 8,
    completionRate: 100
  },
  {
    id: "2",
    environment: "Sala de Consulta", 
    themes: ["Consulta e Acesso", "Proteção de Dados"],
    date: "10/11/2024",
    status: "Em andamento", 
    responses: 7,
    photos: 3,
    completionRate: 75
  },
  {
    id: "3",
    environment: "Área de Digitalização",
    themes: ["Digitalização", "Sistemas e Documentos Digitais"],
    date: "08/11/2024",
    status: "Concluído",
    responses: 15,
    photos: 12,
    completionRate: 100
  }
];

export function ModularArchiveSectorDiagnostic({ diagnosticTitle, onNavigateBack }: ModularArchiveSectorDiagnosticProps) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [collectionMode, setCollectionMode] = useState<"complete" | "thematic">("complete");
  const [enablePhotography, setEnablePhotography] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<"config" | "dashboard" | "responses" | "links" | "form">("config");

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
    return diagnosticThemes.flatMap(cat => cat.themes).reduce((total, theme) => total + theme.questionCount, 0);
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
      return true;
    }
    return selectedThemes.length > 0;
  };

  const handleStartDiagnostic = () => {
    console.log("Iniciando diagnóstico de arquivo:", {
      mode: collectionMode,
      themes: selectedThemes,
      photography: enablePhotography,
      questionCount: collectionMode === "complete" ? getTotalQuestions() : getSelectedQuestionsCount()
    });
    setCurrentView("form");
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

  const handlePhotoUpload = () => {
    console.log("Iniciando upload de fotos");
    // Implementação do upload de fotos
  };

  const handleExportData = () => {
    console.log("Exportando dados do histórico de coletas do arquivo");
    // Implementação da exportação
  };

  if (currentView === "dashboard") {
    return <ArchiveDiagnosticDashboard onNavigateBack={handleBackToConfig} onViewResponses={handleViewResponses} />;
  }

  if (currentView === "responses") {
    return <ArchiveResponsesView onNavigateBack={() => setCurrentView("dashboard")} />;
  }

  if (currentView === "links") {
    return (
      <DiagnosticLinkManager
        diagnosticId="setor-arquivo"
        diagnosticTitle={diagnosticTitle}
        onNavigateBack={handleBackToConfig}
      />
    );
  }

  if (currentView === "form") {
    return <ArchiveSectorDiagnosticForm onNavigateBack={handleBackToConfig} />;
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
                <Archive className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{diagnosticTitle}</h1>
                <p className="text-muted-foreground">Configuração modular com registro fotográfico</p>
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
                        Aplica todos os temas (98 perguntas)
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

        {/* Photography Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Configurações de Registro Fotográfico
            </CardTitle>
            <CardDescription>
              Configure as opções de documentação visual do diagnóstico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enablePhotography"
                checked={enablePhotography}
                onCheckedChange={(checked) => setEnablePhotography(checked as boolean)}
              />
              <label htmlFor="enablePhotography" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Habilitar registro fotográfico durante o diagnóstico
              </label>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Quando habilitado, será possível capturar fotos dos ambientes durante as respostas às perguntas relevantes.
            </p>
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
                              {theme.requiresEnvironment && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Camera className="h-3 w-3 text-blue-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Tema com questões sobre ambientes específicos</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
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
                ? "Inicie o diagnóstico completo do setor de arquivo (98 perguntas)"
                : `Inicie o diagnóstico com ${selectedThemes.length} tema(s) selecionado(s) (${getSelectedQuestionsCount()} perguntas)`
              }
              {enablePhotography && (
                <span className="block mt-1 text-xs">
                  📸 Registro fotográfico habilitado para documentação dos ambientes
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
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
              {enablePhotography && (
                <Button variant="outline" className="flex items-center gap-2" onClick={handlePhotoUpload}>
                  <Upload className="h-4 w-4" />
                  Upload de Fotos
                </Button>
              )}
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
                  Acompanhe as coletas realizadas para diferentes ambientes e temas
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
                  <TableHead>Ambiente</TableHead>
                  <TableHead>Temas Abordados</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Respostas</TableHead>
                  <TableHead>Fotos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collectionsHistory.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell className="font-medium">{collection.environment}</TableCell>
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
                      <div className="flex items-center gap-1">
                        <Image className="h-3 w-3" />
                        {collection.photos}
                      </div>
                    </TableCell>
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
