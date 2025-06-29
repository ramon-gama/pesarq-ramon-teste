
import { Service, SERVICE_STATUS, SERVICE_TYPES } from "@/types/service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ServicesTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = SERVICE_STATUS[status as keyof typeof SERVICE_STATUS];
    return (
      <Badge variant={status === 'completed' ? 'default' : status === 'in_progress' ? 'secondary' : 'destructive'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = SERVICE_TYPES[type as keyof typeof SERVICE_TYPES];
    return (
      <Badge variant="outline">
        {typeConfig?.label || type}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Métrica</TableHead>
            <TableHead>Data de Início</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.title}</TableCell>
              <TableCell>{getTypeBadge(service.type)}</TableCell>
              <TableCell>{getStatusBadge(service.status)}</TableCell>
              <TableCell>{service.target_sector}</TableCell>
              <TableCell>{service.responsible_person}</TableCell>
              <TableCell>
                {service.metric} {service.custom_unit || service.unit}
              </TableCell>
              <TableCell>
                {format(new Date(service.start_date), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
