
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Building2, Plus, Edit, Trash2, Upload } from "lucide-react";

interface OrganizationSectorsProps {
  sectors: any[];
  onCreateSector: () => void;
  onEditSector: (sector: any) => void;
  onDeleteSector: (id: string) => void;
  onImportSectors: () => void;
}

export function OrganizationSectors({
  sectors,
  onCreateSector,
  onEditSector,
  onDeleteSector,
  onImportSectors
}: OrganizationSectorsProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg font-semibold">Setores</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={onImportSectors} variant="outline" className="flex-1 sm:flex-none">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button onClick={onCreateSector} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            Novo Setor
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sectors.map((sector) => (
          <Card key={sector.id}>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-semibold break-words">{sector.name}</h4>
                    {sector.acronym && <span className="text-sm text-gray-500">({sector.acronym})</span>}
                    <Badge variant={sector.status === 'ativo' ? 'default' : 'secondary'}>
                      {sector.status}
                    </Badge>
                    {sector.area_type && (
                      <Badge variant="outline">
                        {sector.area_type === 'finalistica' ? 'Finalística' : 'Suporte'}
                      </Badge>
                    )}
                  </div>
                  {sector.description && (
                    <p className="text-sm text-gray-600 mb-2 break-words">{sector.description}</p>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4 text-sm">
                    <div>
                      <span className="font-medium">Código:</span> <span className="break-words">{sector.code || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium">SIORG:</span> <span className="break-words">{sector.siorg_code || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Estado/Cidade:</span> {sector.state && sector.city ? `${sector.state}/${sector.city}` : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Contato:</span> {sector.contact_email || sector.contact_phone || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end lg:justify-start">
                  <Button size="sm" variant="outline" onClick={() => onEditSector(sector)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o setor "{sector.name}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteSector(sector.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sectors.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum setor cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece criando o primeiro setor ou importando uma lista</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={onImportSectors} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar Setores
              </Button>
              <Button onClick={onCreateSector}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Setor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
