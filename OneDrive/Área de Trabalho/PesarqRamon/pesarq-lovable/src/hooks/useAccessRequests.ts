import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sendWelcomeEmail } from '@/utils/emailUtils';

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  requested_role: string;
  justification: string;
  organization_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  documents?: any[];
  organizations?: {
    name: string;
  };
}

export function useAccessRequests() {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return false;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const adminStatus = profile?.role === 'unb_admin';
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('❌ Erro ao verificar status de admin:', error);
      setIsAdmin(false);
      return false;
    }
  };

  const loadAccessRequests = async () => {
    try {
      setLoading(true);
      console.log('🔍 Carregando solicitações de acesso...');
      
      // Verificar se é admin antes de tentar carregar
      const isAdminUser = await checkAdminStatus();
      if (!isAdminUser) {
        console.log('👤 Usuário não é admin, não carregando solicitações');
        setAccessRequests([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('access_requests')
        .select(`
          *,
          organizations (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar solicitações:', error);
        throw error;
      }
      
      console.log('✅ Solicitações carregadas:', data?.length || 0);
      setAccessRequests(data || []);
    } catch (error: any) {
      console.error('💥 Erro ao carregar solicitações:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar as solicitações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAccessRequest = async (id: string, updates: Partial<AccessRequest>) => {
    try {
      console.log('🔄 Atualizando solicitação:', id, updates);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const updateData = {
        ...updates,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('access_requests')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao atualizar solicitação:', error);
        throw error;
      }

      // Se a solicitação foi aprovada, criar o perfil do usuário e enviar email
      if (updates.status === 'approved') {
        console.log('✅ Solicitação aprovada, processando aprovação...');
        
        // Buscar dados completos da solicitação
        const { data: request, error: fetchError } = await supabase
          .from('access_requests')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError || !request) {
          console.error('❌ Erro ao buscar dados da solicitação:', fetchError);
          throw new Error('Não foi possível buscar dados da solicitação');
        }

        // Verificar se já existe um perfil para este usuário
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', request.email)
          .single();

        if (!existingProfile) {
          // Criar perfil do usuário
          const newUserId = crypto.randomUUID();
          const userProfileData = {
            id: newUserId,
            name: request.name,
            email: request.email,
            role: request.requested_role,
            organization_id: request.organization_id || null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          console.log('👤 Criando perfil do usuário:', userProfileData);

          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([userProfileData]);

          if (profileError) {
            console.error('❌ Erro ao criar perfil do usuário:', profileError);
            throw new Error('Erro ao criar perfil do usuário');
          }

          console.log('✅ Perfil do usuário criado com sucesso');
        } else {
          console.log('👤 Perfil do usuário já existe');
        }

        // Enviar email de boas-vindas com link de configuração de senha
        console.log('📧 Enviando email de boas-vindas...');
        try {
          const emailSent = await sendWelcomeEmail(request.name, request.email);
          
          if (emailSent) {
            console.log('✅ Email de boas-vindas enviado com sucesso');
            toast({
              title: "Sucesso",
              description: "Solicitação aprovada e email de boas-vindas enviado!"
            });
          } else {
            console.warn('⚠️ Solicitação aprovada, mas houve erro no envio do email');
            toast({
              title: "Atenção",
              description: "Solicitação aprovada, mas houve problema no envio do email. Verifique manualmente.",
              variant: "default"
            });
          }
        } catch (emailError) {
          console.error('❌ Erro ao enviar email:', emailError);
          toast({
            title: "Atenção", 
            description: "Solicitação aprovada, mas houve erro no envio do email. O usuário foi criado com sucesso.",
            variant: "default"
          });
        }
      } else {
        toast({
          title: "Sucesso",
          description: "Solicitação atualizada com sucesso."
        });
      }

      await loadAccessRequests();
    } catch (error: any) {
      console.error('💥 Erro ao atualizar solicitação:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar solicitação.",
        variant: "destructive"
      });
    }
  };

  const approveRequest = async (id: string) => {
    await updateAccessRequest(id, { status: 'approved' });
  };

  const rejectRequest = async (id: string) => {
    await updateAccessRequest(id, { status: 'rejected' });
  };

  const submitAccessRequest = async (requestData: {
    name: string;
    email: string;
    requested_role: string;
    justification: string;
    organization_id?: string | null;
  }) => {
    try {
      console.log('📝 Enviando solicitação de acesso:', requestData);

      const { data, error } = await supabase
        .from('access_requests')
        .insert([{
          name: requestData.name,
          email: requestData.email,
          requested_role: requestData.requested_role,
          justification: requestData.justification,
          organization_id: requestData.organization_id,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar solicitação:', error);
        throw error;
      }

      console.log('✅ Solicitação criada com sucesso:', data);
      
      toast({
        title: "Sucesso",
        description: "Sua solicitação foi enviada e está sendo analisada."
      });

      return data;
    } catch (error: any) {
      console.error('💥 Erro ao enviar solicitação:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar solicitação.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    // Só tentar carregar se houver um usuário autenticado
    const checkAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await checkAdminStatus();
        await loadAccessRequests();
      }
    };
    
    checkAndLoad();
  }, []);

  return {
    // Compatibilidade com nomes antigos
    accessRequests,
    requests: accessRequests,
    loading,
    isAdmin,
    loadAccessRequests,
    loadRequests: loadAccessRequests,
    updateAccessRequest,
    approveRequest,
    rejectRequest,
    submitAccessRequest
  };
}
