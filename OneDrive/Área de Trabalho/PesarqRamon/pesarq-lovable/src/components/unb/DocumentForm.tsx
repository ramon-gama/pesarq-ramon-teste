
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload } from "lucide-react";
import { useProjectDocuments, ProjectDocument } from "@/hooks/useProjectDocuments";

interface DocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  editingDocument?: ProjectDocument | null;
}

export function DocumentForm({ isOpen, onClose, projectId, editingDocument }: DocumentFormProps) {
  const { createDocument, updateDocument } = useProjectDocuments();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    document_number: "",
    signed_date: "",
    expiry_date: "",
    value: "",
    status: "draft"
  });
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (editingDocument) {
      setFormData({
        title: editingDocument.title,
        type: editingDocument.type,
        document_number: editingDocument.document_number || "",
        signed_date: editingDocument.signed_date || "",
        expiry_date: editingDocument.expiry_date || "",
        value: editingDocument.value?.toString() || "",
        status: editingDocument.status
      });
      setFileUrl(editingDocument.file_url || "");
    } else {
      setFormData({
        title: "",
        type: "",
        document_number: "",
        signed_date: "",
        expiry_date: "",
        value: "",
        status: "draft"
      });
      setFileUrl("");
    }
  }, [editingDocument, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Em um ambiente real, você faria upload para o Supabase Storage
      // Por agora, vamos simular com uma URL
      setFileUrl(`/uploads/${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Por favor, preencha o título do documento');
      return;
    }
    
    if (!formData.type) {
      alert('Por favor, selecione o tipo do documento');
      return;
    }

    const documentData = {
      project_id: projectId,
      title: formData.title,
      type: formData.type,
      document_number: formData.document_number || undefined,
      file_url: fileUrl || undefined,
      signed_date: formData.signed_date || undefined,
      expiry_date: formData.expiry_date || undefined,
      value: formData.value ? parseFloat(formData.value) : undefined,
      status: formData.status,
      version: editingDocument ? editingDocument.version : 1
    };

    try {
      if (editingDocument) {
        await updateDocument(editingDocument.id, documentData);
      } else {
        await createDocument(documentData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {editingDocument ? "Editar Documento" : "Novo Documento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Documento *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Digite o título do documento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Documento *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="amendment">Aditivo</SelectItem>
                  <SelectItem value="invoice">Fatura</SelectItem>
                  <SelectItem value="report">Relatório</SelectItem>
                  <SelectItem value="certificate">Certificado</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document_number">Número do Documento</Label>
              <Input
                id="document_number"
                value={formData.document_number}
                onChange={(e) => handleInputChange('document_number', e.target.value)}
                placeholder="Ex: 001/2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                  <SelectItem value="expired">Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signed_date">Data de Assinatura</Label>
              <Input
                id="signed_date"
                type="date"
                value={formData.signed_date}
                onChange={(e) => handleInputChange('signed_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Data de Vencimento</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleInputChange('expiry_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Arquivo do Documento</Label>
            <div className="flex gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {fileUrl && (
              <p className="text-sm text-green-600">Arquivo: {fileUrl}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#15AB92] hover:bg-[#0d8f7a]">
              {editingDocument ? "Atualizar" : "Salvar"} Documento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
