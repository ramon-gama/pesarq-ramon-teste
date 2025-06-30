
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { ProposalDocument } from './useProposals';

export function useProposalDocuments(proposalId?: string) {
  const [documents, setDocuments] = useState<ProposalDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async (propId?: string) => {
    if (!propId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('proposal_documents')
        .select('*')
        .eq('proposal_id', propId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Erro ao buscar documentos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: Omit<ProposalDocument, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('proposal_documents')
        .insert([documentData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchDocuments(documentData.proposal_id);
      return data;
    } catch (err) {
      console.error('Erro ao criar documento:', err);
      throw err;
    }
  };

  const updateDocument = async (id: string, updates: Partial<ProposalDocument>) => {
    try {
      const { data, error } = await supabase
        .from('proposal_documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (proposalId) {
        await fetchDocuments(proposalId);
      }
      return data;
    } catch (err) {
      console.error('Erro ao atualizar documento:', err);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('proposal_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      if (proposalId) {
        await fetchDocuments(proposalId);
      }
    } catch (err) {
      console.error('Erro ao deletar documento:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (proposalId) {
      fetchDocuments(proposalId);
    }
  }, [proposalId]);

  return {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    refetch: () => fetchDocuments(proposalId)
  };
}
