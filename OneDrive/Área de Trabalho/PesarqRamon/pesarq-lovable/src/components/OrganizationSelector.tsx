
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Building2, ChevronDown, Check, Settings } from "lucide-react";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { OrganizationSwitchModal } from "./OrganizationSwitchModal";

export function OrganizationSelector() {
  const { 
    currentOrganization, 
    setCurrentOrganization, 
    availableOrganizations, 
    canAccessMultipleOrganizations,
    isAdmin,
    loading 
  } = useOrganizationContext();

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

  // Se está carregando, mostrar skeleton
  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-200 shadow-sm w-[220px] h-[60px]">
        <div className="animate-pulse flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-2 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Se não tem organização atual (estado de erro), mostrar mensagem
  if (!currentOrganization) {
    return (
      <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-200 shadow-sm w-[220px] h-[60px]">
        <Building2 className="h-6 w-6 text-gray-400 mb-1" />
        <span className="text-xs text-gray-500 text-center">Nenhuma organização</span>
      </div>
    );
  }

  // Se não pode acessar múltiplas organizações e não é admin, apenas exibir (não clicável)
  if (!canAccessMultipleOrganizations && !isAdmin) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-3 border border-slate-200 shadow-sm w-[220px] min-h-[60px]">
        <div className="flex items-start gap-3 h-full">
          <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
            {currentOrganization.logo_url && (
              <AvatarImage src={currentOrganization.logo_url} alt={currentOrganization.name} className="object-contain" />
            )}
            <AvatarFallback className={`${getOrgColor(currentOrganization.name)} text-white text-xs font-semibold`}>
              {getOrgInitials(currentOrganization.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 leading-snug break-words line-clamp-3">
              {currentOrganization.name}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se tem apenas uma organização e não é admin, apenas exibir (não clicável)
  if (availableOrganizations.length <= 1 && !isAdmin) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-3 border border-slate-200 shadow-sm w-[220px] min-h-[60px]">
        <div className="flex items-start gap-3 h-full">
          <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
            {currentOrganization.logo_url && (
              <AvatarImage src={currentOrganization.logo_url} alt={currentOrganization.name} className="object-contain" />
            )}
            <AvatarFallback className={`${getOrgColor(currentOrganization.name)} text-white text-xs font-semibold`}>
              {getOrgInitials(currentOrganization.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 leading-snug break-words line-clamp-3">
              {currentOrganization.name}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-[220px] min-h-[60px] px-3 py-3 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm hover:bg-white/90 transition-all duration-200 h-auto"
        >
          <div className="flex items-start justify-between gap-3 w-full h-full">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
                {currentOrganization.logo_url && (
                  <AvatarImage src={currentOrganization.logo_url} alt={currentOrganization.name} className="object-contain" />
                )}
                <AvatarFallback className={`${getOrgColor(currentOrganization.name)} text-white text-xs font-semibold`}>
                  {getOrgInitials(currentOrganization.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-medium text-slate-900 leading-snug break-words line-clamp-3">
                  {currentOrganization.name}
                </div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-600 flex-shrink-0 mt-1" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 bg-white/95 backdrop-blur-sm border-slate-200 shadow-lg">
        <div className="p-3">
          <div className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-2">
            <Building2 className="h-3 w-3" />
            Organizações ({availableOrganizations.length})
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {availableOrganizations.slice(0, 4).map((org, index) => (
              <div key={org.id}>
                <DropdownMenuItem
                  onClick={() => setCurrentOrganization(org)}
                  className="flex items-start p-3 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors duration-200 min-h-[3.5rem]"
                >
                  <div className="flex items-start justify-between gap-3 w-full">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
                        {org.logo_url && (
                          <AvatarImage src={org.logo_url} alt={org.name} className="object-contain" />
                        )}
                        <AvatarFallback className={`${getOrgColor(org.name)} text-white text-xs font-semibold`}>
                          {getOrgInitials(org.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm text-slate-900 leading-snug break-words line-clamp-2 block">
                          {org.name}
                        </span>
                      </div>
                    </div>
                    {currentOrganization.id === org.id && (
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </DropdownMenuItem>
                {index < Math.min(availableOrganizations.length - 1, 3) && (
                  <DropdownMenuSeparator className="my-1" />
                )}
              </div>
            ))}
          </div>
          
          {availableOrganizations.length > 4 && (
            <>
              <DropdownMenuSeparator className="my-3" />
              <OrganizationSwitchModal>
                <Button variant="ghost" className="w-full justify-start text-xs p-3 h-auto rounded-lg">
                  <Settings className="h-4 w-4 mr-2" />
                  Ver todas ({availableOrganizations.length})
                </Button>
              </OrganizationSwitchModal>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
