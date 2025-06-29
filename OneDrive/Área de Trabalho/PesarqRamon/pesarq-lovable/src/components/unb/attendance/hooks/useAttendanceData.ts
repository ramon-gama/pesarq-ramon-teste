
import { useState, useEffect, useCallback } from 'react';
import { useAttendanceControl } from '@/hooks/useAttendanceControl';
import { type Researcher } from '@/hooks/useResearchers';

interface AttendanceEntry {
  researcher_id: string;
  status: 'presente' | 'falta' | 'parcial' | null;
  hours_worked: number;
  hours_expected: number;
  hours_paid: number;
  justification: string;
  observations: string;
  shift: 'manha' | 'tarde';
}

export function useAttendanceData(
  selectedDate: string,
  selectedShift: 'manha' | 'tarde',
  projectResearchers: Researcher[]
) {
  const { fetchAttendanceRecords } = useAttendanceControl();
  const [existingRecords, setExistingRecords] = useState<Record<string, any>>({});
  const [attendanceEntries, setAttendanceEntries] = useState<Record<string, AttendanceEntry>>({});
  const [loadingRecords, setLoadingRecords] = useState(false);

  const loadExistingRecords = useCallback(async () => {
    if (!selectedDate || !selectedShift || projectResearchers.length === 0) {
      setExistingRecords({});
      return;
    }

    try {
      setLoadingRecords(true);
      console.log('Loading existing records for:', { selectedDate, selectedShift, researchersCount: projectResearchers.length });
      
      const records = await fetchAttendanceRecords({ 
        date: selectedDate,
        shift: selectedShift 
      });
      
      const projectRecords = records.filter(record => 
        projectResearchers.some(r => r.id === record.researcher_id)
      );
      
      const recordsMap: Record<string, any> = {};
      projectRecords.forEach(record => {
        recordsMap[record.researcher_id] = record;
      });
      
      console.log('Loaded existing records:', recordsMap);
      setExistingRecords(recordsMap);
    } catch (error) {
      console.error('Error loading existing records:', error);
      setExistingRecords({});
    } finally {
      setLoadingRecords(false);
    }
  }, [selectedDate, selectedShift, projectResearchers.length, fetchAttendanceRecords]);

  // Inicializar entradas quando pesquisadores mudarem
  useEffect(() => {
    if (projectResearchers.length === 0) {
      setAttendanceEntries({});
      return;
    }

    const initialEntries: Record<string, AttendanceEntry> = {};
    projectResearchers.forEach(researcher => {
      if (!existingRecords[researcher.id]) {
        const defaultHours = researcher.workload || 4;
        initialEntries[researcher.id] = {
          researcher_id: researcher.id,
          status: null,
          hours_worked: 0,
          hours_expected: defaultHours,
          hours_paid: 0,
          justification: '',
          observations: '',
          shift: selectedShift
        };
      }
    });
    
    setAttendanceEntries(initialEntries);
  }, [projectResearchers, selectedShift, existingRecords]);

  // Carregar registros apenas quando necessário
  useEffect(() => {
    if (projectResearchers.length > 0) {
      loadExistingRecords();
    }
  }, [selectedDate, selectedShift, projectResearchers.length]);

  const updateAttendanceEntry = useCallback((researcherId: string, field: keyof AttendanceEntry, value: any) => {
    setAttendanceEntries(prev => {
      const currentEntry = prev[researcherId];
      if (!currentEntry) return prev;

      const updatedEntry = { ...currentEntry, [field]: value };
      
      // Ajustar valores baseado no status
      if (field === 'status') {
        if (value === 'presente') {
          updatedEntry.hours_worked = updatedEntry.hours_expected;
          updatedEntry.justification = '';
        } else if (value === 'falta') {
          updatedEntry.hours_worked = 0;
        } else if (value === 'parcial') {
          updatedEntry.hours_worked = Math.floor(updatedEntry.hours_expected / 2);
        }
      }
      
      return { ...prev, [researcherId]: updatedEntry };
    });
  }, []);

  return {
    existingRecords,
    attendanceEntries,
    loadingRecords,
    updateAttendanceEntry,
    reloadRecords: loadExistingRecords
  };
}
