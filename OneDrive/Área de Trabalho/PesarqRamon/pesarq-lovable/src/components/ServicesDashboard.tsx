
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Service, ServiceType, ServiceStatus, SERVICE_TYPES, SERVICE_STATUS } from "@/types/service";
import { TrendingUp, Users, Calendar, Target, CheckCircle, Clock, Filter } from "lucide-react";
import { CollapsibleFilters } from "./CollapsibleFilters";

interface ServicesDashboardProps {
  services: Service[];
}

export function ServicesDashboard({ services }: ServicesDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ServiceType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ServiceStatus | "all">("all");
  const [filterSector, setFilterSector] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  const uniqueSectors = Array.from(new Set(services.map(s => s.target_sector)));
  const availableYears = Array.from(new Set(services.map(s => new Date(s.start_date).getFullYear())))
    .sort((a, b) => b - a);

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
    setFilterYear("all");
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

  const totalServices = filteredServices.length;
  const completedServices = filteredServices.filter(s => s.status === 'completed').length;
  const inProgressServices = filteredServices.filter(s => s.status === 'in_progress').length;
  const cancelledServices = filteredServices.filter(s => s.status === 'cancelled').length;

  const completionRate = totalServices > 0 ? Math.round((completedServices / totalServices) * 100) : 0;
  const uniqueSectorsCount = new Set(filteredServices.map(s => s.target_sector)).size;
  const uniqueResponsibles = new Set(filteredServices.map(s => s.responsible_person)).size;

  // Dados para gráficos
  const statusData = [
    { name: 'Em Andamento', value: inProgressServices, color: '#3B82F6' },
    { name: 'Concluídos', value: completedServices, color: '#10B981' },
    { name: 'Cancelados', value: cancelledServices, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const typeData = Object.entries(
    filteredServices.reduce((acc, service) => {
      const typeName = SERVICE_TYPES[service.type]?.label || service.type;
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const sectorData = Object.entries(
    filteredServices.reduce((acc, service) => {
      acc[service.target_sector] = (acc[service.target_sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const monthlyData = filteredServices.reduce((acc, service) => {
    const month = new Date(service.start_date).toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyChart = Object.entries(monthlyData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-12);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard de Serviços</h2>
          <p className="text-gray-600">
            Visão geral e análise dos serviços arquivísticos
            {filteredServices.length !== services.length && (
              <span className="ml-2 text-sm">
                ({filteredServices.length} de {services.length} serviços)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filtros na parte superior */}
      <CollapsibleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        yearFilter={yearFilterConfig}
        onClearFilters={clearFilters}
        onExportPDF={() => {}}
        onExportExcel={() => {}}
      />

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Serviços</p>
                <p className="text-3xl font-bold text-gray-900">{totalServices}</p>
                <p className="text-xs text-blue-600">{uniqueSectorsCount} setores atendidos</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-3xl font-bold text-gray-900">{inProgressServices}</p>
                <p className="text-xs text-orange-600">serviços ativos</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-3xl font-bold text-gray-900">{completedServices}</p>
                <p className="text-xs text-green-600">{completionRate}% de conclusão</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Responsáveis</p>
                <p className="text-3xl font-bold text-gray-900">{uniqueResponsibles}</p>
                <p className="text-xs text-purple-600">pessoas envolvidas</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Distribuição por Status
            </CardTitle>
            <CardDescription>Status atual dos serviços</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tipos Mais Utilizados
            </CardTitle>
            <CardDescription>Top 10 tipos de serviços</CardDescription>
          </CardHeader>
          <CardContent>
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" fontSize={10} width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#15AB92" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sectors Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Setores Mais Atendidos
            </CardTitle>
            <CardDescription>Top 8 setores por quantidade de serviços</CardDescription>
          </CardHeader>
          <CardContent>
            {sectorData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tendência Mensal
            </CardTitle>
            <CardDescription>Serviços iniciados por mês (últimos 12 meses)</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={10} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
