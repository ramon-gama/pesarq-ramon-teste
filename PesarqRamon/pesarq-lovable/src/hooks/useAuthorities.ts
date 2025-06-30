import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Authority {
  id: string;
  organization_id: string;
  name: string;
  type: 'pessoa' | 'familia' | 'entidade_coletiva';
  position?: string;
  fund_id?: string;
  start_date?: string;
  end_date?: string;
  biography?: string;
  status: string;
  image_url?: string;
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  created_at: string;
  updated_at: string;
}

export function useAuthorities(organizationId: string) {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAuthorities = async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('authorities')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name');

      if (error) throw error;
      setAuthorities(data || []);
    } catch (error) {
      console.error('Erro ao buscar autoridades:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar autoridades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAuthority = async (authorityData: Omit<Authority, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('authorities')
        .insert([{ ...authorityData, organization_id: organizationId }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Autoridade criada com sucesso",
      });

      await fetchAuthorities();
      return data;
    } catch (error) {
      console.error('Erro ao criar autoridade:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar autoridade",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAuthority = async (id: string, authorityData: Partial<Authority>) => {
    try {
      const { data, error } = await supabase
        .from('authorities')
        .update(authorityData)
        .eq('id', id)
        .eq('organization_id', organizationId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Autoridade atualizada com sucesso",
      });

      await fetchAuthorities();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar autoridade:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar autoridade",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAuthority = async (id: string) => {
    try {
      const { error } = await supabase
        .from('authorities')
        .delete()
        .eq('id', id)
        .eq('organization_id', organizationId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Autoridade excluída com sucesso",
      });

      await fetchAuthorities();
    } catch (error) {
      console.error('Erro ao excluir autoridade:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir autoridade",
        variant: "destructive",
      });
      throw error;
    }
  };

  const saveAuthority = async (authorityData: any) => {
    if (authorityData.id) {
      return await updateAuthority(authorityData.id, authorityData);
    } else {
      return await createAuthority(authorityData);
    }
  };

  const uploadImage = async (file: File) => {
    // Placeholder for image upload functionality
    return '';
  };

  const deleteImage = async (imageUrl: string) => {
    // Placeholder for image deletion functionality
  };

  useEffect(() => {
    fetchAuthorities();
  }, [organizationId]);

  return {
    authorities,
    loading,
    fetchAuthorities,
    createAuthority,
    updateAuthority,
    deleteAuthority,
    saveAuthority,
    uploadImage,
    deleteImage
  };
}
