
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pencil, Trash2, Eye, UserX, CheckCircle, XCircle, FileText } from "lucide-react";
import { type Researcher } from "@/types/researcher";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";
import { generateDeclarationPDF } from "@/utils/declarationGenerator";
import { DeleteResearcherDialog } from "./DeleteResearcherDialog";

interface ResearcherTableProps {
  researchers: Researcher[];
  onEdit: (researcher: Researcher) => void;
  onDelete: (id: string) => void;
  onView: (researcher: Researcher) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onDismiss: (researcher: Researcher) => void;
}

export function ResearcherTable({
  researchers,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
  onDismiss
}: ResearcherTableProps) {
  const { projects } = useProjects();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [researcherToDelete, setResearcherToDelete] = useState<Researcher | null>(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(researchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResearchers = researchers.slice(startIndex, endIndex);

  const handleDeleteClick = (researcher: Researcher) => {
    setResearcherToDelete(researcher);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (researcherToDelete) {
      onDelete(researcherToDelete.id);
      setShowDeleteDialog(false);
      setResearcherToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setResearcherToDelete(null);
  };

  const handleGenerateDeclaration = (researcher: Researcher) => {
    const project = projects.find(p => p.id === researcher.project_id);
    
    // Verificar se há dados faltantes
    const missingData = [];
    if (!researcher?.cpf) missingData.push("CPF");
    if (!project?.title) missingData.push("Projeto");
    if (!researcher?.workload) missingData.push("Carga horária");
    if (!researcher?.start_date) missingData.push("Data de início");

    if (missingData.length > 0) {
      toast({
        title: "Dados incompletos",
        description: `Os seguintes dados estão faltando: ${missingData.join(", ")}. A declaração será gerada com essas informações como "não informado".`,
        variant: "default",
      });
    }

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
    } catch (error) {
      console.error("Erro ao gerar declaração:", error);
      toast({
        title: "Erro",
        description: "Erro ao gerar a declaração",
        variant: "destructive",
      });
    }
  };

  const getProjectTitle = (projectId?: string) => {
    if (!projectId) return "Não informado";
    const project = projects.find(p => p.id === projectId);
    return project?.title || "Projeto não encontrado";
  };

  const getStatusBadge = (researcher: Researcher) => {
    switch (researcher.status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 mr-1" />
            Ativo
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="h-4 w-4 mr-1" />
            Inativo
          </Badge>
        );
      case 'dismissed':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <UserX className="h-4 w-4 mr-1" />
            Desligado
          </Badge>
        );
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getModalityBadge = (modality: string) => {
    switch (modality) {
      case 'presencial':
        return (
          <Badge variant="secondary">
            Presencial
          </Badge>
        );
      case 'semipresencial':
        return (
          <Badge variant="secondary">
            Semipresencial
          </Badge>
        );
      case 'online':
        return (
          <Badge variant="secondary">
            Online
          </Badge>
        );
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead>Carga Horária</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentResearchers.map((researcher) => (
              <TableRow key={researcher.id}>
                <TableCell className="font-medium">{researcher.name}</TableCell>
                <TableCell>{researcher.email}</TableCell>
                <TableCell>{researcher.function}</TableCell>
                <TableCell>{getProjectTitle(researcher.project_id)}</TableCell>
                <TableCell>{getModalityBadge(researcher.modality)}</TableCell>
                <TableCell>{researcher.workload}h</TableCell>
                <TableCell>{getStatusBadge(researcher)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => onView(researcher)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Visualizar detalhes</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => handleGenerateDeclaration(researcher)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gerar Declaração</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => onEdit(researcher)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar pesquisador</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(researcher)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Excluir pesquisador</p>
                      </TooltipContent>
                    </Tooltip>

                    {researcher.status === 'active' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => onDismiss(researcher)}>
                            <UserX className="h-4 w-4 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Desligar pesquisador</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {(researcher.status === 'inactive' || researcher.status === 'dismissed') && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => onToggleStatus(researcher.id, true)}>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reativar pesquisador</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {researcher.status === 'active' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => onToggleStatus(researcher.id, false)}>
                            <XCircle className="h-4 w-4 text-gray-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Inativar pesquisador</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Anterior
          </Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Próximo
          </Button>
        </div>

        <DeleteResearcherDialog
          isOpen={showDeleteDialog}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          researcher={researcherToDelete}
        />
      </div>
    </TooltipProvider>
  );
}
