import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Save, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CLASSIFICATION_CODES = [
  { code: "000.1", label: "Administração Geral" },
  { code: "000.2", label: "Gestão de Pessoas" },
  { code: "000.3", label: "Orçamento e Finanças" },
];

const NOMES_ORIGINAIS_DISPONIVEIS = [
  { id: "1", nome: "Requerimento", quantidade: 10, usado: 0 },
  { id: "2", nome: "Atestado", quantidade: 5, usado: 0 },
  { id: "3", nome: "Declaração", quantidade: 7, usado: 0 },
];

const FAMILIAS_DOCUMENTAIS = [
  "Pessoal",
  "Contratos",
  "Financeiro",
  "Acadêmico",
  "Jurídico",
];

const JUSTIFICATIVAS_DESTINACAO_FINAL = [
  "Valor histórico",
  "Valor probatório",
  "Valor informativo",
  "Valor para pesquisa",
  "Valor para a memória institucional",
];

interface DocumentTypeFormData {
  nomePadronizado: string;
  nomeOriginal: string;
  codigo: string;
  funcao: string;
  atividade: string;
  atividadeFimMeio: 'fim' | 'meio' | '';
  familiaDocumental: string;
  definicao: string;
  generoDocumental: 'textual' | 'iconografico' | 'sonoro' | 'audiovisual' | 'tridimensional' | 'informatico' | '';
  tipoSuporte: 'papel' | 'digital' | 'microfilme' | 'outro' | '';
  // Campos de temporalidade
  prazoGuardaFaseCorrente: string;
  eventoFaseCorrente: string;
  prazoGuardaFaseIntermediaria: string;
  eventoFaseIntermediaria: string;
  destinacaoFinal: 'eliminacao' | 'guarda_permanente' | '';
  justificativasDestinacao: string[];
  observacoesTemporalidade: string;
}

interface DocumentTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  type: 'document' | 'process';
  editData?: any;
  isEdit?: boolean;
  availableOriginalNames?: Array<{ id: string; nome: string; quantidade: number; usado: number; }>;
  onUpdateOriginalNames?: (names: Array<{ id: string; nome: string; quantidade: number; usado: number; }>) => void;
}

const atividadeFimMeioOptions = [
  { value: 'fim', label: 'Fim' },
  { value: 'meio', label: 'Meio' },
];

const generoDocumentalOptions = [
  { value: 'textual', label: 'Textual' },
  { value: 'iconografico', label: 'Iconográfico' },
  { value: 'sonoro', label: 'Sonoro' },
  { value: 'audiovisual', label: 'Audiovisual' },
  { value: 'tridimensional', label: 'Tridimensional' },
  { value: 'informatico', label: 'Informático' },
];

const tipoSuporteOptions = [
  { value: 'papel', label: 'Papel' },
  { value: 'digital', label: 'Digital' },
  { value: 'microfilme', label: 'Microfilme' },
  { value: 'outro', label: 'Outro' },
];

const destinacaoFinalOptions = [
  { value: 'eliminacao', label: 'Eliminação' },
  { value: 'guarda_permanente', label: 'Guarda Permanente' },
];

export function DocumentTypeForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type, 
  editData, 
  isEdit, 
  availableOriginalNames = NOMES_ORIGINAIS_DISPONIVEIS,
  onUpdateOriginalNames 
}: DocumentTypeFormProps) {
  const { toast } = useToast();
  const [classificationSearch, setClassificationSearch] = useState("");
  const [selectedClassification, setSelectedClassification] = useState<typeof CLASSIFICATION_CODES[0] | null>(null);
  const [nomesOriginaisDisponiveis, setNomesOriginaisDisponiveis] = useState(availableOriginalNames);
  
  const [formData, setFormData] = useState<DocumentTypeFormData>({
    nomePadronizado: editData?.nomePadronizado || "",
    nomeOriginal: editData?.nomeOriginal || "",
    codigo: editData?.codigo || "",
    funcao: editData?.funcao || "",
    atividade: editData?.atividade || "",
    atividadeFimMeio: editData?.atividadeFimMeio || '',
    familiaDocumental: editData?.familiaDocumental || "",
    definicao: editData?.definicao || "",
    generoDocumental: editData?.generoDocumental || '',
    tipoSuporte: editData?.tipoSuporte || '',
    prazoGuardaFaseCorrente: editData?.prazoGuardaFaseCorrente || "",
    eventoFaseCorrente: editData?.eventoFaseCorrente || "",
    prazoGuardaFaseIntermediaria: editData?.prazoGuardaFaseIntermediaria || "",
    eventoFaseIntermediaria: editData?.eventoFaseIntermediaria || "",
    destinacaoFinal: editData?.destinacaoFinal || '',
    justificativasDestinacao: editData?.justificativasDestinacao || [],
    observacoesTemporalidade: editData?.observacoesTemporalidade || "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        nomePadronizado: editData.nomePadronizado || "",
        nomeOriginal: editData.nomeOriginal || "",
        codigo: editData.codigo || "",
        funcao: editData.funcao || "",
        atividade: editData.atividade || "",
        atividadeFimMeio: editData.atividadeFimMeio || '',
        familiaDocumental: editData.familiaDocumental || "",
        definicao: editData.definicao || "",
        generoDocumental: editData.generoDocumental || '',
        tipoSuporte: editData.tipoSuporte || '',
        prazoGuardaFaseCorrente: editData.prazoGuardaFaseCorrente || "",
        eventoFaseCorrente: editData.eventoFaseCorrente || "",
        prazoGuardaFaseIntermediaria: editData.prazoGuardaFaseIntermediaria || "",
        eventoFaseIntermediaria: editData.eventoFaseIntermediaria || "",
        destinacaoFinal: editData.destinacaoFinal || '',
        justificativasDestinacao: editData.justificativasDestinacao || [],
        observacoesTemporalidade: editData.observacoesTemporalidade || "",
      });
    }
  }, [editData]);

  const handleNomeOriginalSelect = (nomeId: string) => {
    const nome = nomesOriginaisDisponiveis.find(n => n.id === nomeId);
    if (nome && nome.usado < nome.quantidade) {
      setFormData(prev => ({ ...prev, nomeOriginal: nome.nome }));
      
      // Atualizar a lista, incrementando o uso
      const novosNomes = nomesOriginaisDisponiveis.map(n => 
        n.id === nomeId 
          ? { ...n, usado: n.usado + 1 }
          : n
      );
      
      setNomesOriginaisDisponiveis(novosNomes);
      if (onUpdateOriginalNames) {
        onUpdateOriginalNames(novosNomes);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleJustificativaChange = (justificativa: string) => {
    setFormData(prev => {
      if (prev.justificativasDestinacao.includes(justificativa)) {
        return {
          ...prev,
          justificativasDestinacao: prev.justificativasDestinacao.filter(j => j !== justificativa)
        };
      } else {
        return {
          ...prev,
          justificativasDestinacao: [...prev.justificativasDestinacao, justificativa]
        };
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar' : 'Cadastrar'} Tipo Documental
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomePadronizado">Nome Padronizado</Label>
              <Input
                id="nomePadronizado"
                value={formData.nomePadronizado}
                onChange={(e) => setFormData(prev => ({ ...prev, nomePadronizado: e.target.value }))}
                placeholder="Ex: Requerimento de férias"
                required
              />
            </div>

            <div>
              <Label htmlFor="nomeOriginal">Nome Original</Label>
              <div className="flex gap-2">
                <Input
                  id="nomeOriginal"
                  value={formData.nomeOriginal}
                  placeholder="Selecione ou digite..."
                  onChange={(e) => setFormData(prev => ({ ...prev, nomeOriginal: e.target.value }))}
                />
                <Select onValueChange={handleNomeOriginalSelect}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Nomes Originais" />
                  </SelectTrigger>
                  <SelectContent>
                    {nomesOriginaisDisponiveis.map(nome => (
                      <SelectItem key={nome.id} value={nome.id} disabled={nome.usado >= nome.quantidade}>
                        {nome.nome} ({nome.quantidade - nome.usado} disponíveis)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="codigo">Código de Classificação</Label>
              <div className="flex gap-2">
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Buscar código..."
                  className="w-full"
                  onInput={(e) => setClassificationSearch((e.target as HTMLInputElement).value)}
                />
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              {classificationSearch && (
                <Card className="mt-2">
                  <CardContent className="p-2">
                    {CLASSIFICATION_CODES
                      .filter(c => c.label.toLowerCase().includes(classificationSearch.toLowerCase()))
                      .map(c => (
                        <div
                          key={c.code}
                          className={`p-2 rounded hover:bg-gray-100 cursor-pointer ${selectedClassification?.code === c.code ? 'bg-gray-200' : ''}`}
                          onClick={() => setSelectedClassification(c)}
                        >
                          {c.code} - {c.label}
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}
              {selectedClassification && (
                <Badge variant="secondary" className="mt-2">
                  Selecionado: {selectedClassification.code} - {selectedClassification.label}
                </Badge>
              )}
            </div>

            <div>
              <Label htmlFor="funcao">Função</Label>
              <Input
                id="funcao"
                value={formData.funcao}
                onChange={(e) => setFormData(prev => ({ ...prev, funcao: e.target.value }))}
                placeholder="Ex: Gestão documental"
              />
            </div>

            <div>
              <Label htmlFor="atividade">Atividade</Label>
              <Input
                id="atividade"
                value={formData.atividade}
                onChange={(e) => setFormData(prev => ({ ...prev, atividade: e.target.value }))}
                placeholder="Ex: Digitalização de documentos"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="atividadeFimMeio">Atividade-Fim ou Atividade-Meio?</Label>
              <Select
                onValueChange={(value) => setFormData(prev => ({ ...prev, atividadeFimMeio: value as 'fim' | 'meio' }))}
                defaultValue={formData.atividadeFimMeio}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {atividadeFimMeioOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="familiaDocumental">Família Documental</Label>
              <Select
                onValueChange={(value) => setFormData(prev => ({ ...prev, familiaDocumental: value }))}
                defaultValue={formData.familiaDocumental}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {FAMILIAS_DOCUMENTAIS.map(familia => (
                    <SelectItem key={familia} value={familia}>{familia}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="definicao">Definição</Label>
            <Textarea
              id="definicao"
              value={formData.definicao}
              onChange={(e) => setFormData(prev => ({ ...prev, definicao: e.target.value }))}
              placeholder="Defina o tipo documental..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="generoDocumental">Gênero Documental</Label>
              <Select
                onValueChange={(value) => setFormData(prev => ({ ...prev, generoDocumental: value as 'textual' | 'iconografico' | 'sonoro' | 'audiovisual' | 'tridimensional' | 'informatico' }))}
                defaultValue={formData.generoDocumental}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {generoDocumentalOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipoSuporte">Tipo de Suporte</Label>
              <Select
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipoSuporte: value as 'papel' | 'digital' | 'microfilme' | 'outro' }))}
                defaultValue={formData.tipoSuporte}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {tipoSuporteOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Temporalidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prazoGuardaFaseCorrente">Prazo de Guarda - Fase Corrente</Label>
                  <Input
                    id="prazoGuardaFaseCorrente"
                    value={formData.prazoGuardaFaseCorrente}
                    onChange={(e) => setFormData(prev => ({ ...prev, prazoGuardaFaseCorrente: e.target.value }))}
                    placeholder="Ex: 2 anos"
                  />
                </div>

                <div>
                  <Label htmlFor="eventoFaseCorrente">Evento - Fase Corrente</Label>
                  <Input
                    id="eventoFaseCorrente"
                    value={formData.eventoFaseCorrente}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventoFaseCorrente: e.target.value }))}
                    placeholder="Ex: Conclusão do processo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prazoGuardaFaseIntermediaria">Prazo de Guarda - Fase Intermediária</Label>
                  <Input
                    id="prazoGuardaFaseIntermediaria"
                    value={formData.prazoGuardaFaseIntermediaria}
                    onChange={(e) => setFormData(prev => ({ ...prev, prazoGuardaFaseIntermediaria: e.target.value }))}
                    placeholder="Ex: 5 anos"
                  />
                </div>

                <div>
                  <Label htmlFor="eventoFaseIntermediaria">Evento - Fase Intermediária</Label>
                  <Input
                    id="eventoFaseIntermediaria"
                    value={formData.eventoFaseIntermediaria}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventoFaseIntermediaria: e.target.value }))}
                    placeholder="Ex: Transferência para o arquivo intermediário"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="destinacaoFinal">Destinação Final</Label>
                <Select
                  onValueChange={(value) => setFormData(prev => ({ ...prev, destinacaoFinal: value as 'eliminacao' | 'guarda_permanente' }))}
                  defaultValue={formData.destinacaoFinal}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinacaoFinalOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Justificativas para Destinação Final</Label>
                <div className="flex flex-col space-y-2">
                  {JUSTIFICATIVAS_DESTINACAO_FINAL.map(justificativa => (
                    <div key={justificativa} className="flex items-center space-x-2">
                      <Checkbox
                        id={`justificativa-${justificativa}`}
                        checked={formData.justificativasDestinacao.includes(justificativa)}
                        onCheckedChange={() => handleJustificativaChange(justificativa)}
                      />
                      <Label htmlFor={`justificativa-${justificativa}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {justificativa}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="observacoesTemporalidade">Observações sobre a Temporalidade</Label>
                <Textarea
                  id="observacoesTemporalidade"
                  value={formData.observacoesTemporalidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoesTemporalidade: e.target.value }))}
                  placeholder="Observações adicionais sobre a temporalidade..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
