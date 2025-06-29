
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, Search, Filter, Clock, Archive, FileText, Info, Zap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TemporalityViewerProps {
  temporalityItems: any[];
  currentVersion: any;
}

const JUSTIFICATIVAS_LABELS = {
  // Guarda Permanente
  valor_historico: "Valor Histórico",
  valor_probatorio: "Valor Probatório", 
  valor_informativo: "Valor Informativo",
  valor_cientifico: "Valor Científico/Técnico",
  valor_cultural: "Valor Cultural",
  valor_social: "Valor Social",
  // Eliminação
  cumprimento_prazos: "Cumprimento de Prazos",
  recapitulacao: "Recapitulação",
  obsolescencia: "Obsolescência Informacional",
  ausencia_valor: "Ausência de Valor"
};

const EVENTOS_LABELS = {
  // Arquivo Corrente
  conclusao_atividade: "Conclusão de Atividade",
  termino_vigencia: "Término da Vigência",
  fim_vinculo: "Fim do Vínculo",
  homologacao_fato: "Homologação do Fato",
  aprovacao_contas: "Aprovação das Contas",
  conclusao_caso: "Conclusão do Caso",
  decisao_recursos: "Decisão Final sobre Recursos",
  // Arquivo Intermediário
  aprovacao_contas_tcu: "Aprovação pelo TCU",
  apresentacao_relatorio: "Apresentação do Relatório",
  homologacao_decisoes: "Homologação de Decisões",
  transferencias: "Transferências"
};

export function TemporalityViewer({ temporalityItems, currentVersion }: TemporalityViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDestination, setFilterDestination] = useState("all");

  const filteredItems = temporalityItems.filter(item => {
    const matchesSearch = item.tipoDocumental.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterDestination === "all" || item.destinacaoFinal === filterDestination;
    return matchesSearch && matchesFilter;
  });

  const getDestinationBadge = (destination: string) => {
    if (destination === "guarda_permanente") {
      return <Badge className="bg-green-100 text-green-800">Guarda Permanente</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-800">Eliminação</Badge>;
  };

  const getJustificativasBadges = (justificativas: string[] | string) => {
    // Suporte para compatibilidade com formato antigo
    const justArray = Array.isArray(justificativas) ? justificativas : justificativas ? [justificativas] : [];
    
    if (justArray.length === 0) {
      return (
        <Badge variant="outline" className="text-red-600 border-red-300">
          <Info className="h-3 w-3 mr-1" />
          Não definidas
        </Badge>
      );
    }
    
    return (
      <div className="space-y-1">
        {justArray.slice(0, 3).map((justId, index) => {
          const label = JUSTIFICATIVAS_LABELS[justId as keyof typeof JUSTIFICATIVAS_LABELS] || justId;
          return (
            <Badge key={index} variant="outline" className="text-xs block">
              {label}
            </Badge>
          );
        })}
        {justArray.length > 3 && (
          <span className="text-xs text-gray-500">
            +{justArray.length - 3} mais
          </span>
        )}
      </div>
    );
  };

  const getEventoBadge = (eventoId: string) => {
    if (!eventoId) return "—";
    return (
      <Badge variant="outline" className="text-xs">
        <Zap className="h-3 w-3 mr-1" />
        {EVENTOS_LABELS[eventoId as keyof typeof EVENTOS_LABELS] || eventoId}
      </Badge>
    );
  };

  const exportToPDF = () => {
    console.log("Exportando para PDF...");
  };

  const printTable = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tabela de Temporalidade - Versão {currentVersion.version}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Visualização completa dos prazos de guarda, eventos de disparo, destinação final e justificativas
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToPDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
              <Button variant="outline" onClick={printTable} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por código ou tipo documental..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  value={filterDestination}
                  onChange={(e) => setFilterDestination(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Todas as destinações</option>
                  <option value="guarda_permanente">Guarda Permanente</option>
                  <option value="eliminacao">Eliminação</option>
                </select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Mais Filtros
                </Button>
              </div>
            </div>

            {/* Informações da Versão */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Versão:</span>
                  <p className="text-blue-600">{currentVersion.version}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Data de Aprovação:</span>
                  <p className="text-blue-600">{currentVersion.dataAprovacao.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Próxima Revisão:</span>
                  <p className="text-blue-600">{currentVersion.proximaRevisao.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Total de Itens:</span>
                  <p className="text-blue-600">{temporalityItems.length}</p>
                </div>
              </div>
            </div>

            {/* Tabela */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Código</TableHead>
                    <TableHead className="min-w-48">Tipo Documental</TableHead>
                    <TableHead className="w-28">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Arquivo Corrente
                      </div>
                    </TableHead>
                    <TableHead className="w-32">Evento Corrente</TableHead>
                    <TableHead className="w-28">
                      <div className="flex items-center gap-1">
                        <Archive className="h-4 w-4" />
                        Arquivo Intermediário
                      </div>
                    </TableHead>
                    <TableHead className="w-32">Evento Intermediário</TableHead>
                    <TableHead className="w-36">Destinação Final</TableHead>
                    <TableHead className="w-48">Justificativas</TableHead>
                    <TableHead className="w-32">Fundamentação Legal</TableHead>
                    <TableHead className="w-32">Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm font-medium">
                        {item.codigo}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.tipoDocumental}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.prazoGuardaArquivoCorrente}
                      </TableCell>
                      <TableCell>
                        {getEventoBadge(item.eventoDisparoCorrente)}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.prazoGuardaArquivoIntermediario}
                      </TableCell>
                      <TableCell>
                        {getEventoBadge(item.eventoDisparoIntermediario)}
                      </TableCell>
                      <TableCell>
                        {getDestinationBadge(item.destinacaoFinal)}
                      </TableCell>
                      <TableCell>
                        {getJustificativasBadges(item.justificativasDestinacao || item.justificativaDestinacao)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {item.fundamentacaoLegal?.slice(0, 2).map((lei: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lei}
                            </Badge>
                          ))}
                          {item.fundamentacaoLegal?.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{item.fundamentacaoLegal.length - 2} mais
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48">
                        <div className="text-sm text-gray-600 truncate">
                          {item.observacoes || "—"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum item encontrado com os filtros aplicados.</p>
              </div>
            )}

            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Exibindo {filteredItems.length} de {temporalityItems.length} itens
              </span>
              <span>
                Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
