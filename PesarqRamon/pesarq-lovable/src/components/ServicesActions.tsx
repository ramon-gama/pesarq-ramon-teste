import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, Building } from "lucide-react";
import { Service, ServiceStatus, ServiceType, SERVICE_TYPES, SERVICE_STATUS } from "@/types/service";
import { ServiceForm } from "./ServiceForm";
import { ServicesDashboard } from "./ServicesDashboard";
import { ServicesManagement } from "./ServicesManagement";
import { ProjectServicesTab } from "./ProjectServicesTab";
import { exportToPDF, exportToExcel } from "@/utils/exportUtils";
import { useServices } from "@/hooks/useServices";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { useAuth } from "@/hooks/useAuth";

export function ServicesActions() {
  const { services, loading, createService, updateService, deleteService } = useServices();
  const { currentOrganization, loading: contextLoading } = useOrganizationContext();
  const { isAuthenticated } = useAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ServiceType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ServiceStatus | "all">("all");
  const [filterSector, setFilterSector] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("dashboard");

  const uniqueSectors = Array.from(new Set(services.map(s => s.target_sector)));
  
  // Extrair anos únicos dos serviços e ordenar do mais recente para o mais antigo
  const availableYears = Array.from(new Set(services.map(s => new Date(s.start_date).getFullYear())))
    .sort((a, b) => b - a);
  
  const currentYear = new Date().getFullYear();
  const mostRecentYear = availableYears.length > 0 ? availableYears[0] : currentYear;

  // Definir o ano mais recente como padrão quando os serviços mudarem
  useEffect(() => {
    if (availableYears.length > 0 && filterYear === "all") {
      setFilterYear(mostRecentYear.toString());
    }
  }, [services, mostRecentYear, filterYear]);

  const handleSaveService = async (serviceData: Partial<Service>) => {
    if (editingService) {
      await updateService(editingService.id, serviceData);
    } else {
      await createService(serviceData);
    }
    setShowForm(false);
    setEditingService(undefined);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    await deleteService(serviceId);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.target_sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.responsible_person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || service.type === filterType;
    const matchesStatus = filterStatus === "all" || service.status === filterStatus;
    const matchesSector = filterSector === "all" || service.target_sector === filterSector;
    const matchesYear = filterYear === "all" || new Date(service.start_date).getFullYear().toString() === filterYear;
    return matchesSearch && matchesType && matchesStatus && matchesSector && matchesYear;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterSector("all");
    setFilterYear(mostRecentYear.toString());
  };

  const filters = [
    {
      key: "type",
      label: "Tipo de Serviço",
      value: filterType,
      options: [
        { value: "all", label: "Todos os tipos" },
        ...Object.entries(SERVICE_TYPES).map(([key, type]) => ({
          value: key,
          label: type.label
        }))
      ],
      onChange: (value: string) => setFilterType(value as ServiceType | "all")
    },
    {
      key: "status",
      label: "Status",
      value: filterStatus,
      options: [
        { value: "all", label: "Todos os status" },
        ...Object.entries(SERVICE_STATUS).map(([key, status]) => ({
          value: key,
          label: status.label
        }))
      ],
      onChange: (value: string) => setFilterStatus(value as ServiceStatus | "all")
    },
    {
      key: "sector",
      label: "Setor",
      value: filterSector,
      options: [
        { value: "all", label: "Todos os setores" },
        ...uniqueSectors.map(sector => ({
          value: sector,
          label: sector
        }))
      ],
      onChange: (value: string) => setFilterSector(value)
    }
  ];

  const yearFilterConfig = {
    value: filterYear,
    options: [
      { value: "all", label: "Todos os anos" },
      ...availableYears.map(year => ({
        value: year.toString(),
        label: year.toString()
      }))
    ],
    onChange: (value: string) => setFilterYear(value)
  };

  const handleExportPDF = () => {
    exportToPDF(filteredServices, `Relatório de Serviços - ${currentOrganization?.name || 'Organização'}`);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredServices, `servicos_${currentOrganization?.acronym || 'org'}`);
  };

  // Verificação de autenticação
  if (!isAuthenticated) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Acesso Negado
            </h3>
            <p className="text-yellow-700">
              Você precisa estar logado para acessar o gerenciamento de serviços.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading do contexto de organizações
  if (contextLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando organização...</p>
          </div>
        </div>
      </div>
    );
  }

  // Verificação se há organização selecionada
  if (!currentOrganization) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
            <Building className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Nenhuma organização selecionada
            </h3>
            <p className="text-yellow-700">
              Selecione uma organização para visualizar e gerenciar os serviços.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading dos serviços
  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando serviços...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-3 p-2 sm:space-y-6 sm:p-4 md:p-6">
        <ServiceForm
          service={editingService}
          onSave={handleSaveService}
          onCancel={() => {
            setShowForm(false);
            setEditingService(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              Gestão de Serviços
            </h1>
            <p className="text-gray-600">
              Gestão e acompanhamento de serviços prestados - {currentOrganization?.name}
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Serviço
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-background">
              📊 Dashboard
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-background">
              📋 Gerenciar Serviços
            </TabsTrigger>
            <TabsTrigger value="unb_projects" className="data-[state=active]:bg-background">
              🎯 Projetos UnB
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <ServicesDashboard services={filteredServices} />
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <ServicesManagement
              services={filteredServices}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              yearFilter={yearFilterConfig}
              onClearFilters={clearFilters}
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
              viewMode="table"
              onViewChange={() => {}} // Função vazia já que sempre será tabela
              onEdit={handleEditService}
              onDelete={handleDeleteService}
            />
          </TabsContent>

          <TabsContent value="unb_projects" className="space-y-4">
            <ProjectServicesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
