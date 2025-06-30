
import jsPDF from 'jspdf';

interface DeclarationData {
  researcherName: string;
  cpf: string;
  projectTitle: string;
  selectedGoal: string;
  hours: number;
  startDate: string;
  endDate: string;
  coordinator1: string;
  coordinator2: string;
  faculty: string;
  observations?: string;
}

// Função para gerar código de verificação único
function generateAuthCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `UNB${timestamp}${random}`;
}

// Função para salvar dados da declaração para verificação posterior
function saveDeclarationData(authCode: string, data: DeclarationData) {
  const declarations = JSON.parse(localStorage.getItem('pesarq_declarations') || '{}');
  declarations[authCode] = {
    ...data,
    issueDate: new Date().toISOString(),
    issueTime: new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date())
  };
  localStorage.setItem('pesarq_declarations', JSON.stringify(declarations));
}

// Função para verificar código de autenticação
export function verifyAuthCode(authCode: string) {
  const declarations = JSON.parse(localStorage.getItem('pesarq_declarations') || '{}');
  return declarations[authCode] || null;
}

export function generateDeclarationPDF(data: DeclarationData) {
  const authCode = generateAuthCode();
  saveDeclarationData(authCode, data);
  
  const issueDate = new Intl.DateTimeFormat('pt-BR').format(new Date());
  const issueTime = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());

  const startDateFormatted = new Intl.DateTimeFormat('pt-BR').format(new Date(data.startDate));
  const endDateFormatted = new Intl.DateTimeFormat('pt-BR').format(new Date(data.endDate));

  // Criar o PDF
  const pdf = new jsPDF();
  
  // Configurar fonte e cores
  pdf.setFont('helvetica');
  
  // Header com logo e informações da universidade
  pdf.setFontSize(20);
  pdf.setTextColor(21, 171, 146); // Cor #15AB92
  pdf.text('PesArq', 105, 30, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setTextColor(102, 102, 102); // Cor cinza
  pdf.text('Pesquisa Aplicada em Arquivologia', 105, 40, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text('Universidade de Brasília - UnB', 105, 50, { align: 'center' });
  pdf.text(data.faculty, 105, 60, { align: 'center' });
  
  // Linha separadora
  pdf.setDrawColor(21, 171, 146);
  pdf.setLineWidth(1);
  pdf.line(20, 70, 190, 70);
  
  // Título da declaração
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('DECLARAÇÃO DE PARTICIPAÇÃO EM PROJETO DE PESQUISA', 105, 90, { align: 'center' });
  
  // Conteúdo da declaração
  pdf.setFontSize(12);
  const yStart = 110;
  let currentY = yStart;
  
  const text1 = `Declaramos, para os devidos fins, que ${data.researcherName}, CPF ${data.cpf}, participou como bolsista do projeto de pesquisa intitulado "${data.projectTitle}".`;
  
  const splitText1 = pdf.splitTextToSize(text1, 170);
  pdf.text(splitText1, 20, currentY);
  currentY += splitText1.length * 6;
  
  currentY += 10;
  
  const text2 = `A participação ocorreu no período de ${startDateFormatted} a ${endDateFormatted}, com carga horária total de ${data.hours} ${data.hours > 1 ? 'horas' : 'hora'}.`;
  
  const splitText2 = pdf.splitTextToSize(text2, 170);
  pdf.text(splitText2, 20, currentY);
  currentY += splitText2.length * 6;
  
  currentY += 10;
  
  const text3 = `Meta trabalhada: ${data.selectedGoal}`;
  const splitText3 = pdf.splitTextToSize(text3, 170);
  pdf.text(splitText3, 20, currentY);
  currentY += splitText3.length * 6;
  
  if (data.observations) {
    currentY += 10;
    const text4 = `Observações: ${data.observations}`;
    const splitText4 = pdf.splitTextToSize(text4, 170);
    pdf.text(splitText4, 20, currentY);
    currentY += splitText4.length * 6;
  }
  
  currentY += 10;
  
  const text5 = 'Esta declaração é emitida para comprovação da participação do discente no referido projeto de pesquisa.';
  const splitText5 = pdf.splitTextToSize(text5, 170);
  pdf.text(splitText5, 20, currentY);
  currentY += splitText5.length * 6;
  
  // Data e hora de emissão
  currentY += 20;
  pdf.text(`Brasília-DF, ${issueDate} às ${issueTime}`, 170, currentY, { align: 'right' });
  
  // Assinaturas
  currentY += 40;
  
  // Linha para assinatura 1
  pdf.line(30, currentY, 90, currentY);
  pdf.text(data.coordinator1, 60, currentY + 8, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text('Coordenador do Projeto', 60, currentY + 16, { align: 'center' });
  
  // Linha para assinatura 2
  pdf.line(120, currentY, 180, currentY);
  pdf.setFontSize(12);
  pdf.text(data.coordinator2, 150, currentY + 8, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text('Gestor do Projeto', 150, currentY + 16, { align: 'center' });
  
  // Seção de autenticação
  currentY += 40;
  
  // Caixa para código de verificação
  pdf.setDrawColor(21, 171, 146);
  pdf.setFillColor(248, 249, 250);
  pdf.rect(20, currentY, 170, 35, 'FD');
  
  pdf.setFontSize(14);
  pdf.setTextColor(21, 171, 146);
  pdf.text('CÓDIGO DE VERIFICAÇÃO', 105, currentY + 12, { align: 'center' });
  
  pdf.setFontSize(18);
  pdf.setFont('courier', 'bold');
  pdf.text(authCode, 105, currentY + 24, { align: 'center' });
  
  pdf.setFont('helvetica');
  pdf.setFontSize(10);
  pdf.setTextColor(102, 102, 102);
  pdf.text('Para verificar a autenticidade desta declaração, acesse o sistema PesArq', 105, currentY + 32, { align: 'center' });
  
  // Rodapé com informações do documento
  const footerY = currentY + 45;
  pdf.setFontSize(8);
  pdf.text(`Documento emitido eletronicamente em ${issueDate} às ${issueTime}`, 105, footerY, { align: 'center' });
  pdf.text(`Código de Autenticidade: ${authCode}`, 105, footerY + 8, { align: 'center' });
  
  // Salvar o PDF
  const fileName = `declaracao_${data.researcherName.replace(/\s+/g, '_')}_${authCode}.pdf`;
  pdf.save(fileName);

  console.log('Declaração PDF gerada com código de verificação:', authCode);
  
  return authCode;
}
