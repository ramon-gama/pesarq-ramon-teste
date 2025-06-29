import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ExternalLink, Calendar, DollarSign, Clock, Building2, Tag, Target } from "lucide-react";
import { type Proposal } from "@/hooks/useProposals";

interface ProposalDetailsModalProps {
  proposal: Proposal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: Array<{ id: string; name: string }>;
}

export function ProposalDetailsModal({ proposal, open, onOpenChange, organizations }: ProposalDetailsModalProps) {
  if (!proposal) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "em_analise":
        return <Badge className="bg-blue-100 text-blue-800">Em Análise</Badge>;
      case "aprovada":
        return <Badge className="bg-green-100 text-green-800">Aprovada</Badge>;
      case "rejeitada":
        return <Badge className="bg-red-100 text-red-800">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getInstrumentTypeLabel = (type?: string) => {
    if (!type) return 'Não informado';
    switch (type) {
      case 'TED':
        return 'TED - Termo de Execução Descentralizada';
      case 'Convenio':
        return 'Convênio';
      case 'Contrato':
        return 'Contrato';
      case 'Plano':
        return 'Plano de Trabalho';
      case 'Acordo':
        return 'Acordo';
      case 'Outros':
        return 'Outros';
      default:
        return type;
    }
  };

  const getProjectTypeLabel = (type?: string) => {
    if (!type) return 'Não informado';
    return type;
  };

  const getOrganizationName = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    return org ? org.name : 'Organização não encontrada';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#15AB92]" />
            Detalhes da Proposta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cabeçalho da proposta */}
          <div className="border-b pb-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-xl font-bold text-gray-900">{proposal.title}</h2>
              {getStatusBadge(proposal.status)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>{getOrganizationName(proposal.organization_id)}</span>
            </div>
          </div>

          {/* Link externo - sempre mostrar esta seção */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-[#15AB92]" />
                Documento Externo
              </h3>
              {proposal.external_link ? (
                <a 
                  href={proposal.external_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visualizar documento
                </a>
              ) : (
                <p className="text-gray-500">Nenhum documento externo vinculado</p>
              )}
            </CardContent>
          </Card>

          {/* Informações principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna esquerda */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#15AB92]" />
                    Classificação
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Tipo de Projeto:</span>
                      <p className="text-gray-900">{getProjectTypeLabel(proposal.tipo_projeto)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Tipo de Instrumento:</span>
                      <p className="text-gray-900">{getInstrumentTypeLabel(proposal.tipo_instrumento)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#15AB92]" />
                    Informações Financeiras e Temporais
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Valor Estimado:</span>
                      <p className="text-gray-900">
                        {proposal.estimated_value ? `R$ ${proposal.estimated_value.toLocaleString('pt-BR')}` : 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Duração Estimada:</span>
                      <p className="text-gray-900">
                        {proposal.estimated_duration_months ? `${proposal.estimated_duration_months} meses` : 'Não informado'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna direita */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#15AB92]" />
                    Datas Importantes
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Data de Submissão:</span>
                      <p className="text-gray-900">
                        {proposal.submission_date ? new Date(proposal.submission_date).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Criada em:</span>
                      <p className="text-gray-900">
                        {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Última atualização:</span>
                      <p className="text-gray-900">
                        {proposal.updated_at ? new Date(proposal.updated_at).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#15AB92]" />
                    Status da Proposta
                  </h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(proposal.status)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Descrição */}
          {proposal.description && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Descrição do Projeto</h3>
                <p className="text-gray-700 leading-relaxed">{proposal.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {proposal.observations && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Observações</h3>
                <p className="text-gray-700 leading-relaxed">{proposal.observations}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
