
export interface ClassificacaoItem {
  codigo: string;
  atividade: string;
  funcao: string;
}

export const classificacaoDocumentosAtividadeMeio: ClassificacaoItem[] = [
  // Administração Geral
  { codigo: "010", atividade: "Normatização e Regulamentação", funcao: "Administração Geral" },
  { codigo: "011", atividade: "Modernização e Reforma Administrativa", funcao: "Administração Geral" },
  { codigo: "012", atividade: "Supervisão e Coordenação", funcao: "Administração Geral" },
  { codigo: "013", atividade: "Operações Auxiliares", funcao: "Administração Geral" },
  { codigo: "014", atividade: "Auditoria", funcao: "Administração Geral" },
  
  // Gestão de Pessoas
  { codigo: "020", atividade: "Planejamento de Recursos Humanos", funcao: "Gestão de Pessoas" },
  { codigo: "021", atividade: "Provimento", funcao: "Gestão de Pessoas" },
  { codigo: "022", atividade: "Vacância", funcao: "Gestão de Pessoas" },
  { codigo: "023", atividade: "Direitos e Deveres", funcao: "Gestão de Pessoas" },
  { codigo: "024", atividade: "Capacitação", funcao: "Gestão de Pessoas" },
  { codigo: "025", atividade: "Saúde Ocupacional", funcao: "Gestão de Pessoas" },
  { codigo: "026", atividade: "Previdência Social", funcao: "Gestão de Pessoas" },
  
  // Gestão Orçamentária e Financeira
  { codigo: "030", atividade: "Planejamento Orçamentário", funcao: "Gestão Orçamentária e Financeira" },
  { codigo: "031", atividade: "Execução Orçamentária", funcao: "Gestão Orçamentária e Financeira" },
  { codigo: "032", atividade: "Execução Financeira", funcao: "Gestão Orçamentária e Financeira" },
  { codigo: "033", atividade: "Gestão de Convênios", funcao: "Gestão Orçamentária e Financeira" },
  
  // Gestão de Materiais e Patrimônio
  { codigo: "040", atividade: "Planejamento de Recursos Materiais", funcao: "Gestão de Materiais e Patrimônio" },
  { codigo: "041", atividade: "Licitações e Contratos", funcao: "Gestão de Materiais e Patrimônio" },
  { codigo: "042", atividade: "Compras", funcao: "Gestão de Materiais e Patrimônio" },
  { codigo: "043", atividade: "Gestão de Estoques", funcao: "Gestão de Materiais e Patrimônio" },
  { codigo: "044", atividade: "Gestão Patrimonial", funcao: "Gestão de Materiais e Patrimônio" },
  
  // Comunicação Social e Eventos
  { codigo: "050", atividade: "Comunicação Institucional", funcao: "Comunicação Social e Eventos" },
  { codigo: "051", atividade: "Publicidade e Propaganda", funcao: "Comunicação Social e Eventos" },
  { codigo: "052", atividade: "Cerimonial e Protocolo", funcao: "Comunicação Social e Eventos" },
  
  // Gestão da Informação e Documentação
  { codigo: "060", atividade: "Gestão Documental", funcao: "Gestão da Informação e Documentação" },
  { codigo: "061", atividade: "Tecnologia da Informação", funcao: "Gestão da Informação e Documentação" },
  { codigo: "062", atividade: "Estatística", funcao: "Gestão da Informação e Documentação" },
  
  // Relações Jurídicas
  { codigo: "070", atividade: "Atos Jurídicos", funcao: "Relações Jurídicas" },
  { codigo: "071", atividade: "Ações Judiciais", funcao: "Relações Jurídicas" },
  
  // Infraestrutura e Serviços Gerais
  { codigo: "080", atividade: "Infraestrutura Física", funcao: "Infraestrutura e Serviços Gerais" },
  { codigo: "081", atividade: "Segurança e Vigilância", funcao: "Infraestrutura e Serviços Gerais" },
  { codigo: "082", atividade: "Transporte", funcao: "Infraestrutura e Serviços Gerais" },
  { codigo: "083", atividade: "Telecomunicações", funcao: "Infraestrutura e Serviços Gerais" },
  
  // Controle Interno e Externo
  { codigo: "090", atividade: "Controle Interno", funcao: "Controle Interno e Externo" },
  { codigo: "091", atividade: "Controle Externo", funcao: "Controle Interno e Externo" }
];
