import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization_id?: string;
  is_active: boolean;
  avatar_url?: string;
  phone?: string;
  position?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

const getNameFromEmail = (email: string): string => {
  if (email === 'carloshunb@gmail.com') {
    return 'Carlos Leite';
  }
  
  const localPart = email.split('@')[0];
  const cleanName = localPart.replace(/[^a-zA-Z]/g, ' ');
  const words = cleanName.split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) {
    return 'Usuário';
  }
  
  const formattedWords = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  
  if (formattedWords.length === 1) {
    formattedWords.push('Silva');
  }
  
  return formattedWords.join(' ');
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔄 useAuth: Iniciando...');
    
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session?.user) {
          console.log('✅ useAuth: Usuário encontrado:', session.user.email);
          setUser(session.user);
          
          // Verificar se precisa trocar senha
          const needsChange = session.user.user_metadata?.needs_password_change === true;
          setNeedsPasswordChange(needsChange);
          
          // Buscar perfil do usuário
          try {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (mounted) {
              if (profile) {
                setUserProfile(profile);
              } else {
                // Criar perfil se não existir
                const newProfile = {
                  id: session.user.id,
                  name: getNameFromEmail(session.user.email || ''),
                  email: session.user.email || '',
                  role: session.user.email === 'carloshunb@gmail.com' ? 'unb_admin' : 'partner_user',
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };

                const { data: createdProfile } = await supabase
                  .from('user_profiles')
                  .insert([newProfile])
                  .select()
                  .single();

                if (mounted) {
                  setUserProfile(createdProfile || newProfile);
                }
              }
            }
          } catch (error) {
            console.error('❌ useAuth: Erro ao buscar/criar perfil:', error);
          }
        } else {
          console.log('❌ useAuth: Nenhum usuário encontrado');
          setUser(null);
          setUserProfile(null);
          setNeedsPasswordChange(false);
        }
        
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('💥 useAuth: Erro na inicialização:', error);
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔔 useAuth: Estado mudou:', event);
        
        if (!mounted) return;
        
        setUser(session?.user || null);
        if (!session?.user) {
          setUserProfile(null);
          setNeedsPasswordChange(false);
        } else {
          const needsChange = session.user.user_metadata?.needs_password_change === true;
          setNeedsPasswordChange(needsChange);
        }
        
        setLoading(false);
        setIsInitialized(true);
      }
    );

    // Obter sessão inicial
    getSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user || !userProfile) {
        console.error('❌ useAuth: Usuário não autenticado');
        return { success: false, error: 'Usuário não autenticado' };
      }

      console.log('💾 useAuth: Atualizando perfil:', updates);

      // Garantir que só enviamos campos que existem na interface
      const allowedFields = ['name', 'phone', 'position', 'bio', 'avatar_url'];
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key as keyof UserProfile];
          return obj;
        }, {} as any);

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...filteredUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ useAuth: Erro ao atualizar perfil no Supabase:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar perfil: " + error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      console.log('✅ useAuth: Perfil atualizado no Supabase:', data);

      const updatedProfile = { ...userProfile, ...filteredUpdates };
      setUserProfile(updatedProfile);
      
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso",
      });

      return { success: true };
    } catch (error: any) {
      console.error('💥 useAuth: Erro inesperado ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar perfil",
        variant: "destructive",
      });
      return { success: false, error: 'Erro inesperado' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 useAuth: Tentando login para:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ useAuth: Erro no login:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ useAuth: Login realizado com sucesso');
      return { success: true };
    } catch (error) {
      console.error('💥 useAuth: Exceção no login:', error);
      return { success: false, error: 'Erro inesperado no login' };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('📝 useAuth: Tentando cadastro para:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });

      if (error) {
        console.error('❌ useAuth: Erro no cadastro:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ useAuth: Cadastro realizado com sucesso');
      return { success: true };
    } catch (error) {
      console.error('💥 useAuth: Exceção no cadastro:', error);
      return { success: false, error: 'Erro inesperado no cadastro' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      console.log('👋 useAuth: Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ useAuth: Erro no logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  const markPasswordChanged = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { needs_password_change: false }
      });
      
      if (!error) {
        setNeedsPasswordChange(false);
      }
    } catch (error) {
      console.error('Erro ao marcar senha como alterada:', error);
    }
  };

  const isUnbUser = () => {
    return userProfile?.role === 'unb_admin' || userProfile?.role === 'unb_researcher';
  };

  const isAuthenticated = !!user;

  return {
    user,
    userProfile,
    loading,
    isInitialized,
    needsPasswordChange,
    signIn,
    signUp,
    signOut,
    logout: signOut,
    updateProfile,
    markPasswordChanged,
    isUnbUser,
    isAuthenticated
  };
}
