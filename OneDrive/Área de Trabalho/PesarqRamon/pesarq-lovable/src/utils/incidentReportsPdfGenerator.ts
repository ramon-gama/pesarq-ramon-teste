
import jsPDF from 'jspdf';

interface IncidentReportWithIncident {
  id: string;
  incident_id: string;
  final_report: string | null;
  identified_causes: string | null;
  corrective_actions: string | null;
  future_recommendations: string | null;
  closure_date: string | null;
  technical_responsible: string | null;
  status: 'em-andamento' | 'concluido' | 'pendente';
  created_at: string;
  updated_at: string;
  incidents: {
    title: string;
    id: string;
    date: string;
    severity: string;
    type: string;
    location: string | null;
    responsible: string | null;
  };
}

export const generateIncidentReportPDF = (report: IncidentReportWithIncident) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Título principal
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE INCIDENTE ARQUIVÍSTICO', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Informações do incidente
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO INCIDENTE', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const incidentInfo = [
    `Título: ${report.incidents?.title || 'N/A'}`,
    `Data do Incidente: ${report.incidents?.date ? new Date(report.incidents.date).toLocaleString('pt-BR') : 'N/A'}`,
    `Tipo: ${report.incidents?.type || 'N/A'}`,
    `Gravidade: ${report.incidents?.severity || 'N/A'}`,
    `Local: ${report.incidents?.location || 'N/A'}`,
    `Responsável: ${report.incidents?.responsible || 'N/A'}`,
  ];

  incidentInfo.forEach(info => {
    doc.text(info, margin, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Informações do relatório
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO RELATÓRIO', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const reportInfo = [
    `ID do Relatório: ${report.id.slice(0, 8)}`,
    `Status: ${getStatusLabel(report.status)}`,
    `Responsável Técnico: ${report.technical_responsible || 'Não definido'}`,
    `Data de Criação: ${new Date(report.created_at).toLocaleString('pt-BR')}`,
    `Última Atualização: ${new Date(report.updated_at).toLocaleString('pt-BR')}`,
    `Data de Encerramento: ${report.closure_date ? new Date(report.closure_date).toLocaleString('pt-BR') : 'Não encerrado'}`,
  ];

  reportInfo.forEach(info => {
    doc.text(info, margin, yPosition);
    yPosition += 7;
  });

  yPosition += 15;

  // Relatório final
  if (report.final_report) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO FINAL', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const finalReportLines = doc.splitTextToSize(report.final_report, contentWidth);
    doc.text(finalReportLines, margin, yPosition);
    yPosition += (finalReportLines.length * 5) + 10;
  }

  // Causas identificadas
  if (report.identified_causes) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CAUSAS IDENTIFICADAS', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const causesLines = doc.splitTextToSize(report.identified_causes, contentWidth);
    doc.text(causesLines, margin, yPosition);
    yPosition += (causesLines.length * 5) + 10;
  }

  // Ações corretivas
  if (report.corrective_actions) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AÇÕES CORRETIVAS REALIZADAS', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const actionsLines = doc.splitTextToSize(report.corrective_actions, contentWidth);
    doc.text(actionsLines, margin, yPosition);
    yPosition += (actionsLines.length * 5) + 10;
  }

  // Recomendações futuras
  if (report.future_recommendations) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMENDAÇÕES FUTURAS', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const recommendationsLines = doc.splitTextToSize(report.future_recommendations, contentWidth);
    doc.text(recommendationsLines, margin, yPosition);
    yPosition += (recommendationsLines.length * 5) + 10;
  }

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Relatório gerado em ${new Date().toLocaleString('pt-BR')} - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Salvar o PDF
  const fileName = `relatorio_incidente_${report.id.slice(0, 8)}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const generateAllIncidentReportsPDF = (reports: IncidentReportWithIncident[]) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Título principal
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO CONSOLIDADO DE INCIDENTES', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Estatísticas gerais
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTATÍSTICAS GERAIS', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const stats = {
    total: reports.length,
    concluidos: reports.filter(r => r.status === 'concluido').length,
    emAndamento: reports.filter(r => r.status === 'em-andamento').length,
    pendentes: reports.filter(r => r.status === 'pendente').length,
  };

  const statsInfo = [
    `Total de Relatórios: ${stats.total}`,
    `Concluídos: ${stats.concluidos}`,
    `Em Andamento: ${stats.emAndamento}`,
    `Pendentes: ${stats.pendentes}`,
    `Taxa de Conclusão: ${stats.total > 0 ? Math.round((stats.concluidos / stats.total) * 100) : 0}%`,
  ];

  statsInfo.forEach(info => {
    doc.text(info, margin, yPosition);
    yPosition += 7;
  });

  yPosition += 15;

  // Lista de relatórios
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LISTA DE RELATÓRIOS', margin, yPosition);
  yPosition += 10;

  reports.forEach((report, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${report.incidents?.title || 'Incidente sem título'}`, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const reportDetails = [
      `   ID: ${report.id.slice(0, 8)}`,
      `   Status: ${getStatusLabel(report.status)}`,
      `   Responsável: ${report.technical_responsible || 'Não definido'}`,
      `   Última atualização: ${new Date(report.updated_at).toLocaleString('pt-BR')}`,
    ];

    reportDetails.forEach(detail => {
      doc.text(detail, margin, yPosition);
      yPosition += 5;
    });

    yPosition += 8;
  });

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Relatório gerado em ${new Date().toLocaleString('pt-BR')} - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Salvar o PDF
  const fileName = `relatorio_consolidado_incidentes_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

const getStatusLabel = (status: string): string => {
  const statusMap = {
    'em-andamento': 'Em Andamento',
    'concluido': 'Concluído',
    'pendente': 'Pendente'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

export const exportIncidentReportsToExcel = (reports: IncidentReportWithIncident[]) => {
  const headers = [
    'ID do Relatório',
    'Título do Incidente',
    'Tipo do Incidente',
    'Gravidade',
    'Data do Incidente',
    'Local',
    'Responsável pelo Incidente',
    'Status do Relatório',
    'Responsável Técnico',
    'Data de Criação',
    'Última Atualização',
    'Data de Encerramento',
    'Relatório Final',
    'Causas Identificadas',
    'Ações Corretivas',
    'Recomendações Futuras'
  ];

  const csvData = reports.map(report => [
    report.id.slice(0, 8),
    report.incidents?.title || '',
    report.incidents?.type || '',
    report.incidents?.severity || '',
    report.incidents?.date ? new Date(report.incidents.date).toLocaleDateString('pt-BR') : '',
    report.incidents?.location || '',
    report.incidents?.responsible || '',
    getStatusLabel(report.status),
    report.technical_responsible || '',
    new Date(report.created_at).toLocaleDateString('pt-BR'),
    new Date(report.updated_at).toLocaleDateString('pt-BR'),
    report.closure_date ? new Date(report.closure_date).toLocaleDateString('pt-BR') : '',
    report.final_report || '',
    report.identified_causes || '',
    report.corrective_actions || '',
    report.future_recommendations || ''
  ]);

  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => 
      row.map(field => 
        // Escape commas and quotes in fields
        typeof field === 'string' && (field.includes(',') || field.includes('"')) 
          ? `"${field.replace(/"/g, '""')}"` 
          : field
      ).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio_incidentes_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
