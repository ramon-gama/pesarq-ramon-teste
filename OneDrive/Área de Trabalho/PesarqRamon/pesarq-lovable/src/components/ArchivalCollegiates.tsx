import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";

export function ArchivalCollegiates() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">Gestão de comissões e grupos de trabalho</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Colegiado
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">Comissão de Avaliação</CardTitle>
                  <CardDescription>Responsável pela avaliação de documentos</CardDescription>
                </div>
              </div>
              <Badge>Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">5 membros • Próxima reunião: 05/04/2024</p>
              <Button variant="outline" className="w-full">Gerenciar</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle className="text-lg">Grupo de Normalização</CardTitle>
                  <CardDescription>Desenvolvimento de normas e procedimentos</CardDescription>
                </div>
              </div>
              <Badge>Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">8 membros • Última reunião: 20/03/2024</p>
              <Button variant="outline" className="w-full">Gerenciar</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <CardTitle className="text-lg">Comitê de Digitalização</CardTitle>
                  <CardDescription>Coordenação de projetos de digitalização</CardDescription>
                </div>
              </div>
              <Badge variant="outline">Inativo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">3 membros • Sem reuniões agendadas</p>
              <Button variant="outline" className="w-full">Reativar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
