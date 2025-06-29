import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";
interface MetricConverterProps {
  primaryValue: number;
  primaryUnit: string;
  onPrimaryChange: (value: number) => void;
  showConverter?: boolean;
}
export function MetricConverter({
  primaryValue,
  primaryUnit,
  onPrimaryChange,
  showConverter = false
}: MetricConverterProps) {
  const CONVERSION_FACTOR = 7; // 1 metro linear = 7 caixas-arquivo

  const isLinearMeters = primaryUnit === 'metros lineares';
  const isBoxes = primaryUnit === 'caixas' || primaryUnit === 'caixas-arquivo';
  if (!showConverter || !isLinearMeters && !isBoxes) {
    return <div className="space-y-2">
        <Label htmlFor="metric">Quantidade</Label>
        <Input id="metric" type="number" value={primaryValue} onChange={e => onPrimaryChange(Number(e.target.value))} placeholder="0" min="0" required />
      </div>;
  }
  const convertedValue = isLinearMeters ? primaryValue * CONVERSION_FACTOR : primaryValue / CONVERSION_FACTOR;
  const primaryLabel = isLinearMeters ? "Metros Lineares" : "Caixas-Arquivo";
  const convertedLabel = isLinearMeters ? "Caixas-Arquivo (equivalente)" : "Metros Lineares (equivalente)";
  return <div className="space-y-4">
      <div className="space-y-2">
        
        <Input id="metric" type="number" value={primaryValue} onChange={e => onPrimaryChange(Number(e.target.value))} placeholder="0" min="0" required className="text-lg font-medium" />
      </div>

      {primaryValue > 0 && <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <Label className="text-sm text-blue-800">{convertedLabel}</Label>
                <div className="text-2xl font-bold text-blue-900">
                  {convertedValue.toFixed(convertedValue < 1 ? 2 : 0)}
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Conversão: 1 metro linear = 7 caixas-arquivo
            </p>
          </CardContent>
        </Card>}
    </div>;
}