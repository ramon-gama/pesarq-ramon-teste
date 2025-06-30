
import { Bell, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface TopHeaderProps {
  activeModule: string;
}

const moduleNames = {
  dashboard: "Dashboard",
  organization: "Organização",
  planning: "Planejamento Estratégico",
  collection: "Controle do Acervo Documental",
  tasks: "Gestão de Tarefas", 
  services: "Gestão de Serviços",
  policies: "Políticas e Normas",
  incidents: "Gestão de Incidentes",
  connections: "Conexões e Troca entre Órgãos",
  products: "Produtos Arquivísticos",
  evaluation: "Ferramentas de Avaliação",
  collegiates: "Colegiados Arquivísticos",
  diagnostic: "Diagnóstico Arquivístico",
  maturity: "Índice de Maturidade em Gestão de Documentos",
  "unb-projects": "Gestão de Projetos UnB",
  admin: "Administração"
};

export function TopHeader({ activeModule }: TopHeaderProps) {
  const { state, isMobile, toggleSidebar, setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Calcula a margem baseada no estado do sidebar
  const getMarginLeft = () => {
    if (isMobile) return "0";
    return state === "expanded" ? "16rem" : "4.5rem";
  };

  const handleLogout = () => {
    console.log('TopHeader: Iniciando logout...');
    
    // Fecha o sidebar mobile antes do logout se estiver aberto
    if (isMobile) {
      setOpenMobile(false);
    }
    
    // Chama a função de logout do contexto
    logout();
    
    console.log('TopHeader: Logout executado, redirecionando...');
    
    // Redireciona para a landing page (rota /)
    navigate('/', { replace: true });
  };

  const handleMenuToggle = () => {
    toggleSidebar();
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-30 bg-[#DFEDEC] border-b border-slate-300 h-12 sm:h-14 lg:h-16 transition-all duration-200 ease-in-out"
      style={{ marginLeft: getMarginLeft() }}
    >
      <div className="flex items-center justify-between h-full px-2 sm:px-3 lg:px-6">
        {/* Menu hambúrguer para mobile e desktop */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMenuToggle}
          className="h-7 w-7 sm:h-8 sm:w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-200 flex-shrink-0"
          title="Abrir/fechar menu"
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Área central com título */}
        <div className="flex-1 flex items-center justify-center px-2 min-w-0">
          <h1 className="font-bold text-slate-900 text-sm sm:text-base lg:text-lg xl:text-xl truncate">
            {moduleNames[activeModule as keyof typeof moduleNames] || "Dashboard"}
          </h1>
        </div>
        
        {/* Ícones da direita */}
        <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2 flex-shrink-0">
          {/* Notificações */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
            title="Notificações"
          >
            <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          
          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-7 w-7 sm:h-8 sm:w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
            title="Sair do sistema"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
