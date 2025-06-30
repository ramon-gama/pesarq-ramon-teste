import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, X, Target, Package, Trash2, Edit, Check } from "lucide-react";
import { OrganizationUnbProjectGoal, CreateOrganizationUnbProjectGoal } from "@/hooks/useOrganizationUnbProjects";
import { ConfirmDialog } from "./ConfirmDialog";

interface GoalManagementProps {
  goals: OrganizationUnbProjectGoal[];
  onCreateGoal: (goalData: CreateOrganizationUnbProjectGoal) => Promise<void>;
  onUpdateGoal: (goalId: string, goalData: Partial<OrganizationUnbProjectGoal>) => Promise<void>;
  onDeleteGoal: (goalId: string) => Promise<void>;
  onRefresh?: () => void;
}

const SERVICE_TYPES = [
  'Classificação',
  'Digitalização',
  'Descrição',
  'Arranjo',
  'Higienização',
  'Acondicionamento'
];

const INDICATORS = [
  'Caixas',
  'Metros Lineares',
  'Documentos',
  'Dossiês',
  'Processos',
  'Páginas'
];

// Tipos para o formulário (sem id e goal_id)
type FormDeliverable = {
  name: string;
  description?: string;
  completed: boolean;
};

type FormPhysicalScope = {
  service_type: string;
  indicator: string;
  target_quantity: number;
  current_quantity: number;
  unit: string;
};

export function GoalManagement({ goals, onCreateGoal, onUpdateGoal, onDeleteGoal, onRefresh }: GoalManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<OrganizationUnbProjectGoal | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    description: '',
    responsible: '',
    start_date: '',
    end_date: '',
    progress: 0,
    progress_type: 'manual' as 'manual' | 'automatic'
  });
  const [deliverables, setDeliverables] = useState<FormDeliverable[]>([]);
  const [physicalScope, setPhysicalScope] = useState<FormPhysicalScope[]>([]);
  const [newDeliverable, setNewDeliverable] = useState({ name: '', description: '' });
  const [newScope, setNewScope] = useState({
    service_type: '',
    indicator: '',
    target_quantity: 0,
    unit: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados dos diálogos
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    goalId: string | null;
    goalNumber: string;
  }>({
    open: false,
    goalId: null,
    goalNumber: ''
  });

  const resetForm = () => {
    console.log('🔄 Resetando formulário de meta');
    setFormData({
      number: '',
      title: '',
      description: '',
      responsible: '',
      start_date: '',
      end_date: '',
      progress: 0,
      progress_type: 'manual'
    });
    setDeliverables([]);
    setPhysicalScope([]);
    setNewDeliverable({ name: '', description: '' });
    setNewScope({ service_type: '', indicator: '', target_quantity: 0, unit: '' });
    setEditingGoal(null);
    setIsSubmitting(false);
    setShowForm(false);
  };

  const handleNewGoal = () => {
    console.log('📝 Abrindo formulário para nova meta');
    resetForm();
    setShowForm(true);
  };

  const handleCloseForm = () => {
    console.log('❌ Fechando formulário de meta');
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (goal: OrganizationUnbProjectGoal) => {
    console.log('✏️ Editando meta:', goal.id, goal);
    setEditingGoal(goal);
    setFormData({
      number: goal.number,
      title: goal.title || '',
      description: goal.description,
      responsible: goal.responsible || '',
      start_date: goal.start_date || '',
      end_date: goal.end_date || '',
      progress: goal.progress,
      progress_type: goal.progress_type
    });
    
    // Converter deliverables para formato do formulário
    const formDeliverables = goal.deliverables?.map(d => ({
      name: d.name,
      description: d.description || '',
      completed: d.completed
    })) || [];
    setDeliverables(formDeliverables);
    
    // Converter physical scope para formato do formulário
    const formPhysicalScope = goal.physical_scope?.map(ps => ({
      service_type: ps.service_type,
      indicator: ps.indicator,
      target_quantity: ps.target_quantity,
      current_quantity: ps.current_quantity,
      unit: ps.unit
    })) || [];
    setPhysicalScope(formPhysicalScope);
    
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      console.log('⏳ Já está enviando, ignorando duplicação...');
      return;
    }

    // Validação básica
    if (!formData.number.trim()) {
      alert('Número da meta é obrigatório');
      return;
    }

    // Usar descrição baseada no número se não fornecida
    const description = formData.description.trim() || `Meta ${formData.number.trim()}`;
    
    console.log('💾 Salvando meta...', { editingGoal: !!editingGoal, formData });
    setIsSubmitting(true);

    try {
      if (editingGoal) {
        console.log('🔄 Atualizando meta existente:', editingGoal.id);

        const updateData: Partial<OrganizationUnbProjectGoal> = {
          number: formData.number.trim(),
          title: formData.title.trim() || undefined,
          description: description,
          responsible: formData.responsible.trim() || undefined,
          start_date: formData.start_date || undefined,
          end_date: formData.end_date || undefined,
          progress: formData.progress,
          progress_type: formData.progress_type
        };

        // Incluir deliverables apenas se houver
        if (deliverables.length > 0) {
          updateData.deliverables = deliverables.map(d => ({
            id: `temp-${Date.now()}-${Math.random()}`,
            name: d.name.trim(),
            description: d.description?.trim() || undefined,
            completed: d.completed
          }));
        }

        // Incluir physical_scope apenas se houver
        if (physicalScope.length > 0) {
          updateData.physical_scope = physicalScope.map(ps => ({
            id: `temp-${Date.now()}-${Math.random()}`,
            service_type: ps.service_type,
            indicator: ps.indicator,
            target_quantity: ps.target_quantity,
            current_quantity: ps.current_quantity,
            unit: ps.unit
          }));
        }

        await onUpdateGoal(editingGoal.id, updateData);
        console.log('✅ Meta atualizada com sucesso');
      } else {
        console.log('➕ Criando nova meta');

        const goalData: CreateOrganizationUnbProjectGoal = {
          number: formData.number.trim(),
          title: formData.title.trim() || undefined,
          description: description,
          responsible: formData.responsible.trim() || undefined,
          start_date: formData.start_date || undefined,
          end_date: formData.end_date || undefined,
          progress: formData.progress,
          progress_type: formData.progress_type
        };

        // Incluir deliverables apenas se houver
        if (deliverables.length > 0) {
          goalData.deliverables = deliverables.map(d => ({
            name: d.name.trim(),
            description: d.description?.trim() || undefined,
            completed: d.completed
          }));
        }

        // Incluir physical_scope apenas se houver
        if (physicalScope.length > 0) {
          goalData.physical_scope = physicalScope.map(ps => ({
            service_type: ps.service_type,
            indicator: ps.indicator,
            target_quantity: ps.target_quantity,
            current_quantity: ps.current_quantity,
            unit: ps.unit
          }));
        }

        await onCreateGoal(goalData);
        console.log('✅ Meta criada com sucesso');
      }

      // Resetar formulário e forçar atualização
      resetForm();
      
      // Forçar atualização da lista
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('❌ Erro ao salvar meta:', error);
      
      let errorMessage = 'Erro desconhecido ao salvar meta.';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      alert(`${errorMessage} Verifique os dados e tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (goal: OrganizationUnbProjectGoal) => {
    setDeleteDialog({
      open: true,
      goalId: goal.id,
      goalNumber: goal.number
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.goalId) {
      try {
        await onDeleteGoal(deleteDialog.goalId);
        console.log('🗑️ Meta excluída com sucesso');
        
        // Forçar atualização da lista
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error('❌ Erro ao excluir meta:', error);
        alert('Erro ao excluir meta. Tente novamente.');
      }
    }
    setDeleteDialog({ open: false, goalId: null, goalNumber: '' });
  };

  const addDeliverable = () => {
    if (newDeliverable.name.trim()) {
      setDeliverables([...deliverables, { ...newDeliverable, completed: false }]);
      setNewDeliverable({ name: '', description: '' });
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const addPhysicalScope = () => {
    if (newScope.service_type && newScope.indicator && newScope.target_quantity > 0) {
      setPhysicalScope([...physicalScope, { ...newScope, current_quantity: 0 }]);
      setNewScope({ service_type: '', indicator: '', target_quantity: 0, unit: '' });
    }
  };

  const removePhysicalScope = (index: number) => {
    setPhysicalScope(physicalScope.filter((_, i) => i !== index));
  };

  const calculateAutomaticProgress = (goal: OrganizationUnbProjectGoal) => {
    if (!goal.physical_scope || goal.physical_scope.length === 0) return goal.progress;
    
    const totalProgress = goal.physical_scope.reduce((sum, scope) => {
      const scopeProgress = scope.target_quantity > 0 ? (scope.current_quantity / scope.target_quantity) * 100 : 0;
      return sum + scopeProgress;
    }, 0);
    
    return Math.round(totalProgress / goal.physical_scope.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Metas do Projeto</h3>
        <Button 
          type="button"
          onClick={handleNewGoal} 
          className="flex items-center gap-2"
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingGoal ? 'Editar Meta' : 'Nova Meta'}</CardTitle>
            <CardDescription>
              {editingGoal 
                ? `Editando a meta: ${editingGoal.number}`
                : 'Defina os detalhes da nova meta (apenas o número é obrigatório)'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number">Número da Meta *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="Ex: Meta 01"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="title">Título da Meta</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título da meta"
                  />
                </div>

                <div>
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input
                    id="responsible"
                    value={formData.responsible}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsible: e.target.value }))}
                    placeholder="Nome do responsável"
                  />
                </div>

                <div>
                  <Label htmlFor="progress_type">Tipo de Progresso</Label>
                  <Select value={formData.progress_type} onValueChange={(value: 'manual' | 'automatic') => setFormData(prev => ({ ...prev, progress_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
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

                {formData.progress_type === 'manual' && (
                  <div className="md:col-span-2">
                    <Label htmlFor="progress">Progresso (%)</Label>
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Descrição da meta (opcional - será gerada automaticamente se não preenchida)"
                />
              </div>

              {/* Entregáveis */}
              <div className="space-y-3">
                <Label>Entregáveis</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do entregável"
                    value={newDeliverable.name}
                    onChange={(e) => setNewDeliverable(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Descrição (opcional)"
                    value={newDeliverable.description}
                    onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Button type="button" onClick={addDeliverable}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{deliverable.name}</span>
                        {deliverable.description && (
                          <p className="text-sm text-gray-600">{deliverable.description}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDeliverable(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escopo Físico */}
              <div className="space-y-3">
                <Label>Escopo Físico</Label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <Select value={newScope.service_type} onValueChange={(value) => setNewScope(prev => ({ ...prev, service_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={newScope.indicator} onValueChange={(value) => setNewScope(prev => ({ ...prev, indicator: value, unit: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Indicador" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDICATORS.map(indicator => (
                        <SelectItem key={indicator} value={indicator}>{indicator}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Quantidade Meta"
                    value={newScope.target_quantity || ''}
                    onChange={(e) => setNewScope(prev => ({ ...prev, target_quantity: parseInt(e.target.value) || 0 }))}
                  />

                  <Input
                    placeholder="Unidade"
                    value={newScope.unit}
                    onChange={(e) => setNewScope(prev => ({ ...prev, unit: e.target.value }))}
                  />

                  <Button type="button" onClick={addPhysicalScope}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {physicalScope.map((scope, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{scope.service_type} - {scope.indicator}</div>
                        <div className="text-sm text-gray-600">
                          Meta: {scope.target_quantity} {scope.unit} | Atual: {scope.current_quantity} {scope.unit}
                        </div>
                        <Progress 
                          value={scope.target_quantity > 0 ? (scope.current_quantity / scope.target_quantity) * 100 : 0} 
                          className="h-2 mt-1" 
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePhysicalScope(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseForm}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : (editingGoal ? 'Atualizar' : 'Criar')} Meta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Metas */}
      <div className="space-y-4">
        {goals && goals.length > 0 ? goals.map((goal) => {
          const progressValue = goal.progress_type === 'automatic' ? calculateAutomaticProgress(goal) : goal.progress;
          
          return (
            <Card key={goal.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{goal.number}</CardTitle>
                    {goal.title && (
                      <p className="text-sm text-gray-600 mt-1">{goal.title}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={goal.progress_type === 'automatic' ? 'default' : 'secondary'}>
                      {goal.progress_type === 'automatic' ? 'Automático' : 'Manual'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(goal)}
                      title="Editar meta"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(goal)}
                      title="Excluir meta"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {goal.responsible && (
                    <div>
                      <strong>Responsável:</strong> {goal.responsible}
                    </div>
                  )}
                  {goal.start_date && (
                    <div>
                      <strong>Início:</strong> {new Date(goal.start_date).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {goal.end_date && (
                    <div>
                      <strong>Término:</strong> {new Date(goal.end_date).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm">{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>

                {goal.deliverables && goal.deliverables.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Entregáveis ({goal.deliverables.filter(d => d.completed).length}/{goal.deliverables.length})
                    </h4>
                    <div className="space-y-1">
                      {goal.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {deliverable.completed ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 border rounded" />
                          )}
                          <span className={deliverable.completed ? 'line-through text-gray-500' : ''}>
                            {deliverable.name}
                          </span>
                          {deliverable.description && (
                            <span className="text-gray-500">- {deliverable.description}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {goal.physical_scope && goal.physical_scope.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Escopo Físico
                    </h4>
                    <div className="space-y-2">
                      {goal.physical_scope.map((scope, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{scope.service_type} - {scope.indicator}</span>
                            <span className="text-sm">
                              {scope.current_quantity}/{scope.target_quantity} {scope.unit}
                            </span>
                          </div>
                          <Progress 
                            value={scope.target_quantity > 0 ? (scope.current_quantity / scope.target_quantity) * 100 : 0} 
                            className="h-1" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        }) : (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma meta cadastrada
              </h3>
              <p className="text-gray-500 mb-4">
                Comece cadastrando a primeira meta do projeto.
              </p>
              <Button onClick={handleNewGoal}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Meta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de confirmação para exclusão */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        title="Excluir Meta"
        description={`Tem certeza que deseja excluir a meta "${deleteDialog.goalNumber}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}
