
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Grid, List, BarChart3, ArrowLeft } from "lucide-react";
import { useOrganizationUnbProjects, OrganizationUnbProject } from "@/hooks/useOrganizationUnbProjects";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { format } from "date-fns";
import { OrganizationUnbProjectForm } from "./OrganizationUnbProjectForm";
import { OrganizationUnbProjectDetailsDashboard } from "./OrganizationUnbProjectDetailsDashboard";
import { ProjectActions } from "./ProjectActions";

export function ProjectServicesTab() {
  const { projects, loading, deleteProject } = useOrganizationUnbProjects();
  const { currentOrganization } = useOrganizationContext();
  
  // Estados simplificados
  const [editingProject, setEditingProject] = useState<OrganizationUnbProject | null>(null);
  const [selectedProject, setSelectedProject] = useState<OrganizationUnbProject | null>(null);
  const [displayMode, setDisplayMode] = useState<'table' | 'cards'>('table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  console.log('🔍 ProjectServicesTab - Estado atual:', {
    projectsCount: projects.length,
    currentOrganization: currentOrganization?.id,
    loading,
    showDetails,
    selectedProject: selectedProject?.title
  });

  // Verificação de segurança para evitar erros
  if (!currentOrganization) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="text-center">
          <p className="text-gray-600">Nenhuma organização selecionada.</p>
        </div>
      </div>
    );
  }

  // Projetos filtrados
  const activeProjects = projects.filter(project => 
    project.organization_id === currentOrganization?.id && 
    project.status !== 'cancelado'
  );

  console.log('📊 Projetos ativos encontrados:', activeProjects.length);

  // Handlers diretos e simples
  const handleCreateNew = () => {
    console.log('➕ Criando novo projeto');
    setEditingProject(null);
    setSelectedProject(null);
    setShowDetails(false);
    setIsFormOpen(true);
  };

  const handleEdit = (project: OrganizationUnbProject) => {
    console.log('✏️ Editando projeto:', project.title);
    setEditingProject(project);
    setSelectedProject(null);
    setShowDetails(false);
    setIsFormOpen(true);
  };

  const handleView = (project: OrganizationUnbProject) => {
    console.log('👁️ Visualizando projeto:', project.title);
    setSelectedProject(project);
    setEditingProject(null);
    setShowDetails(true);
  };

  const handleViewDetails = (project: OrganizationUnbProject) => {
    console.log('📊 Dashboard do projeto:', project.title);
    setSelectedProject(project);
    setEditingProject(null);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    console.log('⬅️ Voltando para lista');
    setShowDetails(false);
    setEditingProject(null);
    setSelectedProject(null);
  };

  const handleCloseForm = () => {
    console.log('❌ Fechando formulário');
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleDelete = async (project: OrganizationUnbProject) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      console.log('🗑️ Excluindo projeto:', project.title);
      await deleteProject(project.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'planejamento': { label: 'Planejamento', variant: 'secondary' as const },
      'andamento': { label: 'Em Andamento', variant: 'default' as const },
      'finalizado': { label: 'Finalizado', variant: 'secondary' as const },
      'suspenso': { label: 'Suspenso', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planejamento;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const calculateProgress = (project: OrganizationUnbProject) => {
    if (project.goals && project.goals.length > 0) {
      const totalProgress = project.goals.reduce((sum, goal) => sum + goal.progress, 0);
      return Math.round(totalProgress / project.goals.length);
    }
    return project.progress || 0;
  };

  if (loading) {
    console.log('⏳ Carregando projetos...');
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  // Renderizar dashboard de detalhes
  if (showDetails && selectedProject) {
    console.log('📊 Renderizando dashboard de detalhes para:', selectedProject.title);
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToList}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à Lista
          </Button>
        </div>
        <OrganizationUnbProjectDetailsDashboard
          project={selectedProject}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  console.log('📋 Renderizando lista de projetos');
  
  // Renderizar lista (view padrão)
  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Projetos UnB</h2>
          <p className="text-gray-600">
            Gerencie os projetos celebrados com a Universidade de Brasília
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg p-1">
            <Button
              variant={displayMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDisplayMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={displayMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDisplayMode('cards')}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      {activeProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum projeto cadastrado
            </h3>
            <p className="text-gray-500 mb-4">
              Comece cadastrando seu primeiro projeto da UnB.
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Projeto
            </Button>
          </CardContent>
        </Card>
      ) : displayMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeProjects.map((project) => {
                  const progress = calculateProgress(project);
                  
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="font-medium">{project.title}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(project.status)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {format(new Date(project.start_date), "dd/MM/yyyy")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ProjectActions
                          project={project}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProjects.map((project) => {
            const progress = calculateProgress(project);
            
            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold line-clamp-1">{project.title}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progresso</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(project)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <ProjectActions
                      project={project}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal do formulário */}
      <OrganizationUnbProjectForm
        project={editingProject}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
}
