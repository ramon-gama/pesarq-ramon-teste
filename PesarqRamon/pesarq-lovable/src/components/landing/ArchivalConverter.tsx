import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, ArrowRight, Copy, Lock } from "lucide-react";

interface ArchivalConverterProps {
  isDemo?: boolean;
  onLoginRequired?: () => void;
}

export function ArchivalConverter({ isDemo = true, onLoginRequired }: ArchivalConverterProps) {
  const [linearMeters, setLinearMeters] = useState("");
  const [results, setResults] = useState<any>(null);

  // Novos parâmetros de conversão corrigidos
  const conversions = {
    boxes: 7, // 7 caixas por metro linear
    squareMeters: 0.14, // 0,14 metros quadrados por metro linear
    cubicMeters: 0.08, // 0,08 metros cúbicos por metro linear
    weightBoxes: 2.3, // 2,3 caixas de 20kg por metro linear
    kilograms: 35, // 35 kg por metro linear
    sheets: 8750, // 8.750 folhas A4 por metro linear
    kb: 5687500, // 5.687.500 KB por metro linear
    mb: 5554.20, // 5.554,20 MB por metro linear
    gb: 5.4, // 5,4 GB por metro linear
    tb: 0.005, // 0,005 TB por metro linear
    shelves: 1, // 1 prateleira por metro linear
    shelfUnits: 0.14 // 0,14 estantes por metro linear
  };

  const handleConvert = () => {
    if (isDemo && onLoginRequired) {
      onLoginRequired();
      return;
    }

    const meters = parseFloat(linearMeters);
    if (isNaN(meters) || meters <= 0) return;

    const newResults = {
      linearMeters: meters,
      boxes: Math.round(meters * conversions.boxes),
      squareMeters: (meters * conversions.squareMeters).toFixed(2),
      cubicMeters: (meters * conversions.cubicMeters).toFixed(2),
      weightBoxes: (meters * conversions.weightBoxes).toFixed(1),
      kilograms: Math.round(meters * conversions.kilograms),
      sheets: Math.round(meters * conversions.sheets),
      kb: Math.round(meters * conversions.kb),
      mb: (meters * conversions.mb).toFixed(2),
      gb: (meters * conversions.gb).toFixed(1),
      tb: (meters * conversions.tb).toFixed(3),
      shelves: Math.round(meters * conversions.shelves),
      shelfUnits: (meters * conversions.shelfUnits).toFixed(2)
    };

    setResults(newResults);
  };

  const copyResults = () => {
    if (!results) return;
    
    const text = `
Conversão Arquivística - ${results.linearMeters}m lineares:
• ${results.boxes} caixas-arquivo
• ${results.squareMeters} m²
• ${results.cubicMeters} m³
• ${results.weightBoxes} caixas de 20kg
• ${results.kilograms} kg
• ${results.sheets.toLocaleString()} folhas A4
• ${results.kb.toLocaleString()} KB
• ${results.mb} MB
• ${results.gb} GB
• ${results.tb} TB
• ${results.shelves} prateleiras
• ${results.shelfUnits} estantes
    `.trim();
    
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6 text-[#15AB92]" />
            Conversores Arquivísticos
            <Lock className="h-5 w-5 text-orange-500" />
          </CardTitle>
          <CardDescription>
            Visualize um exemplo da ferramenta - Faça login para usar todas as funcionalidades
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Entrada de Dados</CardTitle>
            <CardDescription>
              Exemplo com 100 metros lineares (faça login para personalizar)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="linear-meters">Metros Lineares</Label>
              <Input
                id="linear-meters"
                type="number"
                placeholder="100 (exemplo)"
                value="100"
                className="text-lg"
                disabled={true}
              />
            </div>
            <Button 
              onClick={onLoginRequired} 
              className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              <Lock className="mr-2 h-4 w-4" />
              Fazer Login para Usar
            </Button>
          </CardContent>
        </Card>

        {/* Results Section - Always showing example */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Exemplo de Conversão</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 mb-4">
                <p className="text-sm text-orange-800 font-medium">
                  📋 Exemplo de conversão para 100 metros lineares
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Caixas-Arquivo</p>
                  <p className="text-2xl font-bold text-[#15AB92]">700</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Metros Quadrados</p>
                  <p className="text-2xl font-bold text-[#15AB92]">14,00 m²</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Metros Cúbicos</p>
                  <p className="text-2xl font-bold text-[#15AB92]">8,00 m³</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Caixas 20kg</p>
                  <p className="text-2xl font-bold text-[#15AB92]">230</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Quilogramas</p>
                  <p className="text-2xl font-bold text-[#15AB92]">3.500 kg</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Folhas A4</p>
                  <p className="text-2xl font-bold text-[#15AB92]">875.000</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Prateleiras</p>
                  <p className="text-2xl font-bold text-[#15AB92]">100</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Estantes</p>
                  <p className="text-2xl font-bold text-[#15AB92]">14,00</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Conversões Digitais</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>KB: 568.750.000</div>
                  <div>MB: 555.420,00</div>
                  <div>GB: 540,0</div>
                  <div>TB: 0,500</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 font-medium text-center">
                  🔓 Faça login para personalizar os valores e usar a calculadora completa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reference Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tabela de Referência</CardTitle>
          <CardDescription>
            Fatores de conversão utilizados nos cálculos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Caixas-Arquivo</p>
              <p className="text-slate-600">7 caixas por metro linear</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Área</p>
              <p className="text-slate-600">0,14 m² por metro linear</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Volume</p>
              <p className="text-slate-600">0,08 m³ por metro linear</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Peso</p>
              <p className="text-slate-600">35 kg por metro linear</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Folhas A4</p>
              <p className="text-slate-600">8.750 folhas por metro linear</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Prateleiras</p>
              <p className="text-slate-600">1 prateleira por metro linear</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Estantes</p>
              <p className="text-slate-600">0,14 estantes por metro linear</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Digitalização</p>
              <p className="text-slate-600">5,4 GB por metro linear</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
