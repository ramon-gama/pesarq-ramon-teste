
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MaturityAdmin } from "@/components/admin/MaturityAdmin";
import { OrganizationalAdmin } from "@/components/admin/OrganizationalAdmin";
import { UsersAdmin } from "@/components/admin/UsersAdmin";
import { DiagnosticsAdmin } from "@/components/admin/DiagnosticsAdmin";
import { DocumentAdmin } from "@/components/admin/DocumentAdmin";
import { PlanningAdmin } from "@/components/admin/PlanningAdmin";
import { ConnectionsAdmin } from "@/components/admin/ConnectionsAdmin";
import { UnbProjectsAdmin } from "@/components/admin/UnbProjectsAdmin";
import { SystemSettingsAdmin } from "@/components/admin/SystemSettingsAdmin";
import { 
  Shield, 
  Target, 
  Users, 
  Building2, 
  ClipboardList,
  FileText, 
  BarChart3,
  MessageSquare,
  GraduationCap,
  Settings
} from "lucide-react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("maturity");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              Gerencie todas as funcionalidades e configurações do sistema
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-9 min-w-[800px]">
              <TabsTrigger value="maturity" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Maturidade
              </TabsTrigger>
              <TabsTrigger value="organizations" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organizações
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="diagnostics" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Diagnósticos
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Planejamento
              </TabsTrigger>
              <TabsTrigger value="connections" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conexões
              </TabsTrigger>
              <TabsTrigger value="unb-projects" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Projetos UnB
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="maturity" className="space-y-4">
            <MaturityAdmin />
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            <OrganizationalAdmin />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersAdmin />
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-4">
            <DiagnosticsAdmin />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <DocumentAdmin />
          </TabsContent>

          <TabsContent value="planning" className="space-y-4">
            <PlanningAdmin />
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <ConnectionsAdmin />
          </TabsContent>

          <TabsContent value="unb-projects" className="space-y-4">
            <UnbProjectsAdmin />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SystemSettingsAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
