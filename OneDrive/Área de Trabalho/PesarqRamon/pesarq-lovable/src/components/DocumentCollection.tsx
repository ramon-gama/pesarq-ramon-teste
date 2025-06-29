
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Archive, 
  Plus, 
  FileText, 
  BarChart3,
  Search,
  Filter,
  Download,
  Trash2,
  Shield,
  MapPin,
  Calendar
} from "lucide-react";
import { DocumentForm } from "@/components/collection/DocumentForm";
import { DocumentsList } from "@/components/collection/DocumentsList";
import { CollectionReports } from "@/components/collection/CollectionReports";
import { CollectionDashboard } from "@/components/collection/CollectionDashboard";
import { EliminationLists } from "@/components/collection/EliminationLists";
import { BoxMirrors } from "@/components/collection/BoxMirrors";

export function DocumentCollection() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-none px-6 pt-6 pb-4">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              Acervo Documental
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base leading-relaxed">
              Gerencie e organize documentos, relatórios e processos de eliminação
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6">
        {/* Navegação por Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-muted rounded-md gap-1">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex flex-col items-center gap-0.5 px-1 py-2 text-xs h-auto min-h-[3rem] data-[state=active]:bg-background"
                >
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-[9px] sm:text-xs leading-tight text-center">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="flex flex-col items-center gap-0.5 px-1 py-2 text-xs h-auto min-h-[3rem] data-[state=active]:bg-background"
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-[9px] sm:text-xs leading-tight text-center">Documentos</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="flex flex-col items-center gap-0.5 px-1 py-2 text-xs h-auto min-h-[3rem] data-[state=active]:bg-background"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-[9px] sm:text-xs leading-tight text-center">Cadastrar</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="reports" 
                  className="flex flex-col items-center gap-0.5 px-1 py-2 text-xs h-auto min-h-[3rem] data-[state=active]:bg-background"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-[9px] sm:text-xs leading-tight text-center">Relatórios</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="elimination" 
                  className="flex flex-col items-center gap-0.5 px-1 py-2 text-xs h-auto min-h-[3rem] data-[state=active]:bg-background"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-[9px] sm:text-xs leading-tight text-center">Eliminação</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="boxes" 
                  className="flex flex-col items-center gap-0.5 px-1 py-2 text-xs h-auto min-h-[3rem] data-[state=active]:bg-background"
                >
                  <Archive className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-[9px] sm:text-xs leading-tight text-center">Espelhos</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>

          <TabsContent value="dashboard" className="mt-3 sm:mt-6">
            <CollectionDashboard />
          </TabsContent>

          <TabsContent value="documents" className="mt-3 sm:mt-6">
            <DocumentsList />
          </TabsContent>

          <TabsContent value="reports" className="mt-3 sm:mt-6">
            <CollectionReports />
          </TabsContent>

          <TabsContent value="elimination" className="mt-3 sm:mt-6">
            <EliminationLists />
          </TabsContent>

          <TabsContent value="boxes" className="mt-3 sm:mt-6">
            <BoxMirrors />
          </TabsContent>

          <TabsContent value="register" className="mt-3 sm:mt-6">
            <DocumentForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
