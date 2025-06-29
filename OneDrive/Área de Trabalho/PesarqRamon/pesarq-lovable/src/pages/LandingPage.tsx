import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Archive, 
  Calculator, 
  BookOpen, 
  BarChart3, 
  Users, 
  Shield, 
  FileText, 
  Database,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  Globe,
  Award,
  Building2,
  GraduationCap,
  Search,
  Download,
  FileCheck,
  HardDrive,
  Scale,
  Clock,
  TrendingUp,
  PieChart,
  UserPlus,
  LogIn,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  Lock,
  Crown,
  Star,
  Lightbulb,
  Info,
  AlertTriangle
} from "lucide-react";
import { MaturityCalculator } from "@/components/landing/MaturityCalculator";
import { ArchivalConverter } from "@/components/landing/ArchivalConverter";
import { DocumentTypesWiki } from "@/components/landing/DocumentTypesWiki";
import { PlatformStats } from "@/components/landing/PlatformStats";
import { LoginModal } from "@/components/landing/LoginModal";
import { RequestInviteModal } from "@/components/landing/RequestInviteModal";
import { ResearchCarousel } from "@/components/landing/ResearchCarousel";
import { ResetPasswordModal } from "@/components/landing/ResetPasswordModal";
import { Connections } from "@/components/Connections";
import { useAuth } from "@/contexts/AuthContext";
import { USER_TYPES } from "@/types/user";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [demoUserType, setDemoUserType] = useState<'student' | 'public_organ' | 'institutional_partner'>('student');

  const { isAuthenticated, user } = useAuth();

  // Detectar links de recuperação/configuração de senha - versão melhorada
  useEffect(() => {
    console.log('🔍 LandingPage: Verificando URL para links de recuperação...');
    
    const checkForPasswordSetup = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fragment = window.location.hash;
      
      console.log('🔍 URL completa:', window.location.href);
      console.log('🔍 Query params:', Object.fromEntries(urlParams.entries()));
      console.log('🔍 Fragment:', fragment);
      
      // Verificar diferentes tipos de links de recuperação do Supabase
      const checks = {
        hasAccessToken: fragment.includes('access_token=') || urlParams.has('access_token'),
        hasRefreshToken: fragment.includes('refresh_token=') || urlParams.has('refresh_token'),
        hasRecoveryToken: urlParams.has('token') || fragment.includes('token='),
        hasRecoveryType: urlParams.get('type') === 'recovery' || fragment.includes('type=recovery'),
        hasPasswordSetup: urlParams.get('message') === 'configurar-senha' || urlParams.get('action') === 'setup-password',
        hasRecoveryFragment: fragment.includes('#recovery') || fragment.includes('recovery'),
        hasResetFragment: fragment.includes('reset') || fragment.includes('password')
      };
      
      console.log('🔍 Verificações de recuperação:', checks);
      
      // Se qualquer condição for verdadeira, abrir modal
      const shouldOpenModal = Object.values(checks).some(check => check);
      
      if (shouldOpenModal) {
        console.log('✅ Link de recuperação detectado, abrindo modal de configuração');
        setShowResetPasswordModal(true);
        
        // Limpar URL após detectar o link (com delay para garantir que o modal abriu)
        setTimeout(() => {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          console.log('🧹 URL limpa:', cleanUrl);
        }, 1000);
      } else {
        console.log('❌ Nenhum link de recuperação detectado');
      }
    };

    checkForPasswordSetup();
  }, []);

  // Redirecionar se usuário estiver autenticado
  useEffect(() => {
    console.log('LandingPage: Verificando estado de autenticação:', isAuthenticated);
    console.log('LandingPage: Usuário atual:', user);
    
    if (isAuthenticated && user) {
      console.log('LandingPage: Usuário autenticado detectado, redirecionando para /dashboard');
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated, user]);

  // Não renderizar se usuário estiver autenticado
  if (isAuthenticated && user) {
    console.log('LandingPage: Aguardando redirecionamento...');
    return <div>Redirecionando...</div>;
  }

  const navigationItems = [
    { id: "home", label: "Início" },
    { id: "resources", label: "Recursos" },
    { id: "about", label: "Sobre" },
    { id: "contact", label: "Contato" }
  ];

  const handleMaturityClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    const { allowed } = canPerformMaturityAssessment();
    if (allowed) {
      setActiveTab("maturity");
    } else {
      // Mostrar modal explicando limitações
      alert("Você não tem permissão para realizar avaliação de maturidade ou já realizou a avaliação anual.");
    }
  };

  const renderDemoContent = (feature: string, children: React.ReactNode) => {
    if (!isAuthenticated) {
      return (
        <Card className="relative">
          <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="text-center p-6">
              <Lock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 font-medium mb-3">Login necessário para usar</p>
              <Button 
                onClick={() => setShowLoginModal(true)}
                className="bg-[#15AB92] hover:bg-[#0d8f7a]"
              >
                Fazer Login
              </Button>
            </div>
          </div>
          {children}
        </Card>
      );
    }

    return <>{children}</>;
  };

  const resources = [
    {
      icon: Target,
      title: "Diagnóstico de Maturidade",
      description: "Ferramenta completa para avaliar o nível de maturidade em gestão de documentos",
      features: ["Análise em 5 dimensões", "Relatórios personalizados", "Planos de melhoria"],
      accessType: "public_organ",
      limitation: "1x por ano para órgãos públicos"
    },
    {
      icon: Calculator,
      title: "Conversores Arquivísticos",
      description: "Calculadoras especializadas para conversão de medidas em gestão de documentos",
      features: ["Metros lineares para caixas", "Estimativas de volume", "Conversão de formatos digitais"],
      accessType: "free",
      limitation: null
    },
    {
      icon: BookOpen,
      title: "Base de Tipos Documentais",
      description: "Repositório colaborativo dos tipos documentais brasileiros",
      features: ["Classificação completa", "Descrição detalhada", "Contribuição colaborativa"],
      accessType: "free",
      limitation: "Contribuição apenas para órgãos registrados"
    },
    {
      icon: BarChart3,
      title: "Dados de Projetos Reais",
      description: "Painéis com dados consolidados dos projetos de pesquisa executados",
      features: ["Métricas de impacto", "Resultados comprovados", "Indicadores de qualidade"],
      accessType: "free",
      limitation: null
    }
  ];

  const partnerResources = [
    {
      icon: FileText,
      title: "Diagnósticos Especializados",
      description: "Análises diagnósticas estruturadas para organizações parceiras",
      features: ["Diagnóstico completo", "Análise situacional", "Planos de ação"]
    },
    {
      icon: Shield,
      title: "Desenvolvimento de Políticas e Normativos",
      description: "Apoio na construção de políticas e normativos arquivísticos",
      features: ["Construção de políticas", "Normativos personalizados", "Adequação legal"]
    },
    {
      icon: Database,
      title: "Instrumentos de Gestão",
      description: "Desenvolvimento e implementação de instrumentos de gestão documental",
      features: ["Plano de classificação", "Tabela de temporalidade", "Testes e validação"]
    },
    {
      icon: HardDrive,
      title: "Digitalização e Repositórios",
      description: "Modelos de digitalização e implementação de repositórios digitais",
      features: ["Modelos de digitalização", "Implementação de SIGADs", "Plataformas de acesso"]
    },
    {
      icon: Award,
      title: "Transferência de Conhecimento",
      description: "Formação técnica e publicação de resultados",
      features: ["Capacitação especializada", "Publicação de cases", "Artigos científicos"]
    },
    {
      icon: Scale,
      title: "Ambiente de Governança",
      description: "Plataforma dedicada para atualização e gestão de dados",
      features: ["Governança de dados", "Atualizações contínuas", "Monitoramento"]
    }
  ];

  const benefits = [
    {
      icon: Archive,
      title: "Gestão de Documentos Baseada em Evidências",
      description: "Ferramentas desenvolvidas com base em projetos reais executados em órgãos públicos brasileiros"
    },
    {
      icon: Shield,
      title: "Resultados Comprovados",
      description: "Metodologias testadas e validadas em 17 organizações parceiras"
    },
    {
      icon: BarChart3,
      title: "Dados de Qualidade",
      description: "Acesso a estatísticas reais de volume documental, digitalização e maturidade organizacional"
    },
    {
      icon: Database,
      title: "Conhecimento Colaborativo",
      description: "Base de tipos documentais construída coletivamente pelos participantes dos projetos"
    },
    {
      icon: Calculator,
      title: "Ferramentas Práticas",
      description: "Conversores e calculadoras desenvolvidas para necessidades reais identificadas nos projetos"
    },
    {
      icon: TrendingUp,
      title: "Melhoria Contínua",
      description: "Metodologias de diagnóstico que resultaram em 73% de melhoria nos órgãos participantes"
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Avaliação de Maturidade",
      description: "Diagnóstico completo do nível de maturidade em gestão de documentos",
      action: handleMaturityClick
    },
    {
      icon: Calculator,
      title: "Conversores Arquivísticos",
      description: "Transforme metros lineares em caixas, volumes e outras medidas",
      action: () => setActiveTab("converter")
    },
    {
      icon: BookOpen,
      title: "Wiki de Tipos Documentais",
      description: "Base colaborativa dos principais tipos documentais do Brasil",
      action: () => setActiveTab("wiki")
    },
    {
      icon: PieChart,
      title: "Estatísticas Nacionais",
      description: "Dados sobre volume documental e serviços arquivísticos",
      action: () => setActiveTab("stats")
    },
    {
      icon: MessageCircle,
      title: "Chat de Discussões",
      description: "Conecte-se com profissionais e troque experiências",
      action: () => setActiveTab("connections")
    }
  ];

  const userTypes = [
    {
      icon: GraduationCap,
      title: "Estudantes e Pesquisadores",
      description: "Acesso gratuito a ferramentas e recursos educacionais",
      benefits: ["Calculadoras arquivísticas", "Base de tipos documentais", "Material didático"]
    },
    {
      icon: Building2,
      title: "Órgãos Públicos",
      description: "Parceria para projetos de pesquisa e modernização",
      benefits: ["Diagnóstico completo", "Consultoria especializada", "Dashboards executivos"]
    },
    {
      icon: Users,
      title: "Profissionais da Área",
      description: "Comunidade colaborativa de arquivistas e gestores",
      benefits: ["Networking profissional", "Troca de experiências", "Atualizações normativas"]
    }
  ];

  const teamMembers = [
    {
      name: "Prof. Dr. Renato Tarciso Barbosa de Sousa",
      role: "Coordenador Geral",
      department: "Departamento de Ciência da Informação - UnB",
      expertise: "Organização de arquivos, avaliação de documentos arquivísticos, recuperação da informação em arquivos públicos estaduais, gestão documental, preservação digital e modelagem de fluxos informacionais em instituições públicas"
    },
    {
      name: "Prof. Dr. Rogério Henrique de Araújo Júnior",
      role: "Pesquisador Principal",
      department: "Departamento de Ciência da Informação - UnB",
      expertise: "Representação e organização da informação, indexação e taxonomias de documentos arquivísticos; líder do grupo EROIC (Estudos de Representação e Organização da Informação e do Conhecimento)"
    }
  ];

  const getFilteredFeatures = () => {
    if (isAuthenticated) return features;
    
    switch (demoUserType) {
      case 'student':
        return features.filter(f => ['Conversores Arquivísticos', 'Wiki de Tipos Documentais', 'Estatísticas Nacionais', 'Chat de Discussões'].includes(f.title));
      case 'public_organ':
        return features.filter(f => !['Gestão de Acervos'].includes(f.title));
      case 'institutional_partner':
        return features;
      default:
        return features;
    }
  };

  const getDemoContent = () => {
    switch (demoUserType) {
      case 'student':
        return {
          title: "Ferramentas Educacionais",
          description: "Recursos gratuitos para estudantes e pesquisadores",
          highlight: "Acesso gratuito para sempre"
        };
      case 'public_organ':
        return {
          title: "Avaliação de Maturidade",
          description: "Diagnóstico completo + ferramentas básicas",
          highlight: "1 avaliação gratuita por ano"
        };
      case 'institutional_partner':
        return {
          title: "Solução Completa",
          description: "Acesso total via TED/Convênio",
          highlight: "Funcionalidades ilimitadas"
        };
    }
  };

  const canPerformMaturityAssessment = () => {
    // This function is used in handleMaturityClick, so define it here for demo purposes
    // In real code, it should come from useAuth context
    return { allowed: true };
  };

  const renderContent = () => {
    switch (activeSection) {
      case "resources":
        return (
          <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen pt-36 sm:pt-40">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Recursos da Plataforma</h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
                  Conheça todas as ferramentas e funcionalidades disponíveis na PesArq para 
                  modernizar a gestão de documentos da sua organização.
                </p>
              </div>
              
              {/* Recursos Gratuitos */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Recursos Gratuitos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {resources.map((resource, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow h-full relative">
                      {resource.accessType !== 'free' && (
                        <Badge className={`absolute top-3 right-3 ${
                          resource.accessType === 'partner' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {resource.accessType === 'partner' ? 'Parceiros' : 'Órgãos Públicos'}
                        </Badge>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-[#15AB92] rounded-lg">
                            <resource.icon className="h-6 w-6 text-white" />
                          </div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                          {resource.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-4">
                          {resource.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-[#15AB92]" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {resource.limitation && (
                          <p className="text-xs text-orange-600 mb-3 font-medium">
                            ⚠️ {resource.limitation}
                          </p>
                        )}
                        <Button className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]">
                          {resource.accessType === 'free' ? 'Usar Gratuitamente' : 'Solicitar Acesso'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recursos para Parceiros */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Recursos para Parceiros Institucionais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {partnerResources.map((resource, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow h-full relative border-purple-200">
                      <Badge className="absolute top-3 right-3 bg-purple-100 text-purple-800">
                        Apenas Parceiros
                      </Badge>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-purple-600 rounded-lg">
                            <resource.icon className="h-6 w-6 text-white" />
                          </div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                          {resource.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-4">
                          {resource.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-purple-600" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          Solicitar Parceria
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-16 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Tipos de Acesso</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.values(USER_TYPES).map((userType, index) => (
                    <Card key={index} className={`${userType.color.replace('bg-', 'bg-').replace('500', '50')}`}>
                      <CardContent className="pt-6 text-center">
                        <div className={`w-12 h-12 ${userType.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                          {userType.type === 'student' && <GraduationCap className="h-6 w-6 text-white" />}
                          {userType.type === 'public_organ' && <Building2 className="h-6 w-6 text-white" />}
                          {userType.type === 'institutional_partner' && <Crown className="h-6 w-6 text-white" />}
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{userType.label}</h3>
                        <p className="text-slate-700 mb-4 text-sm">{userType.description}</p>
                        <div className="space-y-1">
                          {userType.features.slice(0, 3).map((feature, idx) => (
                            <p key={idx} className="text-xs text-slate-600">• {feature}</p>
                          ))}
                        </div>
                        {userType.limitations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs text-orange-600 font-medium">Limitações:</p>
                            {userType.limitations.slice(0, 2).map((limitation, idx) => (
                              <p key={idx} className="text-xs text-orange-600">• {limitation}</p>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case "about":
        return (
          <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen pt-36 sm:pt-40">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Sobre a PesArq</h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
                  Uma plataforma inteligente e totalmente flexível, desenvolvida por pesquisadores da 
                  Universidade de Brasília (UnB) e do Grupo de Pesquisa do CNPq Estudos sobre a 
                  Representação e Organização da Informação e Conhecimento (EROIC), para apoiar a 
                  governança dos principais dados dos Setores de Arquivo.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-16">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Nossa Missão</h2>
                  <p className="text-slate-600 mb-4">
                    A PesArq foi criada com o objetivo de democratizar o acesso a ferramentas modernas 
                    de gestão de documentos, promovendo a melhoria dos processos de organização, 
                    preservação e acesso aos documentos nas organizações brasileiras.
                  </p>
                  <p className="text-slate-600 mb-6">
                    Desenvolvida por pesquisadores do Departamento de Ciência da Informação da UnB e 
                    do Grupo de Pesquisa EROIC, a plataforma combina conhecimento acadêmico com 
                    soluções práticas para os desafios reais da gestão documental.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-[#15AB92]" />
                      <span>Baseada em pesquisa científica</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-[#15AB92]" />
                      <span>Desenvolvida por especialistas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-[#15AB92]" />
                      <span>Focada na realidade brasileira</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Objetivos</h2>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold mb-2">Democratização do Conhecimento</h3>
                        <p className="text-sm text-slate-600">
                          Tornar acessíveis ferramentas e conhecimentos especializados em gestão de documentos 
                          para organizações de todos os portes.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold mb-2">Modernização Tecnológica</h3>
                        <p className="text-sm text-slate-600">
                          Promover a adoção de tecnologias modernas na gestão de documentos, 
                          facilitando a transição digital.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold mb-2">Colaboração Institucional</h3>
                        <p className="text-sm text-slate-600">
                          Fomentar parcerias entre universidades, órgãos públicos e iniciativa 
                          privada para o desenvolvimento conjunto.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="mb-16">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8 text-center">Equipe de Pesquisa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                  {teamMembers.map((member, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="pt-6">
                        <div className="w-16 h-16 bg-[#15AB92] rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Users className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                        <p className="text-[#15AB92] font-medium mb-2">{member.role}</p>
                        <p className="text-sm text-slate-600 mb-3">{member.department}</p>
                        <div className="text-left bg-slate-50 p-4 rounded-lg">
                          <p className="text-xs font-medium text-slate-700 mb-2">Linhas de pesquisa e atuação:</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{member.expertise}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">Parcerias e Colaborações</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Modalidades de Parceria</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#15AB92]" />
                        <span className="text-sm">Termo de Execução Descentralizada (TED)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#15AB92]" />
                        <span className="text-sm">Convênios de Cooperação Técnica</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#15AB92]" />
                        <span className="text-sm">Contratos de Prestação de Serviços</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#15AB92]" />
                        <span className="text-sm">Projetos de Pesquisa Conjunta</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Benefícios da Parceria</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#15AB92]" />
                        <span className="text-sm">Análise Diagnóstica Estruturada</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#15AB92]" />
                        <span className="text-sm">Desenvolvimento de Soluções Aplicadas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#15AB92]" />
                        <span className="text-sm">Aperfeiçoamento de Competências Institucionais</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#15AB92]" />
                        <span className="text-sm">Formação Técnica com Base Científica</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#15AB92]" />
                        <span className="text-sm">Transferência de Conhecimento Especializado</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case "contact":
        return (
          <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen pt-36 sm:pt-40">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Entre em Contato</h1>
                <p className="text-base sm:text-lg text-slate-600">
                  Estamos aqui para ajudar com suas necessidades de gestão de documentos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#15AB92]" />
                      Informações Institucionais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#15AB92] mt-1" />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p className="text-sm text-slate-600">
                          Universidade de Brasília - UnB<br />
                          Departamento de Ciência da Informação<br />
                          Campus Darcy Ribeiro<br />
                          Brasília, DF - CEP: 70910-900
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#15AB92]" />
                      <div>
                        <p className="font-medium">E-mail</p>
                        <p className="text-sm text-slate-600">pesarq@unb.br</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[#15AB92]" />
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-sm text-slate-600">(61) 99261-8006</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#15AB92]" />
                      Tipos de Atendimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-900">Suporte Técnico</h4>
                        <p className="text-sm text-green-800">
                          Dúvidas sobre uso da plataforma e funcionalidades
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900">Parcerias Institucionais</h4>
                        <p className="text-sm text-blue-800">
                          Propostas de TED, convênios e contratos
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-900">Projetos de Pesquisa</h4>
                        <p className="text-sm text-purple-800">
                          Colaborações acadêmicas e científicas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Canais de Comunicação</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-[#15AB92] hover:bg-[#0d8f7a]"
                    onClick={() => setShowInviteModal(true)}
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Solicitar Parceria
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => window.open("mailto:pesarq@unb.br", "_blank")}
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Enviar E-mail
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setShowLoginModal(true)}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Fazer Login
                  </Button>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return (
          <>
            {/* Hero Section */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40">
              <div className="max-w-7xl mx-auto text-center">
                <Badge className="mb-4 sm:mb-6 bg-[#15AB92] text-white">
                  Desenvolvido por pesquisadores da UnB e Grupo EROIC
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6">
                  Transforme a <span className="text-[#15AB92] block sm:inline">Gestão de Documentos</span>
                  <span className="block">da sua Organização</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 max-w-4xl mx-auto">
                  Uma plataforma inteligente e totalmente flexível, desenvolvida por pesquisadores da 
                  Universidade de Brasília (UnB) e do Grupo de Pesquisa do CNPq Estudos sobre a 
                  Representação e Organização da Informação e Conhecimento (EROIC), para apoiar a 
                  governança dos principais dados dos Setores de Arquivo.
                </p>
                
                {/* New CTA Section with different paths */}
                <div className="flex flex-col lg:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
                  {/* Free Access */}
                  <Card className="flex-1 border-2 border-blue-200 bg-blue-50">
                    <CardContent className="pt-6 text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Acesso Gratuito</h3>
                      <p className="text-sm text-slate-600 mb-4">Para estudantes e pesquisadores</p>
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={() => setShowLoginModal(true)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Criar Conta Gratuita
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Public Organ */}
                  <Card className="flex-1 border-2 border-green-200 bg-green-50">
                    <CardContent className="pt-6 text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Órgão Público</h3>
                      <p className="text-sm text-slate-600 mb-4">Avaliação gratuita (1x/ano)</p>
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600"
                        onClick={() => setShowLoginModal(true)}
                      >
                        <Target className="mr-2 h-4 w-4" />
                        Avaliar Maturidade
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Partnership */}
                  <Card className="flex-1 border-2 border-purple-200 bg-purple-50 relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-purple-500">
                        <Crown className="h-3 w-3 mr-1" />
                        Mantenedor
                      </Badge>
                    </div>
                    <CardContent className="pt-6 text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Parceria</h3>
                      <p className="text-sm text-slate-600 mb-4">Mantém a pesquisa e plataforma ativa</p>
                      <Button 
                        className="w-full bg-purple-500 hover:bg-purple-600"
                        onClick={() => setShowInviteModal(true)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Solicitar Proposta
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-sm text-slate-500 mt-4">
                  Mais de 1.200 organizações já confiam na PesArq
                </p>
              </div>
            </section>

            {/* Research Carousel - Added after hero section */}
            <ResearchCarousel />

            {/* Demo User Type Selector - Only shown for non-authenticated users */}
            <section className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                    Explore a Plataforma
                  </h2>
                  <p className="text-slate-600 mb-4">
                    Escolha seu perfil para ver uma demonstração personalizada
                  </p>
                  
                  {/* Important Information Card */}
                  <Card className="bg-blue-50 border-blue-200 mb-6">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3 text-left">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          <p className="text-sm text-blue-900 font-medium">
                            <strong>Acesso Completo:</strong> Apenas órgãos parceiros têm acesso a todos os recursos da plataforma.
                          </p>
                          <p className="text-sm text-blue-800">
                            <strong>Sustentabilidade:</strong> A plataforma será mantida ativa enquanto existirem parcerias 
                            e incentivos de troca com a comunidade arquivística brasileira.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['student', 'public_organ', 'institutional_partner'] as const).map((type) => (
                    <Card 
                      key={type}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        demoUserType === type 
                          ? 'ring-2 ring-[#15AB92] bg-[#15AB92]/5' 
                          : 'hover:bg-slate-50'
                      }`}
                      onClick={() => setDemoUserType(type)}
                    >
                      <CardContent className="pt-4 text-center">
                        <div className={`w-10 h-10 ${USER_TYPES[type].color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                          {type === 'student' && <GraduationCap className="h-5 w-5 text-white" />}
                          {type === 'public_organ' && <Building2 className="h-5 w-5 text-white" />}
                          {type === 'institutional_partner' && <Crown className="h-5 w-5 text-white" />}
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{USER_TYPES[type].label}</h3>
                        <p className="text-xs text-slate-600">{getDemoContent().highlight}</p>
                        {type === 'institutional_partner' && (
                          <Badge className="mt-2 text-xs bg-purple-100 text-purple-800">
                            Acesso Total
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                    Por que escolher a PesArq?
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                    Uma plataforma completa desenvolvida com base em pesquisa científica 
                    e experiência prática em gestão de documentos.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {benefits.map((benefit, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-[#15AB92] rounded-lg">
                            <benefit.icon className="h-6 w-6 text-white" />
                          </div>
                          <CardTitle className="text-lg">{benefit.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {benefit.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Interactive Tools Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                    {getDemoContent().title}
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600">
                    {`${getDemoContent().description} - ${getDemoContent().highlight}`}
                  </p>
                  <div className="mt-4 space-y-2">
                    <Badge variant="outline" className="text-[#15AB92] border-[#15AB92]">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Demo para {USER_TYPES[demoUserType].label}
                    </Badge>
                    {demoUserType !== 'institutional_partner' && (
                      <div className="flex justify-center">
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Funcionalidades limitadas - Parceria necessária para acesso completo
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6 sm:mb-8 h-auto">
                    <TabsTrigger value="overview" className="text-xs sm:text-sm p-2 sm:p-3">Visão Geral</TabsTrigger>
                    <TabsTrigger 
                      value="maturity" 
                      className="text-xs sm:text-sm p-2 sm:p-3"
                    >
                      Maturidade
                    </TabsTrigger>
                    <TabsTrigger value="converter" className="text-xs sm:text-sm p-2 sm:p-3">Conversores</TabsTrigger>
                    <TabsTrigger value="wiki" className="text-xs sm:text-sm p-2 sm:p-3">Wiki Documental</TabsTrigger>
                    <TabsTrigger value="connections" className="text-xs sm:text-sm p-2 sm:p-3">Chat de Discussões</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getFilteredFeatures().map((feature, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={feature.action}>
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-[#15AB92] rounded-lg">
                                <feature.icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {feature.title}
                                  {feature.title === "Avaliação de Maturidade" && demoUserType === 'student' && (
                                    <Lock className="h-4 w-4 text-orange-500" />
                                  )}
                                </CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-8 text-center">
                      <Card className="bg-gradient-to-r from-[#15AB92]/10 to-blue-50 border-[#15AB92]/20">
                        <CardContent className="pt-6">
                          <h3 className="font-semibold text-lg mb-2">Pronto para começar?</h3>
                          <p className="text-slate-600 mb-4">
                            {demoUserType === 'student' && "Crie sua conta gratuita e acesse todas as ferramentas educacionais"}
                            {demoUserType === 'public_organ' && "Registre seu órgão e faça sua primeira avaliação de maturidade"}
                            {demoUserType === 'institutional_partner' && "Entre em contato para uma proposta de parceria personalizada"}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {demoUserType !== 'institutional_partner' ? (
                              <Button 
                                onClick={() => setShowLoginModal(true)}
                                className="bg-[#15AB92] hover:bg-[#0d8f7a]"
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                {demoUserType === 'student' ? 'Criar Conta Gratuita' : 'Registrar Órgão'}
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => setShowInviteModal(true)}
                                className="bg-[#15AB92] hover:bg-[#0d8f7a]"
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Solicitar Proposta
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="maturity">
                    <div className="space-y-6">
                      <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-amber-600" />
                            <div>
                              <h3 className="font-semibold text-amber-900">Avaliação de Maturidade - Visualização</h3>
                              <p className="text-sm text-amber-800">
                                Veja como funciona nossa ferramenta de diagnóstico. Faça login para realizar sua própria avaliação.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <MaturityCalculator isDemo={true} onLoginRequired={() => setShowLoginModal(true)} />
                    </div>
                  </TabsContent>

                  <TabsContent value="converter">
                    <ArchivalConverter 
                      isDemo={true} 
                      onLoginRequired={() => setShowLoginModal(true)} 
                    />
                  </TabsContent>

                  <TabsContent value="wiki">
                    <DocumentTypesWiki isDemo={true} onLoginRequired={() => setShowLoginModal(true)} />
                  </TabsContent>

                  <TabsContent value="connections">
                    <div className="space-y-6">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <MessageCircle className="h-5 w-5 text-blue-600" />
                            <div>
                              <h3 className="font-semibold text-blue-900">Chat de Discussões - Visualização</h3>
                              <p className="text-sm text-blue-800">
                                Conecte-se com outros profissionais da área. Faça login para participar das discussões.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Connections />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </section>

            {/* Platform Statistics */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
              <PlatformStats />
            </section>

            {/* User Types Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                    Para Todos os Perfis
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600">
                    Acesso diferenciado conforme o tipo de usuário e necessidades específicas
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {userTypes.map((userType, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="text-center">
                        <div className="mx-auto p-4 bg-[#15AB92] rounded-full w-fit mb-4">
                          <userType.icon className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-xl">{userType.title}</CardTitle>
                        <CardDescription className="text-base">{userType.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {userType.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-[#15AB92]" />
                              <span className="text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#15AB92] to-[#0d8f7a] text-white">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                  Pronto para Modernizar sua Gestão de Documentos?
                </h2>
                <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
                  Junte-se a dezenas de organizações que já transformaram seus processos 
                  documentais com a nossa plataforma.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-[#15AB92] hover:bg-gray-100 text-lg px-6 sm:px-8 py-3"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Começar Gratuitamente
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-[#15AB92] text-lg px-6 sm:px-8 py-3"
                    onClick={() => setShowInviteModal(true)}
                  >
                    Solicitar Parceria
                  </Button>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/8c76cbd2-a10c-4e4a-bd52-6bc781ded8f7.png" 
                alt="PesArq Logo" 
                className="h-10 sm:h-12 w-auto"
              />
            </div>

            {/* Desktop Navigation - Updated Style */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`relative px-6 py-4 text-base font-medium transition-all duration-300 ${
                    activeSection === item.id 
                      ? "text-[#15AB92]" 
                      : "text-slate-700 hover:text-[#15AB92]"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#15AB92] rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* Action Buttons - Modern Style */}
            <div className="hidden lg:flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 hover:border-[#15AB92] hover:text-[#15AB92] hover:bg-white transition-all duration-300 backdrop-blur-sm"
              >
                <UserPlus className="h-4 w-4" />
                <span className="font-medium">Solicitar Convite</span>
              </Button>
              <Button 
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-[#15AB92] to-[#0d8f7a] hover:from-[#0d8f7a] hover:to-[#15AB92] flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all duration-300"
              >
                <LogIn className="h-4 w-4" />
                <span className="font-medium">Entrar</span>
              </Button>
            </div>

            {/* Mobile Menu Button - Modern Style */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-[#15AB92] hover:bg-[#15AB92]/5 transition-all duration-300"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation - Modern Style */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-md">
              <div className="py-6 px-4">
                <div className="flex flex-col space-y-2 mb-6">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left py-4 px-6 rounded-xl transition-all duration-300 font-medium ${
                        activeSection === item.id 
                          ? "bg-gradient-to-r from-[#15AB92] to-[#0d8f7a] text-white shadow-lg" 
                          : "text-slate-700 hover:bg-slate-100 hover:text-[#15AB92]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex flex-col gap-3 px-2">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => {
                      setShowInviteModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 justify-center py-4 rounded-xl border-2 border-slate-200 hover:border-[#15AB92] hover:text-[#15AB92] hover:bg-white transition-all duration-300"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span className="font-medium">Solicitar Convite</span>
                  </Button>
                  <Button 
                    size="lg"
                    onClick={() => {
                      setShowLoginModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-[#15AB92] to-[#0d8f7a] hover:from-[#0d8f7a] hover:to-[#15AB92] flex items-center gap-2 justify-center py-4 rounded-xl shadow-lg transition-all duration-300"
                  >
                    <LogIn className="h-5 w-5" />
                    <span className="font-medium">Entrar</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      {renderContent()}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/lovable-uploads/5ebb1493-1ce9-4fa3-bd7f-4e12a3710b31.png" 
                  alt="PesArq Logo" 
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-slate-400 mb-4">
                Plataforma de pesquisa desenvolvida por pesquisadores da UnB para 
                modernização da gestão de documentos de organizações brasileiras.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos Gratuitos</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Avaliação de Maturidade</li>
                <li>Conversores Arquivísticos</li>
                <li>Wiki de Tipos Documentais</li>
                <li>Dashboards e Relatórios</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Parcerias</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Termos de Execução (TED)</li>
                <li>Convênios</li>
                <li>Contratos de Pesquisa</li>
                <li>Acesso Institucional</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-slate-400">
            <p>&copy; 2024 PesArq - Universidade de Brasília. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <RequestInviteModal open={showInviteModal} onOpenChange={setShowInviteModal} />
      <ResetPasswordModal open={showResetPasswordModal} onOpenChange={setShowResetPasswordModal} />
    </div>
  );
}
