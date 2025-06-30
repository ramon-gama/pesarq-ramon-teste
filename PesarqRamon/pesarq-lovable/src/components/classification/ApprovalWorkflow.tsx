
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, AlertCircle, MessageSquare, Send } from "lucide-react";

interface ApprovalWorkflowProps {
  currentVersion: any;
}

export function ApprovalWorkflow({ currentVersion }: ApprovalWorkflowProps) {
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [comments, setComments] = useState("");

  const approvalSteps = [
    {
      id: "business",
      name: "Área de Negócio",
      description: "Validação técnica e conceitual",
      status: "completed",
      completedAt: "2024-03-10",
      approver: "João Silva"
    },
    {
      id: "commission",
      name: "Comissão Permanente de Avaliação", 
      description: "Análise da comissão permanente",
      status: "pending",
      completedAt: null,
      approver: null
    },
    {
      id: "national",
      name: "Arquivo Nacional",
      description: "Aprovação final do órgão central",
      status: "waiting",
      completedAt: null,
      approver: null
    }
  ];

  const pendingUnits = [
    {
      id: "1",
      code: "012",
      title: "Modernização administrativa",
      type: "atividade",
      status: "pending_business",
      submittedAt: "2024-03-15",
      changes: ["Novo título", "Descrição atualizada"]
    },
    {
      id: "2", 
      code: "013",
      title: "Gestão de processos",
      type: "atividade",
      status: "pending_commission",
      submittedAt: "2024-03-12",
      changes: ["Nova unidade"]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-600" />;
      case "waiting":
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      completed: { label: "Concluído", variant: "default" as const, className: "bg-green-100 text-green-800" },
      pending: { label: "Pendente", variant: "secondary" as const, className: "bg-amber-100 text-amber-800" },
      waiting: { label: "Aguardando", variant: "outline" as const, className: "bg-gray-100 text-gray-600" }
    };
    return configs[status as keyof typeof configs] || configs.waiting;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Aprovação</CardTitle>
          <p className="text-sm text-gray-600">
            Acompanhe o progresso das aprovações do código de classificação
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {approvalSteps.map((step, index) => {
              const statusConfig = getStatusBadge(step.status);
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    {getStatusIcon(step.status)}
                    {index < approvalSteps.length - 1 && (
                      <div className="w-px h-12 bg-gray-200 mt-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{step.name}</h3>
                      <Badge variant={statusConfig.variant} className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    
                    {step.completedAt && (
                      <div className="text-xs text-green-600">
                        Aprovado em {new Date(step.completedAt).toLocaleDateString()} por {step.approver}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unidades Pendentes de Aprovação</CardTitle>
          <p className="text-sm text-gray-600">
            {pendingUnits.length} unidades aguardando aprovação
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingUnits.map(unit => (
              <div key={unit.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedUnits.includes(unit.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUnits([...selectedUnits, unit.id]);
                        } else {
                          setSelectedUnits(selectedUnits.filter(id => id !== unit.id));
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">{unit.code}</span>
                        <Badge variant="outline">{unit.type}</Badge>
                      </div>
                      <h4 className="font-medium mt-1">{unit.title}</h4>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">
                      Enviado em {new Date(unit.submittedAt).toLocaleDateString()}
                    </div>
                    <Badge variant="secondary">
                      {unit.status === 'pending_business' ? 'Área de Negócio' : 'Comissão'}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <strong>Alterações:</strong> {unit.changes.join(", ")}
                </div>
              </div>
            ))}

            {selectedUnits.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comentários da Aprovação
                  </label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Adicione comentários sobre a aprovação..."
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4" />
                    Aprovar Selecionadas ({selectedUnits.length})
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    Rejeitar
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Solicitar Revisão
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
