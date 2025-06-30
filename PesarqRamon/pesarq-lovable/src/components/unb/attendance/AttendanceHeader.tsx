
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClockIcon } from "lucide-react";

interface Project {
  id: string;
  title: string;
}

interface AttendanceHeaderProps {
  projects: Project[];
  selectedProject: string;
  selectedDate: string;
  selectedShift: 'manha' | 'tarde';
  submitting: boolean;
  pendingCount: number;
  canSubmit?: boolean;
  onProjectChange: (projectId: string) => void;
  onDateChange: (date: string) => void;
  onShiftChange: (shift: 'manha' | 'tarde') => void;
  onSubmit: () => void;
}

export function AttendanceHeader({
  projects,
  selectedProject,
  selectedDate,
  selectedShift,
  submitting,
  pendingCount,
  canSubmit = true,
  onProjectChange,
  onDateChange,
  onShiftChange,
  onSubmit
}: AttendanceHeaderProps) {
  console.log('AttendanceHeader - projects received:', projects?.length || 0);
  console.log('AttendanceHeader - projects data:', projects);
  console.log('AttendanceHeader - selectedProject:', selectedProject);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Controle de Frequência Diária
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project">Projeto *</Label>
            <Select value={selectedProject} onValueChange={onProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shift">Turno *</Label>
            <Select value={selectedShift} onValueChange={onShiftChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manha">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    Manhã
                  </div>
                </SelectItem>
                <SelectItem value="tarde">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    Tarde
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button 
              onClick={onSubmit}
              disabled={submitting || pendingCount === 0 || !canSubmit}
              className="w-full"
              variant={canSubmit && pendingCount > 0 ? "default" : "secondary"}
            >
              {submitting ? 'Salvando...' : 
               pendingCount === 0 ? 'Nenhum Pendente' :
               !canSubmit ? 'Defina todos os status' :
               `Salvar Frequência (${pendingCount})`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
