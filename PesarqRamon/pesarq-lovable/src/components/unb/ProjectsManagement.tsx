
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsRegistry } from "./ProjectsRegistry";
import { ResearchersRegistry } from "./ResearchersRegistry";
import { AttendanceControl } from "./AttendanceControl";
import { ProjectsDashboard } from "./ProjectsDashboard";
import { OrganizationsManagement } from "./OrganizationsManagement";
import { ProjectFilters, type ProjectFilters as ProjectFiltersType } from "./ProjectFilters";
import { FolderOpen, Users, Clock, BarChart3, Building2 } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function ProjectsManagement() {
  const [filters, setFilters] = useState<ProjectFiltersType>({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isMobile, setOpenMobile } = useSidebar();

  console.log('🔍 ProjectsManagement - Renderizando:', {
    activeTab,
    isMobile,
    hasFilters: Object.keys(filters).length > 0
  });

  const handleFiltersChange = (newFilters: ProjectFiltersType) => {
    setFilters(newFilters);
    console.log('📋 Filtros aplicados:', newFilters);
  };

  const handleTabChange = (value: string) => {
    console.log('🔄 Tab mudou para:', value, 'isMobile:', isMobile);
    setActiveTab(value);
    if (isMobile && setOpenMobile) {
      console.log('📱 Fechando menu mobile...');
      setOpenMobile(false);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="p-4 lg:p-6 max-w-full">
        {/* Header sempre visível */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <FolderOpen className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold">Gestão de Projetos UnB</h1>
            <p className="text-sm lg:text-base text-gray-600">Sistema de controle e acompanhamento de projetos de pesquisa</p>
          </div>
        </div>

        {/* Filtros Globais */}
        <div className="w-full mb-6">
          <ProjectFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* Tabs principais */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="w-full overflow-x-auto mb-4">
            <TabsList className="grid grid-cols-5 w-full min-w-[600px] h-auto bg-muted/50 p-1">
              <TabsTrigger 
                value="dashboard" 
                className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[48px]"
              >
                <BarChart3 className="h-4 w-4 flex-shrink-0" />
                <span className="leading-tight text-center">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="organizations" 
                className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[48px]"
              >
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="leading-tight text-center">Organizações</span>
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[48px]"
              >
                <FolderOpen className="h-4 w-4 flex-shrink-0" />
                <span className="leading-tight text-center">Projetos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="researchers" 
                className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[48px]"
              >
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="leading-tight text-center">Pesquisadores</span>
              </TabsTrigger>
              <TabsTrigger 
                value="attendance" 
                className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[48px]"
              >
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="leading-tight text-center">Frequência</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Conteúdo das tabs */}
          <div className="w-full">
            <TabsContent value="dashboard" className="mt-0">
              <div className="w-full">
                <ProjectsDashboard />
              </div>
            </TabsContent>

            <TabsContent value="organizations" className="mt-0">
              <div className="w-full">
                <OrganizationsManagement />
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <div className="w-full">
                <ProjectsRegistry />
              </div>
            </TabsContent>

            <TabsContent value="researchers" className="mt-0">
              <div className="w-full">
                <ResearchersRegistry />
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <div className="w-full">
                <AttendanceControl />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
