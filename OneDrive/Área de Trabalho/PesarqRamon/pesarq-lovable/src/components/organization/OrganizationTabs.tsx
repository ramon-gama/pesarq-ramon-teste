
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationOverview } from "./tabs/OrganizationOverview";
import { OrganizationTeam } from "./tabs/OrganizationTeam";
import { OrganizationStorage } from "./tabs/OrganizationStorage";
import { OrganizationSectors } from "./tabs/OrganizationSectors";
import { OrganizationFunds } from "./tabs/OrganizationFunds";
import { OrganizationAuthorities } from "./tabs/OrganizationAuthorities";

interface OrganizationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  organizationData: any;
}

export function OrganizationTabs({ activeTab, onTabChange, organizationData }: OrganizationTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="overflow-x-auto">
        <TabsList className="flex flex-wrap gap-1 h-auto bg-muted/50 p-2 w-full justify-center sm:justify-start">
          <TabsTrigger 
            value="overview" 
            className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md min-w-[80px] justify-center"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="team" 
            className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md min-w-[70px] justify-center"
          >
            Equipe
          </TabsTrigger>
          <TabsTrigger 
            value="storage" 
            className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md min-w-[100px] justify-center"
          >
            Armazenamento
          </TabsTrigger>
          <TabsTrigger 
            value="sectors" 
            className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md min-w-[70px] justify-center"
          >
            Setores
          </TabsTrigger>
          <TabsTrigger 
            value="funds" 
            className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md min-w-[70px] justify-center"
          >
            Fundos
          </TabsTrigger>
          <TabsTrigger 
            value="authorities" 
            className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md min-w-[90px] justify-center"
          >
            Autoridades
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-4 mt-4">
        <OrganizationOverview 
          organizationInfo={organizationData.organizationInfo}
          archiveSectorInfo={organizationData.archiveSectorInfo}
          funds={organizationData.funds}
          authorities={organizationData.authorities}
          team={organizationData.team}
          sectors={organizationData.sectors}
          organizationId={organizationData.organizationId}
          onEditOrganization={organizationData.onEditOrganization}
          onEditArchiveSector={organizationData.onEditArchiveSector}
        />
      </TabsContent>

      <TabsContent value="team" className="space-y-4 mt-4">
        <OrganizationTeam {...organizationData} />
      </TabsContent>

      <TabsContent value="storage" className="space-y-4 mt-4">
        <OrganizationStorage organizationId={organizationData.organizationId} />
      </TabsContent>

      <TabsContent value="sectors" className="space-y-4 mt-4">
        <OrganizationSectors {...organizationData} />
      </TabsContent>

      <TabsContent value="funds" className="space-y-4 mt-4">
        <OrganizationFunds 
          funds={organizationData.funds}
          organizationId={organizationData.organizationId}
          organizationName={organizationData.organizationName}
          onCreateFund={organizationData.createFund}
          onUpdateFund={organizationData.updateFund}
          onDeleteFund={organizationData.deleteFund}
        />
      </TabsContent>

      <TabsContent value="authorities" className="space-y-4 mt-4">
        <OrganizationAuthorities {...organizationData} />
      </TabsContent>
    </Tabs>
  );
}
