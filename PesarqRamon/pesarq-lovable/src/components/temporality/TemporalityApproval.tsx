
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, Users, FileCheck, AlertTriangle } from "lucide-react";

interface TemporalityApprovalProps {
  currentVersion: any;
  onUpdateVersion: (version: any) => void;
}

export function TemporalityApproval({ currentVersion, onUpdateVersion }: TemporalityApprovalProps) {
  const [approvalComments, setApprovalComments] = useState("");
  
  const approvalSteps = [
    {
      id: 1,
      name: "Área de Negócio",
      status: "aprovado",
      approver: "Maria Silva",
      date: "2024-01-10",
      comments: "Documentação revisada e aprovada. Prazos adequados às necessidades operacionais."
    },
    {
      id: 2,
      name: "Comissão Permanente de Avaliação",
      status: "aprovado", 
      approver: "João Santos",
      date: "2024-01-12",
      comments: "Análise técnica concluída. Prazos estão em conformidade com as diretrizes."
    },
    {
      id: 3,
      name: "Arquivo Nacional",
      status: "pendente",
      approver: "",
      date: "",
      comments: ""
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovado":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejeitado":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pendente":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      aprovado: "bg-green-100 text-green-800",
      rejeitado: "bg-red-100 text-red-800",
      pendente: "bg-yellow-100 text-yellow-800",
      "nao_iniciado": "bg-gray-100 text-gray-800"
    };
    
    const labels = {
      aprovado: "Aprovado",
      rejeitado: "Rejeitado",
      pendente: "Pendente",
      "nao_iniciado": "Não Iniciado"
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleApprove = () => {
    console.log("Aprovando versão...");
  };

  const handleReject = () => {
    console.log("Rejeitando versão...");
  };

  const pendingSteps = approvalSteps.filter(step => step.status === "pendente").length;
  const approvedSteps = approvalSteps.filter(step => step.status === "aprovado").length;

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Status da Aprovação - Versão {currentVersion.version}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{approvedSteps}</div>
              <p className="text-sm text-gray-600">Etapas Aprovadas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{pendingSteps}</div>
              <p className="text-sm text-gray-600">Etapas Pendentes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round((approvedSteps / approvalSteps.length) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Progresso</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(approvedSteps / approvalSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fluxo de Aprovação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Fluxo de Aprovação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {approvalSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {index < approvalSteps.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                )}
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{step.name}</h3>
                      {getStatusBadge(step.status)}
                    </div>
                    
                    {step.status !== "pendente" && step.status !== "nao_iniciado" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Aprovador: {step.approver}</span>
                          <span>Data: {step.date}</span>
                        </div>
                        {step.comments && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">{step.comments}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {step.status === "pendente" && (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800 mb-3">
                          Aguardando aprovação desta etapa.
                        </p>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Adicione comentários sobre a aprovação..."
                            value={approvalComments}
                            onChange={(e) => setApprovalComments(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleApprove}
                              className="flex items-center gap-2"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Aprovar
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={handleReject}
                              className="flex items-center gap-2"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4" />
                              Rejeitar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Observações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Diretrizes para Aprovação</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Verificar conformidade com a legislação vigente</li>
                <li>• Validar prazos propostos com as necessidades operacionais</li>
                <li>• Confirmar adequação das destinações finais</li>
                <li>• Revisar fundamentação legal de cada item</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-2">Prazo para Aprovação</h4>
              <p className="text-sm text-amber-700">
                Cada etapa do fluxo de aprovação tem prazo máximo de 15 dias úteis. 
                Após este período, a aprovação será considerada tácita.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
