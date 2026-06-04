import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPatients, createPatient } from '../../lib/api';
import { Patient } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';

export function Dashboard() {
  const { token } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para o Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadDashboard() {
    if (!token) return;
    try {
      setIsLoading(true);
      setError('');
      const data = await getPatients(token);
      setPatients(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pacientes');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setIsSubmitting(true);
      // Chama a API em Go
      await createPatient(token, {
        name: newName,
        date_of_birth: newDob, // O input de data já devolve "YYYY-MM-DD"
      });
      
      // Limpa os campos e fecha o modal
      setNewName('');
      setNewDob('');
      setIsModalOpen(false);
      
      // Recarrega a lista para mostrar o novo paciente criado
      await loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Erro ao cadastrar paciente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-32 w-full max-w-md" />
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
    );
  }

  return (
    <div className="p-8 relative min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Meus Pacientes</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Novo Paciente</Button>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {patients.length === 0 && !error ? (
        <Card className="max-w-md bg-slate-50 border-dashed">
          <CardContent className="p-8 text-center text-slate-500">
            <p className="mb-4">Nenhum paciente cadastrado ainda.</p>
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>Cadastre seu primeiro paciente</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <Card key={patient.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-slate-700">{patient.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">
                  Data de Nasc: {new Date(patient.date_of_birth || patient.createdAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal / Overlay de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle>Cadastrar Novo Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePatient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                  <Input 
                    placeholder="Ex: João da Silva" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                  <Input 
                    type="date" 
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Paciente'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

