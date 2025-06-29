
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, UserX } from "lucide-react";

interface ResearcherSummaryCardsProps {
  active: number;
  inactive: number;
  dismissed: number;
  total: number;
}

export function ResearcherSummaryCards({ 
  active, 
  inactive, 
  dismissed, 
  total 
}: ResearcherSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total de Pesquisadores</p>
              <p className="text-lg sm:text-2xl font-bold">{total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Ativos</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{active}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Inativos</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-600">{inactive}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Desligados</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">{dismissed}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
