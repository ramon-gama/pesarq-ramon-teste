import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Search, Filter, Eye, Edit, Trash2, AlertTriangle, Clock, CheckCircle, ChevronDown, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useIncidents, Incident } from "@/hooks/useIncidents";
import { IncidentRegistration } from "./IncidentRegistration";

export function IncidentTracking() {
  const { incidents, loading, deleteIncident, updateIncident } = useIncidents('00000000-0000-0000-0000-000000000001');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);

  const severityConfig = {
    baixa: { label: "Baixa", color: "bg-green-100 text-green-800", icon: "●" },
    moderada: { label: "Moderada", color: "bg-yellow-100 text-yellow-800", icon: "●" },
    alta: { label: "Alta", color: "bg-orange-100 text-orange-800", icon: "●" },
    critica: { label: "Crítica", color: "bg-red-100 text-red-800", icon: "●" }
  };

  const statusConfig = {
    novo: { label: "Novo", color: "bg-blue-100 text-blue-800", icon: <AlertTriangle className="h-3 w-3" /> },
    "em-tratamento": { label: "Em Tratamento", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
    resolvido: { label: "Resolvido", color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3" /> },
    "sem-solucao": { label: "Sem Solução", color: "bg-gray-100 text-gray-800", icon: <AlertTriangle className="h-3 w-3" /> }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (incident.location && incident.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSeverity = !selectedSeverity || incident.severity === selectedSeverity;
    const matchesStatus = !selectedStatus || incident.status === selectedStatus;
    const matchesType = !selectedType || incident.type.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesSeverity && matchesStatus && matchesType;
  });

  // Preparar dados dos gráficos baseados nos dados reais
  const incidentsByType = incidents.reduce((acc, incident) => {
    const existing = acc.find(item => item.name === incident.type);
    if (existing) {
      existing.total += 1;
    } else {
      acc.push({ name: incident.type, total: 1, color: "#15AB92" });
    }
    return acc;
  }, [] as Array<{ name: string; total: number; color: string }>);

  const incidentsBySeverity = [
    { name: "Baixa", value: incidents.filter(i => i.severity === 'baixa').length, color: "#22c55e" },
    { name: "Moderada", value: incidents.filter(i => i.severity === 'moderada').length, color: "#eab308" },
    { name: "Alta", value: incidents.filter(i => i.severity === 'alta').length, color: "#f97316" },
    { name: "Crítica", value: incidents.filter(i => i.severity === 'critica').length, color: "#ef4444" }
  ].filter(item => item.value > 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleView = (incident: Incident) => {
    setSelectedIncident(incident);
    setViewDialogOpen(true);
  };

  const handleEdit = (incident: Incident) => {
    setEditingIncident(incident);
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (incidentToDelete) {
      await deleteIncident(incidentToDelete);
      setDeleteDialogOpen(false);
      setIncidentToDelete(null);
    }
  };

  const handleStatusUpdate = async (incidentId: string, newStatus: string) => {
    await updateIncident(incidentId, { status: newStatus as any });
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditingIncident(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando incidentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filtros Recolhíveis */}
      <Card>
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                  <CardTitle className="text-sm sm:text-base">Filtros de Pesquisa</CardTitle>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar incidentes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2">
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gravidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="moderada">Moderada</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedSeverity && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedSeverity("")}>
                      Limpar filtro
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="em-tratamento">Em Tratamento</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                      <SelectItem value="sem-solucao">Sem Solução</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedStatus && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedStatus("")}>
                      Limpar filtro
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="riscos">Riscos Físicos</SelectItem>
                      <SelectItem value="tecnologicas">Falhas Tecnológicas</SelectItem>
                      <SelectItem value="acesso">Acesso Indevido</SelectItem>
                      <SelectItem value="integridade">Violação da Integridade</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedType && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedType("")}>
                      Limpar filtro
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Incidentes por Tipo
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Distribuição dos incidentes por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {incidentsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={incidentsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#15AB92" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum incidente encontrado</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Distribuição por Gravidade
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Proporção de incidentes por nível de gravidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {incidentsBySeverity.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={incidentsBySeverity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    fontSize={8}
                  >
                    {incidentsBySeverity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum incidente encontrado</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Incidentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Incidentes Registrados ({filteredIncidents.length})</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Acompanhe todos os incidentes registrados e suas situações atuais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Título</TableHead>
                  <TableHead className="w-[120px] text-xs sm:text-sm">Data</TableHead>
                  <TableHead className="w-[120px] text-xs sm:text-sm">Tipo</TableHead>
                  <TableHead className="w-[100px] text-xs sm:text-sm">Gravidade</TableHead>
                  <TableHead className="w-[120px] text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Responsável</TableHead>
                  <TableHead className="w-[140px] text-xs sm:text-sm">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{incident.title}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">{incident.location}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {formatDate(incident.date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] sm:text-xs">{incident.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${severityConfig[incident.severity].color} text-[10px] sm:text-xs`}>
                        {severityConfig[incident.severity].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={incident.status} onValueChange={(value) => handleStatusUpdate(incident.id, value)}>
                        <SelectTrigger className="w-full">
                          <Badge className={`${statusConfig[incident.status].color} text-[10px] sm:text-xs`}>
                            <span className="flex items-center gap-1">
                              {statusConfig[incident.status].icon}
                              {statusConfig[incident.status].label}
                            </span>
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novo">Novo</SelectItem>
                          <SelectItem value="em-tratamento">Em Tratamento</SelectItem>
                          <SelectItem value="resolvido">Resolvido</SelectItem>
                          <SelectItem value="sem-solucao">Sem Solução</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{incident.responsible}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(incident)}
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(incident)}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setIncidentToDelete(incident.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedIncident?.title}</DialogTitle>
            <DialogDescription>
              Detalhes completos do incidente
            </DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data do Incidente:</label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedIncident.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Local:</label>
                  <p className="text-sm text-muted-foreground">{selectedIncident.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo:</label>
                  <p className="text-sm text-muted-foreground">{selectedIncident.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Volume Afetado:</label>
                  <p className="text-sm text-muted-foreground">{selectedIncident.estimated_volume}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Descrição:</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedIncident.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Responsável:</label>
                <p className="text-sm text-muted-foreground">{selectedIncident.responsible}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editDialogOpen && editingIncident && (
        <IncidentRegistration 
          isModal={true} 
          onClose={handleEditClose}
          editingIncident={editingIncident}
        />
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Incidente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este incidente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
