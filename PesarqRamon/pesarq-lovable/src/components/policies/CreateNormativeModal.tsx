
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CreateNormativeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateNormativeModal({ open, onOpenChange }: CreateNormativeModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    scope: "",
    description: "",
    reviewPeriod: ""
  });
  const [publishDate, setPublishDate] = useState<Date>();
  const [reviewDate, setReviewDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Criando nova norma:", { ...formData, publishDate, reviewDate });
    onOpenChange(false);
    // Reset form
    setFormData({
      title: "",
      type: "",
      scope: "",
      description: "",
      reviewPeriod: ""
    });
    setPublishDate(undefined);
    setReviewDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Política/Norma</DialogTitle>
          <DialogDescription>
            Cadastre uma nova política ou norma institucional
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título*</Label>
              <Input
                id="title"
                placeholder="Ex: Política de Gestão de Documentos"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Espécie Documental*</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a espécie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="politica">Política</SelectItem>
                  <SelectItem value="instrucao">Instrução Normativa</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="resolucao">Resolução</SelectItem>
                  <SelectItem value="portaria">Portaria</SelectItem>
                  <SelectItem value="circular">Circular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scope">Escopo*</Label>
              <Select value={formData.scope} onValueChange={(value) => setFormData({ ...formData, scope: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o escopo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="setorial">Setorial</SelectItem>
                  <SelectItem value="multissetorial">Multissetorial / Intersetorial</SelectItem>
                  <SelectItem value="organizacional">Organizacional / Institucional</SelectItem>
                  <SelectItem value="regional">Regional / Territorial</SelectItem>
                  <SelectItem value="interinstitucional">Interinstitucional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Data de Publicação*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {publishDate ? format(publishDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={publishDate}
                    onSelect={setPublishDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="reviewPeriod">Período de Revisão</Label>
              <Select value={formData.reviewPeriod} onValueChange={(value) => setFormData({ ...formData, reviewPeriod: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 ano</SelectItem>
                  <SelectItem value="2">2 anos</SelectItem>
                  <SelectItem value="3">3 anos</SelectItem>
                  <SelectItem value="5">5 anos</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição/Ementa*</Label>
              <Textarea
                id="description"
                placeholder="Descreva o objetivo e escopo da norma..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label>Documento (PDF)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Arraste o arquivo aqui ou clique para selecionar</p>
                <Button variant="outline" type="button">
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Norma
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
