
import { Service, SERVICE_TYPES, SERVICE_STATUS } from "@/types/service";

export const exportToPDF = (services: Service[], title: string = "Relatório de Serviços") => {
  // Create a simple HTML structure for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status-in_progress { background-color: #dbeafe; color: #1e40af; }
        .status-completed { background-color: #dcfce7; color: #166534; }
        .status-cancelled { background-color: #fee2e2; color: #dc2626; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
      <p>Total de serviços: ${services.length}</p>
      
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Setor</th>
            <th>Responsável</th>
            <th>Status</th>
            <th>Data de Início</th>
            <th>Métrica</th>
          </tr>
        </thead>
        <tbody>
          ${services.map(service => `
            <tr>
              <td>${service.title}</td>
              <td>${SERVICE_TYPES[service.type]?.label || service.type}</td>
              <td>${service.target_sector}</td>
              <td>${service.responsible_person}</td>
              <td><span class="status status-${service.status}">${SERVICE_STATUS[service.status]?.label || service.status}</span></td>
              <td>${new Date(service.start_date).toLocaleDateString('pt-BR')}</td>
              <td>${service.metric} ${service.unit}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Create a new window and print
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    newWindow.focus();
    setTimeout(() => {
      newWindow.print();
      newWindow.close();
    }, 250);
  }
};

export const exportToExcel = (services: Service[], filename: string = "servicos") => {
  // Prepare data for CSV export (which can be opened in Excel)
  const headers = [
    'Título',
    'Tipo de Serviço',
    'Setor Alvo',
    'Responsável',
    'Status',
    'Data de Início',
    'Data de Término',
    'Indicador',
    'Métrica',
    'Unidade',
    'Descrição'
  ];

  const csvData = services.map(service => [
    service.title,
    SERVICE_TYPES[service.type]?.label || service.type,
    service.target_sector,
    service.responsible_person,
    SERVICE_STATUS[service.status]?.label || service.status,
    new Date(service.start_date).toLocaleDateString('pt-BR'),
    service.end_date ? new Date(service.end_date).toLocaleDateString('pt-BR') : '',
    service.indicator,
    service.metric,
    service.unit,
    service.description
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
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
