import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Archive,
  ExternalLink,
  FileCheck,
  Trash2,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  X,
  Clock,
  RefreshCw
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useOrganizations } from "@/hooks/useOrganizations";
import { ProjectForm } from "./ProjectForm";
import { ProjectViewer } from "./ProjectViewer";
import { ProjectAmendmentsModal } from "./ProjectAmendmentsModal";
import { OrganizationUnbProjectForm } from "../OrganizationUnbProjectForm";
import { useOrganizationUnbProjects } from "@/hooks/useOrganizationUnbProjects";

export function ProjectsRegistry() {
  const { projects: unbProjects, loading: unbLoading, deleteProject: deleteUnbProject, refreshProjects: refetchUnb } = useOrganizationUnbProjects();
  const { organizations } = useOrganizations();
  
  // Estados para o formulário UnB
  const [isUnbFormOpen, setIsUnbFormOpen] = useState(false);
  const [editingUnbProject, setEditingUnbProject] = useState(null);
  
  // Estados para outros formulários (manter existentes)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [amendmentsProject, setAmendmentsProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Usar os projetos UnB como principal
  const projects = unbProjects;
  const loading = unbLoading;
  const deleteProject = deleteUnbProject;
  const refetch = refetchUnb;

  console.log('ProjectsRegistry: Current projects count:', projects.length);
  console.log('ProjectsRegistry: Loading state:', loading);

  // Calcular estatísticas dos projetos de forma mais robusta
  const projectStats = React.useMemo(() => {
    console.log('Calculating project stats for projects:', projects);
    const stats = {
      total: projects.length,
      planejamento: projects.filter(p => p.status === 'planejamento').length,
      andamento: projects.filter(p => p.status === 'andamento').length,
      finalizado: projects.filter(p => p.status === 'finalizado').length,
      suspenso: projects.filter(p => p.status === 'suspenso').length,
      cancelado: projects.filter(p => p.status === 'cancelado').length
    };
    console.log('Calculated stats:', stats);
    return stats;
  }, [projects]);

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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getOrganizationName(project.organization_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesOrg = organizationFilter === "all" || project.organization_id === organizationFilter;
    return matchesSearch && matchesStatus && matchesOrg;
  });

  const handleEdit = (project: any) => {
    console.log('Opening edit form for UnB project:', project);
    setEditingUnbProject(project);
    setIsUnbFormOpen(true);
  };

  const handleView = (project: any) => {
    console.log('Opening view mode for project:', project);
    setViewingProject(project);
  };

  const handleCloseUnbForm = () => {
    console.log('Closing UnB form');
    setIsUnbFormOpen(false);
    setEditingUnbProject(null);
  };

  const handleCloseForm = () => {
    console.log('Closing form');
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleCloseViewer = () => {
    console.log('Closing viewer');
    setViewingProject(null);
  };

  const handleAmendments = (project: any) => {
    setAmendmentsProject(project);
  };

  const handleDeleteClick = (project: any) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteProject(projectToDelete.id);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      alert('Erro ao excluir projeto');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Erro ao atualizar projetos:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Carregando projetos...</div>;
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Registro de Projetos</h2>
            <p className="text-gray-600">Gerencie todos os projetos cadastrados</p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Atualizar lista de projetos</p>
              </TooltipContent>
            </Tooltip>
            <Button onClick={() => setIsUnbFormOpen(true)} className="bg-[#15AB92] hover:bg-[#0d8f7a]">
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStats.total}</div>
              <p className="text-xs text-muted-foreground">projetos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{projectStats.andamento}</div>
              <p className="text-xs text-muted-foreground">projetos ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{projectStats.finalizado}</div>
              <p className="text-xs text-muted-foreground">concluídos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspensos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{projectStats.suspenso}</div>
              <p className="text-xs text-muted-foreground">temporariamente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
              <X className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{projectStats.cancelado}</div>
              <p className="text-xs text-muted-foreground">encerrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planejamento</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{projectStats.planejamento}</div>
              <p className="text-xs text-muted-foreground">em preparação</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="andamento">Em Andamento</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
              <SelectItem value="suspenso">Suspenso</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Organização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Organizações</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabela de Projetos */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Organização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Término</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.title}</div>
                        {project.project_type && (
                          <div className="text-sm text-gray-500">{project.project_type}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getOrganizationName(project.organization_id)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(project.start_date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {project.end_date ? new Date(project.end_date).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleView(project)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Visualizar projeto</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar projeto</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleAmendments(project)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Gerenciar aditivos</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteClick(project)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir projeto</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Archive className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum projeto encontrado</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" || organizationFilter !== "all"
                  ? "Ajuste os filtros para ver mais resultados"
                  : "Comece criando um novo projeto"
                }
              </p>
              <Button onClick={() => setIsUnbFormOpen(true)} className="bg-[#15AB92] hover:bg-[#0d8f7a]">
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Projeto UnB */}
        <OrganizationUnbProjectForm
          project={editingUnbProject}
          isOpen={isUnbFormOpen}
          onClose={handleCloseUnbForm}
        />

        {/* Outros modais existentes */}
        <ProjectForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          project={editingProject}
          isViewMode={false}
        />

        <ProjectViewer
          isOpen={!!viewingProject}
          onClose={handleCloseViewer}
          project={viewingProject}
        />

        {amendmentsProject && (
          <ProjectAmendmentsModal
            project={amendmentsProject}
            isOpen={!!amendmentsProject}
            onClose={() => setAmendmentsProject(null)}
          />
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o projeto "{projectToDelete?.title}"?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
