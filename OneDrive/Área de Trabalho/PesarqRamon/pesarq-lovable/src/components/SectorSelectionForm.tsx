import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, ArrowLeft, User, MapPin, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SearchableSelect } from "./SearchableSelect";

interface SectorSelectionFormProps {
  onNavigateBack?: () => void;
  isPublicForm?: boolean;
  sectorId?: string | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  selectedState: string;
  selectedSector: string;
  customSector: string;
  hasProblems: string;
  hasDocuments: string;
  storageLocation: string;
  documentQuantity: string;
  documentCondition: string;
  storageConditions: string;
  stillProduces: string;
  consultationFrequency: string;
  images: File[];
  termsAccepted: boolean;
}

export function SectorSelectionForm({ onNavigateBack, isPublicForm = false, sectorId }: SectorSelectionFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    selectedState: '',
    selectedSector: '',
    customSector: '',
    hasProblems: '',
    hasDocuments: '',
    storageLocation: '',
    documentQuantity: '',
    documentCondition: '',
    storageConditions: '',
    stillProduces: '',
    consultationFrequency: '',
    images: [],
    termsAccepted: false
  });

  const states = [
    { value: "AC", label: "Acre (AC)" },
    { value: "AL", label: "Alagoas (AL)" },
    { value: "AP", label: "Amapá (AP)" },
    { value: "AM", label: "Amazonas (AM)" },
    { value: "BA", label: "Bahia (BA)" },
    { value: "CE", label: "Ceará (CE)" },
    { value: "DF", label: "Distrito Federal (DF)" },
    { value: "ES", label: "Espírito Santo (ES)" },
    { value: "GO", label: "Goiás (GO)" },
    { value: "MA", label: "Maranhão (MA)" },
    { value: "MT", label: "Mato Grosso (MT)" },
    { value: "MS", label: "Mato Grosso do Sul (MS)" },
    { value: "MG", label: "Minas Gerais (MG)" },
    { value: "PA", label: "Pará (PA)" },
    { value: "PB", label: "Paraíba (PB)" },
    { value: "PR", label: "Paraná (PR)" },
    { value: "PE", label: "Pernambuco (PE)" },
    { value: "PI", label: "Piauí (PI)" },
    { value: "RJ", label: "Rio de Janeiro (RJ)" },
    { value: "RN", label: "Rio Grande do Norte (RN)" },
    { value: "RS", label: "Rio Grande do Sul (RS)" },
    { value: "RO", label: "Rondônia (RO)" },
    { value: "RR", label: "Roraima (RR)" },
    { value: "SC", label: "Santa Catarina (SC)" },
    { value: "SP", label: "São Paulo (SP)" },
    { value: "SE", label: "Sergipe (SE)" },
    { value: "TO", label: "Tocantins (TO)" }
  ];

  const sectorsByState = {
    "RJ": [
      "SECERJ/MS - Secretaria-Executiva da Comissão de Ética do Ministério da Saúde no Rio de Janeiro",
      "DICOR - Divisão de Apoio à Corregedoria no Rio de Janeiro",
      "SEAUD/RJ - Serviço Nacional de Auditoria do SUS no Rio de Janeiro",
      "CCMS - Centro Cultural do Ministério da Saúde",
      "DIADOCRJ - Divisão de Assistência e Gerenciamento Documental no Rio de Janeiro",
      "SEMS/RJ - Superintendência Estadual do Ministério da Saúde no Rio de Janeiro",
      "SELOA/RJ - Serviço de Logística Administrativa",
      "SEGEP/RJ - Serviço de Gestão de Pessoas",
      "SEAI/RJ - Seção de Ativos e Inativos RJ",
      "SEINP/RJ - Serviço de Articulação Interfederativa e Participativa",
      "DITRE/RJ - Divisão de Transferência de Recursos",
      "DGH - DEPARTAMENTO DE GESTÃO HOSPITALAR NO ESTADO DO RIO DE JANEIRO",
      "COPLAC/DGH - Coordenação de Planejamento e Controle Interno",
      "COGAD/DGH - Coordenação de Gestão Técnica e Administrativa",
      "CORF/DGH - Coordenação de Orçamento e Finanças",
      "COATES/DGH - Coordenação de Atenção à Saúde",
      "COMH/DGH - Coordenação de Modernização Hospitalar",
      "CODCOM/DGH - Coordenação de Compras e Contratos",
      "COALM/DGH - Coordenação de Gestão de Almoxarifado e Patrimônio",
      "CGAD/DGH - Coordenação-Geral de Administração",
      "DIMOL/DGH - Divisão de Monitoramento e Controle Logístico",
      "DIMOF/DGH - Divisão de Monitoramento Orçamentário e Financeiro",
      "COGEP/DGH - Coordenação de Gestão de Pessoas",
      "CGASS/DGH - Coordenação-Geral de Assistência",
      "CGGH - Coordenação-Geral de Governança Hospitalar",
      "HFI - Hospital Federal de Ipanema",
      "SECONT/HFI - Serviço de Controle e Contratos",
      "SEINFRA/HFI - Serviço de Infraestrutura e Patrimônio",
      "DIOF/HFI - Divisão de Orçamento e Finanças",
      "DIGEP/HFI - Divisão de Gestão de Pessoas",
      "DISUL/HFI - Divisão de Suprimentos e Logística",
      "SECOMP/HFI - Setor de Compras",
      "CASS/HFI - Coordenação Assistencial",
      "SEFARM/HFI - Serviço de Assistência Farmacêutica",
      "SEDIT/HFI - Serviço de Apoio Diagnóstico e Terapêutico",
      "DIENF/HFI - Divisão de Enfermagem",
      "HFL - Hospital Federal da Lagoa",
      "SECONT/HFL - Serviço de Controle e Contratos",
      "SEINFRA/HFL - Serviço de Infraestrutura e Patrimônio",
      "DIOF/HFL - Divisão de Orçamento e Finanças",
      "DIGEP/HFL - Divisão de Gestão de Pessoas",
      "DISUL/HFL - Divisão de Suprimentos e Logística",
      "SECOMP/HFL - Setor de Compras",
      "CASS/HFL - Coordenação Assistencial",
      "SEFARM/HFL - Serviço de Assistência Farmacêutica",
      "SEDIT/HFL - Serviço de Apoio Diagnóstico e Terapêutico",
      "DIENF/HFL - Divisão de Enfermagem",
      "HFA - Hospital Federal do Andaraí",
      "SEFARM/HFA - Serviço de Assistência Farmacêutica",
      "SEDIT/HFA - Serviço de Apoio Diagnóstico e Terapêutico",
      "DIOF/HFA - Divisão de Orçamento e Finanças",
      "DIGEP/HFA - Divisão de Gestão de Pessoas",
      "DISUL/HFA - Divisão de Suprimentos e Logística",
      "SECOMP/HFA - Setor de Compras",
      "COENF/HFA - Coordenação de Enfermagem",
      "HFCF - Hospital Federal Cardoso Fontes",
      "SEINFRA/HFCF - Serviço de Infraestrutura e Patrimônio",
      "SEFARM/HFCF - Serviço de Assistência Farmacêutica",
      "SEDIT/HFCF - Serviço de Apoio Diagnóstico e Terapêutico",
      "DIOF/HFCF - Divisão de Orçamento e Finanças",
      "DIGEP/HFCF - Divisão de Gestão de Pessoas",
      "DISUL/HFCF - Divisão de Suprimentos e Logística",
      "SECOMP/HFCF - Setor de Compras",
      "HFSE - Hospital Federal dos Servidores do Estado",
      "SECONT/HFSE - Serviço de Controle e Contratos",
      "SEINFRA/HFSE - Serviço de Infraestrutura e Patrimônio",
      "DIOF/HFSE - Divisão de Orçamento e Finanças",
      "DISUL/HFSE - Divisão de Suprimentos e Logística",
      "SECOMP/HFSE - Setor de Compras",
      "DIGEP/HFSE - Divisão de Gestão de Pessoas",
      "CASS/HFSE - Coordenação Assistencial",
      "SEFARM/HFSE - Serviço de Assistência Farmacêutica",
      "SEDIT/HFSE - Serviço de Apoio Diagnóstico e Terapêutico",
      "DIMEA/HFSE - Divisão Médico-Assistencial",
      "COENF/HFSE - Coordenação de Enfermagem",
      "HFB - Hospital Federal de Bonsucesso",
      "SERISC/HFB - Serviço de Gerência de Risco",
      "SECONT/HFB - Serviço de Controle e Contratos",
      "SEINFRA/HFB - Serviço de Infraestrutura e Patrimônio",
      "DIOF/HFB - Divisão de Orçamento e Finanças",
      "DISUL/HFB - Divisão de Suprimentos e Logística",
      "SECOMP/HFB - Setor de Compras",
      "DIGEP/HFB - Divisão de Gestão de Pessoas",
      "CASS/HFB - Coordenação Assistencial",
      "SEDIT/HFB - Serviço de Apoio Diagnóstico e Terapêutico",
      "SEFARM/HFB - Serviço de Assistência Farmacêutica",
      "DIMEA/HFB - Divisão Médico-Assistencial",
      "DIEME/HFB - Divisão de Emergência",
      "COENF/HFB - Coordenação de Enfermagem",
      "INC - INSTITUTO NACIONAL DE CARDIOLOGIA",
      "SEGEST - Serviço de Apoio a Gestão da Integridade",
      "DIGEP/INC - Divisão de Gestão de Pessoas",
      "SEAPE/INC - Serviço de Administração de Pessoal",
      "COPLAN/INC - Coordenação de Planejamento",
      "COAD/INC - Coordenação de Administração",
      "DISUP/INC - Divisão de Suprimentos",
      "SEBAST - Serviço de Abastecimento",
      "SORFIN - Serviço de Orçamento e Finanças",
      "SEHOT/INC - Serviço de Hotelaria Hospitalar",
      "CODEP/INC - Coordenação de Ensino e Pesquisa",
      "SEENS - Seção de Ensino",
      "COAS/INC - Coordenação Assistencial",
      "DICIRU/INC - Divisão de Cirurgia",
      "DICARDI/INC - Divisão de Cardiointensiva",
      "DIPEDIATRIA - Divisão de Cardiologia da Criança e Adolescente",
      "DICLIN - Divisão Clínica",
      "DIST - Divisão de Serviços Técnicos",
      "DIPROT - Divisão de Procedimentos Terapêuticos",
      "DIENF/INC - Divisão de Enfermagem",
      "SEAN - Serviço de Anestesiologia",
      "INTO - INSTITUTO NACIONAL DE TRAUMATOLOGIA E ORTOPEDIA",
      "DITEC/INTO - Divisão de Tecnologia da Informação",
      "DICOI/INTO - Divisão de Controle Interno",
      "SERJU/INTO - Serviço Jurídico",
      "COAS/INTO - Coordenação Assistencial",
      "DITRO/INTO - Divisão de Traumato-Ortopedia",
      "DIENF/INTO - Divisão de Enfermagem",
      "DISTA/INTO - Divisão de Serviços Técnicos Auxiliares",
      "DIMEA/INTO - Divisão Médico-Assistencial",
      "COENPI/INTO - Coordenação de Ensino, Pesquisa e Inovação",
      "DIENP/INTO - Divisão de Ensino e Pesquisa",
      "COAGE/INTO - Coordenação de Administração Geral",
      "DIOF/INTO - Divisão de Orçamento e Finanças",
      "DIRGH/INTO - Divisão de Gerenciamento de Hotelaria Hospitalar",
      "DINFRA/INTO - Divisão de Infraestrutura",
      "DIRPI/INTO - Divisão de Planejamento, Instrução e Formalização de Processos",
      "DICONV/INTO - Divisão de Contratos e Convênios",
      "DILOGH/INTO - Divisão de Suprimentos e Logística Hospitalar",
      "COAPE/INTO - Coordenação de Administração de Pessoas",
      "COOPE/INTO - Coordenação de Projetos Especiais",
      "COPLAN/INTO - Coordenação de Planejamento",
      "INCA - INSTITUTO NACIONAL DE CÂNCER",
      "REDOME/INCA - Serviço de Registro Nacional de Doadores Voluntários de Medula Óssea",
      "SECII/INCA - Serviço de Controle Interno e Integridade",
      "DIPLAN/INCA - Divisão de Planejamento",
      "GAB/INCA - Gabinete",
      "SEAD/INCA - Serviço de Apoio Administrativo",
      "SECOMSO/INCA - Serviço de Comunicação Social",
      "SETI/INCA - Serviço de Tecnologia da Informação",
      "COAGE/INCA - Coordenação de Administração Geral",
      "SEAL/INCA - Serviço de Apoio às Licitações",
      "SEAD/COAGE - Serviço de Apoio Administrativo e Operacional",
      "SECLIN/INCA - Serviço de Engenharia Clínica",
      "DIOF/INCA - Divisão Orçamentária e Financeira",
      "SECONT/INCA - Setor de Contabilidade",
      "DISUP/INCA - Divisão de Suprimentos",
      "SECONV/INCA - Serviço de Contratos e Convênios",
      "SEABA/INCA - Serviço Central de Abastecimento",
      "SECOM/INCA - Serviço de Compras",
      "SEPAT/INCA - Serviço de Patrimônio",
      "DIENGI/INCA - Divisão de Engenharia e Infraestrutura",
      "SEOBI/INCA - Serviço de Obras e Instalações",
      "COGEP/INCA - Coordenação de Gestão de Pessoas",
      "DIAP/INCA - Divisão de Administração de Pessoal",
      "SEPRO/INCA - Serviço de Processamento de Folha de Pagamento",
      "SEBENC/INCA - Serviço de Benefícios, Controle de Frequência e Cadastro Funcional",
      "DIDEP/INCA - Divisão de Desenvolvimento de Pessoas",
      "DISAT/INCA - Divisão de Saúde do Trabalhador",
      "SESMT/INCA - Setor Especializado em Engenharia de Segurança e Medicina do Trabalho",
      "CPQI/INCA - Coordenação de Pesquisa e Inovação",
      "SEAGEP/INCA - Setor de Administração e Gestão de Projetos",
      "DIPETEC/INCA - Divisão de Pesquisa Clínica e Desenvolvimento Tecnológico",
      "DIPBEX/INCA - Divisão de Pesquisa Básica e Experimental",
      "DIPET/INCA - Divisão de Pesquisa Translacional e Aplicação Diagnóstica",
      "COENS/INCA - Coordenação de Ensino",
      "DIESS/INCA - Divisão de Ensino Stricto Sensu",
      "DELST/INCA - Divisão de Ensino Lato Sensu e Técnico",
      "SEITEC/INCA - Serviço de Educação e Informação Técnico-Científica",
      "SEGAC/INCA - Serviço de Gestão Acadêmica",
      "CONPREV/INCA - Coordenação de Prevenção e Vigilância",
      "DIDEPRE/INCA - Divisão de Detecção Precoce e Apoio à Organização de Rede",
      "DIVASI/INCA - Divisão de Vigilância e Análise de Situação",
      "DITAB/INCA - Divisão de Controle do Tabagismo e Outros Fatores de Risco",
      "DIPEP/INCA - Divisão de Pesquisa Populacional",
      "DATS/INCA - Divisão de Avaliação de Tecnologias em Saúde",
      "COAS/INCA - Coordenação de Assistência",
      "HEMO/INCA - Serviço de Hemoterapia",
      "SEFARM/INCA - Serviço de Farmácia Clínica",
      "DIPAT/INCA - Divisão de Anatomia Patológica",
      "SECLIMOR/INCA - Setor de Diagnóstico Clínico-Morfológico",
      "SITEC/INCA - Setor Integrado de Tecnologia em Citopatologia",
      "DILABESP/INCA - Divisão de Laboratórios Especializados",
      "CEMO - Centro de Transplante de Medula Óssea",
      "SENF/CEMO - Serviço de Enfermagem",
      "SEAM/CEMO - Setor de Assistência Médica",
      "HC-I/INCA - Hospital do Câncer - Unidade I",
      "SEINFEC/HCI - Setor de Controle de Infecção",
      "DIHOSP/HCI - Divisão de Administração Hospitalar",
      "DCIR/HCI - Divisão Cirúrgica",
      "URO/HCI - Setor de Urologia",
      "ABD/HCI - Setor de Cirurgia Abdômino Pélvica",
      "SEPED/HCI - Setor de Cirurgia Oncológica Pediátrica",
      "TORAX/HCI - Setor de Tórax",
      "NEURO/HCI - Setor de Neurocirurgia",
      "CCP/HCI - Setor de Cirurgia de Cabeça e Pescoço",
      "PLAST/HCI - Setor de Cirurgia Plástica Reparadora",
      "SECIR/HCI - Setor de Centro Cirúrgico",
      "ANEST/HCI - Serviço de Anestesiologia",
      "DITEC/HCI - Divisão Técnico-Assistencial",
      "FARM/HCI - Setor de Farmácia Hospitalar",
      "SENUT/HCI - Setor de Nutrição e Dietética",
      "SEREB/HCI - Setor de Reabilitação",
      "PSICO/HCI - Setor de Psicologia",
      "SESOC/HCI - Setor de Serviço Social",
      "DICLI/HCI - Divisão Clínica",
      "SEONCOPEDC/HCI - Setor de Oncologia Pediátrica",
      "DERMA/HCI - Setor de Dermatologia",
      "CLIMED/HCI - Setor de Clínica Médica",
      "SEHEMAT/HCI - Setor de Hematologia",
      "SEONCO/HCI - Setor de Oncologia Clínica",
      "SEFISICA/HCI - Setor de Física Médica",
      "SEPROAT/HCI - Setor de Pronto Atendimento",
      "SERADIOT/HCI - Serviço de Radioterapia",
      "SETI/HCI - Serviço de Terapia Intensiva",
      "DIAG/HCI - Divisão de Diagnóstico",
      "SEMENUC/HCI - Serviço de Medicina Nuclear",
      "ENDO/HCI - Setor de Endoscopia",
      "PATCLI/HCI - Serviço de Patologia Clínica",
      "SEDIM/HCI - Serviço de Diagnóstico por Imagem",
      "DIENF/HCI - Divisão de Enfermagem",
      "ENCEC/HCI - Serviço de Enfermagem em Centro Cirúrgico",
      "ENPEX/HCI - Serviço de Enfermagem em Procedimentos Externos",
      "ENHOSP/HCI - Serviço de Enfermagem Hospitalar",
      "HC-II/INCA - Hospital do Câncer - Unidade II",
      "SEADM/HCII - Serviço de Administração Hospitalar",
      "DIMED/HCII - Divisão Médica",
      "SEONCO/HCII - Setor de Oncologia Clínica",
      "SEPATCLI/HCII - Setor de Patologia Clínica",
      "SEDIM/HCII - Setor de Diagnóstico por Imagem",
      "SENDOC/HCII - Setor de Endoscopia",
      "SETOC/HCII - Setor de Tecido Ósseo e Conectivo",
      "ANEST/HCII - Setor de Anestesiologia",
      "STI/HCII - Setor de Terapia Intensiva",
      "SEGINECO/HCII - Setor de Ginecologia",
      "DITEC/HCII - Divisão Técnico-Assistencial",
      "SOC/HCII - Setor de Serviço Social",
      "NUT/HCII - Setor de Nutrição e Dietética",
      "DIENF/HCII - Divisão de Enfermagem",
      "HC-III/INCA - Hospital do Câncer - Unidade III",
      "SEADM/HCIII - Serviço de Administração Hospitalar",
      "DIMED/HCIII - Divisão Médica",
      "SERADIOT/HCIII - Serviço de Radioterapia",
      "ONCO/HCIII - Setor de Oncologia Clínica",
      "ANEST/HCIII - Setor de Anestesiologia",
      "SEMAMA/HCIII - Setor de Mastologia",
      "DITEC/HCIII - Divisão Técnico-Assistencial",
      "PACLI/HCIII - Setor de Patologia Clínica",
      "SEDIM/HCIII - Setor de Diagnóstico por Imagem",
      "SOC/HCIII - Setor de Serviço Social",
      "SENUT/HCIII - Setor de Nutrição e Dietética",
      "DIENF/HCIII - Divisão de Enfermagem",
      "HC-IV/INCA - Hospital do Câncer - Unidade IV",
      "SEADM/HCIV - Serviço de Administração Hospitalar",
      "SEMED/HCIV - Serviço Médico",
      "DITEC/HCIV - Divisão Técnico-Assistencial",
      "DIENF/HCIV - Divisão de Enfermagem",
      "DIAPQ - Divisão de Administração do Parque Tecnológico",
      "DIAAD - Divisão de Administração e Disseminação de Dados",
      "CGRHF - Coordenação-Geral de Relacionamento com Hospitais Federais",
      "Outro setor"
    ],
    "AL": ["Secretaria de Estado da Saúde", "Secretaria de Estado da Educação", "Secretaria de Estado da Fazenda", "Outro setor"],
    "AP": ["Secretaria de Estado da Saúde", "Secretaria de Estado da Educação", "Secretaria de Estado da Fazenda", "Outro setor"],
    "AM": ["Secretaria de Estado da Saúde", "Secretaria de Estado da Educação", "Secretaria de Estado da Fazenda", "Outro setor"],
  };

  const getTotalSteps = () => {
    let steps = 4; // Base steps: Welcome, Identification, Sector Selection, Basic Questions
    if (formData.hasDocuments === "sim") {
      steps += 2; // Add steps for document-related questions and image upload
    } else {
      steps += 1; // Add step for remaining questions and image upload
    }
    return steps;
  };

  const totalSteps = getTotalSteps();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep === 0) {
      if (!termsAccepted) {
        toast({
          title: "Erro",
          description: "É necessário aceitar os termos e condições.",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 2) {
      if (!formData.selectedState || !formData.selectedSector) {
        toast({
          title: "Erro",
          description: "Selecione o estado e o setor.",
          variant: "destructive"
        });
        return;
      }
      if (formData.selectedSector === "Outro setor" && !formData.customSector.trim()) {
        toast({
          title: "Erro",
          description: "Digite o nome do setor personalizado.",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 3) {
      if (!formData.hasProblems || !formData.hasDocuments) {
        toast({
          title: "Erro",
          description: "Responda todas as perguntas obrigatórias.",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 4 && formData.hasDocuments === "sim") {
      if (!formData.storageLocation || !formData.documentQuantity || !formData.documentCondition || !formData.storageConditions) {
        toast({
          title: "Erro",
          description: "Responda todas as perguntas sobre documentos.",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting sector selection form:', formData);
    setIsSubmitted(true);
    toast({
      title: "Sucesso!",
      description: "Formulário de seleção de setores enviado com sucesso."
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + formData.images.length > 4) {
      toast({
        title: "Limite excedido",
        description: "Você pode enviar no máximo 4 imagens.",
        variant: "destructive"
      });
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const getAvailableSectors = () => {
    const sectors = sectorsByState[formData.selectedState as keyof typeof sectorsByState] || [];
    return sectors.map(sector => ({
      value: sector,
      label: sector
    }));
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-2xl mb-4">Formulário Enviado!</CardTitle>
            <CardDescription className="text-lg mb-6">
              Obrigado pela sua participação. Suas informações foram registradas e serão analisadas para determinar os setores prioritários para diagnóstico.
            </CardDescription>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Resumo da Submissão:</h4>
              <p><strong>Respondente:</strong> {formData.firstName} {formData.lastName}</p>
              <p><strong>Estado:</strong> {states.find(s => s.value === formData.selectedState)?.label}</p>
              <p><strong>Setor:</strong> {formData.selectedSector === "Outro setor" ? formData.customSector : formData.selectedSector}</p>
              <p><strong>Imagens enviadas:</strong> {formData.images.length}</p>
              <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            <Button onClick={onNavigateBack} className="mt-6">
              Voltar aos Diagnósticos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCurrentStepContent = () => {
    if (currentStep === 0) {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Página de Boas-vindas</h3>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-3">Bem-vindo ao Diagnóstico de Seleção de Setores</h4>
            <p className="text-sm text-gray-700 mb-4">
              Este formulário tem como objetivo identificar os setores que mais necessitam de um diagnóstico arquivístico aprofundado. 
              Suas respostas são fundamentais para priorizar as ações de melhoria na gestão documental da sua organização.
            </p>
            <p className="text-sm text-gray-700">
              O preenchimento levará aproximadamente 10 minutos e todas as informações serão tratadas de forma confidencial.
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => 
                setTermsAccepted(checked as boolean)
              }
            />
            <Label htmlFor="terms" className="text-sm">
              Eu concordo com os{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-blue-600 hover:text-blue-800 underline">
                    Termos e Condições
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Termos e Condições</DialogTitle>
                    <DialogDescription asChild>
                      <div className="text-left space-y-4 pt-4">
                        <p>Prezado(a) Participante,</p>
                        
                        <p>
                          Você foi convidado(a) a colaborar com o projeto "Diagnóstico da Situação Arquivística da sua Organização", 
                          desenvolvido em parceria com a Universidade de Brasília (UnB).
                        </p>

                        <div>
                          <strong>Objetivo:</strong> Coletar dados para aprimorar a gestão, preservação e acesso a documentos do Ibama. 
                          A participação é voluntária e essencial.
                        </div>

                        <div>
                          <strong>Procedimento:</strong> Após o preenchimento do formulário, seu setor será avaliado por uma escala de gravidade. 
                          Setores com maior necessidade poderão ser selecionados para as próximas etapas.
                        </div>

                        <div>
                          <strong>Confidencialidade:</strong> Os dados serão protegidos conforme a Lei nº 13.709/2018 (LGPD) e utilizados 
                          exclusivamente para fins de gestão documental do Ibama, sem divulgação individualizada.
                        </div>

                        <div>
                          <strong>Contato:</strong> Em caso de dúvidas, contate a equipe do setor de arquivo.
                        </div>

                        <p>
                          Ao participar, você confirma estar ciente da importância da sua contribuição e concorda com os termos apresentados.
                        </p>

                        <p className="font-semibold">Agradecemos sua participação.</p>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              .
            </Label>
          </div>
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Identificação
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Primeiro Nome *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Digite seu primeiro nome"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Último Nome *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Digite seu último nome"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Número de telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Seleção de Estado e Setor
          </h3>
          
          <div>
            <Label htmlFor="state">Selecione seu estado *</Label>
            <SearchableSelect
              value={formData.selectedState}
              onValueChange={(value) => setFormData(prev => ({ ...prev, selectedState: value, selectedSector: '', customSector: '' }))}
              placeholder="Selecione um estado"
              options={states}
              searchPlaceholder="Buscar estado..."
            />
          </div>

          {formData.selectedState && (
            <div>
              <Label htmlFor="sector">
                Selecione o nome do setor em {states.find(s => s.value === formData.selectedState)?.label} *
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                Observação: Caso seu setor não apareça na lista, escolha a opção 'Outro setor' e informe o nome manualmente.
              </p>
              <SearchableSelect
                value={formData.selectedSector}
                onValueChange={(value) => setFormData(prev => ({ ...prev, selectedSector: value }))}
                placeholder="Selecione um setor"
                options={getAvailableSectors()}
                searchPlaceholder="Buscar setor..."
              />
            </div>
          )}

          {formData.selectedSector === "Outro setor" && (
            <div>
              <Label htmlFor="customSector">Nome do setor *</Label>
              <Input
                id="customSector"
                value={formData.customSector}
                onChange={(e) => setFormData(prev => ({ ...prev, customSector: e.target.value }))}
                placeholder="Digite o nome do seu setor"
              />
            </div>
          )}
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Avaliação Inicial do Setor
          </h3>
          
          <div>
            <Label className="text-base font-medium">
              Você considera que seu Setor enfrenta problemas relacionados à gestão, preservação e/ou acesso aos documentos? *
            </Label>
            <RadioGroup
              value={formData.hasProblems}
              onValueChange={(value) => setFormData(prev => ({ ...prev, hasProblems: value }))}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nenhum" id="nenhum" />
                <Label htmlFor="nenhum">Não há Problemas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pequenos" id="pequenos" />
                <Label htmlFor="pequenos">Desafios Pequenos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderados" id="moderados" />
                <Label htmlFor="moderados">Desafios Moderados</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="significativos" id="significativos" />
                <Label htmlFor="significativos">Desafios Significativos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="criticos" id="criticos" />
                <Label htmlFor="criticos">Desafios Críticos</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">
              O seu setor guarda documentos em papel dentro das salas de trabalho ou em áreas próximas? *
            </Label>
            <RadioGroup
              value={formData.hasDocuments}
              onValueChange={(value) => setFormData(prev => ({ ...prev, hasDocuments: value }))}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="doc-sim" />
                <Label htmlFor="doc-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="doc-nao" />
                <Label htmlFor="doc-nao">Não</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      );
    }

    if (currentStep === 4 && formData.hasDocuments === "sim") {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações sobre Documentos em Papel
          </h3>

          <div>
            <Label className="text-base font-medium">
              Qual é a característica do(s) ambiente(s) onde o seu setor guarda os documentos? *
            </Label>
            <RadioGroup
              value={formData.storageLocation}
              onValueChange={(value) => setFormData(prev => ({ ...prev, storageLocation: value }))}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="proprio" id="proprio" />
                <Label htmlFor="proprio">Espaço da própria organização</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cedido" id="cedido" />
                <Label htmlFor="cedido">Espaço cedido/emprestado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alugado" id="alugado" />
                <Label htmlFor="alugado">Espaço alugado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="terceirizada" id="terceirizada" />
                <Label htmlFor="terceirizada">Empresa terceirizada de guarda</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">
              Qual é a quantidade aproximada de documentos em papel no seu setor (em número de caixas-arquivo)? *
            </Label>
            <RadioGroup
              value={formData.documentQuantity}
              onValueChange={(value) => setFormData(prev => ({ ...prev, documentQuantity: value }))}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ate-50" id="ate-50" />
                <Label htmlFor="ate-50">Até 50 caixas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="51-200" id="51-200" />
                <Label htmlFor="51-200">De 51 a 200 caixas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="201-500" id="201-500" />
                <Label htmlFor="201-500">De 201 a 500 caixas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="501-1000" id="501-1000" />
                <Label htmlFor="501-1000">De 501 a 1.000 caixas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1001-3000" id="1001-3000" />
                <Label htmlFor="1001-3000">De 1.001 a 3.000 caixas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3001-5000" id="3001-5000" />
                <Label htmlFor="3001-5000">De 3.001 a 5.000 caixas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5001-10000" id="5001-10000" />
                <Label htmlFor="5001-10000">De 5.001 a 10.000 caixas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="acima-10000" id="acima-10000" />
                <Label htmlFor="acima-10000">Acima de 10.000 caixas</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">
              Como está o estado de conservação dos documentos em papel no seu Setor? *
            </Label>
            <RadioGroup
              value={formData.documentCondition}
              onValueChange={(value) => setFormData(prev => ({ ...prev, documentCondition: value }))}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="critico" id="cond-critico" />
                <Label htmlFor="cond-critico">Crítico</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ruim" id="cond-ruim" />
                <Label htmlFor="cond-ruim">Ruim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="cond-regular" />
                <Label htmlFor="cond-regular">Regular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bom" id="cond-bom" />
                <Label htmlFor="cond-bom">Bom</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excelente" id="cond-excelente" />
                <Label htmlFor="cond-excelente">Excelente</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">
              Como estão as condições dos locais onde seu setor guarda os documentos em papel? *
            </Label>
            <RadioGroup
              value={formData.storageConditions}
              onValueChange={(value) => setFormData(prev => ({ ...prev, storageConditions: value }))}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inadequado" id="local-inadequado" />
                <Label htmlFor="local-inadequado">Inadequado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="razoavel" id="local-razoavel" />
                <Label htmlFor="local-razoavel">Razoável</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excelente" id="local-excelente" />
                <Label htmlFor="local-excelente">Excelente</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      );
    }

    // Final step - remaining questions and images
    const finalStepIndex = formData.hasDocuments === "sim" ? 5 : 4;
    if (currentStep === finalStepIndex) {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Questões Finais e Imagens
          </h3>

          <div>
            <Label className="text-base font-medium">
              O seu setor ainda produz ou recebe documentos em papel nas atividades do dia a dia?
            </Label>
            <RadioGroup
              value={formData.stillProduces}
              onValueChange={(value) => setFormData(prev => ({ ...prev, stillProduces: value }))}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="prod-sim" />
                <Label htmlFor="prod-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="prod-nao" />
                <Label htmlFor="prod-nao">Não</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">
              Com que frequência os documentos do seu setor são consultados?
            </Label>
            <RadioGroup
              value={formData.consultationFrequency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, consultationFrequency: value }))}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="muito-frequente" id="freq-muito" />
                <Label htmlFor="freq-muito">Muito frequente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="frequente" id="freq-normal" />
                <Label htmlFor="freq-normal">Frequente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ocasional" id="freq-ocasional" />
                <Label htmlFor="freq-ocasional">Ocasional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="raro" id="freq-raro" />
                <Label htmlFor="freq-raro">Raro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="muito-raro" id="freq-muito-raro" />
                <Label htmlFor="freq-muito-raro">Muito raro ou nenhuma consulta</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium mb-2 block">
              Envie até 04 imagens da situação dos documentos do seu Setor
            </Label>
            <p className="text-sm text-gray-600 mb-4">
              Para melhor compreendermos o ambiente de armazenamento, solicitamos que as fotos capturem um ângulo amplo, 
              de modo a proporcionar uma visão abrangente do espaço e das condições de armazenamento dos documentos.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Clique aqui para enviar uma imagem ou arraste e solte aqui.
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                Selecionar Imagens
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Imagens selecionadas ({formData.images.length}/4):</p>
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative bg-gray-100 p-2 rounded">
                      <p className="text-xs truncate">{file.name}</p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`space-y-6 ${isPublicForm ? 'max-w-4xl mx-auto' : ''}`}>
      {onNavigateBack && (
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={onNavigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {isPublicForm ? 'Voltar' : 'Voltar para Diagnósticos'}
          </Button>
        </div>
      )}

      {isPublicForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Bem-vindo ao Diagnóstico de Seleção de Setores
            </CardTitle>
            <CardDescription>
              Este formulário tem como objetivo identificar os setores mais críticos da sua organização para um diagnóstico aprofundado da gestão documental. 
              {sectorId && " Este link foi enviado especificamente para o seu setor."}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {isPublicForm && (
        <Card>
          <CardHeader>
            <CardTitle>Termos e Condições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                Eu concordo com os{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-blue-600 hover:text-blue-800 underline">
                      Termos e Condições
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Termos e Condições</DialogTitle>
                      <DialogDescription asChild>
                        <div className="text-left space-y-4 pt-4">
                          <p>Prezado(a) Participante,</p>
                          
                          <p>
                            Você foi convidado(a) a colaborar com o projeto "Diagnóstico da Situação Arquivística da sua Organização", 
                            desenvolvido em parceria com a Universidade de Brasília (UnB).
                          </p>

                          <div>
                            <strong>Objetivo:</strong> Coletar dados para aprimorar a gestão, preservação e acesso a documentos do Ibama. 
                            A participação é voluntária e essencial.
                          </div>

                          <div>
                            <strong>Procedimento:</strong> Após o preenchimento do formulário, seu setor será avaliado por uma escala de gravidade. 
                            Setores com maior necessidade poderão ser selecionados para as próximas etapas.
                          </div>

                          <div>
                            <strong>Confidencialidade:</strong> Os dados serão protegidos conforme a Lei nº 13.709/2018 (LGPD) e utilizados 
                            exclusivamente para fins de gestão documental do Ibama, sem divulgação individualizada.
                          </div>

                          <div>
                            <strong>Contato:</strong> Em caso de dúvidas, contate a equipe do setor de arquivo.
                          </div>

                          <p>
                            Ao participar, você confirma estar ciente da importância da sua contribuição e concorda com os termos apresentados.
                          </p>

                          <p className="font-semibold">Agradecemos sua participação.</p>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                {" "}para participação neste diagnóstico arquivístico. 
                Entendo que as informações fornecidas serão utilizadas exclusivamente para fins de avaliação 
                da gestão documental da organização.
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Diagnóstico de Seleção de Setores
          </CardTitle>
          <CardDescription>
            Este formulário nos ajudará a identificar os setores mais críticos para realizar um diagnóstico arquivístico aprofundado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso</span>
              <span>{currentStep + 1} de {totalSteps}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {getCurrentStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>

            {currentStep < totalSteps - 1 ? (
              <Button onClick={handleNext}>
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Enviar Formulário
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
