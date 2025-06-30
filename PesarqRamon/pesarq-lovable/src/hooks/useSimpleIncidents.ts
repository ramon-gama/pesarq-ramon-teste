
import { useState, useEffect } from 'react';
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

export function useSimpleIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('organization_id', '00000000-0000-0000-0000-000000000001')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
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
  };

  const deleteIncident = async (id: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Não precisamos mais recarregar manualmente, o realtime fará isso
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
  };

  const updateIncidentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Não precisamos mais recarregar manualmente, o realtime fará isso
    } catch (error) {
      console.error('Error updating incident status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do incidente.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchIncidents();

    // Configurar escuta em tempo real para TODOS os eventos (INSERT, UPDATE, DELETE)
    const channelName = `incidents-changes-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*', // Escuta TODOS os eventos
          schema: 'public',
          table: 'incidents',
          filter: 'organization_id=eq.00000000-0000-0000-0000-000000000001'
        },
        (payload) => {
          console.log('Incident change detected:', payload.eventType, payload);
          fetchIncidents(); // Recarregar dados para qualquer mudança
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array to run only once

  return {
    incidents,
    loading,
    deleteIncident,
    updateIncidentStatus,
    refetch: fetchIncidents
  };
}
