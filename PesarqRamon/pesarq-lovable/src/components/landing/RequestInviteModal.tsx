
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Building2, Mail, Phone, FileText, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RequestInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestInviteModal({ open, onOpenChange }: RequestInviteModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    organizationType: "",
    interest: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.organization || !formData.organizationType || !formData.interest) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mapear interesse para o tipo de role
      let requestedRole = 'partner_user';
      if (formData.interest === 'orgao-parceiro') {
        requestedRole = 'partner_admin';
      } else if (formData.interest === 'pesquisador-unb') {
        requestedRole = 'unb_researcher';
      }

      // Criar justificativa baseada nos dados do formulário
      const justification = `
Organização: ${formData.organization}
Tipo de Organização: ${formData.organizationType}
Cargo/Função: ${formData.position || 'Não informado'}
Telefone: ${formData.phone || 'Não informado'}
Interesse: ${formData.interest}
${formData.message ? `Detalhes adicionais: ${formData.message}` : ''}
      `.trim();

      // Enviar solicitação via Supabase
      const { data, error } = await supabase
        .from('access_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          requested_role: requestedRole,
          justification: justification,
          organization_id: null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Já existe uma solicitação com este email. Verifique se você já solicitou acesso anteriormente.');
        } else {
          throw new Error(error.message || 'Erro ao processar solicitação.');
        }
      }
      
      toast({
        title: "Sucesso",
        description: "Sua solicitação foi enviada e está sendo analisada."
      });

      setIsSubmitted(true);

    } catch (error: any) {
      toast({
        title: "Erro ao enviar solicitação",
        description: error.message || "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  function handleInputChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
      organizationType: "",
      interest: "",
      message: ""
    });
    setIsSubmitted(false);
  }

  function handleClose() {
    onOpenChange(false);
    if (isSubmitted) {
      setTimeout(resetForm, 300);
    }
  }

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              Solicitação Enviada com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-4">
              Obrigado por seu interesse na nossa plataforma! Sua solicitação foi recebida e está sendo analisada por nossa equipe.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Próximos passos:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Nossa equipe analisará sua solicitação</li>
                <li>• Você receberá uma resposta por email em até 2 dias úteis</li>
                <li>• Se aprovado, receberá instruções de acesso à plataforma</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Informações importantes:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Mantenha este email para referência</li>
                <li>• Verifique sua caixa de spam</li>
                <li>• Em caso de dúvidas, entre em contato conosco</li>
              </ul>
            </div>

            <Button 
              onClick={handleClose}
              className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#15AB92]" />
            Solicitar Convite
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para solicitar acesso à plataforma
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Cargo/Função</Label>
              <Input
                id="position"
                placeholder="Seu cargo na organização"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organização *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="organization"
                placeholder="Nome da organização"
                value={formData.organization}
                onChange={(e) => handleInputChange("organization", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization-type">Tipo de Organização *</Label>
            <Select onValueChange={(value) => handleInputChange("organizationType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="federal">Órgão Federal</SelectItem>
                <SelectItem value="estadual">Órgão Estadual</SelectItem>
                <SelectItem value="municipal">Órgão Municipal</SelectItem>
                <SelectItem value="autarquia">Autarquia</SelectItem>
                <SelectItem value="fundacao">Fundação</SelectItem>
                <SelectItem value="empresa">Empresa Pública</SelectItem>
                <SelectItem value="universidade">Universidade</SelectItem>
                <SelectItem value="pesquisa">Instituto de Pesquisa</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest">Interesse Principal *</Label>
            <Select onValueChange={(value) => handleInputChange("interest", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu interesse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orgao-parceiro">Órgão Parceiro – Acesso Total</SelectItem>
                <SelectItem value="pesquisador-unb">Pesquisador UnB – Vínculo com Projeto</SelectItem>
                <SelectItem value="orgao-publico">Órgão Público – Teste e Uso de Ferramentas Gratuitas</SelectItem>
                <SelectItem value="estudante">Estudante – Consulta para Estudos e Pesquisa Acadêmica</SelectItem>
                <SelectItem value="outro">Outro Interesse – Especificar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.interest === "outro" && (
            <div className="space-y-2">
              <Label htmlFor="message">Especificar Interesse *</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Textarea
                  id="message"
                  placeholder="Descreva brevemente seu interesse específico na plataforma..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="pl-10 min-h-[100px]"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-[#15AB92] hover:bg-[#0d8f7a]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
