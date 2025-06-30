import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { Dashboard } from "@/components/Dashboard";
import Organization from "@/components/Organization";
import { TasksTracking } from "@/components/TasksTracking";
import { ServicesActions } from "@/components/ServicesActions";
import { PoliciesDashboard } from "@/components/policies/PoliciesDashboard";
import { PoliciesNorms } from "@/components/PoliciesNorms";
import { Incidents } from "@/components/Incidents";
import { Connections } from "@/components/connections/Connections";
import { Products } from "@/components/Products";
import { ProductGovernance } from "@/components/ProductGovernance";
import { EvaluationTools } from "@/components/EvaluationTools";
import { ArchivalCollegiates } from "@/components/ArchivalCollegiates";
import { StrategicPlanning } from "@/components/StrategicPlanning";
import { ProtectedDashboard } from "@/components/auth/ProtectedDashboard";
import { ProtectedAdminRoute } from "@/components/auth/ProtectedAdminRoute";
import { ProtectedUnbRoute } from "@/components/auth/ProtectedUnbRoute";
import { DocumentCollection } from "@/components/DocumentCollection";
import { ProjectsManagement } from "@/components/unb/ProjectsManagement";
import AdminPanel from "@/pages/AdminPanel";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [productGovernance, setProductGovernance] = useState<string | null>(null);

  console.log('📱 Index: Renderizando com módulo:', activeModule);

  const handleNavigateToGovernance = (productType: string) => {
    console.log('🔄 Index: Navegando para governança:', productType);
    setProductGovernance(productType);
  };

  const handleBackFromGovernance = () => {
    console.log('🔙 Index: Voltando da governança');
    setProductGovernance(null);
  };

  const handleModuleChange = (module: string) => {
    console.log('🔄 Index: Mudando para módulo:', module);
    setActiveModule(module);
  };

  // Organização padrão simplificada
  const defaultOrgan = {
    id: '1',
    name: 'Organização Principal',
    abbreviation: 'OP',
    description: 'Organização padrão do sistema',
    sectors: 0,
    activeQuestions: 0,
    responses: 0,
    createdAt: new Date().toISOString(),
    logo_url: ''
  };

  const renderActiveModule = () => {
    console.log('🎨 Index: Renderizando módulo:', activeModule);
    
    if (productGovernance) {
      return (
        <ProductGovernance 
          productType={productGovernance} 
          onBack={handleBackFromGovernance}
        />
      );
    }

    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "organization":
        return <Organization />;
      case "planning":
        return <StrategicPlanning />;
      case "collection":
        return <DocumentCollection />;
      case "tasks":
        return <TasksTracking />;
      case "services":
        return <ServicesActions />;
      case "policies":
        return <PoliciesNorms />;
      case "incidents":
        return <Incidents />;
      case "connections":
        return <Connections />;
      case "products":
        return <Products onNavigateToGovernance={handleNavigateToGovernance} />;
      case "evaluation":
        return <EvaluationTools />;
      case "collegiates":
        return <ArchivalCollegiates />;
      case "unb-projects":
        return (
          <ProtectedUnbRoute>
            <ProjectsManagement />
          </ProtectedUnbRoute>
        );
      case "admin":
        return (
          <ProtectedAdminRoute>
            <AdminPanel />
          </ProtectedAdminRoute>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedDashboard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar 
            activeModule={activeModule}
            onModuleChange={handleModuleChange}
            selectedOrgan={defaultOrgan}
            onOrganChange={() => {}}
          />
          <div className="flex-1">
            <TopHeader activeModule={activeModule} />
            <main className="pt-14 sm:pt-16">
              {renderActiveModule()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedDashboard>
  );
};

export default Index;
