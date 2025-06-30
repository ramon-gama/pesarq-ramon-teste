
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_PASSWORD = '123456';

export const createUserWithDefaultPassword = async (userEmail: string, userName: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔧 Criando usuário com senha padrão para:', userEmail);
    
    // Criar usuário com senha padrão usando Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: userEmail,
      password: DEFAULT_PASSWORD,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        name: userName,
        needs_password_change: true // Flag para indicar que precisa trocar senha
      }
    });

    if (error) {
      console.error('❌ Erro ao criar usuário:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Usuário criado com sucesso');
    return { success: true };
    
  } catch (error) {
    console.error('💥 Erro ao criar usuário:', error);
    return { success: false, error: 'Erro inesperado ao criar usuário' };
  }
};

// Função para gerar o link de configuração
export const generatePasswordSetupLink = (userEmail: string, baseUrl?: string): string => {
  const base = baseUrl || window.location.origin;
  const params = new URLSearchParams({ 
    email: userEmail
  });
  return `${base}/setup-password?${params.toString()}`;
};

export const sendSimpleWelcomeEmail = async (userEmail: string, userName: string): Promise<boolean> => {
  try {
    console.log('📧 Enviando email de boas-vindas simples para:', userEmail);
    
    // Enviar email usando a edge function com informações simples
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        userName,
        userEmail,
        defaultPassword: DEFAULT_PASSWORD,
        isSimpleSetup: true
      }
    });

    if (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }

    console.log('✅ Email enviado com sucesso:', data);
    return data?.success || true;
    
  } catch (error) {
    console.error('💥 Erro ao enviar email:', error);
    return false;
  }
};
