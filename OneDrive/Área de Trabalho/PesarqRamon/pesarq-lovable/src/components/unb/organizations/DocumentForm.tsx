
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ProposalDocument } from "@/hooks/useProposals";

interface DocumentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<ProposalDocument, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  proposalId: string;
  initialData?: Partial<ProposalDocument>;
  mode: 'create' | 'edit';
}

export function DocumentForm({ open, onOpenChange, onSubmit, proposalId, initialData, mode }: DocumentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || 'Plano' as const,
    status: initialData?.status || 'draft' as const,
    value: initialData?.value || '',
    document_number: initialData?.document_number || '',
    signed_date: initialData?.signed_date || '',
    expiry_date: initialData?.expiry_date || '',
    file_url: initialData?.file_url || '',
    version: initialData?.version || 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        proposal_id: proposalId,
        title: formData.title,
        type: formData.type,
        status: formData.status,
        value: formData.value ? Number(formData.value) : undefined,
        document_number: formData.document_number || undefined,
        signed_date: formData.signed_date || undefined,
        expiry_date: formData.expiry_date || undefined,
        file_url: formData.file_url || undefined,
        version: formData.version
      } as Omit<ProposalDocument, 'id' | 'created_at' | 'updated_at'>);

      toast({
        title: "Sucesso",
        description: `Documento ${mode === 'create' ? 'criado' : 'atualizado'} com sucesso`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} documento`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo Documento' : 'Editar Documento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título do documento"
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TED">TED</SelectItem>
                  <SelectItem value="Convenio">Convênio</SelectItem>
                  <SelectItem value="Contrato">Contrato</SelectItem>
                  <SelectItem value="Plano">Plano de Trabalho</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="review">Em Análise</SelectItem>
                  <SelectItem value="signed">Assinado</SelectItem>
                  <SelectItem value="executed">Executado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="document_number">Número do Documento</Label>
              <Input
                id="document_number"
                value={formData.document_number}
                onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                placeholder="Ex: TED 001/2024"
              />
            </div>

            <div>
              <Label htmlFor="signed_date">Data de Assinatura</Label>
              <Input
                id="signed_date"
                type="date"
                value={formData.signed_date}
                onChange={(e) => setFormData({ ...formData, signed_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="expiry_date">Data de Vencimento</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="version">Versão</Label>
              <Input
                id="version"
                type="number"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="file_url">URL do Arquivo</Label>
              <Input
                id="file_url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="/documents/arquivo.pdf"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#15AB92] hover:bg-[#0d8f7a]">
              {loading ? 'Salvando...' : mode === 'create' ? 'Criar Documento' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
