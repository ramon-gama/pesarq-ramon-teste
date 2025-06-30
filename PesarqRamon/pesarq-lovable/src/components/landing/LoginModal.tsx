
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, Mail, Lock, Building2, Info, Loader2, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    
    console.log('LoginModal: Tentando fazer login...');
    
    try {
      const result = await signIn(email, password);
      if (result.success) {
        console.log('LoginModal: Login bem-sucedido, navegando para dashboard...');
        onOpenChange(false);
        resetForm();
        
        console.log('LoginModal: Navegando para /dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('LoginModal: Falha no login');
        setError(result.error || "Email ou senha incorretos");
      }
    } catch (error) {
      console.error('LoginModal: Erro no login:', error);
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      if (activeTab === 'login') {
        handleLogin();
      }
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={loading ? undefined : onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#15AB92]" />
                <p className="text-sm text-slate-600">
                  Entrando na plataforma...
                </p>
              </div>
            </div>
          )}
          
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-[#15AB92]" />
              Acesso à Plataforma
            </DialogTitle>
            <DialogDescription>
              Entre na sua conta ou solicite acesso à plataforma
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" disabled={loading}>Entrar</TabsTrigger>
              <TabsTrigger value="contact" disabled={loading}>Solicitar Acesso</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="login-email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="suasenha123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="text-sm text-[#15AB92] hover:text-[#0d8f7a] underline hover:no-underline disabled:opacity-50 cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              
              <Button 
                onClick={handleLogin} 
                disabled={loading}
                className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <Alert>
                <MessageCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-medium">
                      Para solicitar acesso à plataforma, entre em contato conosco:
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-[#15AB92]" />
                        <span>Email: <strong>carloshunb@gmail.com</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3 w-3 text-[#15AB92]" />
                        <span>Departamento: <strong>Universidade de Brasília</strong></span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-blue-800">
                        <strong>Informações necessárias para sua solicitação:</strong>
                      </p>
                      <ul className="text-xs text-blue-700 mt-1 space-y-1">
                        <li>• Nome completo</li>
                        <li>• Email institucional</li>
                        <li>• Organização/Órgão</li>
                        <li>• Tipo de acesso desejado</li>
                        <li>• Justificativa para uso da plataforma</li>
                      </ul>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Resposta rápida garantida!</h4>
                <p className="text-sm text-green-800">
                  Nossa equipe responde todas as solicitações em até <strong>24 horas</strong>. 
                  Após a aprovação, você receberá suas credenciais de acesso por email.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ForgotPasswordModal 
        open={showForgotPassword} 
        onOpenChange={setShowForgotPassword}
        initialEmail={email}
      />
    </>
  );
}
