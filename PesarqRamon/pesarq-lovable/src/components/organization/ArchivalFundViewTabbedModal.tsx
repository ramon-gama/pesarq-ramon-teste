import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArchivalFund } from "@/hooks/useArchivalFunds";

interface ArchivalFundViewTabbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: ArchivalFund | null;
}

export function ArchivalFundViewTabbedModal({ isOpen, onClose, fund }: ArchivalFundViewTabbedModalProps) {
  const isMobile = useIsMobile();

  if (!fund) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const constitutionNatureLabels: { [key: string]: string } = {
    'constituicao_original': 'Constituição original do órgão',
    'mudanca_nome': 'Mudança de nome da entidade',
    'fusao_institucional': 'Fusão institucional',
    'orgao_extinto': 'Órgão extinto/incorporado',
    'outro': 'Outro'
  };

  const standardsLabels: { [key: string]: string } = {
    'isad_g': 'ISAD(G)',
    'nobrade': 'NOBRADE',
    'isaar_cpf': 'ISAAR(CPF)',
    'ead': 'EAD'
  };

  const getConstitutionNatureDisplay = () => {
    if (!fund.constitution_nature) return 'N/A';
    const natures = typeof fund.constitution_nature === 'string' 
      ? fund.constitution_nature.split(',') 
      : fund.constitution_nature;
    
    return natures.map(nature => constitutionNatureLabels[nature] || nature).join(', ');
  };

  const getUsedStandardsDisplay = () => {
    if (!fund.used_standards) return 'N/A';
    const standards = typeof fund.used_standards === 'string' 
      ? fund.used_standards.split(',') 
      : fund.used_standards;
    
    return standards.map(standard => standardsLabels[standard] || standard).join(', ');
  };

  const getResearchInstrumentsDisplay = () => {
    if (!fund.research_instruments) return 'Nenhum';
    
    const instruments = [];
    if (fund.research_instruments.inventory) instruments.push('Inventário');
    if (fund.research_instruments.guide) instruments.push('Guia');
    if (fund.research_instruments.catalog) instruments.push('Catálogo');
    if (fund.research_instruments.other) instruments.push('Outro');
    
    return instruments.length > 0 ? instruments.join(', ') : 'Nenhum';
  };

  const getFundStatus = () => {
    if (!fund.end_date) {
      return { label: 'Ativo (Fundo Aberto)', variant: 'default' as const };
    } else {
      return { label: 'Inativo (Fundo Fechado)', variant: 'secondary' as const };
    }
  };

  const fundStatus = getFundStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'w-[95vw] h-[90vh]' : 'sm:max-w-[900px] max-h-[90vh]'} overflow-hidden flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="break-words">{fund.name}</span>
            <Badge variant={fundStatus.variant}>
              {fundStatus.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Visualização detalhada do fundo arquivístico
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="identification" className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-shrink-0 overflow-x-auto">
            <TabsList className={`${isMobile ? 'grid grid-cols-3 gap-1 h-auto p-2' : 'grid grid-cols-6 h-10 p-1'} w-full bg-muted`}>
              <TabsTrigger 
                value="identification" 
                className={`${isMobile ? 'text-xs px-1 py-2 h-auto' : 'text-sm'} whitespace-nowrap`}
              >
                {isMobile ? 'Ident.' : 'Identificação'}
              </TabsTrigger>
              <TabsTrigger 
                value="context" 
                className={`${isMobile ? 'text-xs px-1 py-2 h-auto' : 'text-sm'} whitespace-nowrap`}
              >
                Contexto
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className={`${isMobile ? 'text-xs px-1 py-2 h-auto' : 'text-sm'} whitespace-nowrap`}
              >
                Conteúdo
              </TabsTrigger>
              {!isMobile && (
                <>
                  <TabsTrigger value="access">Acesso</TabsTrigger>
                  <TabsTrigger value="related">Relacionadas</TabsTrigger>
                  <TabsTrigger value="control">Controle</TabsTrigger>
                </>
              )}
            </TabsList>
            
            {/* Segunda linha de tabs no mobile */}
            {isMobile && (
              <TabsList className="grid grid-cols-3 gap-1 h-auto p-2 w-full bg-muted mt-2">
                <TabsTrigger 
                  value="access" 
                  className="text-xs px-1 py-2 h-auto whitespace-nowrap"
                >
                  Acesso
                </TabsTrigger>
                <TabsTrigger 
                  value="related" 
                  className="text-xs px-1 py-2 h-auto whitespace-nowrap"
                >
                  Relacionadas
                </TabsTrigger>
                <TabsTrigger 
                  value="control" 
                  className="text-xs px-1 py-2 h-auto whitespace-nowrap"
                >
                  Controle
                </TabsTrigger>
              </TabsList>
            )}
          </div>

          <div className="flex-1 overflow-y-auto mt-4">
            {/* Área 1 - Identificação */}
            <TabsContent value="identification" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">🟦 Área 1 – Identificação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Código de referência</h4>
                      <p className="text-sm break-words">{fund.code || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Título do fundo</h4>
                      <p className="text-sm font-medium break-words">{fund.name}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Data inicial</h4>
                      <p className="text-sm">{formatDate(fund.start_date)}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Data final</h4>
                      <p className="text-sm">{formatDate(fund.end_date)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Nível de descrição</h4>
                    <p className="text-sm">Fundo</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Localização</h4>
                    <p className="text-sm break-words">{fund.location || 'N/A'}</p>
                  </div>

                  {fund.extensions && fund.extensions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Extensão e suporte</h4>
                      <div className="space-y-2">
                        {fund.extensions.map((ext: any, index: number) => (
                          <div key={index} className="text-sm bg-gray-50 p-2 rounded break-words">
                            {ext.quantity && <span className="font-medium">{ext.quantity}</span>}
                            {ext.unit && <span className="ml-1">{ext.unit}</span>}
                            {ext.support_type && <span className="ml-2">({ext.support_type})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Área 2 - Contexto */}
            <TabsContent value="context" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">🟦 Área 2 – Origem e Contexto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Nome do produtor</h4>
                    <p className="text-sm break-words">{fund.producer_name || 'N/A'}</p>
                  </div>

                  {fund.origin_trajectory && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Origem e trajetória do acervo</h4>
                      <p className="text-sm whitespace-pre-wrap break-words">{fund.origin_trajectory}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Natureza da constituição do fundo</h4>
                    <p className="text-sm break-words">{getConstitutionNatureDisplay()}</p>
                  </div>

                  {fund.constitution_other && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Outro tipo de constituição</h4>
                      <p className="text-sm break-words">{fund.constitution_other}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Área 3 - Conteúdo */}
            <TabsContent value="content" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">🟦 Área 3 – Conteúdo e Organização</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fund.scope_content && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Âmbito e conteúdo</h4>
                      <p className="text-sm whitespace-pre-wrap break-words">{fund.scope_content}</p>
                    </div>
                  )}

                  {fund.organization && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Organização do fundo</h4>
                      <p className="text-sm whitespace-pre-wrap break-words">{fund.organization}</p>
                    </div>
                  )}

                  {fund.evaluation_temporality && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Avaliação e temporalidade</h4>
                      <p className="text-sm whitespace-pre-wrap break-words">{fund.evaluation_temporality}</p>
                    </div>
                  )}

                  {fund.description && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Descrição geral</h4>
                      <p className="text-sm whitespace-pre-wrap break-words">{fund.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Área 4 - Acesso */}
            <TabsContent value="access" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">🟦 Área 4 – Condições de Acesso e Uso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fund.access_restrictions && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Restrições e condições de uso</h4>
                      <p className="text-sm whitespace-pre-wrap break-words">{fund.access_restrictions}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Língua(s) predominante(s)</h4>
                    <p className="text-sm break-words">{fund.predominant_languages || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Área 5 - Relacionadas */}
            <TabsContent value="related" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">🟦 Área 5 – Informações Relacionadas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Instrumentos de pesquisa existentes</h4>
                    <p className="text-sm break-words">{getResearchInstrumentsDisplay()}</p>
                  </div>

                  {fund.research_instruments_description && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Descrição/Link dos instrumentos</h4>
                      <p className="text-sm whitespace-pre-wrap break-words">{fund.research_instruments_description}</p>
                    </div>
                  )}

                  {fund.related_funds && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Relação com outros fundos</h4>
                      <p className="text-sm whitespace-pre-wrap break-words">{fund.related_funds}</p>
                    </div>
                  )}

                  {fund.complementary_notes && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Notas complementares</h4>
                      <p className="text-sm whitespace-pre-wrap break-words">{fund.complementary_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Área 6 - Controle */}
            <TabsContent value="control" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">🟦 Área 6 – Controle da Descrição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Responsável pela descrição</h4>
                      <p className="text-sm break-words">{fund.description_responsible || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Data da descrição</h4>
                      <p className="text-sm">{formatDate(fund.description_date)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Normas utilizadas</h4>
                      <p className="text-sm break-words">{getUsedStandardsDisplay()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Data da última atualização</h4>
                      <p className="text-sm">{formatDate(fund.last_update_date)}</p>
                    </div>
                  </div>

                  {fund.observations && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Observações</h4>
                      <p className="text-sm whitespace-pre-wrap break-words">{fund.observations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
