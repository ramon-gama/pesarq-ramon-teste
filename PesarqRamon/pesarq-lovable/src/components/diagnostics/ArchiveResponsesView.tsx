
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  Eye,
  FileText,
  Camera,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { AdvancedFilters } from "../AdvancedFilters";

interface ArchiveResponsesViewProps {
  onNavigateBack: () => void;
}

// Dados fictícios das respostas
const responsesData = [
  {
    id: "1",
    environment: "Arquivo Central",
    theme: "Ambientes e Acondicionamento",
    question: "A temperatura do ambiente é adequada para conservação?",
    answer: "Sim",
    score: 5,
    respondent: "Maria Silva",
    date: "15/11/2024 14:30",
    year: 2024,
    hasPhoto: true,
    status: "complete"
  },
  {
    id: "2",
    environment: "Arquivo Central", 
    theme: "Ambientes e Acondicionamento",
    question: "Existe controle de umidade no ambiente?",
    answer: "Parcialmente - apenas sensor, sem controle automático",
    score: 3,
    respondent: "Maria Silva",
    date: "15/11/2024 14:32",
    year: 2024,
    hasPhoto: true,
    status: "complete"
  },
  {
    id: "3",
    environment: "Depósito Principal",
    theme: "Riscos e Sinistros",
    question: "Há sistema de detecção de incêndio?",
    answer: "Não",
    score: 1,
    respondent: "João Santos",
    date: "10/11/2024 09:15",
    year: 2024,
    hasPhoto: false,
    status: "complete"
  },
  {
    id: "4",
    environment: "Sala de Consulta",
    theme: "Consulta e Acesso", 
    question: "O espaço de consulta é adequado para pesquisadores?",
    answer: "Sim, com mesas e equipamentos apropriados",
    score: 5,
    respondent: "Ana Costa",
    date: "08/11/2024 16:20",
    year: 2024,
    hasPhoto: true,
    status: "complete"
  },
  {
    id: "5",
    environment: "Área de Digitalização",
    theme: "Digitalização",
    question: "Os equipamentos de digitalização estão calibrados?",
    answer: "Em avaliação",
    score: 0,
    respondent: "Carlos Lima",
    date: "12/11/2024 10:30",
    year: 2024,
    hasPhoto: false,
    status: "pending"
  },
  {
    id: "6",
    environment: "Arquivo Central",
    theme: "Ambientes e Acondicionamento",
    question: "A temperatura do ambiente é adequada para conservação?",
    answer: "Não, muito quente",
    score: 1,
    respondent: "Pedro Silva",
    date: "15/10/2023 14:30",
    year: 2023,
    hasPhoto: true,
    status: "complete"
  }
];

export function ArchiveResponsesView({ onNavigateBack }: ArchiveResponsesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnvironment, setSelectedEnvironment] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const availableYears = Array.from(new Set(responsesData.map(r => r.year))).sort((a, b) => b - a);
  const environments = Array.from(new Set(responsesData.map(r => r.environment)));
  const themes = Array.from(new Set(responsesData.map(r => r.theme)));

  const filteredResponses = responsesData.filter(response => {
    const matchesSearch = response.environment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.respondent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEnvironment = selectedEnvironment === "all" || response.environment === selectedEnvironment;
    const matchesTheme = selectedTheme === "all" || response.theme === selectedTheme;
    const matchesYear = selectedYear === "all" || response.year.toString() === selectedYear;
    
    return matchesSearch && matchesEnvironment && matchesTheme && matchesYear;
  });

  const getScoreBadge = (score: number) => {
    if (score === 0) return <Badge variant="outline">Pendente</Badge>;
    if (score <= 2) return <Badge variant="destructive">Baixo ({score})</Badge>;
    if (score <= 3) return <Badge variant="secondary">Médio ({score})</Badge>;
    return <Badge variant="default">Alto ({score})</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEnvironment("all");
    setSelectedTheme("all");
    setSelectedYear("all");
  };

  const filters = [
    {
      key: "environment",
      label: "Ambiente",
      value: selectedEnvironment,
      options: [
        { value: "all", label: "Todos os ambientes" },
        ...environments.map(env => ({
          value: env,
          label: env
        }))
      ],
      onChange: (value: string) => setSelectedEnvironment(value)
    },
    {
      key: "theme",
      label: "Tema",
      value: selectedTheme,
      options: [
        { value: "all", label: "Todos os temas" },
        ...themes.map(theme => ({
          value: theme,
          label: theme
        }))
      ],
      onChange: (value: string) => setSelectedTheme(value)
    }
  ];

  const yearFilterConfig = {
    value: selectedYear,
    options: [
      { value: "all", label: "Todos os anos" },
      ...availableYears.map(year => ({
        value: year.toString(),
        label: year.toString()
      }))
    ],
    onChange: (value: string) => setSelectedYear(value)
  };

  const handleExportPDF = () => {
    console.log("Exportando PDF...");
  };

  const handleExportExcel = () => {
    console.log("Exportando Excel...");
  };

  const handleViewPhoto = (responseId: string) => {
    console.log("Visualizando foto da resposta:", responseId);
    // Implementação da visualização de foto
  };

  return (
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
            Voltar ao Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Respostas Detalhadas</h1>
              <p className="text-muted-foreground">Análise completa das respostas por ambiente e tema</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Avançados */}
      <AdvancedFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        yearFilter={yearFilterConfig}
        onClearFilters={clearFilters}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />

      {/* Estatísticas das Respostas Filtradas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Respostas</p>
                <p className="text-xl font-bold">{filteredResponses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completas</p>
                <p className="text-xl font-bold">
                  {filteredResponses.filter(r => r.status === "complete").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Com Fotos</p>
                <p className="text-xl font-bold">
                  {filteredResponses.filter(r => r.hasPhoto).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-xl font-bold">
                  {filteredResponses.filter(r => r.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Respostas */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas Detalhadas</CardTitle>
          <CardDescription>
            Lista completa das respostas coletadas com detalhes por pergunta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ambiente</TableHead>
                <TableHead>Tema</TableHead>
                <TableHead>Pergunta</TableHead>
                <TableHead>Resposta</TableHead>
                <TableHead>Pontuação</TableHead>
                <TableHead>Respondente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {response.environment}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {response.theme}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate" title={response.question}>
                      {response.question}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate" title={response.answer}>
                      {response.answer}
                    </p>
                  </TableCell>
                  <TableCell>
                    {getScoreBadge(response.score)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      {response.respondent}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {response.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(response.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      {response.hasPhoto && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewPhoto(response.id)}
                        >
                          <Camera className="h-3 w-3" />
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

      {filteredResponses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma resposta encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou verifique se há dados disponíveis para o período selecionado.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
