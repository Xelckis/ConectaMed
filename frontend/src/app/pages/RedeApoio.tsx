import { useState } from 'react';
import { UserPlus, Mail, Shield, User as UserIcon, MoreVertical, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { mockUsers, mockNetworkMembers } from '../data/mockData';

export function RedeApoio() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const activeMembers = mockNetworkMembers
    .filter(m => m.status === 'active')
    .map(m => {
      const user = mockUsers.find(u => u.id === m.userId);
      return { ...m, user };
    })
    .filter(m => m.user);

  const pendingInvites = mockNetworkMembers
    .filter(m => m.status === 'pending')
    .map(m => {
      const user = mockUsers.find(u => u.id === m.userId);
      return { ...m, user };
    })
    .filter(m => m.user);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviteModalOpen(false);
    setInviteEmail('');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rede de Apoio</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as pessoas que ajudam no cuidado
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsInviteModalOpen(true)}
          className="gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Convidar Membro
        </Button>
      </div>

      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Convites Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingInvites.map((member) => (
              <div
                key={member.userId}
                className="flex items-center gap-4 p-4 rounded-lg border border-border"
              >
                <Avatar size="md" fallback={member.user!.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{member.user!.name}</p>
                  <p className="text-sm text-muted-foreground">{member.user!.email}</p>
                </div>
                <Badge variant="warning">Pendente</Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Membros Ativos ({activeMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {activeMembers.length === 0 ? (
            <EmptyState
              icon={<UserIcon className="w-16 h-16" />}
              title="Nenhum membro ativo"
              description="Convide familiares e cuidadores para ajudar no acompanhamento"
              action={
                <Button variant="primary" onClick={() => setIsInviteModalOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Convidar Primeiro Membro
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMembers.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-start gap-4 p-5 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <Avatar size="lg" fallback={member.user!.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{member.user!.name}</h3>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{member.user!.email}</p>
                    <div className="flex items-center gap-2">
                      {member.role === 'ADMINISTRADOR' ? (
                        <Badge variant="primary" className="gap-1">
                          <Shield className="w-3 h-3" />
                          Administrador
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <UserIcon className="w-3 h-3" />
                          Membro
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Membro desde {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
          setInviteEmail('');
        }}
        title="Convidar Novo Membro"
        size="md"
      >
        <form onSubmit={handleInvite} className="space-y-5">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-foreground">
              O membro convidado poderá visualizar consultas e participar do acompanhamento médico.
              Você poderá definir permissões específicas depois.
            </p>
          </div>

          <Input
            type="email"
            label="Email do convidado"
            placeholder="email@exemplo.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsInviteModalOpen(false);
                setInviteEmail('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1 gap-2">
              <Mail className="w-4 h-4" />
              Enviar Convite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
