import { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight, Grid3x3, List } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { mockAppointments, mockPatients, mockUsers } from '../data/mockData';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'list'>('month');
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const scheduledAppointments = mockAppointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const getAppointmentsForDay = (day: Date) => {
    return mockAppointments.filter(apt =>
      isSameDay(parseISO(apt.date), day) && apt.status === 'scheduled'
    );
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas consultas e compromissos médicos
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsNewAppointmentOpen(true)}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Consulta
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === 'month' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setView('month')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {view === 'month' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: monthStart.getDay() }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}
              {daysInMonth.map((day) => {
                const dayAppointments = getAppointmentsForDay(day);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toString()}
                    className={`
                      aspect-square p-2 rounded-lg border transition-colors cursor-pointer
                      ${isToday ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/5'}
                      ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                    `}
                    onClick={() => {
                      setSelectedDate(day);
                      setIsNewAppointmentOpen(true);
                    }}
                  >
                    <div className="text-sm font-medium text-foreground mb-1">
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((apt) => (
                        <div
                          key={apt.id}
                          className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                        >
                          {apt.startTime} {apt.specialty}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayAppointments.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma consulta agendada</p>
              </div>
            ) : (
              scheduledAppointments.map((apt) => {
                const patient = mockPatients.find(p => p.id === apt.patientId);
                const aptDate = parseISO(apt.date);

                return (
                  <div
                    key={apt.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {format(aptDate, 'MMM', { locale: ptBR }).toUpperCase()}
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {format(aptDate, 'd')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-foreground text-lg">{apt.title}</h4>
                        <Badge variant="primary">{apt.specialty}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{apt.startTime} - {apt.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{apt.location}</span>
                        </div>
                      </div>
                      {apt.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{apt.notes}</p>
                      )}
                      {patient && (
                        <div className="flex items-center gap-2 mt-3">
                          <Avatar size="sm" fallback={patient.name} />
                          <span className="text-sm text-muted-foreground">{patient.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </Card>

      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => {
          setIsNewAppointmentOpen(false);
          setSelectedDate(null);
        }}
        defaultDate={selectedDate}
      />
    </div>
  );
}

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date | null;
}

function NewAppointmentModal({ isOpen, onClose, defaultDate }: NewAppointmentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    specialty: '',
    location: '',
    date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
    startTime: '',
    endTime: '',
    notes: '',
    patientId: mockPatients[0]?.id || '',
    participants: [] as string[],
  });

  const specialties = [
    { value: '', label: 'Selecione a especialidade' },
    { value: 'Cardiologia', label: 'Cardiologia' },
    { value: 'Ortopedia', label: 'Ortopedia' },
    { value: 'Oftalmologia', label: 'Oftalmologia' },
    { value: 'Geriatria', label: 'Geriatria' },
    { value: 'Neurologia', label: 'Neurologia' },
    { value: 'Dermatologia', label: 'Dermatologia' },
    { value: 'Laboratório', label: 'Exames Laboratoriais' },
    { value: 'Outro', label: 'Outro' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Consulta" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Título da consulta"
          placeholder="Ex: Consulta Cardiologia"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <Select
          label="Especialidade"
          options={specialties}
          value={formData.specialty}
          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
          required
        />

        <Select
          label="Paciente"
          options={[
            { value: '', label: 'Selecione o paciente' },
            ...mockPatients.map(p => ({ value: p.id, label: p.name }))
          ]}
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          required
        />

        <Input
          label="Local"
          placeholder="Ex: Hospital São Lucas - Sala 304"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            type="date"
            label="Data"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Input
            type="time"
            label="Início"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
          <Input
            type="time"
            label="Término"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>

        <Textarea
          label="Observações"
          placeholder="Adicione informações relevantes sobre a consulta"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Salvar Consulta
          </Button>
        </div>
      </form>
    </Modal>
  );
}
