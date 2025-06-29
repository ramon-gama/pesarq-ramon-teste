
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Lightbulb,
  BookOpen,
  Beaker,
  Target,
  Award,
  TrendingUp,
  Users,
  FileText,
  Database,
  Shield,
  Zap,
  Globe,
  Star,
  Building2,
  GraduationCap
} from "lucide-react";

interface ResearchItem {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const researchItems: ResearchItem[] = [
  {
    icon: Search,
    title: "Pesquisa Aplicada",
    description: "Soluções práticas baseadas em evidências científicas",
    color: "bg-blue-500"
  },
  {
    icon: Lightbulb,
    title: "Inovação",
    description: "Desenvolvimento de tecnologias emergentes",
    color: "bg-yellow-500"
  },
  {
    icon: BookOpen,
    title: "Conhecimento",
    description: "Construção colaborativa do saber arquivístico",
    color: "bg-green-500"
  },
  {
    icon: Beaker,
    title: "Metodologias",
    description: "Abordagens científicas testadas e validadas",
    color: "bg-purple-500"
  },
  {
    icon: Target,
    title: "Resultados Comprovados",
    description: "73% de melhoria nos órgãos participantes",
    color: "bg-red-500"
  },
  {
    icon: Award,
    title: "Excelência Acadêmica",
    description: "Padrões internacionais de qualidade",
    color: "bg-orange-500"
  },
  {
    icon: TrendingUp,
    title: "Impacto Mensurável",
    description: "Métricas objetivas de transformação",
    color: "bg-indigo-500"
  },
  {
    icon: Users,
    title: "Colaboração",
    description: "Parcerias institucionais estratégicas",
    color: "bg-pink-500"
  },
  {
    icon: FileText,
    title: "Documentação",
    description: "Gestão baseada em evidências documentais",
    color: "bg-teal-500"
  },
  {
    icon: Database,
    title: "Dados de Qualidade",
    description: "Informações estruturadas e confiáveis",
    color: "bg-cyan-500"
  },
  {
    icon: Shield,
    title: "Conformidade",
    description: "Adequação às normas e regulamentações",
    color: "bg-emerald-500"
  },
  {
    icon: Zap,
    title: "Eficiência",
    description: "Otimização de processos organizacionais",
    color: "bg-amber-500"
  },
  {
    icon: Globe,
    title: "Alcance Nacional",
    description: "Impacto em organizações brasileiras",
    color: "bg-blue-600"
  },
  {
    icon: Star,
    title: "Reconhecimento",
    description: "Validação pela comunidade científica",
    color: "bg-violet-500"
  },
  {
    icon: Building2,
    title: "Institucional",
    description: "Fortalecimento organizacional",
    color: "bg-slate-600"
  },
  {
    icon: GraduationCap,
    title: "Formação",
    description: "Capacitação de profissionais especializados",
    color: "bg-rose-500"
  }
];

export const ResearchCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    // Auto-scroll contínuo sem pausas
    const timer = setInterval(() => {
      api.scrollNext();
    }, 2000); // Reduzido para 2 segundos para movimento mais fluido

    return () => clearInterval(timer);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-50 to-blue-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#15AB92]/5 to-blue-500/5"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#15AB92]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-[#15AB92]/10 text-[#15AB92] border-[#15AB92]/20 hover:bg-[#15AB92]/20">
            <Star className="h-3 w-3 mr-1" />
            Pilares da Pesquisa
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Fundamentos da <span className="text-[#15AB92]">Excelência em Pesquisa</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Conheça os princípios que guiam nossos projetos de pesquisa aplicada em gestão de documentos
          </p>
        </div>

        <div className="relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
              duration: 25, // Transição mais rápida e suave
              dragFree: true, // Permite arrastar livremente
              containScroll: false, // Não contém o scroll
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {researchItems.map((item, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1 h-full">
                    <div className="group relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#15AB92]/0 to-blue-500/0 group-hover:from-[#15AB92]/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300"></div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                        
                        <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-[#15AB92] transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="text-sm text-slate-600 leading-relaxed flex-grow">
                          {item.description}
                        </p>
                        
                        {/* Hover indicator */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-full h-1 bg-gradient-to-r from-[#15AB92] to-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation buttons */}
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-[#15AB92] hover:text-white hover:border-[#15AB92] shadow-lg" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-[#15AB92] hover:text-white hover:border-[#15AB92] shadow-lg" />
          </Carousel>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(researchItems.length / 4) }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index * 4)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(current / 4) === index
                    ? "bg-[#15AB92] w-6"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statistics footer */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#15AB92]">17+</div>
            <p className="text-sm text-slate-600">Organizações Parceiras</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#15AB92]">73%</div>
            <p className="text-sm text-slate-600">Melhoria Comprovada</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#15AB92]">1.200+</div>
            <p className="text-sm text-slate-600">Usuários Ativos</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#15AB92]">12</div>
            <p className="text-sm text-slate-600">Anos de Pesquisa</p>
          </div>
        </div>
      </div>
    </section>
  );
};
