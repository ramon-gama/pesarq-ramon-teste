
export interface CertificateData {
  researcherName: string;
  cpf: string;
  academicLevel: string;
  course: string;
  institution: string;
  function: string;
  projectTitle: string;
  startDate: string;
  endDate: string;
  workload: string;
  coordinator: string;
}

export const generateCertificatePDF = (data: CertificateData): void => {
  // Criar uma nova janela para o PDF
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar o PDF');
    return;
  }

  // Gerar código de autenticação único
  const authCode = generateAuthCode();
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Declaração - ${data.researcherName}</title>
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #000;
          margin: 0;
          padding: 0;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
        }
        
        .header h1 {
          font-size: 18px;
          font-weight: bold;
          margin: 5px 0;
          text-transform: uppercase;
        }
        
        .header h2 {
          font-size: 16px;
          font-weight: bold;
          margin: 5px 0;
          text-transform: uppercase;
        }
        
        .document-title {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin: 40px 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .content {
          text-align: justify;
          font-size: 14px;
          line-height: 2;
          margin: 30px 0;
        }
        
        .signature-area {
          margin-top: 80px;
          text-align: center;
        }
        
        .signature-line {
          border-top: 1px solid #000;
          width: 300px;
          margin: 60px auto 10px;
        }
        
        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        
        .auth-section {
          margin-top: 50px;
          padding: 20px;
          border: 2px solid #000;
          background-color: #f9f9f9;
        }
        
        .auth-code {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          font-size: 16px;
          color: #000;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>UNIVERSIDADE DE BRASÍLIA - UnB</h1>
        <h2>FACULDADE DE CIÊNCIA DA INFORMAÇÃO - FCI</h2>
      </div>
      
      <div class="document-title">DECLARAÇÃO</div>
      
      <div class="content">
        <p>Declaro, para os devidos fins, que <strong>${data.researcherName}</strong>, CPF <strong>${data.cpf}</strong>, ${data.academicLevel} em ${data.course} pela ${data.institution}, participou como <strong>${data.function}</strong> no projeto "<strong>${data.projectTitle}</strong>", no período de <strong>${data.startDate}</strong> a <strong>${data.endDate}</strong>, com carga horária de <strong>${data.workload}</strong> horas semanais.</p>
        
        <p>Durante sua participação, o pesquisador demonstrou competência técnica e dedicação às atividades desenvolvidas, contribuindo significativamente para o alcance dos objetivos propostos.</p>
        
        <p>Esta declaração é emitida a pedido do interessado, para que possa fazer prova junto a quem de direito.</p>
      </div>
      
      <div style="text-align: right; margin: 40px 0;">
        <p>Brasília, ${currentDate}.</p>
      </div>
      
      <div class="signature-area">
        <div class="signature-line"></div>
        <p><strong>${data.coordinator}</strong><br>Coordenador(a) do Projeto</p>
      </div>
      
      <div class="auth-section">
        <h3 style="margin-top: 0; text-align: center;">AUTENTICAÇÃO DO DOCUMENTO</h3>
        <p><strong>Código de Autenticação:</strong> <span class="auth-code">${authCode}</span></p>
        <p><strong>Data de Emissão:</strong> ${currentDate} às ${currentTime}</p>
        <p><strong>Sistema:</strong> PesArq - Plataforma de Gestão de Pesquisa Arquivística</p>
        <p style="font-size: 11px; margin-top: 15px; color: #666;">
          Este documento foi gerado eletronicamente pelo sistema PesArq. 
          Para verificar sua autenticidade, acesse o sistema e informe o código de autenticação acima.
        </p>
      </div>
      
      <div class="footer">
        <p>Documento gerado eletronicamente pelo Sistema PesArq</p>
        <p>Universidade de Brasília - Faculdade de Ciência da Informação</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Aguardar o carregamento e imprimir
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      
      // Fechar a janela após a impressão (opcional)
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
  };
  
  // Salvar o código de autenticação no localStorage para verificação futura
  saveAuthCode(authCode, data);
};

const generateAuthCode = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `UNB${timestamp.slice(-6)}${random}`;
};

const saveAuthCode = (authCode: string, data: CertificateData): void => {
  const authRecord = {
    code: authCode,
    researcherName: data.researcherName,
    cpf: data.cpf,
    projectTitle: data.projectTitle,
    coordinator: data.coordinator,
    issueDate: new Date().toISOString(),
    issueTime: new Date().toLocaleTimeString('pt-BR')
  };
  
  const existingCodes = JSON.parse(localStorage.getItem('certificateAuthCodes') || '[]');
  existingCodes.push(authRecord);
  
  // Manter apenas os últimos 1000 códigos para evitar sobrecarga
  if (existingCodes.length > 1000) {
    existingCodes.splice(0, existingCodes.length - 1000);
  }
  
  localStorage.setItem('certificateAuthCodes', JSON.stringify(existingCodes));
};

export const verifyAuthCode = (code: string): any => {
  const existingCodes = JSON.parse(localStorage.getItem('certificateAuthCodes') || '[]');
  return existingCodes.find((record: any) => record.code === code);
};
