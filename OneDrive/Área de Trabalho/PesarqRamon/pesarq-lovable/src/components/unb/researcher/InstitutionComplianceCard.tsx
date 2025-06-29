
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building, CheckCircle, AlertTriangle } from "lucide-react";
import { Researcher } from "@/types/researcher";

interface InstitutionComplianceCardProps {
  researchers: Researcher[];
}

export function InstitutionComplianceCard({ researchers }: InstitutionComplianceCardProps) {
  // Filtra apenas pesquisadores ativos
  const activeResearchers = researchers.filter(r => r.status === 'active');
  
  const unbResearchers = activeResearchers.filter(r => 
    r.institution === "Universidade de Brasília (UnB)"
  );
  
  const totalResearchers = activeResearchers.length;
  const unbCount = unbResearchers.length;
  
  const unbPercentage = totalResearchers > 0 ? (unbCount / totalResearchers) * 100 : 0;
  
  // Verificação da regra: pelo menos 1/3 deve ser da UnB
  const requiredUnbPercentage = 33.33;
  const isCompliant = unbPercentage >= requiredUnbPercentage;

  if (totalResearchers === 0) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            Conformidade UnB
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm text-muted-foreground">
            Nenhum pesquisador ativo
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          Conformidade UnB
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">UnB: {unbCount}/{totalResearchers}</span>
          <div className="flex items-center gap-1">
            {isCompliant ? (
              <CheckCircle className="h-3 w-3 text-green-600" />
            ) : (
              <AlertTriangle className="h-3 w-3 text-red-600" />
            )}
            <span className={`font-medium ${isCompliant ? 'text-green-600' : 'text-red-600'}`}>
              {unbPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          <Progress 
            value={unbPercentage} 
            className={`h-2 ${isCompliant ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mín. 33,3%</span>
            <span className={isCompliant ? 'text-green-600' : 'text-red-600'}>
              {isCompliant ? 'Conforme' : 'Não conforme'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
