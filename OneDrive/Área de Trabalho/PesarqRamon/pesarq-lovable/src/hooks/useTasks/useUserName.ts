
import { supabase } from "@/integrations/supabase/client";

// Função para extrair nome do user_profiles
const getNameFromUserProfile = async (userId: string): Promise<string> => {
  try {
    console.log('🔍 Fetching user profile for ID:', userId);
    
    // Buscar direto na tabela user_profiles
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('name, email')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Error fetching user profile:', error);
      return 'Usuário Silva';
    }

    if (profile?.name) {
      console.log('✅ Found name in profile:', profile.name);
      return profile.name;
    }

    // Se não tem nome no perfil, usar o email como fallback
    if (profile?.email) {
      const emailName = profile.email.split('@')[0];
      const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      console.log('📧 Using email as name:', formattedName);
      return formattedName + ' Silva';
    }

    return 'Usuário Silva';

  } catch (error) {
    console.error('💥 Error in getNameFromUserProfile:', error);
    return 'Usuário Silva';
  }
};

export async function fetchUserName(userId: string): Promise<string> {
  console.log('🔍 Fetching user name for ID:', userId);
  
  try {
    // Primeiro tentar buscar o usuário atual autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && user.id === userId) {
      // Se é o usuário atual, buscar seu perfil
      const userName = await getNameFromUserProfile(userId);
      console.log('✅ Found name for current user:', userName);
      return userName;
    }
    
    // Se não é o usuário atual, buscar na tabela user_profiles
    const userName = await getNameFromUserProfile(userId);
    console.log('✅ Found name for user:', userName);
    return userName;
    
  } catch (error) {
    console.error('💥 Error fetching user name:', error);
    return 'Usuário Silva';
  }
}
