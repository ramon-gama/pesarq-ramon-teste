
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Target, Eye, UserCheck } from "lucide-react";
import { useStrategicPlanning, StrategicPlan } from "@/hooks/useStrategicPlanning";

interface ImportMissionVisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  onImport: (mission: string, vision: string, values: string[]) => void;
}

export function ImportMissionVisionModal({ 
  open, 
  onOpenChange, 
  organizationId, 
  onImport 
}: ImportMissionVisionModalProps) {
  const { plans } = useStrategicPlanning(organizationId);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // Filter plans that have mission, vision or values
  const plansWithMissionVision = plans.filter(plan => 
    plan.mission || plan.vision || (plan.values && plan.values.length > 0)
  );

  const selectedPlan = plansWithMissionVision.find(plan => plan.id === selectedPlanId);

  const handleImport = () => {
    if (selectedPlan) {
      onImport(
        selectedPlan.mission || '',
        selectedPlan.vision || '',
        selectedPlan.values || []
      );
      onOpenChange(false);
      setSelectedPlanId("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[#15AB92]" />
            Importar Missão, Visão e Valores
          </DialogTitle>
          <DialogDescription>
            Selecione um planejamento existente para importar sua missão, visão e valores.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Planejamento de Origem</label>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um planejamento..." />
              </SelectTrigger>
              <SelectContent>
                {plansWithMissionVision.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPlan && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Preview dos dados que serão importados:</h3>
              
              {selectedPlan.mission && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#15AB92]" />
                      Missão
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{selectedPlan.mission}</p>
                  </CardContent>
                </Card>
              )}

              {selectedPlan.vision && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#15AB92]" />
                      Visão
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{selectedPlan.vision}</p>
                  </CardContent>
                </Card>
              )}

              {selectedPlan.values && selectedPlan.values.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#15AB92]" />
                      Valores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {selectedPlan.values.map((value, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#15AB92] rounded-full"></div>
                          {value}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {plansWithMissionVision.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Nenhum planejamento com missão, visão ou valores encontrado.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedPlanId}
          >
            Importar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
