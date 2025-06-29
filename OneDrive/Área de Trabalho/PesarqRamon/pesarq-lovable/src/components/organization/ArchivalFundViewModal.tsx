
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArchivalFund } from "@/hooks/useArchivalFunds";

interface ArchivalFundViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: ArchivalFund | null;
}

export function ArchivalFundViewModal({ isOpen, onClose, fund }: ArchivalFundViewModalProps) {
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Fundo Arquivístico
            <Badge variant={fundStatus.variant}>
              {fundStatus.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Visualização completa das informações do fundo arquivístico
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Área 1 - Identificação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">🟦 Área 1 – Identificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Código de referência</h4>
                  <p className="text-sm">{fund.code || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Título do fundo</h4>
                  <p className="text-sm font-medium">{fund.name}</p>
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

              {fund.extensions && fund.extensions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Extensão e suporte</h4>
                  <div className="space-y-2">
                    {fund.extensions.map((ext: any, index: number) => (
                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
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

          {/* Área 2 - Origem e Contexto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">🟦 Área 2 – Origem e Contexto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-600">Nome do produtor</h4>
                <p className="text-sm">{fund.producer_name || 'N/A'}</p>
              </div>

              {fund.origin_trajectory && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Origem e trajetória do acervo</h4>
                  <p className="text-sm whitespace-pre-wrap">{fund.origin_trajectory}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm text-gray-600">Natureza da constituição do fundo</h4>
                <p className="text-sm">{getConstitutionNatureDisplay()}</p>
              </div>

              {fund.constitution_other && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Outro tipo de constituição</h4>
                  <p className="text-sm">{fund.constitution_other}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Área 3 - Conteúdo e Organização */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">🟦 Área 3 – Conteúdo e Organização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fund.scope_content && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Âmbito e conteúdo</h4>
                  <p className="text-sm whitespace-pre-wrap">{fund.scope_content}</p>
                </div>
              )}

              {fund.organization && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Organização do fundo</h4>
                  <p className="text-sm whitespace-pre-wrap">{fund.organization}</p>
                </div>
              )}

              {fund.evaluation_temporality && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Avaliação e temporalidade</h4>
                  <p className="text-sm whitespace-pre-wrap">{fund.evaluation_temporality}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Área 4 - Condições de Acesso e Uso */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">🟦 Área 4 – Condições de Acesso e Uso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fund.access_restrictions && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Restrições e condições de uso</h4>
                  <p className="text-sm whitespace-pre-wrap">{fund.access_restrictions}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm text-gray-600">Língua(s) predominante(s)</h4>
                <p className="text-sm">{fund.predominant_languages || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Área 5 - Informações Relacionadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">🟦 Área 5 – Informações Relacionadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-600">Instrumentos de pesquisa existentes</h4>
                <p className="text-sm">{getResearchInstrumentsDisplay()}</p>
              </div>

              {fund.research_instruments_description && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Descrição/Link dos instrumentos</h4>
                  <p className="text-sm whitespace-pre-wrap">{fund.research_instruments_description}</p>
                </div>
              )}

              {fund.related_funds && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Relação com outros fundos</h4>
                  <p className="text-sm whitespace-pre-wrap">{fund.related_funds}</p>
                </div>
              )}

              {fund.complementary_notes && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Notas complementares</h4>
                  <p className="text-sm whitespace-pre-wrap">{fund.complementary_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Área 6 - Controle da Descrição */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">🟦 Área 6 – Controle da Descrição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Responsável pela descrição</h4>
                  <p className="text-sm">{fund.description_responsible || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Data da descrição</h4>
                  <p className="text-sm">{formatDate(fund.description_date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Normas utilizadas</h4>
                  <p className="text-sm">{getUsedStandardsDisplay()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Data da última atualização</h4>
                  <p className="text-sm">{formatDate(fund.last_update_date)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          {(fund.description || fund.location || fund.observations) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-700">📋 Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fund.description && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Descrição</h4>
                    <p className="text-sm whitespace-pre-wrap">{fund.description}</p>
                  </div>
                )}

                {fund.location && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Localização</h4>
                    <p className="text-sm">{fund.location}</p>
                  </div>
                )}

                {fund.observations && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Observações</h4>
                    <p className="text-sm whitespace-pre-wrap">{fund.observations}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
