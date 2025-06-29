
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthToken } from './useAuthToken';

export interface Organization {
  id: string;
  name: string;
  acronym?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  cep?: string;
  contact_phone?: string;
  contact_email?: string;
  type: string;
  status: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { handleAuthError } = useAuthToken();

  const fetchOrganizations = async (retryCount = 0) => {
    try {
      console.log('🔍 Fetching organizations from Supabase...');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching organizations:', error);
        
        // Tentar refresh do token se for erro de autenticação
        if (retryCount === 0) {
          const refreshed = await handleAuthError(error);
          if (refreshed) {
            console.log('🔄 Retrying after token refresh...');
            return fetchOrganizations(1); // Retry uma vez apenas
          }
        }
        
        throw error;
      }
      
      console.log('✅ Organizations fetched successfully:', data?.length || 0, 'organizations');
      setOrganizations(data || []);
    } catch (error) {
      console.error('💥 Exception fetching organizations:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar organizações. Tente novamente.",
        variant: "destructive",
      });
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async (orgData: Partial<Organization>) => {
    try {
      console.log('Creating organization:', orgData);
      
      const { data, error } = await supabase
        .from('organizations')
        .insert([{
          ...orgData,
          status: 'ativa'
        }])
        .select()
        .single();

      if (error) {
        const refreshed = await handleAuthError(error);
        if (!refreshed) {
          console.error('Error creating organization:', error);
          throw error;
        }
      }

      console.log('Organization created:', data);
      toast({
        title: "Sucesso",
        description: "Organização criada com sucesso",
      });

      // Refresh the list
      await fetchOrganizations();
      return data;
    } catch (error) {
      console.error('Erro ao criar organização:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar organização",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateOrganization = async (id: string, orgData: Partial<Organization>) => {
    try {
      console.log('Updating organization:', id, orgData);
      
      const { data, error } = await supabase
        .from('organizations')
        .update(orgData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        const refreshed = await handleAuthError(error);
        if (!refreshed) {
          console.error('Error updating organization:', error);
          throw error;
        }
      }

      console.log('Organization updated:', data);
      toast({
        title: "Sucesso",
        description: "Organização atualizada com sucesso",
      });

      // Refresh the list
      await fetchOrganizations();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar organização:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar organização",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteOrganization = async (id: string) => {
    try {
      console.log('Deleting organization:', id);
      
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);

      if (error) {
        const refreshed = await handleAuthError(error);
        if (!refreshed) {
          console.error('Error deleting organization:', error);
          throw error;
        }
      }

      console.log('Organization deleted:', id);
      toast({
        title: "Sucesso",
        description: "Organização excluída com sucesso",
      });

      // Refresh the list
      await fetchOrganizations();
      return true;
    } catch (error) {
      console.error('Erro ao excluir organização:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir organização",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    console.log('🎯 useOrganizations: Starting fetch on mount');
    fetchOrganizations();
  }, []);

  return {
    organizations,
    loading,
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization
  };
}
