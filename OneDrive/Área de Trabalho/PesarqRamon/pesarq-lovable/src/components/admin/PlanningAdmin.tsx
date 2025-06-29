
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function PlanningAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Administração de Planejamento</h1>
          <p className="text-muted-foreground">
            Gerencie planejamento estratégico e controle de tarefas
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Planejamento</CardTitle>
          <CardDescription>
            Configure planos estratégicos, objetivos e controle de tarefas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <p>Funcionalidade de gerenciamento de planejamento em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
