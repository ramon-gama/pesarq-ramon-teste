
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ArchiveSectorInfo {
  manager: string;
  location: string;
  workingHours: string;
  teamSize: string;
  storageCapacity: string;
}

export interface ArchiveSector {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  location?: string;
  status: string;
  contact_info?: {
    manager?: string;
    working_hours?: string;
    team_size?: string;
    storage_capacity?: string;
  };
  created_at: string;
  updated_at: string;
}

export function useArchiveSector(organizationId?: string) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchArchiveSector = async (): Promise<ArchiveSector | null> => {
    if (!organizationId) {
      console.log('useArchiveSector: No organizationId provided');
      return null;
    }

    try {
      setLoading(true);
      console.log('fetchArchiveSector: Fetching for organization:', organizationId);
      
      const { data, error } = await supabase
        .from('organization_sectors')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('name', 'Setor de Arquivo')
        .maybeSingle();

      if (error) {
        console.error('Error fetching archive sector:', error);
        throw error;
      }

      console.log('fetchArchiveSector: Found data:', data);
      return data || null;
    } catch (error) {
      console.error('Erro ao carregar setor de arquivo:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createArchiveSector = async (sectorData: ArchiveSectorInfo): Promise<ArchiveSector | null> => {
    if (!organizationId) {
      console.error('createArchiveSector: No organizationId provided');
      return null;
    }

    try {
      setLoading(true);
      console.log('createArchiveSector: Creating for organization:', organizationId, 'with data:', sectorData);
      
      const { data, error } = await supabase
        .from('organization_sectors')
        .insert([{
          organization_id: organizationId,
          name: 'Setor de Arquivo',
          description: 'Setor responsável pela gestão do arquivo organizacional',
          location: sectorData.location,
          status: 'ativo',
          contact_info: {
            manager: sectorData.manager,
            working_hours: sectorData.workingHours,
            team_size: sectorData.teamSize,
            storage_capacity: sectorData.storageCapacity
          }
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating archive sector:', error);
        throw error;
      }

      console.log('createArchiveSector: Created successfully:', data);
      
      toast({
        title: "Sucesso",
        description: "Setor de arquivo criado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar setor de arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar setor de arquivo",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateArchiveSector = async (id: string, sectorData: ArchiveSectorInfo): Promise<ArchiveSector | null> => {
    if (!organizationId) {
      console.error('updateArchiveSector: No organizationId provided');
      return null;
    }

    try {
      setLoading(true);
      console.log('updateArchiveSector: Updating sector:', id, 'for organization:', organizationId, 'with data:', sectorData);
      
      const { data, error } = await supabase
        .from('organization_sectors')
        .update({
          location: sectorData.location,
          contact_info: {
            manager: sectorData.manager,
            working_hours: sectorData.workingHours,
            team_size: sectorData.teamSize,
            storage_capacity: sectorData.storageCapacity
          }
        })
        .eq('id', id)
        .eq('organization_id', organizationId) // Garantir que só atualize da organização correta
        .select()
        .single();

      if (error) {
        console.error('Error updating archive sector:', error);
        throw error;
      }

      console.log('updateArchiveSector: Updated successfully:', data);

      toast({
        title: "Sucesso",
        description: "Setor de arquivo atualizado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar setor de arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar setor de arquivo",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchArchiveSector,
    createArchiveSector,
    updateArchiveSector
  };
}
