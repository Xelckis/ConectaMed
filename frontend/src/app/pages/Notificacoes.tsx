import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications, markNotificationAsRead } from '../../lib/api';
import { Notification } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

export function Notificacoes() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadNotifications() {
    if (!token) return;
    try {
      setIsLoading(true);
      const data = await getNotifications(token);
      setNotifications(data);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadNotifications(); }, [token]);

  const handleRead = async (id: string) => {
    if (!token) return;
    try {
      await markNotificationAsRead(token, id);
      // Atualiza localmente para ser mais rápido
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  if (isLoading) return <div className="p-8"><Skeleton className="h-64 w-full max-w-2xl" /></div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Notificações</h1>

      {notifications.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Não tens nenhuma notificação.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <Card key={notif.id} className={`transition-colors ${notif.read ? 'bg-slate-50 opacity-75' : 'bg-white border-l-4 border-l-blue-500'}`}>
              <CardContent className="p-6 flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{notif.title}</h3>
                  <p className="text-slate-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(notif.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                {!notif.read && (
                  <Button variant="outline" size="sm" onClick={() => handleRead(notif.id)}>
                    Marcar como Lida
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

