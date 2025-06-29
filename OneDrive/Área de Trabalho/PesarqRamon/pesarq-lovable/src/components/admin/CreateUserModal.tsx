
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Building2, Shield, Check, Info, Copy, Link, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useUserManagement } from "@/hooks/useUserManagement";
import { generatePasswordSetupLink } from "@/utils/passwordSetupUtils";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

export function CreateUserModal({ open, onOpenChange, onUserCreated }: CreateUserModalProps) {
  const { organizations } = useOrganizations();
  const { createUser } = useUserManagement();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "partner_user",
    organization_id: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [setupLink, setSetupLink] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (formData.role !== "unb_admin" && !formData.organization_id) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma organização para este usuário.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Criar usuário através do sistema de solicitações aprovadas automaticamente
      const result = await createUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        organization_id: formData.role === "unb_admin" ? undefined : formData.organization_id
      });

      // Gerar link de configuração
      const link = generatePasswordSetupLink(formData.email);
      setSetupLink(link);

      setUserCreated(true);
      onUserCreated();

      toast({
        title: "Sucesso",
        description: `Usuário criado! Link de configuração gerado.`
      });

    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar usuário.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "partner_user",
      organization_id: ""
    });
    setUserCreated(false);
    setSetupLink("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetForm, 300);
  };

  const activeOrganizations = organizations.filter(org => org.status === 'ativa');

  if (userCreated) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              Usuário Criado com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-4">
              O usuário foi criado e um link de configuração foi gerado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Usuário:</strong> {formData.name} ({formData.email})
              </AlertDescription>
            </Alert>

            {setupLink && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Link className="h-6 w-6 text-blue-600" />
                  <h4 className="font-bold text-blue-900 text-lg">🔗 Link de Configuração de Senha</h4>
                </div>
                
                <Alert className="mb-4 bg-amber-50 border-amber-200">
                  <ExternalLink className="h-4 w-4" />
                  <AlertDescription className="text-amber-800">
                    <strong>IMPORTANTE:</strong> Envie este link para o usuário por email ou WhatsApp.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-blue-900">
                    Link para enviar ao usuário:
                  </Label>
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
                    🔒 <strong>Senha temporária:</strong> 123456 (será alterada no primeiro acesso)
                  </div>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Próximos Passos:
              </h4>
              <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                <li>Copie o link de configuração acima</li>
                <li>Envie o link para <strong>{formData.email}</strong> por email ou WhatsApp</li>
                <li>Informe que a senha temporária é <strong>123456</strong></li>
                <li>O usuário acessará o link para definir sua senha definitiva</li>
                <li>Após configurar a senha, ele poderá fazer login no sistema</li>
              </ol>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
                Entendi, Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#15AB92]" />
            Cadastrar Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Crie uma conta para um novo usuário
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Após criar o usuário, você receberá um link para enviar ao usuário configurar sua senha.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              placeholder="Nome do usuário"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Tipo de Usuário *</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="partner_user">Usuário Parceiro</SelectItem>
                <SelectItem value="partner_admin">Administrador Parceiro</SelectItem>
                <SelectItem value="unb_researcher">Pesquisador UnB</SelectItem>
                <SelectItem value="unb_admin">Administrador UnB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role !== "unb_admin" && (
            <div className="space-y-2">
              <Label htmlFor="organization">Organização *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Select 
                  value={formData.organization_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, organization_id: value }))}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecione uma organização" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeOrganizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{org.name}</span>
                          {org.acronym && (
                            <span className="text-xs text-gray-500">{org.acronym}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-500">
                Usuários parceiros devem ser vinculados a uma organização
              </p>
            </div>
          )}

          {formData.role === "unb_admin" && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Administradores UnB não são vinculados a organizações específicas e têm acesso a todas as organizações do sistema.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              {isSubmitting ? "Criando..." : "Criar Usuário"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
