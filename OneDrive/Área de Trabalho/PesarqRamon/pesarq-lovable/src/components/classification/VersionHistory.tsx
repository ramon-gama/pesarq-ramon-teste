
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Download, Eye, GitBranch, Clock, User } from "lucide-react";

interface VersionHistoryProps {
  currentVersion: any;
}

export function VersionHistory({ currentVersion }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState(null);

  const versions = [
    {
      id: "v2.1",
      version: "2.1",
      status: "current",
      createdAt: "2024-03-15",
      createdBy: "Maria Santos",
      description: "Inclusão de novas atividades de gestão digital e atualização de códigos obsoletos",
      changes: [
        { type: "added", description: "Nova função 100 - GESTÃO DIGITAL" },
        { type: "modified", description: "Atualizada descrição da função 000" },
        { type: "removed", description: "Removida atividade 015 - Protocolo manual" }
      ],
      unitsCount: 127,
      approvalDate: "2024-03-20"
    },
    {
      id: "v2.0", 
      version: "2.0",
      status: "published",
      createdAt: "2024-01-15",
      createdBy: "João Silva",
      description: "Revisão completa da estrutura seguindo novas diretrizes do CONARQ",
      changes: [
        { type: "modified", description: "Reestruturação completa da hierarquia" },
        { type: "added", description: "25 novas atividades" },
        { type: "modified", description: "Padronização de nomenclaturas" }
      ],
      unitsCount: 115,
      approvalDate: "2024-02-01"
    },
    {
      id: "v1.5",
      version: "1.5", 
      status: "archived",
      createdAt: "2023-08-10",
      createdBy: "Ana Costa",
      description: "Correções pontuais e inclusão de códigos para gestão de pessoas",
      changes: [
        { type: "added", description: "Nova subfunção 050 - Gestão de Pessoas" },
        { type: "modified", description: "Corrigidas inconsistências na função 020" }
      ],
      unitsCount: 98,
      approvalDate: "2023-08-25"
    }
  ];

  const changeLog = [
    {
      id: "1",
      timestamp: "2024-03-15 14:30",
      user: "Maria Santos", 
      action: "Criou nova atividade",
      details: "011.1 - Elaboração de normas internas",
      unitCode: "011.1"
    },
    {
      id: "2",
      timestamp: "2024-03-15 14:15",
      user: "Maria Santos",
      action: "Modificou descrição",
      details: "Função 000 - ADMINISTRAÇÃO GERAL",
      unitCode: "000"
    },
    {
      id: "3",
      timestamp: "2024-03-15 14:00",
      user: "João Silva",
      action: "Inativou unidade",
      details: "015 - Protocolo manual (obsoleto)",
      unitCode: "015"
    },
    {
      id: "4",
      timestamp: "2024-03-15 13:45",
      user: "Ana Costa",
      action: "Aprovou alteração",
      details: "Subfunção 010 - ORGANIZAÇÃO E FUNCIONAMENTO",
      unitCode: "010"
    }
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      current: { label: "Atual", variant: "default" as const, className: "bg-blue-100 text-blue-800" },
      published: { label: "Publicada", variant: "default" as const, className: "bg-green-100 text-green-800" },
      archived: { label: "Arquivada", variant: "outline" as const, className: "bg-gray-100 text-gray-600" }
    };
    return configs[status as keyof typeof configs] || configs.archived;
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case "added":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "modified": 
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case "removed":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const getChangeTypeLabel = (type: string) => {
    const labels = {
      added: "Adicionado",
      modified: "Modificado", 
      removed: "Removido"
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="versions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="versions">Versões</TabsTrigger>
          <TabsTrigger value="changelog">Log de Alterações</TabsTrigger>
        </TabsList>

        <TabsContent value="versions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Histórico de Versões
              </CardTitle>
              <p className="text-sm text-gray-600">
                {versions.length} versões disponíveis
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versions.map((version, index) => {
                  const statusConfig = getStatusBadge(version.status);
                  return (
                    <div key={version.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">Versão {version.version}</h3>
                          <Badge variant={statusConfig.variant} className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                          {index === 0 && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <GitBranch className="h-3 w-3 mr-1" />
                              Atual
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            Baixar
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3">{version.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>Criado por: {version.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>Data: {new Date(version.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span>Unidades: {version.unitsCount}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Principais Alterações:</h4>
                        <div className="space-y-1">
                          {version.changes.map((change, changeIndex) => (
                            <div key={changeIndex} className="flex items-center gap-2 text-sm">
                              {getChangeTypeIcon(change.type)}
                              <span className="text-gray-600">
                                <strong>{getChangeTypeLabel(change.type)}:</strong> {change.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changelog">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Log de Alterações
              </CardTitle>
              <p className="text-sm text-gray-600">
                Histórico detalhado de todas as modificações
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {changeLog.map((entry, index) => (
                  <div key={entry.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      {index < changeLog.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{entry.user}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{entry.timestamp}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium">{entry.action}</span>
                        {entry.unitCode && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {entry.unitCode}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
