
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Calendar, Users } from "lucide-react";

interface AttendanceEmptyStateProps {
  type: 'no-project' | 'no-researchers' | 'complete';
  date?: string;
  shift?: 'manha' | 'tarde';
}

const formatDateToBrazilian = (dateString: string): string => {
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export function AttendanceEmptyState({ type, date, shift }: AttendanceEmptyStateProps) {
  if (type === 'no-project') {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Selecione um Projeto
          </h3>
          <p className="text-gray-600">
            Escolha um projeto para visualizar e registrar a frequência dos bolsistas.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (type === 'no-researchers') {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Nenhum Bolsista Presencial
          </h3>
          <p className="text-yellow-700">
            O projeto selecionado não possui bolsistas presenciais ativos cadastrados.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (type === 'complete' && date && shift) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Frequência Completa!
          </h3>
          <p className="text-green-700">
            Todos os bolsistas já têm registros para {formatDateToBrazilian(date)} no turno da {shift === 'manha' ? 'manhã' : 'tarde'}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
}
