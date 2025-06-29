import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Building2, Calendar, Link, Copy, ExternalLink, FileText } from "lucide-react";
import { AccessRequest } from "@/hooks/useAccessRequests";
import { useToast } from "@/hooks/use-toast";
import { generatePasswordSetupLink } from "@/utils/passwordSetupUtils";

interface AccessRequestViewModalProps {
  request: AccessRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AccessRequestViewModal({ request, isOpen, onClose }: AccessRequestViewModalProps) {
  const [setupLink, setSetupLink] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const { toast } = useToast();

  if (!request) return null;

  const generateSetupPasswordLink = async () => {
    setIsGeneratingLink(true);
    
    try {
      console.log('🔄 Iniciando geração de link para:', request.email);
      
      const link = await generatePasswordSetupLink(request.email);
      setSetupLink(link);

      toast({
        title: "Link gerado com sucesso!",
        description: `Link de configuração criado para ${request.email}.`
      });
      
      console.log('✅ Link gerado e exibido com sucesso');
      
    } catch (error: any) {
      console.error('❌ Erro detalhado ao gerar link:', {
        error,
        message: error?.message,
        code: error?.code,
        details: error?.details
      });
      
      let errorMessage = "Erro desconhecido ao gerar link de configuração.";
      
      if (error?.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      toast({
        title: "Erro ao gerar link",
        description: errorMessage,
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

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Aprovada', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejeitada', className: 'bg-red-100 text-red-800' }
    };
    
    const config = configs[status as keyof typeof configs] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
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
            <FileText className="h-5 w-5 text-primary" />
            Detalhes da Solicitação de Acesso
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Solicitação */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{request.name}</h3>
              <div className="flex gap-2">
                {getRoleBadge(request.requested_role)}
                {getStatusBadge(request.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">E-mail:</span>
                </div>
                <p className="text-sm">{request.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">Organização:</span>
                </div>
                <p className="text-sm">
                  {request.organizations?.name || (request.requested_role === 'unb_admin' ? 'Não aplicável (Admin UnB)' : 'Não informado')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Solicitado em:</span>
                </div>
                <p className="text-sm">{new Date(request.created_at).toLocaleString('pt-BR')}</p>
              </div>

              {request.reviewed_at && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Revisado em:</span>
                  </div>
                  <p className="text-sm">{new Date(request.reviewed_at).toLocaleString('pt-BR')}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Justificativa */}
          <div className="space-y-2">
            <h4 className="font-medium">Justificativa</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">{request.justification}</p>
            </div>
          </div>

          {/* Link de Configuração de Senha - apenas para solicitações aprovadas */}
          {request.status === 'approved' && (
            <>
              <Separator />
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
                    {isGeneratingLink ? "Gerando..." : "Gerar Link de Configuração"}
                  </Button>

                  {setupLink && (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                      <Alert className="mb-3 bg-amber-50 border-amber-200">
                        <ExternalLink className="h-4 w-4" />
                        <AlertDescription className="text-amber-800">
                          <strong>IMPORTANTE:</strong> Envie este link para {request.email} por email ou WhatsApp.
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
            </>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
