
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, Plus, Edit, Trash2, Eye } from "lucide-react";

interface OrganizationAuthoritiesProps {
  authorities: any[];
  funds: any[];
  organizationInfo: any;
  onCreateAuthority: () => void;
  onEditAuthority: (authority: any) => void;
  onDeleteAuthority: (id: string) => void;
  onViewAuthority?: (authority: any) => void;
}

export function OrganizationAuthorities({
  authorities,
  funds,
  organizationInfo,
  onCreateAuthority,
  onEditAuthority,
  onDeleteAuthority,
  onViewAuthority
}: OrganizationAuthoritiesProps) {
  const handleViewClick = (authority: any) => {
    if (typeof onViewAuthority === 'function') {
      onViewAuthority(authority);
    } else {
      console.error('onViewAuthority is not available');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Autoridades</h3>
        <Button onClick={onCreateAuthority}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Autoridade
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authorities.map((authority) => (
          <Card key={authority.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={authority.image_url} alt={authority.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {authority.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate mb-1">{authority.name}</h4>
                  {authority.position && (
                    <p className="text-sm text-muted-foreground mb-2">{authority.position}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {authority.type === 'pessoa' ? 'Pessoa' : 
                       authority.type === 'familia' ? 'Família' : 
                       'Entidade Coletiva'}
                    </Badge>
                    {authority.start_date && !authority.end_date && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                        Atual
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {authority.start_date && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Início:</span>
                    <span>{new Date(authority.start_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {authority.end_date && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Fim:</span>
                    <span>{new Date(authority.end_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                
                {authority.fund_id && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Fundo:</span>
                    <span className="text-right truncate max-w-32">
                      {funds.find(fund => fund.id === authority.fund_id)?.name || 'N/A'}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Organização:</span>
                  <span className="text-right truncate max-w-32">{organizationInfo.name}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewClick(authority)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditAuthority(authority)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a autoridade "{authority.name}"?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteAuthority(authority.id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {authorities.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma autoridade cadastrada</h3>
            <p className="text-gray-600 mb-4">Comece criando a primeira autoridade</p>
            <Button onClick={onCreateAuthority}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Autoridade
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
