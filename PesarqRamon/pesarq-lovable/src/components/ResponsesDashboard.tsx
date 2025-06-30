import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Download, Filter } from "lucide-react";

const ResponsesDashboard = () => {
  // Dados de exemplo para os gráficos
  const responsesByCategory = [
    { name: 'Gestão Documental', responses: 45, completed: 38 },
    { name: 'Organização', responses: 42, completed: 40 },
    { name: 'Tecnologia', responses: 35, completed: 30 },
    { name: 'Recursos Humanos', responses: 40, completed: 35 },
    { name: 'Infraestrutura', responses: 38, completed: 32 },
    { name: 'Desafios', responses: 44, completed: 41 }
  ];

  const maturityLevels = [
    { name: 'Inicial', value: 12, color: '#ef4444' },
    { name: 'Básico', value: 18, color: '#f97316' },
    { name: 'Intermediário', value: 25, color: '#eab308' },
    { name: 'Avançado', value: 20, color: '#22c55e' },
    { name: 'Otimizado', value: 8, color: '#3b82f6' }
  ];

  const departmentComparison = [
    { department: 'Administração', 'Gestão Documental': 4, 'Organização': 3, 'Tecnologia': 2, 'RH': 4, 'Infraestrutura': 3 },
    { department: 'Financeiro', 'Gestão Documental': 3, 'Organização': 4, 'Tecnologia': 3, 'RH': 3, 'Infraestrutura': 2 },
    { department: 'Recursos Humanos', 'Gestão Documental': 5, 'Organização': 4, 'Tecnologia': 2, 'RH': 5, 'Infraestrutura': 3 },
    { department: 'Planejamento', 'Gestão Documental': 2, 'Organização': 3, 'Tecnologia': 4, 'RH': 2, 'Infraestrutura': 4 }
  ];

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dashboard de Respostas</h2>
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os setores</SelectItem>
              <SelectItem value="admin">Administração</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
              <SelectItem value="rh">Recursos Humanos</SelectItem>
              <SelectItem value="planejamento">Planejamento</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">186</div>
            <p className="text-xs text-muted-foreground">+12% desde o último mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Setores Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11/14</div>
            <p className="text-xs text-muted-foreground">78,6% de participação</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Média de Maturidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2/5</div>
            <p className="text-xs text-muted-foreground">Nível intermediário</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">165 de 186 completas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Respostas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Respostas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responsesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="responses" fill="#3b82f6" name="Total" />
                <Bar dataKey="completed" fill="#22c55e" name="Completas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Níveis de Maturidade */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição dos Níveis de Maturidade</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={maturityLevels}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {maturityLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Radar - Comparação entre Departamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação entre Departamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={departmentComparison}>
              <PolarGrid />
              <PolarAngleAxis dataKey="department" />
              <PolarRadiusAxis domain={[0, 5]} />
              <Radar
                name="Gestão Documental"
                dataKey="Gestão Documental"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
              />
              <Radar
                name="Organização"
                dataKey="Organização"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.1}
              />
              <Radar
                name="Tecnologia"
                dataKey="Tecnologia"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.1}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resumo de Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Principais Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Badge className="mb-2 bg-blue-100 text-blue-800">Destaque Positivo</Badge>
              <p className="text-sm">
                O setor de Recursos Humanos apresenta a melhor pontuação em Gestão Documental (5.0/5.0)
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <Badge className="mb-2 bg-orange-100 text-orange-800">Atenção Necessária</Badge>
              <p className="text-sm">
                Tecnologia é a categoria com menor pontuação média (2.8/5.0) entre todos os setores
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <Badge className="mb-2 bg-green-100 text-green-800">Oportunidade</Badge>
              <p className="text-sm">
                78% dos setores já participaram, restam apenas 3 departamentos para responder
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsesDashboard;
