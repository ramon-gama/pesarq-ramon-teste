import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  BookOpen, 
  Search, 
  Plus, 
  FileText, 
  Building2, 
  Clock, 
  Archive,
  Edit,
  Eye,
  Filter,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Shield
} from "lucide-react";

interface DocumentTypesWikiProps {
  isDemo?: boolean;
  onLoginRequired?: () => void;
}

export function DocumentTypesWiki({ isDemo = false, onLoginRequired }: DocumentTypesWikiProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [viewMode, setViewMode] = useState("cards");

  const documentTypes = [
    {
      id: 1,
      name: "Ata de Reunião",
      description: "Documento que registra as discussões e deliberações de reuniões",
      producer: "Secretarias e Gabinetes",
      sector: "Administrativo",
      family: "Documentos de Gestão",
      species: "Ata",
      genre: "Textual",
      support: "Papel/Digital",
      function: "Registro de Decisões",
      system: "Sistema de Reuniões",
      temporality: "5 anos",
      destination: "Eliminação",
      secrecy: "Público",
      category: "administrativo",
      organization: "Ministério da Educação"
    },
    {
      id: 2,
      name: "Processo de Compra",
      description: "Conjunto de documentos relacionados a aquisições de bens e serviços",
      producer: "Setor de Compras",
      sector: "Financeiro",
      family: "Documentos Financeiros",
      species: "Processo",
      genre: "Textual",
      support: "Papel/Digital",
      function: "Comprovação de Aquisição",
      system: "Sistema de Compras",
      temporality: "10 anos",
      destination: "Guarda Permanente",
      secrecy: "Restrito",
      category: "financeiro",
      organization: "Ministério da Fazenda"
    },
    {
      id: 3,
      name: "Ficha Funcional",
      description: "Documento com dados pessoais e profissionais do servidor",
      producer: "Recursos Humanos",
      sector: "Gestão de Pessoas",
      family: "Documentos de Pessoal",
      species: "Ficha",
      genre: "Textual",
      support: "Papel/Digital",
      function: "Controle de Pessoal",
      system: "Sistema de RH",
      temporality: "Permanente",
      destination: "Guarda Permanente",
      secrecy: "Sigiloso",
      category: "pessoal",
      organization: "Ministério do Planejamento"
    },
    {
      id: 4,
      name: "Relatório de Atividades",
      description: "Documento que apresenta as atividades realizadas em determinado período",
      producer: "Todas as Unidades",
      sector: "Administrativo",
      family: "Documentos de Gestão",
      species: "Relatório",
      genre: "Textual",
      support: "Digital",
      function: "Prestação de Contas",
      system: "Sistema de Gestão",
      temporality: "5 anos",
      destination: "Guarda Permanente",
      secrecy: "Público",
      category: "administrativo",
      organization: "Ministério da Saúde"
    },
    {
      id: 5,
      name: "Contrato de Prestação de Serviços",
      description: "Instrumento formal de contratação de serviços",
      producer: "Departamento Jurídico",
      sector: "Jurídico",
      family: "Documentos Jurídicos",
      species: "Contrato",
      genre: "Textual",
      support: "Papel/Digital",
      function: "Formalização Contratual",
      system: "Sistema Jurídico",
      temporality: "20 anos",
      destination: "Guarda Permanente",
      secrecy: "Restrito",
      category: "juridico",
      organization: "Ministério da Justiça"
    },
    {
      id: 6,
      name: "Prontuário Médico",
      description: "Conjunto de informações sobre atendimento médico",
      producer: "Unidades de Saúde",
      sector: "Saúde",
      family: "Documentos Médicos",
      species: "Prontuário",
      genre: "Textual",
      support: "Digital",
      function: "Registro Médico",
      system: "Sistema de Saúde",
      temporality: "20 anos",
      destination: "Guarda Permanente",
      secrecy: "Sigiloso",
      category: "saude",
      organization: "Ministério da Saúde"
    }
  ];

  const categories = [
    { id: "todos", name: "Todos", count: documentTypes.length },
    { id: "administrativo", name: "Administrativo", count: documentTypes.filter(d => d.category === "administrativo").length },
    { id: "financeiro", name: "Financeiro", count: documentTypes.filter(d => d.category === "financeiro").length },
    { id: "pessoal", name: "Pessoal", count: documentTypes.filter(d => d.category === "pessoal").length },
    { id: "juridico", name: "Jurídico", count: documentTypes.filter(d => d.category === "juridico").length },
    { id: "saude", name: "Saúde", count: documentTypes.filter(d => d.category === "saude").length }
  ];

  const filteredDocuments = documentTypes.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Dados para gráficos
  const destinationData = [
    { name: "Guarda Permanente", value: documentTypes.filter(d => d.destination === "Guarda Permanente").length, color: "#15AB92" },
    { name: "Eliminação", value: documentTypes.filter(d => d.destination === "Eliminação").length, color: "#ef4444" }
  ];

  const secrecyData = [
    { name: "Público", value: documentTypes.filter(d => d.secrecy === "Público").length, color: "#10b981" },
    { name: "Restrito", value: documentTypes.filter(d => d.secrecy === "Restrito").length, color: "#f59e0b" },
    { name: "Sigiloso", value: documentTypes.filter(d => d.secrecy === "Sigiloso").length, color: "#ef4444" }
  ];

  const organizationData = documentTypes.reduce((acc, doc) => {
    const existing = acc.find(item => item.name === doc.organization);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: doc.organization, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]).sort((a, b) => b.count - a.count);

  const categoryData = categories.filter(cat => cat.id !== "todos").map(cat => ({
    name: cat.name,
    count: cat.count
  }));

  const COLORS = ['#15AB92', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6 text-[#15AB92]" />
            Wiki de Tipos Documentais do Brasil
          </CardTitle>
          <CardDescription>
            Base colaborativa dos principais tipos documentais das organizações brasileiras
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="cards">Cartões</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-80 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar tipos documentais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-[#15AB92] hover:bg-[#0d8f7a]">
              <Plus className="h-4 w-4 mr-2" />
              Contribuir
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-[#15AB92] hover:bg-[#0d8f7a]" : ""}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#15AB92]" />
                        {doc.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {doc.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Órgão:</span>
                        <p className="text-slate-600">{doc.organization}</p>
                      </div>
                      <div>
                        <span className="font-medium">Setor:</span>
                        <p className="text-slate-600">{doc.sector}</p>
                      </div>
                      <div>
                        <span className="font-medium">Espécie:</span>
                        <p className="text-slate-600">{doc.species}</p>
                      </div>
                      <div>
                        <span className="font-medium">Temporalidade:</span>
                        <p className="text-slate-600">{doc.temporality}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        <Building2 className="h-3 w-3 mr-1" />
                        {doc.family}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          doc.destination === "Guarda Permanente" 
                            ? "border-green-500 text-green-700" 
                            : "border-red-500 text-red-700"
                        }`}
                      >
                        <Archive className="h-3 w-3 mr-1" />
                        {doc.destination}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          doc.secrecy === "Público" ? "border-green-500 text-green-700" :
                          doc.secrecy === "Restrito" ? "border-yellow-500 text-yellow-700" :
                          "border-red-500 text-red-700"
                        }`}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {doc.secrecy}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Tipo Documental</th>
                      <th className="p-4 font-medium">Organização</th>
                      <th className="p-4 font-medium">Categoria</th>
                      <th className="p-4 font-medium">Temporalidade</th>
                      <th className="p-4 font-medium">Destinação</th>
                      <th className="p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map(doc => (
                      <tr key={doc.id} className="border-t hover:bg-slate-50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-slate-600">{doc.description}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{doc.organization}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">
                            {doc.family}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">{doc.temporality}</td>
                        <td className="p-4">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              doc.destination === "Guarda Permanente" 
                                ? "border-green-500 text-green-700" 
                                : "border-red-500 text-red-700"
                            }`}
                          >
                            {doc.destination}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Destinação Final */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[#15AB92]" />
                  Destinação Final
                </CardTitle>
                <CardDescription>
                  Distribuição dos tipos documentais por destinação final
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={destinationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {destinationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Grau de Sigilo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#15AB92]" />
                  Grau de Sigilo
                </CardTitle>
                <CardDescription>
                  Distribuição dos tipos documentais por grau de sigilo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={secrecyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {secrecyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Organizações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#15AB92]" />
                  Tipos por Organização
                </CardTitle>
                <CardDescription>
                  Organizações com maior número de tipos documentais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={organizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#15AB92" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Categorias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#15AB92]" />
                  Distribuição por Categoria
                </CardTitle>
                <CardDescription>
                  Quantidade de tipos documentais por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#15AB92" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas Gerais */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Estatísticas Gerais da Base</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#15AB92]">{documentTypes.length}</p>
                  <p className="text-sm text-slate-600">Total de Tipos</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#15AB92]">{categories.length - 1}</p>
                  <p className="text-sm text-slate-600">Categorias</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#15AB92]">{organizationData.length}</p>
                  <p className="text-sm text-slate-600">Organizações</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#15AB92]">
                    {Math.round((destinationData.find(d => d.name === "Guarda Permanente")?.value || 0) / documentTypes.length * 100)}%
                  </p>
                  <p className="text-sm text-slate-600">Guarda Permanente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600 mb-4">Nenhum tipo documental encontrado</p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Novo Tipo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Contribution Info */}
      <Card className="bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-semibold text-blue-900 mb-2">Contribua com a Base de Conhecimento</h3>
            <p className="text-blue-800 mb-4">
              Ajude a enriquecer esta base de dados adicionando novos tipos documentais ou 
              melhorando as informações existentes.
            </p>
            <Button className="bg-[#15AB92] hover:bg-[#0d8f7a]">
              <Plus className="h-4 w-4 mr-2" />
              Contribuir Agora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
