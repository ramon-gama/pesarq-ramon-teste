import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Archive, Plus, Edit, Trash2 } from "lucide-react";
import { useStorageLocations, StorageLocation } from "@/hooks/useStorageLocations";
import { StorageLocationModal } from "../StorageLocationModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
interface OrganizationStorageProps {
  organizationId: string;
}
export function OrganizationStorage({
  organizationId
}: OrganizationStorageProps) {
  const {
    storageLocations,
    loading,
    createStorageLocation,
    updateStorageLocation,
    deleteStorageLocation
  } = useStorageLocations(organizationId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<StorageLocation | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<StorageLocation | null>(null);
  const getCapacityColor = (capacity: number) => {
    if (capacity > 80) return 'text-red-700 bg-red-100';
    if (capacity > 60) return 'text-yellow-700 bg-yellow-100';
    return 'text-green-700 bg-green-100';
  };
  const getTotalDocuments = () => {
    return storageLocations.reduce((total, location) => total + location.total_documents, 0);
  };
  const getAverageCapacity = () => {
    if (storageLocations.length === 0) return 0;
    const totalCapacity = storageLocations.reduce((total, location) => {
      return total + location.capacity_percentage;
    }, 0);
    return Math.round(totalCapacity / storageLocations.length);
  };
  const handleCreateLocation = async (data: Omit<StorageLocation, 'id' | 'created_at' | 'updated_at'>) => {
    await createStorageLocation(data);
    setIsCreateModalOpen(false);
  };
  const handleUpdateLocation = async (id: string, data: Partial<StorageLocation>) => {
    await updateStorageLocation(id, data);
    setEditingLocation(null);
  };
  const handleDeleteLocation = async () => {
    if (deletingLocation) {
      await deleteStorageLocation(deletingLocation.id);
      setDeletingLocation(null);
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando locais de armazenamento...</p>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Archive className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{storageLocations.length}</p>
            <p className="text-sm text-blue-700">Locais de Armazenamento</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Archive className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{getTotalDocuments().toLocaleString()}</p>
            <p className="text-sm text-green-700">Total de Caixas de Documentos</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <Archive className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{getAverageCapacity()}%</p>
            <p className="text-sm text-orange-700">Capacidade Média</p>
          </CardContent>
        </Card>
      </div>

      {/* Header com botão de adicionar */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Locais de Armazenamento</h3>
          <p className="text-sm text-gray-600">Gerencie os espaços físicos onde os documentos são armazenados</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Local
        </Button>
      </div>

      {/* Lista de locais de armazenamento */}
      {storageLocations.length === 0 ? <Card>
          <CardContent className="p-8 text-center">
            <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum local de armazenamento cadastrado
            </h3>
            <p className="text-gray-600 mb-4">
              Comece adicionando o primeiro local onde os documentos são armazenados.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Local
            </Button>
          </CardContent>
        </Card> : <div className="grid grid-cols-1 gap-6">
          {storageLocations.map(location => <Card key={location.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Archive className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                      {location.description && <p className="text-sm text-gray-600 mt-1">{location.description}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingLocation(location)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeletingLocation(location)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {location.address && <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Localização</p>
                        <p className="text-sm">{location.address}</p>
                      </div>
                    </div>}
                  
                  <div className="flex items-center gap-2">
                    <Archive className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total de Caixas de Documentos</p>
                      <p className="text-sm font-semibold">{location.total_documents.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {location.responsible_person && <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Responsável</p>
                        <p className="text-sm">{location.responsible_person}</p>
                      </div>
                    </div>}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Capacidade Utilizada</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCapacityColor(location.capacity_percentage)}`}>
                      {location.capacity_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${location.capacity_percentage > 80 ? 'bg-red-500' : location.capacity_percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{
                width: `${location.capacity_percentage}%`
              }}></div>
                  </div>
                </div>

                {location.document_types && location.document_types.length > 0 && <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Tipos de Documentos</p>
                    <div className="flex flex-wrap gap-2">
                      {location.document_types.map((type, index) => <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {type}
                        </span>)}
                    </div>
                  </div>}
              </CardContent>
            </Card>)}
        </div>}

      {/* Modal de criação/edição */}
      <StorageLocationModal isOpen={isCreateModalOpen || !!editingLocation} onClose={() => {
      setIsCreateModalOpen(false);
      setEditingLocation(null);
    }} onSave={handleCreateLocation} onUpdate={handleUpdateLocation} organizationId={organizationId} location={editingLocation} mode={editingLocation ? 'edit' : 'create'} />

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deletingLocation} onOpenChange={() => setDeletingLocation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o local "{deletingLocation?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingLocation(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLocation}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
}