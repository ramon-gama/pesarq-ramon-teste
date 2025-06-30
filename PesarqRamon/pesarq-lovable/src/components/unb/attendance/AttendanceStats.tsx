
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { type AttendanceRecord } from "@/hooks/useAttendanceControl";

interface AttendanceStatsProps {
  records: AttendanceRecord[];
}

export function AttendanceStats({ records }: AttendanceStatsProps) {
  const totalRecords = records.length;
  const presentCount = records.filter(r => r.status === 'presente').length;
  const absentCount = records.filter(r => r.status === 'falta').length;
  const partialCount = records.filter(r => r.status === 'parcial').length;
  
  const totalHoursWorked = records.reduce((sum, r) => sum + (r.hours_worked || 0), 0);
  const totalHoursExpected = records.reduce((sum, r) => sum + (r.hours_expected || 0), 0);
  const attendanceRate = totalHoursExpected > 0 ? (totalHoursWorked / totalHoursExpected) * 100 : 0;

  const stats = [
    {
      title: "Total de Presenças",
      value: presentCount,
      description: "Registros presentes",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total de Faltas",
      value: absentCount,
      description: "Registros de falta",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Presenças Parciais",
      value: partialCount,
      description: "Registros parciais",
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Taxa de Frequência",
      value: `${attendanceRate.toFixed(1)}%`,
      description: `${totalHoursWorked}h / ${totalHoursExpected}h`,
      icon: TrendingUp,
      color: attendanceRate >= 85 ? "text-green-600" : attendanceRate >= 70 ? "text-yellow-600" : "text-red-600",
      bgColor: attendanceRate >= 85 ? "bg-green-50" : attendanceRate >= 70 ? "bg-yellow-50" : "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
