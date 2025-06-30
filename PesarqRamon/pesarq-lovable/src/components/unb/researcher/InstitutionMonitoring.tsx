
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Users, Building } from "lucide-react";

interface Researcher {
  id: string;
  name: string;
  institution: string;
  isActive: boolean;
  projectId: string;
}

interface InstitutionMonitoringProps {
  researchers: Researcher[];
  selectedProjectId?: string;
}

export function InstitutionMonitoring({ researchers, selectedProjectId }: InstitutionMonitoringProps) {
  // Filtra pesquisadores ativos e do projeto selecionado (se houver)
  const activeResearchers = researchers.filter(r => 
    r.isActive && (!selectedProjectId || r.projectId === selectedProjectId)
  );

  const unbResearchers = activeResearchers.filter(r => 
    r.institution === "Universidade de Brasília (UnB)"
  );
  
  const otherResearchers = activeResearchers.filter(r => 
    r.institution !== "Universidade de Brasília (UnB)"
  );

  const totalResearchers = activeResearchers.length;
  const unbCount = unbResearchers.length;
  const otherCount = otherResearchers.length;
  
  const unbPercentage = totalResearchers > 0 ? (unbCount / totalResearchers) * 100 : 0;
  const otherPercentage = totalResearchers > 0 ? (otherCount / totalResearchers) * 100 : 0;
  
  // Verificação da regra: pelo menos 1/3 deve ser da UnB
  const requiredUnbPercentage = 33.33;
  const isCompliant = unbPercentage >= requiredUnbPercentage;
  
  // Cálculo de quantos pesquisadores da UnB são necessários para compliance
  const minUnbRequired = Math.ceil(totalResearchers / 3);
  const unbNeeded = Math.max(0, minUnbRequired - unbCount);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pesquisadores</p>
                <p className="text-2xl font-bold text-blue-600">{totalResearchers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pesquisadores UnB</p>
                <p className="text-2xl font-bold text-[#15AB92]">{unbCount}</p>
                <p className="text-xs text-gray-500">{unbPercentage.toFixed(1)}%</p>
              </div>
              <Building className="h-8 w-8 text-[#15AB92]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outras Instituições</p>
                <p className="text-2xl font-bold text-orange-600">{otherCount}</p>
                <p className="text-xs text-gray-500">{otherPercentage.toFixed(1)}%</p>
              </div>
              <Building className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5" />
            Distribuição por Instituição
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>UnB (mínimo 33,3%)</span>
              <span>{unbPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={unbPercentage} className="h-3" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Outras Instituições (máximo 66,7%)</span>
              <span>{otherPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={otherPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Alerta de Conformidade */}
      {totalResearchers > 0 && (
        <Alert className={isCompliant ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <div className="flex items-center gap-2">
            {isCompliant ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle className={isCompliant ? "text-green-800" : "text-red-800"}>
              {isCompliant ? "Conformidade Normativa Atendida" : "Atenção: Conformidade Normativa"}
            </AlertTitle>
          </div>
          <AlertDescription className={isCompliant ? "text-green-700" : "text-red-700"}>
            {isCompliant ? (
              `A proporção de pesquisadores da UnB (${unbPercentage.toFixed(1)}%) está acima do mínimo exigido de 33,3%.`
            ) : (
              `É necessário ter pelo menos ${minUnbRequired} pesquisador(es) da UnB. Atualmente há ${unbCount} da UnB e ${unbNeeded} a mais são necessários para atender à norma.`
            )}
          </AlertDescription>
        </Alert>
      )}

      {totalResearchers === 0 && (
        <Alert>
          <Users className="h-4 w-4" />
          <AlertTitle>Nenhum Pesquisador Cadastrado</AlertTitle>
          <AlertDescription>
            Cadastre pesquisadores para monitorar a conformidade normativa da distribuição institucional.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
