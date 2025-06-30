
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

interface ProjectTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  type: "project" | "goal" | "activity";
  responsible?: string;
  parent?: string;
}

interface ProjectGanttChartProps {
  project: any;
  showGoals?: boolean;
}

export function ProjectGanttChart({ project, showGoals = false }: ProjectGanttChartProps) {
  // Função para calcular a posição e largura das barras
  const calculateBarPosition = (startDate: string, endDate: string, projectStart: string, projectEnd: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const projStart = new Date(projectStart);
    const projEnd = new Date(projectEnd);
    
    const totalDuration = projEnd.getTime() - projStart.getTime();
    const taskStart = start.getTime() - projStart.getTime();
    const taskDuration = end.getTime() - start.getTime();
    
    const leftPercent = Math.max(0, (taskStart / totalDuration) * 100);
    const widthPercent = Math.min(100 - leftPercent, (taskDuration / totalDuration) * 100);
    
    return { left: leftPercent, width: widthPercent };
  };

  // Função para gerar os meses do projeto
  const generateMonths = (startDate: string, endDate: string) => {
    const months = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    
    while (current <= end) {
      months.push({
        month: current.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        date: new Date(current)
      });
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  const months = generateMonths(project.startDate, project.endDate);
  const projectDurationDays = Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24));

  // Preparar tarefas para o Gantt
  const tasks: ProjectTask[] = [
    {
      id: project.id,
      name: project.title,
      startDate: project.startDate,
      endDate: project.endDate,
      progress: project.progress || 35,
      type: "project"
    }
  ];

  // Adicionar metas se solicitado
  if (showGoals && project.goals) {
    project.goals.forEach((goal: any) => {
      tasks.push({
        id: goal.id,
        name: `Meta ${goal.number}: ${goal.description}`,
        startDate: goal.startDate,
        endDate: goal.endDate,
        progress: goal.progress || Math.random() * 100,
        type: "goal",
        responsible: goal.responsible,
        parent: project.id
      });
    });
  }

  const getTaskColor = (type: string) => {
    switch (type) {
      case "project": return "bg-blue-500";
      case "goal": return "bg-green-500";
      case "activity": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getTaskColorDark = (type: string) => {
    switch (type) {
      case "project": return "bg-blue-600";
      case "goal": return "bg-green-600";
      case "activity": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          Cronograma Gantt - {showGoals ? "Metas" : "Projeto"}
          <Badge variant="outline" className="ml-2 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {projectDurationDays} dias
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <div className="space-y-4 overflow-x-auto">
          {/* Cabeçalho dos meses - Responsivo */}
          <div className="flex border-b-2 pb-3 min-w-fit">
            <div className="w-64 sm:w-80 font-semibold text-sm">Atividade</div>
            <div className="flex-1 min-w-96">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}>
                {months.map((month, index) => (
                  <div key={index} className="text-xs text-center font-semibold py-1 px-2 bg-gray-50 rounded">
                    {month.month}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-16 sm:w-20 text-center font-semibold text-sm">Progresso</div>
          </div>

          {/* Tarefas */}
          <div className="space-y-4 min-w-fit">
            {tasks.map((task) => {
              const barPosition = calculateBarPosition(
                task.startDate,
                task.endDate,
                project.startDate,
                project.endDate
              );

              const taskDurationDays = Math.ceil((new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={task.id} className="flex items-center min-w-fit">
                  {/* Nome da tarefa */}
                  <div className="w-64 sm:w-80 pr-4">
                    <div className={`${task.type === "goal" ? "ml-4 border-l-2 border-green-200 pl-3" : ""}`}>
                      <div className="font-semibold text-sm mb-1 line-clamp-2">{task.name}</div>
                      {task.responsible && (
                        <div className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                          <User className="h-3 w-3" />
                          {task.responsible}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{new Date(task.startDate).toLocaleDateString('pt-BR')}</span>
                        <span>→</span>
                        <span>{new Date(task.endDate).toLocaleDateString('pt-BR')}</span>
                        <Badge variant="outline" className="text-xs ml-1">
                          {taskDurationDays}d
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Barra do Gantt */}
                  <div className="flex-1 relative h-10 bg-gray-100 rounded-lg border min-w-96">
                    {/* Grid de tempo */}
                    <div className="absolute inset-0 grid gap-1" style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}>
                      {months.map((_, index) => (
                        <div key={index} className="border-r border-gray-200 last:border-r-0" />
                      ))}
                    </div>
                    
                    {/* Barra principal */}
                    <div
                      className={`absolute top-1 h-8 ${getTaskColor(task.type)} rounded-md border-2 border-white shadow-sm`}
                      style={{
                        left: `${barPosition.left}%`,
                        width: `${barPosition.width}%`
                      }}
                    >
                      {/* Barra de progresso */}
                      <div
                        className={`h-full ${getTaskColorDark(task.type)} rounded-sm opacity-80`}
                        style={{ width: `${task.progress}%` }}
                      />
                      {/* Label de progresso dentro da barra */}
                      {barPosition.width > 15 && (
                        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                          {Math.round(task.progress)}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progresso */}
                  <div className="w-16 sm:w-20 text-center">
                    <Badge 
                      variant={task.progress >= 100 ? "default" : task.progress >= 50 ? "secondary" : "outline"} 
                      className="text-xs font-semibold"
                    >
                      {Math.round(task.progress)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legenda melhorada */}
          <div className="flex flex-wrap gap-4 pt-4 border-t bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded border-2 border-white shadow-sm"></div>
              <span className="text-xs font-medium">Projeto</span>
            </div>
            {showGoals && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded border-2 border-white shadow-sm"></div>
                <span className="text-xs font-medium">Metas</span>
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-4 h-2 bg-gray-300 rounded"></div>
              <span className="text-xs text-gray-600">Planejado</span>
              <div className="w-4 h-2 bg-blue-600 rounded ml-2"></div>
              <span className="text-xs text-gray-600">Executado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
