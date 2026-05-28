import { Calendar, Clock, MapPin, CheckCircle, Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { mockAppointments, mockPatients } from '../data/mockData';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

export function Historico() {
  const [searchTerm, setSearchTerm] = useState('');

  const completedAppointments = mockAppointments
    .filter(apt => apt.status === 'completed')
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

  const filteredAppointments = completedAppointments.filter(apt =>
    apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Histórico Médico</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe todas as consultas e exames realizados
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar no histórico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {filteredAppointments.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={<Calendar className="w-16 h-16" />}
            title="Nenhum registro encontrado"
            description={searchTerm ? "Tente ajustar sua busca" : "O histórico de consultas aparecerá aqui"}
          />
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(
            filteredAppointments.reduce((acc, apt) => {
              const year = format(parseISO(apt.date), 'yyyy');
              if (!acc[year]) acc[year] = [];
              acc[year].push(apt);
              return acc;
            }, {} as Record<string, typeof completedAppointments>)
          ).map(([year, appointments]) => (
            <div key={year}>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {year}
              </h2>
              <div className="relative border-l-2 border-border ml-6 space-y-8">
                {appointments.map((apt) => {
                  const patient = mockPatients.find(p => p.id === apt.patientId);
                  const aptDate = parseISO(apt.date);

                  return (
                    <div key={apt.id} className="relative pl-8 pb-8">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-success border-4 border-background" />

                      <Card className="hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-5 h-5 text-success" />
                                <h3 className="font-semibold text-lg text-foreground">
                                  {apt.title}
                                </h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {format(aptDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </p>
                            </div>
                            <Badge variant="success">{apt.specialty}</Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{apt.startTime} - {apt.endTime}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{apt.location}</span>
                            </div>
                          </div>

                          {apt.notes && (
                            <div className="mt-4 p-4 rounded-lg bg-muted/30">
                              <p className="text-sm text-foreground">{apt.notes}</p>
                            </div>
                          )}

                          {patient && (
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                              <Avatar size="sm" fallback={patient.name} />
                              <span className="text-sm text-muted-foreground">{patient.name}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
