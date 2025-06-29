
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertTriangle, UserX } from "lucide-react";
import { type Researcher } from "@/hooks/useResearchers";

interface DismissalModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcher: Researcher | null;
  onConfirm: (reason: string, dismissedBy: string) => Promise<void>;
}

const dismissalReasons = [
  "Término do prazo de bolsa",
  "Abandono do projeto",
  "Descumprimento de obrigações",
  "A pedido do bolsista",
  "Mudança de projeto",
  "Finalização antecipada do projeto",
  "Problemas de desempenho",
  "Conflito de interesses",
  "Outros"
];

export function DismissalModal({ isOpen, onClose, researcher, onConfirm }: DismissalModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [dismissedBy, setDismissedBy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!researcher || !selectedReason || !dismissedBy) {
      return;
    }

    const finalReason = selectedReason === "Outros" ? customReason : selectedReason;
    
    if (!finalReason.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(finalReason, dismissedBy);
      handleClose();
    } catch (error) {
      console.error('Erro ao desligar pesquisador:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    setDismissedBy("");
    setIsSubmitting(false);
    onClose();
  };

  if (!researcher) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <UserX className="h-5 w-5" />
            Desligar Pesquisador
          </DialogTitle>
        </DialogHeader>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Atenção</p>
              <p className="text-sm text-yellow-700">
                Esta ação irá desligar <strong>{researcher.name}</strong> do projeto. 
                O pesquisador será movido para a aba de desligados.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reason">Motivo do desligamento *</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {dismissalReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedReason === "Outros" && (
            <div>
              <Label htmlFor="customReason">Especifique o motivo *</Label>
              <Textarea
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Descreva o motivo do desligamento..."
                required
                rows={3}
              />
            </div>
          )}

          <div>
            <Label htmlFor="dismissedBy">Responsável pelo desligamento *</Label>
            <Input
              id="dismissedBy"
              value={dismissedBy}
              onChange={(e) => setDismissedBy(e.target.value)}
              placeholder="Nome do responsável"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="destructive"
              className="flex-1"
              disabled={isSubmitting || !selectedReason || !dismissedBy || (selectedReason === "Outros" && !customReason.trim())}
            >
              {isSubmitting ? "Desligando..." : "Confirmar Desligamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
