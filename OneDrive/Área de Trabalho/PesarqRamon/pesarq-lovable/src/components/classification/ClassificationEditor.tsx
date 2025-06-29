
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Move, Save, FileText, Eye, FileCheck } from "lucide-react";
import { ClassificationUnitForm } from "./ClassificationUnitForm";

interface ClassificationUnit {
  id: string;
  code: string;
  type: "funcao" | "subfuncao" | "atividade" | "tarefa" | "subtarefa";
  title: string;
  description?: string;
  status: "ativo" | "inativo" | "pendente";
  children?: ClassificationUnit[];
  level: number;
  parentId?: string;
}

interface ClassificationEditorProps {
  currentVersion: any;
}

export function ClassificationEditor({ currentVersion }: ClassificationEditorProps) {
  const [units, setUnits] = useState<ClassificationUnit[]>([
    {
      id: "1",
      code: "000",
      type: "funcao",
      title: "ADMINISTRAÇÃO GERAL",
      description: "Função relacionada às atividades de planejamento, organização, coordenação e controle",
      status: "ativo",
      level: 1,
      children: [
        {
          id: "2",
          code: "010",
          type: "subfuncao",
          title: "ORGANIZAÇÃO E FUNCIONAMENTO",
          status: "ativo",
          level: 2,
          parentId: "1",
          children: [
            {
              id: "3",
              code: "011",
              type: "atividade",
              title: "Normatização. Regulamentação.",
              status: "ativo",
              level: 3,
              parentId: "2"
            }
          ]
        }
      ]
    }
  ]);

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1", "2"]));
  const [selectedUnit, setSelectedUnit] = useState<ClassificationUnit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<ClassificationUnit | null>(null);
  
  const [showDocumentTypes, setShowDocumentTypes] = useState(false);
  

  // Mock data dos tipos documentais e de processo associados
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

  const isLastLevel = (unit: ClassificationUnit) => {
    return !unit.children || unit.children.length === 0;
  };

  const getDocumentTypesCount = (code: string) => {
    return documentTypesAssociation[code]?.length || 0;
  };

  const getDocumentTypes = (code: string) => {
    return documentTypesAssociation[code] || [];
  };

  const handleViewDocumentTypes = (unit: ClassificationUnit) => {
    setSelectedUnit(unit);
    setShowDocumentTypes(true);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
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

  const renderUnit = (unit: ClassificationUnit) => {
    const hasChildren = unit.children && unit.children.length > 0;
    const isExpanded = expandedNodes.has(unit.id);
    const indentLevel = unit.level - 1;
    const isLast = isLastLevel(unit);
    const documentCount = isLast ? getDocumentTypesCount(unit.code) : 0;

    return (
      <div key={unit.id} className="mb-2">
        <div 
          className={`flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 ${
            selectedUnit?.id === unit.id ? 'bg-blue-50 border-blue-200' : ''
          }`}
          style={{ marginLeft: `${indentLevel * 24}px` }}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(unit.id)}
              className="p-0 h-6 w-6"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          ) : (
            <div className="w-6" />
          )}

          <Badge className={`text-xs ${getTypeColor(unit.type)}`}>
            {getTypeLabel(unit.type)}
          </Badge>

          <span className="font-mono text-sm font-medium text-gray-600">{unit.code}</span>
          
          <span className="flex-1 font-medium">{unit.title}</span>

          {isLast && (
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <FileText className="h-3 w-3" />
                {documentCount}
              </Badge>
              {documentCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDocumentTypes(unit)}
                  className="h-6 w-6 p-0"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          <Badge variant={unit.status === 'ativo' ? 'default' : 'secondary'} className="text-xs">
            {unit.status}
          </Badge>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingUnit(unit);
                setShowForm(true);
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUnit(unit)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4">
            {unit.children?.map(child => renderUnit(child))}
          </div>
        )}
      </div>
    );
  };

  const handleSaveUnit = (unitData: any) => {
    console.log('Salvando unidade:', unitData);
    setShowForm(false);
    setEditingUnit(null);
    setSelectedUnit(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Editor Hierárquico</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Gerencie a estrutura do código de classificação
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Função
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <Input 
                placeholder="Buscar por código ou título..." 
                className="flex-1"
              />
              <Button variant="outline" size="sm">
                Filtrar
              </Button>
            </div>

            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
              {units.map(unit => renderUnit(unit))}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Total: {units.length} unidades principais</span>
              <span>Última modificação: há 2 horas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <ClassificationUnitForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingUnit(null);
            setSelectedUnit(null);
          }}
          onSave={handleSaveUnit}
          editingUnit={editingUnit}
          parentUnit={selectedUnit}
        />
      )}

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
