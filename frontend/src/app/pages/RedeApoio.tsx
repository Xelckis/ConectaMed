import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPatients, getNetworkMembers, addNetworkMember, removeNetworkMember } from '../../lib/api';
import { NetworkMember, Patient } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';

export function RedeApoio() {
  const { token } = useAuth();
  const [members, setMembers] = useState<NetworkMember[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado do formulário
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadNetwork() {
    if (!token) return;
    try {
      setIsLoading(true);
      const patients = await getPatients(token);
      if (patients.length > 0) {
        setPatient(patients[0]);
        const data = await getNetworkMembers(token, patients[0].id);
        setMembers(data);
      }
    } catch (error) {
      console.error("Erro ao carregar rede:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadNetwork(); }, [token]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !patient || !newEmail) return;
    try {
      setIsSubmitting(true);
      await addNetworkMember(token, patient.id, { email: newEmail, role: 'MEMBRO' });
      setNewEmail('');
      await loadNetwork(); // Recarrega a lista
    } catch (error: any) {
      alert(error.message || "Erro ao adicionar membro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!token || !patient) return;
    if (!confirm("Tem a certeza que deseja remover esta pessoa da rede?")) return;
    try {
      await removeNetworkMember(token, patient.id, userId);
      await loadNetwork();
    } catch (error: any) {
      alert(error.message || "Erro ao remover membro.");
    }
  };

  if (isLoading) return <div className="p-8"><Skeleton className="h-64 w-full max-w-2xl" /></div>;
  if (!patient) return <div className="p-8">Cadastre um paciente primeiro.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Rede de Apoio</h1>
        <p className="text-slate-500 mt-2">Cuidadores de: <strong className="text-slate-700">{patient.name}</strong></p>
      </div>

      <Card>
        <CardHeader><CardTitle>Adicionar Cuidador</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAddMember} className="flex gap-4">
            <Input 
              type="email" 
              placeholder="E-mail do novo cuidador" 
              value={newEmail} 
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adicionando...' : 'Convidar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {members.map((member) => (
          <Card key={member.userId} className="shadow-sm">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">{member.name}</p>
                <p className="text-sm text-slate-500">{member.email}</p>
                <Badge className={`mt-2 ${member.role === 'ADMINISTRADOR' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                  {member.role}
                </Badge>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleRemove(member.userId)}>
                Remover
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

