
import { useState, useEffect } from "react";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { useOrganization } from "@/hooks/useOrganization";
import { useOrganizationSectors } from "@/hooks/useOrganizationSectors";
import { useOrganizationTeam } from "@/hooks/useOrganizationTeam";
import { useArchivalFunds } from "@/hooks/useArchivalFunds";
import { useAuthorities } from "@/hooks/useAuthorities";
import { useArchiveSectorData, type ArchiveSectorData } from "@/hooks/useArchiveSectorData";
import { OrganizationTabs } from "./OrganizationTabs";
import { OrganizationInfoModal } from "./OrganizationInfoModal";
import { ArchiveSectorModal } from "./ArchiveSectorModal";
import { SectorModal } from "./SectorModal";
import { SectorImportModal } from "./SectorImportModal";
import { TeamMemberModal } from "./TeamMemberModal";
import { ArchivalFundModal } from "./ArchivalFundModal";
import { ArchivalFundViewModal } from "./ArchivalFundViewModal";
import { AuthorityModal } from "./AuthorityModal";
import { AuthorityViewModal } from "./AuthorityViewModal";

export default function Organization() {
  const { currentOrganization, loading: contextLoading, availableOrganizations } = useOrganizationContext();
  
  console.log('🏛️ Organization Component - Current State:', {
    currentOrganization: currentOrganization?.name || 'null',
    contextLoading,
    availableOrganizationsCount: availableOrganizations.length
  });
  
  // Só usar os hooks se tivermos uma organização válida
  const organizationId = currentOrganization?.id;
  
  const { organization, loading: orgLoading, updateOrganization } = useOrganization(organizationId || '');
  
  // Hooks para buscar dados reais do banco - só se tivermos organização válida
  const { sectors, loading: sectorsLoading, createSector, updateSector, deleteSector, importSectors } = useOrganizationSectors(organizationId || '');
  const { team, loading: teamLoading, createTeamMember, updateTeamMember, deleteTeamMember } = useOrganizationTeam(organizationId || '');
  const { funds, loading: fundsLoading, createFund, updateFund, deleteFund } = useArchivalFunds(organizationId || '');
  const { authorities, loading: authoritiesLoading, createAuthority, updateAuthority, deleteAuthority } = useAuthorities(organizationId || '');
  
  // Hook para dados específicos do setor de arquivo - simplificado
  const { fetchArchiveSectorData, createArchiveSectorData, updateArchiveSectorData } = useArchiveSectorData(organizationId);

  // Estados baseados nos dados reais da organização - inicializar vazio
  const [organizationInfo, setOrganizationInfo] = useState({
    name: '',
    acronym: '',
    cnpj: '',
    address: '',
    phone: '',
    email: ''
  });

  // Estado para dados do setor de arquivo vindos da nova tabela
  const [archiveSectorInfo, setArchiveSectorInfo] = useState<ArchiveSectorData>({
    manager: '',
    location: '',
    workingHours: '',
    teamSize: '',
    storageCapacity: ''
  });

  // Estado para o setor atual do banco
  const [currentArchiveSector, setCurrentArchiveSector] = useState<any>(null);
  const [archiveSectorLoading, setArchiveSectorLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  
  // Modal states
  const [organizationInfoModalOpen, setOrganizationInfoModalOpen] = useState(false);
  const [archiveSectorModalOpen, setArchiveSectorModalOpen] = useState(false);
  const [sectorModalOpen, setSectorModalOpen] = useState(false);
  const [sectorImportModalOpen, setSectorImportModalOpen] = useState(false);
  const [teamMemberModal, setTeamMemberModal] = useState({
    isOpen: false,
    editingMember: null as any
  });
  const [archivalFundModalOpen, setArchivalFundModalOpen] = useState(false);
  const [archivalFundViewModalOpen, setArchivalFundViewModalOpen] = useState(false);
  const [authorityModalOpen, setAuthorityModalOpen] = useState(false);
  const [authorityViewModalOpen, setAuthorityViewModalOpen] = useState(false);
  
  // Editing states
  const [editingSector, setEditingSector] = useState(null);
  const [editingFund, setEditingFund] = useState(null);
  const [viewingFund, setViewingFund] = useState(null);
  const [editingAuthority, setEditingAuthority] = useState(null);
  const [viewingAuthority, setViewingAuthority] = useState(null);

  // Atualizar dados quando a organização mudar
  useEffect(() => {
    console.log('🔄 Organization useEffect - currentOrganization:', currentOrganization);
    console.log('🔄 Organization useEffect - organization from DB:', organization);
    
    if (organization) {
      console.log('✅ Loading organization data from database');
      setOrganizationInfo({
        name: organization.name || '',
        acronym: organization.acronym || '',
        cnpj: organization.cnpj || '',
        address: organization.address || '',
        phone: organization.contact_phone || '',
        email: organization.contact_email || ''
      });
    } else if (currentOrganization) {
      console.log('✅ Using organization data from context');
      setOrganizationInfo({
        name: currentOrganization.name || '',
        acronym: currentOrganization.acronym || '',
        cnpj: currentOrganization.cnpj || '',
        address: currentOrganization.address || '',
        phone: currentOrganization.contact_phone || '',
        email: currentOrganization.contact_email || ''
      });
    }
  }, [organization, currentOrganization]);

  // Carregar dados do setor de arquivo apenas uma vez por organização
  useEffect(() => {
    if (!organizationId) {
      console.log('Organization: No organizationId, clearing archive data');
      setCurrentArchiveSector(null);
      setArchiveSectorInfo({
        manager: '',
        location: '',
        workingHours: '',
        teamSize: '',
        storageCapacity: ''
      });
      return;
    }

    const loadArchiveSectorData = async () => {
      setArchiveSectorLoading(true);
      try {
        console.log('Organization: Loading archive sector data for organization:', organizationId);
        const sector = await fetchArchiveSectorData();
        
        if (sector) {
          console.log('Organization: Found archive sector data:', sector);
          setCurrentArchiveSector(sector);
          setArchiveSectorInfo({
            manager: sector.manager || '',
            location: sector.location || '',
            workingHours: sector.working_hours || '',
            teamSize: sector.team_size || '',
            storageCapacity: sector.storage_capacity || ''
          });
        } else {
          console.log('Organization: No archive sector data found');
          setCurrentArchiveSector(null);
          setArchiveSectorInfo({
            manager: '',
            location: '',
            workingHours: '',
            teamSize: '',
            storageCapacity: ''
          });
        }
      } catch (error) {
        console.error('Organization: Error loading archive sector data:', error);
        setCurrentArchiveSector(null);
        setArchiveSectorInfo({
          manager: '',
          location: '',
          workingHours: '',
          teamSize: '',
          storageCapacity: ''
        });
      } finally {
        setArchiveSectorLoading(false);
      }
    };

    loadArchiveSectorData();
  }, [organizationId]);

  const loading = contextLoading || orgLoading;

  console.log('🎯 Organization Component - Final State:', {
    loading,
    currentOrganization: currentOrganization?.name,
    organizationInfo: organizationInfo.name,
    sectorsCount: sectors?.length || 0,
    teamCount: team?.length || 0,
    fundsCount: funds?.length || 0,
    authoritiesCount: authorities?.length || 0,
    archiveSectorExists: !!currentArchiveSector
  });

  // Mostrar loading enquanto carrega o contexto
  if (contextLoading) {
    console.log('⏳ Showing context loading...');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15AB92] mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando organização...</p>
        </div>
      </div>
    );
  }

  // Se não há organização selecionada, mostrar mensagem mais específica
  if (!currentOrganization) {
    console.log('❌ No current organization, showing message...');
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Nenhuma organização disponível
          </h3>
          <p className="text-yellow-700 mb-4">
            {availableOrganizations.length === 0 
              ? "Não foi possível encontrar organizações que você possa acessar."
              : "Aguarde enquanto carregamos suas organizações..."
            }
          </p>
          <div className="text-sm text-yellow-600">
            Organizações disponíveis: {availableOrganizations.length}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Debug: contextLoading={contextLoading.toString()}, orgLoading={orgLoading.toString()}
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering organization page for:', currentOrganization.name);

  // Handler para salvar informações da organização no banco - CORRIGIDO
  const handleSaveOrganizationInfo = async (data: any): Promise<void> => {
    if (!organizationId) {
      console.error('Não é possível salvar: ID da organização não encontrado');
      throw new Error('ID da organização não encontrado');
    }

    console.log('💾 Saving organization info:', data);

    try {
      const updatedOrg = await updateOrganization({
        name: data.name,
        acronym: data.acronym,
        cnpj: data.cnpj,
        address: data.address,
        contact_phone: data.phone,
        contact_email: data.email
      });

      if (updatedOrg) {
        console.log('✅ Organization info saved successfully:', updatedOrg);
        setOrganizationInfo(data);
      } else {
        console.error('❌ Failed to save organization info');
        throw new Error('Falha ao salvar informações da organização');
      }
    } catch (error) {
      console.error('❌ Error saving organization info:', error);
      throw error;
    }
  };

  // Handler para salvar dados do setor de arquivo na nova tabela - CORRIGIDO
  const handleSaveArchiveSector = async (data: ArchiveSectorData): Promise<void> => {
    if (!organizationId) {
      console.error('Não é possível salvar setor de arquivo: ID da organização não encontrado');
      throw new Error('ID da organização não encontrado');
    }

    console.log('💾 Saving archive sector data:', data);
    console.log('💾 Current archive sector:', currentArchiveSector);
    
    try {
      let result;
      if (currentArchiveSector && currentArchiveSector.id) {
        console.log('🔄 Updating existing archive sector:', currentArchiveSector.id);
        result = await updateArchiveSectorData(currentArchiveSector.id, data);
      } else {
        console.log('➕ Creating new archive sector');
        result = await createArchiveSectorData(data);
      }

      if (result) {
        console.log('✅ Archive sector saved successfully:', result);
        setCurrentArchiveSector(result);
        setArchiveSectorInfo(data);
      } else {
        console.error('❌ Failed to save archive sector');
        throw new Error('Falha ao salvar dados do setor de arquivo');
      }
    } catch (error) {
      console.error('❌ Error saving archive sector:', error);
      throw error;
    }
  };

  // Dados organizados para o componente de tabs
  const organizationData = {
    organizationId: currentOrganization.id,
    organizationInfo,
    archiveSectorInfo,
    sectors: sectors || [],
    team: team || [],
    funds: funds || [],
    authorities: authorities || [],
    organizationName: organizationInfo.name,
    onEditOrganization: () => setOrganizationInfoModalOpen(true),
    onEditArchiveSector: () => setArchiveSectorModalOpen(true),
    createFund,
    updateFund,
    deleteFund,
    onCreateAuthority: () => setAuthorityModalOpen(true),
    onEditAuthority: (authority: any) => {
      setEditingAuthority(authority);
      setAuthorityModalOpen(true);
    },
    onDeleteAuthority: deleteAuthority,
    onViewAuthority: (authority: any) => {
      setViewingAuthority(authority);
      setAuthorityViewModalOpen(true);
    },
    onCreateMember: () => setTeamMemberModal({ isOpen: true, editingMember: null }),
    onEditMember: (member: any) => setTeamMemberModal({ isOpen: true, editingMember: member }),
    onDeleteMember: deleteTeamMember,
    onCreateSector: () => setSectorModalOpen(true),
    onEditSector: (sector: any) => {
      setEditingSector(sector);
      setSectorModalOpen(true);
    },
    onDeleteSector: deleteSector,
    onImportSectors: () => setSectorImportModalOpen(true),
    onEditFund: (fund: any) => {
      setEditingFund(fund);
      setArchivalFundModalOpen(true);
    },
    onViewFund: (fund: any) => {
      setViewingFund(fund);
      setArchivalFundViewModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {organizationInfo.name || 'Organização'}
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Gestão de informações organizacionais e arquivo</p>
          </div>
        </div>

        <OrganizationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          organizationData={organizationData}
        />
      </div>

      <OrganizationInfoModal
        isOpen={organizationInfoModalOpen}
        onClose={() => setOrganizationInfoModalOpen(false)}
        onSave={handleSaveOrganizationInfo}
        currentData={organizationInfo}
      />

      <ArchiveSectorModal
        isOpen={archiveSectorModalOpen}
        onClose={() => setArchiveSectorModalOpen(false)}
        onSave={handleSaveArchiveSector}
        currentData={archiveSectorInfo}
      />

      <SectorModal
        isOpen={sectorModalOpen}
        onClose={() => {
          setSectorModalOpen(false);
          setEditingSector(null);
        }}
        onSave={async (data) => {
          if (editingSector) {
            await updateSector(editingSector.id, data);
          } else {
            await createSector(data);
          }
          setSectorModalOpen(false);
          setEditingSector(null);
        }}
        editingSector={editingSector}
        organizationId={currentOrganization.id}
        sectors={sectors || []}
      />

      <SectorImportModal
        isOpen={sectorImportModalOpen}
        onClose={() => setSectorImportModalOpen(false)}
        onImport={async (data) => {
          await importSectors(data);
          setSectorImportModalOpen(false);
        }}
      />

      <TeamMemberModal
        isOpen={teamMemberModal.isOpen}
        onClose={() => setTeamMemberModal({ isOpen: false, editingMember: null })}
        onSave={async (data) => {
          if (teamMemberModal.editingMember) {
            await updateTeamMember(teamMemberModal.editingMember.id, data);
          } else {
            await createTeamMember(data);
          }
          setTeamMemberModal({ isOpen: false, editingMember: null });
        }}
        editingMember={teamMemberModal.editingMember}
        organizationId={currentOrganization.id}
      />

      <ArchivalFundModal
        isOpen={archivalFundModalOpen}
        onClose={() => {
          setArchivalFundModalOpen(false);
          setEditingFund(null);
        }}
        onSave={async (data) => {
          if (editingFund) {
            await updateFund(editingFund.id, data);
          } else {
            await createFund(data);
          }
          setArchivalFundModalOpen(false);
          setEditingFund(null);
        }}
        editingFund={editingFund}
        organizationId={currentOrganization.id}
      />

      <ArchivalFundViewModal
        isOpen={archivalFundViewModalOpen}
        onClose={() => {
          setArchivalFundViewModalOpen(false);
          setViewingFund(null);
        }}
        fund={viewingFund}
      />

      <AuthorityModal
        isOpen={authorityModalOpen}
        onClose={() => {
          setAuthorityModalOpen(false);
          setEditingAuthority(null);
        }}
        onSave={async (data) => {
          if (editingAuthority) {
            return await updateAuthority(editingAuthority.id, data);
          } else {
            return await createAuthority(data);
          }
        }}
        editingAuthority={editingAuthority}
        organizationId={currentOrganization.id}
        onImageUpload={async () => ""}
        onImageDelete={async () => {}}
      />

      <AuthorityViewModal
        isOpen={authorityViewModalOpen}
        onClose={() => {
          setAuthorityViewModalOpen(false);
          setViewingAuthority(null);
        }}
        authority={viewingAuthority}
      />
    </div>
  );
}
