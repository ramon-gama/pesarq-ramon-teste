
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, FileArchive, UserCheck, Edit, MapPin, Phone, Mail, Clock, UsersIcon, Archive, Hash, User, Warehouse } from "lucide-react";
import { useStorageLocations } from "@/hooks/useStorageLocations";

interface OrganizationOverviewProps {
  organizationInfo: any;
  archiveSectorInfo: any;
  funds: any[];
  authorities: any[];
  team: any[];
  sectors: any[];
  organizationId: string;
  onEditOrganization: () => void;
  onEditArchiveSector: () => void;
}

export function OrganizationOverview({
  organizationInfo,
  archiveSectorInfo,
  funds,
  authorities,
  team,
  sectors,
  organizationId,
  onEditOrganization,
  onEditArchiveSector
}: OrganizationOverviewProps) {
  
  // Hook movido diretamente para onde é usado
  const { storageLocations } = useStorageLocations(organizationId);
  
  console.log('🏛️ OrganizationOverview - Storage locations from hook:', {
    count: storageLocations?.length || 0,
    data: storageLocations
  });

  const storageCount = Array.isArray(storageLocations) ? storageLocations.length : 0;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Building2 className="h-5 w-5" />
              Informações da Organização
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onEditOrganization}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                <p className="text-sm break-words">{organizationInfo.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Hash className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">Sigla</p>
                <p className="text-sm">{organizationInfo.acronym}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileArchive className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">CNPJ</p>
                <p className="text-sm">{organizationInfo.cnpj}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <p className="text-sm break-words">{organizationInfo.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p className="text-sm break-all">{organizationInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">E-mail</p>
                <p className="text-sm break-all">{organizationInfo.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileArchive className="h-5 w-5" />
              Setor de Arquivo
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onEditArchiveSector}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">Responsável</p>
                <p className="text-sm break-words">{archiveSectorInfo.manager}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">Localização</p>
                <p className="text-sm break-words">{archiveSectorInfo.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">Horário de Funcionamento</p>
                <p className="text-sm">{archiveSectorInfo.workingHours}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <UsersIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">Tamanho da Equipe</p>
                <p className="text-sm">{archiveSectorInfo.teamSize}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Archive className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">Capacidade de Armazenamento</p>
                <p className="text-sm">{archiveSectorInfo.storageCapacity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <Users className="h-6 sm:h-8 w-6 sm:w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{team.length}</p>
            <p className="text-xs sm:text-sm text-purple-700">Membros da Equipe</p>
          </CardContent>
        </Card>
        <Card className="bg-teal-50 border-teal-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <Warehouse className="h-6 sm:h-8 w-6 sm:w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-teal-600">{storageCount}</p>
            <p className="text-xs sm:text-sm text-teal-700">Locais de Armazenamento</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <Building2 className="h-6 sm:h-8 w-6 sm:w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-orange-600">{sectors.length}</p>
            <p className="text-xs sm:text-sm text-orange-700">Setores</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <FileArchive className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{funds.length}</p>
            <p className="text-xs sm:text-sm text-blue-700">Fundos Arquivísticos</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <UserCheck className="h-6 sm:h-8 w-6 sm:w-8 text-green-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-green-600">{authorities.length}</p>
            <p className="text-xs sm:text-sm text-green-700">Autoridades</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
