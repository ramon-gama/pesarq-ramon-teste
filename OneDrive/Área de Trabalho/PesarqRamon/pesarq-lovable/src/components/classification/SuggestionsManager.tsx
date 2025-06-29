
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MessageSquare, ThumbsUp, ThumbsDown, Eye } from "lucide-react";

interface SuggestionsManagerProps {
  currentVersion: any;
}

export function SuggestionsManager({ currentVersion }: SuggestionsManagerProps) {
  const [showNewSuggestion, setShowNewSuggestion] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    title: "",
    description: "",
    unitCode: "",
    type: "improvement"
  });

  const suggestions = [
    {
      id: "1",
      title: "Reformular descrição da função 000",
      description: "A descrição atual da função 'Administração Geral' poderia ser mais específica, incluindo exemplos práticos das atividades abrangidas.",
      unitCode: "000",
      unitTitle: "ADMINISTRAÇÃO GERAL",
      type: "improvement",
      status: "open",
      priority: "medium",
      submittedBy: "Maria Santos",
      submittedAt: "2024-03-10",
      votes: { up: 5, down: 1 },
      comments: 3
    },
    {
      id: "2", 
      title: "Nova atividade para gestão de contratos",
      description: "Proposta de criação de uma nova atividade específica para gestão de contratos administrativos, que atualmente está dispersa em diferentes códigos.",
      unitCode: "020",
      unitTitle: "GESTÃO DE RECURSOS",
      type: "new_unit",
      status: "under_review",
      priority: "high",
      submittedBy: "João Silva",
      submittedAt: "2024-03-08",
      votes: { up: 8, down: 0 },
      comments: 6
    },
    {
      id: "3",
      title: "Inativar código obsoleto",
      description: "O código 015 referente a 'Protocolo manual' não é mais utilizado na instituição desde a implementação do sistema eletrônico.",
      unitCode: "015", 
      unitTitle: "PROTOCOLO MANUAL",
      type: "deactivation",
      status: "approved",
      priority: "low",
      submittedBy: "Ana Costa",
      submittedAt: "2024-03-05",
      votes: { up: 12, down: 2 },
      comments: 4
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      improvement: "bg-blue-100 text-blue-800",
      new_unit: "bg-green-100 text-green-800",
      deactivation: "bg-red-100 text-red-800",
      modification: "bg-yellow-100 text-yellow-800"
    };
    return colors[type as keyof typeof colors] || colors.improvement;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      improvement: "Melhoria",
      new_unit: "Nova Unidade", 
      deactivation: "Inativação",
      modification: "Modificação"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-gray-100 text-gray-800",
      under_review: "bg-amber-100 text-amber-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      open: "Aberta",
      under_review: "Em Análise",
      approved: "Aprovada", 
      rejected: "Rejeitada"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "text-green-600",
      medium: "text-yellow-600",
      high: "text-red-600"
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const handleSubmitSuggestion = () => {
    console.log('Nova sugestão:', newSuggestion);
    setShowNewSuggestion(false);
    setNewSuggestion({ title: "", description: "", unitCode: "", type: "improvement" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestão de Sugestões</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {suggestions.length} sugestões • {suggestions.filter(s => s.status === 'open').length} abertas
              </p>
            </div>
            <Button 
              onClick={() => setShowNewSuggestion(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Sugestão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(suggestion.type)}>
                        {getTypeLabel(suggestion.type)}
                      </Badge>
                      <Badge className={getStatusColor(suggestion.status)}>
                        {getStatusLabel(suggestion.status)}
                      </Badge>
                      <span className={`text-sm font-medium ${getPriorityColor(suggestion.priority)}`}>
                        {suggestion.priority === 'high' ? 'Alta' : suggestion.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold mb-1">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Código: {suggestion.unitCode} - {suggestion.unitTitle}</span>
                      <span>Por: {suggestion.submittedBy}</span>
                      <span>{new Date(suggestion.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="ml-1">{suggestion.votes.up}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                        <ThumbsDown className="h-4 w-4" />
                        <span className="ml-1">{suggestion.votes.down}</span>
                      </Button>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="ml-1">{suggestion.comments} comentários</span>
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    {suggestion.status === 'open' && (
                      <Button size="sm">
                        Implementar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showNewSuggestion && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Sugestão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Sugestão</Label>
                <Input
                  id="title"
                  value={newSuggestion.title}
                  onChange={(e) => setNewSuggestion(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Resumo da sugestão..."
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição Detalhada</Label>
                <Textarea
                  id="description"
                  value={newSuggestion.description}
                  onChange={(e) => setNewSuggestion(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva sua sugestão em detalhes..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unitCode">Código da Unidade (opcional)</Label>
                  <Input
                    id="unitCode"
                    value={newSuggestion.unitCode}
                    onChange={(e) => setNewSuggestion(prev => ({ ...prev, unitCode: e.target.value }))}
                    placeholder="Ex: 000"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo de Sugestão</Label>
                  <select
                    id="type"
                    value={newSuggestion.type}
                    onChange={(e) => setNewSuggestion(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="improvement">Melhoria</option>
                    <option value="new_unit">Nova Unidade</option>
                    <option value="modification">Modificação</option>
                    <option value="deactivation">Inativação</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSubmitSuggestion}>
                  Enviar Sugestão
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewSuggestion(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
