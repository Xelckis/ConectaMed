import { Calendar, Clock, MapPin, Plus, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { mockAppointments, mockPatients, mockUsers } from '../data/mockData';
import { useNavigate } from 'react-router';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Dashboard() {
  const navigate = useNavigate();
  const now = new Date();
  const weekFromNow = addDays(now, 7);

  const upcomingAppointments = mockAppointments
    .filter(apt => {
      const aptDate = parseISO(apt.date);
      return apt.status === 'scheduled' && isAfter(aptDate, now);
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3);

  const thisWeekAppointments = mockAppointments.filter(apt => {
    const aptDate = parseISO(apt.date);
    return apt.status === 'scheduled' &&
           isAfter(aptDate, now) &&
           isBefore(aptDate, weekFromNow);
  });

  const completedThisMonth = mockAppointments.filter(apt => {
    const aptDate = parseISO(apt.date);
    return apt.status === 'completed' &&
           aptDate.getMonth() === now.getMonth() &&
           aptDate.getFullYear() === now.getFullYear();
  });

  const stats = [
    {
      title: 'Próximas Consultas',
      value: thisWeekAppointments.length,
      subtitle: 'Esta semana',
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Consultas Realizadas',
      value: completedThisMonth.length,
      subtitle: 'Este mês',
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Pacientes',
      value: mockPatients.length,
      subtitle: 'Acompanhados',
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo(a) ao seu painel de acompanhamento médico
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/agenda')}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Consulta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximas Consultas</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/agenda')}>
              Ver todas
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma consulta agendada</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/agenda')}
                >
                  Agendar consulta
                </Button>
              </div>
            ) : (
              upcomingAppointments.map((apt) => {
                const patient = mockPatients.find(p => p.id === apt.patientId);
                const aptDate = parseISO(apt.date);

                return (
                  <div
                    key={apt.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors cursor-pointer"
                    onClick={() => navigate('/agenda')}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {format(aptDate, 'MMM', { locale: ptBR }).toUpperCase()}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {format(aptDate, 'd')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{apt.title}</h4>
                        <Badge variant="primary">{apt.specialty}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{apt.startTime} - {apt.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{apt.location}</span>
                        </div>
                      </div>
                      {patient && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar size="sm" fallback={patient.name} />
                          <span className="text-sm text-muted-foreground">{patient.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pacientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                  onClick={() => navigate('/perfil')}
                >
                  <Avatar size="md" fallback={patient.name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.age} anos</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rede de Apoio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar size="sm" fallback={user.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => navigate('/rede-apoio')}
              >
                Ver todos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
