import { Bell, Calendar, Users, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { mockNotifications } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Notificacoes() {
  const unreadNotifications = mockNotifications.filter(n => !n.read);
  const readNotifications = mockNotifications.filter(n => n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Bell className="w-5 h-5" />;
      case 'invite':
        return <Users className="w-5 h-5" />;
      case 'confirmation':
        return <CheckCircle className="w-5 h-5" />;
      case 'conflict':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'text-primary bg-primary/10';
      case 'invite':
        return 'text-accent bg-accent/10';
      case 'confirmation':
        return 'text-success bg-success/10';
      case 'conflict':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notificações</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe atualizações e lembretes importantes
          </p>
        </div>
        {mockNotifications.length > 0 && (
          <Button variant="outline" size="sm">
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {mockNotifications.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={<Bell className="w-16 h-16" />}
            title="Nenhuma notificação"
            description="Você está em dia! Novas notificações aparecerão aqui."
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {unreadNotifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Não lidas ({unreadNotifications.length})
              </h2>
              <div className="space-y-3">
                {unreadNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className="p-5 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <Badge variant="primary">Nova</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {readNotifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Anteriores</h2>
              <div className="space-y-3">
                {readNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className="p-5 hover:shadow-sm transition-shadow cursor-pointer opacity-75"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
