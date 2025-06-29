
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Target, Eye, UserCheck, Download } from "lucide-react";
import { useStrategicPlanning, StrategicPlan } from "@/hooks/useStrategicPlanning";
import { ImportMissionVisionModal } from "./ImportMissionVisionModal";

interface EditPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  plan: StrategicPlan | null;
}

export function EditPlanModal({ open, onOpenChange, organizationId, plan }: EditPlanModalProps) {
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

    const formData = new FormData(e.currentTarget);
    
    // Construir dados apenas com campos que foram preenchidos
    const planData: any = {};
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const duration = formData.get('duration') as string;
    const startDate = formData.get('start_date') as string;
    const status = formData.get('status') as string;
    
    // Apenas adicionar campos que não estão vazios
    if (name && name.trim()) planData.name = name.trim();
    if (description && description.trim()) planData.description = description.trim();
    if (duration && !isNaN(parseInt(duration))) planData.duration = parseInt(duration);
    if (startDate) planData.start_date = startDate;
    if (status) planData.status = status;
    
    // Sempre incluir missão, visão e valores (podem ser strings vazias)
    planData.mission = mission;
    planData.vision = vision;
    planData.values = values;

    console.log('Updating plan with data:', planData);

    const result = await updatePlan(plan.id, planData);
    
    if (result) {
      onOpenChange(false);
    }
    
    setIsSubmitting(false);
  };

  if (!plan) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Planejamento Estratégico</DialogTitle>
            <DialogDescription>
              Atualize as informações do planejamento estratégico.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="details">Missão, Visão e Valores</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Planejamento *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={plan.name}
                    placeholder="Ex: Planejamento Estratégico 2024-2026"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={plan.description || ''}
                    placeholder="Descrição do planejamento estratégico..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (anos) *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      max="10"
                      required
                      defaultValue={plan.duration}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start_date">Data de Início *</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      required
                      defaultValue={plan.start_date}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={plan.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
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

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#15AB92]" />
                        Missão
                      </CardTitle>
                      <CardDescription>
                        Defina o propósito e razão de ser deste planejamento.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={mission}
                        onChange={(e) => setMission(e.target.value)}
                        placeholder="Ex: Promover a excelência na gestão documental e arquivística..."
                        rows={3}
                        className="resize-none"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#15AB92]" />
                        Visão
                      </CardTitle>
                      <CardDescription>
                        Descreva onde este planejamento quer chegar no futuro.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={vision}
                        onChange={(e) => setVision(e.target.value)}
                        placeholder="Ex: Ser referência nacional em gestão arquivística digital..."
                        rows={3}
                        className="resize-none"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#15AB92]" />
                        Valores
                      </CardTitle>
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
                </div>
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
