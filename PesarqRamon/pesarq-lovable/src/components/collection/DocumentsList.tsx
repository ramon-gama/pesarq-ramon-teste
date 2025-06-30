
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  FileText,
  MapPin,
  Calendar,
  Building2,
  Archive,
  Download
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dados simulados
const mockDocuments = [
  {
    id: "1",
    classificationCode: "100.1",
    documentType: "Ofício",
    title: "Solicitação de Recursos Orçamentários 2024",
    description: "Ofício solicitando aprovação de recursos para projetos especiais",
    producingSector: "Presidência",
    creationDate: "2024-01-15",
    location: {
      room: "Arquivo Central",
      module: "A",
      shelf: "01",
      shelf_level: "03",
      box: "001"
    },
    finalDestination: "permanent",
    registeredBy: "Carlos Leite",
    registeredAt: "2024-06-01",
    keywords: ["orçamento", "recursos", "2024"],
    physicalState: "good"
  },
  {
    id: "2",
    classificationCode: "020.2",
    documentType: "Memorando",
    title: "Alteração de Procedimentos de RH",
    description: "Memorando interno sobre mudanças nos procedimentos de recursos humanos",
    producingSector: "Recursos Humanos",
    creationDate: "2024-02-10",
    location: {
      room: "Arquivo Setorial RH",
      module: "B",
      shelf: "02",
      shelf_level: "01",
      box: "045"
    },
    finalDestination: "elimination",
    registeredBy: "Maria Silva",
    registeredAt: "2024-06-02",
    keywords: ["RH", "procedimentos", "interno"],
    physicalState: "excellent"
  },
  {
    id: "3",
    classificationCode: "030.1",
    documentType: "Contrato",
    title: "Contrato de Prestação de Serviços - Limpeza",
    description: "Contrato firmado com empresa de limpeza e conservação",
    producingSector: "Administrativo",
    creationDate: "2024-03-05",
    location: {
      room: "Arquivo Central",
      module: "C",
      shelf: "05",
      shelf_level: "02",
      box: "120"
    },
    finalDestination: "permanent",
    registeredBy: "João Santos",
    registeredAt: "2024-06-03",
    keywords: ["contrato", "limpeza", "terceirizado"],
    physicalState: "good"
  }
];

const getDestinationBadge = (destination: string) => {
  switch (destination) {
    case "permanent":
      return <Badge className="bg-green-500">Guarda Permanente</Badge>;
    case "elimination":
      return <Badge className="bg-red-500">Eliminação</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">Avaliação Pendente</Badge>;
    default:
      return <Badge variant="secondary">Não Definido</Badge>;
  }
};

const getStateBadge = (state: string) => {
  switch (state) {
    case "excellent":
      return <Badge className="bg-green-600">Excelente</Badge>;
    case "good":
      return <Badge className="bg-blue-500">Bom</Badge>;
    case "regular":
      return <Badge className="bg-yellow-500">Regular</Badge>;
    case "poor":
      return <Badge className="bg-orange-500">Ruim</Badge>;
    case "critical":
      return <Badge className="bg-red-600">Crítico</Badge>;
    default:
      return <Badge variant="secondary">Não Informado</Badge>;
  }
};

export function DocumentsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDestination, setFilterDestination] = useState("all");

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.classificationCode.includes(searchTerm) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || doc.documentType === filterType;
    const matchesDestination = filterDestination === "all" || doc.finalDestination === filterDestination;
    
    return matchesSearch && matchesType && matchesDestination;
  });

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Busca e Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por título, código ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Ofício">Ofício</SelectItem>
                <SelectItem value="Memorando">Memorando</SelectItem>
                <SelectItem value="Contrato">Contrato</SelectItem>
                <SelectItem value="Relatório">Relatório</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDestination} onValueChange={setFilterDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Destinação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="permanent">Guarda Permanente</SelectItem>
                <SelectItem value="elimination">Eliminação</SelectItem>
                <SelectItem value="pending">Avaliação Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {filteredDocuments.length} documento(s) encontrado(s)
        </h3>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Lista
        </Button>
      </div>

      {/* Lista de Documentos */}
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Cabeçalho */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#15AB92]" />
                      <span className="font-mono text-sm font-semibold">{doc.classificationCode}</span>
                      <Badge variant="outline">{doc.documentType}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getDestinationBadge(doc.finalDestination)}
                      {getStateBadge(doc.physicalState)}
                    </div>
                  </div>

                  {/* Título e Descrição */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{doc.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{doc.description}</p>
                  </div>

                  {/* Metadados */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {doc.producingSector}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(doc.creationDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {`${doc.location.room} - ${doc.location.module}.${doc.location.shelf}.${doc.location.shelf_level}`}
                    </div>
                    <div className="flex items-center gap-1">
                      <Archive className="h-3 w-3" />
                      Caixa {doc.location.box}
                    </div>
                  </div>

                  {/* Keywords */}
                  {doc.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {doc.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex lg:flex-col gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum documento encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou termos de busca.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
