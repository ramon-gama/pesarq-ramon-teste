import { useState } from "react";
import { Archive, Edit, Eye, Plus, Trash2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

import { ArchivalFund } from "@/hooks/useArchivalFunds";
import { ArchivalFundModal } from "../ArchivalFundModal";
import { ArchivalFundViewTabbedModal } from "../ArchivalFundViewTabbedModal";
import { exportFundToCSV } from "@/utils/csvExporter";
import { useToast } from "@/hooks/use-toast";

interface OrganizationFundsProps {
  funds: ArchivalFund[];
  organizationId: string;
  organizationName?: string;
  onCreateFund: (data: any) => Promise<any>;
  onUpdateFund: (id: string, data: any) => Promise<any>;
  onDeleteFund: (id: string) => Promise<void>;
  loading?: boolean;
}

export function OrganizationFunds({ 
  funds, 
  organizationId,
  organizationName = "Organização",
  onCreateFund,
  onUpdateFund,
  onDeleteFund,
  loading = false
}: OrganizationFundsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFund, setEditingFund] = useState<ArchivalFund | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingFund, setViewingFund] = useState<ArchivalFund | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fundToDelete, setFundToDelete] = useState<ArchivalFund | null>(null);

  const { toast } = useToast();

  console.log('OrganizationFunds - Current funds:', funds);
  console.log('OrganizationFunds - Organization ID:', organizationId);

  const handleCreate = () => {
    console.log('🆕 Opening modal for new fund');
    setEditingFund(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fund: ArchivalFund) => {
    console.log('🎯 Opening modal to edit fund:', fund.id);
    setEditingFund(fund);
    setIsModalOpen(true);
  };

  const handleView = (fund: ArchivalFund) => {
    console.log('👁️ Opening view modal for fund:', fund.id);
    setViewingFund(fund);
    setIsViewModalOpen(true);
  };

  const handleDelete = (fund: ArchivalFund) => {
    console.log('🗑️ Opening delete dialog for fund:', fund.id);
    setFundToDelete(fund);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!fundToDelete) return;
    
    try {
      console.log('🗑️ Confirming delete for fund:', fundToDelete.id);
      await onDeleteFund(fundToDelete.id);
      console.log('✅ Fund deleted successfully');
      
      toast({
        title: "Sucesso",
        description: "Fundo excluído com sucesso",
      });
      
      setIsDeleteDialogOpen(false);
      setFundToDelete(null);
    } catch (error) {
      console.error('❌ Failed to delete fund:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir fundo",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (fundData: any) => {
    console.log('💾 Saving fund data:', fundData);
    console.log('💾 Editing fund:', editingFund?.id || 'new');
    
    try {
      let result;
      if (editingFund) {
        console.log('📝 Updating existing fund');
        result = await onUpdateFund(editingFund.id, fundData);
      } else {
        console.log('🆕 Creating new fund');
        result = await onCreateFund(fundData);
      }
      
      console.log('✅ Save operation completed:', result);
      
      toast({
        title: "Sucesso",
        description: editingFund ? "Fundo atualizado com sucesso" : "Fundo criado com sucesso",
      });
      
      handleModalClose();
      return result;
    } catch (error) {
      console.error('❌ Error saving fund:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar fundo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleModalClose = () => {
    console.log('🚪 Closing modal and resetting state');
    setIsModalOpen(false);
    setEditingFund(null);
  };

  const getExtensionsSummary = (fund: ArchivalFund): string => {
    if (!fund.extensions || fund.extensions.length === 0) {
      return '';
    }

    const summary = fund.extensions
      .map(ext => {
        const parts = [];
        if (ext.quantity) parts.push(ext.quantity);
        if (ext.unit) parts.push(ext.unit);
        if (ext.support_type) parts.push(`(${ext.support_type})`);
        return parts.join(' ');
      })
      .filter(Boolean)
      .join(', ');

    return summary;
  };

  const getFundStatus = (fund: ArchivalFund) => {
    if (!fund.end_date) {
      return { label: 'Ativo (Fundo Aberto)', variant: 'default' as const };
    } else {
      return { label: 'Inativo (Fundo Fechado)', variant: 'secondary' as const };
    }
  };

  const handleExportFundCSV = (fund: ArchivalFund) => {
    try {
      exportFundToCSV(fund, organizationName);
      toast({
        title: "Sucesso",
        description: `Fundo "${fund.name}" exportado para CSV`,
      });
    } catch (error) {
      console.error('Erro ao exportar fundo CSV:', error);
      toast({
        title: "Erro",
        description: "Erro ao exportar fundo para CSV",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fundos Arquivísticos</h2>
          <p className="text-muted-foreground">
            Gerencie os fundos arquivísticos da organização
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2" disabled={loading}>
          <Plus className="h-4 w-4" />
          Novo Fundo
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !funds || funds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Archive className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum fundo cadastrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando seu primeiro fundo arquivístico para organizar os documentos.
            </p>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeiro Fundo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funds.map((fund) => {
            const extensionsSummary = getExtensionsSummary(fund);
            const fundStatus = getFundStatus(fund);
            
            return (
              <Card key={fund.id} className="hover:shadow-md transition-shadow h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant={fundStatus.variant} className="shrink-0 text-xs">
                      {fundStatus.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2" title={fund.name}>
                    {fund.name}
                  </CardTitle>
                  {fund.code && (
                    <p className="text-sm text-muted-foreground">Código: {fund.code}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground text-xs block">Data inicial:</span>
                        <span className="font-medium">{fund.start_date ? new Date(fund.start_date).toLocaleDateString('pt-BR') : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs block">Data final:</span>
                        <span className="font-medium">{fund.end_date ? new Date(fund.end_date).toLocaleDateString('pt-BR') : 'Atual'}</span>
                      </div>
                    </div>
                    
                    {fund.producer_name && (
                      <div>
                        <span className="text-muted-foreground text-xs block">Produtor:</span>
                        <p className="text-sm line-clamp-2" title={fund.producer_name}>
                          {fund.producer_name}
                        </p>
                      </div>
                    )}

                    {extensionsSummary && (
                      <div>
                        <span className="text-muted-foreground text-xs block">Extensões:</span>
                        <p className="text-xs text-gray-600 line-clamp-2" title={extensionsSummary}>{extensionsSummary}</p>
                      </div>
                    )}

                    {fund.location && (
                      <div>
                        <span className="text-muted-foreground text-xs block">Localização:</span>
                        <p className="text-sm line-clamp-2" title={fund.location}>{fund.location}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(fund)}
                      className="flex-1 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(fund)}
                      className="flex-1 text-xs"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportFundCSV(fund)}
                      className="text-xs px-2"
                      title="Exportar para CSV"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(fund)}
                      className="text-red-600 hover:text-red-700 px-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ArchivalFundModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editingFund={editingFund}
        organizationId={organizationId}
        onSave={handleSave}
      />

      <ArchivalFundViewTabbedModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingFund(null);
        }}
        fund={viewingFund}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o fundo "{fundToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
