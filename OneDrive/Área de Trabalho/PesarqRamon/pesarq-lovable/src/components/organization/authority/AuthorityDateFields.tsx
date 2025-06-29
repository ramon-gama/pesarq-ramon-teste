
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthorityDateFieldsProps {
  formData: {
    start_date: string;
    end_date: string;
  };
  onFieldChange: (field: string, value: string) => void;
  isCurrentAuthority: boolean;
}

export function AuthorityDateFields({
  formData,
  onFieldChange,
  isCurrentAuthority
}: AuthorityDateFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Data de Início na Função</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => onFieldChange('start_date', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Data de Fim na Função</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => onFieldChange('end_date', e.target.value)}
          />
        </div>
      </div>

      {isCurrentAuthority && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700 font-medium">
            🟢 Autoridade atual na organização
          </p>
        </div>
      )}
    </>
  );
}
