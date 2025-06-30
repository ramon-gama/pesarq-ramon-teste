
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, FileText, Edit, Trash2, Eye, ExternalLink } from "lucide-react";
import { ProposalForm } from "./ProposalForm";
import { ProposalDetailsModal } from "./ProposalDetailsModal";
import { type Proposal } from "@/hooks/useProposals";
import { useToast } from "@/hooks/use-toast";

interface ProposalsListProps {
  organizations: Array<{ id: string; name: string }>;
  proposalsHook: ReturnType<typeof import("@/hooks/useProposals").useProposals>; // Recebe o hook inteiro
}

export function ProposalsList({ organizations, proposalsHook }: ProposalsListProps) {
  const { proposals, loading, createProposal, updateProposal, deleteProposal } = proposalsHook;
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

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

  const handleCreateProposal = async (data: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating proposal with data:', data);
      const result = await createProposal(data);
      if (result) {
        setShowCreateModal(false);
        toast({
          title: "Sucesso",
          description: "Proposta criada com sucesso",
        });
      }
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar proposta",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowDetailsModal(true);
  };

  const handleEditProposal = (proposal: Proposal) => {
    console.log('Editing proposal:', proposal);
    setSelectedProposal(proposal);
    setShowEditModal(true);
  };

  const handleUpdateProposal = async (data: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedProposal) {
      try {
        console.log('Updating proposal with data:', data);
        const result = await updateProposal(selectedProposal.id, data);
        if (result) {
          setShowEditModal(false);
          setSelectedProposal(null);
          toast({
            title: "Sucesso",
            description: "Proposta atualizada com sucesso",
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar proposta:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar proposta",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteProposal = async (proposal: Proposal) => {
    try {
      await deleteProposal(proposal.id);
      toast({
        title: "Sucesso",
        description: "Proposta excluída com sucesso",
      });
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir proposta",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando propostas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho da seção com botão de nova proposta */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold">Propostas de Projetos</h3>
          <p className="text-sm text-gray-600">
            Visualize e gerencie as propostas de projetos das organizações parceiras
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-[#15AB92] hover:bg-[#0d8f7a] h-9"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Proposta
        </Button>
      </div>

      {/* Lista de Propostas */}
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-[#15AB92] flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900 truncate">{proposal.title}</h4>
                    {getStatusBadge(proposal.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Organização:</span> {getOrganizationName(proposal.organization_id)}
                    </div>
                    <div>
                      <span className="font-medium">Tipo de Projeto:</span> {getProjectTypeLabel((proposal as any).tipo_projeto)}
                    </div>
                    <div>
                      <span className="font-medium">Tipo de Instrumento:</span> {getInstrumentTypeLabel((proposal as any).tipo_instrumento)}
                    </div>
                    <div>
                      <span className="font-medium">Valor Estimado:</span> {proposal.estimated_value ? `R$ ${proposal.estimated_value.toLocaleString('pt-BR')}` : 'Não informado'}
                    </div>
                    <div>
                      <span className="font-medium">Duração:</span> {proposal.estimated_duration_months ? `${proposal.estimated_duration_months} meses` : 'Não informado'}
                    </div>
                    <div>
                      <span className="font-medium">Data de Submissão:</span> {proposal.submission_date ? new Date(proposal.submission_date).toLocaleDateString('pt-BR') : 'N/A'}
                    </div>
                  </div>

                  {proposal.description && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Descrição:</span> {proposal.description.length > 150 ? `${proposal.description.substring(0, 150)}...` : proposal.description}
                    </div>
                  )}

                  {proposal.observations && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Observações:</span> {proposal.observations.length > 100 ? `${proposal.observations.substring(0, 100)}...` : proposal.observations}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewDetails(proposal)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditProposal(proposal)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir a proposta "{proposal.title}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteProposal(proposal)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {proposals.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma proposta cadastrada</h3>
            <p className="text-gray-600 mb-4">
              Comece cadastrando uma nova proposta de projeto
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Proposta
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modais */}
      <ProposalForm 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateProposal}
        organizations={organizations}
        mode="create"
      />

      <ProposalForm 
        open={showEditModal} 
        onOpenChange={setShowEditModal}
        onSubmit={handleUpdateProposal}
        organizations={organizations}
        initialData={selectedProposal}
        mode="edit"
      />

      <ProposalDetailsModal
        proposal={selectedProposal}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        organizations={organizations}
      />
    </div>
  );
}
