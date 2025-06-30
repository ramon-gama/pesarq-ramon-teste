
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, User, Archive } from "lucide-react";

export function OrganizationalAdmin() {
  const [activeTab, setActiveTab] = useState("organizations");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Administração Organizacional</h1>
          <p className="text-muted-foreground">
            Gerencie organizações, setores, equipes e fundos arquivísticos
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="organizations" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organizações
          </TabsTrigger>
          <TabsTrigger value="sectors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Setores
          </TabsTrigger>
          <TabsTrigger value="authorities" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Autoridades
          </TabsTrigger>
          <TabsTrigger value="funds" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Fundos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Organizações</CardTitle>
              <CardDescription>
                Administre organizações e suas configurações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4" />
                <p>Funcionalidade de gerenciamento de organizações em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Setores</CardTitle>
              <CardDescription>
                Administre setores organizacionais e hierarquias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>Funcionalidade de gerenciamento de setores em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authorities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Autoridades</CardTitle>
              <CardDescription>
                Administre autoridades e responsáveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4" />
                <p>Funcionalidade de gerenciamento de autoridades em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Fundos Arquivísticos</CardTitle>
              <CardDescription>
                Administre fundos e coleções documentais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Archive className="h-12 w-12 mx-auto mb-4" />
                <p>Funcionalidade de gerenciamento de fundos em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
