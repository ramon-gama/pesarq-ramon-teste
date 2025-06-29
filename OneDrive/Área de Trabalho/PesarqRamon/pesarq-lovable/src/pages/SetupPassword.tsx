
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, CheckCircle, Loader2, Mail, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function SetupPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get('email');
    console.log('📧 Email do parâmetro:', emailParam);
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setError("Link inválido. Email não especificado.");
    }
  }, [searchParams]);

  const handleSetupPassword = async () => {
    if (!email || !password || !confirmPassword) {
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
      console.log('🔑 Configurando senha para:', email);
      
      // Fazer logout primeiro para garantir sessão limpa
      await supabase.auth.signOut();
      
      // Tentar fazer cadastro (se usuário não existir) ou login direto
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            needs_password_change: false
          }
        }
      });

      if (signUpError && !signUpError.message.includes('User already registered')) {
        console.error('❌ Erro no cadastro:', signUpError);
        throw new Error(`Erro ao criar conta: ${signUpError.message}`);
      }

      // Se o cadastro foi bem-sucedido ou o usuário já existe, tentar fazer login
      console.log('🔐 Tentando fazer login...');
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (loginError) {
        console.error('❌ Erro no login:', loginError);
        
        // Se o erro é de credenciais inválidas, pode ser que o usuário já tenha uma senha diferente
        if (loginError.message.includes('Invalid login credentials')) {
          throw new Error("Este email já possui uma senha configurada. Entre em contato com o administrador se esqueceu sua senha.");
        }
        
        throw new Error(`Erro ao fazer login: ${loginError.message}`);
      }

      console.log('✅ Login realizado com sucesso');
      setSuccess(true);
      
      toast({
        title: "Sucesso!",
        description: "Senha configurada e login realizado com sucesso!"
      });
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);

    } catch (error: any) {
      console.error('💥 Erro ao configurar senha:', error);
      setError(error.message || "Erro inesperado ao configurar senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/', { replace: true });
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle>Link Inválido</CardTitle>
            <CardDescription>
              Este link de configuração de senha não é válido ou expirou.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBackToLogin} className="w-full">
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {success ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <Lock className="h-16 w-16 text-[#15AB92]" />
            )}
          </div>
          <CardTitle>
            {success ? "Senha Configurada!" : "Configurar Senha de Acesso"}
          </CardTitle>
          <CardDescription>
            {success 
              ? "Sua senha foi configurada com sucesso!"
              : "Configure sua senha para acessar a plataforma"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Você será redirecionado automaticamente para o dashboard.
              </p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]"
              >
                Ir para Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Email:</strong> {email}
                  <br />
                  Configure uma senha pessoal para acessar a plataforma.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleSetupPassword()}
                />
              </div>

              <Button 
                onClick={handleSetupPassword}
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
                variant="outline" 
                onClick={handleBackToLogin}
                disabled={loading}
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
