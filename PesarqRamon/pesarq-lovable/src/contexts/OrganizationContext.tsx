
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOrganizations, Organization } from '@/hooks/useOrganizations';
import { supabase } from '@/integrations/supabase/client';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization) => void;
  availableOrganizations: Organization[];
  canAccessMultipleOrganizations: boolean;
  loading: boolean;
  isAdmin: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { organizations, loading: orgsLoading } = useOrganizations();
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userAccessibleOrgs, setUserAccessibleOrgs] = useState<string[]>([]);

  console.log('🏛️ OrganizationContext - Estado atual:', {
    totalOrganizations: organizations.length,
    userProfile,
    userAccessibleOrgs,
    isAdmin,
    loading: orgsLoading || !initialized,
    currentOrganization: currentOrganization?.name
  });

  // Buscar organizações acessíveis para o usuário atual
  const fetchUserAccessibleOrganizations = async (userId: string, userRole: string) => {
    try {
      console.log('🔍 Buscando organizações acessíveis para usuário:', { userId, userRole });

      // Se é admin UnB, pode acessar todas
      if (userRole === 'unb_admin') {
        console.log('👑 Usuário é admin UnB - acesso a todas as organizações');
        return organizations.map(org => org.id);
      }

      // Para pesquisadores UnB, buscar vínculos organizacionais
      if (userRole === 'unb_researcher') {
        const { data: links, error } = await supabase
          .from('researcher_organization_links')
          .select('organization_id')
          .eq('researcher_id', userId);

        if (error) {
          console.error('❌ Erro ao buscar vínculos:', error);
          return [];
        }

        const linkedOrgIds = links?.map(link => link.organization_id) || [];
        console.log('🔗 Organizações vinculadas encontradas:', linkedOrgIds);
        return linkedOrgIds;
      }

      // Para usuários parceiros, usar apenas a organização do perfil
      if (userProfile?.organization_id) {
        console.log('🏢 Usuário parceiro - organização do perfil:', userProfile.organization_id);
        return [userProfile.organization_id];
      }

      console.log('⚠️ Nenhuma organização acessível encontrada');
      return [];
    } catch (error) {
      console.error('💥 Erro ao buscar organizações acessíveis:', error);
      return [];
    }
  };

  // Calcular organizações disponíveis baseado no perfil do usuário
  const getAvailableOrganizations = () => {
    // Se ainda está carregando ou não tem perfil, retornar array vazio
    if (orgsLoading || !userProfile || !initialized) {
      return [];
    }

    // Se é admin UnB, pode ver todas as organizações (ativas e inativas)
    if (isAdmin) {
      console.log('👑 Admin UnB - todas as organizações disponíveis:', organizations.length);
      return organizations;
    }

    // Para outros usuários, filtrar apenas organizações ativas e acessíveis
    const accessibleActiveOrgs = organizations.filter(org => 
      org.status === 'ativa' && userAccessibleOrgs.includes(org.id)
    );

    console.log('📋 Organizações disponíveis para usuário:', {
      total: organizations.length,
      ativas: organizations.filter(org => org.status === 'ativa').length,
      acessiveis: userAccessibleOrgs.length,
      resultado: accessibleActiveOrgs.length
    });

    return accessibleActiveOrgs;
  };

  const availableOrganizations = getAvailableOrganizations();

  // Verificar se usuário é admin UnB
  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔍 Verificando status do usuário:', user?.email);
      
      if (!user) {
        console.log('❌ Usuário não autenticado');
        setIsAdmin(false);
        return false;
      }

      // Verificar se é admin UnB pelo email
      const isUnbAdmin = user.email === 'carloshunb@gmail.com';
      console.log('👑 É admin UnB?', isUnbAdmin, 'Email:', user.email);
      
      if (isUnbAdmin) {
        setIsAdmin(true);
        return true;
      }

      // Verificar pelo perfil na base de dados
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('role, is_active')
        .eq('id', user.id)
        .maybeSingle();
        
      console.log('👤 Perfil do usuário:', { profile, error });
      
      if (profile && profile.role === 'unb_admin' && profile.is_active) {
        console.log('✅ Usuário confirmado como admin UnB via perfil');
        setIsAdmin(true);
        return true;
      }
      
      setIsAdmin(false);
      return false;
    } catch (error) {
      console.error('❌ Erro ao verificar status de admin:', error);
      setIsAdmin(false);
      return false;
    }
  };

  // Garantir que o usuário tenha um perfil válido
  const ensureUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔍 OrganizationContext - Usuário atual:', user?.email);
      
      if (!user) {
        console.log('❌ Usuário não autenticado');
        return null;
      }

      // Verificar se o usuário já tem um perfil
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      console.log('👤 OrganizationContext - Perfil existente:', {
        profile: existingProfile,
        error: profileError,
        hasProfile: !!existingProfile
      });
      
      if (existingProfile) {
        setUserProfile(existingProfile);
        
        // Buscar organizações acessíveis para este usuário
        const accessibleOrgIds = await fetchUserAccessibleOrganizations(
          existingProfile.id, 
          existingProfile.role
        );
        setUserAccessibleOrgs(accessibleOrgIds);
        
        // Verificar se é admin UnB
        const userIsAdmin = existingProfile.role === 'unb_admin' || user.email === 'carloshunb@gmail.com';
        setIsAdmin(userIsAdmin);
        
        console.log('🔑 Usuário é admin UnB:', userIsAdmin);
        return existingProfile;
      }

      // Se não tem perfil, criar um
      const newUserIsAdmin = user.email === 'carloshunb@gmail.com';
      console.log('🆕 Criando perfil para usuário:', {
        userId: user.id,
        email: user.email,
        isAdmin: newUserIsAdmin
      });

      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert([{
          id: user.id,
          name: user.email?.split('@')[0] || 'Usuário',
          email: user.email || '',
          role: newUserIsAdmin ? 'unb_admin' : 'partner_user',
          organization_id: newUserIsAdmin ? null : null, // Será definido depois
          is_active: true
        }])
        .select()
        .single();
        
      if (insertError) {
        console.error('❌ Erro ao criar perfil:', insertError);
        return null;
      } else {
        console.log('✅ Perfil criado com sucesso:', newProfile);
        setUserProfile(newProfile);
        setIsAdmin(newUserIsAdmin);
        
        // Para novos usuários não-admin, buscar organizações acessíveis
        if (!newUserIsAdmin) {
          const accessibleOrgIds = await fetchUserAccessibleOrganizations(
            newProfile.id, 
            newProfile.role
          );
          setUserAccessibleOrgs(accessibleOrgIds);
        }
        
        return newProfile;
      }
    } catch (error) {
      console.error('💥 Erro ao garantir perfil do usuário:', error);
      return null;
    }
  };

  // Inicializar quando as organizações carregarem
  useEffect(() => {
    const initializeContext = async () => {
      if (!orgsLoading && !initialized && organizations.length >= 0) {
        console.log('🔄 OrganizationContext: Inicializando com organizações:', organizations.length);
        
        // Primeiro verificar status de admin
        const isUserAdmin = await checkAdminStatus();
        
        // Garantir que o usuário tenha um perfil válido
        const profile = await ensureUserProfile();
        
        if (profile || isUserAdmin) {
          console.log('📊 Configurando organizações para:', { 
            isAdmin: isUserAdmin, 
            totalOrgs: organizations.length,
            profileOrgId: profile?.organization_id,
            profileRole: profile?.role
          });
          
          // Aguardar um pouco para que userAccessibleOrgs seja definido
          setTimeout(() => {
            const availableOrgs = getAvailableOrganizations();
            
            console.log('🎯 Organizações disponíveis após timeout:', {
              availableCount: availableOrgs.length,
              userAccessibleOrgs: userAccessibleOrgs.length,
              profileOrgId: profile?.organization_id
            });

            // Se é admin UnB, usar primeira organização como padrão
            if (isUserAdmin && organizations.length > 0) {
              console.log('👑 Admin UnB detectado - definindo primeira organização como padrão');
              setCurrentOrganizationState(organizations[0]);
            } 
            // Para usuários parceiros, PRIORIZAR a organização do perfil
            else if (profile?.organization_id && !isUserAdmin) {
              console.log('🔍 Buscando organização do perfil:', profile.organization_id);
              
              // Buscar a organização específica do perfil
              const userOrg = organizations.find(org => org.id === profile.organization_id);
              
              if (userOrg && userOrg.status === 'ativa') {
                console.log('🎯 Organização do perfil encontrada e ativa:', userOrg.name);
                setCurrentOrganizationState(userOrg);
              } else {
                console.log('⚠️ Organização do perfil não encontrada ou inativa, usando primeira disponível');
                if (availableOrgs.length > 0) {
                  setCurrentOrganizationState(availableOrgs[0]);
                }
              }
            } 
            // Fallback para primeira organização disponível
            else if (availableOrgs.length > 0) {
              console.log('🔧 Usando primeira organização disponível como fallback');
              setCurrentOrganizationState(availableOrgs[0]);
            } else {
              console.log('❌ Nenhuma organização disponível encontrada');
            }
          }, 300); // Aumentei o timeout para dar mais tempo
        }
        
        setInitialized(true);
        console.log('✅ OrganizationContext: Inicializado');
      }
    };

    initializeContext();
  }, [orgsLoading, organizations.length, initialized]);

  const setCurrentOrganization = async (org: Organization) => {
    console.log('🏢 OrganizationContext: Definindo organização:', org.name);
    setCurrentOrganizationState(org);
    localStorage.setItem('selectedOrganizationId', org.id);
    
    // Para usuários não-admin, atualizar o perfil com a nova organização selecionada
    if (!isAdmin && userProfile) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('user_profiles')
            .update({ 
              organization_id: org.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          if (error) {
            console.error('❌ Erro ao atualizar organização do usuário:', error);
          } else {
            console.log('✅ Organização do usuário atualizada:', org.name);
            // Atualizar o estado local do perfil
            setUserProfile(prev => ({ ...prev, organization_id: org.id }));
          }
        }
      } catch (error) {
        console.error('❌ Erro ao atualizar perfil do usuário:', error);
      }
    }
  };

  const contextValue = {
    currentOrganization,
    setCurrentOrganization,
    availableOrganizations,
    canAccessMultipleOrganizations: isAdmin || availableOrganizations.length > 1,
    loading: orgsLoading || !initialized,
    isAdmin
  };

  console.log('📊 OrganizationContext - Valor final do contexto:', {
    hasCurrentOrganization: !!contextValue.currentOrganization,
    currentOrgName: contextValue.currentOrganization?.name,
    availableCount: contextValue.availableOrganizations.length,
    canAccessMultiple: contextValue.canAccessMultipleOrganizations,
    loading: contextValue.loading,
    isAdmin: contextValue.isAdmin,
    userRole: userProfile?.role,
    profileOrgId: userProfile?.organization_id
  });

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizationContext must be used within an OrganizationProvider');
  }
  return context;
}
