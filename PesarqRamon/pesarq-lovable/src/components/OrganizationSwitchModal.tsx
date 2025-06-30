
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Check, Loader2, Edit, Settings } from "lucide-react";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { Badge } from "@/components/ui/badge";

interface OrganizationSwitchModalProps {
  children: React.ReactNode;
}

export function OrganizationSwitchModal({ children }: OrganizationSwitchModalProps) {
  const { 
    currentOrganization, 
    setCurrentOrganization, 
    availableOrganizations,
    loading,
    isAdmin,
    canAccessMultipleOrganizations
  } = useOrganizationContext();

  console.log('🏢 OrganizationSwitchModal - Estado:', {
    loading,
    currentOrganization: currentOrganization?.name,
    availableOrganizations: availableOrganizations?.length,
    organizations: availableOrganizations?.map(org => ({ name: org.name, status: org.status })),
    isAdmin,
    canAccessMultiple: canAccessMultipleOrganizations
  });

  // Se ainda está carregando, não mostrar o modal
  if (loading) {
    return <>{children}</>;
  }

  // Se o usuário não pode acessar múltiplas organizações E não é admin, não mostrar o modal
  if (!canAccessMultipleOrganizations && !isAdmin) {
    console.log('🚫 Usuário tem acesso a apenas uma organização e não é admin - modal não será exibido');
    return <>{children}</>;
  }

  // Se tem apenas uma organização disponível e não é admin, não mostrar o modal
  if (availableOrganizations.length <= 1 && !isAdmin) {
    console.log('🚫 Apenas uma organização disponível e usuário não é admin - modal não será exibido');
    return <>{children}</>;
  }

  const getOrgInitials = (name: string) => {
    return name
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativa":
        return <Badge className="bg-green-100 text-green-800 text-xs">Ativa</Badge>;
      case "inativa":
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Inativa</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pendente</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">-</Badge>;
    }
  };

  const handleOrganizationSelect = (org: any) => {
    console.log('🎯 Selecionando organização:', org.name);
    setCurrentOrganization?.(org);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium">
            <Building2 className="h-5 w-5" />
            {isAdmin ? 'Todas as Organizações' : 'Selecionar Organização'}
            {isAdmin && (
              <Badge variant="outline" className="ml-2 text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </DialogTitle>
          {isAdmin && (
            <p className="text-sm text-gray-600">
              Como administrador, você pode visualizar e acessar todas as organizações
            </p>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {availableOrganizations && availableOrganizations.length > 0 ? (
              availableOrganizations.map((org) => (
                <div
                  key={org.id}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    currentOrganization?.id === org.id 
                      ? 'bg-primary/5 border-primary/20 shadow-sm' 
                      : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleOrganizationSelect(org)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      {org.logo_url && (
                        <AvatarImage src={org.logo_url} alt={org.name} className="object-contain" />
                      )}
                      <AvatarFallback className={`${getOrgColor(org.name)} text-white text-sm font-medium`}>
                        {getOrgInitials(org.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium text-sm text-gray-900 leading-snug break-words whitespace-normal">
                          {org.name}
                        </div>
                        {getStatusBadge(org.status)}
                      </div>
                      {org.acronym && (
                        <div className="text-xs text-gray-500">
                          {org.acronym}
                        </div>
                      )}
                      {isAdmin && (
                        <div className="text-xs text-gray-400 mt-1">
                          Tipo: {org.type} • ID: {org.id.slice(0, 8)}...
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isAdmin && (
                        <Edit className="h-3 w-3 text-gray-400" />
                      )}
                      {currentOrganization?.id === org.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Nenhuma organização disponível</p>
                <p className="text-sm text-gray-500">
                  {isAdmin 
                    ? "Nenhuma organização foi cadastrada no sistema ainda." 
                    : "Organizações ativas serão exibidas aqui quando disponíveis."
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {isAdmin && availableOrganizations.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <p className="text-xs text-gray-500 text-center">
              Total: {availableOrganizations.length} organizações • 
              Ativas: {availableOrganizations.filter(org => org.status === 'ativa').length} • 
              Inativas: {availableOrganizations.filter(org => org.status === 'inativa').length}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
