
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Authority } from "@/hooks/useAuthorities";
import { useArchivalFunds } from "@/hooks/useArchivalFunds";
import { AuthorityImageUpload } from "./authority/AuthorityImageUpload";
import { AuthorityBasicFields } from "./authority/AuthorityBasicFields";
import { AuthorityDateFields } from "./authority/AuthorityDateFields";

interface AuthorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<Authority | null>;
  editingAuthority?: Authority | null;
  organizationId: string;
  onImageUpload?: (file: File, authorityId: string) => Promise<string>;
  onImageDelete?: (imageUrl: string) => Promise<void>;
}

export function AuthorityModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingAuthority, 
  organizationId,
  onImageUpload,
  onImageDelete 
}: AuthorityModalProps) {
  const { funds } = useArchivalFunds(organizationId);
  const [formData, setFormData] = useState({
    name: "",
    type: "pessoa" as "pessoa" | "familia" | "entidade_coletiva",
    position: "",
    fund_id: "",
    start_date: "",
    end_date: "",
    biography: "",
    image_url: "",
    status: "ativo"
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (editingAuthority) {
      setFormData({
        name: editingAuthority.name || "",
        type: editingAuthority.type || "pessoa",
        position: editingAuthority.position || "",
        fund_id: editingAuthority.fund_id || "",
        start_date: editingAuthority.start_date || "",
        end_date: editingAuthority.end_date || "",
        biography: editingAuthority.biography || "",
        image_url: editingAuthority.image_url || "",
        status: editingAuthority.status || "ativo"
      });
    } else {
      setFormData({
        name: "",
        type: "pessoa",
        position: "",
        fund_id: "",
        start_date: "",
        end_date: "",
        biography: "",
        image_url: "",
        status: "ativo"
      });
    }
    setImageFile(null);
  }, [editingAuthority, isOpen]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image_url: previewUrl }));
    }
  };

  const handleRemoveImage = async () => {
    if (editingAuthority?.image_url && onImageDelete) {
      try {
        await onImageDelete(editingAuthority.image_url);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    setFormData(prev => ({ ...prev, image_url: "" }));
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    setIsUploading(true);
    let imageUrl = formData.image_url;

    try {
      const dataToSave = {
        ...formData,
        organization_id: organizationId,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        fund_id: formData.fund_id || null,
        image_url: imageUrl,
        status: formData.end_date ? "inativo" : "ativo"
      };

      // If editing, include the id
      if (editingAuthority) {
        (dataToSave as any).id = editingAuthority.id;
      }

      // Handle image upload if there's a new file
      if (imageFile && onImageUpload) {
        if (!editingAuthority) {
          // For new authorities, create first then upload image
          const tempData = { ...dataToSave, image_url: "" };
          const newAuthority = await onSave(tempData);
          if (newAuthority) {
            imageUrl = await onImageUpload(imageFile, newAuthority.id);
            const updateData = { ...tempData, image_url: imageUrl, id: newAuthority.id };
            await onSave(updateData);
          }
          onClose();
          return;
        } else {
          // For existing authorities, upload image first
          imageUrl = await onImageUpload(imageFile, editingAuthority.id);
          dataToSave.image_url = imageUrl;
        }
      }

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Error saving authority:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const fundOptions = funds.map(fund => ({
    value: fund.id,
    label: fund.name
  }));

  const isCurrentAuthority = !formData.end_date;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingAuthority ? 'Editar Autoridade' : 'Nova Autoridade'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações da autoridade
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthorityImageUpload
            imageUrl={formData.image_url}
            authorityName={formData.name}
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
          />

          <AuthorityBasicFields
            formData={formData}
            onFieldChange={handleFieldChange}
            fundOptions={fundOptions}
          />

          <AuthorityDateFields
            formData={formData}
            onFieldChange={handleFieldChange}
            isCurrentAuthority={isCurrentAuthority}
          />

          <div className="space-y-2">
            <Label htmlFor="biography">Biografia</Label>
            <Textarea
              id="biography"
              value={formData.biography}
              onChange={(e) => handleFieldChange('biography', e.target.value)}
              placeholder="Biografia da autoridade"
              rows={4}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Salvando...' : editingAuthority ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
