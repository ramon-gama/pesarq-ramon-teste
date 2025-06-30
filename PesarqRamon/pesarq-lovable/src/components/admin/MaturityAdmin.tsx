
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoriesAdmin } from "./maturity/CategoriesAdmin";
import { SubcategoriesAdmin } from "./maturity/SubcategoriesAdmin";
import { QuestionsAdmin } from "./maturity/QuestionsAdmin";
import { ResponseOptionsAdmin } from "./maturity/ResponseOptionsAdmin";
import { MaturityScoreInfo } from "./maturity/MaturityScoreInfo";
import { Target, MessageSquare, HelpCircle, CheckSquare } from "lucide-react";

export function MaturityAdmin() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Administração - Avaliação de Maturidade</h1>
          <p className="text-muted-foreground">
            Gerencie categorias, subcategorias, perguntas e respostas do sistema de avaliação
          </p>
        </div>
      </div>

      <MaturityScoreInfo />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="subcategories" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Subcategorias
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Perguntas
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Respostas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Categorias</CardTitle>
              <CardDescription>
                Crie e edite as categorias principais da avaliação de maturidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoriesAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subcategories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Subcategorias</CardTitle>
              <CardDescription>
                Crie e edite as subcategorias de cada categoria principal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubcategoriesAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Perguntas</CardTitle>
              <CardDescription>
                Crie e edite as perguntas de cada subcategoria, incluindo tipos de deficiência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionsAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Opções de Resposta</CardTitle>
              <CardDescription>
                Crie e edite as opções de resposta para cada pergunta, incluindo feedback e pesos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponseOptionsAdmin />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
