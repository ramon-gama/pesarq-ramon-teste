
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, XCircle, AlertCircle, Calendar } from "lucide-react";

interface AttendanceSummaryProps {
  totalResearchers: number;
  presentCount: number;
  absentCount: number;
  partialCount: number;
  registeredCount: number;
}

export function AttendanceSummary({ 
  totalResearchers, 
  presentCount, 
  absentCount, 
  partialCount,
  registeredCount 
}: AttendanceSummaryProps) {
  const stats = [
    {
      title: "Total de Bolsistas",
      value: totalResearchers,
      description: "Pesquisadores no projeto",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Presenças",
      value: presentCount,
      description: "Registros presentes",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Faltas",
      value: absentCount,
      description: "Registros de falta",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Parcial",
      value: partialCount,
      description: "Registros parciais",
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Já Registrados",
      value: registeredCount,
      description: "Frequências lançadas",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-md`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
