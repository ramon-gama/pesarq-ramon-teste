
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Link, Bell } from "lucide-react";
import { AccessRequestsAdmin } from "./AccessRequestsAdmin";
import { PermissionsManagement } from "./PermissionsManagement";
import { NotificationsPanel } from "./NotificationsPanel";
import { UsersManagement } from "./UsersManagement";

export function UsersAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Administração de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, permissões e controle de acesso
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <UserPlus className="h-4 w-4 mr-2" />
            Gerenciar Usuários
          </TabsTrigger>
          <TabsTrigger value="requests">
            <UserPlus className="h-4 w-4 mr-2" />
            Solicitações de Acesso
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Link className="h-4 w-4 mr-2" />
            Vínculos de Pesquisadores
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="requests">
          <AccessRequestsAdmin />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsManagement />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
