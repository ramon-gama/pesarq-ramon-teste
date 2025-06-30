
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, DollarSign, Users, ExternalLink } from "lucide-react";
import { Project } from "@/hooks/useProjects";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  organizations: Array<{ id: string; name: string }>;
}

export function ProjectCard({ project, onEdit, onDelete, organizations }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planejamento":
        return "bg-yellow-100 text-yellow-800";
      case "andamento":
        return "bg-blue-100 text-blue-800";
      case "finalizado":
        return "bg-green-100 text-green-800";
      case "suspenso":
        return "bg-orange-100 text-orange-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "planejamento":
        return "Planejamento";
      case "andamento":
        return "Em Andamento";
      case "finalizado":
        return "Finalizado";
      case "suspenso":
        return "Suspenso";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getOrganizationName = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    return org ? org.name : 'Organização não encontrada';
  };

  const normalizeUrl = (url: string) => {
    if (!url) return '';
    if ((url.includes('drive.google.com') || url.includes('docs.google.com')) && !url.startsWith('http')) {
      return 'https://' + url;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://') && url.includes('.')) {
      return 'https://' + url;
    }
    return url;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
          <Badge className={getStatusColor(project.status)}>
            {getStatusLabel(project.status)}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{getOrganizationName(project.organization_id || '')}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {project.object && (
          <p className="text-sm text-gray-700 line-clamp-3">{project.object}</p>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span>{new Date(project.start_date).toLocaleDateString('pt-BR')}</span>
          </div>
          
          {project.total_value && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-gray-400" />
              <span>R$ {project.total_value.toLocaleString('pt-BR')}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-gray-400" />
            <span>{project.researchers_count || 0} pesquisador(es)</span>
          </div>
          
          {project.legal_instrument && (
            <div className="text-xs text-gray-600">
              {project.legal_instrument}
            </div>
          )}
        </div>

        {/* Link do documento externo */}
        {project.external_link && (
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const url = normalizeUrl(project.external_link!);
                window.open(url, '_blank');
              }}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visualizar documento
            </Button>
          </div>
        )}
        
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(project)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(project.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
