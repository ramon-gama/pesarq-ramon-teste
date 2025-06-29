
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationSectors } from '@/hooks/useOrganizationSectors';
import { useArchivalFunds } from '@/hooks/useArchivalFunds';
import { useAuthorities } from '@/hooks/useAuthorities';

export interface ArchiveSectorInfo {
  name: string;
  responsible: string;
  manager: string;
  email: string;
  phone: string;
  location: string;
  workingHours: string;
  teamSize: string;
  storageCapacity: string;
}

export function useOrganizationState() {
  // ID fixo do Ministério da Saúde
  const organizationId = '550e8400-e29b-41d4-a716-446655440000';
  const { toast } = useToast();

  // Usar hooks reais para buscar dados do banco
  const { organization: currentOrganization, loading: orgLoading, updateOrganization } = useOrganization(organizationId);
  const { sectors, loading: sectorsLoading, createSector, updateSector, deleteSector, importSectors, refreshSectors } = useOrganizationSectors(organizationId);
  const { funds, loading: fundsLoading, createFund, updateFund, deleteFund } = useArchivalFunds(organizationId);
  const { authorities, loading: authoritiesLoading, saveAuthority, deleteAuthority, uploadImage, deleteImage } = useAuthorities(organizationId);

  const [organizationInfo, setOrganizationInfo] = useState({
    name: 'Ministério da Saúde',
    acronym: 'MS',
    cnpj: '00.394.544/0001-52',
    address: 'Esplanada dos Ministérios, Bloco G, Brasília - DF',
    phone: '(61) 3315-2425',
    email: 'ouvidoria@saude.gov.br'
  });

  const [archiveSectorInfo, setArchiveSectorInfo] = useState<ArchiveSectorInfo>({
    name: 'Coordenação-Geral de Gestão Documental',
    responsible: 'Maria Silva Santos',
    manager: 'João Carlos Oliveira',
    email: 'arquivo@saude.gov.br',
    phone: '(61) 3315-2890',
    location: 'Esplanada dos Ministérios, Bloco G, 1º andar, Sala 134',
    workingHours: '08:00 às 17:30',
    teamSize: '12 servidores',
    storageCapacity: '2.500 metros lineares'
  });

  // Atualizar informações da organização quando os dados do banco chegarem
  useEffect(() => {
    if (currentOrganization) {
      setOrganizationInfo({
        name: currentOrganization.name || 'Ministério da Saúde',
        acronym: 'MS',
        cnpj: currentOrganization.cnpj || '00.394.544/0001-52',
        address: currentOrganization.address || 'Esplanada dos Ministérios, Bloco G, Brasília - DF',
        phone: currentOrganization.contact_phone || '(61) 3315-2425',
        email: currentOrganization.contact_email || 'ouvidoria@saude.gov.br'
      });
    }
  }, [currentOrganization]);

  const isLoading = orgLoading || sectorsLoading || fundsLoading || authoritiesLoading;

  // Operações dos setores
  const sectorOperations = {
    createSector: async (data: any) => {
      try {
        await createSector(data);
        toast({
          title: "Sucesso",
          description: "Setor criado com sucesso!"
        });
      } catch (error) {
        console.error('Error creating sector:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar setor",
          variant: "destructive"
        });
      }
    },
    updateSector: async (id: string, data: any) => {
      try {
        await updateSector(id, data);
        toast({
          title: "Sucesso",
          description: "Setor atualizado com sucesso!"
        });
      } catch (error) {
        console.error('Error updating sector:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar setor",
          variant: "destructive"
        });
      }
    },
    deleteSector: async (id: string) => {
      try {
        await deleteSector(id);
        toast({
          title: "Sucesso",
          description: "Setor excluído com sucesso!"
        });
      } catch (error) {
        console.error('Error deleting sector:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir setor",
          variant: "destructive"
        });
      }
    },
    importSectors: async (data: any) => {
      try {
        await importSectors(data);
        toast({
          title: "Sucesso",
          description: "Setores importados com sucesso!"
        });
      } catch (error) {
        console.error('Error importing sectors:', error);
        toast({
          title: "Erro",
          description: "Erro ao importar setores",
          variant: "destructive"
        });
      }
    },
    refreshSectors: refreshSectors
  };

  // Operações dos fundos
  const fundOperations = {
    createFund: async (data: any) => {
      try {
        await createFund(data);
        toast({
          title: "Sucesso",
          description: "Fundo arquivístico criado com sucesso!"
        });
      } catch (error) {
        console.error('Error creating fund:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar fundo arquivístico",
          variant: "destructive"
        });
      }
    },
    updateFund: async (id: string, data: any) => {
      try {
        await updateFund(id, data);
        toast({
          title: "Sucesso",
          description: "Fundo arquivístico atualizado com sucesso!"
        });
      } catch (error) {
        console.error('Error updating fund:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar fundo arquivístico",
          variant: "destructive"
        });
      }
    },
    deleteFund: async (id: string) => {
      try {
        await deleteFund(id);
        toast({
          title: "Sucesso",
          description: "Fundo arquivístico excluído com sucesso!"
        });
      } catch (error) {
        console.error('Error deleting fund:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir fundo arquivístico",
          variant: "destructive"
        });
      }
    }
  };

  // Operações das autoridades
  const authorityOperations = {
    saveAuthority: async (data: any) => {
      try {
        const result = await saveAuthority(data);
        return result;
      } catch (error) {
        console.error('Error saving authority:', error);
        throw error;
      }
    },
    deleteAuthority: async (id: string) => {
      try {
        await deleteAuthority(id);
      } catch (error) {
        console.error('Error deleting authority:', error);
        throw error;
      }
    },
    uploadImage: uploadImage,
    deleteImage: deleteImage
  };

  // Operações da organização
  const organizationOperations = {
    updateOrganization: async (id: string, data: any) => {
      try {
        const result = await updateOrganization(data);
        if (result) {
          setOrganizationInfo({
            name: result.name || organizationInfo.name,
            acronym: organizationInfo.acronym,
            cnpj: result.cnpj || organizationInfo.cnpj,
            address: result.address || organizationInfo.address,
            phone: result.contact_phone || organizationInfo.phone,
            email: result.contact_email || organizationInfo.email
          });
        }
        return result;
      } catch (error) {
        console.error('Error updating organization:', error);
        throw error;
      }
    },
    createOrganization: async (data: any) => {
      try {
        const { data: newOrg, error } = await supabase
          .from('organizations')
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return newOrg;
      } catch (error) {
        console.error('Error creating organization:', error);
        throw error;
      }
    }
  };

  return {
    organizationId,
    currentOrganization,
    organizationInfo,
    setOrganizationInfo,
    archiveSectorInfo,
    setArchiveSectorInfo,
    isLoading,
    sectors: sectors || [],
    funds: funds || [],
    authorities: authorities || [],
    sectorOperations,
    fundOperations,
    authorityOperations,
    organizationOperations
  };
}
