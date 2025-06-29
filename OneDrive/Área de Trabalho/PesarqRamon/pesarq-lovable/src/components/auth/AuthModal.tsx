
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, UserPlus, Mail, Lock, Building2, User, Briefcase, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizations } from "@/hooks/useOrganizations";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<'unb_admin' | 'unb_researcher' | 'partner_admin' | 'partner_user'>('partner_user');
  const [organizationId, setOrganizationId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { organizations } = useOrganizations();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    
    const result = await signIn(email, password);
    
    if (result.success) {
      onOpenChange(false);
      resetForm();
    } else {
      setError(result.error || "Erro no login");
    }
    
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError("");

    if (!name || !email || !password) {
      setError("Preencha todos os campos obrigatórios");
      setLoading(false);
      return;
    }

    if ((role === 'partner_admin' || role === 'partner_user') && !organizationId) {
      setError("Selecione uma organização");
      setLoading(false);
      return;
    }

    const result = await signUp(email, password, {
      name,
      role,
      organization_id: organizationId || undefined
    });

    if (result.success) {
      onOpenChange(false);
      resetForm();
    } else {
      setError(result.error || "Erro no cadastro");
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setRole('partner_user');
    setOrganizationId("");
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      if (activeTab === 'login') {
        handleLogin();
      } else {
        handleSignUp();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#15AB92]" />
              <p className="text-sm text-slate-600">
                {activeTab === 'login' ? 'Entrando...' : 'Criando conta...'}
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
            Entre na sua conta ou cadastre-se para acessar o dashboard
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" disabled={loading}>Entrar</TabsTrigger>
            <TabsTrigger value="signup" disabled={loading}>Cadastrar</TabsTrigger>
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
                  placeholder="seu@email.com"
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
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
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

          <TabsContent value="signup" className="space-y-4 mt-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label>Tipo de Usuário</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    { value: 'unb_admin', label: 'Administrador UnB', description: 'Acesso total ao sistema' },
                    { value: 'unb_researcher', label: 'Pesquisador UnB', description: 'Pesquisador da Universidade de Brasília' },
                    { value: 'partner_admin', label: 'Administrador Parceiro', description: 'Administrador do órgão parceiro' },
                    { value: 'partner_user', label: 'Usuário Parceiro', description: 'Usuário do órgão parceiro' }
                  ].map((type) => (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-all ${
                        role === type.value ? 'ring-2 ring-[#15AB92] bg-green-50' : 'hover:bg-slate-50'
                      } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => !loading && setRole(type.value as any)}
                    >
                      <CardContent className="pt-3 pb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                            role === type.value ? 'bg-[#15AB92] border-[#15AB92]' : 'border-slate-300'
                          }`} />
                          <div>
                            <h4 className="font-medium text-sm">{type.label}</h4>
                            <p className="text-xs text-slate-600 mt-1">{type.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-name">Nome Completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="signup-name"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              {(role === 'partner_admin' || role === 'partner_user') && (
                <div className="space-y-2">
                  <Label htmlFor="signup-organization">Organização *</Label>
                  <Select value={organizationId} onValueChange={setOrganizationId} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua organização" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Crie uma senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSignUp} 
              disabled={loading}
              className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
