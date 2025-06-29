
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StorageLocation {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  address?: string;
  responsible_person?: string;
  capacity_percentage: number;
  total_documents: number;
  document_types: string[];
  status: 'ativo' | 'inativo' | 'manutencao';
  created_at: string;
  updated_at: string;
}

export function useStorageLocations(organizationId: string | null) {
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Use ref to track the last organization ID to prevent unnecessary calls
  const lastOrganizationId = useRef<string | null>(null);
  const isInitialized = useRef(false);

  console.log('🏪 useStorageLocations - organizationId:', organizationId);

  const fetchStorageLocations = useCallback(async (orgId: string) => {
    try {
      setLoading(true);
      console.log('🏪 Fetching storage locations for organization:', orgId);

      const { data, error } = await supabase
        .from('storage_locations')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('🏪 Error fetching storage locations:', error);
        toast({
          title: 'Erro ao carregar locais de armazenamento',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      console.log('🏪 Storage locations fetched:', data?.length || 0, data);
      setStorageLocations(data || []);
    } catch (error) {
      console.error('🏪 Error fetching storage locations:', error);
      toast({
        title: 'Erro ao carregar locais de armazenamento',
        description: 'Não foi possível carregar os locais de armazenamento.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createStorageLocation = useCallback(async (locationData: Omit<StorageLocation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating storage location:', locationData);

      const { data, error } = await supabase
        .from('storage_locations')
        .insert([locationData])
        .select()
        .single();

      if (error) {
        console.error('Error creating storage location:', error);
        toast({
          title: 'Erro ao criar local de armazenamento',
          description: error.message,
          variant: 'destructive',
        });
        return null;
      }

      console.log('Storage location created successfully:', data);
      setStorageLocations(prev => [data, ...prev]);
      toast({
        title: 'Local de armazenamento criado',
        description: 'O local foi criado com sucesso.',
      });
      return data;
    } catch (error) {
      console.error('Error creating storage location:', error);
      toast({
        title: 'Erro ao criar local de armazenamento',
        description: 'Não foi possível criar o local.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const updateStorageLocation = useCallback(async (id: string, locationData: Partial<StorageLocation>) => {
    try {
      console.log('Updating storage location:', id);

      const { data, error } = await supabase
        .from('storage_locations')
        .update(locationData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating storage location:', error);
        toast({
          title: 'Erro ao atualizar local de armazenamento',
          description: error.message,
          variant: 'destructive',
        });
        return null;
      }

      console.log('Storage location updated successfully:', data);
      setStorageLocations(prev => prev.map(location => 
        location.id === id ? data : location
      ));
      toast({
        title: 'Local de armazenamento atualizado',
        description: 'O local foi atualizado com sucesso.',
      });
      return data;
    } catch (error) {
      console.error('Error updating storage location:', error);
      toast({
        title: 'Erro ao atualizar local de armazenamento',
        description: 'Não foi possível atualizar o local.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const deleteStorageLocation = useCallback(async (id: string) => {
    try {
      console.log('Deleting storage location:', id);

      const { error } = await supabase
        .from('storage_locations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting storage location:', error);
        toast({
          title: 'Erro ao excluir local de armazenamento',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      console.log('Storage location deleted successfully');
      setStorageLocations(prev => prev.filter(location => location.id !== id));
      toast({
        title: 'Local de armazenamento excluído',
        description: 'O local foi excluído com sucesso.',
      });
      return true;
    } catch (error) {
      console.error('Error deleting storage location:', error);
      toast({
        title: 'Erro ao excluir local de armazenamento',
        description: 'Não foi possível excluir o local.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const refreshStorageLocations = useCallback(() => {
    if (organizationId) {
      fetchStorageLocations(organizationId);
    }
  }, [organizationId, fetchStorageLocations]);

  useEffect(() => {
    // Only fetch if organization ID changed or first initialization
    if (organizationId && (organizationId !== lastOrganizationId.current || !isInitialized.current)) {
      console.log('🏪 Organization changed or first load, fetching storage locations');
      lastOrganizationId.current = organizationId;
      isInitialized.current = true;
      fetchStorageLocations(organizationId);
    } else if (!organizationId) {
      console.log('🏪 No organization selected, clearing storage locations');
      setStorageLocations([]);
      setLoading(false);
      lastOrganizationId.current = null;
    }
  }, [organizationId, fetchStorageLocations]);

  console.log('🏪 useStorageLocations returning:', {
    storageLocationsCount: storageLocations.length,
    loading,
    organizationChanged: organizationId !== lastOrganizationId.current
  });

  return {
    storageLocations,
    loading,
    createStorageLocation,
    updateStorageLocation,
    deleteStorageLocation,
    refreshStorageLocations
  };
}
