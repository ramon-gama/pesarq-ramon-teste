import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationContext } from '@/contexts/OrganizationContext';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentOrganization } = useOrganizationContext();

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      if (!currentOrganization) {
        console.log('⚠️ No organization selected, clearing services');
        setServices([]);
        return;
      }

      console.log('🔄 Fetching services for organization:', currentOrganization.id);

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching services:', error);
        toast({
          title: 'Erro ao carregar serviços',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ Services fetched:', data?.length || 0);
      setServices(data || []);
    } catch (error) {
      console.error('💥 Error fetching services:', error);
      toast({
        title: 'Erro ao carregar serviços',
        description: 'Não foi possível carregar os serviços.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sanitizeUuidFields = (data: any) => {
    const sanitized = { ...data };
    
    // Convert empty strings to null for UUID fields
    if (sanitized.archival_fund_id === '') {
      sanitized.archival_fund_id = null;
    }

    return sanitized;
  };

  const createService = async (serviceData: Partial<Service>) => {
    try {
      if (!currentOrganization) {
        toast({
          title: 'Erro',
          description: 'Selecione uma organização para criar serviços',
          variant: 'destructive',
        });
        return null;
      }

      console.log('➕ Creating service for organization:', currentOrganization.id);

      // Remove campos que não devem ser enviados para criação e sanitizar UUIDs
      const { id, created_at, ...dataToInsert } = serviceData;
      const sanitizedData = sanitizeUuidFields({
        ...dataToInsert,
        organization_id: currentOrganization.id
      });
      
      const { data, error } = await supabase
        .from('services')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating service:', error);
        toast({
          title: 'Erro ao criar serviço',
          description: error.message,
          variant: 'destructive',
        });
        return null;
      }

      console.log('✅ Service created successfully:', data);
      setServices(prev => [data, ...prev]);
      toast({
        title: 'Serviço criado',
        description: 'O serviço foi criado com sucesso.',
      });
      return data;
    } catch (error) {
      console.error('💥 Error creating service:', error);
      toast({
        title: 'Erro ao criar serviço',
        description: 'Não foi possível criar o serviço.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      if (!currentOrganization) {
        toast({
          title: 'Erro',
          description: 'Organização não selecionada',
          variant: 'destructive',
        });
        return null;
      }

      console.log('🔄 Updating service:', id);

      // Remove campos que não devem ser atualizados e sanitizar UUIDs
      const { id: serviceId, created_at, organization_id, ...dataToUpdate } = serviceData;
      const sanitizedData = sanitizeUuidFields(dataToUpdate);
      
      const { data, error } = await supabase
        .from('services')
        .update(sanitizedData)
        .eq('id', id)
        .eq('organization_id', currentOrganization.id) // Garantir que só atualiza serviços da organização atual
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating service:', error);
        toast({
          title: 'Erro ao atualizar serviço',
          description: error.message,
          variant: 'destructive',
        });
        return null;
      }

      console.log('✅ Service updated successfully:', data);
      setServices(prev => prev.map(service => 
        service.id === id ? data : service
      ));
      toast({
        title: 'Serviço atualizado',
        description: 'O serviço foi atualizado com sucesso.',
      });
      return data;
    } catch (error) {
      console.error('💥 Error updating service:', error);
      toast({
        title: 'Erro ao atualizar serviço',
        description: 'Não foi possível atualizar o serviço.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteService = async (id: string) => {
    try {
      if (!currentOrganization) {
        toast({
          title: 'Erro',
          description: 'Organização não selecionada',
          variant: 'destructive',
        });
        return false;
      }

      console.log('🗑️ Deleting service:', id);

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
        .eq('organization_id', currentOrganization.id); // Garantir que só deleta serviços da organização atual

      if (error) {
        console.error('❌ Error deleting service:', error);
        toast({
          title: 'Erro ao excluir serviço',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      console.log('✅ Service deleted successfully');
      setServices(prev => prev.filter(service => service.id !== id));
      toast({
        title: 'Serviço excluído',
        description: 'O serviço foi excluído com sucesso.',
      });
      return true;
    } catch (error) {
      console.error('💥 Error deleting service:', error);
      toast({
        title: 'Erro ao excluir serviço',
        description: 'Não foi possível excluir o serviço.',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchServices();
  }, [currentOrganization?.id]); // Recarregar quando a organização mudar

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    refreshServices: fetchServices
  };
}
