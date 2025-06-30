
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  User,
  Building2,
  ImageIcon,
  ZoomIn,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { calculateCriticality } from "@/utils/criticalityClassification";

interface SectorResponsesDetailProps {
  sectorName: string;
  onNavigateBack: () => void;
}

const sectorResponses = {
  perguntas: [
    {
      id: 1,
      pergunta: "Você considera que seu Setor enfrenta problemas relacionados à gestão, preservação e/ou acesso aos documentos?",
      resposta: "Desafios Significativos",
      imagens: []
    },
    {
      id: 2,
      pergunta: "O seu setor guarda documentos em papel dentro das salas de trabalho ou em áreas próximas?",
      resposta: "Sim",
      imagens: []
    },
    {
      id: 3,
      pergunta: "Qual é a característica do(s) ambiente(s) onde o seu setor guarda os documentos?",
      resposta: "Espaço da própria organização",
      imagens: []
    },
    {
      id: 4,
      pergunta: "Qual é a quantidade aproximada de documentos em papel no seu setor (em número de caixas-arquivo)?",
      resposta: "De 201 a 500 caixas",
      imagens: []
    },
    {
      id: 5,
      pergunta: "Como está o estado de conservação dos documentos em papel no seu Setor?",
      resposta: "Regular",
      imagens: []
    },
    {
      id: 6,
      pergunta: "Como estão as condições dos locais onde seu setor guarda os documentos em papel?",
      resposta: "Razoável",
      imagens: []
    },
    {
      id: 7,
      pergunta: "O seu setor ainda produz ou recebe documentos em papel nas atividades do dia a dia?",
      resposta: "Sim",
      imagens: []
    },
    {
      id: 8,
      pergunta: "Com que frequência os documentos do seu setor são consultados?",
      resposta: "Frequente",
      imagens: []
    },
    {
      id: 9,
      pergunta: "Envie até 04 imagens da situação dos documentos do seu Setor",
      resposta: "4 imagens enviadas",
      imagens: [
        { id: 1, url: "/placeholder.svg", nome: "arquivo_problema_01.jpg" },
        { id: 2, url: "/placeholder.svg", nome: "gestao_documentos.jpg" },
        { id: 3, url: "/placeholder.svg", nome: "caixas_arquivo_01.jpg" },
        { id: 4, url: "/placeholder.svg", nome: "conservacao_regular.jpg" }
      ]
    }
  ],
  informacoes: {
    respondente: "João Silva",
    cargo: "Coordenador de Recursos Humanos",
    dataResposta: "15/11/2024",
    tempoResposta: "25 minutos",
    totalImagens: 4
  }
};

export function SectorResponsesDetail({ sectorName, onNavigateBack }: SectorResponsesDetailProps) {
  // Calcular criticidade baseada nas respostas
  const responsesForCalculation = sectorResponses.perguntas.slice(0, 8).map(p => ({
    pergunta: p.pergunta,
    resposta: p.resposta
  }));
  
  const criticalityResult = calculateCriticality(responsesForCalculation);
  
  const getCriticalityIcon = (level: string) => {
    switch (level) {
      case 'alta': return AlertTriangle;
      case 'moderada': return TrendingUp;
      case 'baixa': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getCriticalityLabel = (level: string) => {
    switch (level) {
      case 'alta': return 'Alta Criticidade';
      case 'moderada': return 'Criticidade Moderada';
      case 'baixa': return 'Sem Criticidade';
      default: return 'Revisar Manualmente';
    }
  };

  const getCriticalityBadgeVariant = (level: string) => {
    switch (level) {
      case 'alta': return "destructive";
      case 'moderada': return "secondary";
      case 'baixa': return "default";
      default: return "outline";
    }
  };

  const handleExportPDF = () => {
    // Prepare data for PDF export
    const reportData = {
      title: `Relatório de Respostas - ${sectorName}`,
      sector: sectorName,
      respondent: sectorResponses.informacoes.respondente,
      date: sectorResponses.informacoes.dataResposta,
      criticality: criticalityResult,
      responses: sectorResponses.perguntas
    };

    const IconComponent = getCriticalityIcon(criticalityResult.level);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Diagnóstico - ${sectorName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; margin-bottom: 20px; }
          .info-section { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .criticality-section { background: ${criticalityResult.color}20; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid ${criticalityResult.color}; }
          .question { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .question h3 { margin-top: 0; color: #333; }
          .reasons { margin-top: 10px; }
          .reasons ul { margin: 5px 0; padding-left: 20px; }
        </style>
      </head>
      <body>
        <h1>Relatório de Diagnóstico de Seleção de Setores</h1>
        
        <div class="info-section">
          <h2>Informações Gerais</h2>
          <p><strong>Setor:</strong> ${sectorName}</p>
          <p><strong>Respondente:</strong> ${sectorResponses.informacoes.respondente}</p>
          <p><strong>Cargo:</strong> ${sectorResponses.informacoes.cargo}</p>
          <p><strong>Data da Resposta:</strong> ${sectorResponses.informacoes.dataResposta}</p>
          <p><strong>Total de Imagens Enviadas:</strong> ${sectorResponses.informacoes.totalImagens}</p>
        </div>

        <div class="criticality-section">
          <h2>Classificação de Criticidade Arquivística</h2>
          <p><strong>Nível:</strong> ${getCriticalityLabel(criticalityResult.level)}</p>
          <p><strong>Pontuação:</strong> ${criticalityResult.score}%</p>
          <p><strong>Descrição:</strong> ${criticalityResult.tooltip}</p>
          <div class="reasons">
            <strong>Critérios Considerados:</strong>
            <ul>
              ${criticalityResult.reasons.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
          </div>
        </div>

        <h2>Respostas Detalhadas</h2>
        ${sectorResponses.perguntas.map((pergunta, index) => `
          <div class="question">
            <h3>Pergunta ${index + 1}</h3>
            <p><strong>Questão:</strong> ${pergunta.pergunta}</p>
            <p><strong>Resposta:</strong> ${pergunta.resposta}</p>
            ${pergunta.imagens.length > 0 ? `<p><strong>Imagens enviadas:</strong> ${pergunta.imagens.length}</p>` : ''}
          </div>
        `).join('')}

        <div class="info-section">
          <p><em>Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}</em></p>
        </div>
      </body>
      </html>
    `;

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

  const handleExportExcel = () => {
    // Prepare data for Excel export
    const headers = [
      'Pergunta',
      'Resposta', 
      'Imagens Enviadas'
    ];

    const csvData = sectorResponses.perguntas.map(pergunta => [
      pergunta.pergunta,
      pergunta.resposta,
      pergunta.imagens.length
    ]);

    const fullData = [
      ['RELATÓRIO DE DIAGNÓSTICO DE SELEÇÃO DE SETORES'],
      [''],
      ['Setor:', sectorName],
      ['Respondente:', sectorResponses.informacoes.respondente],
      ['Cargo:', sectorResponses.informacoes.cargo],
      ['Data da Resposta:', sectorResponses.informacoes.dataResposta],
      ['Classificação de Criticidade:', getCriticalityLabel(criticalityResult.level)],
      ['Pontuação de Criticidade:', `${criticalityResult.score}%`],
      ['Total de Imagens Enviadas:', sectorResponses.informacoes.totalImagens],
      [''],
      headers,
      ...csvData
    ];

    const csvContent = fullData.map(row => 
      row.map(field => 
        typeof field === 'string' && (field.includes(',') || field.includes('"')) 
          ? `"${field.replace(/"/g, '""')}"` 
          : field
      ).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `diagnostico_${sectorName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const IconComponent = getCriticalityIcon(criticalityResult.level);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onNavigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Respostas Detalhadas - {sectorName}</h1>
              <p className="text-muted-foreground">Diagnóstico de Seleção de Setores</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Informações do Respondente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações da Resposta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Respondente</span>
              <span className="font-medium">{sectorResponses.informacoes.respondente}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Cargo</span>
              <span className="font-medium">{sectorResponses.informacoes.cargo}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Data da Resposta</span>
              <span className="font-medium">{sectorResponses.informacoes.dataResposta}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Imagens Enviadas</span>
              <span className="font-medium">{sectorResponses.informacoes.totalImagens}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classificação de Criticidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" style={{ color: criticalityResult.color }} />
            Classificação de Criticidade Arquivística
          </CardTitle>
          <CardDescription>
            Avaliação automática baseada nos critérios de criticidade arquivística
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge 
                variant={getCriticalityBadgeVariant(criticalityResult.level)}
                className="flex items-center gap-2 text-base px-4 py-2"
              >
                <IconComponent className="h-4 w-4" />
                {getCriticalityLabel(criticalityResult.level)}
              </Badge>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Pontuação</span>
                <span className="font-bold text-lg" style={{ color: criticalityResult.color }}>
                  {criticalityResult.score}%
                </span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ backgroundColor: `${criticalityResult.color}10`, borderColor: `${criticalityResult.color}40` }}>
              <p className="font-medium mb-2" style={{ color: criticalityResult.color }}>
                {criticalityResult.tooltip}
              </p>
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Critérios considerados:</span>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {criticalityResult.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-xs mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Respostas Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas do Questionário</CardTitle>
          <CardDescription>
            Detalhamento de todas as perguntas respondidas pelo setor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sectorResponses.perguntas.map((pergunta, index) => (
            <div key={pergunta.id} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{index + 1}</span>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-medium text-base mb-2">{pergunta.pergunta}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">Resposta:</span>
                      <span className="font-medium">{pergunta.resposta}</span>
                    </div>
                    
                    {/* Seção de Imagens - Centralizada como no formulário */}
                    {pergunta.imagens.length > 0 && (
                      <div className="mt-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Imagens enviadas ({pergunta.imagens.length}/4)
                          </span>
                        </div>
                        <div className="flex justify-center">
                          <div className="grid grid-cols-2 gap-4 max-w-md">
                            {pergunta.imagens.map((imagem) => (
                              <Dialog key={imagem.id}>
                                <DialogTrigger asChild>
                                  <div className="relative group cursor-pointer">
                                    <img
                                      src={imagem.url}
                                      alt={imagem.nome}
                                      className="w-full h-24 object-cover rounded border border-gray-200 hover:border-primary transition-colors"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                      <ZoomIn className="h-5 w-5 text-white" />
                                    </div>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle>{imagem.nome}</DialogTitle>
                                    <DialogDescription>
                                      Imagem enviada para a pergunta {index + 1}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <img
                                      src={imagem.url}
                                      alt={imagem.nome}
                                      className="w-full max-h-[70vh] object-contain rounded"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {index < sectorResponses.perguntas.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
