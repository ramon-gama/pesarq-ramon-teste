
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
}

export function ForgotPasswordModal({ open, onOpenChange, initialEmail = "" }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!email) {
      setError("Digite seu e-mail");
      setLoading(false);
      return;
    }

    try {
      console.log('Current window location:', window.location.href);
      const redirectUrl = `${window.location.origin}/reset-password`;
      console.log('Redirect URL sendo usado:', redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error('Erro ao enviar email de reset:', error);
        setError(error.message);
      } else {
        console.log('Email de reset enviado com sucesso');
        setSent(true);
      }
    } catch (error: any) {
      console.error('Erro geral:', error);
      setError("Erro ao enviar email. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSent(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#15AB92]" />
            Recuperar Senha
          </DialogTitle>
          <DialogDescription>
            {sent 
              ? "Email enviado com sucesso!"
              : "Digite seu e-mail para receber instruções de recuperação"
            }
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Enviamos um link de recuperação para:
              </p>
              <p className="font-medium">{email}</p>
              <p className="text-xs text-gray-500">
                Verifique sua caixa de entrada e spam. O link irá te levar para a página de redefinição de senha.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Fechar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="reset-email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading || !email}
                className="flex-1 bg-[#15AB92] hover:bg-[#0d8f7a]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Link"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
