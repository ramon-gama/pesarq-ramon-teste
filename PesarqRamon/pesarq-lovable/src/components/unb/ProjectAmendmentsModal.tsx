
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText, Calendar, DollarSign } from "lucide-react";
import { Project, ProjectAmendment, useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";

interface ProjectAmendmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function ProjectAmendmentsModal({ isOpen, onClose, project }: ProjectAmendmentsModalProps) {
  const { createProjectAmendment, getProjectAmendments, updateProjectAmendment } = useProjects();
  const { toast } = useToast();
  const [amendments, setAmendments] = useState<ProjectAmendment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amendment_types: {
      prazo: false,
      valor: false,
      escopo: false,
      outro: false
    },
    original_value: "",
    new_value: "",
    original_end_date: "",
    new_end_date: "",
    justification: ""
  });

  useEffect(() => {
    if (project && isOpen) {
      loadAmendments();
    }
  }, [project, isOpen]);

  const loadAmendments = async () => {
    if (!project) return;
    
    try {
      setLoading(true);
      const data = await getProjectAmendments(project.id);
      setAmendments(data);
    } catch (error) {
      console.error('Erro ao carregar aditivos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar aditivos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    const selectedTypes = Object.entries(formData.amendment_types)
      .filter(([_, selected]) => selected)
      .map(([type, _]) => type);

    if (selectedTypes.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um tipo de aditivo",
        variant: "destructive",
      });
      return;
    }

    console.log('Tentando criar aditivo para projeto:', project.id);
    console.log('Dados do formulário:', formData);

    try {
      // Determinar o tipo principal (se só um tipo) ou "misto" se múltiplos
      const amendmentType = selectedTypes.length === 1 
        ? selectedTypes[0] as 'prazo' | 'valor' | 'escopo' | 'outro'
        : 'outro';

      const amendmentData = {
        project_id: project.id,
        amendment_number: amendments.length + 1,
        title: formData.title,
        description: formData.description + (selectedTypes.length > 1 ? `\nTipos: ${selectedTypes.join(', ')}` : ''),
        amendment_type: amendmentType,
        original_value: formData.original_value ? parseFloat(formData.original_value) : undefined,
        new_value: formData.new_value ? parseFloat(formData.new_value) : undefined,
        original_end_date: formData.original_end_date || undefined,
        new_end_date: formData.new_end_date || undefined,
        justification: formData.justification,
        status: 'pendente' as const,
        requested_at: new Date().toISOString()
      };

      console.log('Dados para criar aditivo:', amendmentData);

      await createProjectAmendment(amendmentData);
      
      toast({
        title: "Sucesso",
        description: "Aditivo criado com sucesso",
      });

      setFormData({
        title: "",
        description: "",
        amendment_types: {
          prazo: false,
          valor: false,
          escopo: false,
          outro: false
        },
        original_value: "",
        new_value: "",
        original_end_date: "",
        new_end_date: "",
        justification: ""
      });
      
      setShowForm(false);
      loadAmendments();
    } catch (error) {
      console.error('Erro ao criar aditivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar aditivo",
        variant: "destructive",
      });
    }
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amendment_types: {
        ...prev.amendment_types,
        [type]: checked
      }
    }));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: "bg-yellow-100 text-yellow-800",
      aprovado: "bg-green-100 text-green-800",
      rejeitado: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || colors.pendente;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      prazo: "Prazo",
      valor: "Valor",
      escopo: "Escopo",
      outro: "Outro/Misto"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const selectedTypes = Object.entries(formData.amendment_types)
    .filter(([_, selected]) => selected)
    .map(([type, _]) => type);

  const showValueFields = formData.amendment_types.valor;
  const showDateFields = formData.amendment_types.prazo;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Aditivos do Projeto - {project?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Aditivos Contratuais</h3>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              <Plus className="h-4 w-4" />
              Novo Aditivo
            </Button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-gray-50 space-y-4">
              <h4 className="font-medium">Novo Aditivo</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amendment_title">Título do Aditivo *</Label>
                  <Input
                    id="amendment_title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Primeiro Aditivo de Prazo e Valor"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipos de Aditivo *</Label>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(formData.amendment_types).map(([type, checked]) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={checked}
                          onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
                        />
                        <Label htmlFor={type} className="text-sm font-normal">
                          {getTypeLabel(type)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {showValueFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="original_value">Valor Original (R$)</Label>
                    <Input
                      id="original_value"
                      type="number"
                      step="0.01"
                      value={formData.original_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_value: e.target.value }))}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_value">Novo Valor (R$)</Label>
                    <Input
                      id="new_value"
                      type="number"
                      step="0.01"
                      value={formData.new_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, new_value: e.target.value }))}
                      placeholder="0,00"
                    />
                  </div>
                </div>
              )}

              {showDateFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="original_end_date">Data Original de Término</Label>
                    <Input
                      id="original_end_date"
                      type="date"
                      value={formData.original_end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_end_date: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_end_date">Nova Data de Término</Label>
                    <Input
                      id="new_end_date"
                      type="date"
                      value={formData.new_end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, new_end_date: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva as alterações do aditivo"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="justification">Justificativa *</Label>
                <Textarea
                  id="justification"
                  value={formData.justification}
                  onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
                  placeholder="Justifique a necessidade do aditivo"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#15AB92] hover:bg-[#0d8f7a]">
                  Criar Aditivo
                </Button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
              <p className="text-gray-600">Carregando aditivos...</p>
            </div>
          ) : amendments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum aditivo cadastrado</h3>
              <p className="text-gray-600">Este projeto ainda não possui aditivos contratuais.</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-medium">Nº</TableHead>
                    <TableHead className="font-medium">Título</TableHead>
                    <TableHead className="font-medium">Tipo</TableHead>
                    <TableHead className="font-medium">Data Solicitação</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amendments.map((amendment) => (
                    <TableRow key={amendment.id}>
                      <TableCell className="font-medium">
                        {amendment.amendment_number}º
                      </TableCell>
                      <TableCell>{amendment.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTypeLabel(amendment.amendment_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(amendment.requested_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(amendment.status)}>
                          {amendment.status.charAt(0).toUpperCase() + amendment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {amendment.amendment_type === 'valor' && amendment.new_value && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            R$ {amendment.new_value.toLocaleString()}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
