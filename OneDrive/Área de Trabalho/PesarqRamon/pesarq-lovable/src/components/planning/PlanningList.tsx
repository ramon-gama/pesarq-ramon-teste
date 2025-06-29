
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Edit, Trash2, Target, Users, Calendar, TrendingUp } from "lucide-react";
import { StrategicPlan } from "@/hooks/useStrategicPlanning";

interface PlanningListProps {
  plans: StrategicPlan[];
  onViewPlan: (plan: StrategicPlan) => void;
  onEditPlan: (plan: StrategicPlan) => void;
  onDeletePlan: (plan: StrategicPlan) => void;
}

export function PlanningList({ plans, onViewPlan, onEditPlan, onDeletePlan }: PlanningListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in_progress':
        return 'Em Andamento';
      case 'draft':
        return 'Rascunho';
      default:
        return status;
    }
  };

  if (!plans || plans.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum planejamento encontrado</h3>
          <p className="text-gray-600 mb-4">Comece criando seu primeiro planejamento estratégico.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Lista de Planejamentos ({plans.length})
        </h2>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 border-l-[#15AB92]">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 break-words">
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">
                    {plan.description || 'Sem descrição'}
                  </p>
                </div>
                <Badge className={`flex-shrink-0 border ${getStatusColor(plan.status)}`}>
                  {getStatusText(plan.status)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Progresso Geral</span>
                  <span className="text-sm font-bold text-[#15AB92]">{plan.progress || 0}%</span>
                </div>
                <Progress value={plan.progress || 0} className="h-2" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-600">Objetivos</span>
                  </div>
                  <p className="text-sm font-bold text-blue-600">
                    {plan.completedObjectives || 0}/{plan.objectives || 0}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-gray-600">Equipe</span>
                  </div>
                  <p className="text-sm font-bold text-purple-600">{plan.team || 0}</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-medium text-gray-600">Duração</span>
                  </div>
                  <p className="text-sm font-bold text-orange-600">
                    {plan.duration} ano{plan.duration > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                <Button
                  onClick={() => onViewPlan(plan)}
                  className="flex-1 bg-[#15AB92] hover:bg-[#0d8f7a] text-white"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar Detalhes
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEditPlan(plan)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                  
                  <Button
                    onClick={() => onDeletePlan(plan)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Excluir</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
