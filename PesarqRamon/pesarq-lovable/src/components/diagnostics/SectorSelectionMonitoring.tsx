
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  MapPin,
  ExternalLink,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
  Calendar,
  FileText,
  Eye,
  AlertCircle,
  Building2
} from "lucide-react";
import { SectorSelectionForm } from "../SectorSelectionForm";
import { DiagnosticLinkManager } from "../DiagnosticLinkManager";
import { SectorResponsesDetail } from "../SectorResponsesDetail";
import { SectorSelectionDashboard } from "./SectorSelectionDashboard";
import { SectorSelectionResponsesView } from "./SectorSelectionResponsesView";

interface SectorSelectionMonitoringProps {
  diagnosticTitle: string;
  onNavigateBack: () => void;
}

export function SectorSelectionMonitoring({ diagnosticTitle, onNavigateBack }: SectorSelectionMonitoringProps) {
  const [showForm, setShowForm] = useState(false);
  const [showLinkManager, setShowLinkManager] = useState(false);
  const [selectedSectorDetails, setSelectedSectorDetails] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"config" | "dashboard" | "responses">("config");

  const handleViewDashboard = () => {
    setCurrentView("dashboard");
  };

  const handleViewResponses = () => {
    setCurrentView("responses");
  };

  const handleBackToConfig = () => {
    setCurrentView("config");
  };

  if (showForm) {
    return (
      <SectorSelectionForm 
        onNavigateBack={() => setShowForm(false)}
      />
    );
  }

  if (showLinkManager) {
    return (
      <DiagnosticLinkManager
        diagnosticId="selecao-setores"
        diagnosticTitle={diagnosticTitle}
        onNavigateBack={() => setShowLinkManager(false)}
      />
    );
  }

  if (selectedSectorDetails) {
    return (
      <SectorResponsesDetail
        sectorName={selectedSectorDetails}
        onNavigateBack={() => setSelectedSectorDetails(null)}
      />
    );
  }

  if (currentView === "dashboard") {
    return <SectorSelectionDashboard onNavigateBack={handleBackToConfig} onViewResponses={handleViewResponses} />;
  }

  if (currentView === "responses") {
    return <SectorSelectionResponsesView onNavigateBack={() => setCurrentView("dashboard")} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Padronizado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onNavigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Diagnósticos
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{diagnosticTitle}</h1>
              <p className="text-muted-foreground">Configuração e aplicação do diagnóstico de seleção de setores</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleViewDashboard}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Ver Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={handleViewResponses}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver Respostas
          </Button>
        </div>
      </div>

      {/* Ações Principais Padronizadas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações do Diagnóstico</CardTitle>
          <CardDescription>
            Aplique o diagnóstico ou gerencie links públicos para coleta de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Aplicar Diagnóstico
            </Button>
            <Button variant="outline" onClick={() => setShowLinkManager(true)} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Gerenciar Links Públicos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre o Diagnóstico */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre este Diagnóstico</CardTitle>
          <CardDescription>
            Informações e configurações para o diagnóstico de seleção de setores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objetivo</p>
                <p className="font-medium">Identificar setores críticos para intervenção arquivística</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Perguntas</p>
                <p className="font-medium">8 perguntas sobre gestão documental</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempo Estimado</p>
                <p className="font-medium">10-15 minutos por setor</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
          <CardDescription>
            Passos para aplicar e monitorar o diagnóstico de seleção de setores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium">Aplicar Diagnóstico</h4>
                <p className="text-sm text-muted-foreground">
                  Use o botão "Aplicar Diagnóstico" para coletar dados diretamente ou gere links públicos para que os setores respondam autonomamente.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium">Monitorar Respostas</h4>
                <p className="text-sm text-muted-foreground">
                  Acompanhe o progresso das respostas no dashboard e veja análises detalhadas de criticidade arquivística.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium">Analisar Resultados</h4>
                <p className="text-sm text-muted-foreground">
                  Visualize relatórios com classificação de criticidade e tome decisões baseadas em dados para intervenções arquivísticas.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
