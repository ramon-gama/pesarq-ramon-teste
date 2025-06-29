
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function DocumentAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Administração Documental</h1>
          <p className="text-muted-foreground">
            Gerencie tipos de documentos, classificação e políticas
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento Documental</CardTitle>
          <CardDescription>
            Configure tipos de documentos, classificação e temporalidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>Funcionalidade de gerenciamento documental em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
