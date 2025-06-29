
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, AlertCircle } from "lucide-react";
import { SectorImportData } from "@/hooks/useOrganizationSectors";

interface SectorImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (sectors: SectorImportData[]) => void;
}

export function SectorImportModal({ isOpen, onClose, onImport }: SectorImportModalProps) {
  const [csvData, setCsvData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const csvTemplate = `Nome do Setor,Sigla,Estado,Cidade,Código da Unidade SIORG,Código da Unidade Pai,Competência,Finalidade,Missão,Área de Atuação,Email,Telefone
Secretaria Executiva,SE,DF,Brasília,001,,"Coordenar atividades administrativas","Apoio à gestão","Garantir eficiência administrativa",suporte,se@exemplo.gov.br,(61) 3315-0000
Departamento de Tecnologia,DTI,DF,Brasília,002,001,"Gerenciar infraestrutura de TI","Suporte tecnológico","Modernização tecnológica",suporte,dti@exemplo.gov.br,(61) 3315-0001`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_setores.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processCsvData = (data: string): SectorImportData[] => {
    const lines = data.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('O arquivo deve conter pelo menos um cabeçalho e uma linha de dados');
    }

    const sectors: SectorImportData[] = [];
    const newErrors: string[] = [];

    // Skip header (first line)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
      if (values.length < 12) {
        newErrors.push(`Linha ${i + 1}: Número insuficiente de colunas (esperado 12, encontrado ${values.length})`);
        continue;
      }

      const [
        name,
        acronym,
        state,
        city,
        siorg_code,
        parent_siorg_code,
        competence,
        purpose,
        mission,
        area_type,
        contact_email,
        contact_phone
      ] = values;

      if (!name) {
        newErrors.push(`Linha ${i + 1}: Nome do setor é obrigatório`);
        continue;
      }

      // Validate area_type
      const validAreaTypes = ['finalistica', 'suporte', ''];
      if (area_type && !validAreaTypes.includes(area_type.toLowerCase())) {
        newErrors.push(`Linha ${i + 1}: Área de atuação deve ser 'finalistica', 'suporte' ou vazio`);
        continue;
      }

      sectors.push({
        name,
        acronym: acronym || undefined,
        state: state || undefined,
        city: city || undefined,
        siorg_code: siorg_code || undefined,
        parent_siorg_code: parent_siorg_code || undefined,
        competence: competence || undefined,
        purpose: purpose || undefined,
        mission: mission || undefined,
        area_type: area_type ? (area_type.toLowerCase() as 'finalistica' | 'suporte') : undefined,
        contact_email: contact_email || undefined,
        contact_phone: contact_phone || undefined
      });
    }

    setErrors(newErrors);
    return sectors;
  };

  const handleImport = async () => {
    if (!csvData.trim()) {
      setErrors(['Por favor, cole os dados CSV ou faça upload de um arquivo']);
      return;
    }

    setIsProcessing(true);
    try {
      const sectors = processCsvData(csvData);
      
      if (errors.length > 0) {
        setIsProcessing(false);
        return;
      }

      if (sectors.length === 0) {
        setErrors(['Nenhum setor válido encontrado nos dados fornecidos']);
        setIsProcessing(false);
        return;
      }

      await onImport(sectors);
      onClose();
      setCsvData("");
      setErrors([]);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Erro ao processar dados']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
        setErrors([]);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Setores</DialogTitle>
          <DialogDescription>
            Importe setores em lote usando um arquivo CSV ou colando os dados diretamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <div className="space-y-2">
            <Label>Template CSV</Label>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={downloadTemplate}
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Template
              </Button>
              <span className="text-sm text-gray-600">
                Baixe o template com os campos necessários
              </span>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload de Arquivo CSV</Label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* CSV Data Input */}
          <div className="space-y-2">
            <Label htmlFor="csv-data">Ou cole os dados CSV aqui</Label>
            <Textarea
              id="csv-data"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Cole os dados CSV aqui ou faça upload do arquivo..."
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {/* Format Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Formato esperado:</strong> CSV com 12 colunas separadas por vírgula.<br/>
              <strong>Campos obrigatórios:</strong> Nome do Setor<br/>
              <strong>Área de Atuação:</strong> deve ser 'finalistica', 'suporte' ou vazio
            </AlertDescription>
          </Alert>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <strong>Erros encontrados:</strong>
                  <ul className="list-disc list-inside text-sm">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={isProcessing || !csvData.trim()}
          >
            {isProcessing ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Importar Setores
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
