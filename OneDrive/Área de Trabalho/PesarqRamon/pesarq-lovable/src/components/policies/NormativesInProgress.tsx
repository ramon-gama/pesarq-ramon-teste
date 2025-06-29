
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, User, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

const mockInProgress = [
  {
    id: 1,
    title: "Protocolo de Digitalização de Acervos",
    status: "validacao",
    progress: 75,
    responsible: "Carlos Silva",
    phase: "Validação Técnica",
    deadline: "30/12/2024",
    daysLeft: 15,
    comments: 3,
    description: "Novo protocolo para padronizar processos de digitalização"
  },
  {
    id: 2,
    title: "Manual de Classificação Documental",
    status: "elaboracao",
    progress: 45,
    responsible: "Ana Santos",
    phase: "Elaboração",
    deadline: "15/01/2025",
    daysLeft: 30,
    comments: 7,
    description: "Atualização do manual de classificação conforme novas diretrizes"
  },
  {
    id: 3,
    title: "Política de Preservação Digital",
    status: "consulta",
    progress: 60,
    responsible: "Roberto Lima",
    phase: "Consulta Pública",
    deadline: "20/01/2025",
    daysLeft: 35,
    comments: 12,
    description: "Nova política para preservação de documentos digitais"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "elaboracao": return "bg-blue-100 text-blue-800";
    case "validacao": return "bg-yellow-100 text-yellow-800";
    case "consulta": return "bg-purple-100 text-purple-800";
    case "aprovacao": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "elaboracao": return "Em Elaboração";
    case "validacao": return "Validação Técnica";
    case "consulta": return "Consulta Pública";
    case "aprovacao": return "Aguardando Aprovação";
    default: return status;
  }
};

export function NormativesInProgress() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Normas em Elaboração e Revisão</h3>
          <p className="text-sm text-gray-600">Acompanhe o progresso dos documentos em desenvolvimento</p>
        </div>
        <Button>
          <Clock className="h-4 w-4 mr-2" />
          Relatório de Progresso
        </Button>
      </div>

      <div className="grid gap-4">
        {mockInProgress.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  <CardDescription className="mb-3">{item.description}</CardDescription>
                  
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Progresso</span>
                      <span className="text-sm text-gray-600">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>

                  {/* Informações do status */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{item.responsible}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Prazo: {item.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{item.comments} comentários</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                  
                  {/* Indicador de prazo */}
                  <div className={`flex items-center gap-1 text-xs ${
                    item.daysLeft <= 7 ? 'text-red-600' : 
                    item.daysLeft <= 15 ? 'text-orange-600' : 
                    'text-green-600'
                  }`}>
                    {item.daysLeft <= 7 ? (
                      <AlertCircle className="h-3 w-3" />
                    ) : (
                      <CheckCircle className="h-3 w-3" />
                    )}
                    {item.daysLeft} dias restantes
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">Fase atual:</span> {item.phase}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Comentários
                  </Button>
                  <Button size="sm">
                    Continuar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockInProgress.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma norma em elaboração no momento</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
