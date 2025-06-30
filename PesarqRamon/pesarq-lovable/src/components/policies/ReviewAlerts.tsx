
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Calendar, Bell } from "lucide-react";

const mockAlerts = [
  {
    id: 1,
    title: "Política de Segurança da Informação",
    type: "Política",
    daysOverdue: 15,
    lastReview: "15/03/2021",
    nextReview: "15/03/2024",
    priority: "alta",
    responsible: "TI - Segurança"
  },
  {
    id: 2,
    title: "Manual de Arquivamento",
    type: "Manual",
    daysToReview: 30,
    lastReview: "20/01/2022",
    nextReview: "20/01/2025",
    priority: "media",
    responsible: "Arquivo Setorial"
  },
  {
    id: 3,
    title: "Instrução Normativa de Digitalização",
    type: "Instrução Normativa",
    daysToReview: 7,
    lastReview: "10/06/2022",
    nextReview: "10/01/2025",
    priority: "alta",
    responsible: "Gestão Documental"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "alta": return "bg-red-100 text-red-800 border-red-200";
    case "media": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "baixa": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "alta": return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "media": return <Clock className="h-4 w-4 text-yellow-600" />;
    default: return <Bell className="h-4 w-4 text-blue-600" />;
  }
};

export function ReviewAlerts() {
  const overdueAlerts = mockAlerts.filter(alert => alert.daysOverdue);
  const upcomingAlerts = mockAlerts.filter(alert => alert.daysToReview && alert.daysToReview <= 30);

  if (overdueAlerts.length === 0 && upcomingAlerts.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Alertas de Revisão
        </CardTitle>
        <CardDescription className="text-orange-700">
          Normas que precisam de atenção para revisão ou estão próximas do vencimento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Normas em atraso */}
          {overdueAlerts.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Revisões em Atraso ({overdueAlerts.length})
              </h4>
              <div className="space-y-2">
                {overdueAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-red-900">{alert.title}</p>
                      <p className="text-sm text-red-700">
                        {alert.daysOverdue} dias em atraso • Responsável: {alert.responsible}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-red-100 text-red-800">
                        {alert.daysOverdue} dias
                      </Badge>
                      <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                        Revisar Agora
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Normas próximas ao vencimento */}
          {upcomingAlerts.length > 0 && (
            <div>
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Revisões Próximas ({upcomingAlerts.length})
              </h4>
              <div className="space-y-2">
                {upcomingAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-yellow-900">{alert.title}</p>
                      <p className="text-sm text-yellow-700">
                        Vence em {alert.daysToReview} dias • Responsável: {alert.responsible}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {alert.daysToReview} dias
                      </Badge>
                      <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300">
                        Programar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botão para ver todos os alertas */}
          <div className="pt-4 border-t border-orange-200">
            <Button variant="outline" className="w-full text-orange-700 border-orange-300">
              <Calendar className="h-4 w-4 mr-2" />
              Ver Cronograma Completo de Revisões
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
