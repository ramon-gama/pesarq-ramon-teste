
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp,
  Target,
  Activity,
  BarChart3,
  CheckCircle2,
  Download,
  FileText
} from "lucide-react";

export function MaturityDashboard() {
  return (
    <div className="space-y-6">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nível Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.3</div>
            <p className="text-xs text-muted-foreground">Essencial (+0.3 vs última avaliação)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Categoria</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Estratégia</div>
            <p className="text-xs text-muted-foreground">3.8/5.0 pontos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Área Crítica</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operação</div>
            <p className="text-xs text-muted-foreground">2.8/5.0 pontos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ranking Nacional</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12º</div>
            <p className="text-xs text-muted-foreground">Entre 95 organizações</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Radar de Maturidade</CardTitle>
            <CardDescription>Pontuação atual nas 5 categorias (escala 1-5)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Gráfico Radar será implementado aqui</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparação com Outras Organizações</CardTitle>
            <CardDescription>Posição relativa no cenário nacional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Gráfico de Comparação será implementado aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Recomendações Estratégicas
          </CardTitle>
          <CardDescription>
            Sugestões baseadas na sua avaliação atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
              <h4 className="font-semibold text-orange-800">Área para Desenvolvimento: Operação</h4>
              <p className="text-orange-700 mt-1">Investir em tecnologia e processos operacionais. Considere implementar um sistema de gestão de documentos integrado para alcançar o nível "Essencial".</p>
            </div>
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <h4 className="font-semibold text-yellow-800">Melhoria: Ciclo de Vida</h4>
              <p className="text-yellow-700 mt-1">Desenvolver políticas organizacionais mais claras para retenção e descarte de documentos, com capacitação para progredir ao nível "Consolidado".</p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold text-green-800">Ponto Forte: Estratégia</h4>
              <p className="text-green-700 mt-1">Excelente governança organizacional no nível "Essencial". Continue promovendo a cultura de gestão de documentos para alcançar o nível "Consolidado".</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Relatórios</CardTitle>
          <CardDescription>
            Baixe relatórios detalhados da sua avaliação organizacional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Relatório Completo (PDF)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Dados Brutos (CSV)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dados Brutos (Excel)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
