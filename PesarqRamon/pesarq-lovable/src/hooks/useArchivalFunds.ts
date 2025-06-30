
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthToken } from './useAuthToken';

export interface ArchivalFund {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  code?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  total_documents?: number;
  total_boxes?: number;
  location?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
  description_level?: string;
  extension_number?: string;
  extension_unit?: string;
  support_type?: string;
  producer_name?: string;
  origin_trajectory?: string;
  constitution_nature?: string;
  constitution_other?: string;
  scope_content?: string;
  organization?: string;
  evaluation_temporality?: string;
  access_restrictions?: string;
  predominant_languages?: string;
  research_instruments?: any;
  research_instruments_description?: string;
  related_funds?: string;
  complementary_notes?: string;
  description_responsible?: string;
  description_date?: string;
  used_standards?: string;
  last_update_date?: string;
  extensions?: any[];
  related_fund_ids?: string[];
  related_authority_ids?: string[];
}

export function useArchivalFunds(organizationId: string) {
  const [funds, setFunds] = useState<ArchivalFund[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { handleAuthError } = useAuthToken();

  const fetchFunds = async (retryCount = 0) => {
    if (!organizationId || organizationId === 'default-org-id') {
      console.log('useArchivalFunds: No valid organization ID provided');
      setLoading(false);
      return;
    }

    try {
      console.log('🗃️ Fetching archival funds for organization:', organizationId);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('archival_funds')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching archival funds:', error);
        
        if (retryCount === 0) {
          const refreshed = await handleAuthError(error);
          if (refreshed) {
            console.log('🔄 Retrying after token refresh...');
            return fetchFunds(1);
          }
        }
        
        throw error;
      }
      
      console.log('✅ Archival funds fetched successfully:', data?.length || 0, 'funds');
      setFunds(data || []);
    } catch (error) {
      console.error('💥 Exception fetching archival funds:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar fundos arquivísticos. Tente novamente.",
        variant: "destructive",
      });
      setFunds([]);
    } finally {
      setLoading(false);
    }
  };

  const createFund = async (fundData: Partial<ArchivalFund>) => {
    try {
      console.log('🆕 Creating archival fund:', fundData);
      
      const { data, error } = await supabase
        .from('archival_funds')
        .insert([{
          ...fundData,
          organization_id: organizationId,
          status: fundData.status || 'ativo'
        }])
        .select()
        .single();

      if (error) {
        const refreshed = await handleAuthError(error);
        if (refreshed) {
          // Retry after token refresh
          return createFund(fundData);
        }
        console.error('❌ Error creating archival fund:', error);
        throw error;
      }

      console.log('✅ Archival fund created:', data);
      
      // Update local state immediately
      setFunds(prevFunds => [...prevFunds, data]);
      
      toast({
        title: "Sucesso",
        description: "Fundo arquivístico criado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('💥 Error creating archival fund:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar fundo arquivístico",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateFund = async (id: string, fundData: Partial<ArchivalFund>) => {
    try {
      console.log('📝 Updating archival fund:', id, fundData);
      
      const { data, error } = await supabase
        .from('archival_funds')
        .update({
          ...fundData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        const refreshed = await handleAuthError(error);
        if (refreshed) {
          // Retry after token refresh
          return updateFund(id, fundData);
        }
        console.error('❌ Error updating archival fund:', error);
        throw error;
      }

      console.log('✅ Archival fund updated:', data);
      
      // Update local state immediately
      setFunds(prevFunds => 
        prevFunds.map(fund => fund.id === id ? data : fund)
      );
      
      toast({
        title: "Sucesso",
        description: "Fundo arquivístico atualizado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('💥 Error updating archival fund:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar fundo arquivístico",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteFund = async (id: string) => {
    try {
      console.log('🗑️ Deleting archival fund:', id);
      
      const { error } = await supabase
        .from('archival_funds')
        .delete()
        .eq('id', id);

      if (error) {
        const refreshed = await handleAuthError(error);
        if (refreshed) {
          // Retry after token refresh
          return deleteFund(id);
        }
        console.error('❌ Error deleting archival fund:', error);
        throw error;
      }

      console.log('✅ Archival fund deleted:', id);
      
      // Update local state immediately
      setFunds(prevFunds => prevFunds.filter(fund => fund.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Fundo arquivístico excluído com sucesso",
      });

      return true;
    } catch (error) {
      console.error('💥 Error deleting archival fund:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir fundo arquivístico",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    console.log('🎯 useArchivalFunds: Starting fetch on mount for org:', organizationId);
    fetchFunds();
  }, [organizationId]);

  return {
    funds,
    loading,
    fetchFunds,
    createFund,
    updateFund,
    deleteFund
  };
}
