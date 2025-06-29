
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMaturityLevel } from "./MaturityCategories";

const recentEvaluations = [
  {
    id: "1",
    title: "Avaliação FAIM - Ministério da Saúde",
    date: "15/11/2024",
    status: "Concluída",
    score: 3.4,
    evaluator: "Arquivo Central",
    scope: "Organizacional"
  },
  {
    id: "2", 
    title: "Avaliação FAIM - MIDR",
    date: "15/08/2024",
    status: "Concluída",
    score: 3.1,
    evaluator: "Coordenação de Arquivo",
    scope: "Organizacional"
  },
  {
    id: "3",
    title: "Avaliação FAIM - Ibama (Setor Jurídico)",
    date: "15/05/2024",
    status: "Concluída",
    score: 2.9,
    evaluator: "Arquivo Setorial Jurídico",
    scope: "Setorial"
  }
];

export function MaturityHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Avaliações</CardTitle>
        <CardDescription>
          Últimas avaliações realizadas por organizações (principalmente pelo setor de arquivo)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEvaluations.map((evaluation) => {
            const maturity = getMaturityLevel(evaluation.score);
            return (
              <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{evaluation.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {evaluation.date} • Avaliador: {evaluation.evaluator}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {evaluation.scope}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{evaluation.score}/5.0</p>
                    <Badge variant="outline" className={`${maturity.color} text-white border-0`}>
                      {maturity.level}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
