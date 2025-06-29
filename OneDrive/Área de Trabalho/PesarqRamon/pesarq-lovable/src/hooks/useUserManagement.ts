import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'unb_admin' | 'unb_researcher' | 'partner_admin' | 'partner_user';
  organization_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organizations?: {
    name: string;
  };
}

export interface ResearcherOrgLink {
  id: string;
  researcher_id: string;
  organization_id: string;
  permissions: {
    can_view_projects?: boolean;
    projects_access_type?: 'leader' | 'admin';
  };
  created_at: string;
  updated_at: string;
  organizations?: {
    name: string;
  };
}

export function useUserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [researcherLinks, setResearcherLinks] = useState<ResearcherOrgLink[]>([]);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Carregando usuários...');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          organizations (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        throw error;
      }
      
      console.log('✅ Usuários encontrados:', data?.length || 0);
      setUsers(data || []);

    } catch (error: any) {
      console.error('💥 Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os usuários.",
        variant: "destructive"
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSetupPasswordLink = async (email: string) => {
    try {
      console.log('🔗 Gerando link de configuração para:', email);
      
      // Usar o método nativo do Supabase
      const redirectTo = `${window.location.origin}/auth?message=configurar-senha&email=${encodeURIComponent(email)}`;
      
      const { data, error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
          redirectTo: redirectTo
        }
      });

      if (error) {
        console.error('❌ Erro ao gerar link:', error);
        throw error;
      }

      const setupLink = data.properties?.action_link;
      
      if (!setupLink) {
        // Fallback para link manual
        return `${window.location.origin}/auth?email=${encodeURIComponent(email)}&action=setup-password`;
      }

      console.log('✅ Link gerado com sucesso');
      return setupLink;
      
    } catch (error) {
      console.error('💥 Erro ao gerar link:', error);
      // Retornar link fallback em caso de erro
      return `${window.location.origin}/auth?email=${encodeURIComponent(email)}&action=setup-password`;
    }
  };

  const createUser = async (userData: {
    name: string;
    email: string;
    role: string;
    organization_id?: string;
  }) => {
    try {
      console.log('🔧 Criando solicitação de acesso para:', userData);

      const { data: accessRequest, error: requestError } = await supabase
        .from('access_requests')
        .insert([{
          name: userData.name,
          email: userData.email,
          requested_role: userData.role,
          organization_id: userData.role === 'unb_admin' ? null : (userData.organization_id || null),
          status: 'approved',
          justification: 'Usuário criado pelo administrador do sistema'
        }])
        .select()
        .single();

      if (requestError) {
        console.error('❌ Erro ao criar solicitação:', requestError);
        throw new Error(`Erro ao criar solicitação: ${requestError.message}`);
      }

      console.log('✅ Solicitação de acesso criada:', accessRequest);
      
      // Gerar link de configuração usando o método nativo
      const setupLink = await generateSetupPasswordLink(userData.email);
      
      toast({
        title: "Sucesso",
        description: `Solicitação de acesso criada para ${userData.name}! Link de configuração gerado.`
      });

      await loadUsers();
      return { 
        success: true, 
        accessRequest,
        setupLink 
      };
    } catch (error: any) {
      console.error('💥 Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateUser = async (userId: string, userData: Partial<UserProfile>) => {
    try {
      console.log('🔄 Atualizando usuário:', userId, userData);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('❌ Erro ao atualizar usuário:', error);
        throw error;
      }

      console.log('✅ Usuário atualizado com sucesso');
      await loadUsers();
      
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso."
      });
    } catch (error: any) {
      console.error('💥 Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      console.log('🔄 Alterando status do usuário:', userId, !currentStatus);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('❌ Erro ao alterar status:', error);
        throw error;
      }

      console.log('✅ Status alterado com sucesso');
      await loadUsers();
      
      toast({
        title: "Sucesso",
        description: `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`
      });
    } catch (error: any) {
      console.error('💥 Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status do usuário.",
        variant: "destructive"
      });
    }
  };

  const deactivateUser = async (userId: string) => {
    await toggleUserStatus(userId, true);
  };

  const linkResearcherToOrganization = async (
    researcherId: string,
    organizationId: string,
    permissions: { can_view_projects?: boolean; projects_access_type?: 'leader' | 'admin' }
  ) => {
    try {
      console.log('🔗 Vinculando pesquisador à organização:', { researcherId, organizationId, permissions });

      const { error } = await supabase
        .from('researcher_organization_links')
        .insert([{
          researcher_id: researcherId,
          organization_id: organizationId,
          permissions: permissions
        }]);

      if (error) {
        console.error('❌ Erro ao vincular pesquisador:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Pesquisador vinculado à organização com sucesso."
      });

      await loadResearcherLinks();
    } catch (error: any) {
      console.error('💥 Erro ao vincular pesquisador:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao vincular pesquisador.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const unlinkResearcherFromOrganization = async (linkId: string) => {
    try {
      console.log('🔗 Desvinculando pesquisador da organização:', linkId);

      const { error } = await supabase
        .from('researcher_organization_links')
        .delete()
        .eq('id', linkId);

      if (error) {
        console.error('❌ Erro ao desvincular pesquisador:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Pesquisador desvinculado da organização com sucesso."
      });

      await loadResearcherLinks();
    } catch (error: any) {
      console.error('💥 Erro ao desvincular pesquisador:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao desvincular pesquisador.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateResearcherPermissions = async (linkId: string, permissions: Record<string, any>) => {
    try {
      console.log('🔄 Atualizando permissões do pesquisador:', linkId, permissions);

      const { error } = await supabase
        .from('researcher_organization_links')
        .update({
          permissions: permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', linkId);

      if (error) {
        console.error('❌ Erro ao atualizar permissões:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Permissões atualizadas com sucesso."
      });

      await loadResearcherLinks();
    } catch (error: any) {
      console.error('💥 Erro ao atualizar permissões:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar permissões.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const loadResearcherLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('researcher_organization_links')
        .select(`
          *,
          organizations (
            name
          )
        `);

      if (error) {
        console.error('❌ Erro ao carregar vínculos:', error);
        throw error;
      }

      setResearcherLinks(data || []);
    } catch (error: any) {
      console.error('💥 Erro ao carregar vínculos:', error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadResearcherLinks();
  }, []);

  return {
    users,
    loading,
    loadUsers,
    createUser,
    updateUser,
    toggleUserStatus,
    deactivateUser,
    researcherLinks,
    linkResearcherToOrganization,
    unlinkResearcherFromOrganization,
    updateResearcherPermissions
  };
}
