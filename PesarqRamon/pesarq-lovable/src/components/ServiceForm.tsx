import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "./SearchableSelect";
import { SectorSelect } from "./SectorSelect";
import { MetricConverter } from "./MetricConverter";
import { ArchivalFundSelect } from "./ArchivalFundSelect";
import { Service, ServiceType, ServiceStatus, SERVICE_TYPES, SERVICE_STATUS, CUSTOM_UNITS, SUPPORT_TYPES } from "@/types/service";
import { Save, X } from "lucide-react";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { useArchivalFunds } from "@/hooks/useArchivalFunds";
import { useOrganizationSectors } from "@/hooks/useOrganizationSectors";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";
interface ServiceFormProps {
  service?: Service;
  onSave: (service: Partial<Service>) => void;
  onCancel: () => void;
}
export function ServiceForm({
  service,
  onSave,
  onCancel
}: ServiceFormProps) {
  const {
    currentOrganization
  } = useOrganizationContext();
  const {
    funds
  } = useArchivalFunds(currentOrganization?.id || '');
  const {
    sectors,
    createSector
  } = useOrganizationSectors(currentOrganization?.id || '');
  const { projects } = useProjects();
  const {
    toast
  } = useToast();

  // Get the default archival fund (first active fund)
  const defaultFund = funds.find(fund => fund.status === 'ativo');
  
  // Filter active projects for the current organization
  const activeProjects = projects.filter(project => 
    project.organization_id === currentOrganization?.id && 
    project.status !== 'cancelado'
  );

  const [formData, setFormData] = useState({
    title: service?.title || '',
    type: service?.type || 'classification' as ServiceType,
    custom_unit: service?.custom_unit || '',
    support_type: service?.support_type || '',
    metric: service?.metric || 0,
    target_sector: service?.target_sector || '',
    responsible_person: service?.responsible_person || '',
    status: service?.status || 'in_progress' as ServiceStatus,
    start_date: service?.start_date || new Date().toISOString().split('T')[0],
    end_date: service?.end_date || '',
    description: service?.description || '',
    archival_fund_id: service?.archival_fund_id || defaultFund?.id || '',
    project_id: service?.project_id || ''
  });

  // Update archival_fund_id when defaultFund changes and no service is being edited
  useEffect(() => {
    if (!service && defaultFund && !formData.archival_fund_id) {
      setFormData(prev => ({
        ...prev,
        archival_fund_id: defaultFund.id
      }));
    }
  }, [defaultFund, service, formData.archival_fund_id]);

  // Convert sectors to the format needed by SectorSelect
  const availableSectors = sectors.filter(sector => sector.status === 'ativo').map(sector => sector.name);
  const selectedServiceType = SERVICE_TYPES[formData.type];
  const serviceTypeOptions = Object.entries(SERVICE_TYPES).map(([key, type]) => ({
    value: key,
    label: type.label
  })).sort((a, b) => a.label.localeCompare(b.label));
  const handleAddSector = async (newSectorName: string) => {
    try {
      await createSector({
        name: newSectorName,
        organization_id: currentOrganization!.id,
        status: 'ativo'
      });
      console.log('✅ Novo setor criado:', newSectorName);
    } catch (error) {
      console.error('❌ Erro ao criar setor:', error);
    }
  };
  const finalUnit = formData.custom_unit || selectedServiceType.unit;
  const showConverter = finalUnit === 'metros lineares' || finalUnit === 'caixas' || finalUnit === 'caixas-arquivo';
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) {
      console.error('❌ No organization selected');
      return;
    }
    console.log('💾 Saving service for organization:', currentOrganization.id);
    onSave({
      ...formData,
      indicator: selectedServiceType.indicator,
      unit: finalUnit,
      organization_id: currentOrganization.id,
      updated_at: new Date().toISOString()
    });
  };
  if (!currentOrganization) {
    return <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>Selecione uma organização para criar serviços</p>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{service ? 'Editar Serviço' : 'Novo Serviço'}</CardTitle>
        <CardDescription>
          Preencha as informações do serviço arquivístico para {currentOrganization.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Serviço</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={e => setFormData({
                  ...formData,
                  title: e.target.value
                })} 
                placeholder="Ex: Classificação de documentos do RH" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Serviço</Label>
              <SearchableSelect 
                value={formData.type} 
                onValueChange={(value: ServiceType) => setFormData({
                  ...formData,
                  type: value
                })} 
                placeholder="Selecione o tipo de serviço" 
                options={serviceTypeOptions} 
                searchPlaceholder="Digite para buscar tipos de serviço..." 
                allowRequestNew={true} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom_unit">Unidade de Medida</Label>
              <Select 
                value={formData.custom_unit} 
                onValueChange={value => setFormData({
                  ...formData,
                  custom_unit: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOM_UNITS.map(unit => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="support_type">Tipo de Suporte</Label>
              <Select 
                value={formData.support_type} 
                onValueChange={value => setFormData({
                  ...formData,
                  support_type: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de suporte" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORT_TYPES.map(support => (
                    <SelectItem key={support.value} value={support.value}>
                      {support.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <ArchivalFundSelect 
                value={formData.archival_fund_id} 
                onValueChange={value => setFormData({
                  ...formData,
                  archival_fund_id: value
                })} 
                organizationId={currentOrganization.id} 
              />
            </div>

            {/* Seleção de Projeto UnB */}
            {activeProjects.length > 0 && (
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="project_id">Projeto UnB (Opcional)</Label>
                  <Select 
                    value={formData.project_id} 
                    onValueChange={value => setFormData({
                      ...formData,
                      project_id: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um projeto UnB para vincular este serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum projeto</SelectItem>
                      {activeProjects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <div className="space-y-2">
                <MetricConverter 
                  primaryValue={formData.metric} 
                  primaryUnit={finalUnit} 
                  onPrimaryChange={value => setFormData({
                    ...formData,
                    metric: value
                  })} 
                  showConverter={showConverter} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: ServiceStatus) => setFormData({
              ...formData,
              status: value
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SERVICE_STATUS).map(([key, status]) => <SelectItem key={key} value={key}>
                      {status.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_sector">Setor Solicitante</Label>
              <SectorSelect value={formData.target_sector} onValueChange={value => setFormData({
              ...formData,
              target_sector: value
            })} sectors={availableSectors} onAddSector={handleAddSector} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible_person">Responsável pelo Serviço</Label>
              <Input id="responsible_person" value={formData.responsible_person} onChange={e => setFormData({
              ...formData,
              responsible_person: e.target.value
            })} placeholder="Ex: João Silva" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início</Label>
              <Input id="start_date" type="date" value={formData.start_date} onChange={e => setFormData({
              ...formData,
              start_date: e.target.value
            })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Data de Conclusão</Label>
              <Input id="end_date" type="date" value={formData.end_date} onChange={e => setFormData({
              ...formData,
              end_date: e.target.value
            })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Observação</Label>
            <Textarea id="description" value={formData.description} onChange={e => setFormData({
            ...formData,
            description: e.target.value
          })} placeholder="Observações adicionais sobre o serviço..." rows={3} />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {service ? 'Atualizar' : 'Criar'} Serviço
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>;
}
