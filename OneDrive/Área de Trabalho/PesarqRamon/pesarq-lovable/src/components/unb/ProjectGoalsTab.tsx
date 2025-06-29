
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Plus, X, UserPlus, Target } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ProjectFormData, NewGoalData, ProjectGoal } from '@/types/projectForm';

interface ProjectGoalsTabProps {
  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  newGoal: NewGoalData;
  setNewGoal: React.Dispatch<React.SetStateAction<NewGoalData>>;
  isViewMode: boolean;
}

export function ProjectGoalsTab({ 
  formData, 
  setFormData, 
  newGoal, 
  setNewGoal, 
  isViewMode 
}: ProjectGoalsTabProps) {
  const [newProduct, setNewProduct] = useState('');
  const [newGoalResponsible, setNewGoalResponsible] = useState('');

  const addGoal = () => {
    if (newGoal.number.trim() && newGoal.description.trim()) {
      const goal: ProjectGoal = {
        id: `temp-${Date.now()}`,
        project_id: '',
        number: newGoal.number.trim(),
        description: newGoal.description.trim(),
        value: newGoal.value ? parseFloat(newGoal.value) : 0,
        start_date: newGoal.start_date ? newGoal.start_date.toISOString().split('T')[0] : undefined,
        end_date: newGoal.end_date ? newGoal.end_date.toISOString().split('T')[0] : undefined,
        progress: newGoal.progress,
        products: newGoal.products,
        responsibles: newGoal.responsibles
      };

      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, goal]
      }));

      setNewGoal({
        number: '',
        description: '',
        value: '',
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        progress: 0,
        products: [],
        responsibles: []
      });
    }
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const addProduct = () => {
    if (newProduct.trim() && !newGoal.products.includes(newProduct.trim())) {
      setNewGoal(prev => ({
        ...prev,
        products: [...prev.products, newProduct.trim()]
      }));
      setNewProduct('');
    }
  };

  const removeProduct = (index: number) => {
    setNewGoal(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const addGoalResponsible = () => {
    if (newGoalResponsible.trim() && !newGoal.responsibles.includes(newGoalResponsible.trim())) {
      setNewGoal(prev => ({
        ...prev,
        responsibles: [...prev.responsibles, newGoalResponsible.trim()]
      }));
      setNewGoalResponsible('');
    }
  };

  const removeGoalResponsible = (index: number) => {
    setNewGoal(prev => ({
      ...prev,
      responsibles: prev.responsibles.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="goal_number">Número</Label>
            <Input
              id="goal_number"
              type="text"
              value={newGoal.number}
              onChange={(e) => setNewGoal(prev => ({ ...prev, number: e.target.value }))}
              disabled={isViewMode}
            />
          </div>

          <div>
            <Label htmlFor="goal_description">Descrição</Label>
            <Input
              id="goal_description"
              type="text"
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              disabled={isViewMode}
            />
          </div>

          <div>
            <Label htmlFor="goal_value">Valor</Label>
            <Input
              id="goal_value"
              type="number"
              value={newGoal.value}
              onChange={(e) => setNewGoal(prev => ({ ...prev, value: e.target.value }))}
              disabled={isViewMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Data de Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newGoal.start_date && "text-muted-foreground"
                  )}
                  disabled={isViewMode}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newGoal.start_date ? format(newGoal.start_date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newGoal.start_date}
                  onSelect={(date) => setNewGoal(prev => ({ ...prev, start_date: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Data de Término</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newGoal.end_date && "text-muted-foreground"
                  )}
                  disabled={isViewMode}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newGoal.end_date ? format(newGoal.end_date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newGoal.end_date}
                  onSelect={(date) => setNewGoal(prev => ({ ...prev, end_date: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label>Produtos</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Novo produto"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              disabled={isViewMode}
            />
            <Button type="button" onClick={addProduct} disabled={isViewMode}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          <div className="mt-2 space-y-1">
            {newGoal.products.map((product, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-2">
                <span>{product}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeProduct(index)}
                  disabled={isViewMode}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Responsáveis pela Meta</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Novo responsável"
              value={newGoalResponsible}
              onChange={(e) => setNewGoalResponsible(e.target.value)}
              disabled={isViewMode}
            />
            <Button type="button" onClick={addGoalResponsible} disabled={isViewMode}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          <div className="mt-2 space-y-1">
            {newGoal.responsibles.map((responsible, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-2">
                <span>{responsible}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeGoalResponsible(index)}
                  disabled={isViewMode}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button type="button" onClick={addGoal} disabled={isViewMode}>
          <Target className="h-4 w-4 mr-2" />
          Adicionar Meta
        </Button>

        <Separator />

        <div className="space-y-2">
          {formData.goals.map((goal, index) => (
            <div key={index} className="rounded-md border p-4">
              <div className="font-semibold">{goal.number} - {goal.description}</div>
              <div className="text-sm text-gray-500">Valor: R$ {goal.value?.toLocaleString('pt-BR')}</div>
              {goal.start_date && (
                <div className="text-sm text-gray-500">
                  Data de Início: {new Date(goal.start_date).toLocaleDateString('pt-BR')}
                </div>
              )}
              {goal.end_date && (
                <div className="text-sm text-gray-500">
                  Data de Término: {new Date(goal.end_date).toLocaleDateString('pt-BR')}
                </div>
              )}
              <div className="text-sm text-gray-500">
                {goal.products && goal.products.length > 0 && (
                  <div>Produtos: {goal.products.join(', ')}</div>
                )}
                {goal.responsibles && goal.responsibles.length > 0 && (
                  <div>Responsáveis: {goal.responsibles.join(', ')}</div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeGoal(index)}
                className="mt-2"
                disabled={isViewMode}
              >
                Remover Meta
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
