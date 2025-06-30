
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Service, ServiceStatus, SERVICE_STATUS } from "@/types/service";
import { ServicesTable } from "./ServicesTable";
import { CollapsibleFilters } from "./CollapsibleFilters";

interface ServicesManagementProps {
  services: Service[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: Array<{
    key: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  }>;
  yearFilter: {
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  };
  onClearFilters: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  viewMode: "cards" | "table";
  onViewChange: (mode: "cards" | "table") => void;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

export function ServicesManagement({
  services,
  searchTerm,
  onSearchChange,
  filters,
  yearFilter,
  onClearFilters,
  onExportPDF,
  onExportExcel,
  viewMode,
  onViewChange,
  onEdit,
  onDelete
}: ServicesManagementProps) {
  const [activeStatusTab, setActiveStatusTab] = useState<ServiceStatus | "all">("all");

  const getServicesByStatus = (status: ServiceStatus | "all") => {
    if (status === "all") return services;
    return services.filter(service => service.status === status);
  };

  const filteredServices = getServicesByStatus(activeStatusTab);

  const getStatusCounts = () => {
    return {
      all: services.length,
      in_progress: services.filter(s => s.status === 'in_progress').length,
      completed: services.filter(s => s.status === 'completed').length,
      cancelled: services.filter(s => s.status === 'cancelled').length
    };
  };

  const statusCounts = getStatusCounts();

  const renderServicesContent = () => {
    if (filteredServices.length === 0) {
      const statusLabel = activeStatusTab === "all" ? "serviços" : 
                         SERVICE_STATUS[activeStatusTab as ServiceStatus]?.label.toLowerCase() || "serviços";
      
      return (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              Nenhum {statusLabel} encontrado com os filtros aplicados.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <ServicesTable
        services={filteredServices}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Gerenciar Serviços
          {services.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredServices.length} de {services.length})
            </span>
          )}
        </h2>
      </div>

      {/* Filtros Colapsáveis */}
      <CollapsibleFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filters={filters}
        yearFilter={yearFilter}
        onClearFilters={onClearFilters}
        onExportPDF={onExportPDF}
        onExportExcel={onExportExcel}
      />

      {/* Estatísticas dos Serviços */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{statusCounts.all}</p>
              <p className="text-sm text-muted-foreground">Total de Serviços</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{statusCounts.in_progress}</p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
              <p className="text-sm text-muted-foreground">Concluídos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</p>
              <p className="text-sm text-muted-foreground">Cancelados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Abas de status */}
      <Tabs value={activeStatusTab} onValueChange={(value) => setActiveStatusTab(value as ServiceStatus | "all")} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            Todos
            <Badge variant="secondary" className="text-xs">
              {statusCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="flex items-center gap-2">
            Em Andamento
            <Badge variant="secondary" className="text-xs">
              {statusCounts.in_progress}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            Concluídos
            <Badge variant="secondary" className="text-xs">
              {statusCounts.completed}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            Cancelados
            <Badge variant="secondary" className="text-xs">
              {statusCounts.cancelled}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeStatusTab}>
          {renderServicesContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
