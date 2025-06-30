
export interface Service {
  id: string;
  title: string;
  type: ServiceType;
  indicator: string;
  metric: number;
  unit: string;
  custom_unit?: string;
  support_type?: string;
  target_sector: string;
  responsible_person: string;
  status: ServiceStatus;
  start_date: string;
  end_date?: string;
  description: string;
  organization_id: string;
  archival_fund_id?: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export type ServiceType = 
  | 'conditioning'
  | 'environment_maintenance'
  | 'contract_administration'
  | 'compliance_support'
  | 'document_acquisition'
  | 'technical_assistance'
  | 'system_installation'
  | 'system_maintenance'
  | 'evaluation_selection'
  | 'congress_events'
  | 'technical_consulting'
  | 'biological_control'
  | 'document_type_creation'
  | 'unit_creation'
  | 'user_creation'
  | 'courses_workshops'
  | 'document_unarchiving'
  | 'document_disinfestation'
  | 'archival_instrument_elaboration'
  | 'technical_report_elaboration'
  | 'policy_norm_elaboration'
  | 'document_cleaning'
  | 'document_indexing'
  | 'archival_diagnosis'
  | 'environment_monitoring'
  | 'document_ordering'
  | 'document_petition'
  | 'document_collection'
  | 'document_restoration'
  | 'custody_transfer'
  | 'classification'
  | 'consultation'
  | 'conservation'
  | 'digitization'
  | 'elimination'
  | 'lending'
  | 'transfer'
  | 'other';

export type ServiceStatus = 'in_progress' | 'completed' | 'cancelled';

// Opções de unidades personalizadas
export const CUSTOM_UNITS = [
  { value: 'caixas', label: 'Caixas arquivo' },
  { value: 'metros_lineares', label: 'Metros lineares' },
  { value: 'itens', label: 'Itens' },
  { value: 'gb', label: 'GB (Documentos Digitais)' },
  { value: 'mb', label: 'MB (Documentos Digitais)' },
  { value: 'volumes', label: 'Volumes' },
  { value: 'documentos', label: 'Documentos' },
  { value: 'páginas', label: 'Páginas' },
  { value: 'unidades', label: 'Unidades' }
];

// Opções de tipos de suporte
export const SUPPORT_TYPES = [
  { value: 'papel', label: 'Papel' },
  { value: 'digital', label: 'Digital' },
  { value: 'microfilme', label: 'Microfilme' },
  { value: 'fotografico', label: 'Fotográfico' },
  { value: 'magnetico', label: 'Magnético' },
  { value: 'optico', label: 'Óptico' },
  { value: 'misto', label: 'Misto' }
];

export const SERVICE_TYPES = {
  conditioning: {
    label: 'Acondicionamento de Documentos',
    indicator: 'Quantidade de documentos acondicionados',
    unit: 'documentos'
  },
  environment_maintenance: {
    label: 'Adequação e Manutenção de Ambientes Arquivísticos',
    indicator: 'Área de ambiente adequado',
    unit: 'm²'
  },
  contract_administration: {
    label: 'Administração e Acompanhamento de Contratos',
    indicator: 'Quantidade de contratos administrados',
    unit: 'contratos'
  },
  compliance_support: {
    label: 'Apoio na Adequação e Conformidade da Organização',
    indicator: 'Quantidade de adequações realizadas',
    unit: 'adequações'
  },
  document_acquisition: {
    label: 'Aquisição de Documentos',
    indicator: 'Quantidade de documentos adquiridos',
    unit: 'documentos'
  },
  technical_assistance: {
    label: 'Assistência Técnica (Orientação)',
    indicator: 'Quantidade de orientações prestadas',
    unit: 'orientações'
  },
  evaluation_selection: {
    label: 'Avaliação e Seleção de Documentos',
    indicator: 'Quantidade de documentos avaliados',
    unit: 'documentos'
  },
  classification: {
    label: 'Classificação de Documentos',
    indicator: 'Quantidade de caixas arquivo',
    unit: 'caixas'
  },
  congress_events: {
    label: 'Congressos e Eventos Profissionais',
    indicator: 'Quantidade de eventos organizados',
    unit: 'eventos'
  },
  conservation: {
    label: 'Conservação/Restauração',
    indicator: 'Quantidade de documentos conservados',
    unit: 'documentos'
  },
  consultation: {
    label: 'Consulta de Acervo',
    indicator: 'Quantidade de consultas realizadas',
    unit: 'consultas'
  },
  technical_consulting: {
    label: 'Consultoria Técnica (Visita, Acompanhamento e Suporte)',
    indicator: 'Quantidade de consultorias realizadas',
    unit: 'consultorias'
  },
  biological_control: {
    label: 'Controle Biológico de Instalação',
    indicator: 'Área de controle realizado',
    unit: 'm²'
  },
  document_type_creation: {
    label: 'Criação ou Alteração de Tipo de Documento em Sistema',
    indicator: 'Quantidade de tipos criados/alterados',
    unit: 'tipos'
  },
  unit_creation: {
    label: 'Criação ou Alteração de Unidade em Sistema',
    indicator: 'Quantidade de unidades criadas/alteradas',
    unit: 'unidades'
  },
  user_creation: {
    label: 'Criação ou Alteração de Usuário no Sistema',
    indicator: 'Quantidade de usuários criados/alterados',
    unit: 'usuários'
  },
  courses_workshops: {
    label: 'Cursos/Oficinas',
    indicator: 'Quantidade de cursos/oficinas ministrados',
    unit: 'cursos'
  },
  document_unarchiving: {
    label: 'Desarquivamento de Documentos',
    indicator: 'Quantidade de documentos desarquivados',
    unit: 'documentos'
  },
  document_disinfestation: {
    label: 'Desinfestação de Documentos',
    indicator: 'Quantidade de documentos desinfestados',
    unit: 'documentos'
  },
  archival_diagnosis: {
    label: 'Diagnóstico Arquivístico',
    indicator: 'Quantidade de diagnósticos realizados',
    unit: 'diagnósticos'
  },
  digitization: {
    label: 'Digitalização',
    indicator: 'Quantidade de páginas digitalizadas',
    unit: 'páginas'
  },
  archival_instrument_elaboration: {
    label: 'Elaboração de Instrumento Arquivístico',
    indicator: 'Quantidade de instrumentos elaborados',
    unit: 'instrumentos'
  },
  technical_report_elaboration: {
    label: 'Elaboração de Laudo Técnico',
    indicator: 'Quantidade de laudos elaborados',
    unit: 'laudos'
  },
  policy_norm_elaboration: {
    label: 'Elaboração de Política e Norma',
    indicator: 'Quantidade de políticas/normas elaboradas',
    unit: 'documentos normativos'
  },
  elimination: {
    label: 'Eliminação de Documentos',
    indicator: 'Quantidade de documentos eliminados',
    unit: 'documentos'
  },
  lending: {
    label: 'Empréstimo de Documentos',
    indicator: 'Quantidade de documentos emprestados',
    unit: 'documentos'
  },
  document_cleaning: {
    label: 'Higienização de Documentos',
    indicator: 'Quantidade de documentos higienizados',
    unit: 'documentos'
  },
  document_indexing: {
    label: 'Indexação de Documentos',
    indicator: 'Quantidade de documentos indexados',
    unit: 'documentos'
  },
  system_installation: {
    label: 'Instalação de Sistema Arquivístico',
    indicator: 'Quantidade de sistemas instalados',
    unit: 'sistemas'
  },
  system_maintenance: {
    label: 'Manutenção de Sistema Arquivístico',
    indicator: 'Quantidade de manutenções realizadas',
    unit: 'manutenções'
  },
  environment_monitoring: {
    label: 'Monitoramento de Ambiente',
    indicator: 'Área de ambiente monitorado',
    unit: 'm²'
  },
  document_ordering: {
    label: 'Ordenação de Documento',
    indicator: 'Quantidade de documentos ordenados',
    unit: 'documentos'
  },
  other: {
    label: 'Outros Serviços',
    indicator: 'Métrica personalizada',
    unit: 'unidades'
  },
  document_petition: {
    label: 'Peticionamento de Documento',
    indicator: 'Quantidade de peticionamentos realizados',
    unit: 'peticionamentos'
  },
  document_collection: {
    label: 'Recolhimento de Documento',
    indicator: 'Quantidade de documentos recolhidos',
    unit: 'documentos'
  },
  document_restoration: {
    label: 'Restauração e Reparo de Documento',
    indicator: 'Quantidade de documentos restaurados',
    unit: 'documentos'
  },
  custody_transfer: {
    label: 'Transferência de Custódia',
    indicator: 'Quantidade de custódias transferidas',
    unit: 'custódias'
  },
  transfer: {
    label: 'Transferência de Documentos',
    indicator: 'Quantidade de metros lineares transferidos',
    unit: 'metros lineares'
  }
};

export const SERVICE_STATUS = {
  in_progress: {
    label: 'Em Andamento',
    color: 'bg-blue-100 text-blue-800'
  },
  completed: {
    label: 'Concluído',
    color: 'bg-green-100 text-green-800'
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800'
  }
};

// Lista padrão de setores organizacionais
export const DEFAULT_SECTORS = [
  'Administração',
  'Arquivo Geral',
  'Compras',
  'Comunicação',
  'Contabilidade',
  'Controladoria',
  'Diretoria',
  'Financeiro',
  'Gestão de Pessoas',
  'Jurídico',
  'Ouvidoria',
  'Patrimônio',
  'Planejamento',
  'Presidência',
  'Protocolo',
  'Recursos Humanos',
  'Secretaria',
  'Tecnologia da Informação',
  'Transparência'
];
