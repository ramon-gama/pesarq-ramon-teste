
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Check, 
  X, 
  AlertTriangle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportedType {
  nomeOriginal: string;
  nomeDocumental?: string;
  observacoes?: string;
  status: 'novo' | 'padronizado' | 'revisao';
}

interface DocumentTypeImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (types: ImportedType[]) => void;
  type: 'document' | 'process';
}

export function DocumentTypeImport({ isOpen, onClose, onImport, type }: DocumentTypeImportProps) {
  const { toast } = useToast();
  const [importedData, setImportedData] = useState<ImportedType[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [importMethod, setImportMethod] = useState<'file' | 'manual'>('file');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseImportData(text);
    };
    reader.readAsText(file);
  };

  const parseImportData = (text: string) => {
    try {
      // Tentar parselar como CSV primeiro
      const lines = text.split('\n').filter(line => line.trim());
      const data: ImportedType[] = [];

      lines.forEach((line, index) => {
        if (index === 0) return; // Skip header
        
        const cleanLine = line.trim();
        if (cleanLine) {
          // Assumir que é uma lista simples ou CSV com nome na primeira coluna
          const columns = cleanLine.split(',').map(col => col.trim().replace(/"/g, ''));
          const nomeOriginal = columns[0];
          
          if (nomeOriginal) {
            data.push({
              nomeOriginal,
              status: 'novo'
            });
          }
        }
      });

      setImportedData(data);
      setShowPreview(true);
      
      toast({
        title: "Arquivo Processado",
        description: `${data.length} ${type === 'document' ? 'tipos documentais' : 'tipos de processo'} encontrados.`,
      });
    } catch (error) {
      toast({
        title: "Erro na Importação",
        description: "Não foi possível processar o arquivo. Verifique o formato.",
        variant: "destructive",
      });
    }
  };

  const handleManualInput = () => {
    const lines = manualInput.split('\n').filter(line => line.trim());
    const data: ImportedType[] = lines.map(line => ({
      nomeOriginal: line.trim(),
      status: 'novo' as const
    }));

    setImportedData(data);
    setShowPreview(true);
    
    toast({
      title: "Lista Processada",
      description: `${data.length} ${type === 'document' ? 'tipos documentais' : 'tipos de processo'} adicionados.`,
    });
  };

  const updateImportedType = (index: number, field: keyof ImportedType, value: string) => {
    setImportedData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeImportedType = (index: number) => {
    setImportedData(prev => prev.filter((_, i) => i !== index));
  };

  const handleImport = () => {
    onImport(importedData);
    onClose();
    
    toast({
      title: "Importação Concluída",
      description: `${importedData.length} ${type === 'document' ? 'tipos documentais' : 'tipos de processo'} importados com sucesso.`,
    });
  };

  const downloadTemplate = () => {
    const headers = type === 'document' 
      ? 'Tipo Documental,Observações\n'
      : 'Tipo de Processo,Observações\n';
    
    const examples = type === 'document'
      ? 'Relatório de Atividades,\nAta de Reunião,\nOfício Circular,\nPortaria de Nomeação,'
      : 'Processo de Licitação,\nProcesso Administrativo Disciplinar,\nProcesso de Contratação,\nProcesso de Aposentadoria,';

    const content = headers + examples;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${type === 'document' ? 'tipos_documentais' : 'tipos_processo'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar {type === 'document' ? 'Tipos Documentais' : 'Tipos de Processo'}
          </CardTitle>
          <CardDescription>
            Importe uma lista existente de {type === 'document' ? 'tipos documentais' : 'tipos de processo'} do órgão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Esta funcionalidade é ideal para órgãos que já possuem uma lista de {type === 'document' ? 'tipos documentais' : 'tipos de processo'} 
              e precisam padronizá-los conforme a metodologia arquivística.
            </AlertDescription>
          </Alert>

          {!showPreview && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className={`cursor-pointer border-2 transition-colors ${
                  importMethod === 'file' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`} onClick={() => setImportMethod('file')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      Importar Arquivo
                    </CardTitle>
                    <CardDescription>
                      Upload de arquivo CSV ou lista de texto
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className={`cursor-pointer border-2 transition-colors ${
                  importMethod === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`} onClick={() => setImportMethod('manual')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      Entrada Manual
                    </CardTitle>
                    <CardDescription>
                      Digite ou cole a lista diretamente
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {importMethod === 'file' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={downloadTemplate}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Baixar Template
                    </Button>
                    <span className="text-sm text-gray-500">
                      (Recomendado para manter o formato correto)
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file-upload">
                      Arquivo CSV ou TXT
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                    />
                    <p className="text-sm text-gray-500">
                      Formatos aceitos: .csv, .txt (um {type === 'document' ? 'tipo documental' : 'tipo de processo'} por linha)
                    </p>
                  </div>
                </div>
              )}

              {importMethod === 'manual' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manual-input">
                      Lista de {type === 'document' ? 'Tipos Documentais' : 'Tipos de Processo'}
                    </Label>
                    <Textarea
                      id="manual-input"
                      placeholder={`Digite um ${type === 'document' ? 'tipo documental' : 'tipo de processo'} por linha:\n\nRelatório de Atividades\nAta de Reunião\nOfício Circular\nPortaria de Nomeação`}
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      rows={10}
                    />
                  </div>
                  <Button onClick={handleManualInput} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Processar Lista
                  </Button>
                </div>
              )}
            </>
          )}

          {showPreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Preview da Importação ({importedData.length} itens)
                </h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPreview(false);
                    setImportedData([]);
                  }}
                >
                  Voltar
                </Button>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Revise os dados antes de importar. O campo "Nome Original do Órgão" será preenchido automaticamente 
                  com os valores importados. Você pode editar e ajustar conforme necessário.
                </AlertDescription>
              </Alert>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {importedData.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="space-y-2">
                        <Label>Nome Original do Órgão</Label>
                        <Input
                          value={item.nomeOriginal}
                          onChange={(e) => updateImportedType(index, 'nomeOriginal', e.target.value)}
                          className="bg-blue-50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Nome Padronizado (Opcional)</Label>
                        <Input
                          value={item.nomeDocumental || ''}
                          onChange={(e) => updateImportedType(index, 'nomeDocumental', e.target.value)}
                          placeholder="Será definido durante a padronização"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-blue-600">
                          Novo
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImportedType(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {showPreview ? (
              <>
                <Button onClick={handleImport} className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Confirmar Importação
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
