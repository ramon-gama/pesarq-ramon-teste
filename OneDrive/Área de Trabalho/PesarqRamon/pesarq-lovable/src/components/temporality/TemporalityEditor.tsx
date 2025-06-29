
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Filter, Save, Archive, Clock, Info, Zap } from "lucide-react";
import { TemporalityItemForm } from "./TemporalityItemForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TemporalityItem {
  id: string;
  codigo: string;
  tipoDocumental: string;
  prazoGuardaArquivoCorrente: string;
  prazoGuardaArquivoIntermediario: string;
  eventoDisparoCorrente?: string;
  eventoDisparoIntermediario?: string;
  destinacaoFinal: "eliminacao" | "guarda_permanente";
  justificativasDestinacao: string[];
  observacoes?: string;
  fundamentacaoLegal: string[];
  status: "ativo" | "inativo" | "pendente_aprovacao";
  versao: string;
  dataUltimaAtualizacao: Date;
  responsavelElaboracao: string;
  unidadeProducao: string[];
}

interface TemporalityEditorProps {
  temporalityItems: TemporalityItem[];
  onUpdateItems: (items: TemporalityItem[]) => void;
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
  obsolescencia: "Obsolescência Info.",
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

export function TemporalityEditor({ temporalityItems, onUpdateItems, currentVersion }: TemporalityEditorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TemporalityItem | null>(null);
  const [filterDestination, setFilterDestination] = useState<string>("all");

  const handleEdit = (item: TemporalityItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSave = (itemData: any) => {
    if (editingItem) {
      onUpdateItems(
        temporalityItems.map(item => 
          item.id === editingItem.id 
            ? { ...itemData, id: editingItem.id, dataUltimaAtualizacao: new Date() }
            : item
        )
      );
    } else {
      const newItem: TemporalityItem = {
        ...itemData,
        id: Date.now().toString(),
        dataUltimaAtualizacao: new Date(),
        versao: currentVersion.version,
        status: "pendente_aprovacao"
      };
      onUpdateItems([...temporalityItems, newItem]);
    }
    
    setEditingItem(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    onUpdateItems(temporalityItems.filter(item => item.id !== id));
  };

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

  const getStatusBadge = (status: string) => {
    const colors = {
      ativo: "bg-green-100 text-green-800",
      inativo: "bg-gray-100 text-gray-800",
      pendente_aprovacao: "bg-blue-100 text-blue-800"
    };
    const labels = {
      ativo: "Ativo",
      inativo: "Inativo", 
      pendente_aprovacao: "Pendente"
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getJustificativasBadges = (justificativas: string[]) => {
    if (!justificativas || justificativas.length === 0) {
      return (
        <Badge variant="outline" className="text-red-600 border-red-300">
          <Info className="h-3 w-3 mr-1" />
          Não definidas
        </Badge>
      );
    }
    
    return (
      <div className="space-y-1">
        {justificativas.slice(0, 2).map((justId, index) => (
          <Badge key={index} variant="outline" className="text-xs block">
            {JUSTIFICATIVAS_LABELS[justId as keyof typeof JUSTIFICATIVAS_LABELS] || justId}
          </Badge>
        ))}
        {justificativas.length > 2 && (
          <span className="text-xs text-gray-500">
            +{justificativas.length - 2} mais
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Editor da Tabela de Temporalidade</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Gerencie os prazos de guarda, eventos de disparo, destinação final e justificativas dos documentos
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Item
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Alterações
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

            {/* Tabela */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Código</TableHead>
                    <TableHead className="min-w-48">Tipo Documental</TableHead>
                    <TableHead className="w-24">Arq. Corrente</TableHead>
                    <TableHead className="w-28">Evento Corrente</TableHead>
                    <TableHead className="w-24">Arq. Intermediário</TableHead>
                    <TableHead className="w-28">Evento Intermediário</TableHead>
                    <TableHead className="w-32">Destinação Final</TableHead>
                    <TableHead className="w-40">Justificativas</TableHead>
                    <TableHead className="w-20">Status</TableHead>
                    <TableHead className="w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.tipoDocumental}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{item.prazoGuardaArquivoCorrente}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getEventoBadge(item.eventoDisparoCorrente || "")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Archive className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{item.prazoGuardaArquivoIntermediario}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getEventoBadge(item.eventoDisparoIntermediario || "")}
                      </TableCell>
                      <TableCell>{getDestinationBadge(item.destinacaoFinal)}</TableCell>
                      <TableCell>
                        {getJustificativasBadges(item.justificativasDestinacao)}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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

            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Total: {filteredItems.length} itens</span>
              <span>Última modificação: {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <TemporalityItemForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}
