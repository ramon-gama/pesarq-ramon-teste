
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FirstLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

export function FirstLoginModal({ open, onOpenChange, userEmail }: FirstLoginModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Preencha todos os campos");
      return;
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('🔄 Alterando senha do usuário...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Erro ao alterar senha:', error);
        setError(`Erro ao alterar senha: ${error.message}`);
      } else {
        console.log('✅ Senha alterada com sucesso');
        setSuccess(true);
        toast({
          title: "Senha alterada com sucesso!",
          description: "Sua senha foi atualizada. Você pode continuar usando a plataforma."
        });
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
          onOpenChange(false);
          window.location.reload(); // Recarregar para atualizar estado
        }, 2000);
      }
    } catch (error: any) {
      console.error('💥 Erro inesperado:', error);
      setError("Erro inesperado ao alterar senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !success) {
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={loading || success ? undefined : handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#15AB92]" />
            Primeira Configuração de Senha
          </DialogTitle>
          <DialogDescription>
            {success 
              ? "Senha configurada com sucesso!"
              : "Para sua segurança, altere a senha padrão para uma senha pessoal"
            }
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Sua senha foi alterada com sucesso!
              </p>
              <p className="text-xs text-gray-500">
                Redirecionando...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Senha atual:</strong> 123456 (senha padrão temporária)
                <br />
                <strong>Email:</strong> {userEmail}
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
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
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
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handlePasswordChange()}
                />
              </div>
            </div>

            <Button 
              onClick={handlePasswordChange}
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Alterando Senha...
                </>
              ) : (
                "Alterar Senha"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Após alterar sua senha, você poderá fazer login normalmente com suas novas credenciais.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
