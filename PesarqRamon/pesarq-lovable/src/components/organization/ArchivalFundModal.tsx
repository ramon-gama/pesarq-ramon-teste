
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { ArchivalFund } from "@/hooks/useArchivalFunds";

interface Extension {
  quantity: string;
  unit: string;
  support_type: string;
}

interface ArchivalFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingFund?: ArchivalFund | null;
  organizationId: string;
}

export function ArchivalFundModal({ isOpen, onClose, onSave, editingFund, organizationId }: ArchivalFundModalProps) {
  const [formData, setFormData] = useState({
    // Área 1 - Identificação
    code: "",
    name: "",
    start_date: "",
    end_date: "",
    description_level: "fundo",
    
    // Área 2 - Origem e Contexto
    producer_name: "",
    origin_trajectory: "",
    constitution_nature: [] as string[],
    constitution_other: "",
    
    // Área 3 - Conteúdo e Organização
    scope_content: "",
    organization: "",
    evaluation_temporality: "",
    
    // Área 4 - Condições de Acesso e Uso
    access_restrictions: "",
    predominant_languages: "",
    
    // Área 5 - Informações Relacionadas
    research_instruments: {
      inventory: false,
      guide: false,
      catalog: false,
      other: false
    },
    research_instruments_description: "",
    related_funds: "",
    complementary_notes: "",
    
    // Área 6 - Controle da Descrição
    description_responsible: "",
    description_date: "",
    used_standards: [] as string[],
    last_update_date: "",
    
    // Campos existentes mantidos para compatibilidade
    description: "",
    location: "",
    status: "ativo",
    observations: ""
  });

  const [extensions, setExtensions] = useState<Extension[]>([
    { quantity: "", unit: "", support_type: "" }
  ]);

  const [openSections, setOpenSections] = useState({
    identification: true,
    origin: false,
    content: false,
    access: false,
    related: false,
    control: false
  });

  // Opções para natureza da constituição
  const constitutionNatureOptions = [
    { value: "constituicao_original", label: "Constituição original do órgão" },
    { value: "mudanca_nome", label: "Mudança de nome da entidade" },
    { value: "fusao_institucional", label: "Fusão institucional" },
    { value: "orgao_extinto", label: "Órgão extinto/incorporado" },
    { value: "outro", label: "Outro" }
  ];

  // Opções para normas utilizadas
  const standardsOptions = [
    { value: "isad_g", label: "ISAD(G)" },
    { value: "nobrade", label: "NOBRADE" },
    { value: "isaar_cpf", label: "ISAAR(CPF)" },
    { value: "ead", label: "EAD" }
  ];

  useEffect(() => {
    console.log('Modal opened, editingFund:', editingFund);
    
    if (editingFund) {
      // Converter constitution_nature de string para array se necessário
      let constitutionNature = [];
      if (editingFund.constitution_nature) {
        constitutionNature = typeof editingFund.constitution_nature === 'string' 
          ? editingFund.constitution_nature.split(',').filter(n => n.trim())
          : Array.isArray(editingFund.constitution_nature) 
            ? editingFund.constitution_nature 
            : [];
      }

      // Converter used_standards de string para array se necessário
      let usedStandards = [];
      if (editingFund.used_standards) {
        usedStandards = typeof editingFund.used_standards === 'string' 
          ? editingFund.used_standards.split(',').filter(s => s.trim())
          : Array.isArray(editingFund.used_standards) 
            ? editingFund.used_standards 
            : [];
      }

      console.log('Setting constitution_nature:', constitutionNature);
      console.log('Setting used_standards:', usedStandards);

      setFormData({
        code: editingFund.code || "",
        name: editingFund.name || "",
        start_date: editingFund.start_date || "",
        end_date: editingFund.end_date || "",
        description_level: "fundo",
        producer_name: editingFund.producer_name || "",
        origin_trajectory: editingFund.origin_trajectory || "",
        constitution_nature: constitutionNature,
        constitution_other: editingFund.constitution_other || "",
        scope_content: editingFund.scope_content || "",
        organization: editingFund.organization || "",
        evaluation_temporality: editingFund.evaluation_temporality || "",
        access_restrictions: editingFund.access_restrictions || "",
        predominant_languages: editingFund.predominant_languages || "",
        research_instruments: editingFund.research_instruments || {
          inventory: false,
          guide: false,
          catalog: false,
          other: false
        },
        research_instruments_description: editingFund.research_instruments_description || "",
        related_funds: editingFund.related_funds || "",
        complementary_notes: editingFund.complementary_notes || "",
        description_responsible: editingFund.description_responsible || "",
        description_date: editingFund.description_date || "",
        used_standards: usedStandards,
        last_update_date: editingFund.last_update_date || "",
        description: editingFund.description || "",
        location: editingFund.location || "",
        status: editingFund.status || "ativo",
        observations: editingFund.observations || ""
      });

      // Carregar extensões existentes ou criar uma linha padrão
      const existingExtensions = editingFund.extensions || [];
      console.log('Loading existing extensions:', existingExtensions);
      
      if (existingExtensions.length > 0) {
        setExtensions(existingExtensions.map(ext => ({
          quantity: ext.quantity || "",
          unit: ext.unit || "",
          support_type: ext.support_type || ""
        })));
      } else {
        setExtensions([{ quantity: "", unit: "", support_type: "" }]);
      }
    } else {
      // Reset form for new fund
      setFormData({
        code: "",
        name: "",
        start_date: "",
        end_date: "",
        description_level: "fundo",
        producer_name: "",
        origin_trajectory: "",
        constitution_nature: [],
        constitution_other: "",
        scope_content: "",
        organization: "",
        evaluation_temporality: "",
        access_restrictions: "",
        predominant_languages: "",
        research_instruments: {
          inventory: false,
          guide: false,
          catalog: false,
          other: false
        },
        research_instruments_description: "",
        related_funds: "",
        complementary_notes: "",
        description_responsible: "",
        description_date: "",
        used_standards: [],
        last_update_date: "",
        description: "",
        location: "",
        status: "ativo",
        observations: ""
      });
      setExtensions([{ quantity: "", unit: "", support_type: "" }]);
    }
  }, [editingFund, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    // Garantir que as extensões sejam incluídas corretamente
    const validExtensions = extensions.filter(ext => {
      const hasQuantity = ext.quantity && ext.quantity.trim() !== '';
      const hasUnit = ext.unit && ext.unit.trim() !== '';
      const hasSupportType = ext.support_type && ext.support_type.trim() !== '';
      return hasQuantity || hasUnit || hasSupportType;
    });

    const dataToSave = {
      ...formData,
      organization_id: organizationId,
      constitution_nature: Array.isArray(formData.constitution_nature) 
        ? formData.constitution_nature 
        : [],
      used_standards: Array.isArray(formData.used_standards)
        ? formData.used_standards
        : [],
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      description_date: formData.description_date || null,
      last_update_date: formData.last_update_date || null,
      extensions: validExtensions
    };

    console.log('Submitting fund data:', dataToSave);
    console.log('Constitution nature being saved:', dataToSave.constitution_nature);
    console.log('Used standards being saved:', dataToSave.used_standards);
    console.log('Extensions being saved:', dataToSave.extensions);
    
    onSave(dataToSave);
    onClose();
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addExtension = () => {
    setExtensions(prev => [...prev, { quantity: "", unit: "", support_type: "" }]);
  };

  const removeExtension = (index: number) => {
    if (extensions.length > 1) {
      setExtensions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateExtension = (index: number, field: keyof Extension, value: string) => {
    setExtensions(prev => prev.map((ext, i) => 
      i === index ? { ...ext, [field]: value } : ext
    ));
    console.log('Updated extension:', index, field, value);
    console.log('Current extensions state:', extensions);
  };

  const handleConstitutionNatureChange = (value: string, checked: boolean) => {
    setFormData(prev => {
      const newConstitutionNature = checked
        ? [...prev.constitution_nature, value]
        : prev.constitution_nature.filter(item => item !== value);
      
      console.log('Constitution nature updated:', checked ? 'added' : 'removed', value);
      console.log('New constitution nature array:', newConstitutionNature);
      
      return {
        ...prev,
        constitution_nature: newConstitutionNature
      };
    });
  };

  const handleStandardsChange = (value: string, checked: boolean) => {
    setFormData(prev => {
      const newStandards = checked
        ? [...prev.used_standards, value]
        : prev.used_standards.filter(item => item !== value);
      
      console.log('Standards updated:', checked ? 'added' : 'removed', value);
      console.log('New standards array:', newStandards);
      
      return {
        ...prev,
        used_standards: newStandards
      };
    });
  };

  const SectionHeader = ({ title, isOpen, onClick }: { title: string; isOpen: boolean; onClick: () => void }) => (
    <div 
      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
      onClick={onClick}
    >
      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      <h3 className="font-semibold text-lg text-blue-700">{title}</h3>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>
                {editingFund ? 'Editar Fundo Arquivístico' : 'Novo Fundo Arquivístico'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do fundo arquivístico organizadas por áreas
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full p-1"
              title="Fechar formulário"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Área 1 - Identificação */}
          <Collapsible open={openSections.identification}>
            <CollapsibleTrigger asChild>
              <SectionHeader 
                title="🟦 Área 1 – Identificação" 
                isOpen={openSections.identification}
                onClick={() => toggleSection('identification')}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pl-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código de referência</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Código de identificação"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Título do fundo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do fundo arquivístico"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Data inicial</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Data final</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_level">Nível de descrição</Label>
                <Input
                  id="description_level"
                  value="Fundo"
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Local onde está armazenado o fundo"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Extensão e suporte</Label>
                  <Button type="button" onClick={addExtension} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                
                {extensions.map((extension, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 border rounded">
                    <div className="space-y-2">
                      <Label>Quantidade</Label>
                      <Input
                        value={extension.quantity}
                        onChange={(e) => updateExtension(index, 'quantity', e.target.value)}
                        placeholder="Ex: 50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Unidade</Label>
                      <Select 
                        value={extension.unit} 
                        onValueChange={(value) => updateExtension(index, 'unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ml">ml (metros lineares)</SelectItem>
                          <SelectItem value="caixas">caixas</SelectItem>
                          <SelectItem value="itens">itens</SelectItem>
                          <SelectItem value="volumes">volumes</SelectItem>
                          <SelectItem value="gb">GB (documentos digitais)</SelectItem>
                          <SelectItem value="mb">MB (documentos digitais)</SelectItem>
                          <SelectItem value="arquivos_digitais">arquivos digitais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Suporte</Label>
                      <Select 
                        value={extension.support_type} 
                        onValueChange={(value) => updateExtension(index, 'support_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="papel">Papel</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="microfilme">Microfilme</SelectItem>
                          <SelectItem value="fotografico">Fotográfico</SelectItem>
                          <SelectItem value="audiovisual">Audiovisual</SelectItem>
                          <SelectItem value="misto">Misto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        type="button" 
                        onClick={() => removeExtension(index)}
                        variant="outline"
                        size="sm"
                        disabled={extensions.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Área 2 - Origem e Contexto */}
          <Collapsible open={openSections.origin}>
            <CollapsibleTrigger asChild>
              <SectionHeader 
                title="🟦 Área 2 – Origem e Contexto" 
                isOpen={openSections.origin}
                onClick={() => toggleSection('origin')}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="producer_name">Nome do produtor</Label>
                <Input
                  id="producer_name"
                  value={formData.producer_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, producer_name: e.target.value }))}
                  placeholder="Nome do órgão/entidade produtora"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin_trajectory">Origem e trajetória do acervo</Label>
                <Textarea
                  id="origin_trajectory"
                  value={formData.origin_trajectory}
                  onChange={(e) => setFormData(prev => ({ ...prev, origin_trajectory: e.target.value }))}
                  placeholder="Narrativa de como o acervo foi acumulado e transferido"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Natureza da constituição do fundo (múltipla escolha)</Label>
                <div className="grid grid-cols-1 gap-3 border rounded p-3">
                  {constitutionNatureOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={formData.constitution_nature.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleConstitutionNatureChange(option.value, checked as boolean)
                        }
                      />
                      <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.constitution_nature.includes('outro') && (
                <div className="space-y-2">
                  <Label htmlFor="constitution_other">Explicar outro tipo</Label>
                  <Input
                    id="constitution_other"
                    value={formData.constitution_other}
                    onChange={(e) => setFormData(prev => ({ ...prev, constitution_other: e.target.value }))}
                    placeholder="Descreva o tipo de constituição"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Área 3 - Conteúdo e Organização */}
          <Collapsible open={openSections.content}>
            <CollapsibleTrigger asChild>
              <SectionHeader 
                title="🟦 Área 3 – Conteúdo e Organização" 
                isOpen={openSections.content}
                onClick={() => toggleSection('content')}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="scope_content">Âmbito e conteúdo</Label>
                <Textarea
                  id="scope_content"
                  value={formData.scope_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, scope_content: e.target.value }))}
                  placeholder="Resumo do conteúdo temático e funcional do fundo"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organização do fundo</Label>
                <Textarea
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="Arranjo interno: por funções, por séries, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evaluation_temporality">Avaliação e temporalidade</Label>
                <Textarea
                  id="evaluation_temporality"
                  value={formData.evaluation_temporality}
                  onChange={(e) => setFormData(prev => ({ ...prev, evaluation_temporality: e.target.value }))}
                  placeholder="Indicação se possui TTD associada, ações de eliminação já realizadas"
                  rows={3}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Área 4 - Condições de Acesso e Uso */}
          <Collapsible open={openSections.access}>
            <CollapsibleTrigger asChild>
              <SectionHeader 
                title="🟦 Área 4 – Condições de Acesso e Uso" 
                isOpen={openSections.access}
                onClick={() => toggleSection('access')}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="access_restrictions">Restrições e condições de uso</Label>
                <Textarea
                  id="access_restrictions"
                  value={formData.access_restrictions}
                  onChange={(e) => setFormData(prev => ({ ...prev, access_restrictions: e.target.value }))}
                  placeholder="Condições de acesso, reprodução e conservação"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="predominant_languages">Língua(s) predominante(s)</Label>
                <Input
                  id="predominant_languages"
                  value={formData.predominant_languages}
                  onChange={(e) => setFormData(prev => ({ ...prev, predominant_languages: e.target.value }))}
                  placeholder="Ex: Português, Espanhol"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Área 5 - Informações Relacionadas */}
          <Collapsible open={openSections.related}>
            <CollapsibleTrigger asChild>
              <SectionHeader 
                title="🟦 Área 5 – Informações Relacionadas" 
                isOpen={openSections.related}
                onClick={() => toggleSection('related')}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pl-6">
              <div className="space-y-3">
                <Label>Instrumentos de pesquisa existentes</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inventory"
                      checked={formData.research_instruments.inventory}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          research_instruments: {
                            ...prev.research_instruments,
                            inventory: checked as boolean
                          }
                        }))
                      }
                    />
                    <Label htmlFor="inventory">Inventário</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="guide"
                      checked={formData.research_instruments.guide}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          research_instruments: {
                            ...prev.research_instruments,
                            guide: checked as boolean
                          }
                        }))
                      }
                    />
                    <Label htmlFor="guide">Guia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="catalog"
                      checked={formData.research_instruments.catalog}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          research_instruments: {
                            ...prev.research_instruments,
                            catalog: checked as boolean
                          }
                        }))
                      }
                    />
                    <Label htmlFor="catalog">Catálogo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="other_instrument"
                      checked={formData.research_instruments.other}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          research_instruments: {
                            ...prev.research_instruments,
                            other: checked as boolean
                          }
                        }))
                      }
                    />
                    <Label htmlFor="other_instrument">Outro</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="research_instruments_description">Descrição/Link dos instrumentos</Label>
                  <Textarea
                    id="research_instruments_description"
                    value={formData.research_instruments_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, research_instruments_description: e.target.value }))}
                    placeholder="Links ou descrições dos instrumentos de pesquisa"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="related_funds">Relação com outros fundos</Label>
                <Textarea
                  id="related_funds"
                  value={formData.related_funds}
                  onChange={(e) => setFormData(prev => ({ ...prev, related_funds: e.target.value }))}
                  placeholder="Descrição da relação com outros fundos"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complementary_notes">Notas complementares</Label>
                <Textarea
                  id="complementary_notes"
                  value={formData.complementary_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, complementary_notes: e.target.value }))}
                  placeholder="Informações adicionais relevantes"
                  rows={3}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Área 6 - Controle da Descrição */}
          <Collapsible open={openSections.control}>
            <CollapsibleTrigger asChild>
              <SectionHeader 
                title="🟦 Área 6 – Controle da Descrição" 
                isOpen={openSections.control}
                onClick={() => toggleSection('control')}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pl-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description_responsible">Responsável pela descrição</Label>
                  <Input
                    id="description_responsible"
                    value={formData.description_responsible}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_responsible: e.target.value }))}
                    placeholder="Nome do arquivista ou equipe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_date">Data da descrição</Label>
                  <Input
                    id="description_date"
                    type="date"
                    value={formData.description_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Normas utilizadas (múltipla escolha)</Label>
                  <div className="grid grid-cols-1 gap-3 border rounded p-3">
                    {standardsOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={formData.used_standards.includes(option.value)}
                          onCheckedChange={(checked) => 
                            handleStandardsChange(option.value, checked as boolean)
                          }
                        />
                        <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_update_date">Data da última atualização</Label>
                  <Input
                    id="last_update_date"
                    type="date"
                    value={formData.last_update_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_update_date: e.target.value }))}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingFund ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
