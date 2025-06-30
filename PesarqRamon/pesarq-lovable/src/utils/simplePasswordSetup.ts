
import { supabase } from '@/integrations/supabase/client';

// Função simplificada para gerar o link de configuração de senha
export const generateSimplePasswordSetupLink = (userEmail: string, baseUrl?: string): string => {
  const base = baseUrl || window.location.origin;
  const params = new URLSearchParams({ email: userEmail });
  return `${base}/setup-password?${params.toString()}`;
};

// Função para enviar email simples com link de configuração
export const sendSimplePasswordSetupEmail = async (userEmail: string, userName: string): Promise<boolean> => {
  try {
    console.log('📧 Enviando email de configuração de senha para:', userEmail);
    
    const setupLink = generateSimplePasswordSetupLink(userEmail);
    
    // Enviar email usando a edge function
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        userName,
        userEmail,
        setupPasswordUrl: setupLink,
        isPasswordSetup: true
      }
    });

    if (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }

    console.log('✅ Email de configuração enviado com sucesso:', data);
    return data?.success || true;
    
  } catch (error) {
    console.error('💥 Erro ao enviar email:', error);
    return false;
  }
};
