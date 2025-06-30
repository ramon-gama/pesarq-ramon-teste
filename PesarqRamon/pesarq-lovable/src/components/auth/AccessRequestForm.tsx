
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizations } from "@/hooks/useOrganizations";

export function AccessRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    requested_role: "",
    organization_id: "",
    justification: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { organizations } = useOrganizations();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('access_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          requested_role: formData.requested_role,
          organization_id: formData.organization_id || null,
          justification: formData.justification,
          status: 'pending'
        }]);

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação será analisada em breve."
      });
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Solicitação Enviada!</h3>
          <p className="text-muted-foreground mb-4">
            Sua solicitação de acesso foi enviada com sucesso. Você receberá um email quando ela for analisada.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Fazer Nova Solicitação
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Solicitar Acesso
        </CardTitle>
        <CardDescription>
          Preencha o formulário para solicitar acesso à plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Todas as solicitações são analisadas manualmente. Você receberá uma resposta por email.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Tipo de Acesso Solicitado *</Label>
            <Select value={formData.requested_role} onValueChange={(value) => setFormData(prev => ({ ...prev, requested_role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unb_researcher">Pesquisador UnB</SelectItem>
                <SelectItem value="partner_admin">Administrador de Órgão Parceiro</SelectItem>
                <SelectItem value="partner_user">Usuário de Órgão Parceiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.requested_role === 'partner_admin' || formData.requested_role === 'partner_user') && (
            <div>
              <Label htmlFor="organization">Organização</Label>
              <Select value={formData.organization_id} onValueChange={(value) => setFormData(prev => ({ ...prev, organization_id: value }))}>
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

          <div>
            <Label htmlFor="justification">Justificativa *</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
              placeholder="Explique por que você precisa de acesso à plataforma..."
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
