import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, UserCheck, UserX, UserMinus, RefreshCw } from "lucide-react";
import { ResearcherFormContainer } from "./researcher/ResearcherFormContainer";
import { ResearcherTable } from "./researcher/ResearcherTable";
import { ResearcherViewModal } from "./researcher/ResearcherViewModal";
import { DismissalModal } from "./researcher/DismissalModal";
import { ResearcherSummaryCards } from "./researcher/ResearcherSummaryCards";
import { InstitutionComplianceCard } from "./researcher/InstitutionComplianceCard";
import { CertificateVerifier } from "./CertificateVerifier";
import { useResearchers, type Researcher } from "@/hooks/useResearchers";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";

export function ResearchersRegistry() {
  const {
    researchers,
    activeResearchers,
    inactiveResearchers,
    dismissedResearchers,
    loading,
    deleteResearcher,
    toggleResearcherStatus,
    dismissResearcher,
    refetch
  } = useResearchers();
  
  const { projects } = useProjects();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingResearcher, setEditingResearcher] = useState<Researcher | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingResearcher, setViewingResearcher] = useState<Researcher | null>(null);
  const [showDismissalModal, setShowDismissalModal] = useState(false);
  const [dismissingResearcher, setDismissingResearcher] = useState<Researcher | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    project_id: "",
    function: "",
    modality: "",
    academic_level: "",
    status: ""
  });

  const handleEdit = (researcher: Researcher) => {
    setEditingResearcher(researcher);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteResearcher(id);
  };

  const handleView = (researcher: Researcher) => {
    setViewingResearcher(researcher);
    setShowViewModal(true);
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    await toggleResearcherStatus(id, isActive);
  };

  const handleDismiss = (researcher: Researcher) => {
    setDismissingResearcher(researcher);
    setShowDismissalModal(true);
  };

  const handleConfirmDismissal = async (reason: string, dismissedBy: string) => {
    if (dismissingResearcher) {
      await dismissResearcher(dismissingResearcher.id, reason, dismissedBy);
      setShowDismissalModal(false);
      setDismissingResearcher(null);
    }
  };

  const handleCloseForm = async (shouldRefetch = false) => {
    console.log('ResearchersRegistry: Fechando formulário', { shouldRefetch });
    
    setShowForm(false);
    setEditingResearcher(null);
    
    // Se foi uma edição bem-sucedida, força o refetch
    if (shouldRefetch) {
      console.log('ResearchersRegistry: Forçando atualização dos dados...');
      try {
        await refetch();
        console.log('ResearchersRegistry: Dados atualizados com sucesso');
      } catch (error) {
        console.error('ResearchersRegistry: Erro ao atualizar dados:', error);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Sucesso",
        description: "Dados atualizados com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      project_id: "",
      function: "",
      modality: "",
      academic_level: "",
      status: ""
    });
  };

  const applyFilters = (researchersList: Researcher[]) => {
    return researchersList.filter(researcher => {
      if (filters.name && !researcher.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.project_id && researcher.project_id !== filters.project_id) {
        return false;
      }
      if (filters.function && researcher.function !== filters.function) {
        return false;
      }
      if (filters.modality && researcher.modality !== filters.modality) {
        return false;
      }
      if (filters.academic_level && researcher.academic_level !== filters.academic_level) {
        return false;
      }
      if (filters.status && researcher.status !== filters.status) {
        return false;
      }
      return true;
    });
  };

  const filteredActiveResearchers = applyFilters(activeResearchers);
  const filteredInactiveResearchers = applyFilters(inactiveResearchers);
  const filteredDismissedResearchers = applyFilters(dismissedResearchers);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando pesquisadores...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            Cadastro de Pesquisadores
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Gerencie os pesquisadores da instituição</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            disabled={refreshing}
            className="flex-1 sm:flex-initial"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button onClick={() => setShowForm(true)} className="flex-1 sm:flex-initial">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pesquisador
          </Button>
          <CertificateVerifier />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResearcherSummaryCards 
            active={activeResearchers.length}
            inactive={inactiveResearchers.length}
            dismissed={dismissedResearchers.length}
            total={researchers.length}
          />
        </div>
        <div>
          <InstitutionComplianceCard researchers={researchers} />
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="text-xs sm:text-sm">
            <UserCheck className="h-4 w-4 mr-1" />
            Ativos
          </TabsTrigger>
          <TabsTrigger value="inactive" className="text-xs sm:text-sm">
            <UserX className="h-4 w-4 mr-1" />
            Inativos
          </TabsTrigger>
          <TabsTrigger value="dismissed" className="text-xs sm:text-sm">
            <UserMinus className="h-4 w-4 mr-1" />
            Desligados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                Pesquisadores Ativos ({filteredActiveResearchers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <ResearcherTable
                researchers={filteredActiveResearchers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onToggleStatus={handleToggleStatus}
                onDismiss={handleDismiss}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <UserX className="h-5 w-5 text-gray-600" />
                Pesquisadores Inativos ({filteredInactiveResearchers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <ResearcherTable
                researchers={filteredInactiveResearchers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onToggleStatus={handleToggleStatus}
                onDismiss={handleDismiss}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dismissed">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <UserMinus className="h-5 w-5 text-red-600" />
                Pesquisadores Desligados ({filteredDismissedResearchers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <ResearcherTable
                researchers={filteredDismissedResearchers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onToggleStatus={handleToggleStatus}
                onDismiss={handleDismiss}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ResearcherFormContainer
        isOpen={showForm}
        onClose={handleCloseForm}
        editingResearcher={editingResearcher}
      />

      <ResearcherViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        researcher={viewingResearcher}
      />

      <DismissalModal
        isOpen={showDismissalModal}
        onClose={() => setShowDismissalModal(false)}
        researcher={dismissingResearcher}
        onConfirm={handleConfirmDismissal}
      />
    </div>
  );
}
