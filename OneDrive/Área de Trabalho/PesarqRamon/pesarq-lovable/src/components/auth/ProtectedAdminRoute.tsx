
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { userProfile, loading, isInitialized } = useAuth();

  console.log('🔒 ProtectedAdminRoute - Estado:', {
    userRole: userProfile?.role,
    loading,
    isInitialized,
    isUnbAdmin: userProfile?.role === 'unb_admin'
  });

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Verificar se é admin UnB
  if (!userProfile || userProfile.role !== 'unb_admin') {
    console.log('❌ ProtectedAdminRoute - Acesso negado para:', userProfile?.role);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-4">
              Esta página é restrita apenas para administradores da UnB.
            </p>
            <div className="text-sm text-gray-500">
              <Shield className="h-4 w-4 inline mr-1" />
              Você não tem permissão para acessar o painel administrativo.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
