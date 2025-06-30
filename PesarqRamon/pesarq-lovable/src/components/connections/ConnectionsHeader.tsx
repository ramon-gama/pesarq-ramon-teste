import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
interface ConnectionsHeaderProps {
  onCreatePost: () => void;
  isDemo?: boolean;
}
export function ConnectionsHeader({
  onCreatePost,
  isDemo
}: ConnectionsHeaderProps) {
  return <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h2 className="font-bold text-slate-900 text-3xl">Discussões da Comunidade</h2>
        <p className="text-slate-600">Conecte-se com profissionais e compartilhe conhecimento</p>
      </div>
      <Button onClick={onCreatePost} className="bg-[#15AB92] hover:bg-[#0d8f7a]" type="button">
        <Plus className="h-4 w-4 mr-2" />
        Nova Discussão
      </Button>
    </div>;
}