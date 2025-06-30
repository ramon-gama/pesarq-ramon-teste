import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

interface ResearcherFormFieldsProps {
  formData: ResearcherFormData;
  setFormData: (updater: (prev: ResearcherFormData) => ResearcherFormData) => void;
  customSpecialization: string;
  setCustomSpecialization: (value: string) => void;
  availableGoals: string[];
  onGoalToggle: (goal: string) => void;
  onProjectToggle: (projectId: string) => void;
  projects: { id: string; title: string; goals?: string[] }[];
}

const COURSES = [
  "Administração",
  "Agronomia",
  "Análise e Desenvolvimento de Sistemas",
  "Antropologia",
  "Arquitetura e Urbanismo",
  "Arquivologia",
  "Artes Plásticas",
  "Artes Visuais",
  "Biblioteconomia",
  "Biologia",
  "Biomedicina",
  "Biotecnologia",
  "Ciência da Computação",
  "Ciência Política",
  "Ciências Contábeis",
  "Ciências Econômicas",
  "Ciências Sociais",
  "Cinema",
  "Comunicação Organizacional",
  "Comunicação Social",
  "Design",
  "Direito",
  "Educação Física",
  "Enfermagem",
  "Engenharia Aeroespacial",
  "Engenharia Agrícola",
  "Engenharia Ambiental",
  "Engenharia Automotiva",
  "Engenharia Civil",
  "Engenharia da Computação",
  "Engenharia de Alimentos",
  "Engenharia de Controle e Automação",
  "Engenharia de Energia",
  "Engenharia de Gestão de Políticas Públicas",
  "Engenharia de Produção",
  "Engenharia de Redes de Comunicação",
  "Engenharia de Software",
  "Engenharia Elétrica",
  "Engenharia Eletrônica",
  "Engenharia Florestal",
  "Engenharia Mecânica",
  "Engenharia Mecatrônica",
  "Engenharia Química",
  "Estatística",
  "Farmácia",
  "Filosofia",
  "Física",
  "Fisioterapia",
  "Fonoaudiologia",
  "Geografia",
  "Geologia",
  "Gestão Pública",
  "História",
  "Jornalismo",
  "Letras",
  "Matemática",
  "Medicina",
  "Medicina Veterinária",
  "Museologia",
  "Música",
  "Nutrição",
  "Odontologia",
  "Pedagogia",
  "Psicologia",
  "Publicidade e Propaganda",
  "Química",
  "Relações Internacionais",
  "Serviço Social",
  "Sistemas de Informação",
  "Sociologia",
  "Teatro",
  "Terapia Ocupacional",
  "Turismo",
  "Outro"
];

const FUNCTIONS = [
  "Pesquisador Sênior",
  "Pesquisador", 
  "Apoio Técnico",
  "Apoio Operacional"
];

const ACADEMIC_LEVELS = [
  "Graduação",
  "Especialização", 
  "Graduado",
  "Mestrado",
  "Doutorado"
];

const ACADEMIC_STATUS = [
  "Em andamento",
  "Concluído"
];

const INSTITUTIONS = [
  "Universidade de Brasília (UnB)",
  "Outra Instituição de Ensino"
];

const MODALITIES = [
  { value: "presencial", label: "Presencial" },
  { value: "semipresencial", label: "Semipresencial" },
  { value: "online", label: "Online" }
];

export function ResearcherFormFields({
  formData,
  setFormData,
  customSpecialization,
  setCustomSpecialization,
  availableGoals,
  onGoalToggle,
  onProjectToggle,
  projects
}: ResearcherFormFieldsProps) {
  const [courseSearchOpen, setCourseSearchOpen] = useState(false);

  return (
    <>
      {/* Informações Pessoais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações Pessoais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(61) 99999-9999"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Instituição</Label>
            <Select 
              value={formData.institution} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, institution: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a instituição" />
              </SelectTrigger>
              <SelectContent>
                {INSTITUTIONS.map(inst => (
                  <SelectItem key={inst} value={inst}>
                    {inst}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="function">Função no Projeto</Label>
            <Select 
              value={formData.function} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, function: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                {FUNCTIONS.map(func => (
                  <SelectItem key={func} value={func}>
                    {func}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lattes_url">Link do Currículo Lattes</Label>
          <Input
            id="lattes_url"
            type="url"
            placeholder="http://lattes.cnpq.br/..."
            value={formData.lattes_url}
            onChange={(e) => setFormData(prev => ({ ...prev, lattes_url: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* Formação Acadêmica */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Formação Acadêmica</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="academic_level">Nível Acadêmico</Label>
            <Select 
              value={formData.academic_level} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, academic_level: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                {ACADEMIC_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="academic_status">Status</Label>
            <Select 
              value={formData.academic_status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, academic_status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {ACADEMIC_STATUS.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="course">
              {formData.academic_level === "Graduação" || formData.academic_level === "Graduado" ? "Curso" : "Área"}
            </Label>
            <Popover open={courseSearchOpen} onOpenChange={setCourseSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={courseSearchOpen}
                  className="w-full justify-between"
                >
                  {formData.course || "Selecione o curso..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar curso..." />
                  <CommandList>
                    <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
                    <CommandGroup>
                      {COURSES.map((course) => (
                        <CommandItem
                          key={course}
                          value={course}
                          onSelect={(currentValue) => {
                            setFormData(prev => ({ ...prev, course: currentValue === formData.course ? "" : currentValue }));
                            setCourseSearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.course === course ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {course}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {formData.academic_level === "Especialização" && (
          <div className="space-y-2">
            <Label htmlFor="specialization">Especialização</Label>
            <Input
              id="specialization"
              placeholder="Digite a especialização"
              value={customSpecialization}
              onChange={(e) => setCustomSpecialization(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Informações do Projeto */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vinculação aos Projetos</h3>
        <div className="space-y-2">
          <Label>Projetos (pode selecionar múltiplos)</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
            {projects.filter(project => project.id && project.title).map(project => (
              <div key={project.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`project-${project.id}`}
                  checked={formData.project_ids.includes(project.id)}
                  onCheckedChange={() => onProjectToggle(project.id)}
                />
                <Label htmlFor={`project-${project.id}`} className="text-sm">
                  {project.title}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {availableGoals.length > 0 && (
          <div className="space-y-2">
            <Label>Metas dos Projetos Selecionados</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
              {availableGoals.filter(goal => goal && goal.trim() !== "").map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`goal-${index}`}
                    checked={formData.selected_goals.includes(goal)}
                    onCheckedChange={() => onGoalToggle(goal)}
                  />
                  <Label htmlFor={`goal-${index}`} className="text-sm">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Período e Carga Horária */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Período e Carga Horária</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Data de Início</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Data de Fim</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="workload">Carga Horária (h/semana)</Label>
            <Input
              id="workload"
              type="number"
              value={formData.workload}
              onChange={(e) => setFormData(prev => ({ ...prev, workload: Number(e.target.value) }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shift">Turno</Label>
            <Select 
              value={formData.shift} 
              onValueChange={(value: "manha" | "tarde") => setFormData(prev => ({ ...prev, shift: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manha">Manhã</SelectItem>
                <SelectItem value="tarde">Tarde</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Modalidade</Label>
            <RadioGroup
              value={formData.modality}
              onValueChange={(value: "presencial" | "semipresencial" | "online") => 
                setFormData(prev => ({ ...prev, modality: value }))
              }
            >
              <div className="grid grid-cols-3 gap-4">
                {MODALITIES.map((modality) => (
                  <div key={modality.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={modality.value} id={modality.value} />
                    <Label htmlFor={modality.value} className="text-sm">
                      {modality.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="observations">Observações</Label>
          <Textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
            rows={2}
          />
        </div>
      </div>
    </>
  );
}
