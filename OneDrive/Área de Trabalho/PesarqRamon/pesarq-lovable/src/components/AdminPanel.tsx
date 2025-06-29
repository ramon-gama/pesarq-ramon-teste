
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Mail, Download, Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResponseRecord {
  id: string;
  department: string;
  respondent: string;
  email: string;
  status: 'completed' | 'partial' | 'pending';
  submittedAt?: string;
  lastActivity?: string;
  completionRate: number;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reminderDialog, setReminderDialog] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Dados de exemplo
  const responses: ResponseRecord[] = [
    {
      id: '1',
      department: 'Secretaria de Administração',
      respondent: 'João Silva',
      email: 'joao.silva@prefeitura.gov.br',
      status: 'completed',
      submittedAt: '2024-01-15T10:30:00',
      lastActivity: '2024-01-15T10:30:00',
      completionRate: 100
    },
    {
      id: '2',
      department: 'Departamento Financeiro',
      respondent: 'Maria Santos',
      email: 'maria.santos@prefeitura.gov.br',
      status: 'partial',
      lastActivity: '2024-01-14T16:45:00',
      completionRate: 60
    },
    {
      id: '3',
      department: 'Recursos Humanos',
      respondent: 'Pedro Costa',
      email: 'pedro.costa@prefeitura.gov.br',
      status: 'completed',
      submittedAt: '2024-01-13T14:20:00',
      lastActivity: '2024-01-13T14:20:00',
      completionRate: 100
    },
    {
      id: '4',
      department: 'Departamento de Planejamento',
      respondent: '-',
      email: 'planejamento@prefeitura.gov.br',
      status: 'pending',
      completionRate: 0
    },
    {
      id: '5',
      department: 'Secretaria de Obras',
      respondent: '-',
      email: 'obras@prefeitura.gov.br',
      status: 'pending',
      completionRate: 0
    },
    {
      id: '6',
      department: 'Departamento Jurídico',
      respondent: 'Ana Oliveira',
      email: 'ana.oliveira@prefeitura.gov.br',
      status: 'partial',
      lastActivity: '2024-01-12T09:15:00',
      completionRate: 40
    }
  ];

  const filteredResponses = responses.filter(response => {
    const matchesSearch = 
      response.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.respondent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || response.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ResponseRecord['status']) => {
    const configs = {
      completed: { label: 'Concluído', className: 'bg-green-100 text-green-800' },
      partial: { label: 'Parcial', className: 'bg-yellow-100 text-yellow-800' },
      pending: { label: 'Pendente', className: 'bg-red-100 text-red-800' }
    };
    
    const config = configs[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: ResponseRecord['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleSendReminder = () => {
    if (selectedDepartments.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um departamento.",
        variant: "destructive"
      });
      return;
    }

    // Aqui integraria com sistema de email
    console.log('Sending reminder to:', selectedDepartments);
    console.log('Message:', reminderMessage);
    
    toast({
      title: "Sucesso",
      description: `Lembrete enviado para ${selectedDepartments.length} departamento(s).`
    });
    
    setReminderDialog(false);
    setReminderMessage("");
    setSelectedDepartments([]);
  };

  const exportToExcel = () => {
    // Aqui implementaria a exportação para Excel
    toast({
      title: "Exportação Iniciada",
      description: "O arquivo será baixado em instantes."
    });
  };

  const pendingDepartments = responses.filter(r => r.status === 'pending');
  const partialDepartments = responses.filter(r => r.status === 'partial');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Painel Administrativo</h2>
          <p className="text-gray-600 mt-2">Acompanhe o status das respostas e gerencie lembretes</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          
          <Dialog open={reminderDialog} onOpenChange={setReminderDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Lembretes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Enviar Lembretes</DialogTitle>
                <DialogDescription>
                  Selecione os departamentos e personalize a mensagem do lembrete.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Departamentos Pendentes/Parciais</Label>
                  <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                    {[...pendingDepartments, ...partialDepartments].map((dept) => (
                      <label key={dept.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept.department)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDepartments([...selectedDepartments, dept.department]);
                            } else {
                              setSelectedDepartments(selectedDepartments.filter(d => d !== dept.department));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          {dept.department} ({dept.status === 'pending' ? 'Pendente' : 'Parcial'})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">Mensagem do Lembrete</Label>
                  <Textarea
                    id="message"
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                    placeholder="Digite a mensagem personalizada do lembrete..."
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setReminderDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendReminder}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Lembretes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumo de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Respostas Completas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responses.filter(r => r.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Respostas Parciais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responses.filter(r => r.status === 'partial').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              Respostas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responses.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por departamento, respondente ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="partial">Parcial</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Respostas */}
      <Card>
        <CardHeader>
          <CardTitle>Status das Respostas por Setor</CardTitle>
          <CardDescription>
            Acompanhe o progresso de cada departamento no diagnóstico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Respondente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Data de Envio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(response.status)}
                      {getStatusBadge(response.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{response.department}</TableCell>
                  <TableCell>{response.respondent}</TableCell>
                  <TableCell className="text-sm text-gray-600">{response.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            response.completionRate === 100 ? 'bg-green-500' :
                            response.completionRate > 0 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${response.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm">{response.completionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(response.lastActivity)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(response.submittedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
