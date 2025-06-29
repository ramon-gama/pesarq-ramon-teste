
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/landing/LoginModal';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProtectedDashboardProps {
  children: React.ReactNode;
}

export function ProtectedDashboard({ children }: ProtectedDashboardProps) {
  const { user, loading, isInitialized } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    console.log('🛡️ ProtectedDashboard: Estado:', { 
      hasUser: !!user, 
      loading, 
      isInitialized 
    });

    // Só mostrar login se estiver totalmente inicializado e sem usuário
    if (isInitialized && !loading && !user) {
      console.log('🔓 ProtectedDashboard: Mostrando login');
      setShowLogin(true);
    } else if (user) {
      console.log('✅ ProtectedDashboard: Usuário autenticado');
      setShowLogin(false);
    }
  }, [user, loading, isInitialized]);

  // Ainda inicializando ou carregando
  if (!isInitialized || loading) {
    console.log('⏳ ProtectedDashboard: Carregando...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#15AB92]" />
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Sem usuário - mostrar tela de login
  if (!user) {
    console.log('🔒 ProtectedDashboard: Sem usuário, mostrando tela de login');
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#15AB92] rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sistema de Gestão Arquivística
            </h1>
            <p className="text-gray-600">
              Faça login para acessar o sistema
            </p>
          </div>
        </div>
        <LoginModal open={showLogin} onOpenChange={setShowLogin} />
      </>
    );
  }

  // Usuário autenticado
  console.log('🎉 ProtectedDashboard: Renderizando dashboard');
  return <>{children}</>;
}
