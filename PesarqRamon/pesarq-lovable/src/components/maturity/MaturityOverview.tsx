
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  BarChart3,
  UserCheck,
  PlayCircle,
  Eye
} from "lucide-react";

interface MaturityOverviewProps {
  onStartAssessment: () => void;
  onViewDashboard: () => void;
}

export function MaturityOverview({ onStartAssessment, onViewDashboard }: MaturityOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button size="lg" onClick={onStartAssessment} className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5" />
          Acessar Avaliação
        </Button>
        <Button size="lg" variant="outline" onClick={onViewDashboard} className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Ver Dashboard
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Avalie, por meio de dados quantitativos a gestão, preservação e acesso aos documentos da sua organização por meio de diferentes dados e níveis de diagnóstico.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Níveis de Maturidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">1. Não estabelecido (0-20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">2. Em desenvolvimento (20.1-40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">3. Essencial (40.1-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">4. Consolidado (60.1-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-sm">5. Avançado (80.1-100%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Última Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold">Nível Geral: 3.3</p>
              <Badge className="bg-yellow-500">Essencial</Badge>
              <p className="text-sm text-muted-foreground">Realizada em 15/11/2024</p>
              <p className="text-xs text-muted-foreground">Avaliador: Arquivo Central</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
