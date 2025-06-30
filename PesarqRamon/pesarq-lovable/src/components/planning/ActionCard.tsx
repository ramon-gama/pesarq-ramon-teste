
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, User, Calendar, TrendingUp, Target, Clock } from "lucide-react";
import { StrategicPlanAction } from "@/hooks/useStrategicPlanning";

interface ActionCardProps {
  action: StrategicPlanAction;
  onEdit: (action: StrategicPlanAction) => void;
  onDelete: (actionId: string) => void;
}

export function ActionCard({ action, onEdit, onDelete }: ActionCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Andamento</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case "delayed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Atrasado</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-400">
      <CardContent className="p-5">
        {/* Header com título e ações */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="truncate">{action.title}</span>
            </h4>
            {action.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{action.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(action)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(action.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Informações principais */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <span className="text-gray-500">Responsável:</span>
                <span className="font-medium ml-1">{action.responsible_person || 'Não definido'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <span className="text-gray-500">Tipo:</span>
                <span className="font-medium ml-1">
                  {action.progress_type === 'automatic' ? 'Automático' : 'Manual'}
                </span>
              </div>
            </div>
          </div>

          {(action.start_date || action.end_date) && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <span className="text-gray-500">Período:</span>
                <span className="font-medium ml-1">
                  {action.start_date && action.end_date 
                    ? `${new Date(action.start_date).toLocaleDateString('pt-BR')} - ${new Date(action.end_date).toLocaleDateString('pt-BR')}`
                    : action.start_date 
                      ? `Início: ${new Date(action.start_date).toLocaleDateString('pt-BR')}`
                      : action.end_date
                        ? `Término: ${new Date(action.end_date).toLocaleDateString('pt-BR')}`
                        : 'Não definido'
                  }
                </span>
              </div>
            </div>
          )}

          {action.service_type && (
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <span className="text-gray-500">Serviço:</span>
                <span className="font-medium ml-1 text-xs">{action.service_type}</span>
              </div>
            </div>
          )}

          {action.target_metric && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <span className="text-gray-500">Meta:</span>
                <span className="font-medium ml-1">
                  {action.target_metric} ({action.current_value || 0} concluído)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer com progresso e status */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{action.progress}%</span>
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getProgressColor(action.progress)}`}
                  style={{ width: `${action.progress}%` }}
                />
              </div>
            </div>
          </div>
          {getStatusBadge(action.status)}
        </div>
      </CardContent>
    </Card>
  );
}
