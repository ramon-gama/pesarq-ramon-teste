
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, Target, Calendar, User, FileText, Download } from "lucide-react";
import { ObjectivesList } from "./ObjectivesList";
import { CreateObjectiveModal } from "./CreateObjectiveModal";
import { TeamManagement } from "./TeamManagement";
import { useStrategicPlanning, StrategicPlan } from "@/hooks/useStrategicPlanning";
import { generateStrategicPlanPDF } from "@/utils/planningPdfGenerator";

interface PlanDetailsProps {
  plan: StrategicPlan;
  onBack: () => void;
}

export function PlanDetails({ plan, onBack }: PlanDetailsProps) {
  const { objectives, actions, fetchObjectives } = useStrategicPlanning();
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);

  useEffect(() => {
    if (plan.id) {
      fetchObjectives(plan.id);
    }
  }, [plan.id, fetchObjectives]);

  const planObjectives = objectives.filter(obj => obj.plan_id === plan.id);
  const totalObjectives = planObjectives.length;
  const completedObjectives = planObjectives.filter(obj => obj.completed).length;

  const handleExportPDF = () => {
    generateStrategicPlanPDF(plan, planObjectives, actions);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
            <p className="text-gray-600">{plan.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportPDF}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button
            onClick={() => setShowObjectiveModal(true)}
            className="bg-[#15AB92] hover:bg-[#0d8f7a]"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Objetivo
          </Button>
        </div>
      </div>

      {/* Resumo do Plano */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progresso Geral</p>
                <p className="text-2xl font-bold text-gray-900">{plan.progress}%</p>
              </div>
              <Target className="h-8 w-8 text-[#15AB92]" />
            </div>
            <Progress value={plan.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Objetivos</p>
                <p className="text-2xl font-bold text-gray-900">{completedObjectives}/{totalObjectives}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {totalObjectives > 0 ? `${Math.round((completedObjectives / totalObjectives) * 100)}% concluídos` : 'Nenhum objetivo'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Duração</p>
                <p className="text-2xl font-bold text-gray-900">{plan.duration}</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {plan.duration === 1 ? 'ano' : 'anos'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Missão, Visão e Valores */}
      {(plan.mission || plan.vision || (plan.values && plan.values.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#15AB92]" />
              Missão, Visão e Valores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.mission && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🎯 Missão</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{plan.mission}</p>
              </div>
            )}
            
            {plan.vision && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">👁️ Visão</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{plan.vision}</p>
              </div>
            )}
            
            {plan.values && plan.values.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">⭐ Valores</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {plan.values.map((value, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                      <div className="w-2 h-2 bg-[#15AB92] rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Objetivos Estratégicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[#15AB92]" />
            Objetivos Estratégicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ObjectivesList planId={plan.id} />
        </CardContent>
      </Card>

      {/* Equipe do Planejamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#15AB92]" />
            Equipe do Planejamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TeamManagement planId={plan.id} />
        </CardContent>
      </Card>

      <CreateObjectiveModal
        open={showObjectiveModal}
        onOpenChange={setShowObjectiveModal}
        planId={plan.id}
      />
    </div>
  );
}
