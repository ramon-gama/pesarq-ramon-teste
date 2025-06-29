
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/SearchableSelect";

interface AuthorityBasicFieldsProps {
  formData: {
    name: string;
    type: "pessoa" | "familia" | "entidade_coletiva";
    position: string;
    fund_id: string;
  };
  onFieldChange: (field: string, value: string) => void;
  fundOptions: Array<{ value: string; label: string }>;
}

export function AuthorityBasicFields({
  formData,
  onFieldChange,
  fundOptions
}: AuthorityBasicFieldsProps) {
  // Filtrar opções válidas (sem valores vazios) com validação mais rigorosa
  const validFundOptions = fundOptions.filter(option => {
    const hasValidValue = option.value && 
                         typeof option.value === 'string' && 
                         option.value.trim() !== "";
    const hasValidLabel = option.label && 
                         typeof option.label === 'string' && 
                         option.label.trim() !== "";
    
    return hasValidValue && hasValidLabel;
  });

  console.log('AuthorityBasicFields: Fund options received:', fundOptions);
  console.log('AuthorityBasicFields: Valid fund options after filtering:', validFundOptions);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            placeholder="Nome da autoridade"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <Select value={formData.type} onValueChange={(value) => onFieldChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pessoa">Pessoa</SelectItem>
              <SelectItem value="familia">Família</SelectItem>
              <SelectItem value="entidade_coletiva">Entidade Coletiva</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Cargo</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => onFieldChange('position', e.target.value)}
            placeholder="Cargo ocupado"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fund_id">Fundo</Label>
          {validFundOptions.length > 0 ? (
            <SearchableSelect
              value={formData.fund_id}
              onValueChange={(value) => onFieldChange('fund_id', value)}
              placeholder="Selecione o fundo"
              options={validFundOptions}
              searchPlaceholder="Buscar fundo..."
            />
          ) : (
            <Select value={formData.fund_id} onValueChange={(value) => onFieldChange('fund_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Nenhum fundo disponível" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2 text-sm text-gray-500">
                  Nenhum fundo cadastrado
                </div>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </>
  );
}
