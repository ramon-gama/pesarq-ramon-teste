
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Calendar, Users, Eye, Edit } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  cnpj: string;
  type: string;
  status: "prospecting" | "active" | "completed";
  proposals: number;
  activeProjects: number;
  lastContact: string;
  contact: string;
}

interface OrganizationsDashboardProps {
  stats: {
    totalOrganizations: number;
    activeProposals: number;
    activeProjects: number;
    completedProjects: number;
  };
}

export function OrganizationsDashboard({ stats }: OrganizationsDashboardProps) {
  // Mock data
  const organizations: Organization[] = [
    {
      id: "1",
      name: "Ministério da Cultura",
      cnpj: "00.123.456/0001-78",
      type: "Órgão Federal",
      status: "active",
      proposals: 2,
      activeProjects: 1,
      lastContact: "2024-06-05",
      contact: "João Silva"
    },
    {
      id: "2",
      name: "Tribunal de Contas da União",
      cnpj: "00.987.654/0001-32",
      type: "Órgão de Controle",
      status: "prospecting",
      proposals: 1,
      activeProjects: 0,
      lastContact: "2024-06-03",
      contact: "Maria Santos"
    },
    {
      id: "3",
      name: "Instituto Nacional de Pesquisas",
      cnpj: "00.456.789/0001-90",
      type: "Autarquia",
      status: "completed",
      proposals: 0,
      activeProjects: 0,
      lastContact: "2024-05-20",
      contact: "Carlos Oliveira"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "prospecting":
        return <Badge className="bg-blue-100 text-blue-800">Prospecção</Badge>;
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Concluído</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#15AB92]" />
            Resumo Executivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#15AB92]">{stats.totalOrganizations}</p>
              <p className="text-sm text-gray-600">Organizações</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.activeProposals}</p>
              <p className="text-sm text-gray-600">Propostas Ativas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.activeProjects}</p>
              <p className="text-sm text-gray-600">Projetos em Andamento</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.completedProjects}</p>
              <p className="text-sm text-gray-600">Projetos Concluídos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Organizações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Organizações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {organizations.map((org) => (
              <div key={org.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{org.name}</h3>
                      {getStatusBadge(org.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">CNPJ:</span> {org.cnpj}
                      </div>
                      <div>
                        <span className="font-medium">Tipo:</span> {org.type}
                      </div>
                      <div>
                        <span className="font-medium">Contato:</span> {org.contact}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span>{org.proposals} propostas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-green-600" />
                        <span>{org.activeProjects} projetos ativos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Último contato: {new Date(org.lastContact).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
