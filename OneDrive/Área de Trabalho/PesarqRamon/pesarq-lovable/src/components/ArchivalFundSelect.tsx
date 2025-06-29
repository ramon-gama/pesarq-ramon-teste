
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useArchivalFunds } from "@/hooks/useArchivalFunds";

interface ArchivalFundSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  organizationId: string;
  required?: boolean;
}

export function ArchivalFundSelect({ 
  value, 
  onValueChange, 
  organizationId,
  required = false 
}: ArchivalFundSelectProps) {
  const { funds, loading } = useArchivalFunds(organizationId);

  const activeFunds = funds.filter(fund => fund.status === 'ativo');

  return (
    <div className="space-y-2">
      <Label htmlFor="fund">Fundo Arquivístico</Label>
      <Select 
        value={value} 
        onValueChange={onValueChange}
        required={required}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Carregando fundos..." : "Selecione o fundo"} />
        </SelectTrigger>
        <SelectContent>
          {activeFunds.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-gray-500">
              {loading ? "Carregando..." : "Nenhum fundo disponível"}
            </div>
          ) : (
            activeFunds.map((fund) => (
              <SelectItem key={fund.id} value={fund.id}>
                {fund.code ? `${fund.code} - ${fund.name}` : fund.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
