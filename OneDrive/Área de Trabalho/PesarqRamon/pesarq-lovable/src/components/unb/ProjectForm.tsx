
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings, Users, Target } from "lucide-react";
import { useProjectForm } from "@/hooks/useProjectForm";
import { ProjectGeneralTab } from "./ProjectGeneralTab";
import { ProjectDetailsTab } from "./ProjectDetailsTab";
import { ProjectTeamTab } from "./ProjectTeamTab";
import { ProjectGoalsTab } from "./ProjectGoalsTab";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useProposals } from "@/hooks/useProposals";
import { type Project } from "@/hooks/useProjects";
import { type Proposal } from "@/hooks/useProposals";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  proposal?: Proposal | null;
  isViewMode?: boolean;
}

export function ProjectForm({ isOpen, onClose, project, proposal, isViewMode = false }: ProjectFormProps) {
  const { organizations } = useOrganizations();
  const { proposals } = useProposals();
  
  const {
    formData,
    setFormData,
    newGoal,
    setNewGoal,
    isSubmitting,
    relatedProposal,
    handleProposalSelect,
    handleOrganizationChange,
    handleSubmit
  } = useProjectForm(project, proposal);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isViewMode) {
      onClose();
      return;
    }

    await handleSubmit(onClose);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const getDialogTitle = () => {
    if (isViewMode) {
      return `Visualizar Projeto: ${formData.title}`;
    }
    if (project) {
      return `Editar Projeto: ${formData.title}`;
    }
    if (proposal) {
      return `Novo Projeto (da Proposta: ${proposal.title})`;
    }
    return 'Novo Projeto';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Equipe
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Metas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <ProjectGeneralTab
                formData={formData}
                setFormData={setFormData}
                organizations={organizations}
                proposals={proposals}
                selectedProposalData={relatedProposal}
                onOrganizationChange={handleOrganizationChange}
                onProposalSelect={handleProposalSelect}
                isViewMode={isViewMode}
              />
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <ProjectDetailsTab
                formData={formData}
                setFormData={setFormData}
                isViewMode={isViewMode}
              />
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <ProjectTeamTab
                formData={formData}
                setFormData={setFormData}
                isViewMode={isViewMode}
              />
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              <ProjectGoalsTab
                formData={formData}
                setFormData={setFormData}
                newGoal={newGoal}
                setNewGoal={setNewGoal}
                isViewMode={isViewMode}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {isViewMode ? 'Fechar' : 'Cancelar'}
            </Button>
            {!isViewMode && (
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#15AB92] hover:bg-[#0d8f7a]"
              >
                {isSubmitting ? 'Salvando...' : project ? 'Atualizar' : 'Criar'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
