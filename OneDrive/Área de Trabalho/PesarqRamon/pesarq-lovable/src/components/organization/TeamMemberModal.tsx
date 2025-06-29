
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMember } from "@/hooks/useOrganizationTeam";
import { DepartmentSelector } from "./DepartmentSelector";
import { useToast } from "@/hooks/use-toast";

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  editingMember?: TeamMember | null;
  organizationId: string;
  sectors?: any[];
  onSectorCreated?: () => void;
}

export function TeamMemberModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingMember, 
  organizationId,
  sectors = [],
  onSectorCreated
}: TeamMemberModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    role: "viewer" as "editor" | "viewer",
    start_date: "",
    end_date: "",
    formation_area: "",
    employment_type: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (editingMember) {
      console.log('🎯 TeamMemberModal - Setting form data for editing member:', editingMember);
      setFormData({
        name: editingMember.name || "",
        email: editingMember.email || "",
        phone: editingMember.phone || "",
        position: editingMember.position || "",
        department: editingMember.department || "",
        role: editingMember.role === "admin" || editingMember.role === "manager" || editingMember.role === "member" ? "editor" : "viewer",
        start_date: editingMember.start_date || "",
        end_date: editingMember.end_date || "",
        formation_area: (editingMember as any).formation_area || "",
        employment_type: (editingMember as any).employment_type || ""
      });
    } else {
      console.log('🎯 TeamMemberModal - Resetting form for new member');
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        role: "viewer",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        formation_area: "",
        employment_type: ""
      });
    }
    setValidationErrors({});
  }, [editingMember, isOpen]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
    }
    
    if (!formData.email.trim()) {
      errors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "E-mail inválido";
    }
    
    if (!formData.position.trim()) {
      errors.position = "Função é obrigatória";
    }
    
    if (!formData.start_date) {
      errors.start_date = "Data de entrada é obrigatória";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🎯 TeamMemberModal - Starting form submission');
    console.log('🎯 TeamMemberModal - Form data:', formData);

    if (!validateForm()) {
      console.log('🎯 TeamMemberModal - Validation failed:', validationErrors);
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSave = {
        ...formData,
        organization_id: organizationId,
        // Se não há data de saída, deixar como null
        end_date: formData.end_date || null
      };

      console.log('🎯 TeamMemberModal - Calling onSave with data:', dataToSave);
      await onSave(dataToSave);
      console.log('🎯 TeamMemberModal - onSave completed successfully');
      
      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        role: "viewer",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        formation_area: "",
        employment_type: ""
      });
      setValidationErrors({});
      onClose();
    } catch (error: any) {
      console.error('🎯 TeamMemberModal - Error in handleSubmit:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar membro da equipe",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Visualizador" }
  ];

  // Opções de cargo em ordem alfabética
  const employmentTypes = [
    "Bolsista",
    "Cargo Comissionado",
    "Consultor",
    "Estagiário Nível Médio", 
    "Estagiário Nível Superior",
    "Outros",
    "Requisitado de outro órgão",
    "Servidor Público Efetivo",
    "Servidor Público Temporário",
    "Terceirizado"
  ];

  // Opções de função em ordem alfabética
  const positions = [
    "Analísta",
    "Apoio Administrativo",
    "Apoio Técnico",
    "Arquivísta",
    "Auxiliar de Arquivo",
    "Auxiliar Operacional",
    "Chefe de Divisão",
    "Chefe de Setor",
    "Estagiário de Arquivologia",
    "Outros",
    "Técnico de Arquivo"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader className="px-1 sm:px-0">
          <DialogTitle className="text-lg sm:text-xl">
            {editingMember ? 'Editar Membro da Equipe' : 'Novo Membro da Equipe'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Preencha as informações do membro da equipe
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-1 sm:px-0">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome completo"
              className={`text-sm ${validationErrors.name ? "border-red-500" : ""}`}
            />
            {validationErrors.name && (
              <p className="text-xs text-red-500">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemplo.com"
              className={`text-sm ${validationErrors.email ? "border-red-500" : ""}`}
            />
            {validationErrors.email && (
              <p className="text-xs text-red-500">{validationErrors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm">Função *</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                <SelectTrigger className={`text-sm ${validationErrors.position ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position} className="text-sm">
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.position && (
                <p className="text-xs text-red-500">{validationErrors.position}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment_type" className="text-sm">Cargo</Label>
              <Select value={formData.employment_type} onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-sm">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm">Nível de Acesso</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="text-sm">
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm">Setor</Label>
              <DepartmentSelector
                value={formData.department}
                onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                organizationId={organizationId}
                sectors={sectors}
                onSectorCreated={onSectorCreated}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formation_area" className="text-sm">Área de Formação</Label>
              <Input
                id="formation_area"
                value={formData.formation_area}
                onChange={(e) => setFormData(prev => ({ ...prev, formation_area: e.target.value }))}
                placeholder="Ex: Arquivologia, Administração"
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-sm">Data de Entrada *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className={`text-sm ${validationErrors.start_date ? "border-red-500" : ""}`}
              />
              {validationErrors.start_date && (
                <p className="text-xs text-red-500">{validationErrors.start_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-sm">Data de Saída (opcional)</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                className="text-sm"
              />
              <p className="text-xs text-gray-500">
                Deixe em branco se o membro ainda está ativo na organização
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 px-0 flex-col sm:flex-row">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Salvando...' : (editingMember ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
