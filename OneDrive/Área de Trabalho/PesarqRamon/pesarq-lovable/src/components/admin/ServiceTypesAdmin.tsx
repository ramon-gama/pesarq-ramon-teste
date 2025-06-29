
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Building2,
  User,
  FileText,
  Calendar
} from "lucide-react";

interface ServiceTypeRequest {
  id: string;
  requested_type_name: string;
  description: string;
  justification: string;
  suggested_unit: string;
  suggested_indicator: string;
  examples: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string;
  created_at: string;
  organizations: { name: string } | null;
}

export function ServiceTypesAdmin() {
  const [requests, setRequests] = useState<ServiceTypeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceTypeRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_type_requests')
        .select(`
          *,
          organizations (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('❌ Erro ao buscar solicitações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as solicitações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('service_type_requests')
        .update({
          status: newStatus,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: newStatus === 'approved' ? "Solicitação Aprovada" : "Solicitação Rejeitada",
        description: `A solicitação foi ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso.`,
      });

      setSelectedRequest(null);
      setAdminNotes('');
      fetchRequests();
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da solicitação.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="p-6">Carregando solicitações...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Solicitações de Tipos de Serviços
          </CardTitle>
          <CardDescription>
            Gerencie as solicitações de novos tipos de serviços arquivísticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo Solicitado</TableHead>
                  <TableHead>Organização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      Nenhuma solicitação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.requested_type_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {request.organizations?.name || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(request.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setAdminNotes(request.admin_notes || '');
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Solicitação</DialogTitle>
                              <DialogDescription>
                                Analise e tome uma decisão sobre esta solicitação
                              </DialogDescription>
                            </DialogHeader>

                            {selectedRequest && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <strong>Tipo Solicitado:</strong>
                                    <p>{selectedRequest.requested_type_name}</p>
                                  </div>
                                  <div>
                                    <strong>Status Atual:</strong>
                                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                                  </div>
                                </div>

                                {selectedRequest.description && (
                                  <div>
                                    <strong>Descrição:</strong>
                                    <p className="text-sm text-gray-600 mt-1">{selectedRequest.description}</p>
                                  </div>
                                )}

                                {selectedRequest.justification && (
                                  <div>
                                    <strong>Justificativa:</strong>
                                    <p className="text-sm text-gray-600 mt-1">{selectedRequest.justification}</p>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                  {selectedRequest.suggested_unit && (
                                    <div>
                                      <strong>Unidade Sugerida:</strong>
                                      <p className="text-sm">{selectedRequest.suggested_unit}</p>
                                    </div>
                                  )}
                                  {selectedRequest.suggested_indicator && (
                                    <div>
                                      <strong>Indicador Sugerido:</strong>
                                      <p className="text-sm">{selectedRequest.suggested_indicator}</p>
                                    </div>
                                  )}
                                </div>

                                {selectedRequest.examples && (
                                  <div>
                                    <strong>Exemplos de Uso:</strong>
                                    <p className="text-sm text-gray-600 mt-1">{selectedRequest.examples}</p>
                                  </div>
                                )}

                                <div>
                                  <strong>Observações Administrativas:</strong>
                                  <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Adicione observações sobre a decisão..."
                                    rows={3}
                                    className="mt-2"
                                  />
                                </div>

                                {selectedRequest.status === 'pending' && (
                                  <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                                      disabled={actionLoading}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Rejeitar
                                    </Button>
                                    <Button
                                      onClick={() => handleStatusUpdate(selectedRequest.id, 'approved')}
                                      disabled={actionLoading}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Aprovar
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
