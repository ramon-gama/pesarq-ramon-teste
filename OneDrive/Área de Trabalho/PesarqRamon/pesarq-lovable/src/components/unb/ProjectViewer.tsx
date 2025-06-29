import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Calendar, DollarSign, Users, Target, FileText, X } from "lucide-react";
import { type Project } from "@/hooks/useProjects";
import { useOrganizations } from "@/hooks/useOrganizations";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProjectViewerProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function ProjectViewer({ isOpen, onClose, project }: ProjectViewerProps) {
  const { organizations } = useOrganizations();

  if (!project) return null;

  console.log('ProjectViewer: Project data', project);
  console.log('ProjectViewer: Project goals', project.goals);

  const getStatusColor = (status: string) => {
    const colors = {
      'planejamento': 'bg-purple-100 text-purple-800',
      'andamento': 'bg-green-100 text-green-800',
      'finalizado': 'bg-gray-100 text-gray-800',
      'suspenso': 'bg-yellow-100 text-yellow-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'planejamento': 'Planejamento',
      'andamento': 'Em Andamento',
      'finalizado': 'Finalizado',
      'suspenso': 'Suspenso',
      'cancelado': 'Cancelado'
    };
    return labels[status] || status;
  };

  const getOrganizationName = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    return org?.name || 'Organização não encontrada';
  };

  const normalizeUrl = (url: string) => {
    if (!url) return '';
    if ((url.includes('drive.google.com') || url.includes('docs.google.com')) && !url.startsWith('http')) {
      return 'https://' + url;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://') && url.includes('.')) {
      return 'https://' + url;
    }
    return url;
  };

  // Buscar metas do projeto
  const projectGoals = project.goals || [];
  console.log('ProjectViewer: Displaying goals', projectGoals);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <DialogTitle className="text-xl truncate">{project.title}</DialogTitle>
              <Badge className={getStatusColor(project.status)}>
                {getStatusLabel(project.status)}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Organização:</span>
                  <p className="text-gray-800">{getOrganizationName(project.organization_id)}</p>
                </div>
                {project.project_type && (
                  <div>
                    <span className="font-medium text-gray-600">Tipo de Projeto:</span>
                    <p className="text-gray-800">{project.project_type}</p>
                  </div>
                )}
                {project.legal_instrument && (
                  <div>
                    <span className="font-medium text-gray-600">Instrumento Jurídico:</span>
                    <p className="text-gray-800">{project.legal_instrument}</p>
                  </div>
                )}
                {project.instrument_number && (
                  <div>
                    <span className="font-medium text-gray-600">Número do Instrumento:</span>
                    <p className="text-gray-800">{project.instrument_number}</p>
                  </div>
                )}
              </div>
              
              {project.object && (
                <div>
                  <span className="font-medium text-gray-600">Objeto:</span>
                  <p className="text-gray-800 mt-1">{project.object}</p>
                </div>
              )}

              {project.external_link && (
                <div>
                  <span className="font-medium text-gray-600">Documento do Projeto:</span>
                  <div className="mt-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(normalizeUrl(project.external_link!), '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir documento
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cronograma e Valores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cronograma e Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Data de Início:</span>
                  <p className="text-gray-800">
                    {format(new Date(project.start_date), "PPP", { locale: ptBR })}
                  </p>
                </div>
                {project.end_date && (
                  <div>
                    <span className="font-medium text-gray-600">Data de Término:</span>
                    <p className="text-gray-800">
                      {format(new Date(project.end_date), "PPP", { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>
              {project.total_value && (
                <div>
                  <span className="font-medium text-gray-600">Valor Total:</span>
                  <p className="text-gray-800">
                    R$ {project.total_value.toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recursos e Equipe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recursos e Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{project.researchers_count || 0}</div>
                  <div className="text-sm text-gray-600">Pesquisadores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{project.documents_meters || 0}</div>
                  <div className="text-sm text-gray-600">Docs. (metros)</div>
                </div>
              </div>

              {project.responsibles && project.responsibles.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-gray-600">Responsáveis:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.responsibles.map((responsible, index) => (
                      <Badge key={index} variant="secondary">
                        {responsible}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metas */}
          {projectGoals && projectGoals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Metas do Projeto ({projectGoals.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectGoals.map((goal, index) => (
                  <div key={goal.id || index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{goal.number} - {goal.description}</h4>
                      {goal.value && goal.value > 0 && (
                        <span className="text-sm font-medium text-green-600">
                          R$ {goal.value.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      {goal.start_date && (
                        <div>
                          <span className="font-medium">Início:</span> {format(new Date(goal.start_date), "PPP", { locale: ptBR })}
                        </div>
                      )}
                      {goal.end_date && (
                        <div>
                          <span className="font-medium">Término:</span> {format(new Date(goal.end_date), "PPP", { locale: ptBR })}
                        </div>
                      )}
                    </div>

                    {goal.progress !== undefined && (
                      <div className="mt-2">
                        <span className="font-medium text-gray-600">Progresso:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{goal.progress}%</span>
                        </div>
                      </div>
                    )}

                    {goal.products && goal.products.length > 0 && (
                      <div className="mt-2">
                        <span className="font-medium text-gray-600">Produtos:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {goal.products.map((product, pIndex) => (
                            <Badge key={pIndex} variant="outline" className="text-xs">
                              {typeof product === 'string' ? product : (product as any)?.name || 'Produto'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {goal.responsibles && goal.responsibles.length > 0 && (
                      <div className="mt-2">
                        <span className="font-medium text-gray-600">Responsáveis:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {goal.responsibles.map((responsible, rIndex) => (
                            <Badge key={rIndex} variant="outline" className="text-xs">
                              {typeof responsible === 'string' ? responsible : (responsible as any)?.name || 'Responsável'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(!projectGoals || projectGoals.length === 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Metas do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma meta cadastrada para este projeto.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
