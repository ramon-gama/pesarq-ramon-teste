
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceManager } from "./attendance/AttendanceManager";
import { AttendanceTable } from "./attendance/AttendanceTable";
import { MonthlyReportsTable } from "./attendance/MonthlyReportsTable";
import { useAttendanceControl } from "@/hooks/useAttendanceControl";
import { Users, FileText, Clock, UserCheck, UserX, ClockIcon } from "lucide-react";

export function AttendanceControl() {
  const { 
    attendanceRecords, 
    monthlyReports, 
    loading, 
    fetchAttendanceRecords, 
    deleteAttendanceRecord, 
    generateMonthlyReport 
  } = useAttendanceControl();

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteAttendanceRecord(id);
      await fetchAttendanceRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleGenerateReport = async (researcherId: string, month: number, year: number) => {
    try {
      await generateMonthlyReport(researcherId, month, year);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  // Dados simulados para métricas de frequência
  const attendanceMetrics = {
    totalRecords: attendanceRecords?.length || 0,
    presentToday: 42,
    absentToday: 8,
    averageAbsencesPerMonth: 18.5,
    totalOwedHours: 245.5,
    monthlyReportsCount: monthlyReports?.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Cards de Resumo de Frequência */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Registros</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{attendanceMetrics.totalRecords}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">cadastrados</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Presentes Hoje</CardTitle>
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{attendanceMetrics.presentToday}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">pesquisadores</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Faltas Hoje</CardTitle>
            <UserX className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{attendanceMetrics.absentToday}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">pesquisadores</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Média Faltas/Mês</CardTitle>
            <UserX className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{attendanceMetrics.averageAbsencesPerMonth}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">faltas mensais</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Horas Devidas</CardTitle>
            <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{attendanceMetrics.totalOwedHours}h</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">total acumulado</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Relatórios</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{attendanceMetrics.monthlyReportsCount}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">gerados</p>
          </CardContent>
        </Card>
      </div>

      {/* Abas de Controle de Frequência */}
      <Tabs defaultValue="control" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="control" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Controle
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="control" className="mt-4">
          <AttendanceManager />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Histórico de Frequência dos Pesquisadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Carregando registros...</p>
                  </div>
                </div>
              ) : (
                <AttendanceTable 
                  records={attendanceRecords} 
                  onDelete={handleDeleteRecord}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relatórios Mensais de Frequência
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Carregando relatórios...</p>
                  </div>
                </div>
              ) : (
                <MonthlyReportsTable 
                  reports={monthlyReports} 
                  onGenerateReport={handleGenerateReport}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
