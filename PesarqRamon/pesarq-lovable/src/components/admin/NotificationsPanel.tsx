
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Eye, Mail, RefreshCw } from "lucide-react";
import { useNotifications, type SystemNotification } from "@/hooks/useNotifications";

export function NotificationsPanel() {
  const { notifications, loading, loadNotifications, markAsRead } = useNotifications();
  const [showAll, setShowAll] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.sent);
  const displayNotifications = showAll ? notifications : notifications.slice(0, 10);

  const getNotificationIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'access_request_created':
        return <Mail className="h-4 w-4" />;
      case 'access_request_approved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'access_request_rejected':
        return <Bell className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: SystemNotification['type']) => {
    switch (type) {
      case 'access_request_approved':
        return 'bg-green-100 text-green-800';
      case 'access_request_rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-gray-600">Carregando notificações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Notificações
          </h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe as notificações do sistema
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary">
            {unreadNotifications.length} não lidas
          </Badge>
          <Button onClick={loadNotifications} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadNotifications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Solicitações Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter(n => 
                n.type === 'access_request_created' && 
                new Date(n.created_at).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Notificações */}
      <Card>
        <CardHeader>
          <CardTitle>Notificações Recentes</CardTitle>
          <CardDescription>
            Lista das notificações mais recentes do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma notificação encontrada
              </h3>
              <p className="text-gray-600">
                As notificações do sistema aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.sent ? 'bg-gray-50' : 'bg-white border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge className={getNotificationColor(notification.type)}>
                            {notification.type === 'access_request_created' && 'Nova Solicitação'}
                            {notification.type === 'access_request_approved' && 'Aprovada'}
                            {notification.type === 'access_request_rejected' && 'Rejeitada'}
                          </Badge>
                          {!notification.sent && (
                            <Badge variant="destructive" className="text-xs">
                              Nova
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Para: {notification.recipient_email}</span>
                          <span>{formatDate(notification.created_at)}</span>
                          {notification.sent_at && (
                            <span>Lida em: {formatDate(notification.sent_at)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {!notification.sent && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {notifications.length > 10 && !showAll && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAll(true)}
                  >
                    Ver Todas as Notificações ({notifications.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
