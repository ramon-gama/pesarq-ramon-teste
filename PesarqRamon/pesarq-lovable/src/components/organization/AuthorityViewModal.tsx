
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Authority } from "@/hooks/useAuthorities";

interface AuthorityViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  authority: Authority | null;
  organizationName?: string;
  fundName?: string;
}

export function AuthorityViewModal({ 
  isOpen, 
  onClose, 
  authority, 
  organizationName,
  fundName 
}: AuthorityViewModalProps) {
  if (!authority) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pessoa': return 'Pessoa';
      case 'familia': return 'Família';
      case 'entidade_coletiva': return 'Entidade Coletiva';
      default: return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={authority.image_url} alt={authority.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {authority.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span>{authority.name}</span>
              {authority.position && (
                <p className="text-sm text-muted-foreground font-normal">{authority.position}</p>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            Visualização completa das informações da autoridade
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Nome</h4>
                  <p className="text-sm">{authority.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Tipo</h4>
                  <p className="text-sm">{getTypeLabel(authority.type)}</p>
                </div>
              </div>
              
              {authority.position && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Cargo/Posição</h4>
                  <p className="text-sm">{authority.position}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Data de início</h4>
                  <p className="text-sm">{formatDate(authority.start_date)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Data de fim</h4>
                  <p className="text-sm">{formatDate(authority.end_date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Organização</h4>
                  <p className="text-sm">{organizationName || 'N/A'}</p>
                </div>
                {fundName && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Fundo Relacionado</h4>
                    <p className="text-sm">{fundName}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Biografia */}
          {authority.biography && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Biografia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{authority.biography}</p>
              </CardContent>
            </Card>
          )}

          {/* Informações de Contato */}
          {authority.contact_info && Object.keys(authority.contact_info).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {authority.contact_info.email && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Email</h4>
                    <p className="text-sm">{authority.contact_info.email}</p>
                  </div>
                )}
                {authority.contact_info.phone && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Telefone</h4>
                    <p className="text-sm">{authority.contact_info.phone}</p>
                  </div>
                )}
                {authority.contact_info.address && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Endereço</h4>
                    <p className="text-sm">{authority.contact_info.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
