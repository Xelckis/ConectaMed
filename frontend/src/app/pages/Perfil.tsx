import { User, Calendar, Heart, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { mockPatients, mockAppointments } from '../data/mockData';
import { parseISO, isAfter, isBefore, differenceInYears } from 'date-fns';

export function Perfil() {
  const patient = mockPatients[0];
  const now = new Date();

  const patientAppointments = mockAppointments.filter(apt => apt.patientId === patient.id);
  const upcomingCount = patientAppointments.filter(apt =>
    apt.status === 'scheduled' && isAfter(parseISO(apt.date), now)
  ).length;
  const completedCount = patientAppointments.filter(apt => apt.status === 'completed').length;

  const specialtiesCount = new Set(
    patientAppointments.map(apt => apt.specialty)
  ).size;

  const recentAppointments = patientAppointments
    .filter(apt => apt.status === 'completed')
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Perfil do Paciente</h1>
        <p className="text-muted-foreground mt-1">
          Informações e histórico do paciente
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar size="xl" fallback={patient.name} className="w-24 h-24 text-2xl" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">{patient.name}</h2>
                <p className="text-muted-foreground">{patient.age} anos</p>
              </div>
              <div className="w-full pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="success">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Responsáveis</span>
                  <span className="text-sm font-medium">{patient.responsibleIds.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Próximas</p>
                    <p className="text-3xl font-bold text-foreground">{upcomingCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">Consultas</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Realizadas</p>
                    <p className="text-3xl font-bold text-foreground">{completedCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total</p>
                  </div>
                  <div className="p-3 rounded-lg bg-success/10">
                    <Clock className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Especialidades</p>
                    <p className="text-3xl font-bold text-foreground">{specialtiesCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">Diferentes</p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Heart className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nome Completo</p>
                  <p className="font-medium text-foreground">{patient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Idade</p>
                  <p className="font-medium text-foreground">{patient.age} anos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimas Consultas</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma consulta realizada ainda
                </p>
              ) : (
                <div className="space-y-3">
                  {recentAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{apt.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(apt.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline">{apt.specialty}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
