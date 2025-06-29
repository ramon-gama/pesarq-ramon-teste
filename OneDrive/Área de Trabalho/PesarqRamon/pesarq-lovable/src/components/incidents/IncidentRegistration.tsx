
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIncidents } from "@/hooks/useIncidents";
import { useToast } from "@/hooks/use-toast";
import { IncidentFormFields } from "./IncidentFormFields";

interface IncidentRegistrationProps {
  isModal?: boolean;
  onClose?: () => void;
  editingIncident?: any;
}

const INCIDENT_TYPES = [
  { value: "Riscos Físicos", label: "Riscos Físicos", description: "Infiltração, mofo, incêndio, calor excessivo, infestação" },
  { value: "Perda ou Extravio", label: "Perda ou Extravio", description: "Extravio físico, perda de arquivos digitais, pastas não localizadas" },
  { value: "Falhas Tecnológicas", label: "Falhas Tecnológicas", description: "Perda de metadados, falha de backup, corrompimento de arquivos" },
  { value: "Acesso Indevido", label: "Acesso Indevido", description: "Acesso a documentos restritos, quebra de sigilo" },
  { value: "Violação da Integridade", label: "Violação da Integridade", description: "Alteração indevida de documentos, contaminação de mídias" },
  { value: "Desastres Naturais", label: "Desastres Naturais", description: "Enchentes, desabamento, tempestades, alagamentos" },
  { value: "Infraestrutura Inadequada", label: "Infraestrutura Inadequada", description: "Falta de climatização, mobiliário insuficiente, falta de EPI" },
  { value: "Erros Humanos", label: "Erros Humanos", description: "Classificação errada, eliminação indevida, não cumprimento de tabela" }
];

const SEVERITY_LEVELS = [
  { value: "baixa", label: "Baixa", color: "bg-green-100 text-green-800" },
  { value: "moderada", label: "Moderada", color: "bg-yellow-100 text-yellow-800" },
  { value: "alta", label: "Alta", color: "bg-orange-100 text-orange-800" },
  { value: "critica", label: "Crítica", color: "bg-red-100 text-red-800" }
];

const EXTERNAL_SUPPORT_OPTIONS = [
  { value: "Não", label: "Não" },
  { value: "Sim - Apoio Técnico Especializado", label: "Sim - Apoio Técnico Especializado" },
  { value: "Sim - Serviços de Emergência", label: "Sim - Serviços de Emergência" },
  { value: "Sim - Suporte de TI", label: "Sim - Suporte de TI" },
  { value: "Sim - Outros", label: "Sim - Outros" }
];

export function IncidentRegistration({ isModal = false, onClose, editingIncident }: IncidentRegistrationProps) {
  const { createIncident, updateIncident } = useIncidents();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    location: "",
    description: "",
    consequences: "",
    estimated_volume: "",
    severity: "",
    measures_adopted: "",
    external_support: "",
    responsible: ""
  });

  useEffect(() => {
    if (editingIncident) {
      const incidentDate = new Date(editingIncident.date);
      setFormData({
        title: editingIncident.title || "",
        type: editingIncident.type || "",
        date: incidentDate.toISOString().split('T')[0],
        time: incidentDate.toTimeString().slice(0, 5),
        location: editingIncident.location || "",
        description: editingIncident.description || "",
        consequences: editingIncident.consequences || "",
        estimated_volume: editingIncident.estimated_volume || "",
        severity: editingIncident.severity || "",
        measures_adopted: editingIncident.measures_adopted || "",
        external_support: editingIncident.external_support || "",
        responsible: editingIncident.responsible || ""
      });
    } else {
      setFormData({
        title: "",
        type: "",
        date: "",
        time: "",
        location: "",
        description: "",
        consequences: "",
        estimated_volume: "",
        severity: "",
        measures_adopted: "",
        external_support: "",
        responsible: ""
      });
    }
  }, [editingIncident]);

  const handleFieldChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.date || !formData.description || !formData.severity) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      let dateTimeString = formData.date;
      if (formData.time) {
        dateTimeString += `T${formData.time}:00`;
      } else {
        dateTimeString += "T12:00:00";
      }

      const incidentData = {
        organization_id: '00000000-0000-0000-0000-000000000001',
        title: formData.title,
        type: formData.type,
        date: dateTimeString,
        severity: formData.severity as any,
        status: editingIncident ? editingIncident.status : 'novo',
        location: formData.location || null,
        responsible: formData.responsible || null,
        description: formData.description,
        estimated_volume: formData.estimated_volume || null,
        consequences: formData.consequences || null,
        measures_adopted: formData.measures_adopted || null,
        external_support: formData.external_support || null
      };

      if (editingIncident) {
        await updateIncident(editingIncident.id, incidentData);
        toast({
          title: "Incidente atualizado com sucesso!",
          description: `O incidente "${incidentData.title}" foi atualizado.`
        });
      } else {
        await createIncident(incidentData);
        toast({
          title: "Incidente registrado com sucesso!",
          description: `O incidente "${incidentData.title}" foi registrado e será acompanhado.`
        });
      }

      if (!editingIncident) {
        setFormData({
          title: "",
          type: "",
          date: "",
          time: "",
          location: "",
          description: "",
          consequences: "",
          estimated_volume: "",
          severity: "",
          measures_adopted: "",
          external_support: "",
          responsible: ""
        });
      }

      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving incident:', error);
      toast({
        title: "Erro ao salvar incidente",
        description: "Não foi possível salvar o incidente. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <IncidentFormFields
        formData={formData}
        onFieldChange={handleFieldChange}
        incidentTypes={INCIDENT_TYPES}
        severityLevels={SEVERITY_LEVELS}
        externalSupportOptions={EXTERNAL_SUPPORT_OPTIONS}
      />

      <div>
        <Label htmlFor="description">Descrição Detalhada *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Descreva detalhadamente o incidente, incluindo contexto e extensão do problema..."
          rows={5}
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (editingIncident ? "Atualizando..." : "Registrando...") : (editingIncident ? "Atualizar Incidente" : "Registrar Incidente")}
        </Button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingIncident ? "Editar Incidente" : "Registrar Novo Incidente"}</DialogTitle>
            <DialogDescription>
              {editingIncident ? "Edite as informações do incidente arquivístico." : "Preencha as informações do incidente arquivístico para registro e acompanhamento."}
            </DialogDescription>
          </DialogHeader>
          <FormContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingIncident ? "Editar Incidente" : "Registrar Novo Incidente"}</CardTitle>
        <CardDescription>
          {editingIncident ? "Edite as informações do incidente arquivístico." : "Preencha as informações do incidente arquivístico para registro e acompanhamento."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  );
}
