
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Target, Eye, UserCheck, Download } from "lucide-react";
import { useStrategicPlanning, StrategicPlan } from "@/hooks/useStrategicPlanning";
import { ImportMissionVisionModal } from "./ImportMissionVisionModal";

interface EditPlanDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  plan: StrategicPlan | null;
}

export function EditPlanDetailsModal({ open, onOpenChange, organizationId, plan }: EditPlanDetailsModalProps) {
  const { updatePlan } = useStrategicPlanning(organizationId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  // Initialize values when plan changes
  useEffect(() => {
    if (plan) {
      setValues(plan.values || []);
      setMission(plan.mission || "");
      setVision(plan.vision || "");
    } else {
      setValues([]);
      setMission("");
      setVision("");
    }
  }, [plan]);

  const addValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValues([...values, newValue.trim()]);
      setNewValue("");
    }
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleImport = (importedMission: string, importedVision: string, importedValues: string[]) => {
    setMission(importedMission);
    setVision(importedVision);
    setValues(importedValues);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!plan) return;
    
    setIsSubmitting(true);

    // Enviar apenas os campos específicos de missão, visão e valores
    const updateData = {
      mission: mission,
      vision: vision,
      values: values,
    };

    const result = await updatePlan(plan.id, updateData);
    
    if (result) {
      onOpenChange(false);
    }
    
    setIsSubmitting(false);
  };

  if (!plan) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#15AB92]" />
              Editar Missão, Visão e Valores
            </DialogTitle>
            <DialogDescription>
              Defina a missão, visão e valores específicos para este planejamento estratégico.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowImportModal(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Importar de outro planejamento
              </Button>
            </div>

            <Tabs defaultValue="mission" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mission" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Missão
                </TabsTrigger>
                <TabsTrigger value="vision" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visão
                </TabsTrigger>
                <TabsTrigger value="values" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Valores
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mission" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Missão do Planejamento</CardTitle>
                    <CardDescription>
                      Defina o propósito e razão de ser deste planejamento estratégico.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      placeholder="Ex: Promover a excelência na gestão documental e arquivística..."
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vision" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Visão do Planejamento</CardTitle>
                    <CardDescription>
                      Descreva onde este planejamento quer chegar no futuro.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      placeholder="Ex: Ser referência nacional em gestão arquivística digital..."
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="values" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Valores do Planejamento</CardTitle>
                    <CardDescription>
                      Defina os princípios e valores que guiam este planejamento.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Digite um valor (ex: Transparência)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addValue();
                          }
                        }}
                      />
                      <Button type="button" onClick={addValue} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {values.map((value, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#15AB92] rounded-full"></div>
                            {value}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeValue(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {values.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Nenhum valor adicionado ainda. Use o campo acima para adicionar valores.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ImportMissionVisionModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        organizationId={organizationId}
        onImport={handleImport}
      />
    </>
  );
}
