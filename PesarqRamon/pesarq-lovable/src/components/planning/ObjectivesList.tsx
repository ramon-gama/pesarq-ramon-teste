
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Calendar, ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CreateObjectiveModal } from "./CreateObjectiveModal";
import { CreateActionModal } from "./CreateActionModal";
import { ActionsList } from "./ActionsList";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useStrategicPlanning, StrategicPlanObjective } from "@/hooks/useStrategicPlanning";

interface ObjectivesListProps {
  planId: string;
}

export function ObjectivesList({ planId }: ObjectivesListProps) {
  const { 
    objectives, 
    fetchObjectives, 
    deleteObjective 
  } = useStrategicPlanning();
  
  const [openObjectives, setOpenObjectives] = useState<string[]>([]);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StrategicPlanObjective | null>(null);
  const [currentObjectiveId, setCurrentObjectiveId] = useState<string>("");
  const [fetchedPlans, setFetchedPlans] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (planId && !fetchedPlans.has(planId)) {
      console.log('ObjectivesList: Fetching objectives for planId:', planId);
      fetchObjectives(planId);
      setFetchedPlans(prev => new Set(prev).add(planId));
    }
  }, [planId, fetchObjectives, fetchedPlans]);

  const toggleObjective = (objectiveId: string) => {
    console.log('Toggling objective:', objectiveId);
    setOpenObjectives(prev => 
      prev.includes(objectiveId) 
        ? prev.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "delayed":
        return <Badge className="bg-red-100 text-red-800">Atrasado</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  const handleDeleteObjective = async (objectiveId: string) => {
    console.log('Deleting objective:', objectiveId);
    await deleteObjective(objectiveId, planId);
  };

  const currentObjectives = objectives.filter(obj => obj.plan_id === planId);

  console.log('ObjectivesList render - planId:', planId, 'objectives:', currentObjectives.length);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Objetivos Estratégicos</h2>
          <p className="text-gray-600 text-sm">
            Gerencie os objetivos. O controle detalhado será feito através das ações.
          </p>
        </div>
        <Button 
          className="bg-[#15AB92] hover:bg-[#0d8f7a]"
          onClick={() => {
            console.log('Opening objective modal for planId:', planId);
            setShowObjectiveModal(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Objetivo
        </Button>
      </div>

      <div className="space-y-4">
        {currentObjectives.length > 0 ? currentObjectives.map((objective) => (
          <Card key={objective.id}>
            <Collapsible
              open={openObjectives.includes(objective.id)}
              onOpenChange={() => toggleObjective(objective.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {openObjectives.includes(objective.id) ? (
                        <ChevronDown className="h-5 w-5 mt-1 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mt-1 text-gray-500" />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5 text-[#15AB92]" />
                          {objective.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {objective.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingObjective(objective);
                            setShowObjectiveModal(true);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Objetivo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este objetivo? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteObjective(objective.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{objective.progress}%</div>
                        <Progress value={objective.progress} className="w-20 mt-1" />
                      </div>
                      {getStatusBadge(objective.status || 'in_progress')}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  {/* Objective Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Período</div>
                        <div className="text-sm font-medium">
                          {objective.start_date && objective.end_date 
                            ? `${new Date(objective.start_date).toLocaleDateString('pt-BR')} - ${new Date(objective.end_date).toLocaleDateString('pt-BR')}`
                            : 'Não definido'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="text-sm font-medium">
                          {objective.completed ? 'Concluído' : 'Em progresso'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Planos de Ação</h4>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          console.log('Opening action modal for objective:', objective.id);
                          setCurrentObjectiveId(objective.id);
                          setShowActionModal(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Ação
                      </Button>
                    </div>

                    <ActionsList objectiveId={objective.id} />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )) : (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum objetivo cadastrado</h3>
              <p className="text-gray-600 mb-4">Comece criando o primeiro objetivo estratégico</p>
              <Button 
                onClick={() => setShowObjectiveModal(true)}
                className="bg-[#15AB92] hover:bg-[#0d8f7a]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Objetivo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateObjectiveModal 
        open={showObjectiveModal} 
        onOpenChange={(open) => {
          setShowObjectiveModal(open);
          if (!open) setEditingObjective(null);
        }}
        planId={planId}
        editingObjective={editingObjective}
      />

      <CreateActionModal
        open={showActionModal}
        onOpenChange={(open) => {
          setShowActionModal(open);
          if (!open) setCurrentObjectiveId("");
        }}
        objectiveId={currentObjectiveId}
      />
    </div>
  );
}
