
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { ResearcherFormFields } from "./researcher/ResearcherFormFields";
import { type Researcher } from "@/hooks/useResearchers";

interface ResearcherFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  course: string;
  function: string;
  academic_level: string;
  academic_status: string;
  specialization?: string;
  institution: string;
  lattes_url: string;
  project_ids: string[];
  start_date: string;
  end_date?: string;
  workload: number;
  shift: "manha" | "tarde";
  modality: "presencial" | "semipresencial" | "online";
  selected_goals: string[];
  observations: string;
}

interface ResearcherFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (researcherData: ResearcherFormData) => void;
  editingResearcher?: Researcher | null;
  projects: { id: string; title: string; goals?: string[] }[];
  isSubmitting?: boolean;
}

export function ResearcherForm({ 
  isOpen, 
  onClose, 
  onSave, 
  editingResearcher, 
  projects,
  isSubmitting = false
}: ResearcherFormProps) {
  const [formData, setFormData] = useState<ResearcherFormData>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    course: "",
    function: "",
    academic_level: "",
    academic_status: "",
    specialization: "",
    institution: "",
    lattes_url: "",
    project_ids: [],
    start_date: "",
    end_date: "",
    workload: 20,
    shift: "manha",
    modality: "presencial",
    selected_goals: [],
    observations: ""
  });

  const [customSpecialization, setCustomSpecialization] = useState("");

  useEffect(() => {
    if (editingResearcher) {
      setFormData({
        name: editingResearcher.name || "",
        email: editingResearcher.email || "",
        phone: editingResearcher.phone || "",
        cpf: editingResearcher.cpf || "",
        course: editingResearcher.course || "",
        function: editingResearcher.function || "",
        academic_level: editingResearcher.academic_level || "",
        academic_status: editingResearcher.academic_status || "",
        specialization: editingResearcher.specialization || "",
        institution: editingResearcher.institution || "",
        lattes_url: editingResearcher.lattes_url || "",
        project_ids: editingResearcher.project_id ? [editingResearcher.project_id] : [],
        start_date: editingResearcher.start_date || "",
        end_date: editingResearcher.end_date || "",
        workload: editingResearcher.workload || 20,
        shift: editingResearcher.shift || "manha",
        modality: editingResearcher.modality || "presencial",
        selected_goals: editingResearcher.selected_goals || [],
        observations: editingResearcher.observations || ""
      });
    } else {
      // Reset form for new researcher
      setFormData({
        name: "",
        email: "",
        phone: "",
        cpf: "",
        course: "",
        function: "",
        academic_level: "",
        academic_status: "",
        specialization: "",
        institution: "",
        lattes_url: "",
        project_ids: [],
        start_date: "",
        end_date: "",
        workload: 20,
        shift: "manha",
        modality: "presencial",
        selected_goals: [],
        observations: ""
      });
      setCustomSpecialization("");
    }
  }, [editingResearcher, isOpen]);

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      selected_goals: prev.selected_goals.includes(goal)
        ? prev.selected_goals.filter(g => g !== goal)
        : [...prev.selected_goals, goal]
    }));
  };

  const handleProjectToggle = (projectId: string) => {
    setFormData(prev => ({
      ...prev,
      project_ids: prev.project_ids.includes(projectId)
        ? prev.project_ids.filter(id => id !== projectId)
        : [...prev.project_ids, projectId]
    }));
  };

  const getAvailableGoals = () => {
    const allGoals: string[] = [];
    formData.project_ids.forEach(projectId => {
      const project = projects.find(p => p.id === projectId);
      if (project?.goals) {
        allGoals.push(...project.goals);
      }
    });
    return [...new Set(allGoals)]; // Remove duplicates
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    const finalData = {
      ...formData,
      specialization: formData.academic_level === "Especialização" 
        ? (customSpecialization || formData.specialization)
        : formData.specialization
    };
    onSave(finalData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {editingResearcher ? "Editar Pesquisador" : "Novo Pesquisador"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ResearcherFormFields
            formData={formData}
            setFormData={setFormData}
            customSpecialization={customSpecialization}
            setCustomSpecialization={setCustomSpecialization}
            availableGoals={getAvailableGoals()}
            onGoalToggle={handleGoalToggle}
            onProjectToggle={handleProjectToggle}
            projects={projects}
          />

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Pesquisador
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
