import { useState, useMemo, useCallback } from "react";
import { useResearchers } from "@/hooks/useResearchers";
import { useProjects } from "@/hooks/useProjects";
import { useAttendanceControl } from "@/hooks/useAttendanceControl";
import { AttendanceHeader } from "./AttendanceHeader";
import { AttendanceSummary } from "./AttendanceSummary";
import { AttendanceEmptyState } from "./AttendanceEmptyState";
import { useAttendanceData } from "./hooks/useAttendanceData";
import { ResearcherCard } from "./components/ResearcherCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export function AttendanceManager() {
  const { createAttendanceRecord, loading: attendanceLoading } = useAttendanceControl();
  const { activeResearchers, loading: researchersLoading } = useResearchers();
  const { projects, loading: projectsLoading } = useProjects();
  
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedShift, setSelectedShift] = useState<'manha' | 'tarde'>('manha');
  const [submitting, setSubmitting] = useState(false);

  // Memoizar pesquisadores do projeto selecionado
  const projectResearchers = useMemo(() => {
    if (!selectedProject || !activeResearchers) return [];
    
    return activeResearchers.filter(researcher => 
      researcher.project_id === selectedProject && 
      researcher.modality === 'presencial' && 
      researcher.status === 'active' && 
      researcher.is_active === true
    );
  }, [activeResearchers, selectedProject]);

  const {
    existingRecords,
    attendanceEntries,
    loadingRecords,
    updateAttendanceEntry,
    reloadRecords
  } = useAttendanceData(selectedDate, selectedShift, projectResearchers);

  const handleSubmitAll = useCallback(async () => {
    if (!selectedProject) return;

    const entries = Object.values(attendanceEntries);
    const entriesWithoutStatus = entries.filter(entry => entry.status === null);
    
    if (entriesWithoutStatus.length > 0) return;

    const invalidEntries = entries.filter(entry => 
      (entry.status === 'falta' || entry.status === 'parcial') && !entry.justification.trim()
    );

    if (invalidEntries.length > 0) return;

    setSubmitting(true);
    try {
      const pendingSubmissions = [];
      for (const entry of entries) {
        if (!existingRecords[entry.researcher_id] && entry.status !== null) {
          pendingSubmissions.push(createAttendanceRecord({
            researcher_id: entry.researcher_id,
            date: selectedDate,
            shift: entry.shift,
            status: entry.status as 'presente' | 'falta' | 'parcial',
            hours_worked: entry.hours_worked,
            hours_expected: entry.hours_expected,
            hours_paid: entry.hours_paid,
            justification: entry.justification || null,
            observations: entry.observations || null,
            created_by: 'Sistema'
          }));
        }
      }

      if (pendingSubmissions.length > 0) {
        await Promise.all(pendingSubmissions);
        await reloadRecords();
      }
    } finally {
      setSubmitting(false);
    }
  }, [selectedProject, attendanceEntries, existingRecords, selectedDate, createAttendanceRecord, reloadRecords]);

  const stats = useMemo(() => {
    if (!selectedProject) {
      return {
        totalResearchers: 0,
        presentCount: 0,
        absentCount: 0,
        partialCount: 0,
        registeredCount: 0,
        pendingCount: 0,
        definedStatusCount: 0
      };
    }

    const entries = Object.values(attendanceEntries);
    const existingRecordsArray = Object.values(existingRecords);
    
    // Contadores baseados nos registros existentes no banco
    const presentCount = existingRecordsArray.filter(record => record.status === 'presente').length;
    const absentCount = existingRecordsArray.filter(record => record.status === 'falta').length;
    const partialCount = existingRecordsArray.filter(record => record.status === 'parcial').length;
    
    // Contadores baseados nas entradas pendentes (não salvas ainda)
    const pendingEntries = entries.filter(entry => !existingRecords[entry.researcher_id]);
    const pendingPresentCount = pendingEntries.filter(entry => entry.status === 'presente').length;
    const pendingAbsentCount = pendingEntries.filter(entry => entry.status === 'falta').length;
    const pendingPartialCount = pendingEntries.filter(entry => entry.status === 'parcial').length;
    
    const definedEntries = entries.filter(entry => entry.status !== null);
    
    return {
      totalResearchers: projectResearchers.length,
      presentCount: presentCount + pendingPresentCount,
      absentCount: absentCount + pendingAbsentCount,
      partialCount: partialCount + pendingPartialCount,
      registeredCount: existingRecordsArray.length,
      pendingCount: pendingEntries.length,
      definedStatusCount: definedEntries.length
    };
  }, [selectedProject, attendanceEntries, projectResearchers, existingRecords]);

  const formatDateToBrazilian = (dateString: string): string => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const isLoading = projectsLoading || researchersLoading || attendanceLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AttendanceHeader
        projects={projects || []}
        selectedProject={selectedProject}
        selectedDate={selectedDate}
        selectedShift={selectedShift}
        submitting={submitting}
        pendingCount={stats.pendingCount}
        onProjectChange={setSelectedProject}
        onDateChange={setSelectedDate}
        onShiftChange={setSelectedShift}
        onSubmit={handleSubmitAll}
        canSubmit={stats.pendingCount > 0 && stats.definedStatusCount === stats.pendingCount}
      />

      {/* Cards de resumo sempre visíveis */}
      <AttendanceSummary
        totalResearchers={stats.totalResearchers}
        presentCount={stats.presentCount}
        absentCount={stats.absentCount}
        partialCount={stats.partialCount}
        registeredCount={stats.registeredCount}
      />

      {selectedProject && projectResearchers.length > 0 && !loadingRecords && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Presença - {formatDateToBrazilian(selectedDate)} ({selectedShift === 'manha' ? 'Manhã' : 'Tarde'})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectResearchers.map(researcher => (
              <ResearcherCard
                key={researcher.id}
                researcher={researcher}
                entry={attendanceEntries[researcher.id]}
                existingRecord={existingRecords[researcher.id]}
                onUpdateEntry={updateAttendanceEntry}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {loadingRecords && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando registros...</p>
          </div>
        </div>
      )}

      {selectedProject && projectResearchers.length === 0 && (
        <AttendanceEmptyState type="no-researchers" />
      )}

      {!selectedProject && (
        <AttendanceEmptyState type="no-project" />
      )}

      {stats.pendingCount === 0 && projectResearchers.length > 0 && selectedProject && !loadingRecords && (
        <AttendanceEmptyState 
          type="complete" 
          date={selectedDate}
          shift={selectedShift}
        />
      )}
    </div>
  );
}
