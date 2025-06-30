
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserManagement, type UserProfile } from "@/hooks/useUserManagement";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: UserProfile | null;
  organizations: any[];
}

export function UserFormModal({ isOpen, onClose, editingUser, organizations }: UserFormModalProps) {
  const { updateUser } = useUserManagement();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'partner_user' as UserProfile['role'],
    organization_id: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        organization_id: editingUser.organization_id || '',
        is_active: editingUser.is_active
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'partner_user',
        organization_id: '',
        is_active: true
      });
    }
  }, [editingUser, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userData = {
        ...formData,
        organization_id: formData.organization_id || null
      };

      if (editingUser) {
        await updateUser(editingUser.id, userData);
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'unb_admin', label: 'Admin UnB' },
    { value: 'unb_researcher', label: 'Pesquisador UnB' },
    { value: 'partner_admin', label: 'Admin Parceiro' },
    { value: 'partner_user', label: 'Usuário Parceiro' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Editar Usuário
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
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
              disabled={!!editingUser}
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserProfile['role'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(formData.role === 'partner_admin' || formData.role === 'partner_user') && (
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

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Salvando...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
