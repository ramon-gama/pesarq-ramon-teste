
import { StrategicPlan, StrategicPlanObjective, StrategicPlanAction } from "@/hooks/useStrategicPlanning";

export const generateStrategicPlanPDF = (
  plan: StrategicPlan,
  objectives: StrategicPlanObjective[],
  actions: StrategicPlanAction[]
) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const planObjectives = objectives.filter(obj => obj.plan_id === plan.id);
  
  // Calcular estatísticas
  const totalObjectives = planObjectives.length;
  const completedObjectives = planObjectives.filter(obj => obj.completed).length;
  const totalActions = actions.filter(action => 
    planObjectives.some(obj => obj.id === action.objective_id)
  ).length;
  const completedActions = actions.filter(action => 
    planObjectives.some(obj => obj.id === action.objective_id) && action.status === 'completed'
  ).length;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${plan.name} - Planejamento Estratégico</title>
      <style>
        @page {
          margin: 2cm;
          size: A4;
          @bottom-center {
            content: counter(page);
            font-size: 12px;
            color: #666;
          }
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        
        .cover-page {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          text-align: center;
          page-break-after: always;
          background: linear-gradient(135deg, #15AB92 0%, #0d8f7a 100%);
          color: white;
          margin: -2cm;
          padding: 2cm;
        }
        
        .cover-title {
          font-size: 3em;
          font-weight: bold;
          margin-bottom: 0.5em;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .cover-subtitle {
          font-size: 1.5em;
          margin-bottom: 2em;
          opacity: 0.9;
        }
        
        .cover-info {
          background: rgba(255,255,255,0.1);
          padding: 2em;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        
        .cover-date {
          font-size: 1.2em;
          margin-top: 2em;
        }
        
        .content-page {
          page-break-before: always;
          margin-top: 2em;
        }
        
        .section {
          margin-bottom: 3em;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 1.8em;
          color: #15AB92;
          border-bottom: 3px solid #15AB92;
          padding-bottom: 0.5em;
          margin-bottom: 1em;
          page-break-after: avoid;
        }
        
        .subsection-title {
          font-size: 1.3em;
          color: #0d8f7a;
          margin-top: 2em;
          margin-bottom: 1em;
          page-break-after: avoid;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2em;
          margin: 1.5em 0;
        }
        
        .info-box {
          background: #f8f9fa;
          padding: 1.5em;
          border-radius: 8px;
          border-left: 4px solid #15AB92;
        }
        
        .info-label {
          font-weight: bold;
          color: #0d8f7a;
          margin-bottom: 0.5em;
        }
        
        .stats-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1em;
          margin: 2em 0;
        }
        
        .stat-box {
          text-align: center;
          background: #15AB92;
          color: white;
          padding: 1.5em;
          border-radius: 8px;
        }
        
        .stat-number {
          font-size: 2em;
          font-weight: bold;
          display: block;
        }
        
        .stat-label {
          font-size: 0.9em;
          opacity: 0.9;
        }
        
        .mission-vision-values {
          background: #f8f9fa;
          padding: 2em;
          border-radius: 10px;
          margin: 2em 0;
        }
        
        .mvv-item {
          margin-bottom: 2em;
        }
        
        .mvv-title {
          font-size: 1.2em;
          font-weight: bold;
          color: #15AB92;
          margin-bottom: 0.5em;
          display: flex;
          align-items: center;
        }
        
        .mvv-content {
          background: white;
          padding: 1.5em;
          border-radius: 6px;
          border-left: 4px solid #15AB92;
        }
        
        .values-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.5em;
          margin-top: 1em;
        }
        
        .value-item {
          background: white;
          padding: 0.8em;
          border-radius: 6px;
          border-left: 3px solid #15AB92;
        }
        
        .objective-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5em;
          margin-bottom: 1.5em;
          page-break-inside: avoid;
        }
        
        .objective-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1em;
        }
        
        .objective-title {
          font-size: 1.2em;
          font-weight: bold;
          color: #333;
          flex: 1;
        }
        
        .objective-status {
          background: #e8f5e8;
          color: #2d5a2d;
          padding: 0.3em 0.8em;
          border-radius: 4px;
          font-size: 0.9em;
          font-weight: bold;
        }
        
        .objective-status.completed {
          background: #d4edda;
          color: #155724;
        }
        
        .objective-progress {
          background: #f8f9fa;
          padding: 1em;
          border-radius: 6px;
          margin: 1em 0;
        }
        
        .progress-bar {
          background: #e0e0e0;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 0.5em;
        }
        
        .progress-fill {
          background: #15AB92;
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .action-item {
          background: #f8f9fa;
          padding: 1em;
          border-radius: 6px;
          border-left: 3px solid #15AB92;
          margin-bottom: 0.8em;
        }
        
        .action-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5em;
        }
        
        .action-title {
          font-weight: bold;
          color: #333;
        }
        
        .action-progress {
          font-size: 0.9em;
          color: #666;
        }
        
        .no-data {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 2em;
        }
        
        .footer-info {
          margin-top: 3em;
          padding-top: 2em;
          border-top: 2px solid #15AB92;
          text-align: center;
          color: #666;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <!-- Página de Capa -->
      <div class="cover-page">
        <div class="cover-title">PLANEJAMENTO ESTRATÉGICO</div>
        <div class="cover-subtitle">${plan.name}</div>
        <div class="cover-info">
          <div><strong>Período:</strong> ${plan.duration} anos</div>
          <div><strong>Data de Início:</strong> ${new Date(plan.start_date).toLocaleDateString('pt-BR')}</div>
          <div><strong>Status:</strong> ${
            plan.status === 'draft' ? 'Rascunho' :
            plan.status === 'in_progress' ? 'Em Andamento' : 'Concluído'
          }</div>
        </div>
        <div class="cover-date">Gerado em ${currentDate}</div>
      </div>

      <!-- Sumário Executivo -->
      <div class="content-page">
        <div class="section">
          <h1 class="section-title">📊 SUMÁRIO EXECUTIVO</h1>
          
          <div class="stats-container">
            <div class="stat-box">
              <span class="stat-number">${totalObjectives}</span>
              <span class="stat-label">Objetivos</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">${completedObjectives}</span>
              <span class="stat-label">Concluídos</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">${totalActions}</span>
              <span class="stat-label">Ações</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">${plan.progress}%</span>
              <span class="stat-label">Progresso</span>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Nome do Planejamento</div>
              <div>${plan.name}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Duração</div>
              <div>${plan.duration} anos</div>
            </div>
            <div class="info-box">
              <div class="info-label">Data de Início</div>
              <div>${new Date(plan.start_date).toLocaleDateString('pt-BR')}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Status Atual</div>
              <div>${
                plan.status === 'draft' ? 'Rascunho' :
                plan.status === 'in_progress' ? 'Em Andamento' : 'Concluído'
              }</div>
            </div>
          </div>

          ${plan.description ? `
            <div class="subsection-title">Descrição</div>
            <p>${plan.description}</p>
          ` : ''}
        </div>

        <!-- Missão, Visão e Valores -->
        ${(plan.mission || plan.vision || (plan.values && plan.values.length > 0)) ? `
        <div class="section">
          <h1 class="section-title">🎯 MISSÃO, VISÃO E VALORES</h1>
          
          <div class="mission-vision-values">
            ${plan.mission ? `
            <div class="mvv-item">
              <div class="mvv-title">🎯 MISSÃO</div>
              <div class="mvv-content">${plan.mission}</div>
            </div>
            ` : ''}
            
            ${plan.vision ? `
            <div class="mvv-item">
              <div class="mvv-title">👁️ VISÃO</div>
              <div class="mvv-content">${plan.vision}</div>
            </div>
            ` : ''}
            
            ${(plan.values && plan.values.length > 0) ? `
            <div class="mvv-item">
              <div class="mvv-title">⭐ VALORES</div>
              <div class="values-list">
                ${plan.values.map(value => `<div class="value-item">• ${value}</div>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        <!-- Objetivos Estratégicos -->
        <div class="section">
          <h1 class="section-title">🎯 OBJETIVOS ESTRATÉGICOS</h1>
          
          ${planObjectives.length > 0 ? 
            planObjectives.map((objective) => {
              const objectiveActions = actions.filter(action => action.objective_id === objective.id);
              return `
                <div class="objective-card">
                  <div class="objective-header">
                    <div class="objective-title">${objective.title}</div>
                    <div class="objective-status ${objective.completed ? 'completed' : ''}">${objective.completed ? 'Concluído' : 'Em Andamento'}</div>
                  </div>
                  
                  ${objective.description ? `<p>${objective.description}</p>` : ''}
                  
                  <div class="objective-progress">
                    <div><strong>Progresso:</strong> ${objective.progress}%</div>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${objective.progress}%"></div>
                    </div>
                  </div>

                  ${(objective.start_date || objective.end_date) ? `
                  <div class="info-grid">
                    ${objective.start_date ? `
                    <div class="info-box">
                      <div class="info-label">Data de Início</div>
                      <div>${new Date(objective.start_date).toLocaleDateString('pt-BR')}</div>
                    </div>
                    ` : ''}
                    ${objective.end_date ? `
                    <div class="info-box">
                      <div class="info-label">Data de Término</div>
                      <div>${new Date(objective.end_date).toLocaleDateString('pt-BR')}</div>
                    </div>
                    ` : ''}
                  </div>
                  ` : ''}

                  ${objectiveActions.length > 0 ? `
                  <div class="subsection-title">Ações (${objectiveActions.length})</div>
                  ${objectiveActions.map(action => `
                    <div class="action-item">
                      <div class="action-header">
                        <div class="action-title">${action.title}</div>
                        <div class="action-progress">${action.progress}%</div>
                      </div>
                      ${action.description ? `<div>${action.description}</div>` : ''}
                      ${action.responsible_person ? `<div><strong>Responsável:</strong> ${action.responsible_person}</div>` : ''}
                    </div>
                  `).join('')}
                  ` : ''}
                </div>
              `;
            }).join('') 
            : '<div class="no-data">Nenhum objetivo estratégico cadastrado ainda.</div>'
          }
        </div>

        <div class="footer-info">
          <div><strong>${plan.name}</strong></div>
          <div>Documento gerado automaticamente em ${currentDate}</div>
          <div>Sistema de Gestão Arquivística e Planejamento Estratégico</div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Criar uma nova janela para impressão/PDF
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    newWindow.focus();
    
    // Aguardar o carregamento completo antes de imprimir
    setTimeout(() => {
      newWindow.print();
    }, 500);
  }
};
