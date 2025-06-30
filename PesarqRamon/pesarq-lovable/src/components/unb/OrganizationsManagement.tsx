
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Building2, FileText, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrganizationForm } from "./organizations/OrganizationForm";
import { ProposalsList } from "./organizations/ProposalsList";
import { useOrganizations, type Organization } from "@/hooks/useOrganizations";
import { useProposals } from "@/hooks/useProposals";

export function OrganizationsManagement() {
  const { organizations, loading, createOrganization, updateOrganization, deleteOrganization } = useOrganizations();
  const proposalsHook = useProposals(); // Passamos o hook inteiro para ProposalsList
  const { proposals, loading: proposalsLoading, lastUpdate } = proposalsHook;
  const [activeTab, setActiveTab] = useState("organizations");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  // Calcular estatísticas usando useMemo com lastUpdate como dependência
  const stats = useMemo(() => {
    console.log('Recalculating stats with proposals count:', proposals.length, 'lastUpdate:', lastUpdate);
    console.log('Current proposals status breakdown:', proposals.map(p => ({ id: p.id, title: p.title, status: p.status })));
    
    const pendentes = proposals.filter(p => p.status === 'pendente');
    const emAnalise = proposals.filter(p => p.status === 'em_analise'); 
    const aprovadas = proposals.filter(p => p.status === 'aprovada');
    const rejeitadas = proposals.filter(p => p.status === 'rejeitada');
    
    const statsData = {
      totalOrganizations: organizations.length,
      proposalsPendentes: pendentes.length,
      proposalsEmAnalise: emAnalise.length,
      proposalsAprovadas: aprovadas.length,
      proposalsRejeitadas: rejeitadas.length,
    };
    
    console.log('Calculated stats by category:');
    console.log('- Pendentes:', pendentes.map(p => p.title));
    console.log('- Em Análise:', emAnalise.map(p => p.title));
    console.log('- Aprovadas:', aprovadas.map(p => p.title));
    console.log('- Rejeitadas:', rejeitadas.map(p => p.title));
    console.log('Final stats:', statsData);
    
    return statsData;
  }, [proposals, organizations, lastUpdate]); // Usa lastUpdate como dependência principal

  // Log das estatísticas para debug sempre que mudarem
  useEffect(() => {
    console.log('Stats effect triggered - Stats:', stats);
    console.log('Proposals changed, new count:', proposals.length);
    console.log('LastUpdate changed:', lastUpdate);
  }, [stats, proposals.length, lastUpdate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativa":
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case "inativa":
        return <Badge className="bg-gray-100 text-gray-800">Inativa</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  // Função para gerar iniciais da organização
  const getOrgInitials = (name: string) => {
    return name
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Função para gerar cor baseada no nome
  const getOrgColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-indigo-500',
      'bg-red-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getOrganizationTypeLabel = (type: string) => {
    const typeMap = {
      'federal': 'Órgão Federal',
      'state': 'Órgão Estadual',
      'municipal': 'Órgão Municipal',
      'autarquia': 'Autarquia',
      'fundacao': 'Fundação Pública',
      'empresa': 'Empresa Pública',
      'sociedade': 'Sociedade de Economia Mista',
      'ong': 'ONG/OSCIP',
      'privada': 'Empresa Privada'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const handleCreateOrganization = async (data: any) => {
    const result = await createOrganization(data);
    if (result) {
      setShowCreateModal(false);
    }
  };

  const handleEditOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setShowEditModal(true);
  };

  const handleUpdateOrganization = async (data: any) => {
    if (selectedOrganization) {
      const result = await updateOrganization(selectedOrganization.id, data);
      if (result) {
        setShowEditModal(false);
        setSelectedOrganization(null);
      }
    }
  };

  const handleViewDetails = (org: Organization) => {
    console.log('Opening details for organization with logo_url:', org.logo_url);
    setSelectedOrganization(org);
    setShowDetailsModal(true);
  };

  const handleDeleteOrganization = async (org: Organization) => {
    await deleteOrganization(org.id);
  };

  if (loading || proposalsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando organizações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            Organizações Parceiras
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base leading-relaxed">
            Gerencie organizações parceiras e suas propostas de projetos
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas Funcionais - Com key baseada em lastUpdate */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" key={`stats-${lastUpdate}`}>
        <Card 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab("organizations")}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Organizações</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrganizations}</p>
                <p className="text-xs text-gray-500 mt-1">Clique para visualizar</p>
              </div>
              <Building2 className="h-8 w-8 text-[#15AB92] flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab("proposals")}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.proposalsPendentes}</p>
                <p className="text-xs text-gray-500 mt-1">Aguardando análise</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab("proposals")}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Em Análise</p>
                <p className="text-2xl font-bold text-blue-600">{stats.proposalsEmAnalise}</p>
                <p className="text-xs text-gray-500 mt-1">Sendo avaliadas</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab("proposals")}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Aprovadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.proposalsAprovadas}</p>
                <p className="text-xs text-gray-500 mt-1">Prontas para execução</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab("proposals")}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Rejeitadas</p>
                <p className="text-2xl font-bold text-red-600">{stats.proposalsRejeitadas}</p>
                <p className="text-xs text-gray-500 mt-1">Não aprovadas</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-full sm:w-auto min-w-full sm:min-w-0">
              <TabsTrigger value="organizations" className="text-xs sm:text-sm px-2 sm:px-3">
                Organizações Cadastradas
              </TabsTrigger>
              <TabsTrigger value="proposals" className="text-xs sm:text-sm px-2 sm:px-3">
                Propostas de Projetos
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="organizations" className="space-y-4">
          {/* Texto explicativo para organizações com botão na mesma linha */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold">Organizações Cadastradas</h3>
              <p className="text-sm text-gray-600">
                Visualize e gerencie as organizações parceiras cadastradas no sistema
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#15AB92] hover:bg-[#0d8f7a] h-9"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Organização
            </Button>
          </div>

          {/* Lista de Organizações */}
          <div className="space-y-4">
            {organizations.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5 text-[#15AB92] flex-shrink-0" />
                        <h4 className="font-semibold text-gray-900 truncate">{org.name}</h4>
                        {getStatusBadge(org.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Tipo:</span> {getOrganizationTypeLabel(org.type)}
                        </div>
                        <div>
                          <span className="font-medium">CNPJ:</span> {org.cnpj || 'Não informado'}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {org.contact_email || 'Não informado'}
                        </div>
                        <div>
                          <span className="font-medium">Telefone:</span> {org.contact_phone || 'Não informado'}
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <span className="font-medium">Criada em:</span> {org.created_at ? new Date(org.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDetails(org)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditOrganization(org)}
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
                              Tem certeza que deseja excluir a organização "{org.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteOrganization(org)}
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

          {organizations.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma organização cadastrada</h3>
                <p className="text-gray-600 mb-4">
                  Comece cadastrando uma nova organização parceira
                </p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#15AB92] hover:bg-[#0d8f7a]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Organização
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4">
          <ProposalsList organizations={organizations} proposalsHook={proposalsHook} />
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <OrganizationForm 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
        onSave={handleCreateOrganization}
      />

      <OrganizationForm 
        open={showEditModal} 
        onOpenChange={setShowEditModal}
        onSave={handleUpdateOrganization}
        initialData={selectedOrganization}
        isEdit={true}
      />

      {/* Modal de Detalhes Melhorado */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#15AB92]" />
              Detalhes da Organização
            </DialogTitle>
            <DialogDescription>
              Informações completas da organização cadastrada
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrganization && (
            <div className="space-y-6">
              {/* Cabeçalho com Logo e Informações Principais */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                    {selectedOrganization.logo_url ? (
                      <AvatarImage 
                        src={selectedOrganization.logo_url} 
                        alt={selectedOrganization.name} 
                        className="object-contain"
                      />
                    ) : (
                      <AvatarFallback className={`${getOrgColor(selectedOrganization.name)} text-white text-lg font-semibold`}>
                        {getOrgInitials(selectedOrganization.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-slate-800 break-words">{selectedOrganization.name}</h3>
                      {getStatusBadge(selectedOrganization.status)}
                    </div>
                    <p className="text-lg text-slate-600 mb-1">
                      {getOrganizationTypeLabel(selectedOrganization.type)}
                    </p>
                    <p className="text-sm text-slate-500">
                      Cadastrada em {selectedOrganization.created_at ? new Date(selectedOrganization.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações Detalhadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dados Institucionais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#15AB92]" />
                      Dados Institucionais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Nome Completo:</span>
                      <p className="text-gray-900 break-words">{selectedOrganization.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Tipo de Organização:</span>
                      <p className="text-gray-900">{getOrganizationTypeLabel(selectedOrganization.type)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">CNPJ:</span>
                      <p className="text-gray-900">{selectedOrganization.cnpj || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Status:</span>
                      <div className="mt-1">
                        {getStatusBadge(selectedOrganization.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações de Contato */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#15AB92]" />
                      Informações de Contato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">E-mail:</span>
                      <p className="text-gray-900 break-words">{selectedOrganization.contact_email || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Telefone:</span>
                      <p className="text-gray-900">{selectedOrganization.contact_phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Endereço:</span>
                      <p className="text-gray-900">{selectedOrganization.address || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Cidade/Estado:</span>
                      <p className="text-gray-900">
                        {[selectedOrganization.city, selectedOrganization.state].filter(Boolean).join(', ') || 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">CEP:</span>
                      <p className="text-gray-900">{selectedOrganization.cep || 'Não informado'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Informações Adicionais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Data de Cadastro:</span>
                      <p className="text-gray-900">
                        {selectedOrganization.created_at ? new Date(selectedOrganization.created_at).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Última Atualização:</span>
                      <p className="text-gray-900">
                        {selectedOrganization.updated_at ? new Date(selectedOrganization.updated_at).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">ID do Sistema:</span>
                      <p className="text-gray-900 font-mono text-xs break-all">{selectedOrganization.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botões de Ação */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleEditOrganization(selectedOrganization)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Organização
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
