
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, AlertCircle } from "lucide-react";
import { type Researcher } from "@/types/researcher";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";
import { generateDeclarationPDF } from "@/utils/declarationGenerator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CertificateGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcher: Researcher | null;
}

export function CertificateGeneratorModal({
  isOpen,
  onClose,
  researcher
}: CertificateGeneratorModalProps) {
  const { projects } = useProjects();
  const { toast } = useToast();

  const handleGenerateDeclaration = () => {
    if (!researcher) {
      toast({
        title: "Erro",
        description: "Dados do pesquisador não encontrados",
        variant: "destructive",
      });
      return;
    }

    const project = projects.find(p => p.id === researcher?.project_id);
    
    // Usar dados disponíveis ou valores padrão informativos
    const declarationData = {
      researcherName: researcher.name,
      cpf: researcher.cpf || "CPF não informado",
      projectTitle: project?.title || "Projeto não informado",
      selectedGoal: project?.goals?.[0]?.description || "Meta não especificada",
      hours: researcher.workload || 0,
      startDate: researcher.start_date,
      endDate: researcher.end_date || new Date().toISOString().split('T')[0],
      coordinator1: "Prof. Dr. Renato Tarciso Barbosa de Sousa",
      coordinator2: "Prof. Dr. Rogério Henrique de Araújo Júnior",
      faculty: "Faculdade de Ciência da Informação da UnB",
      observations: researcher.observations || ""
    };

    try {
      generateDeclarationPDF(declarationData);
      
      toast({
        title: "Declaração Gerada",
        description: "A declaração foi gerada e baixada com sucesso",
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao gerar declaração:", error);
      toast({
        title: "Erro",
        description: "Erro ao gerar a declaração",
        variant: "destructive",
      });
    }
  };

  const project = projects.find(p => p.id === researcher?.project_id);
  
  // Verificar se há dados faltantes
  const missingData = [];
  if (!researcher?.cpf) missingData.push("CPF");
  if (!project?.title) missingData.push("Projeto");
  if (!researcher?.workload) missingData.push("Carga horária");
  if (!researcher?.start_date) missingData.push("Data de início");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerar Declaração de Participação
          </DialogTitle>
        </DialogHeader>
        
        {researcher && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pesquisador</Label>
              <Input value={researcher.name} disabled />
            </div>

            <div className="space-y-2">
              <Label>CPF</Label>
              <Input value={researcher.cpf || "Não informado"} disabled />
            </div>

            <div className="space-y-2">
              <Label>Projeto</Label>
              <Input value={project?.title || "Projeto não encontrado"} disabled />
            </div>

            <div className="space-y-2">
              <Label>Carga Horária</Label>
              <Input value={researcher.workload ? `${researcher.workload}h` : "Não informada"} disabled />
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Input 
                value={`${researcher.start_date ? new Date(researcher.start_date).toLocaleDateString('pt-BR') : 'Não informado'} a ${researcher.end_date ? new Date(researcher.end_date).toLocaleDateString('pt-BR') : 'Atual'}`} 
                disabled 
              />
            </div>

            {missingData.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dados não preenchidos:</strong> {missingData.join(", ")}
                  <br />
                  Estes campos aparecerão como "não informado" na declaração.
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-50 p-3 rounded-md text-sm">
              <p className="font-medium text-blue-800">Coordenadores:</p>
              <p className="text-blue-700">• Prof. Dr. Renato Tarciso Barbosa de Sousa</p>
              <p className="text-blue-700">• Prof. Dr. Rogério Henrique de Araújo Júnior</p>
              <p className="text-blue-700 mt-1">Faculdade de Ciência da Informação - UnB</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleGenerateDeclaration} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Gerar Declaração
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
