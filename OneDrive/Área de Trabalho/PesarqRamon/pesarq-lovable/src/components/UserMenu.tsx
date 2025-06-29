
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileModal } from "./UserProfileModal";
import { UserSettingsModal } from "./UserSettingsModal";

export function UserMenu() {
  const { userProfile, signOut } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  if (!userProfile) return null;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'unb_admin':
        return 'Admin UnB';
      case 'unb_researcher':
        return 'Pesquisador UnB';
      case 'partner_admin':
        return 'Admin Parceiro';
      case 'partner_user':
        return 'Usuário Parceiro';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'unb_admin':
        return 'bg-purple-100 text-purple-800';
      case 'unb_researcher':
        return 'bg-blue-100 text-blue-800';
      case 'partner_admin':
        return 'bg-green-100 text-green-800';
      case 'partner_user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleProfileClick = () => {
    console.log('🔍 UserMenu: Abrindo modal de perfil');
    setShowProfileModal(true);
  };

  const handleSettingsClick = () => {
    console.log('⚙️ UserMenu: Abrindo modal de configurações');
    setShowSettingsModal(true);
  };

  const handleSignOut = () => {
    console.log('👋 UserMenu: Fazendo logout');
    signOut();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={userProfile.avatar_url} 
                alt={userProfile.name}
                onError={() => {
                  console.log('❌ UserMenu: Erro ao carregar avatar');
                }}
                onLoad={() => {
                  console.log('✅ UserMenu: Avatar carregado');
                }}
              />
              <AvatarFallback className="bg-[#15AB92] text-white">
                {getInitials(userProfile.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium leading-none">
                {userProfile.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {userProfile.email}
              </p>
              {userProfile.position && (
                <p className="text-xs leading-none text-muted-foreground">
                  {userProfile.position}
                </p>
              )}
              <Badge 
                variant="secondary" 
                className={`w-fit text-xs ${getRoleColor(userProfile.role)}`}
              >
                {getRoleLabel(userProfile.role)}
              </Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          console.log('❌ UserMenu: Fechando modal de perfil');
          setShowProfileModal(false);
        }}
      />

      <UserSettingsModal
        isOpen={showSettingsModal}
        onClose={() => {
          console.log('❌ UserMenu: Fechando modal de configurações');
          setShowSettingsModal(false);
        }}
      />
    </>
  );
}
