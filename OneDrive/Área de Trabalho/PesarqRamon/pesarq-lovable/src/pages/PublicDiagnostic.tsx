
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectorSelectionForm } from "@/components/SectorSelectionForm";
import { WorkSectorsDiagnosticForm } from "@/components/diagnostics/WorkSectorsDiagnosticForm";
import { ArchiveSectorDiagnosticForm } from "@/components/diagnostics/ArchiveSectorDiagnosticForm";
import { FileSearch, Shield, Building2, Users, Archive } from "lucide-react";

const diagnosticInfo = {
  "selecao-setores": {
    title: "Diagnóstico de Seleção de Setores",
    description: "Identificação dos setores mais críticos para diagnóstico aprofundado",
    icon: FileSearch,
    component: SectorSelectionForm
  },
  "setores-trabalho": {
    title: "Diagnóstico de Setores de Trabalho",
    description: "Avaliação completa das práticas arquivísticas em setores de trabalho",
    icon: Users,
    component: WorkSectorsDiagnosticForm
  },
  "setor-arquivo": {
    title: "Diagnóstico do Setor de Arquivo",
    description: "Avaliação específica do setor de arquivo da instituição",
    icon: Archive,
    component: ArchiveSectorDiagnosticForm
  },
  "historico-institucional": {
    title: "Diagnóstico Histórico-Institucional", 
    description: "Análise da evolução histórica e estrutura institucional",
    icon: Building2,
    component: null // Componente será criado posteriormente
  },
  "conformidade-politicas": {
    title: "Diagnóstico de Conformidade das Políticas, Normas e Manuais",
    description: "Aderência às normativas arquivísticas",
    icon: Shield,
    component: null // Componente será criado posteriormente
  }
};

export default function PublicDiagnostic() {
  const { diagnosticId, linkId } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const sectorId = searchParams.get('sector');

  const diagnostic = diagnosticInfo[diagnosticId as keyof typeof diagnosticInfo];

  if (!diagnostic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Diagnóstico não encontrado</CardTitle>
            <CardDescription className="text-center">
              O link que você acessou não é válido ou expirou.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Entre em contato com o setor de arquivo para obter um novo link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const IconComponent = diagnostic.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{diagnostic.title}</h1>
              <p className="text-muted-foreground">{diagnostic.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary">Formulário Público</Badge>
            {sectorId && <Badge variant="outline">Setor Específico</Badge>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {diagnostic.component ? (
          <diagnostic.component 
            isPublicForm={true}
            sectorId={sectorId}
            selectedSector={sectorId}
            onNavigateBack={() => window.history.back()}
          />
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Diagnóstico em Desenvolvimento</CardTitle>
              <CardDescription>
                Este diagnóstico está sendo preparado e estará disponível em breve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Agradecemos seu interesse. Entre em contato com o setor de arquivo para mais informações.
              </p>
              <Button onClick={() => window.history.back()}>
                Voltar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Sistema de Diagnóstico Arquivístico • Formulário Público</p>
        </div>
      </div>
    </div>
  );
}
