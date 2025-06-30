
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Eye, Edit, Trash2, Plus } from "lucide-react";
import { useProjectDocuments, ProjectDocument } from "@/hooks/useProjectDocuments";
import { DocumentForm } from "./DocumentForm";

interface DocumentsManagerProps {
  projectId: string;
}

export function DocumentsManager({ projectId }: DocumentsManagerProps) {
  const { documents, loading, fetchDocuments, deleteDocument } = useProjectDocuments();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ProjectDocument | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchDocuments(projectId);
    }
  }, [projectId]);

  const handleEdit = (document: ProjectDocument) => {
    setEditingDocument(document);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      await deleteDocument(id);
      fetchDocuments(projectId);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDocument(null);
    fetchDocuments(projectId);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'draft': 'bg-gray-500',
      'pending': 'bg-yellow-500',
      'approved': 'bg-green-500',
      'rejected': 'bg-red-500',
      'expired': 'bg-orange-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'draft': 'Rascunho',
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado',
      'expired': 'Expirado'
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'contract': 'Contrato',
      'amendment': 'Aditivo',
      'invoice': 'Fatura',
      'report': 'Relatório',
      'certificate': 'Certificado',
      'other': 'Outro'
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="text-center p-4">Carregando documentos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documentos do Projeto</h3>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Documento
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Nenhum documento cadastrado</p>
            <p className="text-sm text-gray-400">Clique em "Adicionar Documento" para começar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium">{document.title}</h4>
                      <Badge variant="secondary">{getTypeLabel(document.type)}</Badge>
                      <Badge className={getStatusColor(document.status)}>
                        {getStatusLabel(document.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      {document.document_number && (
                        <div>
                          <span className="font-medium">Número:</span> {document.document_number}
                        </div>
                      )}
                      {document.signed_date && (
                        <div>
                          <span className="font-medium">Data:</span> {new Date(document.signed_date).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      {document.value && (
                        <div>
                          <span className="font-medium">Valor:</span> R$ {document.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Versão:</span> {document.version}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {document.file_url && (
                      <>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={document.file_url} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(document)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(document.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DocumentForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        projectId={projectId}
        editingDocument={editingDocument}
      />
    </div>
  );
}
