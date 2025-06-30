
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Lock } from "lucide-react";

interface MaturityCalculatorProps {
  isDemo?: boolean;
  onLoginRequired?: () => void;
}

export function MaturityCalculator({ isDemo = true, onLoginRequired }: MaturityCalculatorProps) {
  const [results, setResults] = useState<any>(null);

  // Demo results for preview
  const demoResults = {
    overallScore: 65,
    level: "Intermediário",
    levelColor: "bg-yellow-500",
    categories: [
      { name: "Políticas e Procedimentos", score: 70, level: "Bom" },
      { name: "Infraestrutura Tecnológica", score: 85, level: "Excelente" },
      { name: "Gestão de Documentos", score: 60, level: "Regular" },
      { name: "Preservação Digital", score: 45, level: "Precário" },
      { name: "Capacitação de Pessoal", score: 75, level: "Bom" }
    ],
    recommendations: [
      "Implementar políticas de preservação digital",
      "Investir em capacitação técnica da equipe",
      "Revisar processos de classificação documental"
    ]
  };

  const handleCalculate = () => {
    if (isDemo && onLoginRequired) {
      onLoginRequired();
      return;
    }
    setResults(demoResults);
  };

  const getLevelColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getLevelText = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Regular";
    return "Precário";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Avaliação Rápida</CardTitle>
            <CardDescription>
              Exemplo de avaliação (faça login para personalizar)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Tamanho da Organização</Label>
                <Select disabled={isDemo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Grande (exemplo)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequena (até 100 funcionários)</SelectItem>
                    <SelectItem value="medium">Média (100-500 funcionários)</SelectItem>
                    <SelectItem value="large">Grande (500+ funcionários)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Setor de Atuação</Label>
                <Select disabled={isDemo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Público (exemplo)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Público</SelectItem>
                    <SelectItem value="private">Privado</SelectItem>
                    <SelectItem value="mixed">Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Volume Documental (metros lineares)</Label>
                <Input 
                  type="number" 
                  placeholder="1000 (exemplo)"
                  disabled={isDemo}
                />
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              <Lock className="mr-2 h-4 w-4" />
              Fazer Login para Avaliar
            </Button>
          </CardContent>
        </Card>

        {/* Results Section - Always showing demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#15AB92]" />
              Exemplo de Resultado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 mb-4">
                <p className="text-sm text-orange-800 font-medium">
                  📊 Exemplo de avaliação de maturidade
                </p>
              </div>

              {/* Overall Score */}
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold text-[#15AB92] mb-2">
                  {demoResults.overallScore}%
                </div>
                <Badge className={`${demoResults.levelColor} text-white`}>
                  Nível {demoResults.level}
                </Badge>
                <Progress value={demoResults.overallScore} className="mt-3" />
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-semibold">Avaliação por Categoria</h4>
                {demoResults.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{category.score}%</span>
                      <Badge 
                        variant="outline" 
                        className={`${getLevelColor(category.score)} text-white border-none`}
                      >
                        {getLevelText(category.score)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recomendações de Melhoria
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {demoResults.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 font-medium text-center">
                  🔓 Faça login para uma avaliação detalhada e personalizada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
