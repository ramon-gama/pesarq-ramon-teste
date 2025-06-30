
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Calendar, Save, Camera, Upload, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { userProfile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    position: '',
    bio: '',
    avatar_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    console.log('📝 UserProfileModal: Modal aberto, dados do usuário:', userProfile);
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        position: userProfile.position || '',
        bio: userProfile.bio || '',
        avatar_url: userProfile.avatar_url || ''
      });
    }
  }, [userProfile, isOpen]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userProfile) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      console.log('📸 UserProfileModal: Iniciando upload de avatar');

      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${userProfile.id}/avatar-${Date.now()}.${fileExt}`;

      // Upload do arquivo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('❌ UserProfileModal: Erro no upload:', uploadError);
        throw uploadError;
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = urlData.publicUrl;
      console.log('✅ UserProfileModal: Avatar carregado:', avatarUrl);

      // Atualizar apenas a URL do avatar no estado local
      setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
      
      // Atualizar perfil no banco de dados
      const result = await updateProfile({ avatar_url: avatarUrl });
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Foto de perfil atualizada com sucesso",
        });
      }

    } catch (error: any) {
      console.error('💥 UserProfileModal: Erro no upload:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('💾 UserProfileModal: Salvando dados:', formData);
    setIsSubmitting(true);

    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        console.log('✅ UserProfileModal: Perfil atualizado com sucesso');
        onClose();
      } else {
        console.error('❌ UserProfileModal: Erro ao atualizar:', result.error);
      }
    } catch (error) {
      console.error('💥 UserProfileModal: Erro inesperado:', error);
    }
    
    setIsSubmitting(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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

  if (!userProfile) {
    console.log('⚠️ UserProfileModal: Sem dados do usuário');
    return null;
  }

  console.log('🎨 UserProfileModal: Renderizando modal, isOpen:', isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Usuário
          </DialogTitle>
          <DialogDescription>
            Gerencie suas informações pessoais e preferências
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="info">Informações</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={formData.avatar_url} 
                    alt={userProfile.name}
                    onError={(e) => {
                      console.error('❌ Erro ao carregar avatar:', e);
                    }}
                    onLoad={() => {
                      console.log('✅ Avatar carregado com sucesso');
                    }}
                  />
                  <AvatarFallback className="bg-[#15AB92] text-white text-lg">
                    {getInitials(userProfile.name)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Input de upload escondido */}
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                
                {/* Botão de upload */}
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Camera className="h-3 w-3" />
                  )}
                </Button>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                <Badge 
                  variant="secondary" 
                  className={`w-fit ${getRoleColor(userProfile.role)}`}
                >
                  {getRoleLabel(userProfile.role)}
                </Badge>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo/Posição</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Seu cargo ou posição"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Conte um pouco sobre você..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Informações da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                    </div>
                  </div>

                  {userProfile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Telefone</p>
                        <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
                      </div>
                    </div>
                  )}

                  {userProfile.position && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Cargo</p>
                        <p className="text-sm text-muted-foreground">{userProfile.position}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Membro desde</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(userProfile.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {userProfile.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Biografia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
