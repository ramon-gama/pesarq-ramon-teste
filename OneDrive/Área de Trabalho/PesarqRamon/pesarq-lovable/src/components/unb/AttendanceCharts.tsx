
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface AttendanceRecord {
  id: string;
  researcherId: string;
  researcherName: string;
  date: string;
  status: "presente" | "falta" | "parcial";
  justification?: string;
  hours: number;
}

interface Researcher {
  id: string;
  name: string;
  hoursOwed: number;
  shift?: "manha" | "tarde";
}

interface AttendanceChartsProps {
  attendanceRecords: AttendanceRecord[];
  researchers: Researcher[];
}

const chartConfig = {
  manha: {
    label: "Manhã",
    color: "#3b82f6",
  },
  tarde: {
    label: "Tarde", 
    color: "#ef4444",
  },
  presente: {
    label: "Presente",
    color: "#22c55e",
  },
  falta: {
    label: "Falta",
    color: "#ef4444",
  },
  parcial: {
    label: "Parcial",
    color: "#f59e0b",
  },
};

export function AttendanceCharts({ attendanceRecords, researchers }: AttendanceChartsProps) {
  // Dados para gráfico de turnos
  const shiftData = [
    {
      shift: "Manhã",
      count: researchers.filter(r => r.shift === "manha").length,
      percentage: ((researchers.filter(r => r.shift === "manha").length / researchers.length) * 100).toFixed(1),
      fill: "#3b82f6"
    },
    {
      shift: "Tarde", 
      count: researchers.filter(r => r.shift === "tarde").length,
      percentage: ((researchers.filter(r => r.shift === "tarde").length / researchers.length) * 100).toFixed(1),
      fill: "#ef4444"
    }
  ];

  // Ranking de faltas por pesquisador
  const absenteeismRanking = researchers
    .map(researcher => ({
      name: researcher.name,
      faltas: attendanceRecords.filter(r => 
        r.researcherId === researcher.id && r.status === "falta"
      ).length,
      horasDevidas: researcher.hoursOwed
    }))
    .sort((a, b) => b.faltas - a.faltas)
    .slice(0, 10);

  // Dados de frequência por dia da semana
  const weekdayData = [
    { day: "Segunda", presente: 12, falta: 2, parcial: 1 },
    { day: "Terça", presente: 14, falta: 1, parcial: 0 },
    { day: "Quarta", presente: 13, falta: 1, parcial: 1 },
    { day: "Quinta", presente: 11, falta: 3, parcial: 1 },
    { day: "Sexta", presente: 10, falta: 4, parcial: 1 }
  ];

  // Produtividade por mês
  const monthlyData = [
    { month: "Jan", horas: 320, documentos: 850 },
    { month: "Fev", horas: 280, documentos: 720 },
    { month: "Mar", horas: 350, documentos: 920 },
    { month: "Abr", horas: 310, documentos: 800 },
    { month: "Mai", horas: 290, documentos: 750 }
  ];

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Total de Registros</p>
              <p className="text-2xl font-bold">{attendanceRecords.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Taxa de Presença</p>
              <p className="text-2xl font-bold text-green-600">
                {attendanceRecords.length > 0 ? 
                  ((attendanceRecords.filter(r => r.status === "presente").length / attendanceRecords.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Horas Trabalhadas</p>
              <p className="text-2xl font-bold text-blue-600">
                {attendanceRecords.reduce((sum, r) => sum + r.hours, 0)}h
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Pesquisadores com Débito</p>
              <p className="text-2xl font-bold text-red-600">
                {researchers.filter(r => r.hoursOwed > 0).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Gráfico de Distribuição por Turno */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Turno</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shiftData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ shift, percentage }) => `${shift}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {shiftData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{data.shift}</p>
                            <p className="text-sm">Pesquisadores: {data.count}</p>
                            <p className="text-sm">Porcentagem: {data.percentage}%</p>
                          </div>
                        );
                      }
                      return null;
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Ranking de Faltas */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Faltas</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={absenteeismRanking} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="faltas" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Frequência por Dia da Semana */}
        <Card>
          <CardHeader>
            <CardTitle>Frequência por Dia da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="presente" fill="#22c55e" name="Presente" />
                  <Bar dataKey="falta" fill="#ef4444" name="Falta" />
                  <Bar dataKey="parcial" fill="#f59e0b" name="Parcial" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Produtividade Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Produtividade Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="horas" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="Horas Trabalhadas"
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="documentos" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    name="Documentos Processados"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Horas Devidas */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisadores com Horas Devidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {researchers
              .filter(r => r.hoursOwed > 0)
              .sort((a, b) => b.hoursOwed - a.hoursOwed)
              .map(researcher => (
                <div key={researcher.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">{researcher.name}</span>
                  <span className="text-red-600 font-bold">{researcher.hoursOwed}h devidas</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
