import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrganizationSector {
  id: string;
  organization_id: string;
  name: string;
  code?: string;
  description?: string;
  location?: string;
  status: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface SectorImportData {
  name: string;
  acronym?: string;
  code?: string;
  description?: string;
  location?: string;
  state?: string;
  city?: string;
  siorg_code?: string;
  parent_siorg_code?: string;
  competence?: string;
  purpose?: string;
  mission?: string;
  area_type?: 'finalistica' | 'suporte';
  contact_email?: string;
  contact_phone?: string;
}

export function useOrganizationSectors(organizationId: string) {
  const [sectors, setSectors] = useState<OrganizationSector[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSectors = async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organization_sectors')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name');

      if (error) throw error;
      setSectors(data || []);
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar setores da organização",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSector = async (sectorData: Omit<OrganizationSector, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('organization_sectors')
        .insert([{ ...sectorData, organization_id: organizationId }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Setor criado com sucesso",
      });

      await fetchSectors();
      return data;
    } catch (error) {
      console.error('Erro ao criar setor:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar setor",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSector = async (id: string, sectorData: Partial<OrganizationSector>) => {
    try {
      const { data, error } = await supabase
        .from('organization_sectors')
        .update(sectorData)
        .eq('id', id)
        .eq('organization_id', organizationId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Setor atualizado com sucesso",
      });

      await fetchSectors();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar setor:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar setor",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSector = async (id: string) => {
    try {
      const { error } = await supabase
        .from('organization_sectors')
        .delete()
        .eq('id', id)
        .eq('organization_id', organizationId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Setor excluído com sucesso",
      });

      await fetchSectors();
    } catch (error) {
      console.error('Erro ao excluir setor:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir setor",
        variant: "destructive",
      });
      throw error;
    }
  };

  const importSectors = async (sectorsData: SectorImportData[]) => {
    try {
      const sectorsToInsert = sectorsData.map(sector => ({
        ...sector,
        organization_id: organizationId,
        status: 'ativo'
      }));

      const { error } = await supabase
        .from('organization_sectors')
        .insert(sectorsToInsert);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${sectorsData.length} setores importados com sucesso`,
      });

      await fetchSectors();
    } catch (error) {
      console.error('Erro ao importar setores:', error);
      toast({
        title: "Erro",
        description: "Erro ao importar setores",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSectors();
  }, [organizationId]);

  return {
    sectors,
    loading,
    fetchSectors,
    createSector,
    updateSector,
    deleteSector,
    importSectors,
    refreshSectors: fetchSectors
  };
}
