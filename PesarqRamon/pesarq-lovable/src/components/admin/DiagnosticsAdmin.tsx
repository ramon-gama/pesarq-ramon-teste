
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export function DiagnosticsAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Administração de Diagnósticos</h1>
          <p className="text-muted-foreground">
            Gerencie formulários de diagnóstico e configurações
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Diagnósticos</CardTitle>
          <CardDescription>
            Configure formulários de diagnóstico arquivístico e setorial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto mb-4" />
            <p>Funcionalidade de gerenciamento de diagnósticos em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
