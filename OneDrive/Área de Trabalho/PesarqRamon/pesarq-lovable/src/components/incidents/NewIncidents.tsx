
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleIncidentForm } from "./SimpleIncidentForm";
import { SimpleIncidentTracking } from "./SimpleIncidentTracking";
import { IncidentReports } from "./IncidentReports";
import { AlertTriangle, Plus, ClipboardList, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSimpleIncidents } from "@/hooks/useSimpleIncidents";

export function NewIncidents() {
  const [activeTab, setActiveTab] = useState("tracking");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const { incidents, loading } = useSimpleIncidents();

  // Calcular estatísticas
  const stats = {
    total: incidents.length,
    inProgress: incidents.filter(i => i.status === 'em-tratamento').length,
    critical: incidents.filter(i => i.severity === 'critica').length,
    resolved: incidents.filter(i => i.status === 'resolvido').length
  };

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando gestão de incidentes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-8">
            <div className="flex-1 max-w-none lg:max-w-3xl w-full">
              <h1 className="text-xl sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2">Gestão de Incidentes</h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
                Registre, acompanhe e trate eventos críticos relacionados à segurança, integridade e acessibilidade dos acervos documentais.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <Button 
                onClick={() => setShowRegistrationModal(true)}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 w-full lg:w-auto"
                size="lg"
              >
                <Plus className="h-4 w-4" />
                <span className="sm:inline">Registrar Incidente</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total de Incidentes</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.total}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {stats.total > 0 ? 'Registrados no sistema' : 'Nenhum incidente registrado'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Em Tratamento</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {stats.inProgress > 0 ? 'Requer atenção' : 'Nenhum em tratamento'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Críticos</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.critical}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {stats.critical > 0 ? 'Ação imediata necessária' : 'Nenhum crítico'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Taxa de Resolução</CardTitle>
              <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{resolutionRate}%</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {stats.resolved} de {stats.total} resolvidos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto bg-muted/50 p-1">
            <TabsTrigger 
              value="tracking" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Acompanhamento</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Relatórios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-4 sm:space-y-6">
            <SimpleIncidentTracking />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 sm:space-y-6">
            <IncidentReports />
          </TabsContent>
        </Tabs>

        {/* Registration Modal */}
        {showRegistrationModal && (
          <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Novo Incidente</DialogTitle>
                <DialogDescription>
                  Preencha as informações do incidente arquivístico para registro e acompanhamento.
                </DialogDescription>
              </DialogHeader>
              <SimpleIncidentForm onClose={() => setShowRegistrationModal(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
