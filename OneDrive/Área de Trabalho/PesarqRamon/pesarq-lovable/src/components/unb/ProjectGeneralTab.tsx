
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import { ProjectFormData } from "@/types/projectForm";
import { Proposal } from "@/hooks/useProposals";

interface ProjectGeneralTabProps {
  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  organizations: Array<{ id: string; name: string }>;
  proposals: Proposal[];
  selectedProposalData?: Proposal | null;
  onOrganizationChange: (organizationId: string) => void;
  onProposalSelect: (proposalId: string) => void;
  isViewMode?: boolean;
}

export function ProjectGeneralTab({ 
  formData, 
  setFormData, 
  organizations, 
  proposals,
  selectedProposalData,
  onOrganizationChange,
  onProposalSelect,
  isViewMode = false
}: ProjectGeneralTabProps) {
  // Filter proposals by selected organization
  const filteredProposals = formData.organization_id 
    ? proposals.filter(proposal => proposal.organization_id === formData.organization_id)
    : [];

  const isValidUrl = (url: string) => {
    if (!url.trim()) return true;
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      return true;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }
    if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/.test(url)) {
      return true;
    }
    return false;
  };

  const normalizeUrl = (url: string) => {
    if (!url) return '';
    if ((url.includes('drive.google.com') || url.includes('docs.google.com')) && !url.startsWith('http')) {
      return 'https://' + url;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://') && url.includes('.')) {
      return 'https://' + url;
    }
    return url;
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value ? new Date(value) : null
    }));
  };

  const handleProposalSelectWithData = (proposalId: string) => {
    console.log('ProjectGeneralTab: Proposal selected', proposalId);
    
    if (proposalId === "no-proposal") {
      onProposalSelect("no-proposal");
      return;
    }

    // Find the selected proposal data
    const selectedProposal = filteredProposals.find(p => p.id === proposalId);
    console.log('ProjectGeneralTab: Selected proposal data', selectedProposal);
    
    if (selectedProposal) {
      // Auto-fill form with proposal data
      setFormData(prev => ({
        ...prev,
        selected_proposal_id: proposalId,
        title: selectedProposal.title || prev.title,
        total_value: selectedProposal.estimated_value?.toString() || prev.total_value,
        project_type: selectedProposal.tipo_projeto || prev.project_type,
        legal_instrument: selectedProposal.tipo_instrumento || prev.legal_instrument,
        external_link: selectedProposal.external_link || prev.external_link,
        object: selectedProposal.description || prev.object
      }));
    }
    
    onProposalSelect(proposalId);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="organization">Organização *</Label>
          <Select 
            value={formData.organization_id} 
            onValueChange={onOrganizationChange}
            disabled={isViewMode}
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
          <Label htmlFor="proposal">Proposta de Origem</Label>
          <Select 
            value={formData.selected_proposal_id || "no-proposal"} 
            onValueChange={handleProposalSelectWithData}
            disabled={!formData.organization_id || isViewMode}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !formData.organization_id 
                  ? "Selecione uma organização primeiro" 
                  : "Selecione uma proposta (opcional)"
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-proposal">Nenhuma proposta selecionada</SelectItem>
              {filteredProposals.map((proposal) => (
                <SelectItem key={proposal.id} value={proposal.id}>
                  {proposal.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.organization_id && filteredProposals.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Nenhuma proposta encontrada para esta organização
            </p>
          )}
        </div>
      </div>

      {/* Dados da proposta - somente leitura */}
      {selectedProposalData && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold mb-3 text-gray-700">Dados da Proposta (Referência)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Tipo de Projeto:</span>
              <p className="text-gray-800">{selectedProposalData.tipo_projeto || 'Não informado'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Tipo de Instrumento:</span>
              <p className="text-gray-800">{selectedProposalData.tipo_instrumento || 'Não informado'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Valor Estimado:</span>
              <p className="text-gray-800">
                {selectedProposalData.estimated_value ? `R$ ${selectedProposalData.estimated_value.toLocaleString('pt-BR')}` : 'Não informado'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Duração Estimada:</span>
              <p className="text-gray-800">
                {selectedProposalData.estimated_duration_months ? `${selectedProposalData.estimated_duration_months} meses` : 'Não informado'}
              </p>
            </div>
            {selectedProposalData.external_link && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-600">Documento da Proposta:</span>
                <div className="mt-1">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(normalizeUrl(selectedProposalData.external_link!), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visualizar documento da proposta
                  </Button>
                </div>
              </div>
            )}
            {selectedProposalData.description && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-600">Descrição da Proposta:</span>
                <p className="text-gray-800 mt-1">{selectedProposalData.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Separator />

      <div>
        <Label htmlFor="title">Título do Projeto *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Digite o título do projeto"
          disabled={isViewMode}
        />
      </div>

      <div>
        <Label htmlFor="object">Objeto</Label>
        <Textarea
          id="object"
          value={formData.object}
          onChange={(e) => setFormData({ ...formData, object: e.target.value })}
          placeholder="Descreva o objeto do projeto..."
          rows={3}
          disabled={isViewMode}
        />
      </div>

      {/* Campos de Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Data de Início *</Label>
          <Input
            id="start_date"
            type="date"
            value={formatDateForInput(formData.start_date)}
            onChange={(e) => handleDateChange('start_date', e.target.value)}
            disabled={isViewMode}
          />
        </div>

        <div>
          <Label htmlFor="end_date">Data de Fim</Label>
          <Input
            id="end_date"
            type="date"
            value={formatDateForInput(formData.end_date)}
            onChange={(e) => handleDateChange('end_date', e.target.value)}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="legal_instrument">Instrumento Jurídico</Label>
          <Select 
            value={formData.legal_instrument} 
            onValueChange={(value) => setFormData({ ...formData, legal_instrument: value })}
            disabled={isViewMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o instrumento" />
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

        <div>
          <Label htmlFor="instrument_number">Número do Instrumento</Label>
          <Input
            id="instrument_number"
            value={formData.instrument_number}
            onChange={(e) => setFormData({ ...formData, instrument_number: e.target.value })}
            placeholder="Ex: 001/2024"
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="project_type">Tipo de Projeto</Label>
          <Select 
            value={formData.project_type} 
            onValueChange={(value) => setFormData({ ...formData, project_type: value })}
            disabled={isViewMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
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
          <Label htmlFor="total_value">Valor Total (R$)</Label>
          <Input
            id="total_value"
            type="number"
            value={formData.total_value}
            onChange={(e) => setFormData({ ...formData, total_value: e.target.value })}
            placeholder="0,00"
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Link do documento externo */}
      <div>
        <Label htmlFor="external_link">Link do Documento do Projeto</Label>
        <Input
          id="external_link"
          value={formData.external_link}
          onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
          placeholder="Ex: https://docs.google.com/document/d/... ou drive.google.com/file/d/..."
          disabled={isViewMode}
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
                  Abrir documento
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
    </div>
  );
}
