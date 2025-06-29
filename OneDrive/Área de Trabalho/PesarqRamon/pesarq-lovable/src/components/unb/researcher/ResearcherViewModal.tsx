
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Calendar, Clock, GraduationCap, Building, ExternalLink, AlertCircle } from "lucide-react";
import { type Researcher } from "@/types/researcher";
import { useProjects } from "@/hooks/useProjects";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResearcherViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcher: Researcher | null;
}

export function ResearcherViewModal({ isOpen, onClose, researcher }: ResearcherViewModalProps) {
  const { projects } = useProjects();

  if (!researcher) return null;

  const project = projects.find(p => p.id === researcher.project_id);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'dismissed':
        return <Badge className="bg-red-100 text-red-800">Desligado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Pesquisador
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Nome</Label>
                <p className="text-sm mt-1">{researcher.name}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Status</Label>
                <div className="mt-1">{getStatusBadge(researcher.status)}</div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-sm mt-1">{researcher.email}</p>
                </div>
              </div>

              {researcher.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                    <p className="text-sm mt-1">{researcher.phone}</p>
                  </div>
                </div>
              )}

              {researcher.cpf && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">CPF</Label>
                  <p className="text-sm mt-1">{researcher.cpf}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações Acadêmicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Informações Acadêmicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Função</Label>
                <p className="text-sm mt-1">{researcher.function}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Nível Acadêmico</Label>
                <p className="text-sm mt-1">{researcher.academic_level}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Status Acadêmico</Label>
                <p className="text-sm mt-1">{researcher.academic_status}</p>
              </div>

              {researcher.course && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Curso</Label>
                  <p className="text-sm mt-1">{researcher.course}</p>
                </div>
              )}

              {researcher.specialization && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Especialização</Label>
                  <p className="text-sm mt-1">{researcher.specialization}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-600">Instituição</Label>
                  <p className="text-sm mt-1">{researcher.institution}</p>
                </div>
              </div>

              {researcher.lattes_url && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Currículo Lattes</Label>
                    <a 
                      href={researcher.lattes_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm mt-1 text-blue-600 hover:text-blue-800 underline block"
                    >
                      Ver currículo
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações do Projeto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Projeto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-600">Projeto</Label>
                <p className="text-sm mt-1">{project?.title || "Projeto não encontrado"}</p>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data de Início</Label>
                  <p className="text-sm mt-1">
                    {researcher.start_date ? new Date(researcher.start_date).toLocaleDateString('pt-BR') : 'Não informada'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data de Término</Label>
                  <p className="text-sm mt-1">
                    {researcher.end_date ? new Date(researcher.end_date).toLocaleDateString('pt-BR') : 'Não informada'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-600">Carga Horária</Label>
                  <p className="text-sm mt-1">{researcher.workload ? `${researcher.workload} horas` : 'Não informada'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Modalidade</Label>
                <p className="text-sm mt-1 capitalize">{researcher.modality}</p>
              </div>

              {researcher.shift && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Turno</Label>
                  <p className="text-sm mt-1 capitalize">{researcher.shift}</p>
                </div>
              )}
            </div>
          </div>

          {researcher.observations && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Observações</Label>
                <p className="text-sm">{researcher.observations}</p>
              </div>
            </>
          )}

          {researcher.status === 'dismissed' && researcher.dismissal_reason && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-red-600">Motivo do Desligamento</Label>
                <p className="text-sm">{researcher.dismissal_reason}</p>
                {researcher.dismissal_date && (
                  <p className="text-xs text-gray-500">
                    Desligado em: {new Date(researcher.dismissal_date).toLocaleDateString('pt-BR')}
                  </p>
                )}
                {researcher.dismissed_by && (
                  <p className="text-xs text-gray-500">
                    Desligado por: {researcher.dismissed_by}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Verificar dados faltantes para declaração */}
          {(() => {
            const missingData = [];
            if (!researcher?.cpf) missingData.push("CPF");
            if (!project?.title) missingData.push("Projeto");
            if (!researcher?.workload) missingData.push("Carga horária");
            if (!researcher?.start_date) missingData.push("Data de início");

            return missingData.length > 0 ? (
              <>
                <Separator />
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Dados não preenchidos para declaração:</strong> {missingData.join(", ")}
                    <br />
                    Estes campos aparecerão como "não informado" na declaração.
                  </AlertDescription>
                </Alert>
              </>
            ) : null;
          })()}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
