
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Download, Eye, Star, Search, Filter } from "lucide-react";
import { useState } from "react";

const mockTemplates = [
  {
    id: 1,
    title: "Modelo de Política de Gestão Documental",
    category: "Política",
    organ: "Arquivo Nacional",
    description: "Template padrão para elaboração de políticas de gestão documental em órgãos públicos",
    downloads: 142,
    rating: 4.8,
    lastUpdate: "15/11/2024",
    tags: ["gestão documental", "política", "template"]
  },
  {
    id: 2,
    title: "Template de Plano de Classificação",
    category: "Instrução Normativa",
    organ: "CGU",
    description: "Modelo estruturado para criação de planos de classificação documental",
    downloads: 89,
    rating: 4.6,
    lastUpdate: "10/10/2024",
    tags: ["classificação", "plano", "estrutura"]
  },
  {
    id: 3,
    title: "Manual de Preservação Digital - Modelo",
    category: "Manual",
    organ: "IBICT",
    description: "Guia completo para elaboração de manuais de preservação digital",
    downloads: 67,
    rating: 4.9,
    lastUpdate: "25/09/2024",
    tags: ["preservação", "digital", "manual"]
  },
  {
    id: 4,
    title: "Resolução de Temporalidade - Template",
    category: "Resolução",
    organ: "CONARQ",
    description: "Modelo padrão para elaboração de resoluções sobre temporalidade documental",
    downloads: 156,
    rating: 4.7,
    lastUpdate: "05/11/2024",
    tags: ["temporalidade", "resolução", "prazo"]
  }
];

const bestPractices = [
  {
    id: 1,
    title: "Implementação de GED no Ministério da Saúde",
    organ: "Ministério da Saúde",
    description: "Case de sucesso na implementação de sistema de gestão eletrônica de documentos",
    category: "Caso de Sucesso",
    views: 234,
    likes: 45
  },
  {
    id: 2,
    title: "Digitalização de Acervos Históricos - UFMG",
    organ: "UFMG",
    description: "Metodologia aplicada para digitalização de documentos históricos com alta qualidade",
    category: "Metodologia",
    views: 189,
    likes: 38
  }
];

export function NormativesLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Biblioteca de Modelos e Boas Práticas</h3>
          <p className="text-sm text-gray-600">Templates e exemplos de sucesso para reutilização</p>
        </div>
        <Button>
          <BookOpen className="h-4 w-4 mr-2" />
          Contribuir com Modelo
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="Política">Política</SelectItem>
                <SelectItem value="Instrução Normativa">Instrução Normativa</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Resolução">Resolução</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Modelos e Templates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{template.title}</CardTitle>
                    <CardDescription className="mb-3">{template.description}</CardDescription>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge>{template.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-4">
                    <span>Por: {template.organ}</span>
                    <span>•</span>
                    <span>{template.downloads} downloads</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{template.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Atualizado: {template.lastUpdate}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Boas Práticas */}
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Star className="h-5 w-5" />
          Boas Práticas e Cases de Sucesso
        </h4>
        <div className="grid gap-4">
          {bestPractices.map((practice) => (
            <Card key={practice.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{practice.title}</CardTitle>
                    <CardDescription className="mb-3">{practice.description}</CardDescription>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Por: {practice.organ}</span>
                      <span>•</span>
                      <span>{practice.views} visualizações</span>
                      <span>•</span>
                      <span>{practice.likes} curtidas</span>
                    </div>
                  </div>
                  <Badge variant="outline">{practice.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ler Mais
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Baixar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
