
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Plus, Edit, Trash2 } from "lucide-react";

interface OrganizationTeamProps {
  team: any[];
  onCreateMember: () => void;
  onEditMember: (member: any) => void;
  onDeleteMember: (id: string) => void;
}

export function OrganizationTeam({
  team,
  onCreateMember,
  onEditMember,
  onDeleteMember
}: OrganizationTeamProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg font-semibold">Equipe</h3>
        <Button onClick={onCreateMember} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Membro
        </Button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {team.map((member) => {
          // Determinar status automaticamente baseado na data de saída
          const status = member.end_date ? 'inativo' : 'ativo';
          
          return (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-4">
                  {/* Header com nome, badges e ações */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold break-words text-sm sm:text-base">{member.name}</h4>
                        <Badge variant="outline" className="text-xs">{member.role}</Badge>
                        <Badge variant={status === 'ativo' ? 'default' : 'secondary'} className="text-xs">
                          {status}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Ações - sempre visíveis no mobile */}
                    <div className="flex gap-2 justify-start sm:justify-end flex-shrink-0">
                      <Button size="sm" variant="outline" onClick={() => onEditMember(member)} className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 h-8 w-8 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover "{member.name}" da equipe?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteMember(member.id)}>
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Informações detalhadas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="sm:col-span-2 lg:col-span-1">
                      <span className="font-medium text-gray-600">Função:</span>
                      <div className="break-words mt-1">{member.position}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Cargo:</span>
                      <div className="break-words mt-1">{member.employment_type || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Setor:</span>
                      <div className="break-words mt-1">{member.department || 'N/A'}</div>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <span className="font-medium text-gray-600">Email:</span>
                      <div className="break-all mt-1">{member.email}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Telefone:</span>
                      <div className="break-all mt-1">{member.phone || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Área de Formação:</span>
                      <div className="break-words mt-1">{member.formation_area || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Data de Entrada:</span>
                      <div className="mt-1">{member.start_date ? new Date(member.start_date).toLocaleDateString('pt-BR') : 'N/A'}</div>
                    </div>
                    {member.end_date && (
                      <div>
                        <span className="font-medium text-gray-600">Data de Saída:</span>
                        <div className="mt-1">{new Date(member.end_date).toLocaleDateString('pt-BR')}</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {team.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 px-4">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Nenhum membro cadastrado</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">Comece adicionando o primeiro membro da equipe</p>
            <Button onClick={onCreateMember} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Membro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
