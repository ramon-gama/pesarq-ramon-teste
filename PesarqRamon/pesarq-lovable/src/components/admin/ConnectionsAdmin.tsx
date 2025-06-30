
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function ConnectionsAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Administração de Conexões</h1>
          <p className="text-muted-foreground">
            Gerencie sistema de conexões e moderação de conteúdo
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Conexões</CardTitle>
          <CardDescription>
            Modere posts, gerencie tópicos em tendência e configurações sociais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4" />
            <p>Funcionalidade de gerenciamento de conexões em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
