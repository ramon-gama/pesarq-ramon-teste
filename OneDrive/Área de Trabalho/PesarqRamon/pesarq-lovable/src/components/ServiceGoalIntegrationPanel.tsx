
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useServiceGoalIntegration } from "@/hooks/useServiceGoalIntegration";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { Activity, Target, CheckCircle } from "lucide-react";

export function ServiceGoalIntegrationPanel() {
  const { currentOrganization } = useOrganizationContext();
  const { registerServiceAndUpdateGoals, SERVICE_TO_GOAL_MAPPING } = useServiceGoalIntegration();
  
  const [formData, setFormData] = useState({
    type: '',
    target_sector: '',
    quantity: 1,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOrganization?.id) {
      alert('Selecione uma organização primeiro');
      return;
    }

    if (!formData.type || !formData.target_sector) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await registerServiceAndUpdateGoals(formData);
      
      setSuccessMessage(`Serviço de ${SERVICE_TO_GOAL_MAPPING[formData.type as keyof typeof SERVICE_TO_GOAL_MAPPING]} registrado e metas atualizadas com sucesso!`);
      
      // Limpar formulário
      setFormData({
        type: '',
        target_sector: '',
        quantity: 1,
        description: ''
      });

      // Limpar mensagem após 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Erro ao registrar serviço:', error);
      alert('Erro ao registrar serviço. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Registrar Serviço e Atualizar Metas
        </CardTitle>
        <CardDescription>
          Registre um serviço realizado e as metas relacionadas serão atualizadas automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_type">Tipo de Serviço *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SERVICE_TO_GOAL_MAPPING).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="target_sector">Setor Atendido *</Label>
              <Input
                id="target_sector"
                value={formData.target_sector}
                onChange={(e) => setFormData(prev => ({ ...prev, target_sector: e.target.value }))}
                placeholder="Nome do setor"
                required
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Descreva os detalhes do serviço realizado..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start gap-2">
              <Target className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Como funciona a integração:</h4>
                <ul className="text-sm text-blue-800 mt-1 space-y-1">
                  <li>• O serviço será registrado no sistema</li>
                  <li>• Metas com escopo físico relacionado serão identificadas</li>
                  <li>• As quantidades atuais das metas serão incrementadas</li>
                  <li>• Metas com progresso automático terão seu percentual recalculado</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrar Serviço'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
