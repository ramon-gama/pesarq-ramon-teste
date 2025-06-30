
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { CUSTOM_UNITS } from "@/types/service";
import { Save, X } from "lucide-react";

interface ServiceTypeRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTypeName?: string;
}

export function ServiceTypeRequestModal({ 
  open, 
  onOpenChange, 
  initialTypeName = "" 
}: ServiceTypeRequestModalProps) {
  const { currentOrganization } = useOrganizationContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    requested_type_name: initialTypeName,
    description: '',
    justification: '',
    suggested_unit: '',
    suggested_indicator: '',
    examples: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOrganization) {
      toast({
        title: "Erro",
        description: "Selecione uma organização primeiro.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.requested_type_name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do tipo de serviço é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Preparar dados apenas com campos necessários - sem UUIDs que causam problema
      const requestData = {
        requested_type_name: formData.requested_type_name.trim(),
        description: formData.description.trim() || null,
        justification: formData.justification.trim() || null,
        suggested_unit: formData.suggested_unit || null,
        suggested_indicator: formData.suggested_indicator.trim() || null,
        examples: formData.examples.trim() || null,
        organization_id: currentOrganization.id,
        requested_by: user.id,
        status: 'pending'
      };

      console.log('📝 Enviando solicitação de novo tipo:', requestData);

      const { error } = await supabase
        .from('service_type_requests')
        .insert(requestData);

      if (error) {
        console.error('❌ Erro ao inserir solicitação:', error);
        throw error;
      }

      console.log('✅ Solicitação enviada com sucesso');

      toast({
        title: "Solicitação Enviada",
        description: "Sua solicitação foi enviada para análise dos administradores.",
      });

      // Reset form and close modal
      setFormData({
        requested_type_name: '',
        description: '',
        justification: '',
        suggested_unit: '',
        suggested_indicator: '',
        examples: ''
      });
      onOpenChange(false);

    } catch (error) {
      console.error('❌ Erro ao enviar solicitação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Atualizar o initialTypeName quando o modal abrir
  useState(() => {
    if (open && initialTypeName && !formData.requested_type_name) {
      setFormData(prev => ({ ...prev, requested_type_name: initialTypeName }));
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Novo Tipo de Serviço</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para solicitar a criação de um novo tipo de serviço arquivístico.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requested_type_name">Nome do Tipo de Serviço *</Label>
            <Input
              id="requested_type_name"
              value={formData.requested_type_name}
              onChange={(e) => setFormData({ ...formData, requested_type_name: e.target.value })}
              placeholder="Ex: Digitalização Avançada de Documentos"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva brevemente o que este tipo de serviço abrange..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justificativa</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              placeholder="Por que este novo tipo de serviço é necessário?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="suggested_unit">Unidade de Medida Sugerida</Label>
              <Select 
                value={formData.suggested_unit} 
                onValueChange={(value) => setFormData({ ...formData, suggested_unit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOM_UNITS.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggested_indicator">Indicador Sugerido</Label>
              <Input
                id="suggested_indicator"
                value={formData.suggested_indicator}
                onChange={(e) => setFormData({ ...formData, suggested_indicator: e.target.value })}
                placeholder="Ex: DIG, CLASS, ORG"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="examples">Exemplos de Uso</Label>
            <Textarea
              id="examples"
              value={formData.examples}
              onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
              placeholder="Forneça alguns exemplos práticos de quando este tipo de serviço seria usado..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
