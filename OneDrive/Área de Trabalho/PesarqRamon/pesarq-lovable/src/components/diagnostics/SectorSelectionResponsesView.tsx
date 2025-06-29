
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  Eye,
  Download,
  FileText
} from "lucide-react";
import { AdvancedFilters } from "../AdvancedFilters";

interface SectorSelectionResponsesViewProps {
  onNavigateBack: () => void;
}

const responsesData = [
  {
    id: "1",
    setor: "Recursos Humanos",
    respondente: "Maria Silva",
    dataResposta: "15/11/2024",
    ano: 2024,
    criticidade: "alta",
    pontuacao: 85,
    respostas: 8,
    observacoes: "Setor com grande volume documental e condições inadequadas"
  },
  {
    id: "2",
    setor: "Financeiro",
    respondente: "João Santos",
    dataResposta: "12/11/2024",
    ano: 2024,
    criticidade: "moderada",
    pontuacao: 60,
    respostas: 8,
    observacoes: "Necessita melhorias nas condições de armazenamento"
  },
  {
    id: "3",
    setor: "Jurídico",
    respondente: "Ana Costa",
    dataResposta: "10/11/2024",
    ano: 2024,
    criticidade: "baixa",
    pontuacao: 25,
    respostas: 8,
    observacoes: "Setor bem organizado com boas práticas arquivísticas"
  },
  {
    id: "4",
    setor: "Administração",
    respondente: "Carlos Oliveira",
    dataResposta: "08/11/2024",
    ano: 2024,
    criticidade: "moderada",
    pontuacao: 55,
    respostas: 8,
    observacoes: "Volume moderado, mas condições podem ser melhoradas"
  },
  {
    id: "5",
    setor: "TI",
    respondente: "Fernanda Lima",
    dataResposta: "15/10/2023",
    ano: 2023,
    criticidade: "alta",
    pontuacao: 90,
    respostas: 8,
    observacoes: "Setor com documentação digital crítica"
  }
];

export function SectorSelectionResponsesView({ onNavigateBack }: SectorSelectionResponsesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCriticality, setSelectedCriticality] = useState("todos");
  const [selectedYear, setSelectedYear] = useState("all");

  const availableYears = Array.from(new Set(responsesData.map(r => r.ano))).sort((a, b) => b - a);
  const uniqueSectors = Array.from(new Set(responsesData.map(r => r.setor)));

  const filteredResponses = responsesData.filter(response => {
    const matchesSearch = response.setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.respondente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCriticality = selectedCriticality === "todos" || response.criticidade === selectedCriticality;
    const matchesYear = selectedYear === "all" || response.ano.toString() === selectedYear;
    
    return matchesSearch && matchesCriticality && matchesYear;
  });

  const getCriticalityBadge = (criticidade: string) => {
    switch (criticidade) {
      case 'alta':
        return <Badge variant="destructive">Alta Criticidade</Badge>;
      case 'moderada':
        return <Badge variant="secondary">Criticidade Moderada</Badge>;
      case 'baixa':
        return <Badge variant="default">Sem Criticidade</Badge>;
      default:
        return <Badge variant="outline">Não Classificado</Badge>;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCriticality("todos");
    setSelectedYear("all");
  };

  const filters = [
    {
      key: "criticality",
      label: "Criticidade",
      value: selectedCriticality,
      options: [
        { value: "todos", label: "Todas as Criticidades" },
        { value: "alta", label: "Alta Criticidade" },
        { value: "moderada", label: "Criticidade Moderada" },
        { value: "baixa", label: "Sem Criticidade" }
      ],
      onChange: (value: string) => setSelectedCriticality(value)
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

  const handleExportResponses = () => {
    console.log("Exportando respostas...");
    // Implementação da exportação
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
            Voltar para Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Respostas - Diagnóstico de Seleção de Setores</h1>
              <p className="text-muted-foreground">Visualização detalhada das respostas coletadas</p>
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

      {/* Resumo dos Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{filteredResponses.length}</p>
              <p className="text-sm text-muted-foreground">Respostas Encontradas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {filteredResponses.filter(r => r.criticidade === 'alta').length}
              </p>
              <p className="text-sm text-muted-foreground">Alta Criticidade</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {filteredResponses.filter(r => r.criticidade === 'moderada').length}
              </p>
              <p className="text-sm text-muted-foreground">Criticidade Moderada</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredResponses.filter(r => r.criticidade === 'baixa').length}
              </p>
              <p className="text-sm text-muted-foreground">Sem Criticidade</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Respostas */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas Detalhadas</CardTitle>
          <CardDescription>
            Lista completa das respostas com informações de classificação e observações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setor</TableHead>
                <TableHead>Respondente</TableHead>
                <TableHead>Data da Resposta</TableHead>
                <TableHead>Criticidade</TableHead>
                <TableHead>Pontuação</TableHead>
                <TableHead>Respostas</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell className="font-medium">{response.setor}</TableCell>
                  <TableCell>{response.respondente}</TableCell>
                  <TableCell>{response.dataResposta}</TableCell>
                  <TableCell>
                    {getCriticalityBadge(response.criticidade)}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{response.pontuacao}%</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {response.respostas}/8 perguntas
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate" title={response.observacoes}>
                      {response.observacoes}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Ver Detalhes
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
