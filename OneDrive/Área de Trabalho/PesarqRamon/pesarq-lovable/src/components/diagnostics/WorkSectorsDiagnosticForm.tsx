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

interface WorkSectorsDiagnosticFormProps {
  onNavigateBack: () => void;
  selectedSector?: string;
}

interface FormData {
  // Identificação
  nomeRespondente: string;
  emailInstitucional: string;
  telefone: string;
  localizacaoInstitucional: string;
  estado: string;
  nomeSetor: string;
  
  // Gestão de Documentos
  servidorDesignado: string;
  numeroServidorAdequado: string;
  importanciaDocumentos: string;
  metodosOrganizacao: string;
  outrosProjetos: string;
  valorInvestido: string;
  eficaciaProjetos: string;
  resultadosAlcancados: string[];
  
  // Produção e Armazenamento
  geraPapel: string;
  proporcaoPapel: string;
  documentosPapelArmazenados: string;
  localArmazenamento: string;
  outrosAmbientes: string;
  ambientesOutros: string;
  gestaoAmbientes: string;
  caracteristicaAmbiente: string;
  expostoRiscos: string;
  agentesRisco: string[];
  mobiliariosArmazenamento: string[];
  estadoMobiliarios: string;
  mobiliariosAdequados: string;
  embalagensTipos: string[];
  estadoEmbalagens: string;
  embalagensAdequadas: string;
  organizacaoDocumentos: string;
  motivoNaoTransferencia: string;
  anoMaisAntigo: string;
  quantidadeDocumentos: string;
  
  // Documentos Específicos
  documentosCartograficos: string;
  armazenamentoCartograficos: string;
  quantidadeCartograficos: string;
  documentosIconograficos: string;
  armazenamentoIconograficos: string;
  quantidadeIconograficos: string;
  midiasEletronicas: string;
  armazenamentoMidias: string;
  quantidadeMidias: string;
  acessoMidias: string;
  microformas: string;
  quantidadeMicroformas: string;
  acessoMicroformas: string;
  
  // Conservação e Sinistros
  estadoConservacao: string;
  sinistrosPassados: string;
  quantidadeSinistros: string;
  tiposSinistros: string[];
  impactoSinistros: string;
  medidasPrevencao: string;
  medidasAdotadas: string[];
  doencasAdquiridas: string;
  especifiqueDoencas: string;
  
  // Digitalização
  praticaDigitalizacao: string;
  responsavelDigitalizacao: string[];
  frequenciaDigitalizacao: string[];
  criteriosDigitalizacao: string[];
  armazenamentoDigital: string[];
  
  // Organização e Acesso
  registroIndexacao: string;
  localRegistro: string;
  facilidadeAcesso: string;
  tempoRecuperacao: string;
  documentosNaoLocalizados: string;
  frequenciaNaoEncontrados: string;
  impressaoDocumentos: string;
  motivosImpressao: string[];
  volumeImpressao: string;
  emailPessoal: string;
  motivosEmailPessoal: string[];
  
  // Sistemas Digitais
  utilizaSEI: string;
  satisfacaoSEI: string;
  dificuldadesSEI: string[];
  outrosSistemas: string;
  especifiqueOutrosSistemas: string;
  recuperacaoDigital: string;
  tempoRecuperacaoDigital: string;
  digitaisNaoLocalizados: string;
  frequenciaDigitaisNaoEncontrados: string;
  
  // Proteção de Dados e Acesso
  conheceLGPD: string;
  documentosSigilosos: string;
  tipoInformacao: string[];
  mecanismosControle: string[];
  frequenciaConsultas: string;
  volumeConsultas: string;
  naturezaConsultas: string[];
  
  // Serviços Arquivísticos
  conheceServicoArquivo: string;
  recebeuOrientacao: string;
  satisfacaoAtendimento: string;
  precisouDocumentosArquivo: string;
  documentosLocalizados: string;
  tempoRespostaSatisfatorio: string;
  
  // Eliminação
  eliminacaoDocumentos: string;
  motivosEliminacao: string[];
  quantidadeEliminada: string;
}

const estados = [
  "Acre (AC)", "Alagoas (AL)", "Amapá (AP)", "Amazonas (AM)", "Bahia (BA)", 
  "Ceará (CE)", "Distrito Federal (DF)", "Espírito Santo (ES)", "Goiás (GO)", 
  "Maranhão (MA)", "Mato Grosso (MT)", "Mato Grosso do Sul (MS)", "Minas Gerais (MG)", 
  "Pará (PA)", "Paraíba (PB)", "Paraná (PR)", "Pernambuco (PE)", "Piauí (PI)", 
  "Rio de Janeiro (RJ)", "Rio Grande do Norte (RN)", "Rio Grande do Sul (RS)", 
  "Rondônia (RO)", "Roraima (RR)", "Santa Catarina (SC)", "São Paulo (SP)", 
  "Sergipe (SE)", "Tocantins (TO)"
];

const glossary = [
  {
    term: "Acondicionamento",
    definition: "Embalagem ou guarda de documentos visando à sua proteção e preservação."
  },
  {
    term: "Acervo",
    definition: "Conjunto de documentos preservados por uma instituição em função do seu valor."
  },
  {
    term: "Arquivo",
    definition: "Conjunto de documentos produzidos e acumulados por uma entidade coletiva, pública ou privada, pessoa ou família, no desempenho de suas atividades, independentemente da natureza do suporte."
  },
  {
    term: "Classificação",
    definition: "Sequência de operações que, de acordo com as diferentes estruturas, funções e atividades da entidade produtora, visam a distribuir os documentos de um arquivo."
  },
  {
    term: "Digitalização",
    definition: "Processo de conversão de um documento para formato digital por meio de dispositivo apropriado, como escâner."
  },
  {
    term: "Documento Arquivístico",
    definition: "Documento produzido (elaborado ou recebido) no curso de uma atividade prática como instrumento ou resultado de tal atividade, e retido para ação ou referência."
  },
  {
    term: "Eliminação",
    definition: "Destruição de documentos que, na avaliação, foram considerados sem valor permanente."
  },
  {
    term: "GED",
    definition: "Gerenciamento Eletrônico de Documentos - conjunto de tecnologias utilizadas para organização, armazenamento e recuperação de informações em formato digital."
  },
  {
    term: "Indexação",
    definition: "Processo pelo qual documentos ou informações são organizados segundo critérios preestabelecidos, a fim de facilitar a consulta por parte dos usuários."
  },
  {
    term: "LGPD",
    definition: "Lei Geral de Proteção de Dados - legislação brasileira que regula as atividades de tratamento de dados pessoais."
  },
  {
    term: "Microformas",
    definition: "Documentos em formato reduzido, como microfilmes e microfichas, criados através de processo fotográfico."
  },
  {
    term: "Plano de Classificação",
    definition: "Esquema de distribuição de documentos em classes, de acordo com métodos de arquivamento específicos."
  },
  {
    term: "Protocolo",
    definition: "Serviço encarregado do recebimento, registro, distribuição e movimentação de documentos em curso."
  },
  {
    term: "SEI",
    definition: "Sistema Eletrônico de Informações - sistema de gestão de processos e documentos eletrônicos do governo federal."
  },
  {
    term: "Sinistro",
    definition: "Evento danoso que pode afetar a integridade de documentos, como incêndios, alagamentos, infestações biológicas."
  },
  {
    term: "Tabela de Temporalidade",
    definition: "Instrumento de destinação, aprovado pela autoridade competente, que determina prazos e condições de guarda tendo em vista a transferência, recolhimento, descarte ou eliminação de documentos."
  },
  {
    term: "Transferência",
    definition: "Passagem de documentos do arquivo corrente para o arquivo intermediário."
  }
];

export function WorkSectorsDiagnosticForm({ onNavigateBack, selectedSector }: WorkSectorsDiagnosticFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const form = useForm<FormData>({
    defaultValues: {
      nomeSetor: selectedSector || ""
    }
  });

  const sections = [
    {
      title: "Identificação",
      description: "Informações básicas do respondente e setor",
      questions: 6
    },
    {
      title: "Gestão de Documentos",
      description: "Organização e métodos utilizados",
      questions: 8
    },
    {
      title: "Produção e Armazenamento",
      description: "Documentos em papel e condições de armazenamento",
      questions: 23
    },
    {
      title: "Documentos Específicos",
      description: "Cartográficos, iconográficos e mídias eletrônicas",
      questions: 12
    },
    {
      title: "Conservação e Sinistros",
      description: "Estado de conservação e riscos",
      questions: 9
    },
    {
      title: "Digitalização",
      description: "Práticas e processos de digitalização",
      questions: 4
    },
    {
      title: "Organização e Acesso",
      description: "Sistemas de organização e recuperação",
      questions: 10
    },
    {
      title: "Sistemas Digitais",
      description: "Uso de sistemas informatizados",
      questions: 8
    },
    {
      title: "Proteção de Dados e Acesso",
      description: "LGPD e controle de acesso",
      questions: 7
    },
    {
      title: "Serviços Arquivísticos",
      description: "Relacionamento com setor de arquivo",
      questions: 6
    },
    {
      title: "Eliminação",
      description: "Processos de eliminação de documentos",
      questions: 3
    }
  ];

  // Salvamento automático
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000); // Salva a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Carregar progresso salvo ao inicializar
  useEffect(() => {
    loadProgress();
  }, []);

  const saveProgress = () => {
    const formData = form.getValues();
    const progressData = {
      formData,
      currentSection,
      timestamp: new Date().toISOString(),
      sector: selectedSector
    };
    
    localStorage.setItem('work-sectors-diagnostic-progress', JSON.stringify(progressData));
    setLastSaved(new Date());
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('work-sectors-diagnostic-progress');
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
    localStorage.removeItem('work-sectors-diagnostic-progress');
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
      description: "Obrigado por participar do diagnóstico.",
    });
    // Implementar envio real dos dados
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
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
                  <FormLabel>E-mail Institucional *</FormLabel>
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
              name="localizacaoInstitucional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização institucional do seu Setor *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a localização" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sede">Sede (Brasília)</SelectItem>
                      <SelectItem value="superintendencia">Superintendência Estadual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecione o Estado do seu Setor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nomeSetor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informe o nome completo do seu Setor *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo do setor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="servidorDesignado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Há algum(a) servidor(a) designado(a) oficialmente para organizar ou eliminar documentos no setor?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="sim1" />
                        <Label htmlFor="sim1">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="parcialmente" id="parcialmente1" />
                        <Label htmlFor="parcialmente1">Parcialmente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="nao1" />
                        <Label htmlFor="nao1">Não</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("servidorDesignado") === "sim" && (
              <FormField
                control={form.control}
                name="numeroServidorAdequado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>O número de servidor(a) designado(a) oficialmente para organizar ou eliminar documentos é adequado?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="sim2" />
                          <Label htmlFor="sim2">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="nao2" />
                          <Label htmlFor="nao2">Não</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="importanciaDocumentos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Em uma escala de 1 (Nada importante) a 5 (Extremamente importante), qual a importância dos documentos do seu setor para as atividades diárias?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="flex items-center space-x-2">
                          <RadioGroupItem value={num.toString()} id={`imp${num}`} />
                          <Label htmlFor={`imp${num}`}>{num}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metodosOrganizacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Você considera que os métodos de organização, preservação e acesso dos documentos utilizados pelo seu Setor são:</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="adequados" id="adequados" />
                        <Label htmlFor="adequados">Adequados</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="parcialmente" id="parcialmente2" />
                        <Label htmlFor="parcialmente2">Parcialmente Adequados</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inadequados" id="inadequados" />
                        <Label htmlFor="inadequados">Inadequados</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      // Continue with other sections...
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Seção em desenvolvimento...</p>
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
            <h1 className="text-2xl font-bold">Diagnóstico de Setores de Trabalho</h1>
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
              {glossary.map((item, index) => (
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
              {sections[currentSection].questions} pergunta(s) nesta seção
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
          <CardTitle>{sections[currentSection].title}</CardTitle>
          <CardDescription>{sections[currentSection].description}</CardDescription>
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
