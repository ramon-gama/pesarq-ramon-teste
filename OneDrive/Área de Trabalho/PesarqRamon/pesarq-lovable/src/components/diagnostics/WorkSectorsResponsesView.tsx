
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  Eye,
  FileText,
  Building2,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp
} from "lucide-react";
import { AdvancedFilters } from "../AdvancedFilters";

interface WorkSectorsResponsesViewProps {
  onNavigateBack: () => void;
}

// Dados fictícios das respostas
const responsesData = [
  {
    id: "1",
    sector: "Recursos Humanos",
    category: "Gestão Documental",
    question: "O setor possui um plano de classificação de documentos?",
    answer: "Sim, implementado parcialmente",
    score: 3,
    respondent: "Maria Silva",
    date: "15/11/2024 14:30",
    year: 2024,
    status: "complete",
    priority: "alta"
  },
  {
    id: "2",
    sector: "Financeiro",
    category: "Organização e Arquivamento",
    question: "Os documentos estão organizados de forma adequada?",
    answer: "Não, precisamos de melhorias",
    score: 2,
    respondent: "João Santos",
    date: "12/11/2024 09:15",
    year: 2024,
    status: "complete",
    priority: "média"
  },
  {
    id: "3",
    sector: "Jurídico",
    category: "Acesso e Consulta",
    question: "Há controle de acesso aos documentos confidenciais?",
    answer: "Sim, temos sistema de controle rigoroso",
    score: 5,
    respondent: "Ana Costa",
    date: "10/11/2024 16:20",
    year: 2024,
    status: "complete",
    priority: "baixa"
  },
  {
    id: "4",
    sector: "TI",
    category: "Digitalização",
    question: "O setor possui documentos digitalizados?",
    answer: "Em processo de digitalização",
    score: 0,
    respondent: "Carlos Lima",
    date: "08/11/2024 10:30",
    year: 2024,
    status: "pending",
    priority: "alta"
  },
  {
    id: "5",
    sector: "Administração",
    category: "Gestão Documental",
    question: "Existe tabela de temporalidade implementada?",
    answer: "Sim, totalmente implementada",
    score: 5,
    respondent: "Fernanda Oliveira",
    date: "15/10/2023 11:00",
    year: 2023,
    status: "complete",
    priority: "média"
  }
];

export function WorkSectorsResponsesView({ onNavigateBack }: WorkSectorsResponsesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const availableYears = Array.from(new Set(responsesData.map(r => r.year))).sort((a, b) => b - a);
  const sectors = Array.from(new Set(responsesData.map(r => r.sector)));
  const categories = Array.from(new Set(responsesData.map(r => r.category)));

  const filteredResponses = responsesData.filter(response => {
    const matchesSearch = response.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.respondent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "all" || response.sector === selectedSector;
    const matchesCategory = selectedCategory === "all" || response.category === selectedCategory;
    const matchesPriority = selectedPriority === "all" || response.priority === selectedPriority;
    const matchesYear = selectedYear === "all" || response.year.toString() === selectedYear;
    
    return matchesSearch && matchesSector && matchesCategory && matchesPriority && matchesYear;
  });

  const getScoreBadge = (score: number) => {
    if (score === 0) return <Badge variant="outline">Pendente</Badge>;
    if (score <= 2) return <Badge variant="destructive">Baixo ({score})</Badge>;
    if (score <= 3) return <Badge variant="secondary">Médio ({score})</Badge>;
    return <Badge variant="default">Alto ({score})</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>;
      case 'média':
        return <Badge variant="secondary">Média</Badge>;
      case 'baixa':
        return <Badge variant="default">Baixa</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
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
    setSelectedSector("all");
    setSelectedCategory("all");
    setSelectedPriority("all");
    setSelectedYear("all");
  };

  const filters = [
    {
      key: "sector",
      label: "Setor",
      value: selectedSector,
      options: [
        { value: "all", label: "Todos os setores" },
        ...sectors.map(sector => ({
          value: sector,
          label: sector
        }))
      ],
      onChange: (value: string) => setSelectedSector(value)
    },
    {
      key: "category",
      label: "Categoria",
      value: selectedCategory,
      options: [
        { value: "all", label: "Todas as categorias" },
        ...categories.map(category => ({
          value: category,
          label: category
        }))
      ],
      onChange: (value: string) => setSelectedCategory(value)
    },
    {
      key: "priority",
      label: "Prioridade",
      value: selectedPriority,
      options: [
        { value: "all", label: "Todas as prioridades" },
        { value: "alta", label: "Alta" },
        { value: "média", label: "Média" },
        { value: "baixa", label: "Baixa" }
      ],
      onChange: (value: string) => setSelectedPriority(value)
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
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Respostas - Setores de Trabalho</h1>
              <p className="text-muted-foreground">Análise detalhada das respostas por setor e categoria</p>
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
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                <p className="text-xl font-bold">
                  {filteredResponses.filter(r => r.priority === "alta").length}
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
            Lista completa das respostas coletadas com detalhes por setor e categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Pergunta</TableHead>
                <TableHead>Resposta</TableHead>
                <TableHead>Pontuação</TableHead>
                <TableHead>Prioridade</TableHead>
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
                      <Building2 className="h-3 w-3" />
                      {response.sector}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {response.category}
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
                    {getPriorityBadge(response.priority)}
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
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
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
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
