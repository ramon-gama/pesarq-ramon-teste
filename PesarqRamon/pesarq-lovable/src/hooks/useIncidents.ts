
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Incident {
  id: string;
  organization_id: string;
  title: string;
  type: string;
  date: string;
  severity: 'baixa' | 'moderada' | 'alta' | 'critica';
  status: 'novo' | 'em-tratamento' | 'resolvido' | 'sem-solucao';
  location: string | null;
  responsible: string | null;
  description: string;
  estimated_volume: string | null;
  consequences: string | null;
  measures_adopted: string | null;
  external_support: string | null;
  created_at: string;
  updated_at: string;
}

export interface IncidentReport {
  id: string;
  incident_id: string;
  final_report: string | null;
  identified_causes: string | null;
  corrective_actions: string | null;
  future_recommendations: string | null;
  closure_date: string | null;
  technical_responsible: string | null;
  status: 'em-andamento' | 'concluido' | 'pendente';
  created_at: string;
  updated_at: string;
}

export function useIncidents(organizationId?: string) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Buscando incidentes...');
      
      let query = supabase.from('incidents').select('*').order('created_at', { ascending: false });
      
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar incidentes:', error);
        throw error;
      }
      
      console.log('Incidentes carregados:', data);
      setIncidents(data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast({
        title: "Erro ao carregar incidentes",
        description: "Não foi possível carregar a lista de incidentes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [organizationId, toast]);

  const fetchIncidentReports = useCallback(async () => {
    try {
      console.log('Buscando relatórios de incidentes...');
      
      const { data, error } = await supabase
        .from('incident_reports')
        .select(`
          *,
          incidents!inner(title, id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar relatórios:', error);
        throw error;
      }
      
      console.log('Relatórios carregados:', data);
      setIncidentReports(data || []);
    } catch (error) {
      console.error('Error fetching incident reports:', error);
      toast({
        title: "Erro ao carregar relatórios",
        description: "Não foi possível carregar os relatórios de incidentes.",
        variant: "destructive"
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchIncidents();
    fetchIncidentReports();
  }, [fetchIncidents, fetchIncidentReports]);

  useEffect(() => {
    console.log('Configurando subscrições em tempo real...');
    
    const incidentsChannel = supabase
      .channel(`incidents-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents'
        },
        (payload) => {
          console.log('Mudança em tempo real - incidentes:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newIncident = payload.new as Incident;
            setIncidents(prev => {
              const exists = prev.some(inc => inc.id === newIncident.id);
              if (exists) return prev;
              return [newIncident, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedIncident = payload.new as Incident;
            setIncidents(prev => 
              prev.map(inc => 
                inc.id === updatedIncident.id ? updatedIncident : inc
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedIncident = payload.old as Incident;
            setIncidents(prev => 
              prev.filter(inc => inc.id !== deletedIncident.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Status subscrição incidentes:', status);
      });

    const reportsChannel = supabase
      .channel(`reports-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incident_reports'
        },
        (payload) => {
          console.log('Mudança em tempo real - relatórios:', payload);
          fetchIncidentReports();
        }
      )
      .subscribe((status) => {
        console.log('Status subscrição relatórios:', status);
      });

    return () => {
      console.log('Limpando subscrições...');
      supabase.removeChannel(incidentsChannel);
      supabase.removeChannel(reportsChannel);
    };
  }, [fetchIncidentReports]);

  const createIncident = useCallback(async (incidentData: Omit<Incident, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Criando incidente:', incidentData);
      
      const { data, error } = await supabase
        .from('incidents')
        .insert([incidentData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar incidente:', error);
        throw error;
      }

      console.log('Incidente criado:', data);

      const { error: reportError } = await supabase
        .from('incident_reports')
        .insert([{
          incident_id: data.id,
          status: 'em-andamento'
        }]);

      if (reportError) {
        console.error('Erro ao criar relatório inicial:', reportError);
      }

      return data;
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  }, []);

  const updateIncident = useCallback(async (id: string, updates: Partial<Incident>) => {
    try {
      console.log('Atualizando incidente:', id, updates);
      
      const { data, error } = await supabase
        .from('incidents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar incidente:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating incident:', error);
      throw error;
    }
  }, []);

  const deleteIncident = useCallback(async (id: string) => {
    try {
      console.log('Excluindo incidente:', id);
      
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir incidente:', error);
        throw error;
      }

      toast({
        title: "Incidente excluído",
        description: "O incidente foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting incident:', error);
      toast({
        title: "Erro ao excluir incidente",
        description: "Não foi possível excluir o incidente.",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const updateIncidentReport = useCallback(async (incidentId: string, reportData: Partial<IncidentReport>) => {
    try {
      console.log('Atualizando relatório:', incidentId, reportData);
      
      const { data, error } = await supabase
        .from('incident_reports')
        .update(reportData)
        .eq('incident_id', incidentId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar relatório:', error);
        throw error;
      }

      toast({
        title: "Relatório atualizado",
        description: "O relatório foi atualizado com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Error updating incident report:', error);
      toast({
        title: "Erro ao atualizar relatório",
        description: "Não foi possível atualizar o relatório.",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  return {
    incidents,
    incidentReports,
    loading,
    createIncident,
    updateIncident,
    deleteIncident,
    updateIncidentReport,
    fetchIncidents,
    fetchIncidentReports
  };
}
