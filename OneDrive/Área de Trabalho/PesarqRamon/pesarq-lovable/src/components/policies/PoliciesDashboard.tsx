
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Users,
  Calendar,
  Eye,
  Plus
} from "lucide-react";

const dashboardStats = {
  totalNorms: 24,
  activeNorms: 18,
  inProgress: 4,
  needsReview: 6,
  monthlyGrowth: 12,
  compliance: 94
};

const recentActivity = [
  {
    id: 1,
    action: "Nova política criada",
    norm: "Política de Backup de Dados",
    user: "Carlos Silva",
    time: "há 2 horas",
    type: "created"
  },
  {
    id: 2,
    action: "Revisão aprovada",
    norm: "Manual de Classificação",
    user: "Ana Santos",
    time: "há 1 dia",
    type: "approved"
  },
  {
    id: 3,
    action: "Alerta de revisão",
    norm: "Política de Segurança",
    user: "Sistema",
    time: "há 2 dias",
    type: "alert"
  }
];

const upcomingReviews = [
  {
    id: 1,
    title: "Política de Segurança da Informação",
    daysLeft: 7,
    responsible: "TI - Segurança",
    priority: "alta"
  },
  {
    id: 2,
    title: "Manual de Arquivamento",
    daysLeft: 15,
    responsible: "Arquivo Setorial", 
    priority: "media"
  },
  {
    id: 3,
    title: "Instrução de Digitalização",
    daysLeft: 30,
    responsible: "Gestão Documental",
    priority: "baixa"
  }
];

interface PoliciesDashboardProps {
  onCreateNew: () => void;
  onViewAll: () => void;
}

export function PoliciesDashboard({ onCreateNew, onViewAll }: PoliciesDashboardProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "created": return <Plus className="h-4 w-4 text-blue-600" />;
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "alert": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "text-red-600";
      case "media": return "text-yellow-600";
      case "baixa": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Normas</CardTitle>
            <FileText className="h-4 w-4 ml-auto text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalNorms}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{dashboardStats.monthlyGrowth}% este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Normas Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeNorms}</div>
            <p className="text-xs text-gray-600">Vigentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Elaboração</CardTitle>
            <Clock className="h-4 w-4 ml-auto text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.inProgress}</div>
            <p className="text-xs text-blue-600">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisam Revisão</CardTitle>
            <AlertTriangle className="h-4 w-4 ml-auto text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.needsReview}</div>
            <p className="text-xs text-orange-600">Atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformidade</CardTitle>
            <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.compliance}%</div>
            <p className="text-xs text-green-600">Meta: 90%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 ml-auto text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-purple-600">Colaboradores</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção principal com 3 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-blue-600">{activity.norm}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revisões Próximas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Revisões Próximas
            </CardTitle>
            <CardDescription>Normas que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingReviews.map((review) => (
                <div key={review.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm">{review.title}</p>
                    <Badge variant="outline" className={getPriorityColor(review.priority)}>
                      {review.daysLeft} dias
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{review.responsible}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            <CardDescription>Principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button onClick={onCreateNew} className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Nova Política/Norma
              </Button>
              <Button onClick={onViewAll} variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Ver Todas as Normas
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Cronograma de Revisões
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Biblioteca de Modelos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Relatório de Conformidade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
