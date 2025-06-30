
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Filter, X } from "lucide-react";

interface ProjectFiltersProps {
  onFiltersChange: (filters: ProjectFilters) => void;
}

export interface ProjectFilters {
  projectId?: string;
  researcherId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  shift?: string;
}

export function ProjectFilters({ onFiltersChange }: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ProjectFilters>({});

  const mockProjects = [
    { id: "1", title: "Digitalização do Arquivo Nacional" },
    { id: "2", title: "Preservação Digital" },
    { id: "3", title: "Gestão Documental" }
  ];

  const mockResearchers = [
    { id: "1", name: "Ana Paula Santos" },
    { id: "2", name: "Carlos Silva" },
    { id: "3", name: "Maria Santos" },
    { id: "4", name: "João Oliveira" }
  ];

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    const newFilters = { ...filters };
    if (value && value !== "all") {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== "").length;

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Filtro por Projeto */}
              <div className="space-y-2">
                <Label htmlFor="project-filter">Projeto</Label>
                <Select 
                  value={filters.projectId || "all"} 
                  onValueChange={(value) => handleFilterChange('projectId', value)}
                >
                  <SelectTrigger id="project-filter">
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os projetos</SelectItem>
                    {mockProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Pesquisador */}
              <div className="space-y-2">
                <Label htmlFor="researcher-filter">Pesquisador</Label>
                <Select 
                  value={filters.researcherId || "all"} 
                  onValueChange={(value) => handleFilterChange('researcherId', value)}
                >
                  <SelectTrigger id="researcher-filter">
                    <SelectValue placeholder="Selecione um pesquisador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os pesquisadores</SelectItem>
                    {mockResearchers.map(researcher => (
                      <SelectItem key={researcher.id} value={researcher.id}>
                        {researcher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Data Inicial */}
              <div className="space-y-2">
                <Label htmlFor="start-date">Data Inicial</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>

              {/* Filtro por Data Final */}
              <div className="space-y-2">
                <Label htmlFor="end-date">Data Final</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>

              {/* Filtro por Status */}
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select 
                  value={filters.status || "all"} 
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="presente">Presente</SelectItem>
                    <SelectItem value="falta">Falta</SelectItem>
                    <SelectItem value="parcial">Parcial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Turno */}
              <div className="space-y-2">
                <Label htmlFor="shift-filter">Turno</Label>
                <Select 
                  value={filters.shift || "all"} 
                  onValueChange={(value) => handleFilterChange('shift', value)}
                >
                  <SelectTrigger id="shift-filter">
                    <SelectValue placeholder="Selecione um turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os turnos</SelectItem>
                    <SelectItem value="manha">Manhã</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botão para limpar filtros */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpar Filtros
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
