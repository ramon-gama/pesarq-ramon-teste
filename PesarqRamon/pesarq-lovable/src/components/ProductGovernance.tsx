
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, FileText, Settings, Download, Upload, BarChart3 } from "lucide-react";
import { DocumentTypeForm } from "@/components/forms/DocumentTypeForm";
import { DocumentTypeList } from "@/components/forms/DocumentTypeList";
import { DocumentTypeImport } from "@/components/forms/DocumentTypeImport";
import { ClassificationCode } from "@/components/classification/ClassificationCode";
import { TemporalityTable } from "@/components/temporality/TemporalityTable";

interface ProductGovernanceProps {
  productType: string;
  onBack: () => void;
}

// Mock data for original names from organization
const mockOriginalNames = [
  { id: "1", nome: "Ofício Circular", quantidade: 15, usado: 5 },
  { id: "2", nome: "Memorando Interno", quantidade: 23, usado: 12 },
  { id: "3", nome: "Relatório Mensal", quantidade: 8, usado: 3 },
  { id: "4", nome: "Ata de Reunião", quantidade: 12, usado: 7 },
  { id: "5", nome: "Portaria Normativa", quantidade: 6, usado: 2 },
];

const productNames = {
  classification: "Plano de Classificação",
  temporality: "Tabela de Temporalidade",
  procedures: "Manual de Procedimentos",
  arrangement: "Quadro de Arranjo",
  'document-types': "Tipos Documentais",
  'sei-process-types': "Tipos de Processo SEI"
};

export function ProductGovernance({ productType, onBack }: ProductGovernanceProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [processTypes, setProcessTypes] = useState([]);
  const [availableOriginalNames, setAvailableOriginalNames] = useState(mockOriginalNames);

  const productName = productNames[productType as keyof typeof productNames] || "Produto";
  const isDocumentTypes = productType === 'document-types';
  const isProcessTypes = productType === 'sei-process-types';
  const isClassification = productType === 'classification';
  const isTemporality = productType === 'temporality';
  const showTypesManagement = isDocumentTypes || isProcessTypes;

  // Se for Plano de Classificação, renderizar o componente específico
  if (isClassification) {
    return <ClassificationCode onBack={onBack} />;
  }

  // Se for Tabela de Temporalidade, renderizar o componente específico
  if (isTemporality) {
    return <TemporalityTable onBack={onBack} />;
  }

  const handleFormSubmit = (data: any) => {
    if (isDocumentTypes) {
      if (editingItem) {
        setDocumentTypes(prev => prev.map(item => 
          item.id === editingItem.id ? { ...data, id: editingItem.id } : item
        ));
      } else {
        setDocumentTypes(prev => [...prev, { ...data, id: Date.now().toString() }]);
      }
    } else if (isProcessTypes) {
      if (editingItem) {
        setProcessTypes(prev => prev.map(item => 
          item.id === editingItem.id ? { ...data, id: editingItem.id } : item
        ));
      } else {
        setProcessTypes(prev => [...prev, { ...data, id: Date.now().toString() }]);
      }
    }
    
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleImport = (importedData: any[]) => {
    if (isDocumentTypes) {
      const newTypes = importedData.map(item => ({ ...item, id: Date.now().toString() + Math.random() }));
      setDocumentTypes(prev => [...prev, ...newTypes]);
    } else if (isProcessTypes) {
      const newTypes = importedData.map(item => ({ ...item, id: Date.now().toString() + Math.random() }));
      setProcessTypes(prev => [...prev, ...newTypes]);
    }
    setShowImport(false);
  };

  const currentTypes = isDocumentTypes ? documentTypes : processTypes;
  const formType = isDocumentTypes ? 'document' : 'process';

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header com navegação */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {productName}
          </h1>
          <p className="text-slate-600 mt-1">
            Gerencie e configure {productName.toLowerCase()}
          </p>
        </div>
      </div>

      {showTypesManagement ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
              <span className="sm:hidden">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Gerenciar</span>
              <span className="sm:hidden">Gerenciar</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Importar</span>
              <span className="sm:hidden">Importar</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
              <span className="sm:hidden">Exportar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Total Cadastrados</CardTitle>
                  <CardDescription>
                    {isDocumentTypes ? 'Tipos documentais' : 'Tipos de processo'} no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{currentTypes.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Padronizados</CardTitle>
                  <CardDescription>Concluídos e aprovados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {currentTypes.filter(t => t.statusPadronizacao === 'padronizado').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Em Elaboração</CardTitle>
                  <CardDescription>Novos tipos criados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">
                    {currentTypes.filter(t => t.statusPadronizacao === 'novo').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Disponíveis</CardTitle>
                  <CardDescription>Para padronização</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{availableOriginalNames.length}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Padronização</CardTitle>
                <CardDescription>
                  Progresso da padronização dos {isDocumentTypes ? 'tipos documentais' : 'tipos de processo'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Taxa de Padronização</span>
                    <span className="text-sm text-gray-600">
                      {currentTypes.length > 0 
                        ? Math.round((currentTypes.filter(t => t.statusPadronizacao === 'padronizado').length / currentTypes.length) * 100)
                        : 0
                      }%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${currentTypes.length > 0 
                          ? (currentTypes.filter(t => t.statusPadronizacao === 'padronizado').length / currentTypes.length) * 100
                          : 0
                        }%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo {isDocumentTypes ? 'Tipo Documental' : 'Tipo de Processo'}
              </Button>
            </div>

            <DocumentTypeList 
              documentTypes={currentTypes}
              onEdit={handleEdit}
              type={formType}
            />
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Importar {isDocumentTypes ? 'Tipos Documentais' : 'Tipos de Processo'}</CardTitle>
                <CardDescription>
                  Faça upload de uma planilha com os tipos para importação em lote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowImport(true)} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Importar Planilha
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportar {isDocumentTypes ? 'Tipos Documentais' : 'Tipos de Processo'}</CardTitle>
                <CardDescription>
                  Baixe os dados em diferentes formatos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Produto</CardTitle>
            <CardDescription>
              Configure as opções específicas para {productName.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              As configurações específicas para {productName.toLowerCase()} serão implementadas em breve.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modais */}
      {showForm && (
        <DocumentTypeForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSubmit={handleFormSubmit}
          type={formType}
          editData={editingItem}
          isEdit={!!editingItem}
          availableOriginalNames={availableOriginalNames}
          onUpdateOriginalNames={setAvailableOriginalNames}
        />
      )}

      {showImport && (
        <DocumentTypeImport
          isOpen={showImport}
          onClose={() => setShowImport(false)}
          onImport={handleImport}
          type={formType}
        />
      )}
    </div>
  );
}
