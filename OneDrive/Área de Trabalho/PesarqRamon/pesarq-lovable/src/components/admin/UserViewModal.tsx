
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Building2, Shield, Calendar, User, Link, Copy, ExternalLink } from "lucide-react";
import { UserProfile } from "@/hooks/useUserManagement";
import { useToast } from "@/hooks/use-toast";
import { generatePasswordSetupLink } from "@/utils/passwordSetupUtils";

interface UserViewModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserViewModal({ user, isOpen, onClose }: UserViewModalProps) {
  const [setupLink, setSetupLink] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const { toast } = useToast();

  if (!user) return null;

  const generateSetupPasswordLink = async () => {
    setIsGeneratingLink(true);
    try {
      const link = await generatePasswordSetupLink(user.email);
      setSetupLink(link);

      toast({
        title: "Link gerado!",
        description: "Link de configuração de senha gerado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao gerar link:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar link de configuração.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência."
      });
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive"
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const configs = {
      unb_admin: { label: 'Admin UnB', className: 'bg-red-100 text-red-800' },
      unb_researcher: { label: 'Pesquisador UnB', className: 'bg-blue-100 text-blue-800' },
      partner_admin: { label: 'Admin Parceiro', className: 'bg-purple-100 text-purple-800' },
      partner_user: { label: 'Usuário Parceiro', className: 'bg-green-100 text-green-800' }
    };
    
    const config = configs[role as keyof typeof configs] || { label: role, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Detalhes do Usuário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <div className="flex gap-2">
                {getRoleBadge(user.role)}
                <Badge variant={user.is_active ? "default" : "secondary"}>
                  {user.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">E-mail:</span>
                </div>
                <p className="text-sm">{user.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">Organização:</span>
                </div>
                <p className="text-sm">
                  {user.organizations?.name || (user.role === 'unb_admin' ? 'Não vinculado (Admin UnB)' : 'Não informado')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Link de Configuração de Senha */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Link className="h-4 w-4" />
              Link de Configuração de Senha
            </h4>

            <div className="space-y-3">
              <Button
                onClick={generateSetupPasswordLink}
                disabled={isGeneratingLink}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Link className="h-4 w-4 mr-2" />
                {isGeneratingLink ? "Gerando..." : "Gerar Link"}
              </Button>

              {setupLink && (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                  <Alert className="mb-3 bg-amber-50 border-amber-200">
                    <ExternalLink className="h-4 w-4" />
                    <AlertDescription className="text-amber-800">
                      <strong>IMPORTANTE:</strong> Envie este link para {user.email} por email ou WhatsApp.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={setupLink}
                        readOnly
                        className="text-xs font-mono bg-white border-blue-200 text-blue-800"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(setupLink)}
                        className="shrink-0 bg-blue-600 hover:bg-blue-700"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </Button>
                    </div>
                    
                    <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                      🔒 <strong>Segurança:</strong> Este link será invalidado automaticamente após o primeiro uso
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações do Sistema */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Informações do Sistema
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Criado em:</span>
                </div>
                <p>{new Date(user.created_at).toLocaleString('pt-BR')}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Última atualização:</span>
                </div>
                <p>{new Date(user.updated_at).toLocaleString('pt-BR')}</p>
              </div>

              <div className="space-y-2">
                <span className="font-medium text-gray-600">ID do Usuário:</span>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded">{user.id}</p>
              </div>

              {user.organization_id && (
                <div className="space-y-2">
                  <span className="font-medium text-gray-600">ID da Organização:</span>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded">{user.organization_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Permissões */}
          <div className="space-y-4">
            <h4 className="font-medium">Permissões</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                {user.role === 'unb_admin' && 'Acesso completo ao sistema como Administrador UnB'}
                {user.role === 'unb_researcher' && 'Acesso como Pesquisador UnB com permissões específicas'}
                {user.role === 'partner_admin' && 'Administrador da organização parceira com acesso limitado'}
                {user.role === 'partner_user' && 'Usuário da organização parceira com acesso básico'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
