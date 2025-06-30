
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function MaturityScoreInfo() {
  const maturityLevels = [
    {
      range: "0 - 1.0",
      level: "Não estabelecido",
      description: "Práticas não definidas ou inexistentes",
      color: "bg-red-100 text-red-800 border-red-200"
    },
    {
      range: "1.1 - 2.0", 
      level: "Em desenvolvimento",
      description: "Práticas em fase inicial de implementação",
      color: "bg-orange-100 text-orange-800 border-orange-200"
    },
    {
      range: "2.1 - 3.0",
      level: "Essencial", 
      description: "Práticas básicas implementadas",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    },
    {
      range: "3.1 - 4.0",
      level: "Consolidado",
      description: "Práticas bem estabelecidas e funcionais",
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      range: "4.1 - 5.0",
      level: "Avançado",
      description: "Práticas otimizadas e em melhoria contínua",
      color: "bg-green-100 text-green-800 border-green-200"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Sistema de Pontuação de Maturidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {maturityLevels.map((level, index) => (
            <div key={index} className="space-y-2">
              <Badge className={`${level.color} font-semibold`}>
                {level.range}
              </Badge>
              <div>
                <h4 className="font-medium text-sm">{level.level}</h4>
                <p className="text-xs text-muted-foreground">{level.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Como funciona:</strong> Cada pergunta tem opções de resposta com níveis de 1 a 5. 
            A pontuação final é calculada com base na média ponderada das respostas, 
            resultando em uma classificação de maturidade para cada categoria.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
