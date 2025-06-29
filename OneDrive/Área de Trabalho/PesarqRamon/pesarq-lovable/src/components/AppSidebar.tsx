import { useState, useEffect } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  Archive, 
  CheckSquare, 
  Cog, 
  FileText, 
  AlertTriangle, 
  Users, 
  Package, 
  Target, 
  Calculator,
  Users2,
  ChevronDown,
  FolderOpen,
  Shield,
  Check,
  MessageSquare,
  GraduationCap
} from "lucide-react";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { UserMenu } from "@/components/UserMenu";

interface Organ {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  sectors: number;
  activeQuestions: number;
  responses: number;
  createdAt: string;
  logo_url?: string;
}

interface AppSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  selectedOrgan: Organ;
  onOrganChange: (organ: Organ) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "organization", label: "Organização", icon: Building2 },
  { id: "planning", label: "Planejamento", icon: Calendar },
  { id: "collection", label: "Acervo", icon: Archive },
  { id: "tasks", label: "Tarefas", icon: CheckSquare },
  { id: "services", label: "Serviços", icon: Cog },
  { id: "policies", label: "Políticas", icon: FileText },
  { id: "incidents", label: "Incidentes", icon: AlertTriangle },
  { id: "connections", label: "Conexões", icon: Users },
  { id: "products", label: "Produtos", icon: Package },
  { id: "evaluation", label: "Avaliação", icon: Calculator },
  { id: "collegiates", label: "Colegiados", icon: Users2 },
  { id: "unb-projects", label: "Gestão de Projetos UnB", icon: FolderOpen },
  { id: "admin", label: "Administração", icon: Shield }
];

export function AppSidebar({ 
  activeModule, 
  onModuleChange, 
  selectedOrgan, 
  onOrganChange 
}: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const [isOrgSelectorOpen, setIsOrgSelectorOpen] = useState(false);
  const { userProfile } = useAuth();
  
  // Safely get organization context - handle case where provider might not be available
  let currentOrganization = null;
  let availableOrganizations = [];
  let setCurrentOrganization = null;
  let loading = false;

  try {
    const orgContext = useOrganizationContext();
    currentOrganization = orgContext?.currentOrganization;
    availableOrganizations = orgContext?.availableOrganizations || [];
    setCurrentOrganization = orgContext?.setCurrentOrganization;
    loading = orgContext?.loading || false;
  } catch (error) {
    console.warn('Organization context not available:', error);
  }

  // Get tasks count for current organization
  const { tasks, isLoading: tasksLoading } = useTasks(currentOrganization?.id);
  const tasksCount = tasks?.length || 0;

  // Get pending incidents count (keeping the fixed value for now)
  const incidentsCount = 2;

  const handleModuleChange = (moduleId: string) => {
    onModuleChange(moduleId);
    // Fecha o menu mobile automaticamente
    if (isMobile) {
      setOpenMobile?.(false);
    }
  };

  const handleOrganChange = (organ: Organ) => {
    onOrganChange(organ);
    // Fecha o menu mobile automaticamente
    if (isMobile) {
      setOpenMobile?.(false);
    }
  };

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
      'bg-blue-600',
      'bg-emerald-600', 
      'bg-purple-600',
      'bg-orange-600',
      'bg-rose-600',
      'bg-teal-600',
      'bg-indigo-600',
      'bg-amber-600'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleOrganizationSelect = (org: any) => {
    console.log('Selecionando organização:', org.name);
    setCurrentOrganization?.(org);
    setIsOrgSelectorOpen(false);
  };

  console.log('AppSidebar - selectedOrgan logo_url:', selectedOrgan.logo_url);

  // Verificar se é usuário UnB
  const isUnbUser = userProfile?.role === 'unb_admin' || userProfile?.role === 'unb_researcher';
  const isUnbAdmin = userProfile?.role === 'unb_admin';

  console.log('🔧 AppSidebar - Permissões:', {
    userRole: userProfile?.role,
    isUnbUser,
    isUnbAdmin
  });

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, color: "text-blue-600", bgColor: "bg-blue-50" },
    { id: "organization", label: "Organização", icon: Building2, color: "text-green-600", bgColor: "bg-green-50" },
    { id: "planning", label: "Planejamento", icon: Target, color: "text-purple-600", bgColor: "bg-purple-50" },
    { id: "collection", label: "Acervo", icon: Archive, color: "text-orange-600", bgColor: "bg-orange-50" },
    { id: "tasks", label: "Tarefas", icon: CheckSquare, color: "text-blue-600", bgColor: "bg-blue-50" },
    { id: "services", label: "Serviços", icon: Cog, color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { id: "policies", label: "Políticas", icon: FileText, color: "text-red-600", bgColor: "bg-red-50" },
    { id: "incidents", label: "Incidentes", icon: AlertTriangle, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { id: "connections", label: "Conexões", icon: MessageSquare, color: "text-teal-600", bgColor: "bg-teal-50" },
    { id: "products", label: "Produtos", icon: Package, color: "text-pink-600", bgColor: "bg-pink-50" },
    { id: "evaluation", label: "Avaliação", icon: Target, color: "text-cyan-600", bgColor: "bg-cyan-50" },
    { id: "collegiates", label: "Colegiados", icon: Users, color: "text-slate-600", bgColor: "bg-slate-50" },
    ...(isUnbUser ? [{
      id: "unb-projects",
      label: "Projetos UnB",
      icon: GraduationCap,
      color: "text-blue-700",
      bgColor: "bg-blue-100"
    }] : []),
    ...(isUnbAdmin ? [{
      id: "admin",
      label: "Administração",
      icon: Shield,
      color: "text-red-700",
      bgColor: "bg-red-100"
    }] : [])
  ];

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="border-b p-0">
        {/* Logo expandido */}
        <div className="flex items-center justify-center group-data-[collapsible=icon]:hidden h-16 px-4">
          <div className="flex-shrink-0">
            <img 
              src="/lovable-uploads/204c5bd9-5237-47a5-a0a7-ea3ee182f6b7.png" 
              alt="Logo Sistema" 
              className="h-12 w-auto"
            />
          </div>
        </div>
        
        {/* Logo recolhido */}
        <div className="group-data-[collapsible=icon]:flex hidden items-center justify-center h-16 w-full">
          <div className="flex-shrink-0">
            <img 
              src="/lovable-uploads/d442cb2e-bd7c-4b88-8f88-2a354a638e49.png" 
              alt="Logo Recolhido" 
              className="h-8 w-8"
            />
          </div>
        </div>

        {/* Seletor de Organização recolhido - apenas o avatar */}
        <div className="group-data-[collapsible=icon]:flex hidden items-center justify-center pb-4">
          <Avatar className="h-8 w-8">
            {currentOrganization?.logo_url && (
              <AvatarImage src={currentOrganization.logo_url} alt={currentOrganization.name} className="object-contain" />
            )}
            <AvatarFallback className={`${getOrgColor(currentOrganization?.name || 'Default')} text-white text-xs font-semibold`}>
              {getOrgInitials(currentOrganization?.name || 'ORG')}
            </AvatarFallback>
          </Avatar>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 group-data-[collapsible=icon]:p-2">
        <SidebarMenu className="space-y-2">
          {/* Seletor de Organização - apenas quando expandido */}
          <div className="group-data-[collapsible=icon]:hidden mb-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                className="w-full justify-center gap-3 h-auto p-4 bg-sidebar-accent/30 hover:bg-sidebar-accent/40 border border-sidebar-border transition-all duration-200"
                onClick={() => setIsOrgSelectorOpen(!isOrgSelectorOpen)}
              >
                <Avatar className="h-9 w-9 flex-shrink-0">
                  {currentOrganization?.logo_url && (
                    <AvatarImage src={currentOrganization.logo_url} alt={currentOrganization.name} className="object-contain" />
                  )}
                  <AvatarFallback className={`${getOrgColor(currentOrganization?.name || 'Default')} text-white text-sm font-semibold`}>
                    {getOrgInitials(currentOrganization?.name || 'ORG')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-center">
                  <div className="font-semibold text-sm text-sidebar-foreground leading-tight break-words whitespace-normal">
                    {currentOrganization?.name || 'Selecionar Organização'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-sidebar-foreground/70" />
              </Button>

              {/* Lista de organizações */}
              {isOrgSelectorOpen && (
                <div 
                  className="fixed rounded-md shadow-lg z-[9999] w-80 max-h-80 overflow-y-auto border border-gray-600"
                  style={{
                    backgroundColor: '#2E3D51',
                    color: 'white',
                    left: isMobile ? '20px' : '280px',
                    top: '140px'
                  }}
                >
                  <div className="p-3">
                    <div className="text-sm font-semibold text-white/80 mb-3 px-1 text-center">
                      Organizações disponíveis
                    </div>
                    {availableOrganizations.map((org) => (
                      <div
                        key={org.id}
                        className="flex items-center gap-3 p-3 hover:bg-white/10 hover:text-white rounded-md cursor-pointer transition-colors duration-200"
                        onClick={() => handleOrganizationSelect(org)}
                      >
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          {org.logo_url && (
                            <AvatarImage src={org.logo_url} alt={org.name} className="object-contain" />
                          )}
                          <AvatarFallback className={`${getOrgColor(org.name)} text-white text-sm font-semibold`}>
                            {getOrgInitials(org.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0 text-center">
                          <div className="font-semibold text-sm leading-tight break-words whitespace-normal text-white">
                            {org.name}
                          </div>
                        </div>

                        {currentOrganization?.id === org.id && (
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    ))}
                    
                    {availableOrganizations.length === 0 && (
                      <div className="text-center py-8">
                        <Building2 className="h-10 w-10 text-white/40 mx-auto mb-3" />
                        <p className="text-sm text-white/60">Nenhuma organização disponível</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divisor */}
          <div className="border-t border-sidebar-border my-4 group-data-[collapsible=icon]:hidden" />

          {/* Menu Principal */}
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => handleModuleChange(item.id)}
                isActive={activeModule === item.id}
                className="w-full group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!px-2"
                tooltip={item.label}
              >
                <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </div>
                {item.id === "tasks" && tasksCount > 0 && (
                  <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">
                    {tasksLoading ? "..." : tasksCount}
                  </Badge>
                )}
                {item.id === "incidents" && incidentsCount > 0 && (
                  <Badge variant="destructive" className="ml-auto group-data-[collapsible=icon]:hidden">
                    {incidentsCount}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t group-data-[collapsible=icon]:p-2">
        {/* Usar o UserMenu component em ambos os estados */}
        <div className="flex justify-center">
          <UserMenu />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
