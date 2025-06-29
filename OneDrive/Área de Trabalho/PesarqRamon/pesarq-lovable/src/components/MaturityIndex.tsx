
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EvaluationAssessment } from "./EvaluationAssessment";
import { MaturityOverview } from "./maturity/MaturityOverview";
import { MaturityAssessment } from "./maturity/MaturityAssessment";
import { MaturityDashboard } from "./maturity/MaturityDashboard";
import { MaturityCategories } from "./maturity/MaturityCategories";
import { MaturityHistory } from "./maturity/MaturityHistory";
import { useMaturityEvaluation } from "@/hooks/useMaturityEvaluation";

interface MaturityIndexProps {
  onNavigateBack?: () => void;
}

export function MaturityIndex({ onNavigateBack }: MaturityIndexProps) {
  const [activeView, setActiveView] = useState<'overview' | 'assessment' | 'dashboard' | 'evaluation'>('overview');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const { setCurrentEvaluation } = useMaturityEvaluation();

  const handleStartAssessment = () => {
    setActiveView('assessment');
  };

  const handleViewDashboard = () => {
    setActiveView('dashboard');
  };

  const handleBackToOverview = () => {
    setActiveView('overview');
    setSelectedCategoryId('');
    setCurrentEvaluation(null);
  };

  const handleStartCategoryEvaluation = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setActiveView('evaluation');
  };

  const handleBackToAssessment = () => {
    setActiveView('assessment');
    setSelectedCategoryId('');
  };

  if (activeView === 'evaluation') {
    return (
      <EvaluationAssessment 
        categoryId={selectedCategoryId}
        onBack={handleBackToAssessment}
      />
    );
  }

  if (activeView === 'assessment') {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handleBackToOverview}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <MaturityAssessment onStartCategoryEvaluation={handleStartCategoryEvaluation} />
      </div>
    );
  }

  if (activeView === 'dashboard') {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handleBackToOverview}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <MaturityDashboard />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Botão de voltar */}
      {onNavigateBack && (
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={onNavigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Ferramentas de Avaliação
          </Button>
        </div>
      )}

      <MaturityOverview 
        onStartAssessment={handleStartAssessment}
        onViewDashboard={handleViewDashboard}
      />

      <MaturityCategories />

      <MaturityHistory />
    </div>
  );
}
