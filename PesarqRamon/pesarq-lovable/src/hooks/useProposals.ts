
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Proposal {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada';
  tipo_projeto?: string;
  tipo_instrumento?: string;
  estimated_value?: number;
  estimated_duration_months?: number;
  submission_date: string;
  analysis_deadline?: string;
  external_link?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalDocument {
  id: string;
  proposal_id: string;
  title: string;
  type: string;
  status: string;
  document_number?: string;
  file_url?: string;
  value?: number;
  signed_date?: string;
  expiry_date?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { toast } = useToast();

  const fetchProposals = async () => {
    try {
      setLoading(true);
      console.log('Fetching all proposals');
      
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proposals:', error);
        throw error;
      }
      
      console.log('Fetched proposals data:', data);
      setProposals(data || []);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar propostas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async (proposalData: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating proposal with data:', proposalData);
      
      const { data, error } = await supabase
        .from('proposals')
        .insert([proposalData])
        .select()
        .single();

      if (error) {
        console.error('Error creating proposal:', error);
        throw error;
      }

      console.log('Created proposal:', data);
      toast({
        title: "Sucesso",
        description: "Proposta criada com sucesso",
      });

      setProposals(prev => [data, ...prev]);
      setLastUpdate(Date.now());
      return data;
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar proposta",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProposal = async (id: string, proposalData: Partial<Proposal>) => {
    try {
      console.log('Updating proposal:', id, proposalData);
      
      const { data, error } = await supabase
        .from('proposals')
        .update(proposalData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating proposal:', error);
        throw error;
      }

      console.log('Updated proposal:', data);
      toast({
        title: "Sucesso",
        description: "Proposta atualizada com sucesso",
      });

      setProposals(prev => prev.map(proposal => proposal.id === id ? data : proposal));
      setLastUpdate(Date.now());
      return data;
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar proposta",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteProposal = async (id: string) => {
    try {
      console.log('Deleting proposal:', id);
      
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting proposal:', error);
        throw error;
      }

      console.log('Deleted proposal:', id);
      toast({
        title: "Sucesso",
        description: "Proposta excluída com sucesso",
      });

      setProposals(prev => prev.filter(proposal => proposal.id !== id));
      setLastUpdate(Date.now());
      return true;
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir proposta",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return {
    proposals,
    loading,
    lastUpdate,
    createProposal,
    updateProposal,
    deleteProposal,
    refreshProposals: fetchProposals,
    refetch: fetchProposals
  };
}
