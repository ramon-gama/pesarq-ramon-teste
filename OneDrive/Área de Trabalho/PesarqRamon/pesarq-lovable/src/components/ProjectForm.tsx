
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, Calendar } from "lucide-react";
import { useProjects, Project } from "@/hooks/useProjects";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { ProjectStatus } from "@/types/projectForm";

interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

interface ProjectGoal {
  id?: string;
  number: string;
  description: string;
  value: number;
  start_date?: string;
  end_date?: string;
  progress: number;
  products?: string[];
  responsibles?: string[];
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const { createProject, updateProject } = useProjects();
  const { currentOrganization } = useOrganizationContext();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    object: '',
    legal_instrument: '',
    instrument_number: '',
    start_date: '',
    end_date: '',
    total_value: '',
    researchers_count: '',
    documents_meters: '',
    boxes_to_digitalize: '',
    boxes_to_describe: '',
    status: 'planejamento' as ProjectStatus,
    project_type: '',
    external_link: '',
    objectives: '',
    progress: 0
  });

  const [goals, setGoals] = useState<ProjectGoal[]>([]);
  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [newResponsible, setNewResponsible] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        object: project.object || '',
        legal_instrument: project.legal_instrument || '',
        instrument_number: project.instrument_number || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        total_value: project.total_value?.toString() || '',
        researchers_count: project.researchers_count?.toString() || '',
        documents_meters: project.documents_meters?.toString() || '',
        boxes_to_digitalize: project.boxes_to_digitalize?.toString() || '',
        boxes_to_describe: project.boxes_to_describe?.toString() || '',
        status: project.status as ProjectStatus,
        project_type: project.project_type || '',
        external_link: project.external_link || '',
        objectives: project.objectives || '',
        progress: project.progress || 0
      });

      if (project.goals) {
        setGoals(project.goals.map(goal => ({
          id: goal.id,
          number: goal.number,
          description: goal.description,
          value: goal.value,
          start_date: goal.start_date,
          end_date: goal.end_date,
          progress: goal.progress,
          products: goal.products || [],
          responsibles: goal.responsibles || []
        })));
      }

      if (project.responsibles) {
        setResponsibles(project.responsibles);
      }
    }
  }, [project]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addGoal = () => {
    const newGoal: ProjectGoal = {
      number: (goals.length + 1).toString(),
      description: '',
      value: 0,
      progress: 0,
      products: [],
      responsibles: []
    };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (index: number, field: string, value: any) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    setGoals(updatedGoals);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const addResponsible = () => {
    if (newResponsible.trim() && !responsibles.includes(newResponsible.trim())) {
      setResponsibles([...responsibles, newResponsible.trim()]);
      setNewResponsible('');
    }
  };

  const removeResponsible = (name: string) => {
    setResponsibles(responsibles.filter(r => r !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization?.id) return;

    setLoading(true);
    try {
      // Preparar dados do projeto sem as metas (elas serão tratadas separadamente)
      const projectData = {
        ...formData,
        organization_id: currentOrganization.id,
        total_value: formData.total_value ? parseFloat(formData.total_value) : undefined,
        researchers_count: formData.researchers_count ? parseInt(formData.researchers_count) : undefined,
        documents_meters: formData.documents_meters ? parseFloat(formData.documents_meters) : undefined,
        boxes_to_digitalize: formData.boxes_to_digitalize ? parseInt(formData.boxes_to_digitalize) : undefined,
        boxes_to_describe: formData.boxes_to_describe ? parseInt(formData.boxes_to_describe) : undefined,
        // Remover goals do objeto principal - elas serão tratadas pelo hook useProjects separadamente
        responsibles
      };

      if (project) {
        await updateProject(project.id, projectData);
      } else {
        await createProject(projectData);
      }

      onSave();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
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
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="legal_instrument">Instrumento Legal</Label>
              <Input
                id="legal_instrument"
                value={formData.legal_instrument}
                onChange={(e) => handleInputChange('legal_instrument', e.target.value)}
                placeholder="Ex: Termo de Cooperação"
              />
            </div>

            <div>
              <Label htmlFor="instrument_number">Número do Instrumento</Label>
              <Input
                id="instrument_number"
                value={formData.instrument_number}
                onChange={(e) => handleInputChange('instrument_number', e.target.value)}
                placeholder="Ex: 001/2024"
              />
            </div>

            <div>
              <Label htmlFor="start_date">Data de Início *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="end_date">Data de Término</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                  <SelectItem value="andamento">Em Andamento</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="total_value">Valor Total (R$)</Label>
              <Input
                id="total_value"
                type="number"
                step="0.01"
                value={formData.total_value}
                onChange={(e) => handleInputChange('total_value', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escopo Físico */}
      <Card>
        <CardHeader>
          <CardTitle>Escopo Físico</CardTitle>
          <CardDescription>Quantidades e métricas do projeto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="documents_meters">Metros Lineares</Label>
              <Input
                id="documents_meters"
                type="number"
                step="0.01"
                value={formData.documents_meters}
                onChange={(e) => handleInputChange('documents_meters', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="boxes_to_describe">Caixas para Descrição</Label>
              <Input
                id="boxes_to_describe"
                type="number"
                value={formData.boxes_to_describe}
                onChange={(e) => handleInputChange('boxes_to_describe', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="boxes_to_digitalize">Caixas para Digitalização</Label>
              <Input
                id="boxes_to_digitalize"
                type="number"
                value={formData.boxes_to_digitalize}
                onChange={(e) => handleInputChange('boxes_to_digitalize', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsáveis */}
      <Card>
        <CardHeader>
          <CardTitle>Responsáveis</CardTitle>
          <CardDescription>Pessoas responsáveis pelo projeto</CardDescription>
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
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {responsibles.map((responsible, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {responsible}
                <button
                  type="button"
                  onClick={() => removeResponsible(responsible)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Metas do Projeto</CardTitle>
              <CardDescription>Defina as metas e objetivos específicos</CardDescription>
            </div>
            <Button type="button" onClick={addGoal} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Meta
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Meta {goal.number}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGoal(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Descrição da Meta</Label>
                  <Textarea
                    value={goal.description}
                    onChange={(e) => updateGoal(index, 'description', e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Valor da Meta (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={goal.value}
                    onChange={(e) => updateGoal(index, 'value', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Progresso (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => updateGoal(index, 'progress', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={goal.start_date || ''}
                    onChange={(e) => updateGoal(index, 'start_date', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Data de Término</Label>
                  <Input
                    type="date"
                    value={goal.end_date || ''}
                    onChange={(e) => updateGoal(index, 'end_date', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Projeto'}
        </Button>
      </div>
    </form>
  );
}
