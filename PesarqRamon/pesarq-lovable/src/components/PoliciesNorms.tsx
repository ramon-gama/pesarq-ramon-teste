
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Plus, 
  Filter, 
  Download, 
  Clock, 
  Eye,
  Edit,
  AlertTriangle,
  Calendar,
  GitBranch,
  Search,
  BarChart3
} from "lucide-react";
import { NormativesList } from "./policies/NormativesList";
import { CreateNormativeModal } from "./policies/CreateNormativeModal";
import { NormativeDetails } from "./policies/NormativeDetails";
import { NormativesInProgress } from "./policies/NormativesInProgress";
import { NormativesLibrary } from "./policies/NormativesLibrary";
import { ReviewAlerts } from "./policies/ReviewAlerts";
import { PoliciesDashboard } from "./policies/PoliciesDashboard";

export function PoliciesNorms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNormative, setSelectedNormative] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleExport = () => {
    // Implementar exportação
    console.log("Exportando políticas e normas...");
  };

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewAll = () => {
    setActiveTab("normatives");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com título e descrição */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Políticas e Normas
          </h1>
          <p className="text-gray-600">
            Módulo de Governança Normativa para elaboração, controle e gestão de políticas institucionais
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Política/Norma
          </Button>
        </div>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="normatives" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Normas Ativas
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Em Elaboração
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Biblioteca
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Detalhes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <PoliciesDashboard 
            onCreateNew={handleCreateNew}
            onViewAll={handleViewAll}
          />
        </TabsContent>

        <TabsContent value="normatives" className="space-y-4">
          {/* Filtros - só aparecem na aba de normas ativas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar normas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="vigente">Vigente</SelectItem>
                    <SelectItem value="elaboracao">Em Elaboração</SelectItem>
                    <SelectItem value="revisao">Em Revisão</SelectItem>
                    <SelectItem value="revogada">Revogada</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="politica">Política</SelectItem>
                    <SelectItem value="instrucao">Instrução Normativa</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="resolucao">Resolução</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Período
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alertas de Revisão */}
          <ReviewAlerts />

          <NormativesList 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            onSelectNormative={setSelectedNormative}
          />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <NormativesInProgress />
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <NormativesLibrary />
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedNormative ? (
            <NormativeDetails normative={selectedNormative} />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Selecione uma norma para ver os detalhes</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <CreateNormativeModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
