
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Save } from "lucide-react";

interface ClassificationUnitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingUnit?: any;
  parentUnit?: any;
}

export function ClassificationUnitForm({ 
  isOpen, 
  onClose, 
  onSave, 
  editingUnit, 
  parentUnit 
}: ClassificationUnitFormProps) {
  const [formData, setFormData] = useState({
    code: "",
    type: "funcao",
    title: "",
    description: "",
    justification: "",
    responsibleSectors: [] as string[],
    businessProcess: "",
    relatedService: "",
    relatedTerms: [] as string[],
    dataProviders: [] as string[],
    legislation: [] as string[],
    observations: "",
    status: "ativo"
  });

  const [newSector, setNewSector] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [newProvider, setNewProvider] = useState("");
  const [newLegislation, setNewLegislation] = useState("");

  useEffect(() => {
    if (editingUnit) {
      setFormData({
        code: editingUnit.code || "",
        type: editingUnit.type || "funcao",
        title: editingUnit.title || "",
        description: editingUnit.description || "",
        justification: editingUnit.justification || "",
        responsibleSectors: editingUnit.responsibleSectors || [],
        businessProcess: editingUnit.businessProcess || "",
        relatedService: editingUnit.relatedService || "",
        relatedTerms: editingUnit.relatedTerms || [],
        dataProviders: editingUnit.dataProviders || [],
        legislation: editingUnit.legislation || [],
        observations: editingUnit.observations || "",
        status: editingUnit.status || "ativo"
      });
    } else if (parentUnit) {
      // Definir tipo baseado no pai
      const nextType = getNextType(parentUnit.type);
      setFormData(prev => ({
        ...prev,
        type: nextType,
        code: generateNextCode(parentUnit.code, nextType)
      }));
    }
  }, [editingUnit, parentUnit]);

  const getNextType = (parentType: string) => {
    const hierarchy = ["funcao", "subfuncao", "atividade", "tarefa", "subtarefa"];
    const currentIndex = hierarchy.indexOf(parentType);
    return currentIndex < hierarchy.length - 1 ? hierarchy[currentIndex + 1] : "subtarefa";
  };

  const generateNextCode = (parentCode: string, type: string) => {
    // Lógica simples para gerar próximo código
    const baseCode = parentCode.padEnd(3, '0');
    const nextNum = parseInt(baseCode) + 10;
    return nextNum.toString().padStart(3, '0');
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      funcao: "Função",
      subfuncao: "Subfunção", 
      atividade: "Atividade",
      tarefa: "Tarefa",
      subtarefa: "Subtarefa"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const addItem = (list: string[], setList: (items: string[]) => void, newItem: string, setNewItem: (item: string) => void) => {
    if (newItem.trim() && !list.includes(newItem.trim())) {
      setList([...list, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (list: string[], setList: (items: string[]) => void, item: string) => {
    setList(list.filter(i => i !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingUnit ? 'Editar' : 'Nova'} Unidade de Classificação
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Ex: 000"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funcao">Função</SelectItem>
                  <SelectItem value="subfuncao">Subfunção</SelectItem>
                  <SelectItem value="atividade">Atividade</SelectItem>
                  <SelectItem value="tarefa">Tarefa</SelectItem>
                  <SelectItem value="subtarefa">Subtarefa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Título da Unidade</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: ADMINISTRAÇÃO GERAL"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Nota Explicativa</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição detalhada da unidade e seu escopo..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="justification">Justificativa</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
              placeholder="Justificativa que motivou a criação desta unidade..."
              rows={3}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Setores Responsáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    placeholder="Nome do setor..."
                    onKeyPress={(e) => e.key === 'Enter' && addItem(formData.responsibleSectors, (items) => setFormData(prev => ({ ...prev, responsibleSectors: items })), newSector, setNewSector)}
                  />
                  <Button
                    type="button"
                    onClick={() => addItem(formData.responsibleSectors, (items) => setFormData(prev => ({ ...prev, responsibleSectors: items })), newSector, setNewSector)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.responsibleSectors.map((sector, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {sector}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeItem(formData.responsibleSectors, (items) => setFormData(prev => ({ ...prev, responsibleSectors: items })), sector)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessProcess">Processo de Negócio</Label>
              <Input
                id="businessProcess"
                value={formData.businessProcess}
                onChange={(e) => setFormData(prev => ({ ...prev, businessProcess: e.target.value }))}
                placeholder="Processo relacionado..."
              />
            </div>

            <div>
              <Label htmlFor="relatedService">Serviço Relacionado</Label>
              <Input
                id="relatedService"
                value={formData.relatedService}
                onChange={(e) => setFormData(prev => ({ ...prev, relatedService: e.target.value }))}
                placeholder="Serviço da carta de serviços..."
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Termos Relacionados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder="Termo relacionado..."
                    onKeyPress={(e) => e.key === 'Enter' && addItem(formData.relatedTerms, (items) => setFormData(prev => ({ ...prev, relatedTerms: items })), newTerm, setNewTerm)}
                  />
                  <Button
                    type="button"
                    onClick={() => addItem(formData.relatedTerms, (items) => setFormData(prev => ({ ...prev, relatedTerms: items })), newTerm, setNewTerm)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.relatedTerms.map((term, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {term}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeItem(formData.relatedTerms, (items) => setFormData(prev => ({ ...prev, relatedTerms: items })), term)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Observações adicionais..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
