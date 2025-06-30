

export interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  organization?: string;
  position?: string;
  createdAt: string;
  lastMaturityAssessment?: string;
  assessmentCount: number;
}

export type UserType = 'student' | 'public_organ' | 'institutional_partner';

export interface UserTypeInfo {
  type: UserType;
  label: string;
  description: string;
  features: string[];
  limitations: string[];
  color: string;
}

export const USER_TYPES: Record<UserType, UserTypeInfo> = {
  student: {
    type: 'student',
    label: 'Estudante/Pesquisador',
    description: 'Acesso a dados públicos da realidade arquivística das organizações para pesquisa e a ferramentas',
    features: [
      'Calculadoras arquivísticas',
      'Base de tipos documentais (consulta)',
      'Chat de discussões',
      'Estatísticas públicas'
    ],
    limitations: [
      'Não pode contribuir na wiki',
      'Sem avaliação de maturidade',
      'Relatórios limitados'
    ],
    color: 'bg-blue-500'
  },
  public_organ: {
    type: 'public_organ',
    label: 'Órgão Público',
    description: 'Acesso Parcial a Ferramentas',
    features: [
      'Todos os recursos de estudante',
      'Avaliação de maturidade (1x/ano)',
      'Contribuição na wiki',
      'Relatórios básicos',
      'Dashboard organizacional'
    ],
    limitations: [
      'Avaliação limitada a 1x por ano',
      'Recursos avançados restritos',
      'Suporte limitado'
    ],
    color: 'bg-green-500'
  },
  institutional_partner: {
    type: 'institutional_partner',
    label: 'Parceiro Institucional',
    description: 'Acesso Total',
    features: [
      'Acesso completo a todas as funcionalidades',
      'Avaliações ilimitadas',
      'Dashboards executivos',
      'Consultoria especializada',
      'Suporte prioritário',
      'Relatórios avançados'
    ],
    limitations: [],
    color: 'bg-purple-500'
  }
};

