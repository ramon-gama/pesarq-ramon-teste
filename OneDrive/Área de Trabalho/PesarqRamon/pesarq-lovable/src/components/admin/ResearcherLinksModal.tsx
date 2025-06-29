
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Building } from "lucide-react";
import { useUserManagement, type UserProfile, type ResearcherOrgLink } from "@/hooks/useUserManagement";

interface ResearcherLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcher: UserProfile | null;
  organizations: any[];
  researcherLinks: ResearcherOrgLink[];
}

export function ResearcherLinksModal({ 
  isOpen, 
  onClose, 
  researcher, 
  organizations, 
  researcherLinks 
}: ResearcherLinksModalProps) {
  const { linkResearcherToOrganization, unlinkResearcherFromOrganization, updateResearcherPermissions } = useUserManagement();
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [newPermissions, setNewPermissions] = useState<{
    can_view_projects: boolean;
    projects_access_type: 'leader' | 'admin';
  }>({
    can_view_projects: true,
    projects_access_type: 'leader'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!researcher) return null;

  const currentLinks = researcherLinks.filter(link => link.researcher_id === researcher.id);
  const availableOrgs = organizations.filter(org => 
    !currentLinks.some(link => link.organization_id === org.id)
  );

  const handleAddLink = async () => {
    if (!selectedOrgId) return;

    setIsSubmitting(true);
    try {
      await linkResearcherToOrganization(researcher.id, selectedOrgId, newPermissions);
      setSelectedOrgId('');
      setNewPermissions({
        can_view_projects: true,
        projects_access_type: 'leader'
      });
    } catch (error) {
      console.error('Erro ao adicionar vínculo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveLink = async (linkId: string) => {
    if (confirm('Tem certeza que deseja remover este vínculo?')) {
      await unlinkResearcherFromOrganization(linkId);
    }
  };

  const handleUpdatePermissions = async (linkId: string, permissions: Record<string, any>) => {
    await updateResearcherPermissions(linkId, permissions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Vínculos Organizacionais</DialogTitle>
          <DialogDescription>
            Configure os vínculos e permissões do pesquisador {researcher.name} com organizações
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Adicionar novo vínculo */}
          {availableOrgs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Adicionar Novo Vínculo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Organização</Label>
                  <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma organização" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOrgs.map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Permissões</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can_view_projects"
                      checked={newPermissions.can_view_projects}
                      onCheckedChange={(checked) => 
                        setNewPermissions(prev => ({ ...prev, can_view_projects: !!checked }))
                      }
                    />
                    <Label htmlFor="can_view_projects">
                      Acesso à página de Gestão de Projetos UnB
                    </Label>
                  </div>

                  {newPermissions.can_view_projects && (
                    <div>
                      <Label>Tipo de acesso aos projetos</Label>
                      <Select
                        value={newPermissions.projects_access_type}
                        onValueChange={(value: 'leader' | 'admin') => 
                          setNewPermissions(prev => ({ ...prev, projects_access_type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leader">
                            Líder - Apenas aba de Frequência
                          </SelectItem>
                          <SelectItem value="admin">
                            Administração - Todas as abas
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleAddLink} 
                  disabled={!selectedOrgId || isSubmitting}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Adicionando...' : 'Adicionar Vínculo'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Vínculos existentes */}
          <div className="space-y-4">
            <h4 className="font-medium">Vínculos Existentes ({currentLinks.length})</h4>
            
            {currentLinks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum vínculo organizacional configurado</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentLinks.map((link) => (
                  <Card key={link.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium">{link.organizations?.name}</h5>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={link.permissions?.can_view_projects ? "default" : "secondary"}>
                                {link.permissions?.can_view_projects ? 'Com acesso a projetos' : 'Sem acesso a projetos'}
                              </Badge>
                              {link.permissions?.can_view_projects && (
                                <Badge variant="outline">
                                  {link.permissions?.projects_access_type === 'admin' ? 'Admin' : 'Líder'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleRemoveLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
