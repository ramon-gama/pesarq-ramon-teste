
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TeamMember {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  role: string;
  status: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export function useOrganizationTeam(organizationId: string) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTeam = async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organization_team')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name');

      if (error) throw error;
      setTeam(data || []);
    } catch (error) {
      console.error('Erro ao buscar equipe:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar equipe da organização",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTeamMember = async (memberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('organization_team')
        .insert([{ ...memberData, organization_id: organizationId }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Membro da equipe adicionado com sucesso",
      });

      await fetchTeam();
      return data;
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar membro da equipe",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTeamMember = async (id: string, memberData: Partial<TeamMember>) => {
    try {
      const { data, error } = await supabase
        .from('organization_team')
        .update(memberData)
        .eq('id', id)
        .eq('organization_id', organizationId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Membro da equipe atualizado com sucesso",
      });

      await fetchTeam();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar membro da equipe",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('organization_team')
        .delete()
        .eq('id', id)
        .eq('organization_id', organizationId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Membro da equipe removido com sucesso",
      });

      await fetchTeam();
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover membro da equipe",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [organizationId]);

  return {
    team,
    loading,
    fetchTeam,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
  };
}
