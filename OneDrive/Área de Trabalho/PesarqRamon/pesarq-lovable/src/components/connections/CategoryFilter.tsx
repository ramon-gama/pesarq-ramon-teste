
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Archive, 
  Database, 
  Shield, 
  Cpu, 
  BookOpen, 
  Users,
  Lock
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isDemo?: boolean;
}

const categories = [
  { id: "all", name: "Todas", icon: Archive, count: 1247 },
  { id: "Gestão Documental", name: "Gestão Documental", icon: Database, count: 324 },
  { id: "Preservação Digital", name: "Preservação Digital", icon: Shield, count: 198 },
  { id: "Digitalização", name: "Digitalização", icon: Cpu, count: 156 },
  { id: "Inovações Tecnológicas", name: "Tecnologia", icon: Cpu, count: 234 },
  { id: "Formação Profissional", name: "Formação", icon: BookOpen, count: 123 },
  { id: "Políticas Arquivísticas", name: "Políticas", icon: Users, count: 212 }
];

export function CategoryFilter({ selectedCategory, onCategoryChange, isDemo = false }: CategoryFilterProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Archive className="h-4 w-4" />
          Categorias
          {isDemo && <Lock className="h-3 w-3 text-orange-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "ghost"}
            className={`w-full justify-between text-left h-auto py-2 px-3 ${
              selectedCategory === category.id 
                ? "bg-[#15AB92] hover:bg-[#0d8f7a]" 
                : ""
            } ${isDemo ? 'opacity-60' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            disabled={isDemo}
          >
            <div className="flex items-center gap-2">
              <category.icon className="h-4 w-4" />
              <span className="text-sm">{category.name}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
