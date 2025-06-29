
export type ProjectStatus = 'planejamento' | 'andamento' | 'finalizado' | 'suspenso' | 'cancelado';

export interface ProjectFormData {
  title: string;
  organization_id: string;
  selected_proposal_id: string;
  object: string;
  legal_instrument: string;
  instrument_number: string;
  start_date: Date;
  end_date: Date | null;
  total_value: string;
  researchers_count: string;
  documents_meters: string;
  boxes_to_digitalize: string;
  boxes_to_describe: string;
  status: ProjectStatus;
  project_type: string;
  document_url: string;
  external_link: string;
  responsibles: string[];
  goals: ProjectGoal[];
}

export interface ProjectGoal {
  id: string;
  project_id: string;
  number: string;
  description: string;
  value: number;
  start_date?: string;
  end_date?: string;
  progress: number;
  products?: string[];
  responsibles?: string[];
}

export interface NewGoalData {
  number: string;
  description: string;
  value: string;
  start_date: Date | null;
  end_date: Date | null;
  progress: number;
  products: string[];
  responsibles: string[];
}
