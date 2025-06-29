
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  Users,
  MessageSquare,
  Settings,
  Activity
} from "lucide-react";

const categories = [
  {
    id: "estrategia",
    title: "Estratégia",
    description: "Políticas, governança e alinhamento estratégico da gestão de documentos",
    icon: Target,
    color: "bg-blue-500",
    subcategories: 4,
    averageScore: 3.8
  },
  {
    id: "ciclo-vida",
    title: "Ciclo de Vida",
    description: "Gestão completa do ciclo de vida dos documentos",
    icon: Activity,
    color: "bg-green-500",
    subcategories: 4,
    averageScore: 3.2
  },
  {
    id: "comunicacao",
    title: "Comunicação",
    description: "Transparência, acesso e comunicação organizacional",
    icon: MessageSquare,
    color: "bg-purple-500",
    subcategories: 4,
    averageScore: 3.5
  },
  {
    id: "operacao",
    title: "Operação",
    description: "Processos operacionais e tecnologia de gestão de documentos",
    icon: Settings,
    color: "bg-orange-500",
    subcategories: 4,
    averageScore: 2.8
  },
  {
    id: "pessoal",
    title: "Pessoal",
    description: "Competências, treinamento e recursos humanos",
    icon: Users,
    color: "bg-red-500",
    subcategories: 4,
    averageScore: 3.1
  }
];

const getMaturityLevel = (score: number) => {
  if (score >= 4.1) return { 
    level: "Avançado", 
    color: "bg-green-600", 
    description: "A Organização integrou a gestão de documentos em sua infraestrutura e processos de negócios",
    range: "80.1% - 100%"
  };
  if (score >= 3.1) return { 
    level: "Consolidado", 
    color: "bg-green-500", 
    description: "A gestão de documentos é uma parte essencial dos negócios da Organização",
    range: "60.1% - 80%"
  };
  if (score >= 2.1) return { 
    level: "Essencial", 
    color: "bg-yellow-500", 
    description: "A organização é caracterizada por possuir políticas e procedimentos claros",
    range: "40.1% - 60%"
  };
  if (score >= 1.1) return { 
    level: "Em desenvolvimento", 
    color: "bg-orange-500", 
    description: "A Organização reconhece a importância da gestão de documentos",
    range: "20.1% - 40%"
  };
  return { 
    level: "Não estabelecido", 
    color: "bg-red-500", 
    description: "A gestão de documentos é ausente ou tratada de forma inadequada",
    range: "0% - 20%"
  };
};

export function MaturityCategories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias de Avaliação</CardTitle>
        <CardDescription>
          5 categorias principais com 4 subcategorias cada, totalizando 80 perguntas específicas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const maturity = getMaturityLevel(category.averageScore);
            return (
              <div key={category.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 ${category.color} rounded-lg`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className={`${maturity.color} text-white border-0`}>
                        {maturity.level}
                      </Badge>
                      <span className="text-sm font-medium">{category.averageScore}/5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export { categories, getMaturityLevel };
