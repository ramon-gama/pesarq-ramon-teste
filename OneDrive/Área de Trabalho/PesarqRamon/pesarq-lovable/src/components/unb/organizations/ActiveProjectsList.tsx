
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, Calendar, Users, DollarSign, Search, Eye, Edit, FileText } from "lucide-react";

interface ActiveProject {
  id: string;
  title: string;
  organization: string;
  status: "active" | "paused" | "completed";
  progress: number;
  value: number;
  startDate: string;
  endDate: string;
  responsible: string;
  team: number;
  deliverables: number;
  completedDeliverables: number;
  documentType: "TED" | "Convenio" | "Contrato";
  documentNumber: string;
}

export function ActiveProjectsList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const projects: ActiveProject[] = [
    {
      id: "1",
      title: "Modernização do Sistema de Arquivo Digital",
      organization: "Ministério da Cultura",
      status: "active",
      progress: 65,
      value: 250000,
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      responsible: "Carlos Leite",
      team: 5,
      deliverables: 8,
      completedDeliverables: 5,
      documentType: "TED",
      documentNumber: "TED 001/2024"
    },
    {
      id: "2",
      title: "Capacitação em Gestão Arquivística",
      organization: "Tribunal de Contas da União",
      status: "active",
      progress: 30,
      value: 150000,
      startDate: "2024-03-01",
      endDate: "2024-11-30",
      responsible: "Ana Silva",
      team: 3,
      deliverables: 6,
      completedDeliverables: 2,
      documentType: "Convenio",
      documentNumber: "CV 002/2024"
    },
    {
      id: "3",
      title: "Diagnóstico de Acervo Histórico",
      organization: "Instituto Nacional de Pesquisas",
      status: "completed",
      progress: 100,
      value: 180000,
      startDate: "2024-01-01",
      endDate: "2024-05-31",
      responsible: "João Santos",
      team: 4,
      deliverables: 5,
      completedDeliverables: 5,
      documentType: "Contrato",
      documentNumber: "CT 003/2024"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Pausado</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Concluído</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getDocumentBadge = (type: string) => {
    switch (type) {
      case "TED":
        return <Badge className="bg-purple-100 text-purple-800">TED</Badge>;
      case "Convenio":
        return <Badge className="bg-orange-100 text-orange-800">Convênio</Badge>;
      case "Contrato":
        return <Badge className="bg-indigo-100 text-indigo-800">Contrato</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold">Projetos Ativos</h3>
          <p className="text-sm text-gray-600">Acompanhe o progresso dos projetos em execução</p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por título ou organização..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Projetos */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FolderOpen className="h-5 w-5 text-[#15AB92] flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900 truncate">{project.title}</h4>
                    {getStatusBadge(project.status)}
                    {getDocumentBadge(project.documentType)}
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

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Organização:</span>
                    <p className="text-gray-900">{project.organization}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Responsável:</span>
                    <p className="text-gray-900">{project.responsible}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Valor:</span>
                    <p className="text-gray-900">R$ {project.value.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Documento:</span>
                    <p className="text-gray-900">{project.documentNumber}</p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Progresso</span>
                    <span className="text-sm text-gray-900">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{project.team} membros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{project.completedDeliverables}/{project.deliverables} entregas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Fim: {new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? "Ajuste o termo de busca para ver mais resultados"
                : "Os projetos aprovados aparecerão aqui"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
