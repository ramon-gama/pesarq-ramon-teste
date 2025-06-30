
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { FileText, Target, Users, X, TrendingUp } from "lucide-react";
import { useOrganizationUnbProjects, OrganizationUnbProject } from "@/hooks/useOrganizationUnbProjects";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { GoalManagement } from "./GoalManagement";
import { supabase } from "@/integrations/supabase/client";

interface OrganizationUnbProjectFormProps {
  project?: OrganizationUnbProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrganizationUnbProjectForm({ project, isOpen, onClose }: OrganizationUnbProjectFormProps) {
  const { currentOrganization, isAdmin } = useOrganizationContext();
  const { createProject, updateProject, createGoal, updateGoal, deleteGoal, refreshProjects } = useOrganizationUnbProjects();
  
  console.log('🔍 OrganizationUnbProjectForm - Renderizando componente:', {
    hasProject: !!project,
    projectId: project?.id,
    currentOrganization: currentOrganization?.name,
    isAdmin,
    isOpen
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    legal_instrument: '',
    instrument_number: '',
    start_date: '',
    end_date: '',
    total_value: 0,
    status: 'planejamento' as 'planejamento' | 'andamento' | 'finalizado' | 'suspenso' | 'cancelado',
    project_type: '',
    external_link: '',
    progress: 0
  });

  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [newResponsible, setNewResponsible] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preencher dados do projeto para edição
  useEffect(() => {
    console.log('🔄 OrganizationUnbProjectForm - useEffect para preencher dados:', {
      hasProject: !!project,
      projectData: project
    });

    if (project) {
      console.log('📝 Preenchendo formulário com dados do projeto:', project.title);
      
      setFormData({
        title: project.title || '',
        description: project.description || '',
        legal_instrument: project.legal_instrument || '',
        instrument_number: project.instrument_number || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        total_value: project.total_value || 0,
        status: project.status || 'planejamento',
        project_type: project.project_type || '',
        external_link: project.external_link || '',
        progress: project.progress || 0
      });
      
      // Converter responsibles para array de strings
      const projectResponsibles = project.responsibles?.map(r => r.name) || [];
      console.log('👥 Responsáveis do projeto:', projectResponsibles);
      setResponsibles(projectResponsibles);
    } else {
      console.log('🆕 Novo projeto - formulário vazio');
      // Reset form for new project
      setFormData({
        title: '',
        description: '',
        legal_instrument: '',
        instrument_number: '',
        start_date: '',
        end_date: '',
        total_value: 0,
        status: 'planejamento',
        project_type: '',
        external_link: '',
        progress: 0
      });
      setResponsibles([]);
    }
  }, [project]);

  const addResponsible = () => {
    if (newResponsible.trim() && !responsibles.includes(newResponsible.trim())) {
      setResponsibles([...responsibles, newResponsible.trim()]);
      setNewResponsible('');
    }
  };

  const removeResponsible = (index: number) => {
    setResponsibles(responsibles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Iniciando salvamento do projeto...');
    console.log('📋 Dados do formulário:', formData);
    console.log('🏢 Organização atual:', currentOrganization);
    console.log('👑 É admin:', isAdmin);
    console.log('✏️ É edição:', !!project);

    if (!currentOrganization?.id && !isAdmin) {
      console.error('❌ Nenhuma organização selecionada para usuário não-admin');
      alert('Por favor, selecione uma organização antes de criar o projeto.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      console.log('👤 Usuário autenticado:', user.email);

      let targetOrganizationId = currentOrganization?.id;
      
      if (project) {
        targetOrganizationId = project.organization_id;
        console.log('✏️ Editando projeto - mantendo organização original:', targetOrganizationId);
      } else if (!targetOrganizationId) {
        throw new Error('Organização não selecionada para criação do projeto.');
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        legal_instrument: formData.legal_instrument,
        instrument_number: formData.instrument_number,
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_value: formData.total_value,
        status: formData.status,
        project_type: formData.project_type,
        external_link: formData.external_link,
        progress: formData.progress,
        organization_id: targetOrganizationId,
        object: null,
        documents_meters: 0,
        boxes_to_describe: 0,
        boxes_to_digitalize: 0,
        researchers_count: 0
      };

      console.log('📤 Dados que serão enviados:', projectData);

      if (project) {
        console.log('✏️ Atualizando projeto existente:', project.id);
        await updateProject(project.id, projectData);
      } else {
        console.log('➕ Criando novo projeto');
        await createProject(projectData);
      }

      console.log('✅ Projeto salvo com sucesso!');
      onClose();
    } catch (error) {
      console.error('❌ Erro detalhado ao salvar projeto:', {
        error,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint,
        isAdmin,
        currentOrganization: currentOrganization?.id,
        projectData: {
          title: formData.title,
          organization_id: project?.organization_id || currentOrganization?.id
        }
      });
      
      let errorMessage = 'Erro desconhecido';
      
      if (error?.message?.includes('row-level security')) {
        errorMessage = `Erro de permissão: ${error.message}. Tente recarregar a página e fazer login novamente.`;
      } else if (error?.message?.includes('not-null violation')) {
        errorMessage = 'Alguns campos obrigatórios não foram preenchidos corretamente.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      alert(`Erro ao salvar projeto: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGoal = async (goalData: any) => {
    if (!project?.id) {
      console.error('ID do projeto não disponível');
      return;
    }
    
    try {
      console.log('🎯 Criando meta para projeto:', project.id);
      await createGoal(project.id, goalData);
      console.log('✅ Meta criada com sucesso');
      // Forçar refresh dos dados do projeto
      await refreshProjects();
    } catch (error) {
      console.error('❌ Erro ao criar meta:', error);
    }
  };

  const handleUpdateGoal = async (goalId: string, goalData: any) => {
    try {
      console.log('📝 Atualizando meta:', goalId);
      await updateGoal(goalId, goalData);
      console.log('✅ Meta atualizada com sucesso');
      // Forçar refresh dos dados do projeto
      await refreshProjects();
    } catch (error) {
      console.error('❌ Erro ao atualizar meta:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      console.log('🗑️ Excluindo meta:', goalId);
      await deleteGoal(goalId);
      console.log('✅ Meta excluída com sucesso');
      // Forçar refresh dos dados do projeto
      await refreshProjects();
      // NÃO fechar o formulário, apenas atualizar os dados
    } catch (error) {
      console.error('❌ Erro ao excluir meta:', error);
    }
  };

  const calculateProjectProgress = () => {
    if (!project?.goals || project.goals.length === 0) {
      return formData.progress || 0;
    }
    
    const totalProgress = project.goals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
    return Math.round(totalProgress / project.goals.length);
  };

  console.log('🎨 Renderizando formulário - Estado atual:', {
    formTitle: formData.title,
    responsiblesCount: responsibles.length,
    isSubmitting,
    isOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? `Editar Projeto: ${project.title}` : 'Novo Projeto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-end mb-4">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : (project ? 'Atualizar' : 'Criar')} Projeto
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Dados Gerais
              </TabsTrigger>
              <TabsTrigger value="responsibles" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Responsáveis
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Metas
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Evolução
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>Dados principais do projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Título do Projeto *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="legal_instrument">Instrumento Legal</Label>
                      <Select value={formData.legal_instrument} onValueChange={(value) => setFormData(prev => ({ ...prev, legal_instrument: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="convenio">Convênio</SelectItem>
                          <SelectItem value="contrato">Contrato</SelectItem>
                          <SelectItem value="termo_cooperacao">Termo de Cooperação</SelectItem>
                          <SelectItem value="acordo">Acordo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="instrument_number">Número do Instrumento</Label>
                      <Input
                        id="instrument_number"
                        value={formData.instrument_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, instrument_number: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="project_type">Tipo de Projeto</Label>
                      <Select value={formData.project_type} onValueChange={(value) => setFormData(prev => ({ ...prev, project_type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ensino">Ensino</SelectItem>
                          <SelectItem value="pesquisa">Pesquisa</SelectItem>
                          <SelectItem value="extensao">Extensão</SelectItem>
                          <SelectItem value="pos_graduacao">Curso de Pós-Graduação</SelectItem>
                          <SelectItem value="desenvolvimento_institucional">Desenvolvimento Institucional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value: 'planejamento' | 'andamento' | 'finalizado' | 'suspenso' | 'cancelado') => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planejamento">Planejamento</SelectItem>
                          <SelectItem value="andamento">Em Andamento</SelectItem>
                          <SelectItem value="finalizado">Finalizado</SelectItem>
                          <SelectItem value="suspenso">Sus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="start_date">Data de Início *</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="end_date">Data de Término</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="total_value">Valor Total (R$)</Label>
                      <Input
                        id="total_value"
                        type="number"
                        step="0.01"
                        value={formData.total_value}
                        onChange={(e) => setFormData(prev => ({ ...prev, total_value: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="external_link">Link Externo</Label>
                      <Input
                        id="external_link"
                        type="url"
                        value={formData.external_link}
                        onChange={(e) => setFormData(prev => ({ ...prev, external_link: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responsibles" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Responsáveis pelo Projeto</CardTitle>
                  <CardDescription>Adicione os responsáveis pelo projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome do responsável"
                      value={newResponsible}
                      onChange={(e) => setNewResponsible(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsible())}
                    />
                    <Button type="button" onClick={addResponsible}>
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {responsibles.map((responsible, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span>{responsible}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeResponsible(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              {project ? (
                <GoalManagement
                  goals={project.goals || []}
                  onCreateGoal={handleCreateGoal}
                  onUpdateGoal={handleUpdateGoal}
                  onDeleteGoal={handleDeleteGoal}
                  onRefresh={refreshProjects}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Salve o projeto primeiro</h3>
                    <p className="text-gray-600">Para gerenciar metas, primeiro salve o projeto na aba "Dados Gerais"</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Projeto</CardTitle>
                  <CardDescription>Acompanhe o progresso das metas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Progresso Geral</span>
                        <span>{calculateProjectProgress()}%</span>
                      </div>
                      <Progress value={calculateProjectProgress()} className="mt-2" />
                    </div>
                    
                    {project?.goals && project.goals.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Progresso por Meta</h4>
                        {project.goals.map((goal, index) => (
                          <div key={goal.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{goal.number} - {goal.description}</span>
                              <span>{goal.progress || 0}%</span>
                            </div>
                            <Progress value={goal.progress || 0} className="h-2" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}
