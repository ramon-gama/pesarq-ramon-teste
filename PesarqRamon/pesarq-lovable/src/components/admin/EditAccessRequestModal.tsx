
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useOrganizations } from "@/hooks/useOrganizations";
import type { AccessRequest } from "@/hooks/useAccessRequests";

interface EditAccessRequestModalProps {
  request: AccessRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditAccessRequestModal({ request, isOpen, onClose, onUpdate }: EditAccessRequestModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    requested_role: "",
    organization_id: "",
    justification: ""
  });
  const [loading, setLoading] = useState(false);
  const { organizations } = useOrganizations();
  const { toast } = useToast();

  useEffect(() => {
    if (request) {
      setFormData({
        name: request.name,
        email: request.email,
        requested_role: request.requested_role,
        organization_id: request.organization_id || "",
        justification: request.justification
      });
    }
  }, [request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('access_requests')
        .update({
          name: formData.name,
          email: formData.email,
          requested_role: formData.requested_role,
          organization_id: formData.organization_id || null,
          justification: formData.justification
        })
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Solicitação atualizada com sucesso."
      });

      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar solicitação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Solicitação</DialogTitle>
          <DialogDescription>
            Edite as informações da solicitação de acesso
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Tipo de Acesso</Label>
            <Select 
              value={formData.requested_role} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, requested_role: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unb_researcher">Pesquisador UnB</SelectItem>
                <SelectItem value="partner_admin">Administrador Parceiro</SelectItem>
                <SelectItem value="partner_user">Usuário Parceiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.requested_role === 'partner_admin' || formData.requested_role === 'partner_user') && (
            <div>
              <Label htmlFor="organization">Organização</Label>
              <Select 
                value={formData.organization_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, organization_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma organização" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map(org => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="justification">Justificativa</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
