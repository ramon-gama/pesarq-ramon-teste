
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Archive, 
  Search, 
  Download, 
  Plus,
  MapPin,
  FileText,
  Calendar,
  Building2,
  Printer
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const boxesData = [
  {
    id: "001",
    location: {
      room: "Arquivo Central",
      module: "A",
      shelf: "01",
      shelf_level: "03"
    },
    documentsCount: 45,
    period: "2020-2022",
    sectors: ["Presidência", "Administrativo"],
    classificationCodes: ["100.1", "100.2", "200.1"],
    status: "full",
    createdBy: "Carlos Leite",
    createdAt: "2024-01-15",
    lastUpdate: "2024-05-20",
    observations: "Documentos em bom estado de conservação"
  },
  {
    id: "045",
    location: {
      room: "Arquivo Setorial RH",
      module: "B",
      shelf: "02",
      shelf_level: "01"
    },
    documentsCount: 38,
    period: "2021-2023",
    sectors: ["Recursos Humanos"],
    classificationCodes: ["020.1", "020.2", "020.3"],
    status: "partial",
    createdBy: "Maria Silva",
    createdAt: "2024-02-10",
    lastUpdate: "2024-06-01",
    observations: "Espaço disponível para mais documentos"
  },
  {
    id: "120",
    location: {
      room: "Depósito Anexo",
      module: "C",
      shelf: "05",
      shelf_level: "02"
    },
    documentsCount: 52,
    period: "2019-2021",
    sectors: ["Financeiro", "Contabilidade"],
    classificationCodes: ["030.1", "030.2", "040.1"],
    status: "full",
    createdBy: "João Santos",
    createdAt: "2024-03-05",
    lastUpdate: "2024-05-15",
    observations: "Documentos aguardando avaliação para eliminação"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "full":
      return <Badge className="bg-red-500">Cheia</Badge>;
    case "partial":
      return <Badge className="bg-yellow-500">Parcialmente Cheia</Badge>;
    case "empty":
      return <Badge className="bg-green-500">Disponível</Badge>;
    default:
      return <Badge variant="secondary">Indefinido</Badge>;
  }
};

export function BoxMirrors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBoxes = boxesData.filter(box => {
    const matchesSearch = box.id.includes(searchTerm) ||
                         box.location.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         box.sectors.some(sector => sector.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === "all" || box.location.room === locationFilter;
    const matchesStatus = statusFilter === "all" || box.status === statusFilter;
    
    return matchesSearch && matchesLocation && matchesStatus;
  });

  const handleGenerateMirror = (boxId: string) => {
    console.log(`Gerando espelho da caixa: ${boxId}`);
  };

  const handleGenerateAllMirrors = () => {
    console.log("Gerando espelhos de todas as caixas");
  };

  const totalBoxes = boxesData.length;
  const fullBoxes = boxesData.filter(box => box.status === "full").length;
  const availableBoxes = boxesData.filter(box => box.status === "empty").length;

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Caixas</CardTitle>
            <Archive className="h-4 w-4 ml-auto text-[#15AB92]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBoxes}</div>
            <p className="text-xs text-gray-600">
              Caixas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caixas Cheias</CardTitle>
            <Archive className="h-4 w-4 ml-auto text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fullBoxes}</div>
            <p className="text-xs text-red-600">
              Sem espaço disponível
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caixas Disponíveis</CardTitle>
            <Archive className="h-4 w-4 ml-auto text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableBoxes}</div>
            <p className="text-xs text-green-600">
              Prontas para uso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <Archive className="h-4 w-4 ml-auto text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((fullBoxes / totalBoxes) * 100)}%</div>
            <p className="text-xs text-blue-600">
              Espaço utilizado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Busca e Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar por caixa, local ou setor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os locais</SelectItem>
                <SelectItem value="Arquivo Central">Arquivo Central</SelectItem>
                <SelectItem value="Arquivo Setorial RH">Arquivo Setorial RH</SelectItem>
                <SelectItem value="Depósito Anexo">Depósito Anexo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="full">Cheias</SelectItem>
                <SelectItem value="partial">Parcialmente Cheias</SelectItem>
                <SelectItem value="empty">Disponíveis</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleGenerateAllMirrors} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Gerar Todos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Caixas */}
      <div className="space-y-4">
        {filteredBoxes.map((box) => (
          <Card key={box.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Cabeçalho */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Archive className="h-5 w-5 text-[#15AB92]" />
                        <span className="font-bold text-lg">Caixa {box.id}</span>
                      </div>
                      {getStatusBadge(box.status)}
                      <Badge variant="outline">{box.documentsCount} docs</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Período: {box.period}
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {box.location.room} - Módulo {box.location.module}, 
                      Estante {box.location.shelf}, 
                      Prateleira {box.location.shelf_level}
                    </span>
                  </div>

                  {/* Setores */}
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Setores:</span>
                    <div className="flex flex-wrap gap-1">
                      {box.sectors.map((sector) => (
                        <Badge key={sector} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Códigos de Classificação */}
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Códigos:</span>
                    <div className="flex flex-wrap gap-1">
                      {box.classificationCodes.map((code) => (
                        <Badge key={code} variant="outline" className="text-xs font-mono">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <strong>Criado por:</strong> {box.createdBy} em {new Date(box.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <strong>Última atualização:</strong> {new Date(box.lastUpdate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {/* Observações */}
                  {box.observations && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Observações:</strong> {box.observations}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex lg:flex-col gap-2">
                  <Button 
                    onClick={() => handleGenerateMirror(box.id)}
                    className="flex items-center gap-1"
                  >
                    <Printer className="h-3 w-3" />
                    Espelho
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Plus className="h-3 w-3" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBoxes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma caixa encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou termos de busca.</p>
          </CardContent>
        </Card>
      )}

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Caixa
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Lista
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatório de Ocupação
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Mapa de Localização
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
