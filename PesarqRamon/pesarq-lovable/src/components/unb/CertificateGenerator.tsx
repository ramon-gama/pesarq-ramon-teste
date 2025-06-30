import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Calendar, User } from "lucide-react";
import { useResearchers } from "@/hooks/useResearchers";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";

export function CertificateGenerator() {
  const [selectedResearcher, setSelectedResearcher] = useState<string>("");
  const [certificateType, setCertificateType] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [observations, setObservations] = useState<string>("");
  const { activeResearchers } = useResearchers();
  const { projects } = useProjects();
  const { toast } = useToast();

  const handleGenerateCertificate = () => {
    if (!selectedResearcher || !certificateType || !selectedHours) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const researcher = activeResearchers.find(r => r.id === selectedResearcher);
    const project = projects.find(p => p.id === researcher?.project_id);
    
    if (!researcher) {
      toast({
        title: "Erro",
        description: "Pesquisador não encontrado",
        variant: "destructive",
      });
      return;
    }

    const certificateData = {
      researcherName: researcher.name,
      projectTitle: project?.title || "Projeto não informado",
      hours: selectedHours,
      startDate: researcher.start_date,
      endDate: researcher.end_date || new Date().toISOString().split('T')[0],
      certificateType,
      observations
    };

    // Lógica para gerar o certificado (simulação)
    console.log("Gerando certificado com os dados:", certificateData);
    toast({
      title: "Certificado Gerado",
      description: "O certificado foi gerado com sucesso (simulação)",
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        <h2 className="text-xl sm:text-2xl font-bold">Gerador de Certificados</h2>
      </div>
      <p className="text-sm sm:text-base text-gray-600">
        Preencha os campos abaixo para gerar um certificado de participação em projeto.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dados do Certificado</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="researcher">Pesquisador</Label>
            <Select
              value={selectedResearcher}
              onValueChange={setSelectedResearcher}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pesquisador" />
              </SelectTrigger>
              <SelectContent>
                {activeResearchers.map((researcher) => (
                  <SelectItem key={researcher.id} value={researcher.id}>
                    {researcher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate-type">Tipo de Certificado</Label>
            <Select
              value={certificateType}
              onValueChange={setCertificateType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="participacao">Participação</SelectItem>
                <SelectItem value="conclusao">Conclusão</SelectItem>
                <SelectItem value="apresentacao">Apresentação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Carga Horária (horas)</Label>
            <Input
              type="number"
              id="hours"
              value={selectedHours}
              onChange={(e) => setSelectedHours(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              placeholder="Observações adicionais..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleGenerateCertificate} className="w-full">
        <Download className="h-4 w-4 mr-2" />
        Gerar Certificado
      </Button>
    </div>
  );
}
