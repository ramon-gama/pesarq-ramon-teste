import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calendar, 
  User, 
  GitBranch, 
  Download, 
  Edit, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  ExternalLink
} from "lucide-react";

interface NormativeDetailsProps {
  normative: any;
}

const mockVersions = [
  {
    version: "2.1",
    date: "15/03/2024",
    author: "João Silva",
    changes: "Atualização conforme nova legislação",
    status: "vigente"
  },
  {
    version: "2.0",
    date: "10/01/2024", 
    author: "Maria Santos",
    changes: "Revisão geral do documento",
    status: "revogada"
  },
  {
    version: "1.0",
    date: "05/06/2023",
    author: "Carlos Lima",
    changes: "Versão inicial",
    status: "revogada"
  }
];

const mockRelatedNorms = [
  {
    id: 2,
    title: "Plano de Classificação Documental",
    type: "Instrução Normativa",
    relationship: "Complementa"
  },
  {
    id: 3,
    title: "Tabela de Temporalidade",
    type: "Manual",
    relationship: "Referencia"
  }
];

const mockComments = [
  {
    id: 1,
    author: "Ana Costa",
    date: "20/03/2024",
    comment: "Sugiro revisar o item 3.2 para maior clareza",
    status: "pendente"
  },
  {
    id: 2,
    author: "Pedro Oliveira",
    date: "18/03/2024",
    comment: "Aprovado conforme análise técnica",
    status: "resolvido"
  }
];

export function NormativeDetails({ normative }: NormativeDetailsProps) {
  if (!normative) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Selecione uma norma para ver os detalhes</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vigente": return "bg-green-100 text-green-800";
      case "revogada": return "bg-red-100 text-red-800";
      case "elaboracao": return "bg-blue-100 text-blue-800";
      case "revisao": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da norma */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{normative.title}</CardTitle>
              <CardDescription className="text-base mb-4">{normative.description}</CardDescription>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Órgão:</span>
                  <p>{normative.organ}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Tipo:</span>
                  <p>{normative.type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Escopo:</span>
                  <p>{normative.scope}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Versão:</span>
                  <p>{normative.version}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <Badge className={getStatusColor(normative.status)}>
                {normative.status}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Baixar PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs com detalhes */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="versions">Versões</TabsTrigger>
          <TabsTrigger value="related">Relacionamentos</TabsTrigger>
          <TabsTrigger value="comments">Comentários</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informações de Datas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium text-gray-500">Data de Publicação:</span>
                  <p>{normative.publishDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Próxima Revisão:</span>
                  <p>{normative.reviewDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Dias para Revisão:</span>
                  <p className={`font-medium ${
                    normative.daysToReview <= 365 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {normative.daysToReview} dias
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Responsabilidades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium text-gray-500">Órgão Responsável:</span>
                  <p>{normative.organ}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Última Atualização:</span>
                  <p>João Silva - 15/03/2024</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Status Atual:</span>
                  <Badge className={getStatusColor(normative.status)}>
                    {normative.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas */}
          {normative.daysToReview <= 365 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    Esta norma está próxima da data de revisão ({normative.daysToReview} dias)
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Histórico de Versões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVersions.map((version, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Versão {version.version}</span>
                        <Badge className={getStatusColor(version.status)}>
                          {version.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{version.changes}</p>
                      <p className="text-xs text-gray-500">
                        {version.author} • {version.date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Normas Relacionadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRelatedNorms.map((norm) => (
                  <div key={norm.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{norm.title}</p>
                      <p className="text-sm text-gray-600">
                        {norm.type} • {norm.relationship}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comentários e Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{comment.author}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={comment.status === 'resolvido' ? 'default' : 'secondary'}>
                          {comment.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
