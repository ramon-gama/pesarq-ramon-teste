
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Building, TrendingUp, UserX } from "lucide-react";

interface ResearcherStatsProps {
  totalResearchers: number;
  activeResearchers: number;
  inactiveResearchers: number;
  unbResearchers: number;
  dismissedResearchers: number;
}

export function ResearcherStats({ 
  totalResearchers, 
  activeResearchers, 
  inactiveResearchers,
  unbResearchers,
  dismissedResearchers
}: ResearcherStatsProps) {
  const externalResearchers = totalResearchers - unbResearchers;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <p className="text-lg sm:text-2xl font-bold">{totalResearchers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Ativos</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{activeResearchers}</p>
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
              <p className="text-lg sm:text-2xl font-bold text-gray-600">{inactiveResearchers}</p>
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
              <p className="text-lg sm:text-2xl font-bold text-red-600">{dismissedResearchers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">UnB</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">{unbResearchers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
