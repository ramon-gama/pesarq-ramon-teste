import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Edit, UserX, Shield, Link, Search, Filter } from "lucide-react";
import { useUserManagement, type UserProfile } from "@/hooks/useUserManagement";
import { useOrganizations } from "@/hooks/useOrganizations";
import { UserFormModal } from "./UserFormModal";
import { ResearcherLinksModal } from "./ResearcherLinksModal";

export function PermissionsManagement() {
  const { users, researcherLinks, loading, updateUser, deactivateUser } = useUserManagement();
  const { organizations } = useOrganizations();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  
  // Filtros
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  console.log('PermissionsManagement - users:', users?.length, 'loading:', loading);
  console.log('PermissionsManagement - organizations:', organizations?.length);

  // Filter organizations to only include those with valid IDs and names
  const validOrganizations = (organizations || []).filter(org => {
    const hasValidId = org.id && typeof org.id === 'string' && org.id.trim() !== "";
    const hasValidName = org.name && typeof org.name === 'string' && org.name.trim() !== "";
    console.log('Organization validation:', org.id, org.name, hasValidId, hasValidName);
    return hasValidId && hasValidName;
  });

  console.log('PermissionsManagement - validOrganizations:', validOrganizations?.length);

  const getRoleLabel = (role: UserProfile['role']) => {
    const labels = {
      unb_admin: 'Admin UnB',
      unb_researcher: 'Pesquisador UnB',
      partner_admin: 'Admin Parceiro',
      partner_user: 'Usuário Parceiro'
    };
    return labels[role];
  };

  const getRoleColor = (role: UserProfile['role']) => {
    const colors = {
      unb_admin: 'bg-purple-100 text-purple-800',
      unb_researcher: 'bg-blue-100 text-blue-800',
      partner_admin: 'bg-green-100 text-green-800',
      partner_user: 'bg-gray-100 text-gray-800'
    };
    return colors[role];
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleManageLinks = (user: UserProfile) => {
    setSelectedUser(user);
    setShowLinksModal(true);
  };

  const handleDeactivateUser = async (user: UserProfile) => {
    if (confirm(`Tem certeza que deseja desativar o usuário ${user.name}?`)) {
      await deactivateUser(user.id);
    }
  };

  const clearFilters = () => {
    setNameFilter("");
    setRoleFilter("");
    setOrganizationFilter("");
    setStatusFilter("");
  };

  // Aplicar filtros - verificar se users existe antes de filtrar
  const filteredUsers = (users || []).filter(user => {
    if (nameFilter && !user.name?.toLowerCase().includes(nameFilter.toLowerCase()) && 
        !user.email?.toLowerCase().includes(nameFilter.toLowerCase())) {
      return false;
    }
    if (roleFilter && user.role !== roleFilter) {
      return false;
    }
    if (organizationFilter) {
      if (organizationFilter === "sem_organizacao") {
        if (user.organization_id !== null) return false;
      } else {
        if (user.organization_id !== organizationFilter) return false;
      }
    }
    if (statusFilter) {
      if (statusFilter === "ativo" && !user.is_active) return false;
      if (statusFilter === "inativo" && user.is_active) return false;
    }
    return true;
  });

  const activeUsers = (users || []).filter(user => user.is_active);
  const inactiveUsers = (users || []).filter(user => !user.is_active);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gerenciamento de Permissões</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie usuários, roles e permissões organizacionais
          </p>
        </div>
        
        <Button onClick={() => setShowUserModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pesquisadores UnB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {activeUsers.filter(u => u.role === 'unb_researcher').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vínculos de Pesquisadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{researcherLinks?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome ou Email</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as roles</SelectItem>
                  <SelectItem value="unb_admin">Admin UnB</SelectItem>
                  <SelectItem value="unb_researcher">Pesquisador UnB</SelectItem>
                  <SelectItem value="partner_admin">Admin Parceiro</SelectItem>
                  <SelectItem value="partner_user">Usuário Parceiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Organização</label>
              <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as organizações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as organizações</SelectItem>
                  <SelectItem value="sem_organizacao">Sem organização</SelectItem>
                  {validOrganizations.map((org) => (
                    <SelectItem key={`org-${org.id}`} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(nameFilter || roleFilter || organizationFilter || statusFilter) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredUsers.length} de {users?.length || 0} usuários
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Lista de todos os usuários cadastrados e suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserX className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">
                {(users?.length || 0) === 0 
                  ? "Nenhum usuário encontrado no sistema." 
                  : "Nenhum usuário encontrado com os filtros aplicados."
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.organizations?.name || (
                        <span className="text-gray-500 italic">Sem organização</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {user.role === 'unb_researcher' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleManageLinks(user)}
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {user.is_active && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeactivateUser(user)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <UserFormModal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        editingUser={editingUser}
        organizations={validOrganizations}
      />

      <ResearcherLinksModal
        isOpen={showLinksModal}
        onClose={() => {
          setShowLinksModal(false);
          setSelectedUser(null);
        }}
        researcher={selectedUser}
        organizations={validOrganizations}
        researcherLinks={researcherLinks || []}
      />
    </div>
  );
}
