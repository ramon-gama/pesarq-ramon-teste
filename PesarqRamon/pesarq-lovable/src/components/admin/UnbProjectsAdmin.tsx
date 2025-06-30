
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export function UnbProjectsAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <GraduationCap className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Administração Projetos UnB</h1>
          <p className="text-muted-foreground">
            Gerencie configurações dos projetos de pesquisa da UnB
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento Projetos UnB</CardTitle>
          <CardDescription>
            Configure parâmetros dos projetos de pesquisa e controle de frequência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4" />
            <p>Funcionalidade de gerenciamento de projetos UnB em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
