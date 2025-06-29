
import { supabase } from '@/integrations/supabase/client';

export const generateResetPasswordUrl = (email: string, baseUrl?: string): string => {
  const base = baseUrl || window.location.origin;
  const resetUrl = `${base}/reset-password`;
  const params = new URLSearchParams({ email });
  return `${resetUrl}?${params.toString()}`;
};

export const sendWelcomeEmail = async (userName: string, userEmail: string): Promise<boolean> => {
  try {
    console.log('📧 Preparando envio de email para:', userEmail);
    
    // Primeiro, criar o usuário no Supabase Auth para gerar o link de redefinição de senha
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userEmail,
      email_confirm: false, // Usuário precisará confirmar email
      user_metadata: {
        name: userName
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário no Auth:', authError);
      // Continuar mesmo se o usuário já existir
    }

    // Gerar link de redefinição de senha
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: userEmail,
      options: {
        redirectTo: `${window.location.origin}/reset-password`
      }
    });

    if (resetError) {
      console.error('❌ Erro ao gerar link de recuperação:', resetError);
      // Fallback para link manual
    }

    const resetPasswordUrl = resetData?.properties?.action_link || generateResetPasswordUrl(userEmail);
    
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        userName,
        userEmail,
        resetPasswordUrl,
      }
    });

    if (error) {
      console.error('❌ Erro na função de email:', error);
      throw error;
    }

    console.log('✅ Resposta da função de email:', data);
    return data?.success || false;
  } catch (error) {
    console.error('💥 Erro ao enviar email de boas-vindas:', error);
    return false;
  }
};
