
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export function useOrganization(organizationId: string) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrganization = async () => {
    if (!organizationId || organizationId === 'default-org-id') {
      console.log('useOrganization: No valid organization ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('useOrganization: Fetching organization:', organizationId);
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .maybeSingle();

      if (error) {
        console.error('useOrganization: Error fetching organization:', error);
        throw error;
      }
      
      console.log('useOrganization: Fetched organization data:', data);
      setOrganization(data);
    } catch (error) {
      console.error('useOrganization: Erro ao carregar organização:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da organização",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (orgData: Partial<Organization>): Promise<Organization | null> => {
    if (!organizationId || organizationId === 'default-org-id') {
      console.error('useOrganization: Invalid organization ID for editing');
      toast({
        title: "Erro",
        description: "ID da organização não é válido para edição",
        variant: "destructive",
      });
      return null;
    }

    try {
      console.log('useOrganization: Updating organization:', organizationId, orgData);
      
      const { data, error } = await supabase
        .from('organizations')
        .update({
          ...orgData,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('useOrganization: Error updating organization:', error);
        throw error;
      }

      console.log('useOrganization: Updated organization:', data);
      
      if (data) {
        setOrganization(data);
        toast({
          title: "Sucesso",
          description: "Informações da organização atualizadas com sucesso",
        });
      }
      
      return data;
    } catch (error) {
      console.error('useOrganization: Erro ao atualizar organização:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar informações da organização",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [organizationId]);

  return {
    organization,
    loading,
    updateOrganization,
    refreshOrganization: fetchOrganization
  };
}
