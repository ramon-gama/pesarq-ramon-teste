
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ArchiveSectorData {
  manager: string;
  location: string;
  workingHours: string;
  teamSize: string;
  storageCapacity: string;
}

export interface ArchiveSector {
  id: string;
  organization_id: string;
  manager?: string;
  location?: string;
  working_hours?: string;
  team_size?: string;
  storage_capacity?: string;
  created_at: string;
  updated_at: string;
}

export function useArchiveSectorData(organizationId?: string) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchArchiveSectorData = async (): Promise<ArchiveSector | null> => {
    if (!organizationId) {
      console.log('useArchiveSectorData: No organizationId provided for fetch');
      return null;
    }

    try {
      setLoading(true);
      console.log('fetchArchiveSectorData: Fetching for organization:', organizationId);
      
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('fetchArchiveSectorData: User not authenticated');
        return null;
      }

      const { data, error } = await supabase
        .from('archive_sectors')
        .select('*')
        .eq('organization_id', organizationId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching archive sector data:', error);
        // Não lançar erro, apenas retornar null para permitir que a UI continue funcionando
        return null;
      }

      console.log('fetchArchiveSectorData: Found data:', data);
      return data || null;
    } catch (error) {
      console.error('Erro ao carregar dados do setor de arquivo:', error);
      // Não mostrar toast de erro para não spammar o usuário
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createArchiveSectorData = async (sectorData: ArchiveSectorData): Promise<ArchiveSector | null> => {
    if (!organizationId) {
      console.error('createArchiveSectorData: No organizationId provided');
      toast({
        title: "Erro",
        description: "ID da organização não encontrado",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);
      console.log('createArchiveSectorData: Creating for organization:', organizationId, 'with data:', sectorData);
      
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('archive_sectors')
        .insert([{
          organization_id: organizationId,
          manager: sectorData.manager,
          location: sectorData.location,
          working_hours: sectorData.workingHours,
          team_size: sectorData.teamSize,
          storage_capacity: sectorData.storageCapacity
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating archive sector data:', error);
        throw error;
      }

      console.log('createArchiveSectorData: Created successfully:', data);
      
      toast({
        title: "Sucesso",
        description: "Dados do setor de arquivo salvos com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar dados do setor de arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dados do setor de arquivo",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateArchiveSectorData = async (id: string, sectorData: ArchiveSectorData): Promise<ArchiveSector | null> => {
    if (!organizationId) {
      console.error('updateArchiveSectorData: No organizationId provided');
      toast({
        title: "Erro",
        description: "ID da organização não encontrado",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);
      console.log('updateArchiveSectorData: Updating sector:', id, 'for organization:', organizationId, 'with data:', sectorData);
      
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('archive_sectors')
        .update({
          manager: sectorData.manager,
          location: sectorData.location,
          working_hours: sectorData.workingHours,
          team_size: sectorData.teamSize,
          storage_capacity: sectorData.storageCapacity
        })
        .eq('id', id)
        .eq('organization_id', organizationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating archive sector data:', error);
        throw error;
      }

      console.log('updateArchiveSectorData: Updated successfully:', data);

      toast({
        title: "Sucesso",
        description: "Dados do setor de arquivo atualizados com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar dados do setor de arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados do setor de arquivo",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchArchiveSectorData,
    createArchiveSectorData,
    updateArchiveSectorData
  };
}
