
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Download, Printer, Search, Filter, Eye, FileCheck } from "lucide-react";

interface ClassificationViewerProps {
  currentVersion: any;
}

export function ClassificationViewer({ currentVersion }: ClassificationViewerProps) {
  const [viewMode, setViewMode] = useState("hierarchical");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDocumentTypes, setShowDocumentTypes] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  // Mock data dos tipos documentais e de processo associados a cada unidade
  const documentTypesAssociation = {
    "011": [
      { id: "1", nome: "Ato Normativo", tipo: "documento" },
      { id: "2", nome: "Portaria", tipo: "documento" },
      { id: "3", nome: "Resolução", tipo: "documento" },
      { id: "4", nome: "Processo de Normatização", tipo: "processo" },
      { id: "5", nome: "Processo de Regulamentação", tipo: "processo" }
    ],
    "012": [
      { id: "6", nome: "Relatório de Gestão", tipo: "documento" },
      { id: "7", nome: "Relatório Anual", tipo: "documento" },
      { id: "8", nome: "Processo de Prestação de Contas", tipo: "processo" },
      { id: "9", nome: "Processo de Relatório Institucional", tipo: "processo" }
    ]
  };

  const mockData = [
    {
      code: "000",
      type: "funcao",
      title: "ADMINISTRAÇÃO GERAL",
      description: "Função relacionada às atividades de planejamento, organização, coordenação e controle necessárias ao funcionamento dos órgãos e entidades.",
      level: 1,
      children: [
        {
          code: "010",
          type: "subfuncao", 
          title: "ORGANIZAÇÃO E FUNCIONAMENTO",
          description: "Subfunção relativa à criação, extinção, denominação, alteração, funcionamento e localização da instituição.",
          level: 2,
          children: [
            {
              code: "011",
              type: "atividade",
              title: "Normatização. Regulamentação.",
              description: "Incluem-se documentos referentes à criação e alteração de normas, diretrizes, procedimentos, etc.",
              level: 3
            },
            {
              code: "012",
              type: "atividade",
              title: "Relatórios Institucionais.",
              description: "Incluem-se relatórios de gestão, anuais e de atividades da instituição.",
              level: 3
            }
          ]
        }
      ]
    }
  ];

  const isLastLevel = (unit: any) => {
    return !unit.children || unit.children.length === 0;
  };

  const getDocumentTypesCount = (code: string) => {
    return documentTypesAssociation[code]?.length || 0;
  };

  const getDocumentTypes = (code: string) => {
    return documentTypesAssociation[code] || [];
  };

  const handleViewDocumentTypes = (unit: any) => {
    setSelectedUnit(unit);
    setShowDocumentTypes(true);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      funcao: "bg-blue-100 text-blue-800",
      subfuncao: "bg-green-100 text-green-800", 
      atividade: "bg-yellow-100 text-yellow-800",
      tarefa: "bg-purple-100 text-purple-800",
      subtarefa: "bg-gray-100 text-gray-800"
    };
    return colors[type as keyof typeof colors] || colors.funcao;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      funcao: "Função",
      subfuncao: "Subfunção",
      atividade: "Atividade", 
      tarefa: "Tarefa",
      subtarefa: "Subtarefa"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const renderHierarchicalView = () => {
    const renderUnit = (unit: any, level = 0) => {
      const indentClass = level > 0 ? `ml-${level * 4}` : '';
      const isLast = isLastLevel(unit);
      const documentCount = isLast ? getDocumentTypesCount(unit.code) : 0;
      
      return (
        <div key={unit.code} className="mb-4">
          <div className={`p-4 border rounded-lg ${indentClass}`}>
            <div className="flex items-start gap-3 mb-2">
              <Badge variant="outline" className="font-mono">
                {unit.code}
              </Badge>
              <Badge className={getTypeColor(unit.type)}>
                {getTypeLabel(unit.type)}
              </Badge>
              <h3 className="font-semibold flex-1">{unit.title}</h3>
              
              {isLast && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {documentCount} {documentCount === 1 ? 'tipo' : 'tipos'}
                  </Badge>
                  {documentCount > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDocumentTypes(unit)}
                      className="h-7 px-2"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {unit.description && (
              <p className="text-gray-600 text-sm mt-2">{unit.description}</p>
            )}
          </div>
          
          {unit.children && unit.children.map((child: any) => renderUnit(child, level + 1))}
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {mockData.map(unit => renderUnit(unit))}
      </div>
    );
  };

  const renderTableView = () => {
    const flattenUnits = (units: any[], result: any[] = []) => {
      units.forEach(unit => {
        result.push(unit);
        if (unit.children) {
          flattenUnits(unit.children, result);
        }
      });
      return result;
    };

    const allUnits = flattenUnits(mockData);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Código</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Tipo</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Título</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Descrição</th>
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Tipos Documentais</th>
            </tr>
          </thead>
          <tbody>
            {allUnits.map(unit => {
              const isLast = isLastLevel(unit);
              const documentCount = isLast ? getDocumentTypesCount(unit.code) : 0;
              
              return (
                <tr key={unit.code} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-mono">{unit.code}</td>
                  <td className="border border-gray-200 px-4 py-3">
                    <Badge className={getTypeColor(unit.type)}>
                      {getTypeLabel(unit.type)}
                    </Badge>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 font-medium">{unit.title}</td>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{unit.description}</td>
                  <td className="border border-gray-200 px-4 py-3">
                    {isLast && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {documentCount}
                        </Badge>
                        {documentCount > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDocumentTypes(unit)}
                            className="h-7 px-2"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Visualização do Código</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Versão {currentVersion.version} - Visualização completa
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por código, título ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>

            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList>
                <TabsTrigger value="hierarchical">Visão Hierárquica</TabsTrigger>
                <TabsTrigger value="table">Visão em Tabela</TabsTrigger>
              </TabsList>

              <TabsContent value="hierarchical" className="mt-6">
                {renderHierarchicalView()}
              </TabsContent>

              <TabsContent value="table" className="mt-6">
                {renderTableView()}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Modal para visualizar tipos documentais e de processo */}
      <Dialog open={showDocumentTypes} onOpenChange={setShowDocumentTypes}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Tipos Documentais e de Processo - {selectedUnit?.code} {selectedUnit?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Tipos documentais e de processo associados a esta unidade de classificação:
            </p>
            <div className="space-y-2">
              {selectedUnit && getDocumentTypes(selectedUnit.code).map((docType: any) => (
                <div key={docType.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {docType.tipo === 'processo' ? (
                      <FileCheck className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="font-medium">{docType.nome}</span>
                  </div>
                  <Badge variant={docType.tipo === 'processo' ? 'default' : 'outline'}>
                    {docType.tipo === 'documento' ? 'Documento' : 'Processo SEI'}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button 
                variant="outline"
                onClick={() => setShowDocumentTypes(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
