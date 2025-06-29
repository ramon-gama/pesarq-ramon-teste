import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Save, Clock, Archive, FileText, HelpCircle, Zap, Search } from "lucide-react";

interface TemporalityItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingItem?: any;
}

// Dados simulados do Código de Classificação
const CLASSIFICATION_CODES = [
  { codigo: "000", assunto: "Administração Geral" },
  { codigo: "000.01", assunto: "Modernização e Reforma Administrativa" },
  { codigo: "000.02", assunto: "Cooperação Técnica" },
  { codigo: "010", assunto: "Organização e Funcionamento" },
  { codigo: "010.01", assunto: "Normatização. Regulamentação" },
  { codigo: "010.02", assunto: "Ritos, Cerimônias e Solenidades" },
  { codigo: "020", assunto: "Pessoal" },
  { codigo: "020.01", assunto: "Normatização. Regulamentação" },
  { codigo: "020.02", assunto: "Identificação Funcional" },
  { codigo: "030", assunto: "Material" },
  { codigo: "030.01", assunto: "Normatização. Regulamentação" },
  { codigo: "030.02", assunto: "Classificação, Codificação e Catalogação" },
  { codigo: "040", assunto: "Patrimônio" },
  { codigo: "040.01", assunto: "Normatização. Regulamentação" },
  { codigo: "040.02", assunto: "Inventário de Bens Patrimoniais" },
  { codigo: "050", assunto: "Orçamento e Finanças" },
  { codigo: "050.01", assunto: "Normatização. Regulamentação" },
  { codigo: "050.02", assunto: "Proposta Orçamentária" }
];

// Dados simulados de Tipos Documentais
const DOCUMENT_TYPES = [
  { id: "ata_reuniao", nome: "Ata de Reunião", categoria: "documento" },
  { id: "contrato_administrativo", nome: "Contrato Administrativo", categoria: "documento" },
  { id: "relatorio_gestao", nome: "Relatório de Gestão Anual", categoria: "documento" },
  { id: "processo_licitacao", nome: "Processo de Licitação", categoria: "processo" },
  { id: "processo_contratacao", nome: "Processo de Contratação", categoria: "processo" },
  { id: "certidao_tempo_servico", nome: "Certidão de Tempo de Serviço", categoria: "documento" },
  { id: "portaria_nomeacao", nome: "Portaria de Nomeação", categoria: "documento" },
  { id: "processo_aposentadoria", nome: "Processo de Aposentadoria", categoria: "processo" },
  { id: "nota_fiscal", nome: "Nota Fiscal", categoria: "documento" },
  { id: "recibo_pagamento", nome: "Recibo de Pagamento", categoria: "documento" },
  { id: "oficio", nome: "Ofício", categoria: "documento" },
  { id: "memorando", nome: "Memorando", categoria: "documento" },
  { id: "processo_disciplinar", nome: "Processo Disciplinar", categoria: "processo" },
  { id: "inventario_bens", nome: "Inventário de Bens", categoria: "documento" }
];

const JUSTIFICATIVAS_GUARDA_PERMANENTE = [
  {
    id: "valor_historico",
    titulo: "Valor Histórico",
    descricao: "O documento registra eventos ou decisões significativas que contribuíram para a formação e evolução da instituição, sendo essencial para a memória organizacional e pesquisas futuras."
  },
  {
    id: "valor_probatorio",
    titulo: "Valor Probatório",
    descricao: "O documento comprova a organização, estrutura e funcionamento da instituição ao longo do tempo, registrando normas, diretrizes e decisões institucionais que refletem sua evolução."
  },
  {
    id: "valor_informativo",
    titulo: "Valor Informativo",
    descricao: "O documento contém informações únicas ou insubstituíveis que podem ser utilizadas para estudos, análises ou referência em atividades futuras da instituição."
  },
  {
    id: "valor_cientifico",
    titulo: "Valor Científico ou Técnico",
    descricao: "O documento apresenta dados, pesquisas ou descobertas que possuem relevância para o avanço científico ou técnico na área de atuação da instituição."
  },
  {
    id: "valor_cultural",
    titulo: "Valor Cultural",
    descricao: "O documento reflete aspectos culturais, sociais ou artísticos significativos, contribuindo para a compreensão e preservação da identidade e patrimônio cultural."
  },
  {
    id: "valor_social",
    titulo: "Valor Social",
    descricao: "O documento contém informações relevantes para a coletividade, contribuindo para a preservação da memória de grupos sociais, a defesa de direitos coletivos ou a promoção da cidadania e transparência pública."
  }
];

const JUSTIFICATIVAS_ELIMINACAO = [
  {
    id: "cumprimento_prazos",
    titulo: "Cumprimento de Prazos Legais e Administrativos",
    descricao: "O documento atingiu o prazo de retenção estabelecido em conformidade com as normativas legais e regulamentares aplicáveis."
  },
  {
    id: "recapitulacao",
    titulo: "Recapitulação",
    descricao: "O documento está recapitulado em outro mais completo, que consolida as informações anteriormente registradas."
  },
  {
    id: "obsolescencia",
    titulo: "Obsolescência Informacional",
    descricao: "O conteúdo do documento tornou-se desatualizado ou irrelevante para as atividades e processos atuais da instituição."
  },
  {
    id: "ausencia_valor",
    titulo: "Ausência de Valor Secundário",
    descricao: "O documento não possui valor histórico, informativo ou probatório que justifique sua preservação a longo prazo."
  }
];

const EVENTOS_ARQUIVO_CORRENTE = [
  {
    id: "conclusao_atividade",
    titulo: "Conclusão de Atividade ou Processo",
    descricao: "Após a finalização de uma atividade ou processo específico"
  },
  {
    id: "termino_vigencia",
    titulo: "Término da Vigência",
    descricao: "Para documentos com período de validade definido"
  },
  {
    id: "fim_vinculo",
    titulo: "Fim do Vínculo",
    descricao: "Após a conclusão do vínculo com a instituição pública"
  },
  {
    id: "homologacao_fato",
    titulo: "Homologação do Fato",
    descricao: "Após a homologação oficial do fato por autoridade competente"
  },
  {
    id: "aprovacao_contas",
    titulo: "Aprovação das Contas/Relatório de Gestão",
    descricao: "Aprovação das contas ou apresentação do Relatório de Gestão ao TCU"
  },
  {
    id: "conclusao_caso",
    titulo: "Conclusão do Caso",
    descricao: "Finalização do caso administrativo, jurídico ou técnico"
  },
  {
    id: "decisao_recursos",
    titulo: "Decisão Final sobre Recursos",
    descricao: "Após decisão final sobre recursos sem possibilidade de impugnações"
  }
];

const EVENTOS_ARQUIVO_INTERMEDIARIO = [
  {
    id: "aprovacao_contas_tcu",
    titulo: "Aprovação das Contas pelo TCU",
    descricao: "Após aprovação das contas do exercício pelo Tribunal de Contas da União"
  },
  {
    id: "apresentacao_relatorio",
    titulo: "Apresentação do Relatório de Gestão",
    descricao: "Data de apresentação do relatório de gestão quando não há processo de contas"
  },
  {
    id: "homologacao_decisoes",
    titulo: "Homologação de Decisões",
    descricao: "Após homologação de decisões administrativas ou judiciais"
  },
  {
    id: "transferencias",
    titulo: "Transferências",
    descricao: "Momento em que a transferência é finalizada e confirmada"
  }
];

export function TemporalityItemForm({ isOpen, onClose, onSave, editingItem }: TemporalityItemFormProps) {
  const [formData, setFormData] = useState({
    codigo: "",
    tipoDocumental: "",
    prazoGuardaArquivoCorrente: "",
    prazoGuardaArquivoIntermediario: "",
    eventoDisparoCorrente: "",
    eventoDisparoIntermediario: "",
    destinacaoFinal: "eliminacao",
    justificativasDestinacao: [] as string[],
    observacoes: "",
    fundamentacaoLegal: [] as string[],
    responsavelElaboracao: "",
    unidadeProducao: [] as string[]
  });

  const [newLegislacao, setNewLegislacao] = useState("");
  const [newUnidade, setNewUnidade] = useState("");
  const [showJustificativaHelp, setShowJustificativaHelp] = useState(false);
  const [classificationSearch, setClassificationSearch] = useState("");
  const [documentTypeSearch, setDocumentTypeSearch] = useState("");

  useEffect(() => {
    if (editingItem) {
      setFormData({
        codigo: editingItem.codigo || "",
        tipoDocumental: editingItem.tipoDocumental || "",
        prazoGuardaArquivoCorrente: editingItem.prazoGuardaArquivoCorrente || "",
        prazoGuardaArquivoIntermediario: editingItem.prazoGuardaArquivoIntermediario || "",
        eventoDisparoCorrente: editingItem.eventoDisparoCorrente || "",
        eventoDisparoIntermediario: editingItem.eventoDisparoIntermediario || "",
        destinacaoFinal: editingItem.destinacaoFinal || "eliminacao",
        justificativasDestinacao: Array.isArray(editingItem.justificativasDestinacao) 
          ? editingItem.justificativasDestinacao 
          : editingItem.justificativaDestinacao 
            ? [editingItem.justificativaDestinacao]
            : [],
        observacoes: editingItem.observacoes || "",
        fundamentacaoLegal: editingItem.fundamentacaoLegal || [],
        responsavelElaboracao: editingItem.responsavelElaboracao || "",
        unidadeProducao: editingItem.unidadeProducao || []
      });
    } else {
      setFormData({
        codigo: "",
        tipoDocumental: "",
        prazoGuardaArquivoCorrente: "",
        prazoGuardaArquivoIntermediario: "",
        eventoDisparoCorrente: "",
        eventoDisparoIntermediario: "",
        destinacaoFinal: "eliminacao",
        justificativasDestinacao: [],
        observacoes: "",
        fundamentacaoLegal: [],
        responsavelElaboracao: "",
        unidadeProducao: []
      });
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addLegislacao = () => {
    if (newLegislacao.trim() && !formData.fundamentacaoLegal.includes(newLegislacao.trim())) {
      setFormData(prev => ({
        ...prev,
        fundamentacaoLegal: [...prev.fundamentacaoLegal, newLegislacao.trim()]
      }));
      setNewLegislacao("");
    }
  };

  const removeLegislacao = (legislacao: string) => {
    setFormData(prev => ({
      ...prev,
      fundamentacaoLegal: prev.fundamentacaoLegal.filter(l => l !== legislacao)
    }));
  };

  const addUnidade = () => {
    if (newUnidade.trim() && !formData.unidadeProducao.includes(newUnidade.trim())) {
      setFormData(prev => ({
        ...prev,
        unidadeProducao: [...prev.unidadeProducao, newUnidade.trim()]
      }));
      setNewUnidade("");
    }
  };

  const removeUnidade = (unidade: string) => {
    setFormData(prev => ({
      ...prev,
      unidadeProducao: prev.unidadeProducao.filter(u => u !== unidade)
    }));
  };

  const getJustificativasDisponiveis = () => {
    return formData.destinacaoFinal === "guarda_permanente" 
      ? JUSTIFICATIVAS_GUARDA_PERMANENTE 
      : JUSTIFICATIVAS_ELIMINACAO;
  };

  const toggleJustificativa = (justificativaId: string) => {
    setFormData(prev => ({
      ...prev,
      justificativasDestinacao: prev.justificativasDestinacao.includes(justificativaId)
        ? prev.justificativasDestinacao.filter(j => j !== justificativaId)
        : [...prev.justificativasDestinacao, justificativaId]
    }));
  };

  // Filtros para busca
  const filteredClassificationCodes = CLASSIFICATION_CODES.filter(item =>
    item.codigo.toLowerCase().includes(classificationSearch.toLowerCase()) ||
    item.assunto.toLowerCase().includes(classificationSearch.toLowerCase())
  );

  const filteredDocumentTypes = DOCUMENT_TYPES.filter(item =>
    item.nome.toLowerCase().includes(documentTypeSearch.toLowerCase())
  );

  const prazosSugeridos = [
    { label: "1 ano", value: "1 ano" },
    { label: "2 anos", value: "2 anos" },
    { label: "3 anos", value: "3 anos" },
    { label: "5 anos", value: "5 anos" },
    { label: "10 anos", value: "10 anos" },
    { label: "Permanente", value: "permanente" },
    { label: "Até resolução", value: "até resolução" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {editingItem ? "Editar Item da Tabela" : "Novo Item da Tabela"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seleção de Código de Classificação */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="codigo">Código de Classificação</Label>
                <Select
                  value={formData.codigo}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, codigo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o código de classificação" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar código ou assunto..."
                          value={classificationSearch}
                          onChange={(e) => setClassificationSearch(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    {filteredClassificationCodes.map((item) => (
                      <SelectItem key={item.codigo} value={item.codigo}>
                        <div className="flex flex-col">
                          <span className="font-mono font-semibold">{item.codigo}</span>
                          <span className="text-sm text-gray-600">{item.assunto}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seleção de Tipo Documental */}
              <div>
                <Label htmlFor="tipoDocumental">Tipo Documental</Label>
                <Select
                  value={formData.tipoDocumental}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tipoDocumental: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo documental" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar tipo documental..."
                          value={documentTypeSearch}
                          onChange={(e) => setDocumentTypeSearch(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    {filteredDocumentTypes.map((item) => (
                      <SelectItem key={item.id} value={item.nome}>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.categoria === 'processo' ? 'default' : 'secondary'} className="text-xs">
                            {item.categoria === 'processo' ? 'Processo' : 'Documento'}
                          </Badge>
                          <span>{item.nome}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="responsavel">Responsável pela Elaboração</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavelElaboracao}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsavelElaboracao: e.target.value }))}
                  placeholder="Nome do responsável"
                />
              </div>
            </div>

            {/* Prazos de Guarda */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="prazoCorrente">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Prazo - Arquivo Corrente
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="prazoCorrente"
                    value={formData.prazoGuardaArquivoCorrente}
                    onChange={(e) => setFormData(prev => ({ ...prev, prazoGuardaArquivoCorrente: e.target.value }))}
                    placeholder="Ex: 2 anos"
                    required
                  />
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, prazoGuardaArquivoCorrente: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sugestões" />
                    </SelectTrigger>
                    <SelectContent>
                      {prazosSugeridos.map(prazo => (
                        <SelectItem key={prazo.value} value={prazo.value}>{prazo.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="prazoIntermediario">
                  <Archive className="h-4 w-4 inline mr-1" />
                  Prazo - Arquivo Intermediário
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="prazoIntermediario"
                    value={formData.prazoGuardaArquivoIntermediario}
                    onChange={(e) => setFormData(prev => ({ ...prev, prazoGuardaArquivoIntermediario: e.target.value }))}
                    placeholder="Ex: 3 anos"
                    required
                  />
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, prazoGuardaArquivoIntermediario: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sugestões" />
                    </SelectTrigger>
                    <SelectContent>
                      {prazosSugeridos.map(prazo => (
                        <SelectItem key={prazo.value} value={prazo.value}>{prazo.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Destinação Final</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="destinacao"
                      value="eliminacao"
                      checked={formData.destinacaoFinal === "eliminacao"}
                      onChange={(e) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          destinacaoFinal: e.target.value as any,
                          justificativasDestinacao: []
                        }));
                      }}
                    />
                    <span>Eliminação</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="destinacao"
                      value="guarda_permanente"
                      checked={formData.destinacaoFinal === "guarda_permanente"}
                      onChange={(e) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          destinacaoFinal: e.target.value as any,
                          justificativasDestinacao: []
                        }));
                      }}
                    />
                    <span>Guarda Permanente</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Eventos de Disparo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Evento de Disparo - Arquivo Corrente
              </Label>
              <Select
                value={formData.eventoDisparoCorrente}
                onValueChange={(value) => setFormData(prev => ({ ...prev, eventoDisparoCorrente: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o evento de disparo" />
                </SelectTrigger>
                <SelectContent>
                  {EVENTOS_ARQUIVO_CORRENTE.map(evento => (
                    <SelectItem key={evento.id} value={evento.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{evento.titulo}</span>
                        <span className="text-xs text-gray-600">{evento.descricao}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Evento de Disparo - Arquivo Intermediário
              </Label>
              <Select
                value={formData.eventoDisparoIntermediario}
                onValueChange={(value) => setFormData(prev => ({ ...prev, eventoDisparoIntermediario: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o evento de disparo" />
                </SelectTrigger>
                <SelectContent>
                  {EVENTOS_ARQUIVO_INTERMEDIARIO.map(evento => (
                    <SelectItem key={evento.id} value={evento.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{evento.titulo}</span>
                        <span className="text-xs text-gray-600">{evento.descricao}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Justificativas da Destinação */}
          <div>
            <Label className="flex items-center gap-2">
              Justificativas da Destinação
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowJustificativaHelp(!showJustificativaHelp)}
                className="h-6 w-6 p-0"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {getJustificativasDisponiveis().map(justificativa => (
                <div
                  key={justificativa.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.justificativasDestinacao.includes(justificativa.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => toggleJustificativa(justificativa.id)}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={formData.justificativasDestinacao.includes(justificativa.id)}
                      onChange={() => toggleJustificativa(justificativa.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-sm">{justificativa.titulo}</p>
                      <p className="text-xs text-gray-600 mt-1">{justificativa.descricao}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.justificativasDestinacao.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Justificativas Selecionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.justificativasDestinacao.map(justId => {
                    const justificativas = [...JUSTIFICATIVAS_GUARDA_PERMANENTE, ...JUSTIFICATIVAS_ELIMINACAO];
                    const justificativa = justificativas.find(j => j.id === justId);
                    return (
                      <Badge key={justId} variant="secondary" className="flex items-center gap-1">
                        {justificativa ? justificativa.titulo : justId}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => toggleJustificativa(justId)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Unidades de Produção */}
          <div>
            <Label>Unidades de Produção</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newUnidade}
                onChange={(e) => setNewUnidade(e.target.value)}
                placeholder="Digite o nome da unidade"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUnidade())}
              />
              <Button type="button" onClick={addUnidade} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.unidadeProducao.map((unidade, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {unidade}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeUnidade(unidade)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Fundamentação Legal */}
          <div>
            <Label>Fundamentação Legal</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newLegislacao}
                onChange={(e) => setNewLegislacao(e.target.value)}
                placeholder="Ex: Lei 8.159/1991"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLegislacao())}
              />
              <Button type="button" onClick={addLegislacao} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.fundamentacaoLegal.map((legislacao, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {legislacao}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeLegislacao(legislacao)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações adicionais sobre a temporalidade..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {editingItem ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
