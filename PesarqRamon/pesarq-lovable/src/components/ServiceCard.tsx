
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Service, SERVICE_TYPES, SERVICE_STATUS, CUSTOM_UNITS, SUPPORT_TYPES } from "@/types/service";
import { Edit, Trash2, Calendar, User, Building } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const serviceType = SERVICE_TYPES[service.type];
  const statusInfo = SERVICE_STATUS[service.status];
  
  const getUnitLabel = (unitValue: string) => {
    const unit = CUSTOM_UNITS.find(u => u.value === unitValue);
    return unit ? unit.label : unitValue;
  };

  const getSupportLabel = (supportValue: string) => {
    const support = SUPPORT_TYPES.find(s => s.value === supportValue);
    return support ? support.label : supportValue;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{service.title}</CardTitle>
            <CardDescription className="text-sm">
              {serviceType.label}
            </CardDescription>
          </div>
          <Badge className={statusInfo.color}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Início:</span>
            <span>{new Date(service.start_date).toLocaleDateString('pt-BR')}</span>
          </div>
          
          {service.end_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Fim:</span>
              <span>{new Date(service.end_date).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Setor:</span>
            <span>{service.target_sector}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Responsável:</span>
            <span>{service.responsible_person}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">{service.indicator}</div>
          <div className="text-2xl font-bold text-[#15AB92]">
            {service.metric.toLocaleString('pt-BR')} {service.custom_unit ? getUnitLabel(service.custom_unit) : service.unit}
          </div>
          {service.support_type && (
            <div className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Suporte:</span> {getSupportLabel(service.support_type)}
            </div>
          )}
        </div>

        {service.description && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Descrição:</span>
            <p className="mt-1">{service.description}</p>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(service)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(service.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
