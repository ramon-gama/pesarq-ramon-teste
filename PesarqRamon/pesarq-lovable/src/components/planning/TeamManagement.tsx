import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Users, Edit, Trash2, Mail } from "lucide-react";
import { useOrganizationTeam } from "@/hooks/useOrganizationTeam";
import { useStrategicPlanning } from "@/hooks/useStrategicPlanning";
import { AddTeamMemberModal } from "@/components/planning/AddTeamMemberModal";

interface TeamManagementProps {
  planId: string;
}

export function TeamManagement({ planId }: TeamManagementProps) {
  // Use consistent organizationId
  const organizationId = "00000000-0000-0000-0000-000000000001";
  const { team, loading } = useOrganizationTeam(organizationId);
  const { deleteTeamMember } = useStrategicPlanning(organizationId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const handleDeleteMember = async (memberId: string) => {
    try {
      console.log('TeamManagement: Deleting member:', memberId);
      await deleteTeamMember(memberId, planId);
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const handleEditMember = (member: any) => {
    console.log('TeamManagement: Editing member:', member);
    setEditingMember(member);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingMember(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Carregando equipe...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Gerenciar Equipe</h2>
          <p className="text-gray-600 text-sm">
            Gerencie os membros da equipe da organização
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#15AB92] hover:bg-[#0d8f7a]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>

      <div className="space-y-4">
        {team.length > 0 ? (
          team.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg break-words">{member.name}</h4>
                      {member.role && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {member.role}
                        </Badge>
                      )}
                      <Badge variant={member.status === 'ativo' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Cargo:</span> <span className="break-words">{member.position}</span>
                      </div>
                      {member.department && (
                        <div>
                          <span className="font-medium">Departamento:</span> <span className="break-words">{member.department}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="break-all">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div>
                          <span className="font-medium">Telefone:</span> <span className="break-all">{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end lg:justify-start">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover "{member.name}" da equipe? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteMember(member.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum membro na equipe</h3>
              <p className="text-gray-600 mb-4">Comece adicionando o primeiro membro da equipe</p>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#15AB92] hover:bg-[#0d8f7a]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Membro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AddTeamMemberModal
        open={showAddModal}
        onOpenChange={handleCloseModal}
        planId={planId}
        editingMember={editingMember}
      />
    </div>
  );
}
