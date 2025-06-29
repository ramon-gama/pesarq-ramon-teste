
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, CheckCircle, Loader2, Mail, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetPasswordModal({ open, onOpenChange }: ResetPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      checkRecoverySession();
    }
  }, [open]);

  const checkRecoverySession = async () => {
    console.log('🔍 Verificando sessão de recuperação...');
    setCheckingSession(true);
    setError("");
    
    try {
      // Extrair todos os parâmetros possíveis da URL
      const urlParams = new URLSearchParams(window.location.search);
      const fragment = window.location.hash.substring(1);
      const fragmentParams = new URLSearchParams(fragment);
      
      // Combinar parâmetros da query string e fragment
      const allParams = new Map();
      urlParams.forEach((value, key) => allParams.set(key, value));
      fragmentParams.forEach((value, key) => allParams.set(key, value));
      
      const accessToken = allParams.get('access_token');
      const refreshToken = allParams.get('refresh_token');
      const type = allParams.get('type');
      const error_code = allParams.get('error');
      const error_description = allParams.get('error_description');
      
      console.log('🔍 Parâmetros encontrados:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        type,
        error_code,
        error_description,
        allParams: Object.fromEntries(allParams.entries())
      });

      // Verificar se há erros na URL
      if (error_code) {
        console.error('❌ Erro na URL:', error_code, error_description);
        setError("Link com erro. Solicite um novo link.");
        setIsValidSession(false);
        setCheckingSession(false);
        return;
      }

      // Tentar estabelecer sessão se há tokens
      if (accessToken) {
        console.log('🔄 Tentando estabelecer sessão...');
        
        try {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (sessionError) {
            console.error('❌ Erro ao estabelecer sessão:', sessionError);
            // Não falhar imediatamente, tentar verificar sessão existente
          } else if (data.session) {
            console.log('✅ Sessão estabelecida com sucesso:', data.session.user?.email);
            setIsValidSession(true);
            setCheckingSession(false);
            return;
          }
        } catch (sessionSetError) {
          console.error('💥 Erro ao definir sessão:', sessionSetError);
          // Continuar para verificar sessão existente
        }
      }
      
      // Verificar se já existe uma sessão válida
      const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
      
      if (getSessionError) {
        console.error('❌ Erro ao obter sessão:', getSessionError);
      }
      
      if (session?.user) {
        console.log('✅ Sessão válida encontrada:', session.user.email);
        setIsValidSession(true);
      } else {
        console.log('❌ Nenhuma sessão válida');
        
        // Se estamos aqui devido a um link de recuperação, mas não conseguimos estabelecer sessão
        if (type === 'recovery' || accessToken || allParams.has('token')) {
          setError("Link expirado. Por favor, solicite um novo link.");
        } else {
          setError("Acesso não autorizado. Você precisa de um link válido para configurar sua senha.");
        }
        setIsValidSession(false);
      }
      
    } catch (error) {
      console.error('💥 Erro geral ao verificar sessão:', error);
      setError("Erro ao processar link. Tente novamente ou solicite um novo link.");
      setIsValidSession(false);
    } finally {
      setCheckingSession(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError("Preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('🔄 Atualizando senha do usuário...');
      
      // Verificar sessão uma última vez antes de atualizar
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Erro ao verificar sessão:', sessionError);
        setError("Erro ao verificar sessão. Tente novamente.");
        return;
      }
      
      if (!session?.user) {
        console.error('❌ Nenhuma sessão ativa encontrada');
        setError("Sessão não encontrada. Solicite um novo link.");
        return;
      }
      
      console.log('📧 Usuário da sessão:', session.user.email);
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('❌ Erro ao atualizar senha:', error);
        setError(`Erro ao definir senha: ${error.message}`);
      } else {
        console.log('✅ Senha atualizada com sucesso');
        setSuccess(true);
        toast({
          title: "Senha definida com sucesso!",
          description: "Sua senha foi configurada. Você pode fazer login agora."
        });
      }
    } catch (error: any) {
      console.error('💥 Erro inesperado:', error);
      setError("Erro inesperado ao definir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
    setIsValidSession(false);
    setCheckingSession(true);
    onOpenChange(false);
  };

  const handleRequestNewLink = () => {
    handleClose();
    toast({
      title: "Solicite um novo link",
      description: "Entre em contato com o administrador para receber um novo link de configuração.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#15AB92]" />
            Configurar Senha de Acesso
          </DialogTitle>
          <DialogDescription>
            {checkingSession 
              ? "Verificando link de configuração..."
              : success 
                ? "Senha configurada com sucesso!"
                : isValidSession
                  ? "Defina sua senha para acessar a plataforma"
                  : "Link inválido ou expirado"
            }
          </DialogDescription>
        </DialogHeader>

        {checkingSession ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-[#15AB92]" />
          </div>
        ) : success ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Sua senha foi configurada com sucesso!
              </p>
              <p className="text-xs text-gray-500">
                Você pode fechar esta janela e fazer login na plataforma.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]">
              Fechar e Fazer Login
            </Button>
          </div>
        ) : !isValidSession ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error || "O link de configuração está inválido ou expirado."}
              </AlertDescription>
            </Alert>
            
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Entre em contato com o administrador para solicitar um novo link de configuração.
              </p>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleRequestNewLink}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Solicitar Novo Link
                </Button>
                
                <Button 
                  onClick={handleClose}
                  variant="ghost"
                  className="w-full"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleResetPassword()}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleResetPassword}
                disabled={loading || !password || !confirmPassword}
                className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Configurando...
                  </>
                ) : (
                  "Configurar Senha"
                )}
              </Button>
              
              <Button 
                onClick={handleRequestNewLink}
                variant="outline"
                disabled={loading}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Solicitar Novo Link
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
