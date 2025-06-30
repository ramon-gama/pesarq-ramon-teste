
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2 } from "lucide-react";

interface AuthorityImageUploadProps {
  imageUrl: string;
  authorityName: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function AuthorityImageUpload({
  imageUrl,
  authorityName,
  onImageChange,
  onRemoveImage
}: AuthorityImageUploadProps) {
  return (
    <div className="space-y-2">
      <Label>Foto da Autoridade</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={imageUrl} alt={authorityName} />
          <AvatarFallback>{authorityName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex gap-2">
          <Label htmlFor="image-upload" className="cursor-pointer">
            <Button type="button" variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Enviar Foto
              </span>
            </Button>
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
          {imageUrl && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={onRemoveImage}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
