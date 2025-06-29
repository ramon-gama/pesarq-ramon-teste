
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Trash2, 
  AlertTriangle, 
  Download, 
  CheckCircle,
  Calendar,
  FileText,
  Clock,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const eliminationCandidates = [
  {
    id: "1",
    classificationCode: "020.1",
    documentType: "Memorando",
    title: "Comunicação Interna - Procedimentos Administrativos",
    producingSector: "Administrativo",
    creationDate: "2019-03-15",
    retentionPeriod: "5 anos",
    eliminationDate: "2024-03-15",
    status: "ready",
    volume: "2 caixas",
    location: "Arquivo Central - A.02.01",
    description: "Memorandos internos sobre procedimentos administrativos rotineiros"
  },
  {
    id: "2", 
    classificationCode: "030.2",
    documentType: "Comprovante",
    title: "Comprovantes de Despesas - Exercício 2018",
    producingSector: "Financeiro",
    creationDate: "2018-12-30",
    retentionPeriod: "6 anos",
    eliminationDate: "2024-12-30",
    status: "pending",
    volume: "1 caixa",
    location: "Arquivo Setorial - B.03.02",
    description: "Comprovantes de despesas do exercício fiscal de 2018"
  },
  {
    id: "3",
    classificationCode: "040.1",
    documentType: "Protocolo",
    title: "Protocolos de Entrega - 2019",
    producingSector: "Protocolo",
    creationDate: "2019-01-01",
    retentionPeriod: "5 anos",
    eliminationDate: "2024-01-01",
    status: "ready",
    volume: "3 caixas",
    location: "Depósito - C.01.03",
    description: "Protocolos de entrega e recebimento de documentos"
  }
];

const eliminationHistory = [
  {
    id: "EL-2024-001",
    date: "2024-05-15",
    documentsCount: 2456,
    boxesCount: 12,
    responsibleUser: "Carlos Leite",
    status: "completed",
    totalVolume: "36 metros lineares"
  },
  {
    id: "EL-2024-002", 
    date: "2024-03-20",
    documentsCount: 1789,
    boxesCount: 8,
    responsibleUser: "Maria Silva",
    status: "completed",
    totalVolume: "24 metros lineares"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ready":
      return <Badge className="bg-green-500">Pronto para Eliminação</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">Aguardando Prazo</Badge>;
    case "in_progress":
      return <Badge className="bg-blue-500">Em Processo</Badge>;
    default:
      return <Badge variant="secondary">Indefinido</Badge>;
  }
};

export function EliminationLists() {
  const { toast } = useToast();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const handleSelectDocument = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === eliminationCandidates.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(eliminationCandidates.map(doc => doc.id));
    }
  };

  const handleGenerateEliminationList = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "Seleção Necessária",
        description: "Selecione pelo menos um documento para gerar a lista.",
        variant: "destructive",
      });
      return;
    }

    console.log("Gerando lista de eliminação para:", selectedDocuments);
    toast({
      title: "Lista Gerada",
      description: `Lista de eliminação gerada com ${selectedDocuments.length} documento(s).`,
    });
  };

  const readyForElimination = eliminationCandidates.filter(doc => doc.status === "ready");
  const pendingElimination = eliminationCandidates.filter(doc => doc.status === "pending");

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prontos para Eliminação</CardTitle>
            <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyForElimination.length}</div>
            <p className="text-xs text-green-600">
              Documentos elegíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Prazo</CardTitle>
            <Clock className="h-4 w-4 ml-auto text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingElimination.length}</div>
            <p className="text-xs text-yellow-600">
              Em breve elegíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
            <Trash2 className="h-4 w-4 ml-auto text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-orange-600">
              caixas para eliminação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Eliminação</CardTitle>
            <Calendar className="h-4 w-4 ml-auto text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mai</div>
            <p className="text-xs text-blue-600">
              2024 - 12 caixas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Ações de Eliminação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleGenerateEliminationList} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Gerar Lista de Eliminação
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Edital de Ciência
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Termo de Eliminação
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Relatório de Conformidade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documentos Candidatos à Eliminação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Documentos Candidatos à Eliminação
            </span>
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedDocuments.length === eliminationCandidates.length ? "Desmarcar Todos" : "Selecionar Todos"}
            </Button>
          </CardTitle>
          <CardDescription>
            Documentos que atingiram o prazo de guarda e podem ser eliminados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eliminationCandidates.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={() => handleSelectDocument(doc.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-3">
                    {/* Cabeçalho */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold">{doc.classificationCode}</span>
                        <Badge variant="outline">{doc.documentType}</Badge>
                        {getStatusBadge(doc.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Volume: {doc.volume}
                      </div>
                    </div>

                    {/* Título e Descrição */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{doc.title}</h4>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </div>

                    {/* Detalhes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gray-500">
                      <div>
                        <strong>Setor Produtor:</strong><br />
                        {doc.producingSector}
                      </div>
                      <div>
                        <strong>Data Criação:</strong><br />
                        {new Date(doc.creationDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <strong>Prazo de Guarda:</strong><br />
                        {doc.retentionPeriod}
                      </div>
                      <div>
                        <strong>Data Limite:</strong><br />
                        <span className={doc.status === "ready" ? "text-red-600 font-semibold" : ""}>
                          {new Date(doc.eliminationDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {/* Localização */}
                    <div className="text-xs text-gray-500">
                      <strong>Localização:</strong> {doc.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Eliminações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Eliminações
          </CardTitle>
          <CardDescription>Eliminações realizadas anteriormente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eliminationHistory.map((elimination) => (
              <div key={elimination.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium text-sm">{elimination.id}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(elimination.date).toLocaleDateString('pt-BR')} • 
                    Por {elimination.responsibleUser}
                  </div>
                  <div className="text-xs text-gray-500">
                    {elimination.documentsCount.toLocaleString()} documentos • 
                    {elimination.boxesCount} caixas • 
                    {elimination.totalVolume}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">Concluído</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
