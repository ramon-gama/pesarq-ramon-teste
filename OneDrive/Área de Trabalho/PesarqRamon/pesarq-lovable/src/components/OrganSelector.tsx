import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Edit, Trash2, Users, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useOrganizationContext } from "@/contexts/OrganizationContext";

// Use the Organization interface from useOrganizations hook instead of defining a local one
import type { Organization } from "@/hooks/useOrganizations";

interface OrganSelectorProps {
  onSelectOrgan: (organ: Organization) => void;
}

const OrganSelector = ({ onSelectOrgan }: OrganSelectorProps) => {
  const { organizations, loading, createOrganization } = useOrganizations();
  const { availableOrganizations, setCurrentOrganization } = useOrganizationContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrgan, setNewOrgan] = useState({ name: "", description: "" });

  // Função para gerar iniciais da organização
  const getOrgInitials = (name: string) => {
    return name
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Função para gerar cor baseada no nome
  const getOrgColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-indigo-500',
      'bg-red-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleAddOrgan = async () => {
    if (newOrgan.name && newOrgan.description) {
      const organData = {
        name: newOrgan.name,
        type: 'municipal',
        status: 'ativa'
      };
      
      const result = await createOrganization(organData);
      if (result) {
        setNewOrgan({ name: "", description: "" });
        setShowAddForm(false);
      }
    }
  };

  const handleSelectOrgan = (organ: Organization) => {
    console.log('OrganSelector - selecting organ with logo_url:', organ.logo_url);
    // Atualiza o contexto de organização
    setCurrentOrganization(organ);
    // Chama o callback para compatibilidade
    onSelectOrgan(organ);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando organizações...</p>
        </div>
      </div>
    );
  }

  // Usa as organizações disponíveis do contexto
  const displayOrganizations = availableOrganizations.length > 0 ? availableOrganizations : organizations;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Selecionar Órgão</h2>
          <p className="text-gray-600 mt-2">Escolha o órgão para gerenciar diagnósticos arquivísticos</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Órgão
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Órgão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="organ-name">Nome do Órgão</Label>
              <Input
                id="organ-name"
                value={newOrgan.name}
                onChange={(e) => setNewOrgan({ ...newOrgan, name: e.target.value })}
                placeholder="Ex: Secretaria Municipal de Educação"
              />
            </div>
            <div>
              <Label htmlFor="organ-description">Descrição</Label>
              <Input
                id="organ-description"
                value={newOrgan.description}
                onChange={(e) => setNewOrgan({ ...newOrgan, description: e.target.value })}
                placeholder="Breve descrição do órgão"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddOrgan}>Adicionar</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayOrganizations.map((organ) => (
          <Card key={organ.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  {organ.logo_url && (
                    <AvatarImage src={organ.logo_url} alt={organ.name} className="object-contain" />
                  )}
                  <AvatarFallback className={`${getOrgColor(organ.name)} text-white text-sm font-semibold`}>
                    {getOrgInitials(organ.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{organ.name}</CardTitle>
                  <CardDescription>{organ.type} - {organ.status}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-xs text-gray-500">Setores</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-xs text-gray-500">Perguntas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-xs text-gray-500">Respostas</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-sm text-gray-500">
                    Criado em {new Date(organ.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <Badge variant="secondary">Ativo</Badge>
                </div>
                
                <Button 
                  onClick={() => handleSelectOrgan(organ)} 
                  className="w-full"
                >
                  Acessar Diagnósticos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayOrganizations.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma organização encontrada</h3>
            <p className="text-gray-600 mb-4">
              Comece cadastrando uma nova organização
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Órgão
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrganSelector;
