
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save, BookOpen, AlertCircle } from "lucide-react";

interface ArchiveSectorDiagnosticFormProps {
  onNavigateBack: () => void;
}

interface FormData {
  // Identificação (6 perguntas)
  nomeRespondente: string;
  emailInstitucional: string;
  telefone: string;
  quantidadeMembrosEquipe: string;
  grauEscolaridade: Record<string, string>;
  composicaoEquipe: Record<string, string>;
  
  // Gestão de Pessoal (4 perguntas)
  tempoMedioAtuacao: string;
  houveSaida: string;
  impactosSaidas: string[];
  
  // Histórico de Diagnósticos (10 perguntas)
  diagnosticoRealizado: string;
  anoDiagnostico: string;
  dadosSuficientes: string;
  recomendacoesImplementadas: string;
  fatoresDificultaram: string[];
  dadosReaproveitados: string;
  avaliacaoSIGA: string;
  anoAvaliacaoSIGA: string;
  grauMaturidadeSIGA: string;
  resultadoSIGAUtilizado: string;
  
  // Projetos e Investimentos (5 perguntas)
  aderenciaSIGA: string;
  projetosRealizados: string;
  valorInvestido: string;
  eficaciaProjetos: Record<string, string>;
  
  // Estrutura Organizacional (8 perguntas)
  atribuicoesRegimento: string;
  atividadesDeveriamConstar: string;
  lacunaNormativa: string[];
  iniciativaRevisao: string;
  funcionesArquivisticas: Record<string, string>;
  documentacaoFormal: string;
  participacaoTransformacao: string[];
  
  // Políticas e Instrumentos (6 perguntas)
  instrumentosNormativos: string[];
  instrumentosAtualizados: Record<string, string>;
  diretrizesSAE: string[];
  aplicacaoInstrumentos: Record<string, string>;
  divulgacaoPoliticas: string;
  
  // Serviços e Produtos (6 perguntas)
  servicosRealizados: Record<string, string>;
  outrosServicos: string;
  documentacaoServicos: string;
  produtosPossui: Record<string, string>;
  outrosProdutos: string;
  frequenciaAtualizacao: string;
  
  // CPAD (8 perguntas)
  cpadInstituida: string;
  configuracaoCPAD: string;
  ajustesCPAD: string[];
  frequenciaReunioes: string;
  acoesCPAD: string[];
  capacitacaoCPAD: string;
  dificuldadesCPAD: string[];
  
  // Transferência e Recolhimento (12 perguntas)
  recebeTransferencia: Record<string, string>;
  motivosNaoRecebimento: Record<string, string[]>;
  criterioTransferencia: Record<string, string>;
  criteriosAdotados: Record<string, string[]>;
  controleTransferencias: Record<string, string>;
  transferenciaSemCriterio: string;
  espacoFisico: string;
  recolhimentoAN: Record<string, string>;
  registrosRecolhimento: Record<string, string>;
  volumeRecolhido: string;
  anoRecolhimento: Record<string, string>;
  
  // Eliminação (4 perguntas)
  eliminacaoDocumentos: Record<string, string>;
  motivosEliminacao: string[];
  volumeEliminados: Record<string, string>;
  anoEliminacao: Record<string, string>;
  
  // Acesso e Consulta (11 perguntas)
  solicitacoesMensais: string;
  tempoMedioResposta: string;
  percentualNaoAtendidas: string;
  controleFormal: string;
  acessoDocumentos: string[];
  restricoesAcesso: string;
  salaConsulta: string;
  consultasMensais: string;
  documentosAcessados: string;
  tempoConsulta: string;
  
  // Condições de Armazenamento (14 perguntas)
  enderecoGuarda: string;
  distanciaUnidade: string;
  caracteristicasConstrucao: string;
  areaAproximada: string;
  materialParedes: string;
  materialTelhado: string;
  pavimentoOcupado: string;
  danosInstalacoes: string[];
  tipoIluminacao: string;
  tipoVentilacao: string;
  equipamentosSeguranca: string;
  planoDesastres: string;
  agentesPoluentes: string[];
  controleBiologico: string;
  monitoramentoAmbiente: string;
}

const sections = [
  {
    title: "Identificação",
    description: "Informações básicas da equipe do setor",
    questions: 6
  },
  {
    title: "Gestão de Pessoal",
    description: "Composição e histórico da equipe",
    questions: 4
  },
  {
    title: "Histórico de Diagnósticos",
    description: "Diagnósticos anteriores e avaliações SIGA",
    questions: 10
  },
  {
    title: "Projetos e Investimentos",
    description: "Projetos realizados e investimentos",
    questions: 5
  },
  {
    title: "Estrutura Organizacional",
    description: "Atribuições e funções arquivísticas",
    questions: 8
  },
  {
    title: "Políticas e Instrumentos",
    description: "Instrumentos normativos e políticas",
    questions: 6
  },
  {
    title: "Serviços e Produtos",
    description: "Serviços oferecidos e produtos disponíveis",
    questions: 6
  },
  {
    title: "CPAD",
    description: "Comissão Permanente de Avaliação de Documentos",
    questions: 8
  },
  {
    title: "Transferência e Recolhimento",
    description: "Transferências e recolhimentos de documentos",
    questions: 12
  },
  {
    title: "Eliminação",
    description: "Processos de eliminação de documentos",
    questions: 4
  },
  {
    title: "Acesso e Consulta",
    description: "Atendimento e consulta aos documentos",
    questions: 11
  },
  {
    title: "Condições de Armazenamento",
    description: "Infraestrutura e condições físicas",
    questions: 14
  }
];

const glossaryTerms = [
  { term: "CPAD", definition: "Comissão Permanente de Avaliação de Documentos - responsável pela avaliação e destinação dos documentos de arquivo." },
  { term: "SIGA", definition: "Sistema de Gestão de Documentos de Arquivo - sistema de avaliação da maturidade arquivística." },
  { term: "Recolhimento", definition: "Transferência de documentos de valor permanente dos arquivos intermediários para os arquivos permanentes." },
  { term: "Transferência", definition: "Passagem de documentos do arquivo corrente para o arquivo intermediário." },
  { term: "Eliminação", definition: "Destruição de documentos que não possuem valor permanente, conforme tabela de temporalidade." },
  { term: "Tabela de Temporalidade", definition: "Instrumento que define prazos de guarda e destinação dos documentos." },
  { term: "Código de Classificação", definition: "Instrumento que organiza os documentos segundo suas funções e atividades." },
  { term: "SIGAD", definition: "Sistema Informatizado de Gestão Arquivística de Documentos." },
  { term: "GED", definition: "Gerenciamento Eletrônico de Documentos - sistema para organização digital." },
  { term: "Acondicionamento", definition: "Embalagem ou guarda de documentos visando sua proteção e preservação." }
];

export function ArchiveSectorDiagnosticForm({ onNavigateBack }: ArchiveSectorDiagnosticFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const form = useForm<FormData>();

  // Salvamento automático
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadProgress();
  }, []);

  const saveProgress = () => {
    const formData = form.getValues();
    const progressData = {
      formData,
      currentSection,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('archive-sector-diagnostic-progress', JSON.stringify(progressData));
    setLastSaved(new Date());
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('archive-sector-diagnostic-progress');
    if (saved) {
      try {
        const progressData = JSON.parse(saved);
        form.reset(progressData.formData);
        setCurrentSection(progressData.currentSection);
        setLastSaved(new Date(progressData.timestamp));
        
        toast({
          title: "Progresso restaurado",
          description: "Seus dados foram recuperados da sessão anterior.",
        });
      } catch (error) {
        console.error("Erro ao carregar progresso:", error);
      }
    }
  };

  const clearProgress = () => {
    localStorage.removeItem('archive-sector-diagnostic-progress');
    setLastSaved(null);
  };

  const handleNext = () => {
    saveProgress();
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    saveProgress();
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Dados do formulário:", data);
    clearProgress();
    toast({
      title: "Formulário enviado com sucesso!",
      description: "Obrigado por participar do diagnóstico do Setor de Arquivo.",
    });
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Identificação
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="nomeRespondente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do respondente *</FormLabel>
                  <FormControl>
                    <Input placeholder="Primeiro nome Último nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailInstitucional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail institucional *</FormLabel>
                  <FormControl>
                    <Input placeholder="usuario@instituicao.gov.br" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de telefone *</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantidadeMembrosEquipe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantos membros compõem a equipe do setor de arquivo?</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe a quantidade" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label>Qual o grau de escolaridade dos membros da equipe do Setor de Arquivo? (Informe a quantidade por nível)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "ensinoMedio", label: "Ensino médio completo" },
                  { key: "tecnico", label: "Técnico (Técnico em arquivo)" },
                  { key: "superiorOutros", label: "Ensino superior completo (não arquivologia)" },
                  { key: "arquivologia", label: "Ensino superior em arquivologia" },
                  { key: "posGraduacao", label: "Pós-graduação (especialização ou mais)" }
                ].map((nivel) => (
                  <FormField
                    key={nivel.key}
                    control={form.control}
                    name={`grauEscolaridade.${nivel.key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{nivel.label}</FormLabel>
                        <FormControl>
                          <Input placeholder="0" type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Composição da equipe atual do setor de arquivo (Informe a quantidade por vínculo)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "efetivos", label: "Efetivos" },
                  { key: "comissionados", label: "Comissionados (sem vínculo efetivo)" },
                  { key: "terceirizados", label: "Terceirizados" },
                  { key: "estagiarios", label: "Estagiários" },
                  { key: "outros", label: "Outros" }
                ].map((vinculo) => (
                  <FormField
                    key={vinculo.key}
                    control={form.control}
                    name={`composicaoEquipe.${vinculo.key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{vinculo.label}</FormLabel>
                        <FormControl>
                          <Input placeholder="0" type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 1: // Gestão de Pessoal
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="tempoMedioAtuacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual o tempo médio de atuação da equipe atual no Setor de Arquivo?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ate1ano" id="ate1ano" />
                        <Label htmlFor="ate1ano">Até 1 ano</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1a3anos" id="1a3anos" />
                        <Label htmlFor="1a3anos">De 1 a 3 anos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3a5anos" id="3a5anos" />
                        <Label htmlFor="3a5anos">De 3 a 5 anos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mais5anos" id="mais5anos" />
                        <Label htmlFor="mais5anos">Mais de 5 anos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="distintos" id="distintos" />
                        <Label htmlFor="distintos">Membros com tempos muito distintos</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="houveSaida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nos últimos 5 anos, houve saída de servidores ou colaboradores que desempenhavam funções estratégicas no setor de arquivo?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="saidaSim" />
                        <Label htmlFor="saidaSim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="saidaNao" />
                        <Label htmlFor="saidaNao">Não</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("houveSaida") === "sim" && (
              <div className="space-y-4">
                <Label>Quais os impactos principais dessa(s) saída(s)?</Label>
                <div className="space-y-2">
                  {[
                    { value: "perdaConhecimento", label: "Perda de conhecimento técnico acumulado" },
                    { value: "paralisacaoProjetos", label: "Paralisação ou atraso de projetos" },
                    { value: "reducaoCapacidade", label: "Redução da capacidade operacional mínima" },
                    { value: "dificuldadeReposicao", label: "Dificuldade de reposição técnica" },
                    { value: "semImpacto", label: "Não teve impacto" },
                    { value: "outros", label: "Outros" }
                  ].map((impacto) => (
                    <div key={impacto.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={impacto.value}
                        checked={form.watch("impactosSaidas")?.includes(impacto.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = form.getValues("impactosSaidas") || [];
                          if (checked) {
                            form.setValue("impactosSaidas", [...currentValues, impacto.value]);
                          } else {
                            form.setValue("impactosSaidas", currentValues.filter(v => v !== impacto.value));
                          }
                        }}
                      />
                      <Label htmlFor={impacto.value}>{impacto.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      // Adicionar demais seções...
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Seção em desenvolvimento...</p>
            <p className="text-sm text-muted-foreground mt-2">
              {sections[currentSection]?.title}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onNavigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Diagnóstico do Setor de Arquivo</h1>
            <p className="text-muted-foreground">Formulário completo de avaliação</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Glossário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Glossário de Termos Arquivísticos</DialogTitle>
              <DialogDescription>
                Definições dos principais termos utilizados neste diagnóstico
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              {glossaryTerms.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-primary">{item.term}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.definition}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Informações sobre salvamento automático */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Salvamento Automático Ativo
              </p>
              <p className="text-xs text-blue-600">
                Suas respostas são salvas automaticamente a cada 30 segundos. Você pode parar e continuar depois.
                {lastSaved && (
                  <span className="ml-2">
                    Último salvamento: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Seção {currentSection + 1} de {sections.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentSection + 1) / sections.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {sections[currentSection]?.questions} pergunta(s) nesta seção
            </span>
            <Badge variant="outline" className="text-xs">
              Total: 98 perguntas
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Current Section */}
      <Card>
        <CardHeader>
          <CardTitle>{sections[currentSection]?.title}</CardTitle>
          <CardDescription>{sections[currentSection]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {renderSection()}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSection === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={saveProgress}
          >
            <Save className="h-4 w-4" />
            Salvar Progresso
          </Button>
          
          {currentSection === sections.length - 1 ? (
            <Button onClick={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Finalizar
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex items-center gap-2">
              Próximo
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
