
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuthToken() {
  const { toast } = useToast();

  const refreshToken = useCallback(async () => {
    try {
      console.log('🔄 Refreshing auth token...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Error refreshing token:', error);
        // Se não conseguir refresh, fazer logout
        await supabase.auth.signOut();
        return false;
      }
      
      console.log('✅ Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('💥 Exception refreshing token:', error);
      await supabase.auth.signOut();
      return false;
    }
  }, []);

  const handleAuthError = useCallback(async (error: any) => {
    if (error?.code === 'PGRST301' || error?.message?.includes('JWT expired')) {
      console.log('🔑 JWT expired, attempting refresh...');
      const refreshed = await refreshToken();
      
      if (!refreshed) {
        toast({
          title: "Sessão Expirada",
          description: "Sua sessão expirou. Faça login novamente.",
          variant: "destructive",
        });
      }
      
      return refreshed;
    }
    return false;
  }, [refreshToken, toast]);

  // Configurar interceptor para refresh automático
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token was refreshed automatically');
        }
        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    refreshToken,
    handleAuthError
  };
}
