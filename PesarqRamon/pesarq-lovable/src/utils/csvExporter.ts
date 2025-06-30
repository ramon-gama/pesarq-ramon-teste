
import { ArchivalFund } from "@/hooks/useArchivalFunds";

export const exportFundToCSV = (fund: ArchivalFund, organizationName: string) => {
  // Cabeçalhos compatíveis com AtoM (baseados nos campos padrão do sistema)
  const headers = [
    'identifier', // código do fundo
    'title', // nome do fundo
    'level_of_description', // nível de descrição
    'dates', // datas
    'creator', // produtor
    'scope_and_content', // âmbito e conteúdo
    'archival_history', // história arquivística
    'acquisition', // forma de ingresso
    'arrangement', // sistema de arranjo
    'access_conditions', // condições de acesso
    'reproduction_conditions', // condições de reprodução
    'language', // idioma
    'script', // sistema de escrita
    'language_note', // notas sobre idioma
    'physical_characteristics', // características físicas
    'finding_aids', // instrumentos de pesquisa
    'location_of_originals', // localização dos originais
    'location_of_copies', // localização de cópias
    'related_units', // unidades relacionadas
    'publication_note', // nota de publicação
    'general_note', // notas gerais
    'archivist_note', // notas do arquivista
    'rules_or_conventions', // regras ou convenções
    'status', // status de descrição
    'level_of_detail', // nível de detalhe
    'dates_of_creation_revision', // datas de criação/revisão
    'language_of_description', // idioma da descrição
    'script_of_description', // sistema de escrita da descrição
    'sources', // fontes
    'maintenance_notes' // notas de manutenção
  ];

  const startDate = fund.start_date ? new Date(fund.start_date).toLocaleDateString('pt-BR') : '';
  const endDate = fund.end_date ? new Date(fund.end_date).toLocaleDateString('pt-BR') : '';
  const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate || '';
  
  // Extensões formatadas
  const extensions = fund.extensions && fund.extensions.length > 0 
    ? fund.extensions.map(ext => {
        const parts = [];
        if (ext.quantity) parts.push(ext.quantity);
        if (ext.unit) parts.push(ext.unit);
        if (ext.support_type) parts.push(`(${ext.support_type})`);
        return parts.join(' ');
      }).join('; ')
    : '';

  // Instrumentos de pesquisa
  const researchInstruments = fund.research_instruments 
    ? Object.entries(fund.research_instruments)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => {
          switch(key) {
            case 'inventory': return 'Inventário';
            case 'guide': return 'Guia';
            case 'catalog': return 'Catálogo';
            case 'other': return 'Outros';
            default: return key;
          }
        }).join('; ')
    : '';

  const row = [
    fund.code || '', // identifier
    fund.name || '', // title
    fund.description_level || 'fundo', // level_of_description
    dateRange, // dates
    fund.producer_name || '', // creator
    fund.scope_content || '', // scope_and_content
    fund.origin_trajectory || '', // archival_history
    '', // acquisition - não temos esse campo
    fund.organization || '', // arrangement
    fund.access_restrictions || '', // access_conditions
    '', // reproduction_conditions - não temos esse campo
    fund.predominant_languages || 'Português', // language
    '', // script - não temos esse campo
    '', // language_note - não temos esse campo
    extensions, // physical_characteristics
    researchInstruments, // finding_aids
    '', // location_of_originals - não temos esse campo
    '', // location_of_copies - não temos esse campo
    fund.related_funds || '', // related_units
    '', // publication_note - não temos esse campo
    fund.complementary_notes || '', // general_note
    fund.observations || '', // archivist_note
    fund.used_standards || '', // rules_or_conventions
    fund.status || 'ativo', // status
    '', // level_of_detail - não temos esse campo
    fund.description_date ? new Date(fund.description_date).toLocaleDateString('pt-BR') : '', // dates_of_creation_revision
    'Português', // language_of_description
    '', // script_of_description - não temos esse campo
    '', // sources - não temos esse campo
    fund.description_responsible || '' // maintenance_notes
  ];

  // Criar conteúdo CSV
  const csvContent = [headers, row]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // Fazer download do arquivo
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `fundo_${fund.code || fund.name.replace(/[^a-zA-Z0-9]/g, '_')}_${organizationName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const exportFundsToCSV = (funds: ArchivalFund[], organizationName: string) => {
  // Cabeçalhos compatíveis com AtoM (baseados nos campos padrão do sistema)
  const headers = [
    'identifier', // código do fundo
    'title', // nome do fundo
    'level_of_description', // nível de descrição
    'dates', // datas
    'creator', // produtor
    'scope_and_content', // âmbito e conteúdo
    'archival_history', // história arquivística
    'acquisition', // forma de ingresso
    'arrangement', // sistema de arranjo
    'access_conditions', // condições de acesso
    'reproduction_conditions', // condições de reprodução
    'language', // idioma
    'script', // sistema de escrita
    'language_note', // notas sobre idioma
    'physical_characteristics', // características físicas
    'finding_aids', // instrumentos de pesquisa
    'location_of_originals', // localização dos originais
    'location_of_copies', // localização de cópias
    'related_units', // unidades relacionadas
    'publication_note', // nota de publicação
    'general_note', // notas gerais
    'archivist_note', // notas do arquivista
    'rules_or_conventions', // regras ou convenções
    'status', // status de descrição
    'level_of_detail', // nível de detalhe
    'dates_of_creation_revision', // datas de criação/revisão
    'language_of_description', // idioma da descrição
    'script_of_description', // sistema de escrita da descrição
    'sources', // fontes
    'maintenance_notes' // notas de manutenção
  ];

  // Converter fundos para formato CSV
  const rows = funds.map(fund => {
    const startDate = fund.start_date ? new Date(fund.start_date).toLocaleDateString('pt-BR') : '';
    const endDate = fund.end_date ? new Date(fund.end_date).toLocaleDateString('pt-BR') : '';
    const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate || '';
    
    // Extensões formatadas
    const extensions = fund.extensions && fund.extensions.length > 0 
      ? fund.extensions.map(ext => {
          const parts = [];
          if (ext.quantity) parts.push(ext.quantity);
          if (ext.unit) parts.push(ext.unit);
          if (ext.support_type) parts.push(`(${ext.support_type})`);
          return parts.join(' ');
        }).join('; ')
      : '';

    // Instrumentos de pesquisa
    const researchInstruments = fund.research_instruments 
      ? Object.entries(fund.research_instruments)
          .filter(([_, value]) => value === true)
          .map(([key, _]) => {
            switch(key) {
              case 'inventory': return 'Inventário';
              case 'guide': return 'Guia';
              case 'catalog': return 'Catálogo';
              case 'other': return 'Outros';
              default: return key;
            }
          }).join('; ')
      : '';

    return [
      fund.code || '', // identifier
      fund.name || '', // title
      fund.description_level || 'fundo', // level_of_description
      dateRange, // dates
      fund.producer_name || '', // creator
      fund.scope_content || '', // scope_and_content
      fund.origin_trajectory || '', // archival_history
      '', // acquisition - não temos esse campo
      fund.organization || '', // arrangement
      fund.access_restrictions || '', // access_conditions
      '', // reproduction_conditions - não temos esse campo
      fund.predominant_languages || 'Português', // language
      '', // script - não temos esse campo
      '', // language_note - não temos esse campo
      extensions, // physical_characteristics
      researchInstruments, // finding_aids
      '', // location_of_originals - não temos esse campo
      '', // location_of_copies - não temos esse campo
      fund.related_funds || '', // related_units
      '', // publication_note - não temos esse campo
      fund.complementary_notes || '', // general_note
      fund.observations || '', // archivist_note
      fund.used_standards || '', // rules_or_conventions
      fund.status || 'ativo', // status
      '', // level_of_detail - não temos esse campo
      fund.description_date ? new Date(fund.description_date).toLocaleDateString('pt-BR') : '', // dates_of_creation_revision
      'Português', // language_of_description
      '', // script_of_description - não temos esse campo
      '', // sources - não temos esse campo
      fund.description_responsible || '' // maintenance_notes
    ];
  });

  // Criar conteúdo CSV
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // Fazer download do arquivo
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `fundos_arquivisticos_${organizationName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
