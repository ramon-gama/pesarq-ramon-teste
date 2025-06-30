
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2 } from "lucide-react";

interface Organ {
  id: string;
  name: string;
  description: string;
  sectors: number;
  activeQuestions: number;
  responses: number;
  createdAt: string;
}

interface OrganNavigationProps {
  selectedOrgan: Organ;
  onBackToSelection: () => void;
}

const OrganNavigation = ({ selectedOrgan, onBackToSelection }: OrganNavigationProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackToSelection}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedOrgan.name}</h3>
              <p className="text-sm text-gray-500">{selectedOrgan.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{selectedOrgan.sectors} setores</span>
            <span>•</span>
            <span>{selectedOrgan.activeQuestions} perguntas</span>
            <span>•</span>
            <span>{selectedOrgan.responses} respostas</span>
          </div>
          <Badge variant="secondary">Ativo</Badge>
        </div>
      </div>
    </div>
  );
};

export default OrganNavigation;
