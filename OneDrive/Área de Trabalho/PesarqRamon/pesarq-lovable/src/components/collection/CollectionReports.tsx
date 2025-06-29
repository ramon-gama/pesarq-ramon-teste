
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Filter,
  Users,
  Archive,
  MapPin,
  Trash2
} from "lucide-react";

const reportTypes = [
  {
    id: "general",
    title: "Relatório Geral do Acervo",
    description: "Visão completa de todos os documentos cadastrados",
    icon: FileText,
    items: [
      "Total de documentos por tipo",
      "Distribuição por setor produtor", 
      "Status de destinação final",
      "Localização física dos documentos",
      "Estado de conservação"
    ]
  },
  {
    id: "production",
    title: "Relatório de Produção Documental",
    description: "Análise da produção de documentos por período",
    icon: TrendingUp,
    items: [
      "Produção mensal/anual",
      "Documentos por setor",
      "Tipos mais produzidos",
      "Tendências de crescimento",
      "Comparativo entre períodos"
    ]
  },
  {
    id: "classification",
    title: "Relatório de Códigos de Classificação",
    description: "Análise dos códigos mais utilizados",
    icon: BarChart3,
    items: [
      "Top códigos mais utilizados",
      "Distribuição por classe",
      "Documentos sem classificação",
      "Conformidade classificatória",
      "Sugestões de otimização"
    ]
  },
  {
    id: "elimination",
    title: "Relatório de Eliminação",
    description: "Documentos elegíveis para eliminação",
    icon: Trash2,
    items: [
      "Documentos prontos para eliminação",
      "Histórico de eliminações",
      "Volume economizado",
      "Cronograma de eliminação",
      "Relatório de conformidade"
    ]
  },
  {
    id: "locations",
    title: "Relatório de Localização",
    description: "Controle de espaço físico e ocupação",
    icon: MapPin,
    items: [
      "Ocupação por local",
      "Distribuição de caixas",
      "Espaços disponíveis",
      "Otimização de armazenamento",
      "Mapa de localização"
    ]
  },
  {
    id: "users",
    title: "Relatório de Usuários",
    description: "Atividade dos usuários cadastradores",
    icon: Users,
    items: [
      "Documentos por usuário",
      "Produtividade por período",
      "Qualidade dos cadastros",
      "Atividade recente",
      "Ranking de produtividade"
    ]
  }
];

const quickStats = [
  { label: "Documentos Cadastrados", value: "15.678", trend: "+12%", color: "text-green-600" },
  { label: "Prontos p/ Eliminação", value: "1.234", trend: "+8%", color: "text-orange-600" },
  { label: "Guarda Permanente", value: "4.523", trend: "+5%", color: "text-blue-600" },
  { label: "Caixas Utilizadas", value: "1.345", trend: "+3%", color: "text-purple-600" }
];

export function CollectionReports() {
  const handleGenerateReport = (reportId: string) => {
    console.log(`Gerando relatório: ${reportId}`);
    // Aqui seria implementada a lógica de geração do relatório
  };

  const handleExportData = () => {
    console.log("Exportando dados completos");
    // Aqui seria implementada a exportação
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas Rápidas
          </CardTitle>
          <CardDescription>Visão geral atualizada do acervo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className={`text-xs ${stat.color} flex items-center justify-center gap-1`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend} este mês
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExportData} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Dados Completos
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Relatório Mensal
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Relatório Customizado
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Lista de Caixas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios Disponíveis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <report.icon className="h-5 w-5 text-[#15AB92]" />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Inclui:</strong>
                </div>
                <ul className="text-sm space-y-1">
                  {report.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#15AB92] rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 pt-3">
                  <Button 
                    onClick={() => handleGenerateReport(report.id)}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Gerar PDF
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleGenerateReport(`${report.id}-excel`)}
                    className="flex items-center gap-2"
                  >
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Histórico de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Relatórios Recentes
          </CardTitle>
          <CardDescription>Últimos relatórios gerados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Relatório Geral - Junho 2024", date: "2024-06-01", user: "Carlos Leite", size: "2.3 MB" },
              { name: "Lista de Eliminação - Q2 2024", date: "2024-05-28", user: "Maria Silva", size: "856 KB" },
              { name: "Produção Documental - Maio", date: "2024-05-25", user: "João Santos", size: "1.1 MB" },
              { name: "Relatório de Localização", date: "2024-05-20", user: "Carlos Leite", size: "3.2 MB" }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-[#15AB92]" />
                  <div>
                    <div className="font-medium text-sm">{report.name}</div>
                    <div className="text-xs text-gray-600">
                      Por {report.user} • {new Date(report.date).toLocaleDateString('pt-BR')} • {report.size}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
