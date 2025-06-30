
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Upload, Search, Eye, Edit, Plus, Calendar } from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: "TED" | "Convenio" | "Contrato" | "Plano";
  organization: string;
  project: string;
  status: "draft" | "review" | "signed" | "executed";
  value?: number;
  documentNumber?: string;
  signedDate?: string;
  expiryDate?: string;
  fileUrl?: string;
  version: number;
}

export function DocumentsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  const documents: Document[] = [
    {
      id: "1",
      title: "TED Modernização Sistema Digital",
      type: "TED",
      organization: "Ministério da Cultura",
      project: "Modernização do Sistema de Arquivo Digital",
      status: "signed",
      value: 250000,
      documentNumber: "TED 001/2024",
      signedDate: "2024-01-10",
      expiryDate: "2024-12-31",
      fileUrl: "/documents/ted-001-2024.pdf",
      version: 2
    },
    {
      id: "2",
      title: "Plano de Trabalho - Capacitação Arquivística",
      type: "Plano",
      organization: "Tribunal de Contas da União",
      project: "Capacitação em Gestão Arquivística",
      status: "review",
      version: 1
    },
    {
      id: "3",
      title: "Convênio Diagnóstico de Acervo",
      type: "Convenio",
      organization: "Instituto Nacional de Pesquisas",
      project: "Diagnóstico de Acervo Histórico",
      status: "executed",
      value: 180000,
      documentNumber: "CV 002/2024",
      signedDate: "2023-12-15",
      expiryDate: "2024-05-31",
      fileUrl: "/documents/cv-002-2024.pdf",
      version: 1
    },
    {
      id: "4",
      title: "Contrato de Consultoria Técnica",
      type: "Contrato",
      organization: "Agência Nacional de Águas",
      project: "Implementação de Sistema de Gestão",
      status: "draft",
      value: 320000,
      version: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Rascunho</Badge>;
      case "review":
        return <Badge className="bg-blue-100 text-blue-800">Em Análise</Badge>;
      case "signed":
        return <Badge className="bg-green-100 text-green-800">Assinado</Badge>;
      case "executed":
        return <Badge className="bg-purple-100 text-purple-800">Executado</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "TED":
        return <Badge className="bg-purple-100 text-purple-800">TED</Badge>;
      case "Convenio":
        return <Badge className="bg-orange-100 text-orange-800">Convênio</Badge>;
      case "Contrato":
        return <Badge className="bg-indigo-100 text-indigo-800">Contrato</Badge>;
      case "Plano":
        return <Badge className="bg-cyan-100 text-cyan-800">Plano de Trabalho</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold">Documentos e Instrumentos Jurídicos</h3>
          <p className="text-sm text-gray-600">Gerencie TEDs, Convênios, Contratos e Planos de Trabalho</p>
        </div>
        <Button className="bg-[#15AB92] hover:bg-[#0d8f7a]">
          <Plus className="h-4 w-4 mr-2" />
          Novo Documento
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="TED">TED</SelectItem>
            <SelectItem value="Convenio">Convênio</SelectItem>
            <SelectItem value="Contrato">Contrato</SelectItem>
            <SelectItem value="Plano">Plano de Trabalho</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="review">Em Análise</SelectItem>
            <SelectItem value="signed">Assinado</SelectItem>
            <SelectItem value="executed">Executado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Documentos */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileText className="h-5 w-5 text-[#15AB92] flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900 truncate">{document.title}</h4>
                    {getTypeBadge(document.type)}
                    {getStatusBadge(document.status)}
                  </div>
                  <div className="flex gap-2">
                    {document.fileUrl && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Organização:</span>
                    <p className="text-gray-900">{document.organization}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Projeto:</span>
                    <p className="text-gray-900">{document.project}</p>
                  </div>
                  {document.value && (
                    <div>
                      <span className="font-medium text-gray-600">Valor:</span>
                      <p className="text-gray-900">R$ {document.value.toLocaleString('pt-BR')}</p>
                    </div>
                  )}
                  {document.documentNumber && (
                    <div>
                      <span className="font-medium text-gray-600">Número:</span>
                      <p className="text-gray-900">{document.documentNumber}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-600">Versão:</span>
                    <p className="text-gray-900">v{document.version}</p>
                  </div>
                </div>

                {/* Dates */}
                {(document.signedDate || document.expiryDate) && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    {document.signedDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span>Assinado em: {new Date(document.signedDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    {document.expiryDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-red-500" />
                        <span>Vencimento: {new Date(document.expiryDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum documento encontrado</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                ? "Ajuste os filtros para ver mais resultados"
                : "Comece criando um novo documento"
              }
            </p>
            <Button className="bg-[#15AB92] hover:bg-[#0d8f7a]">
              <Plus className="h-4 w-4 mr-2" />
              Novo Documento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
