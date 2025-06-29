import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Save, 
  Plus, 
  FileText, 
  Calendar, 
  MapPin, 
  Archive,
  Building2,
  User,
  Shield,
  Hash,
  Eye,
  FileImage,
  Info,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SearchableSelect } from "@/components/SearchableSelect";

const documentTypes = [
  "Relatório Técnico de Avaliação Ambiental de Impactos Urbanos",
  "Parecer Jurídico sobre Concessão de Benefícios Previdenciários",
  "Termo de Referência para Contratação de Serviços de Tecnologia da Informação",
  "Ata de Reunião Ordinária do Conselho Superior de Administração",
  "Ofício Circular sobre Atualização das Normas de Segurança do Trabalho",
  "Decisão Administrativa sobre Aplicação de Penalidade Disciplinar",
  "Autorização Especial para Supressão de Vegetação em Área de Preservação Permanente",
  "Certidão Negativa de Débitos Trabalhistas",
  "Contrato Administrativo para Prestação de Serviços Terceirizados de Vigilância",
  "Declaração de Regularidade Fiscal e Tributária da Instituição",
  "Relatório de Atividades da Comissão Interna de Prevenção de Acidentes",
  "Memorando de Solicitação de Equipamentos de Proteção Individual",
  "Portaria de Nomeação de Comissão de Processo Administrativo Disciplinar",
  "Instrução Normativa sobre Procedimentos de Arquivo de Documentos",
  "Processo de Licitação para Aquisição de Material de Expediente"
];

const archivalFunds = [
  "Fundo do Ministério da Saúde (extinto)",
  "Fundo do Ministério da Educação e Cultura (incorporado)",
  "Fundo da Fundação Nacional de Saúde (FUNASA)",
  "Fundo do Instituto Nacional de Assistência Médica da Previdência Social (INAMPS)",
  "Fundo da Superintendência de Campanhas de Saúde Pública (SUCAM)",
  "Fundo do Ministério da Previdência e Assistência Social (extinto)",
  "Fundo da Legião Brasileira de Assistência (LBA)",
  "Fundo do Centro Brasileiro de Apoio à Pequena e Média Empresa (CEBRAE)",
  "Fundo da Empresa Brasileira de Assistência Técnica e Extensão Rural (EMBRATER)",
  "Fundo do Instituto Nacional de Desenvolvimento Agrário (INCRA)"
];

const documentGenres = [
  { value: "textual", label: "Textual" },
  { value: "cartographic", label: "Cartográfico" },
  { value: "iconographic", label: "Audiovisual - Iconográfico" },
  { value: "filmographic", label: "Audiovisual - Filmográfico" },
  { value: "sound", label: "Audiovisual - Sonoro" },
  { value: "micrographic", label: "Micrográfico" },
  { value: "electronic", label: "Informático" }
];

const classificationCodes = [
  {
    code: "010",
    description: "ORGANIZAÇÃO E FUNCIONAMENTO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Organização e Funcionamento",
    finalDestination: "permanent"
  },
  {
    code: "010.01",
    description: "NORMATIZAÇÃO. REGULAMENTAÇÃO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Organização e Funcionamento",
    finalDestination: "permanent"
  },
  {
    code: "010.02",
    description: "CRIAÇÃO E EXTINÇÃO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Organização e Funcionamento",
    finalDestination: "permanent"
  },
  {
    code: "020",
    description: "PLANEJAMENTO E ORÇAMENTO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Planejamento e Orçamento",
    finalDestination: "permanent"
  },
  {
    code: "020.01",
    description: "PLANO, PROGRAMA E PROJETO DE TRABALHO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Planejamento e Orçamento",
    finalDestination: "permanent"
  },
  {
    code: "020.02",
    description: "PREVISÃO ORÇAMENTÁRIA",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Planejamento e Orçamento",
    finalDestination: "permanent"
  },
  {
    code: "020.03",
    description: "EXECUÇÃO ORÇAMENTÁRIA",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Planejamento e Orçamento",
    finalDestination: "elimination"
  },
  {
    code: "030",
    description: "COORDENAÇÃO E CONTROLE",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Coordenação e Controle",
    finalDestination: "permanent"
  },
  {
    code: "040",
    description: "CORREIÇÃO E AUDITORIA",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Correição e Auditoria",
    finalDestination: "permanent"
  },
  {
    code: "050",
    description: "ADMINISTRAÇÃO DE PESSOAL",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Pessoal",
    finalDestination: "permanent"
  },
  {
    code: "050.01",
    description: "LEGISLAÇÃO DE PESSOAL",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Pessoal",
    finalDestination: "permanent"
  },
  {
    code: "050.02",
    description: "IDENTIFICAÇÃO FUNCIONAL",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Pessoal",
    finalDestination: "elimination"
  },
  {
    code: "050.03",
    description: "DIREITOS, OBRIGAÇÕES E VANTAGENS",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Pessoal",
    finalDestination: "permanent"
  },
  {
    code: "060",
    description: "ADMINISTRAÇÃO DE MATERIAL E PATRIMÔNIO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Material e Patrimônio",
    finalDestination: "elimination"
  },
  {
    code: "060.01",
    description: "NORMATIZAÇÃO. REGULAMENTAÇÃO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Material e Patrimônio",
    finalDestination: "permanent"
  },
  {
    code: "060.02",
    description: "ESPECIFICAÇÃO E PADRONIZAÇÃO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Material e Patrimônio",
    finalDestination: "permanent"
  },
  {
    code: "061",
    description: "CLASSIFICAÇÃO, CODIFICAÇÃO E CATALOGAÇÃO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Material e Patrimônio",
    finalDestination: "elimination"
  },
  {
    code: "062",
    description: "AQUISIÇÃO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Material e Patrimônio",
    finalDestination: "elimination"
  },
  {
    code: "070",
    description: "ADMINISTRAÇÃO ORÇAMENTÁRIA E FINANCEIRA",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração Orçamentária e Financeira",
    finalDestination: "elimination"
  },
  {
    code: "070.01",
    description: "NORMATIZAÇÃO. REGULAMENTAÇÃO",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração Orçamentária e Financeira",
    finalDestination: "permanent"
  },
  {
    code: "070.02",
    description: "OPERAÇÕES BANCÁRIAS",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração Orçamentária e Financeira",
    finalDestination: "elimination"
  },
  {
    code: "080",
    description: "ADMINISTRAÇÃO DE SERVIÇOS GERAIS",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Serviços Gerais",
    finalDestination: "elimination"
  },
  {
    code: "080.01",
    description: "TELECOMUNICAÇÕES",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Serviços Gerais",
    finalDestination: "elimination"
  },
  {
    code: "080.02",
    description: "MALOTE",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Administração de Serviços Gerais",
    finalDestination: "elimination"
  },
  {
    code: "090",
    description: "OUTROS ASSUNTOS REFERENTES À ADMINISTRAÇÃO GERAL",
    function: "ADMINISTRAÇÃO GERAL",
    subfunction: "Outros Assuntos",
    finalDestination: "pending"
  },
];

const finalDestinations = [
  { value: "permanent", label: "Guarda Permanente", color: "bg-green-500" },
  { value: "elimination", label: "Eliminação", color: "bg-red-500" },
  { value: "pending", label: "Avaliação Pendente", color: "bg-yellow-500" }
];

// Lista de ambientes disponíveis
const availableRooms = [
  "Arquivo Central",
  "Arquivo Setorial Administrativo", 
  "Arquivo Setorial Recursos Humanos",
  "Arquivo Setorial Financeiro",
  "Depósito A",
  "Depósito B", 
  "Sala de Consulta",
  "Reserva Técnica"
];

export function DocumentForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    archivalFund: "",
    classificationCode: "",
    documentType: "",
    customDocumentType: "",
    documentGenre: "textual",
    documentNumber: "",
    volume: "",
    title: "",
    description: "",
    producingSector: "",
    creationDate: "",
    closingDate: "",
    location: {
      room: "",
      moduleSet: "",
      module: "",
      shelf: "",
      shelf_level: "",
      boxPosition: "",
      box: "",
      oldBox: ""
    },
    finalDestination: "",
    registeredBy: "Carlos Leite",
    accessPoints: [] as string[],
    physicalState: "",
    observations: "",
    hasDigitalCopy: false,
    digitalDocumentPath: ""
  });

  const [newAccessPoint, setNewAccessPoint] = useState("");
  const [selectedClassification, setSelectedClassification] = useState<typeof classificationCodes[0] | null>(null);
  const [showCustomDocumentType, setShowCustomDocumentType] = useState(false);
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [rooms, setRooms] = useState<string[]>(availableRooms);
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [newRoom, setNewRoom] = useState("");

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev.location],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addAccessPoint = () => {
    if (newAccessPoint.trim() && !formData.accessPoints.includes(newAccessPoint.trim())) {
      setFormData(prev => ({
        ...prev,
        accessPoints: [...prev.accessPoints, newAccessPoint.trim()]
      }));
      setNewAccessPoint("");
    }
  };

  const removeAccessPoint = (accessPoint: string) => {
    setFormData(prev => ({
      ...prev,
      accessPoints: prev.accessPoints.filter(ap => ap !== accessPoint)
    }));
  };

  const handleClassificationChange = (value: string) => {
    handleInputChange("classificationCode", value);
    
    // Encontrar a classificação selecionada
    const classification = classificationCodes.find(code => code.code === value);
    setSelectedClassification(classification || null);
    
    // Definir destinação final automaticamente
    if (classification) {
      handleInputChange("finalDestination", classification.finalDestination);
    }
  };

  const addCustomDocumentType = () => {
    if (formData.customDocumentType.trim()) {
      const newType = formData.customDocumentType.trim();
      setCustomTypes(prev => [...prev, newType]);
      handleInputChange("documentType", newType);
      handleInputChange("customDocumentType", "");
      setShowCustomDocumentType(false);
      
      toast({
        title: "Tipo Documental Criado",
        description: `"${newType}" foi adicionado aos tipos disponíveis.`,
      });
    }
  };

  const addNewRoom = () => {
    if (newRoom.trim() && !rooms.includes(newRoom.trim())) {
      const newRoomName = newRoom.trim();
      setRooms(prev => [...prev, newRoomName]);
      handleInputChange("location.room", newRoomName);
      setNewRoom("");
      setShowNewRoomForm(false);
      
      toast({
        title: "Ambiente Cadastrado",
        description: `"${newRoomName}" foi adicionado aos ambientes disponíveis.`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.archivalFund || !formData.classificationCode || !formData.documentType || !formData.title) {
      toast({
        title: "Erro de Validação",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    console.log("Documento cadastrado:", formData);
    
    toast({
      title: "Documento Cadastrado",
      description: "O documento foi cadastrado com sucesso no acervo.",
    });

    // Reset form
    setFormData({
      archivalFund: "",
      classificationCode: "",
      documentType: "",
      customDocumentType: "",
      documentGenre: "textual",
      documentNumber: "",
      volume: "",
      title: "",
      description: "",
      producingSector: "",
      creationDate: "",
      closingDate: "",
      location: {
        room: "",
        moduleSet: "",
        module: "",
        shelf: "",
        shelf_level: "",
        boxPosition: "",
        box: "",
        oldBox: ""
      },
      finalDestination: "",
      registeredBy: "Carlos Leite",
      accessPoints: [],
      physicalState: "",
      observations: "",
      hasDigitalCopy: false,
      digitalDocumentPath: ""
    });
  };

  const allDocumentTypes = [...documentTypes, ...customTypes];

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Cadastro de Documento Analógico
            </CardTitle>
            <CardDescription className="text-sm">
              Registre um novo documento físico no acervo da organização
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Fundo Arquivístico e Código de Classificação */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="archivalFund" className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4" />
                    Fundo Arquivístico *
                  </Label>
                  <Select value={formData.archivalFund} onValueChange={(value) => handleInputChange("archivalFund", value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Selecione o fundo arquivístico" />
                    </SelectTrigger>
                    <SelectContent>
                      {archivalFunds.map((fund) => (
                        <SelectItem key={fund} value={fund} className="text-sm">{fund}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Fundos de órgãos extintos ou incorporados à organização atual
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classificationCode" className="flex items-center gap-2 text-sm">
                    <Hash className="h-4 w-4" />
                    Código de Classificação *
                  </Label>
                  <SearchableSelect
                    value={formData.classificationCode}
                    onValueChange={handleClassificationChange}
                    placeholder="Selecione o código de classificação"
                    searchPlaceholder="Buscar por código ou descrição..."
                    options={classificationCodes.map(code => ({
                      value: code.code,
                      label: `${code.code} - ${code.description}`
                    }))}
                  />
                  {selectedClassification && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-900">
                            {selectedClassification.code} - {selectedClassification.description}
                          </p>
                          <p className="text-blue-700 mt-1">
                            <strong>Função:</strong> {selectedClassification.function}
                          </p>
                          <p className="text-blue-700">
                            <strong>Subfunção:</strong> {selectedClassification.subfunction}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tipo Documental */}
              <div className="space-y-2">
                <Label htmlFor="documentType" className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  Tipo Documental *
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-medium">Padrão:</p>
                        <p>Espécie + Ação + Atividade + Complemento (opcional)</p>
                        <p className="mt-2 font-medium">Exemplo:</p>
                        <p>Relatório de Avaliação de Concessão de Benefícios</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                {!showCustomDocumentType ? (
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select value={formData.documentType} onValueChange={(value) => handleInputChange("documentType", value)}>
                        <SelectTrigger className="flex-1 text-sm">
                          <SelectValue placeholder="Selecione o tipo documental" />
                        </SelectTrigger>
                        <SelectContent>
                          {allDocumentTypes.map((type) => (
                            <SelectItem key={type} value={type} className="text-sm">{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowCustomDocumentType(true)}
                        className="flex items-center gap-2 text-sm w-full sm:w-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Criar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mb-2">
                      <strong>Padrão:</strong> Espécie + Ação + Atividade + Complemento (opcional)
                      <br />
                      <strong>Exemplo:</strong> Relatório de Avaliação de Concessão de Benefícios
                    </div>
                    <div className="flex flex-col gap-2">
                      <Input
                        placeholder="Ex: Relatório de Avaliação de Concessão de Benefícios"
                        value={formData.customDocumentType}
                        onChange={(e) => handleInputChange("customDocumentType", e.target.value)}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button type="button" onClick={addCustomDocumentType} size="sm" className="flex-1">
                          Adicionar
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCustomDocumentType(false)}
                          size="sm"
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gênero Documental */}
              <div className="space-y-2">
                <Label htmlFor="documentGenre" className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  Gênero Documental
                </Label>
                <Select value={formData.documentGenre} onValueChange={(value) => handleInputChange("documentGenre", value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione o gênero documental" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentGenres.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value} className="text-sm">{genre.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Número do Documento e Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentNumber" className="text-sm">Nº do Documento</Label>
                  <Input
                    id="documentNumber"
                    placeholder="Ex: 001/2024"
                    value={formData.documentNumber}
                    onChange={(e) => handleInputChange("documentNumber", e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volume" className="text-sm">Volume</Label>
                  <Input
                    id="volume"
                    placeholder="Ex: Vol. 1"
                    value={formData.volume}
                    onChange={(e) => handleInputChange("volume", e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Título e Descrição */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm">Título/Assunto *</Label>
                  <Input
                    id="title"
                    placeholder="Digite o título ou assunto principal do documento"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descrição detalhada do conteúdo do documento"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Metadados */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="producingSector" className="text-sm">
                    Setor Produtor
                  </Label>
                  <Input
                    id="producingSector"
                    placeholder="Digite o nome do setor produtor"
                    value={formData.producingSector}
                    onChange={(e) => handleInputChange("producingSector", e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Campo livre para documentos históricos que sofreram modificações organizacionais
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creationDate" className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      Data de Criação
                    </Label>
                    <Input
                      id="creationDate"
                      type="date"
                      value={formData.creationDate}
                      onChange={(e) => handleInputChange("creationDate", e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closingDate" className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      Data de Encerramento
                    </Label>
                    <Input
                      id="closingDate"
                      type="date"
                      value={formData.closingDate}
                      onChange={(e) => handleInputChange("closingDate", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Localização Física */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                    Localização Física
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="room" className="text-sm">Sala/Ambiente</Label>
                      {!showNewRoomForm ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Select value={formData.location.room} onValueChange={(value) => handleInputChange("location.room", value)}>
                            <SelectTrigger className="flex-1 text-sm">
                              <SelectValue placeholder="Selecione o ambiente" />
                            </SelectTrigger>
                            <SelectContent>
                              {rooms.map((room) => (
                                <SelectItem key={room} value={room} className="text-sm">{room}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowNewRoomForm(true)}
                            className="flex items-center gap-2 text-sm w-full sm:w-auto"
                          >
                            <Plus className="h-4 w-4" />
                            Novo
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex flex-col gap-2">
                            <Input
                              placeholder="Digite o nome do novo ambiente"
                              value={newRoom}
                              onChange={(e) => setNewRoom(e.target.value)}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button type="button" onClick={addNewRoom} size="sm" className="flex-1">
                                Adicionar
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowNewRoomForm(false)}
                                size="sm"
                                className="flex-1"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="moduleSet" className="text-sm">Conjunto do Módulo</Label>
                      <Input
                        id="moduleSet"
                        placeholder="Ex: Setor A"
                        value={formData.location.moduleSet}
                        onChange={(e) => handleInputChange("location.moduleSet", e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="module" className="text-sm">Módulo</Label>
                      <Input
                        id="module"
                        placeholder="Ex: A1"
                        value={formData.location.module}
                        onChange={(e) => handleInputChange("location.module", e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shelf" className="text-sm">Estante</Label>
                      <Input
                        id="shelf"
                        placeholder="Ex: 01"
                        value={formData.location.shelf}
                        onChange={(e) => handleInputChange("location.shelf", e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shelf_level" className="text-sm">Prateleira</Label>
                      <Input
                        id="shelf_level"
                        placeholder="Ex: 03"
                        value={formData.location.shelf_level}
                        onChange={(e) => handleInputChange("location.shelf_level", e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="boxPosition" className="text-sm">Posição da Caixa</Label>
                      <Input
                        id="boxPosition"
                        placeholder="Ex: 001"
                        value={formData.location.boxPosition}
                        onChange={(e) => handleInputChange("location.boxPosition", e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="box" className="flex items-center gap-1 text-sm">
                        <Archive className="h-4 w-4" />
                        Caixa Atual
                      </Label>
                      <Input
                        id="box"
                        placeholder="Ex: 001"
                        value={formData.location.box}
                        onChange={(e) => handleInputChange("location.box", e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="oldBox" className="flex items-center gap-1 text-sm">
                        <Archive className="h-4 w-4" />
                        Caixa Antiga
                      </Label>
                      <Input
                        id="oldBox"
                        placeholder="Ex: CX-2020-015"
                        value={formData.location.oldBox}
                        onChange={(e) => handleInputChange("location.oldBox", e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Destinação Final (automática) */}
              <div className="space-y-2">
                <Label htmlFor="finalDestination" className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  Destinação Final (Automática)
                </Label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {formData.finalDestination ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        finalDestinations.find(d => d.value === formData.finalDestination)?.color || "bg-gray-400"
                      }`}></div>
                      <span className="text-sm font-medium">
                        {finalDestinations.find(d => d.value === formData.finalDestination)?.label || "Não definido"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Será definida automaticamente com base no código de classificação
                    </span>
                  )}
                </div>
              </div>

              {/* Documento Digitalizado */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="hasDigitalCopy"
                    type="checkbox"
                    checked={formData.hasDigitalCopy}
                    onChange={(e) => handleInputChange("hasDigitalCopy", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="hasDigitalCopy" className="flex items-center gap-2 text-sm">
                    <FileImage className="h-4 w-4" />
                    Documento possui cópia digitalizada
                  </Label>
                </div>

                {formData.hasDigitalCopy && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="digitalDocumentPath" className="text-sm">Caminho do Arquivo Digital</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="digitalDocumentPath"
                        placeholder="Caminho ou URL do documento digitalizado"
                        value={formData.digitalDocumentPath}
                        onChange={(e) => handleInputChange("digitalDocumentPath", e.target.value)}
                        className="flex-1 text-sm"
                      />
                      <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pontos de Acesso */}
              <div className="space-y-2">
                <Label className="text-sm">Pontos de Acesso</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Digite um ponto de acesso"
                    value={newAccessPoint}
                    onChange={(e) => setNewAccessPoint(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAccessPoint())}
                    className="flex-1 text-sm"
                  />
                  <Button type="button" onClick={addAccessPoint} variant="outline" className="w-full sm:w-auto">
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.accessPoints.map((accessPoint) => (
                    <Badge key={accessPoint} variant="secondary" className="cursor-pointer text-xs" onClick={() => removeAccessPoint(accessPoint)}>
                      {accessPoint} ×
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Termos para facilitar a busca e recuperação do documento
                </p>
              </div>

              {/* Estado Físico e Observações */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="physicalState" className="text-sm">Estado de Conservação</Label>
                  <Select value={formData.physicalState} onValueChange={(value) => handleInputChange("physicalState", value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent" className="text-sm">Excelente</SelectItem>
                      <SelectItem value="good" className="text-sm">Bom</SelectItem>
                      <SelectItem value="regular" className="text-sm">Regular</SelectItem>
                      <SelectItem value="poor" className="text-sm">Ruim</SelectItem>
                      <SelectItem value="critical" className="text-sm">Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registeredBy" className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    Cadastrado por
                  </Label>
                  <Input
                    id="registeredBy"
                    value={formData.registeredBy}
                    disabled
                    className="bg-gray-50 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations" className="text-sm">Observações</Label>
                <Textarea
                  id="observations"
                  placeholder="Observações adicionais sobre o documento"
                  value={formData.observations}
                  onChange={(e) => handleInputChange("observations", e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex items-center gap-2 w-full sm:w-auto">
                  <Save className="h-4 w-4" />
                  Cadastrar Documento
                </Button>
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Limpar Formulário
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
