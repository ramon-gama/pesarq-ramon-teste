
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectDocument {
  id: string;
  project_id: string;
  title: string;
  type: string;
  document_number?: string;
  file_url?: string;
  signed_date?: string;
  expiry_date?: string;
  value?: number;
  status: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export function useProjectDocuments() {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async (projectId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_documents')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setDocuments(data || []);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar documentos",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: Omit<ProjectDocument, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('project_documents')
        .insert([documentData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Documento criado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar documento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDocument = async (id: string, documentData: Partial<ProjectDocument>) => {
    try {
      const { data, error } = await supabase
        .from('project_documents')
        .update(documentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Documento atualizado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar documento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Documento excluído com sucesso",
      });
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir documento",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    documents,
    loading,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument
  };
}
