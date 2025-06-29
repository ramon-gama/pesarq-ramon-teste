
export interface Researcher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  course?: string;
  function: string;
  academic_level: string;
  academic_status: string;
  specialization?: string;
  institution: string;
  lattes_url?: string;
  project_id?: string;
  start_date: string;
  end_date?: string;
  workload?: number;
  shift?: 'manha' | 'tarde';
  modality: 'presencial' | 'semipresencial' | 'online';
  observations?: string;
  is_active?: boolean;
  selected_goals?: string[];
  created_at?: string;
  updated_at?: string;
  status?: 'active' | 'inactive' | 'dismissed';
  dismissal_reason?: string;
  dismissal_date?: string;
  dismissed_by?: string;
}

export type CreateResearcherData = Omit<Researcher, 'id' | 'created_at' | 'updated_at'>;
export type UpdateResearcherData = Partial<Researcher>;
