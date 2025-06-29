
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Mail, 
  Copy, 
  ExternalLink, 
  Users, 
  Send,
  ArrowLeft,
  Eye,
  Trash2,
  Link as LinkIcon
} from "lucide-react";

interface Sector {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status: "pending" | "sent" | "completed";
}

interface DiagnosticLinkManagerProps {
  diagnosticId: string;
  diagnosticTitle: string;
  onNavigateBack: () => void;
}

export function DiagnosticLinkManager({ diagnosticId, diagnosticTitle, onNavigateBack }: DiagnosticLinkManagerProps) {
  const { toast } = useToast();
  const [sectors, setSectors] = useState<Sector[]>([
    {
      id: "1",
      name: "Recursos Humanos",
      email: "rh@exemplo.com",
      createdAt: "2024-11-20",
      status: "completed"
    },
    {
      id: "2", 
      name: "Tecnologia da Informação",
      email: "ti@exemplo.com",
      createdAt: "2024-11-19",
      status: "sent"
    }
  ]);
  
  const [newSector, setNewSector] = useState({ name: "", email: "" });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const generatePublicLink = (sectorId?: string) => {
    const baseUrl = window.location.origin;
    const linkId = Math.random().toString(36).substr(2, 9);
    return `${baseUrl}/public-diagnostic/${diagnosticId}/${linkId}${sectorId ? `?sector=${sectorId}` : ''}`;
  };

  const handleAddSector = () => {
    if (!newSector.name || !newSector.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e email do setor.",
        variant: "destructive"
      });
      return;
    }

    const sector: Sector = {
      id: Date.now().toString(),
      name: newSector.name,
      email: newSector.email,
      createdAt: new Date().toISOString().split('T')[0],
      status: "pending"
    };

    setSectors([...sectors, sector]);
    setNewSector({ name: "", email: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Setor adicionado",
      description: "Setor cadastrado com sucesso!"
    });
  };

  const handleSendEmail = (sector: Sector) => {
    const publicLink = generatePublicLink(sector.id);
    
    // Simular envio de email
    console.log("Enviando email para:", sector.email);
    console.log("Link:", publicLink);
    
    setSectors(sectors.map(s => 
      s.id === sector.id ? { ...s, status: "sent" as const } : s
    ));
    
    toast({
      title: "Email enviado",
      description: `Link do diagnóstico enviado para ${sector.email}`
    });
  };

  const handleCopyLink = (sectorId?: string) => {
    const link = generatePublicLink(sectorId);
    navigator.clipboard.writeText(link);
    
    toast({
      title: "Link copiado",
      description: "Link público copiado para a área de transferência"
    });
  };

  const handleDeleteSector = (sectorId: string) => {
    setSectors(sectors.filter(s => s.id !== sectorId));
    toast({
      title: "Setor removido",
      description: "Setor removido da lista"
    });
  };

  const getStatusBadge = (status: Sector["status"]) => {
    const variants = {
      pending: { variant: "outline" as const, text: "Pendente" },
      sent: { variant: "secondary" as const, text: "Enviado" },
      completed: { variant: "default" as const, text: "Concluído" }
    };
    
    return (
      <Badge variant={variants[status].variant}>
        {variants[status].text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onNavigateBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Links Públicos</h1>
          <p className="text-muted-foreground">{diagnosticTitle}</p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Setores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectors.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Links Enviados</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectors.filter(s => s.status === "sent").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectors.filter(s => s.status === "completed").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sectors.length > 0 ? Math.round((sectors.filter(s => s.status === "completed").length / sectors.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="sectors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sectors">Setores Cadastrados</TabsTrigger>
          <TabsTrigger value="public-link">Link Público Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="sectors" className="space-y-6">
          {/* Actions */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Setores Cadastrados</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie os setores e envie links personalizados por email
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Setor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Setor</DialogTitle>
                  <DialogDescription>
                    Cadastre um setor para enviar o link do diagnóstico por email
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sector-name">Nome do Setor</Label>
                    <Input
                      id="sector-name"
                      value={newSector.name}
                      onChange={(e) => setNewSector({...newSector, name: e.target.value})}
                      placeholder="Ex: Recursos Humanos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sector-email">Email do Setor</Label>
                    <Input
                      id="sector-email"
                      type="email"
                      value={newSector.email}
                      onChange={(e) => setNewSector({...newSector, email: e.target.value})}
                      placeholder="Ex: rh@empresa.com"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddSector}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Sectors Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Setor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectors.map((sector) => (
                    <TableRow key={sector.id}>
                      <TableCell className="font-medium">{sector.name}</TableCell>
                      <TableCell>{sector.email}</TableCell>
                      <TableCell>{new Date(sector.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{getStatusBadge(sector.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendEmail(sector)}
                            disabled={sector.status === "completed"}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(sector.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSector(sector.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public-link" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Link Público Geral
              </CardTitle>
              <CardDescription>
                Use este link para compartilhar o diagnóstico publicamente, sem vincular a um setor específico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={generatePublicLink()}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={() => handleCopyLink()}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Este link pode ser compartilhado em redes sociais, incluído em emails gerais ou enviado para qualquer pessoa que precise preencher o diagnóstico.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
