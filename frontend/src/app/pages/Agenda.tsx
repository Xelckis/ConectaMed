import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPatients, getPatientAppointments, createAppointment, updateAppointment, deleteAppointment } from '../../lib/api';
import { Appointment, Patient } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';

export function Agenda() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para o Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  async function loadAgenda() {
    if (!token) return;
    try {
      setIsLoading(true);
      const patients = await getPatients(token);
      if (patients.length > 0) {
        const activePatient = patients[0];
        setPatient(activePatient);
        const data = await getPatientAppointments(token, activePatient.id);
        setAppointments(data);
      }
    } catch (error) {
      console.error("Erro ao carregar agenda:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAgenda();
  }, [token]);

  const resetForm = () => {
    setEditingAppId(null);
    setTitle('');
    setSpecialty('');
    setLocation('');
    setStartTime('');
    setEndTime('');
    setModalError('');
    setIsModalOpen(false);
  };

  const handleOpenNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: Appointment) => {
    setEditingAppId(app.id);
    setTitle(app.title);
    setSpecialty(app.specialty || '');
    setLocation(app.location || '');
    // Ajuste para o input datetime-local (formato YYYY-MM-DDTHH:mm)
    setStartTime(new Date(app.startTime).toISOString().slice(0, 16));
    setEndTime(new Date(app.endTime).toISOString().slice(0, 16));
    setModalError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (appId: string) => {
    if (!token) return;
    if (!window.confirm("Tem a certeza que deseja cancelar esta consulta?")) return;
    
    try {
      await deleteAppointment(token, appId);
      await loadAgenda();
    } catch (err: any) {
      alert(err.message || 'Erro ao cancelar. Você não tem permissão para excluir este evento.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !patient) return;

    setModalError('');
    if (new Date(endTime) <= new Date(startTime)) {
      setModalError('O horário de término deve ser posterior ao horário de início.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        title,
        specialty,
        location,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      };

      if (editingAppId) {
        await updateAppointment(token, editingAppId, payload);
      } else {
        await createAppointment(token, {
          ...payload,
          patient_id: patient.id,
          can_edit_user_ids: []
        });
      }

      resetForm();
      await loadAgenda();
    } catch (err: any) {
      setModalError(err.message || 'Erro ao processar consulta. Verifique os dados ou as suas permissões.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8"><Skeleton className="h-64 w-full max-w-2xl" /></div>;
  if (!patient) return <div className="p-8 text-slate-500">Vá ao Dashboard e cadastre um paciente primeiro.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto relative min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Agenda Médica</h1>
          <p className="text-slate-500 mt-2">A visualizar a agenda de: <strong className="text-slate-700">{patient.name}</strong></p>
        </div>
        <Button onClick={handleOpenNew}>+ Nova Consulta</Button>
      </div>

      {appointments.length === 0 ? (
        <Card className="bg-slate-50 border-dashed">
          <CardContent className="p-8 text-center text-slate-500">
            Não há consultas agendadas para este paciente.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <Card key={app.id} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">{app.title}</h2>
                  <p className="text-slate-600">{app.specialty} {app.location && `• ${app.location}`}</p>
                  
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(app)}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(app.id)}>Cancelar</Button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-700">
                    {new Date(app.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} 
                    {' - '} 
                    {new Date(app.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date(app.startTime).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle>{editingAppId ? 'Editar Consulta' : 'Agendar Nova Consulta'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {modalError && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {modalError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Especialidade</label>
                  <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Local</label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Início</label>
                    <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Término</label>
                    <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'A processar...' : 'Confirmar'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

