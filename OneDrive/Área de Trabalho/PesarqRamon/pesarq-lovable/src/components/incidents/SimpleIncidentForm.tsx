
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SimpleIncidentFormProps {
  onClose?: () => void;
  editingIncident?: any;
}

const INCIDENT_TYPES = [
  { value: "Riscos Físicos", label: "Riscos Físicos" },
  { value: "Perda ou Extravio", label: "Perda ou Extravio" },
  { value: "Falhas Tecnológicas", label: "Falhas Tecnológicas" },
  { value: "Acesso Indevido", label: "Acesso Indevido" },
  { value: "Violação da Integridade", label: "Violação da Integridade" },
  { value: "Desastres Naturais", label: "Desastres Naturais" },
  { value: "Infraestrutura Inadequada", label: "Infraestrutura Inadequada" },
  { value: "Erros Humanos", label: "Erros Humanos" }
];

const SEVERITY_LEVELS = [
  { value: "baixa", label: "Baixa", color: "bg-green-500 text-white" },
  { value: "moderada", label: "Moderada", color: "bg-yellow-500 text-white" },
  { value: "alta", label: "Alta", color: "bg-orange-500 text-white" },
  { value: "critica", label: "Crítica", color: "bg-red-500 text-white" }
];

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo", color: "bg-blue-500 text-white" },
  { value: "em-tratamento", label: "Em Tratamento", color: "bg-yellow-500 text-white" },
  { value: "resolvido", label: "Resolvido", color: "bg-green-500 text-white" },
  { value: "sem-solucao", label: "Sem Solução", color: "bg-gray-500 text-white" }
];

const EXTERNAL_SUPPORT_OPTIONS = [
  { value: "Não", label: "Não" },
  { value: "Sim - Apoio Técnico Especializado", label: "Sim - Apoio Técnico Especializado" },
  { value: "Sim - Serviços de Emergência", label: "Sim - Serviços de Emergência" },
  { value: "Sim - Suporte de TI", label: "Sim - Suporte de TI" },
  { value: "Sim - Outros", label: "Sim - Outros" }
];

export function SimpleIncidentForm({ onClose, editingIncident }: SimpleIncidentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const titleRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const responsibleRef = useRef<HTMLInputElement>(null);
  const estimatedVolumeRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const consequencesRef = useRef<HTMLTextAreaElement>(null);
  const measuresRef = useRef<HTMLTextAreaElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  
  const [type, setType] = useState(editingIncident?.type || "");
  const [severity, setSeverity] = useState(editingIncident?.severity || "");
  const [status, setStatus] = useState(editingIncident?.status || "novo");
  const [externalSupport, setExternalSupport] = useState(editingIncident?.external_support || "");

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const title = titleRef.current?.value || "";
    const description = descriptionRef.current?.value || "";
    const date = dateRef.current?.value || "";
    
    if (!title || !type || !date || !description || !severity) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const time = timeRef.current?.value || "12:00";
      let dateTimeString = `${date}T${time}:00`;

      const incidentData = {
        organization_id: '00000000-0000-0000-0000-000000000001',
        title,
        type,
        date: dateTimeString,
        severity: severity as any,
        status: status as any,
        location: locationRef.current?.value || null,
        responsible: responsibleRef.current?.value || null,
        description,
        estimated_volume: estimatedVolumeRef.current?.value || null,
        consequences: consequencesRef.current?.value || null,
        measures_adopted: measuresRef.current?.value || null,
        external_support: externalSupport || null
      };

      if (editingIncident) {
        const { error } = await supabase
          .from('incidents')
          .update(incidentData)
          .eq('id', editingIncident.id);

        if (error) throw error;

        toast({
          title: "Incidente atualizado com sucesso!",
          description: `O incidente "${incidentData.title}" foi atualizado.`
        });
      } else {
        const { error } = await supabase
          .from('incidents')
          .insert([incidentData]);

        if (error) throw error;

        toast({
          title: "Incidente registrado com sucesso!",
          description: `O incidente "${incidentData.title}" foi registrado.`
        });

        // Limpar formulário
        if (titleRef.current) titleRef.current.value = "";
        if (locationRef.current) locationRef.current.value = "";
        if (responsibleRef.current) responsibleRef.current.value = "";
        if (estimatedVolumeRef.current) estimatedVolumeRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";
        if (consequencesRef.current) consequencesRef.current.value = "";
        if (measuresRef.current) measuresRef.current.value = "";
        if (dateRef.current) dateRef.current.value = "";
        if (timeRef.current) timeRef.current.value = "";
        setType("");
        setSeverity("");
        setStatus("novo");
        setExternalSupport("");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingIncident ? "Editar Incidente" : "Registrar Novo Incidente"}</CardTitle>
        <CardDescription>
          {editingIncident ? "Edite as informações do incidente arquivístico." : "Preencha as informações do incidente arquivístico para registro e acompanhamento."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Incidente *</Label>
                <Input
                  id="title"
                  ref={titleRef}
                  defaultValue={editingIncident?.title || ''}
                  placeholder="Ex: Infiltração no Arquivo Setorial – Bloco A"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo de Incidente *</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de incidente" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCIDENT_TYPES.map((typeOption) => (
                      <SelectItem key={typeOption.value} value={typeOption.value}>
                        {typeOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date">Data do Incidente *</Label>
                  <Input
                    id="date"
                    ref={dateRef}
                    type="date"
                    defaultValue={editingIncident ? new Date(editingIncident.date).toISOString().split('T')[0] : ''}
                    max={getCurrentDate()}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Hora do Incidente</Label>
                  <Input
                    id="time"
                    ref={timeRef}
                    type="time"
                    defaultValue={editingIncident ? new Date(editingIncident.date).toTimeString().slice(0, 5) : ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Local do Incidente</Label>
                <Input
                  id="location"
                  ref={locationRef}
                  defaultValue={editingIncident?.location || ''}
                  placeholder="Ex: Arquivo Central - Sala 205"
                />
              </div>

              <div>
                <Label htmlFor="responsible">Responsável pelo Relato</Label>
                <Input
                  id="responsible"
                  ref={responsibleRef}
                  defaultValue={editingIncident?.responsible || ''}
                  placeholder="Ex: João Silva - Arquivo Central"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="severity">Classificação da Gravidade *</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a gravidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <Badge className={level.color}>{level.label}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingIncident && (
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((statusOption) => (
                        <SelectItem key={statusOption.value} value={statusOption.value}>
                          <Badge className={statusOption.color}>{statusOption.label}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="estimated_volume">Volume Estimado Afetado</Label>
                <Input
                  id="estimated_volume"
                  ref={estimatedVolumeRef}
                  defaultValue={editingIncident?.estimated_volume || ''}
                  placeholder="Ex: 50 metros lineares, 200 caixas"
                />
              </div>

              <div>
                <Label htmlFor="consequences">Consequências Imediatas</Label>
                <Textarea
                  id="consequences"
                  ref={consequencesRef}
                  defaultValue={editingIncident?.consequences || ''}
                  placeholder="Descreva as consequências observadas..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="measures_adopted">Medidas Adotadas</Label>
                <Textarea
                  id="measures_adopted"
                  ref={measuresRef}
                  defaultValue={editingIncident?.measures_adopted || ''}
                  placeholder="Descreva as medidas já tomadas..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="external_support">Necessidade de Apoio Externo</Label>
                <Select value={externalSupport} onValueChange={setExternalSupport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione se precisa de apoio externo" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXTERNAL_SUPPORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição Detalhada *</Label>
            <Textarea
              id="description"
              ref={descriptionRef}
              defaultValue={editingIncident?.description || ''}
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
      </CardContent>
    </Card>
  );
}
