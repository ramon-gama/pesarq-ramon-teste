import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Mail, Building2, Calendar, Eye, Check, X, RefreshCw, Trash2 } from "lucide-react";
import { useAccessRequests, AccessRequest } from "@/hooks/useAccessRequests";
import { useOrganizations } from "@/hooks/useOrganizations";
import { AccessRequestViewModal } from "./AccessRequestViewModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AccessRequestsAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const { accessRequests, loading, loadAccessRequests, approveRequest, rejectRequest } = useAccessRequests();
  const { organizations } = useOrganizations();
  const { toast } = useToast();

  const filteredRequests = accessRequests.filter(request => 
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteUser = async (request: AccessRequest) => {
    if (!confirm(`Tem certeza que deseja excluir definitivamente o usuário ${request.name} (${request.email})?`)) {
      return;
    }

    try {
      console.log('🗑️ Excluindo usuário:', request.email);

      // 1. Buscar e excluir usuário do auth usando admin API
      try {
        const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
        
        if (!listError && usersData?.users) {
          const userToDelete = usersData.users.find((user: any) => user.email === request.email);
          
          if (userToDelete) {
            console.log('👤 Excluindo usuário do auth:', userToDelete.id);
            const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userToDelete.id);
            
            if (deleteAuthError) {
              console.error('❌ Erro ao excluir usuário do auth:', deleteAuthError);
              // Continua mesmo se der erro no auth
            } else {
              console.log('✅ Usuário excluído do auth com sucesso');
            }
          } else {
            console.log('👤 Usuário não encontrado no auth');
          }
        }
      } catch (authError) {
        console.warn('⚠️ Erro ao tentar excluir do auth:', authError);
        // Continua mesmo se der erro no auth
      }

      // 2. Excluir o perfil do usuário se existir
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('email', request.email);

      if (profileError) {
        console.warn('⚠️ Erro ao excluir perfil (pode não existir):', profileError);
      } else {
        console.log('✅ Perfil excluído com sucesso');
      }

      // 3. Excluir a solicitação de acesso
      const { error: requestError } = await supabase
        .from('access_requests')
        .delete()
        .eq('id', request.id);

      if (requestError) {
        console.error('❌ Erro ao excluir solicitação:', requestError);
        throw new Error(`Erro ao excluir solicitação: ${requestError.message}`);
      }

      console.log('✅ Solicitação excluída com sucesso');

      toast({
        title: "Usuário excluído",
        description: `${request.name} foi removido do sistema.`
      });

      await loadAccessRequests();
    } catch (error: any) {
      console.error('💥 Erro ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir usuário.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Aprovada', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejeitada', className: 'bg-red-100 text-red-800' }
    };
    
    const config = configs[status as keyof typeof configs] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const configs = {
      unb_admin: { label: 'Admin UnB', className: 'bg-red-100 text-red-800' },
      unb_researcher: { label: 'Pesquisador UnB', className: 'bg-blue-100 text-blue-800' },
      partner_admin: { label: 'Admin Parceiro', className: 'bg-purple-100 text-purple-800' },
      partner_user: { label: 'Usuário Parceiro', className: 'bg-green-100 text-green-800' }
    };
    
    const config = configs[role as keyof typeof configs] || { label: role, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getOrganizationName = (organizationId: string | null) => {
    if (!organizationId) return '-';
    const org = organizations.find(o => o.id === organizationId);
    return org ? org.name : 'Organização não encontrada';
  };

  const handleView = (request: AccessRequest) => {
    setSelectedRequest(request);
    setViewModalOpen(true);
  };

  const handleApprove = async (request: AccessRequest) => {
    if (confirm(`Tem certeza que deseja aprovar a solicitação de ${request.name}?`)) {
      await approveRequest(request.id);
    }
  };

  const handleReject = async (request: AccessRequest) => {
    if (confirm(`Tem certeza que deseja rejeitar a solicitação de ${request.name}?`)) {
      await rejectRequest(request.id);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Carregando solicitações...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Solicitações de Acesso</CardTitle>
              <CardDescription>
                Gerencie solicitações de acesso ao sistema
              </CardDescription>
            </div>
            <Button 
              onClick={loadAccessRequests}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo Solicitado</TableHead>
                  <TableHead>Organização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[50px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhuma solicitação encontrada" : "Nenhuma solicitação pendente"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {request.email}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(request.requested_role)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {getOrganizationName(request.organization_id)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(request.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleView(request)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            {request.status === 'pending' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleApprove(request)}
                                  className="text-green-600"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Aprovar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleReject(request)}
                                  className="text-red-600"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Rejeitar
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteUser(request)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir Usuário
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AccessRequestViewModal
        request={selectedRequest}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
}
