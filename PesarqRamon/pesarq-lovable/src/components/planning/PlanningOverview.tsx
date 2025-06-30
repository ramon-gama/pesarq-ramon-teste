
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Users, Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StrategicPlan } from "@/hooks/useStrategicPlanning";

interface PlanningOverviewProps {
  stats: {
    total: number;
    inProgress: number;
    completed: number;
    draft: number;
  };
  plans: StrategicPlan[];
}

export function PlanningOverview({ stats, plans }: PlanningOverviewProps) {
  // Prepare chart data - only include categories with values > 0
  const statusData = [
    stats.inProgress > 0 && { name: 'Em Andamento', value: stats.inProgress, color: '#3B82F6' },
    stats.completed > 0 && { name: 'Concluídos', value: stats.completed, color: '#10B981' },
    stats.draft > 0 && { name: 'Rascunhos', value: stats.draft, color: '#6B7280' }
  ].filter(Boolean) as Array<{ name: string; value: number; color: string }>;

  // Helper function to break long text into multiple lines
  const breakText = (text: string, maxLength: number = 15) => {
    if (text.length <= maxLength) return text;
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + ' ' + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    return lines.slice(0, 2).join('\n'); // Limit to 2 lines
  };

  const progressData = plans.map(plan => ({
    name: breakText(plan.name, 15),
    progress: plan.progress || 0,
    fullName: plan.name
  }));

  const totalObjectives = plans.reduce((acc, plan) => acc + (plan.objectives || 0), 0);
  const totalCompletedObjectives = plans.reduce((acc, plan) => acc + (plan.completedObjectives || 0), 0);
  const totalTeamMembers = plans.reduce((acc, plan) => acc + (plan.team || 0), 0);
  const avgProgress = plans.length > 0 ? Math.round(plans.reduce((acc, plan) => acc + (plan.progress || 0), 0) / plans.length) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Objetivos Totais</p>
                <p className="text-2xl font-bold text-gray-900">{totalObjectives}</p>
                <p className="text-xs text-green-600">{totalCompletedObjectives} concluídos</p>
              </div>
              <Target className="h-8 w-8 text-[#15AB92]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Membros da Equipe</p>
                <p className="text-2xl font-bold text-gray-900">{totalTeamMembers}</p>
                <p className="text-xs text-blue-600">em {stats.total} planejamentos</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progresso Médio</p>
                <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-[#15AB92] h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${avgProgress}%` }}
                  ></div>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalObjectives > 0 ? Math.round((totalCompletedObjectives / totalObjectives) * 100) : 0}%
                </p>
                <p className="text-xs text-purple-600">objetivos</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Distribuição por Status
            </CardTitle>
            <CardDescription>
              Visualização do status dos planejamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum dado disponível</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress by Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progresso por Planejamento
            </CardTitle>
            <CardDescription>
              Comparação do progresso entre planejamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={progressData} margin={{ left: 5, right: 5, top: 5, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10} 
                    angle={0}
                    textAnchor="middle"
                    height={60}
                    interval={0}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Progresso']}
                    labelFormatter={(label) => {
                      const item = progressData.find(d => d.name === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <Bar dataKey="progress" fill="#15AB92" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum dado disponível</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Planejamentos Recentes
          </CardTitle>
          <CardDescription>
            Últimos planejamentos criados ou atualizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length > 0 ? (
            <div className="space-y-4">
              {plans.slice(0, 5).map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{plan.name}</h4>
                    <p className="text-sm text-gray-600 truncate">
                      {plan.description || 'Sem descrição'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{plan.progress || 0}%</p>
                      <p className="text-xs text-gray-600">
                        {plan.status === 'completed' ? 'Concluído' : 
                         plan.status === 'in_progress' ? 'Em Andamento' : 'Rascunho'}
                      </p>
                    </div>
                    <Progress value={plan.progress || 0} className="w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum planejamento encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
