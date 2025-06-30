import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Target, Clock, TrendingUp, BarChart3, Eye } from "lucide-react";
import { PlanningOverview } from "@/components/planning/PlanningOverview";
import { CreatePlanModal } from "@/components/planning/CreatePlanModal";
import { EditPlanModal } from "@/components/planning/EditPlanModal";
import { DeletePlanDialog } from "@/components/planning/DeletePlanDialog";
import { PlanningList } from "@/components/planning/PlanningList";
import { PlanDetails } from "@/components/planning/PlanDetails";
import { useStrategicPlanning, StrategicPlan } from "@/hooks/useStrategicPlanning";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";

export function StrategicPlanning() {
  console.log('StrategicPlanning: componente renderizado');
  
  // Use organization context instead of fixed ID
  const { currentOrganization, loading: contextLoading } = useOrganizationContext();
  const organizationId = currentOrganization?.id;
  
  console.log('StrategicPlanning: contexto da organização:', { 
    currentOrganization: currentOrganization?.name, 
    organizationId, 
    contextLoading 
  });
  
  const { plans, loading, error } = useStrategicPlanning(organizationId || '');
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<StrategicPlan | null>(null);

  console.log('StrategicPlanning: estado atual:', { 
    organizationId, 
    loading, 
    error,
    plansCount: plans?.length || 0, 
    activeTab 
  });

  // Calculate stats from real data
  const planningStats = {
    total: plans?.length || 0,
    inProgress: plans?.filter(plan => plan.status === 'in_progress').length || 0,
    completed: plans?.filter(plan => plan.status === 'completed').length || 0,
    draft: plans?.filter(plan => plan.status === 'draft').length || 0
  };

  const handleViewPlan = (plan: StrategicPlan) => {
    console.log('Visualizando plano:', plan.name);
    setSelectedPlan(plan);
    setActiveTab("details");
  };

  const handleEditPlan = (plan: StrategicPlan) => {
    console.log('Editando plano:', plan.name);
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  const handleDeletePlan = (plan: StrategicPlan) => {
    console.log('Deletando plano:', plan.name);
    setSelectedPlan(plan);
    setShowDeleteDialog(true);
  };

  const handleBackToList = () => {
    console.log('Voltando para lista');
    setSelectedPlan(null);
    setActiveTab("list");
  };

  const handleNavigateTo = (tab: string) => {
    console.log('Navegando para aba:', tab);
    setActiveTab(tab);
    if (tab !== "details") {
      setSelectedPlan(null);
    }
  };

  // Show loading while context is loading
  if (contextLoading) {
    console.log('StrategicPlanning: mostrando loading do contexto');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando organização...</p>
        </div>
      </div>
    );
  }

  // Show message if no organization is selected
  if (!currentOrganization) {
    console.log('StrategicPlanning: nenhuma organização selecionada');
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Nenhuma organização selecionada
          </h3>
          <p className="text-yellow-700">
            Selecione uma organização para visualizar seus planejamentos estratégicos.
          </p>
        </div>
      </div>
    );
  }

  // Show error if there's an error
  if (error) {
    console.log('StrategicPlanning: mostrando erro:', error);
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Erro ao carregar dados
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Recarregar página
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('StrategicPlanning: mostrando loading dos dados');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando planejamentos...</p>
        </div>
      </div>
    );
  }

  console.log('StrategicPlanning: renderizando interface principal');

  return (
    <div className="h-full flex flex-col">
      {/* Header sempre visível */}
      <div className="flex-none px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {selectedPlan ? selectedPlan.name : 'Planejamento Estratégico'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base leading-relaxed">
              {selectedPlan 
                ? selectedPlan.description || 'Detalhes do planejamento estratégico'
                : `Elabore e acompanhe os planejamentos estratégicos - ${currentOrganization.name}`
              }
            </p>
          </div>
          {/* Botão sempre visível */}
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#15AB92] hover:bg-[#0d8f7a] text-sm sm:text-base whitespace-nowrap"
            size="sm"
          >
            <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Novo </span>Planejamento
          </Button>
        </div>
      </div>

      <div className="flex-1 px-6">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => handleNavigateTo("overview")}
                  className="cursor-pointer hover:text-[#15AB92]"
                >
                  Planejamento Estratégico
                </BreadcrumbLink>
              </BreadcrumbItem>
              {selectedPlan && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      onClick={() => handleNavigateTo("list")}
                      className="cursor-pointer hover:text-[#15AB92]"
                    >
                      Lista de Planejamentos
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[#15AB92] font-medium">
                      {selectedPlan.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Stats Cards - Only show when not viewing a specific plan */}
        {!selectedPlan && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-2 sm:p-3 lg:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{planningStats.total}</p>
                  </div>
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-[#15AB92] flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-2 sm:p-3 lg:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Em Andamento</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{planningStats.inProgress}</p>
                  </div>
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-2 sm:p-3 lg:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Concluídos</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{planningStats.completed}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto mb-4 sm:mb-6">
            <TabsList className="inline-flex w-full sm:w-auto min-w-full sm:min-w-0 bg-gray-100">
              {!selectedPlan && (
                <>
                  <TabsTrigger 
                    value="overview" 
                    className="text-xs sm:text-sm px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:text-[#15AB92] data-[state=active]:border-[#15AB92] data-[state=active]:border-b-2"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Visão Geral
                  </TabsTrigger>
                  <TabsTrigger 
                    value="list" 
                    className="text-xs sm:text-sm px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:text-[#15AB92] data-[state=active]:border-[#15AB92] data-[state=active]:border-b-2"
                  >
                    <Target className="w-4 h-4 mr-1" />
                    Planejamentos
                  </TabsTrigger>
                </>
              )}
              {selectedPlan && (
                <TabsTrigger 
                  value="details" 
                  className="text-xs sm:text-sm px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:text-[#15AB92] data-[state=active]:border-[#15AB92] data-[state=active]:border-b-2"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Detalhes do Planejamento
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <PlanningOverview stats={planningStats} plans={plans || []} />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <PlanningList 
              onViewPlan={handleViewPlan} 
              onEditPlan={handleEditPlan}
              onDeletePlan={handleDeletePlan}
              plans={plans || []} 
            />
          </TabsContent>

          {selectedPlan && (
            <TabsContent value="details" className="space-y-4">
              <PlanDetails plan={selectedPlan} onBack={handleBackToList} />
            </TabsContent>
          )}
        </Tabs>
      </div>

      <CreatePlanModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
        organizationId={organizationId || ''}
      />

      <EditPlanModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        organizationId={organizationId || ''}
        plan={selectedPlan}
      />

      <DeletePlanDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        organizationId={organizationId || ''}
        plan={selectedPlan}
      />
    </div>
  );
}
