
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Star, MessageSquare, Trophy, Lock } from "lucide-react";

interface UserProfileCardProps {
  isDemo?: boolean;
}

export function UserProfileCard({ isDemo = false }: UserProfileCardProps) {
  if (isDemo) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil do Usuário
            <Lock className="h-3 w-3 text-orange-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center opacity-60">
            <Avatar className="h-16 w-16 mx-auto mb-3">
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">Faça Login</h3>
            <p className="text-sm text-muted-foreground">Para ver seu perfil</p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 font-medium text-center">
              🔓 Entre para participar da comunidade
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          Meu Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Avatar className="h-16 w-16 mx-auto mb-3">
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold">Ana Silva</h3>
          <p className="text-sm text-muted-foreground">Arquivista Sênior</p>
          <p className="text-xs text-muted-foreground">TRF-2ª Região</p>
        </div>
        
        <div className="flex justify-center">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            Reputação: 142
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Posts criados</span>
            <span className="font-medium">23</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Respostas dadas</span>
            <span className="font-medium">87</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Soluções aceitas</span>
            <span className="font-medium">34</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            Ver Perfil
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Trophy className="h-4 w-4 mr-1" />
            Conquistas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
