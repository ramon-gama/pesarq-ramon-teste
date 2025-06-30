import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Proposal } from "@/hooks/useProposals";
import { ExternalLink } from "lucide-react";

interface ProposalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  organizations: Array<{ id: string; name: string }>;
  initialData?: Partial<Proposal> | null;
  mode: 'create' | 'edit';
}

export function ProposalForm({ open, onOpenChange, onSubmit, organizations, initialData, mode }: ProposalFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    organization_id: '',
    status: 'pendente' as 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada',
    description: '',
    estimated_duration_months: '',
    estimated_value: '',
    observations: '',
    tipo_instrumento: '',
    tipo_projeto: '',
    external_link: ''
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      console.log('Dialog closed, resetting form');
      setFormData({
        title: '',
        organization_id: '',
        status: 'pendente',
        description: '',
        estimated_duration_months: '',
        estimated_value: '',
        observations: '',
        tipo_instrumento: '',
        tipo_projeto: '',
        external_link: ''
      });
    }
  }, [open]);

  // Load initial data for editing
  useEffect(() => {
    if (initialData && mode === 'edit' && open) {
      console.log('Loading proposal data for edit:', initialData);
      setFormData({
        title: initialData.title || '',
        organization_id: initialData.organization_id || '',
        status: initialData.status || 'pendente',
        description: initialData.description || '',
        estimated_duration_months: initialData.estimated_duration_months?.toString() || '',
        estimated_value: initialData.estimated_value?.toString() || '',
        observations: initialData.observations || '',
        tipo_instrumento: initialData.tipo_instrumento || '',
        tipo_projeto: initialData.tipo_projeto || '',
        external_link: initialData.external_link || ''
      });
    }
  }, [initialData, mode, open]);

  const isValidUrl = (url: string) => {
    if (!url.trim()) return true; // Empty URLs are valid
    
    // Accept Google Drive/Docs URLs
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      return true;
    }
    
    // Accept URLs that start with http:// or https://
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }
    
    // Accept URLs that look like valid URLs (contain domain-like patterns)
    if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/.test(url)) {
      return true;
    }
    
    return false;
  };

  const normalizeUrl = (url: string) => {
    if (!url) return '';
    
    // If it's a Google Drive/Docs URL without protocol, add https://
    if ((url.includes('drive.google.com') || url.includes('docs.google.com')) && !url.startsWith('http')) {
      return 'https://' + url;
    }
    
    // If it looks like a URL but doesn't have protocol, add https://
    if (!url.startsWith('http://') && !url.startsWith('https://') && url.includes('.')) {
      return 'https://' + url;
    }
    
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started with data:', formData);
    
    if (!formData.title || !formData.organization_id) {
      toast({
        title: "Erro",
        description: "Título e organização são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Validate external link if provided
    if (formData.external_link && !isValidUrl(formData.external_link)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um link válido para o documento",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const normalizedExternalLink = normalizeUrl(formData.external_link);
      
      const proposalData = {
        title: formData.title,
        organization_id: formData.organization_id,
        status: formData.status,
        description: formData.description || undefined,
        estimated_duration_months: formData.estimated_duration_months ? Number(formData.estimated_duration_months) : undefined,
        estimated_value: formData.estimated_value ? Number(formData.estimated_value) : undefined,
        observations: formData.observations || undefined,
        submission_date: new Date().toISOString().split('T')[0],
        tipo_instrumento: formData.tipo_instrumento || undefined,
        tipo_projeto: formData.tipo_projeto || undefined,
        external_link: normalizedExternalLink || undefined
      } as Omit<Proposal, 'id' | 'created_at' | 'updated_at'>;

      console.log('Submitting proposal data:', proposalData);
      await onSubmit(proposalData);
      
      toast({
        title: "Sucesso",
        description: `Proposta ${mode === 'create' ? 'criada' : 'atualizada'} com sucesso`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erro detalhado:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} proposta`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nova Proposta' : 'Editar Proposta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações da Proposta</h3>
            
            <div>
              <Label htmlFor="organization">Organização *</Label>
              <Select 
                value={formData.organization_id} 
                onValueChange={(value) => setFormData({ ...formData, organization_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma organização" />
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

            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título da proposta"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo_projeto">Tipo de Projeto</Label>
                <Select 
                  value={formData.tipo_projeto} 
                  onValueChange={(value) => setFormData({ ...formData, tipo_projeto: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ensino">Ensino</SelectItem>
                    <SelectItem value="Pesquisa">Pesquisa</SelectItem>
                    <SelectItem value="Extensão">Extensão</SelectItem>
                    <SelectItem value="Curso de Pós-Graduação">Curso de Pós-Graduação</SelectItem>
                    <SelectItem value="Desenvolvimento Institucional">Desenvolvimento Institucional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tipo_instrumento">Tipo de Instrumento</Label>
                <Select 
                  value={formData.tipo_instrumento} 
                  onValueChange={(value) => setFormData({ ...formData, tipo_instrumento: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TED">TED - Termo de Execução Descentralizada</SelectItem>
                    <SelectItem value="Convenio">Convênio</SelectItem>
                    <SelectItem value="Contrato">Contrato</SelectItem>
                    <SelectItem value="Plano">Plano de Trabalho</SelectItem>
                    <SelectItem value="Acordo">Acordo</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Link externo */}
            <div>
              <Label htmlFor="external_link">Link do Documento Externo</Label>
              <Input
                id="external_link"
                value={formData.external_link}
                onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                placeholder="Ex: https://docs.google.com/document/d/... ou drive.google.com/file/d/..."
              />
              {formData.external_link && (
                <div className="mt-2">
                  {isValidUrl(formData.external_link) ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600">✓ Link válido</span>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const url = normalizeUrl(formData.external_link);
                          window.open(url, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-red-600">
                      URL inválida. Aceita links do Google Drive, Google Docs e outras URLs válidas.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Restante dos campos */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="aprovada">Aprovada</SelectItem>
                    <SelectItem value="rejeitada">Rejeitada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estimated_duration">Duração Estimada (meses)</Label>
                <Input
                  id="estimated_duration"
                  type="number"
                  value={formData.estimated_duration_months}
                  onChange={(e) => setFormData({ ...formData, estimated_duration_months: e.target.value })}
                  placeholder="12"
                />
              </div>

              <div>
                <Label htmlFor="estimated_value">Valor Estimado (R$)</Label>
                <Input
                  id="estimated_value"
                  type="number"
                  value={formData.estimated_value}
                  onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                  placeholder="0,00"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a proposta..."
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#15AB92] hover:bg-[#0d8f7a]">
              {loading ? 'Salvando...' : mode === 'create' ? 'Criar Proposta' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
