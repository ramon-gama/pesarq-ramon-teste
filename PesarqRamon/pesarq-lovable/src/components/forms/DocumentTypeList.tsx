import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, History, AlertCircle, CheckCircle, Clock, Eye } from "lucide-react";

interface DocumentType {
  id: string;
  nomeDocumental: string;
  nomeOriginalOrgao?: string;
  statusPadronizacao: 'novo' | 'original' | 'revisado' | 'padronizado';
  versao: string;
  dataUltimaRevisao?: string;
  proximaRevisao?: string;
  responsavelRegistro: string;
  motivoAlteracao?: string;
  codigoClassificacao: string;
  familiaDocumental: string;
  especieDocumental?: string;
  suporte?: string;
  breveDescricao?: string;
  funcaoDocumental?: string;
  atividadeFimMeio?: string;
  documentosVinculados?: string;
  temporalidadeDestinacao?: string;
  grauAcesso?: string;
  dadosPessoaisSensiveis?: string;
  produtor?: string;
  baseLegalNormativa?: string;
}

interface DocumentTypeListProps {
  documentTypes: DocumentType[];
  onEdit: (documentType: DocumentType) => void;
  type: 'document' | 'process';
}

export function DocumentTypeList({ documentTypes, onEdit, type }: DocumentTypeListProps) {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'novo':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Novo</Badge>;
      case 'original':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Original</Badge>;
      case 'revisado':
        return <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">Revisado</Badge>;
      case 'padronizado':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Padronizado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'novo':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'original':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'revisado':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'padronizado':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const isRevisionNeeded = (proximaRevisao?: string) => {
    if (!proximaRevisao) return false;
    const today = new Date();
    const revisionDate = new Date(proximaRevisao);
    return revisionDate <= today;
  };

  const showHistoryDetails = (documentType: DocumentType) => {
    setSelectedDocument(documentType);
    setShowHistoryModal(true);
  };

  const typeName = type === 'document' ? 'documentais' : 'de processo';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos {typeName.charAt(0).toUpperCase() + typeName.slice(1)}</CardTitle>
          <CardDescription>
            Gerencie os tipos {typeName} cadastrados com controle de padronização e versionamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Padronizado</TableHead>
                  <TableHead>Nome Original</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Próxima Revisão</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      Nenhum tipo {type === 'document' ? 'documental' : 'de processo'} cadastrado ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  documentTypes.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.nomeDocumental}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {doc.nomeOriginalOrgao || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.statusPadronizacao)}
                          {getStatusBadge(doc.statusPadronizacao)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.versao}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{doc.codigoClassificacao}</TableCell>
                      <TableCell>
                        {doc.proximaRevisao ? (
                          <div className="flex items-center gap-1">
                            <span className={`text-sm ${isRevisionNeeded(doc.proximaRevisao) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                              {new Date(doc.proximaRevisao).toLocaleDateString('pt-BR')}
                            </span>
                            {isRevisionNeeded(doc.proximaRevisao) && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showHistoryDetails(doc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(doc)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showHistoryDetails(doc)}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes/Histórico */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes e Histórico</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre {selectedDocument?.nomeDocumental}
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Nome Padronizado</h4>
                  <p className="text-sm">{selectedDocument.nomeDocumental}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Nome Original</h4>
                  <p className="text-sm">{selectedDocument.nomeOriginalOrgao || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Status de Padronização</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedDocument.statusPadronizacao)}
                    {getStatusBadge(selectedDocument.statusPadronizacao)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Versão Atual</h4>
                  <p className="text-sm">{selectedDocument.versao}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Última Revisão</h4>
                  <p className="text-sm">
                    {selectedDocument.dataUltimaRevisao 
                      ? new Date(selectedDocument.dataUltimaRevisao).toLocaleDateString('pt-BR')
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Próxima Revisão</h4>
                  <p className={`text-sm ${isRevisionNeeded(selectedDocument.proximaRevisao) ? 'text-red-600 font-medium' : ''}`}>
                    {selectedDocument.proximaRevisao 
                      ? new Date(selectedDocument.proximaRevisao).toLocaleDateString('pt-BR')
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>

              {selectedDocument.motivoAlteracao && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Motivo da Alteração/Padronização</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded border">{selectedDocument.motivoAlteracao}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sm text-gray-700">Responsável</h4>
                <p className="text-sm">{selectedDocument.responsavelRegistro}</p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Estatísticas de Padronização</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600">Código</p>
                    <p className="font-medium">{selectedDocument.codigoClassificacao}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs text-blue-600">Família</p>
                    <p className="font-medium text-sm">{selectedDocument.familiaDocumental}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs text-green-600">Status</p>
                    <p className="font-medium text-sm">{selectedDocument.statusPadronizacao}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
