
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, FileText, Settings, Eye, Edit, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { ClassificationEditor } from "./ClassificationEditor";
import { ClassificationViewer } from "./ClassificationViewer";
import { ApprovalWorkflow } from "./ApprovalWorkflow";
import { SuggestionsManager } from "./SuggestionsManager";
import { VersionHistory } from "./VersionHistory";

interface ClassificationCodeProps {
  onBack: () => void;
}

export function ClassificationCode({ onBack }: ClassificationCodeProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentVersion, setCurrentVersion] = useState({
    id: "1",
    version: "2.1",
    status: "em_elaboracao", // draft, em_aprovacao, aprovado, publicado
    createdAt: "2024-01-15",
    lastModified: "2024-03-15",
    nextReview: "2026-03-15",
    totalUnits: 127,
    pendingApprovals: 5,
    suggestions: 12
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      em_elaboracao: { label: "Em Elaboração", variant: "outline" as const, color: "text-blue-600" },
      em_aprovacao: { label: "Em Aprovação", variant: "secondary" as const, color: "text-amber-600" },
      aprovado: { label: "Aprovado", variant: "default" as const, color: "text-green-600" },
      publicado: { label: "Publicado", variant: "default" as const, color: "text-green-700" }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.em_elaboracao;
  };

  const statusInfo = getStatusBadge(currentVersion.status);

  const isNearReview = () => {
    const reviewDate = new Date(currentVersion.nextReview);
    const today = new Date();
    const monthsUntilReview = (reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsUntilReview <= 6;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Código de Classificação de Documentos
            </h1>
            <Badge variant={statusInfo.variant} className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>
          <p className="text-slate-600">
            Versão {currentVersion.version} • Última atualização: {new Date(currentVersion.lastModified).toLocaleDateString()}
          </p>
          {isNearReview() && (
            <div className="flex items-center gap-2 mt-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Revisão programada para {new Date(currentVersion.nextReview).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <FileText className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Edit className="h-4 w-4" />
            <span>Editor</span>
          </TabsTrigger>
          <TabsTrigger value="viewer" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Eye className="h-4 w-4" />
            <span>Visualizar</span>
          </TabsTrigger>
          <TabsTrigger value="approval" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Aprovação</span>
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Settings className="h-4 w-4" />
            <span>Sugestões</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Clock className="h-4 w-4" />
            <span>Histórico</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total de Unidades</CardTitle>
                <CardDescription>Funções, subfunções, atividades e tarefas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{currentVersion.totalUnits}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pendências</CardTitle>
                <CardDescription>Aprovações em andamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{currentVersion.pendingApprovals}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Sugestões</CardTitle>
                <CardDescription>Melhorias propostas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{currentVersion.suggestions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Próxima Revisão</CardTitle>
                <CardDescription>Programada para</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-slate-700">
                  {new Date(currentVersion.nextReview).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estrutura Hierárquica</CardTitle>
              <CardDescription>Organização do código de classificação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800">Função</div>
                    <div className="text-sm text-blue-600">Nível 1</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">Subfunção</div>
                    <div className="text-sm text-green-600">Nível 2</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-yellow-800">Atividade</div>
                    <div className="text-sm text-yellow-600">Nível 3</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">Tarefa</div>
                    <div className="text-sm text-purple-600">Nível 4</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-800">Subtarefa</div>
                    <div className="text-sm text-gray-600">Nível 5</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor">
          <ClassificationEditor currentVersion={currentVersion} />
        </TabsContent>

        <TabsContent value="viewer">
          <ClassificationViewer currentVersion={currentVersion} />
        </TabsContent>

        <TabsContent value="approval">
          <ApprovalWorkflow currentVersion={currentVersion} />
        </TabsContent>

        <TabsContent value="suggestions">
          <SuggestionsManager currentVersion={currentVersion} />
        </TabsContent>

        <TabsContent value="history">
          <VersionHistory currentVersion={currentVersion} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
