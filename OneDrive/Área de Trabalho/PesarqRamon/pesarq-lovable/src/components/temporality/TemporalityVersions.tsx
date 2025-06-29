
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, Eye, GitBranch, FileText, Users } from "lucide-react";

interface TemporalityVersionsProps {
  currentVersion: any;
}

export function TemporalityVersions({ currentVersion }: TemporalityVersionsProps) {
  const [selectedVersion, setSelectedVersion] = useState(null);

  const versions = [
    {
      version: "2.1",
      status: "aprovado",
      dataAprovacao: new Date("2024-01-15"),
      dataPublicacao: new Date("2024-01-16"),
      responsavel: "Ana Santos",
      alteracoes: [
        "Adicionados 5 novos tipos documentais",
        "Ajustados prazos de contratos administrativos", 
        "Incluída fundamentação legal atualizada"
      ],
      totalItens: 156,
      isCurrent: true
    },
    {
      version: "2.0",
      status: "aprovado",
      dataAprovacao: new Date("2023-12-10"),
      dataPublicacao: new Date("2023-12-11"),
      responsavel: "João Silva",
      alteracoes: [
        "Revisão geral da estrutura",
        "Adequação às novas diretrizes do Arquivo Nacional",
        "Inclusão de documentos digitais"
      ],
      totalItens: 151,
      isCurrent: false
    },
    {
      version: "1.5",
      status: "aprovado",
      dataAprovacao: new Date("2023-06-20"),
      dataPublicacao: new Date("2023-06-21"),
      responsavel: "Maria Costa",
      alteracoes: [
        "Correções menores em prazos",
        "Atualização de legislação",
        "Melhorias na documentação"
      ],
      totalItens: 148,
      isCurrent: false
    },
    {
      version: "1.0",
      status: "aprovado",
      dataAprovacao: new Date("2022-01-15"),
      dataPublicacao: new Date("2022-01-16"),
      responsavel: "Carlos Oliveira",
      alteracoes: [
        "Versão inicial da tabela",
        "Mapeamento de todos os tipos documentais básicos"
      ],
      totalItens: 120,
      isCurrent: false
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      aprovado: "bg-green-100 text-green-800",
      rejeitado: "bg-red-100 text-red-800",
      "em_elaboracao": "bg-yellow-100 text-yellow-800",
      rascunho: "bg-gray-100 text-gray-800"
    };
    
    const labels = {
      aprovado: "Aprovado",
      rejeitado: "Rejeitado", 
      "em_elaboracao": "Em Elaboração",
      rascunho: "Rascunho"
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleDownloadVersion = (version: string) => {
    console.log(`Baixando versão ${version}...`);
  };

  const handleViewVersion = (version: string) => {
    console.log(`Visualizando versão ${version}...`);
  };

  const handleCompareVersions = () => {
    console.log("Comparando versões...");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Histórico de Versões
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Acompanhe todas as versões e alterações da Tabela de Temporalidade
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleCompareVersions}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Comparar Versões
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {versions.map((version, index) => (
              <div key={version.version} className="relative">
                {index < versions.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
                )}
                
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${version.isCurrent ? 'bg-blue-600' : 'bg-gray-400'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                          Versão {version.version}
                          {version.isCurrent && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">Atual</Badge>
                          )}
                        </h3>
                        {getStatusBadge(version.status)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewVersion(version.version)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadVersion(version.version)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Aprovado em {version.dataAprovacao.toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{version.totalItens} itens</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{version.responsavel}</span>
                      </div>
                      <div>
                        <span>Publicado em {version.dataPublicacao.toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Principais Alterações:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {version.alteracoes.map((alteracao, idx) => (
                          <li key={idx}>• {alteracao}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas do Versionamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{versions.length}</div>
              <p className="text-sm text-gray-600">Total de Versões</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {versions[0].totalItens - versions[versions.length - 1].totalItens}
              </div>
              <p className="text-sm text-gray-600">Itens Adicionados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((new Date().getTime() - versions[versions.length - 1].dataAprovacao.getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <p className="text-sm text-gray-600">Dias desde a primeira versão</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
