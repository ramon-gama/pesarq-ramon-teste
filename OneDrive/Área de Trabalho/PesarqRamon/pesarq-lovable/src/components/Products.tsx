
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, FileText, Settings, BarChart3 } from "lucide-react";

interface ProductsProps {
  onNavigateToGovernance?: (productType: string) => void;
}

export function Products({ onNavigateToGovernance }: ProductsProps) {
  const handleProductClick = (productType: string) => {
    if (onNavigateToGovernance) {
      onNavigateToGovernance(productType);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header com título e botão */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Produtos Arquivísticos
          </h1>
          <p className="text-slate-600 mt-1">
            Gerencie os instrumentos de gestão de documentos
          </p>
        </div>
        <Button className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Plano de Classificação */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg">Plano de Classificação</CardTitle>
                <CardDescription className="text-sm">Versão 2.1 - Atualizada</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="text-xs">Aprovado</Badge>
              <p className="text-xs text-gray-600">15/03/2024</p>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              <p><strong>Total de itens:</strong> 245 códigos de classificação</p>
              <p><strong>Última atualização:</strong> Inclusão de novos códigos para atividades digitais</p>
              <p><strong>Responsável:</strong> Comissão de Avaliação de Documentos</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="flex-1 text-sm"
                onClick={() => handleProductClick('classification')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar
              </Button>
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Estatísticas</span>
                <span className="hidden sm:inline">Stats</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Temporalidade */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg">Tabela de Temporalidade</CardTitle>
                <CardDescription className="text-sm">Versão 1.3 - Vigente</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="text-xs">Vigente</Badge>
              <p className="text-xs text-gray-600">10/02/2024</p>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              <p><strong>Total de itens:</strong> 156 tipos documentais</p>
              <p><strong>Guarda permanente:</strong> 45% dos documentos</p>
              <p><strong>Próxima revisão:</strong> Janeiro 2026</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="flex-1 text-sm"
                onClick={() => handleProductClick('temporality')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar
              </Button>
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Estatísticas</span>
                <span className="hidden sm:inline">Stats</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manual de Procedimentos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg">Manual de Procedimentos</CardTitle>
                <CardDescription className="text-sm">Versão 1.0 - Em elaboração</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Rascunho</Badge>
              <p className="text-xs text-gray-600">01/03/2024</p>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              <p><strong>Progresso:</strong> 65% concluído</p>
              <p><strong>Seções:</strong> 12 de 18 capítulos finalizados</p>
              <p><strong>Previsão:</strong> Conclusão em maio 2024</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="flex-1 text-sm"
                onClick={() => handleProductClick('procedures')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar
              </Button>
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Estatísticas</span>
                <span className="hidden sm:inline">Stats</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quadro de Arranjo */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg">Quadro de Arranjo</CardTitle>
                <CardDescription className="text-sm">Versão 1.0 - Vigente</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="text-xs">Aprovado</Badge>
              <p className="text-xs text-gray-600">20/02/2024</p>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              <p><strong>Fundos:</strong> 8 fundos documentais mapeados</p>
              <p><strong>Séries:</strong> 124 séries documentais</p>
              <p><strong>Abrangência:</strong> 1950-2024</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="flex-1 text-sm"
                onClick={() => handleProductClick('arrangement')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar
              </Button>
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Estatísticas</span>
                <span className="hidden sm:inline">Stats</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tipos Documentais */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg">Tipos Documentais</CardTitle>
                <CardDescription className="text-sm">Versão 2.0 - Vigente</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="text-xs">Aprovado</Badge>
              <p className="text-xs text-gray-600">05/03/2024</p>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              <p><strong>Total cadastrado:</strong> 89 tipos documentais</p>
              <p><strong>Padronizados:</strong> 67 tipos (75%)</p>
              <p><strong>Exemplos:</strong> Ata de Reunião, Contrato, Relatório, Ofício, Memorando, Portaria, Decreto, Resolução, Parecer Técnico</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="flex-1 text-sm"
                onClick={() => handleProductClick('document-types')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar
              </Button>
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Estatísticas</span>
                <span className="hidden sm:inline">Stats</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Processo SEI */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start space-x-3">
              <Settings className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg">Tipos de Processo SEI</CardTitle>
                <CardDescription className="text-sm">Versão 1.5 - Vigente</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="text-xs">Aprovado</Badge>
              <p className="text-xs text-gray-600">12/03/2024</p>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              <p><strong>Total mapeado:</strong> 156 tipos de processo</p>
              <p><strong>Ativos:</strong> 134 tipos em uso</p>
              <p><strong>Principais:</strong> Compras, Pessoal, Convênios, Contratos, Licitação, Almoxarifado, Patrimônio, Acadêmico</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="flex-1 text-sm"
                onClick={() => handleProductClick('sei-process-types')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar
              </Button>
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Estatísticas</span>
                <span className="hidden sm:inline">Stats</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Estatísticas Gerais */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Resumo dos Produtos Arquivísticos
          </CardTitle>
          <CardDescription>
            Visão geral do estado atual dos instrumentos de gestão documental
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">6</p>
              <p className="text-sm text-blue-800">Produtos Ativos</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">83%</p>
              <p className="text-sm text-green-800">Taxa de Aprovação</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">650+</p>
              <p className="text-sm text-purple-800">Itens Mapeados</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">15</p>
              <p className="text-sm text-orange-800">Revisões Pendentes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
