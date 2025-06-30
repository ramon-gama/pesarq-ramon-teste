
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MessageSquare, Eye } from "lucide-react";

const trendingTopics = [
  {
    id: "1",
    title: "Implementação do RDC-Arq",
    category: "Preservação Digital",
    discussions: 28,
    views: 1240,
    trend: "+15%"
  },
  {
    id: "2", 
    title: "LGPD em arquivos públicos",
    category: "LGPD",
    discussions: 22,
    views: 980,
    trend: "+12%"
  },
  {
    id: "3",
    title: "Digitalização de processos",
    category: "Digitalização", 
    discussions: 19,
    views: 756,
    trend: "+8%"
  },
  {
    id: "4",
    title: "Novidades do Archivematica",
    category: "Inovações",
    discussions: 16,
    views: 623,
    trend: "+6%"
  }
];

export function TrendingTopics() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Tópicos em Alta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div key={topic.id} className="space-y-2">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium leading-tight hover:text-primary cursor-pointer">
                  {topic.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {topic.category}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{topic.discussions}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{topic.views}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs text-green-600">
                    {topic.trend}
                  </Badge>
                </div>
              </div>
            </div>
            {index < trendingTopics.length - 1 && (
              <div className="border-b border-gray-100" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
