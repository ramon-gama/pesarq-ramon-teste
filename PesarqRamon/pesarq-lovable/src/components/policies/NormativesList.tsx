
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Edit, Download, Clock, AlertTriangle } from "lucide-react";

interface NormativesListProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  onSelectNormative: (normative: any) => void;
}

const mockNormatives = [
  {
    id: 1,
    title: "Política de Gestão de Documentos",
    organ: "Ministério da Saúde",
    type: "Política",
    scope: "Nacional",
    publishDate: "15/03/2024",
    status: "vigente",
    version: "2.1",
    reviewDate: "15/03/2027",
    daysToReview: 1095,
    description: "Diretrizes gerais para gestão documental no âmbito do órgão"
  },
  {
    id: 2,
    title: "Plano de Classificação Documental",
    organ: "Ministério da Saúde",
    type: "Instrução Normativa",
    scope: "Interno",
    publishDate: "20/02/2024",
    status: "vigente",
    version: "1.3",
    reviewDate: "20/02/2026",
    daysToReview: 730,
    description: "Estrutura hierárquica de classificação de documentos"
  },
  {
    id: 3,
    title: "Tabela de Temporalidade",
    organ: "Ministério da Saúde",
    type: "Manual",
    scope: "Setorial",
    publishDate: "10/01/2024",
    status: "revisao",
    version: "3.0",
    reviewDate: "10/01/2025",
    daysToReview: 365,
    description: "Prazos de guarda e destinação final de documentos"
  },
  {
    id: 4,
    title: "Protocolo de Digitalização",
    organ: "Ministério da Saúde",
    type: "Resolução",
    scope: "Interno",
    publishDate: "05/12/2023",
    status: "elaboracao",
    version: "1.0-draft",
    reviewDate: "05/12/2024",
    daysToReview: 30,
    description: "Procedimentos para digitalização de acervos documentais"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "vigente": return "bg-green-100 text-green-800";
    case "revisao": return "bg-yellow-100 text-yellow-800";
    case "elaboracao": return "bg-blue-100 text-blue-800";
    case "revogada": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "vigente": return "Vigente";
    case "revisao": return "Em Revisão";
    case "elaboracao": return "Em Elaboração";
    case "revogada": return "Revogada";
    default: return status;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Política": return "text-blue-600";
    case "Instrução Normativa": return "text-green-600";
    case "Manual": return "text-purple-600";
    case "Resolução": return "text-orange-600";
    default: return "text-gray-600";
  }
};

export function NormativesList({ searchTerm, statusFilter, typeFilter, onSelectNormative }: NormativesListProps) {
  const filteredNormatives = mockNormatives.filter(normative => {
    const matchesSearch = normative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         normative.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || normative.status === statusFilter;
    const matchesType = typeFilter === "all" || normative.type.toLowerCase() === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="grid gap-4">
      {filteredNormatives.map((normative) => (
        <Card key={normative.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <FileText className={`h-5 w-5 mt-1 ${getTypeColor(normative.type)}`} />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-1">{normative.title}</CardTitle>
                  <CardDescription className="mb-2">{normative.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span>Órgão: {normative.organ}</span>
                    <span>•</span>
                    <span>Tipo: {normative.type}</span>
                    <span>•</span>
                    <span>Escopo: {normative.scope}</span>
                    <span>•</span>
                    <span>Versão: {normative.version}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(normative.status)}>
                  {getStatusLabel(normative.status)}
                </Badge>
                {normative.daysToReview <= 365 && normative.status === "vigente" && (
                  <div className="flex items-center gap-1 text-orange-600 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    Revisão em {normative.daysToReview} dias
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 space-y-1">
                <p>Publicação: {normative.publishDate}</p>
                <p>Próxima revisão: {normative.reviewDate}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelectNormative(normative)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Visualizar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Baixar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredNormatives.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma norma encontrada com os filtros aplicados</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
