
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, AlertTriangle } from "lucide-react";

interface ProtectedUnbRouteProps {
  children: ReactNode;
}

export function ProtectedUnbRoute({ children }: ProtectedUnbRouteProps) {
  const { userProfile, loading, isInitialized } = useAuth();

  console.log('🎓 ProtectedUnbRoute - Estado:', {
    userRole: userProfile?.role,
    loading,
    isInitialized,
    isUnbUser: userProfile?.role === 'unb_admin' || userProfile?.role === 'unb_researcher'
  });

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Verificar se é usuário UnB (admin ou pesquisador)
  const isUnbUser = userProfile?.role === 'unb_admin' || userProfile?.role === 'unb_researcher';
  
  if (!userProfile || !isUnbUser) {
    console.log('❌ ProtectedUnbRoute - Acesso negado para:', userProfile?.role);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-4">
              Esta página é restrita apenas para usuários da Universidade de Brasília (UnB).
            </p>
            <div className="text-sm text-gray-500">
              <GraduationCap className="h-4 w-4 inline mr-1" />
              Você precisa ser um administrador ou pesquisador da UnB para acessar a gestão de projetos.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
