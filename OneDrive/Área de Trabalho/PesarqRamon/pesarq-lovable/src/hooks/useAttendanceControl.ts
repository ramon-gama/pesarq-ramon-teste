
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceRecord {
  id: string;
  researcher_id: string;
  date: string;
  shift: 'manha' | 'tarde';
  status: 'presente' | 'falta' | 'parcial';
  hours_worked: number;
  hours_expected: number;
  hours_paid?: number;
  justification?: string;
  observations?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  researcher?: {
    name: string;
    workload?: number;
    modality: string;
  };
}

export interface MonthlyReport {
  id: string;
  researcher_id: string;
  month: number;
  year: number;
  total_hours_worked: number;
  total_hours_expected: number;
  total_present_days: number;
  total_absent_days: number;
  total_partial_days: number;
  attendance_rate: number;
  status: 'draft' | 'submitted' | 'approved';
  submitted_at?: string;
  approved_at?: string;
  approved_by?: string;
  created_at?: string;
  updated_at?: string;
  researcher?: {
    name: string;
  };
}

export function useAttendanceControl() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAttendanceRecords = async (filters?: {
    date?: string;
    researcher_id?: string;
    shift?: string;
  }) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('attendance_control')
        .select(`
          id,
          researcher_id,
          date,
          shift,
          status,
          hours_worked,
          hours_expected,
          hours_paid,
          justification,
          observations,
          created_at,
          updated_at,
          created_by,
          researchers (
            name,
            workload,
            modality
          )
        `)
        .order('date', { ascending: false });

      if (filters?.date) {
        query = query.eq('date', filters.date);
      }
      if (filters?.researcher_id) {
        query = query.eq('researcher_id', filters.researcher_id);
      }
      if (filters?.shift) {
        query = query.eq('shift', filters.shift);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const mappedData = (data || []).map(record => {
        const researcherData = Array.isArray(record.researchers) 
          ? record.researchers[0] 
          : record.researchers;
          
        return {
          ...record,
          researcher: researcherData ? {
            name: researcherData.name || 'Pesquisador não encontrado',
            workload: researcherData.workload,
            modality: researcherData.modality || 'N/A'
          } : {
            name: 'Pesquisador não encontrado',
            modality: 'N/A'
          }
        };
      });

      setAttendanceRecords(mappedData);
      return mappedData;
    } catch (error) {
      console.error('Error in fetchAttendanceRecords:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os registros de frequência",
        variant: "destructive",
      });
      setAttendanceRecords([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyReports = async () => {
    try {
      console.log('Fetching monthly reports...');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('monthly_attendance_reports')
        .select(`
          id,
          researcher_id,
          month,
          year,
          total_hours_worked,
          total_hours_expected,
          total_present_days,
          total_absent_days,
          total_partial_days,
          attendance_rate,
          status,
          submitted_at,
          approved_at,
          approved_by,
          created_at,
          updated_at,
          researchers (
            name
          )
        `)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) {
        console.error('Error fetching monthly reports:', error);
        throw error;
      }

      console.log('Raw monthly reports data:', data);

      const mappedReports = (data || []).map(report => {
        const researcherData = Array.isArray(report.researchers) 
          ? report.researchers[0] 
          : report.researchers;
          
        return {
          ...report,
          researcher: researcherData ? {
            name: researcherData.name || 'Pesquisador não encontrado'
          } : {
            name: 'Pesquisador não encontrado'
          }
        };
      });

      console.log('Mapped monthly reports data:', mappedReports);
      setMonthlyReports(mappedReports);
      return mappedReports;
    } catch (error) {
      console.error('Error in fetchMonthlyReports:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os relatórios mensais",
        variant: "destructive",
      });
      setMonthlyReports([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createAttendanceRecord = async (recordData: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);

      const { data: existingRecord, error: checkError } = await supabase
        .from('attendance_control')
        .select('id')
        .eq('researcher_id', recordData.researcher_id)
        .eq('date', recordData.date)
        .eq('shift', recordData.shift)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingRecord) {
        toast({
          title: "Aviso",
          description: "Já existe um registro para este pesquisador nesta data e turno",
          variant: "destructive",
        });
        return null;
      }

      const dataToInsert = {
        researcher_id: recordData.researcher_id,
        date: recordData.date,
        shift: recordData.shift,
        status: recordData.status,
        hours_worked: recordData.hours_worked || 0,
        hours_expected: recordData.hours_expected || 0,
        hours_paid: recordData.hours_paid || 0,
        justification: recordData.justification || null,
        observations: recordData.observations || null,
        created_by: recordData.created_by || 'Sistema'
      };

      const { data, error } = await supabase
        .from('attendance_control')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Registro de frequência criado com sucesso",
      });

      // Recarregar registros após criar
      await fetchAttendanceRecords();

      return data;
    } catch (error) {
      console.error('Error in createAttendanceRecord:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar registro de frequência",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAttendanceRecord = async (id: string, recordData: Partial<AttendanceRecord>) => {
    try {
      console.log('Updating attendance record:', { id, recordData });
      setLoading(true);

      const { id: _, created_at, updated_at, researcher, ...updateData } = recordData;

      const { data, error } = await supabase
        .from('attendance_control')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating record:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Registro de frequência atualizado com sucesso",
      });

      // Recarregar registros após atualizar
      await fetchAttendanceRecords();
      return data;
    } catch (error) {
      console.error('Error updating attendance record:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar registro de frequência",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAttendanceRecord = async (id: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('attendance_control')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting record:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Registro de frequência removido com sucesso",
      });

      // Recarregar registros após deletar
      await fetchAttendanceRecords();
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover registro de frequência",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyReport = async (researcher_id: string, month: number, year: number) => {
    try {
      setLoading(true);

      const { data: records, error: recordsError } = await supabase
        .from('attendance_control')
        .select('*')
        .eq('researcher_id', researcher_id)
        .gte('date', `${year}-${month.toString().padStart(2, '0')}-01`)
        .lt('date', `${year}-${(month + 1).toString().padStart(2, '0')}-01`);

      if (recordsError) throw recordsError;

      const totalPresent = records?.filter(r => r.status === 'presente').length || 0;
      const totalAbsent = records?.filter(r => r.status === 'falta').length || 0;
      const totalPartial = records?.filter(r => r.status === 'parcial').length || 0;
      const totalWorked = records?.reduce((sum, r) => sum + (r.hours_worked || 0), 0) || 0;
      const totalExpected = records?.reduce((sum, r) => sum + (r.hours_expected || 0), 0) || 0;
      const attendanceRate = totalExpected > 0 ? (totalWorked / totalExpected) * 100 : 0;

      const reportData = {
        researcher_id,
        month,
        year,
        total_hours_worked: totalWorked,
        total_hours_expected: totalExpected,
        total_present_days: totalPresent,
        total_absent_days: totalAbsent,
        total_partial_days: totalPartial,
        attendance_rate: attendanceRate,
        status: 'draft' as const
      };

      const { data, error } = await supabase
        .from('monthly_attendance_reports')
        .upsert([reportData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Relatório mensal gerado com sucesso",
      });

      await fetchMonthlyReports();
      return data;
    } catch (error) {
      console.error('Error generating monthly report:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório mensal",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  return {
    attendanceRecords,
    monthlyReports,
    loading,
    fetchAttendanceRecords,
    fetchMonthlyReports,
    createAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    generateMonthlyReport,
    refetch: () => {
      fetchAttendanceRecords();
      fetchMonthlyReports();
    }
  };
}
