
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStrategicPlanning } from "@/hooks/useStrategicPlanning";
import { useServices } from "@/hooks/useServices";
import { useOrganizationTeam } from "@/hooks/useOrganizationTeam";
import { useToast } from "@/hooks/use-toast";

interface AddTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  editingMember?: any;
}

export function AddTeamMemberModal({ 
  open, 
  onOpenChange, 
  planId, 
  editingMember 
}: AddTeamMemberModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    service_type: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTeamMember, updateTeamMember } = useStrategicPlanning();
  const { services } = useServices();
  const organizationId = "00000000-0000-0000-0000-000000000001";
  const { team } = useOrganizationTeam(organizationId);
  const { toast } = useToast();

  // Get unique service types from services
  const serviceTypes = [...new Set(services.map(service => service.type))].filter(Boolean);

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || "",
        email: editingMember.email || "",
        role: editingMember.role || "",
        service_type: editingMember.service_type || ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "",
        service_type: ""
      });
    }
  }, [editingMember, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, formData);
      } else {
        await createTeamMember({
          ...formData,
          plan_id: planId
        });
      }
      
      setFormData({ name: "", email: "", role: "", service_type: "" });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving team member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingMember ? 'Editar Membro da Equipe' : 'Adicionar Membro da Equipe'}
          </DialogTitle>
          <DialogDescription>
            Selecione um membro da equipe da organização para o planejamento estratégico.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team_member">Membro da Equipe *</Label>
            <Select
              value={formData.name}
              onValueChange={(value) => {
                const selectedMember = team.find(member => member.name === value);
                if (selectedMember) {
                  setFormData(prev => ({
                    ...prev,
                    name: selectedMember.name,
                    email: selectedMember.email,
                    role: selectedMember.role
                  }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um membro da equipe" />
              </SelectTrigger>
              <SelectContent>
                {team.filter(member => member.status === 'ativo').map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name} - {member.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_type">Tipo de Serviço</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                value={formData.email}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Função</Label>
              <Input
                value={formData.role}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.name}
              className="bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              {isSubmitting ? 'Salvando...' : (editingMember ? 'Atualizar' : 'Adicionar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
