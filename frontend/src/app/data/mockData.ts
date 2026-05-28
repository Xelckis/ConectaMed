import { Patient, Appointment, NetworkMember, Notification } from '../types';

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'João Carlos Silva',
    age: 72,
    responsibleIds: ['1', '2'],
  },
  {
    id: 'p2',
    name: 'Ana Maria Santos',
    age: 65,
    responsibleIds: ['1'],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    title: 'Consulta Cardiologia',
    specialty: 'Cardiologia',
    location: 'Hospital São Lucas - Sala 304',
    date: '2026-05-26',
    startTime: '14:00',
    endTime: '15:00',
    notes: 'Levar exames anteriores',
    patientId: 'p1',
    participantIds: ['1', '2'],
    status: 'scheduled',
    permissions: {
      canEdit: ['1', '2'],
      canDelete: ['1'],
    },
    createdBy: '1',
    createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'a2',
    title: 'Retorno Ortopedia',
    specialty: 'Ortopedia',
    location: 'Clínica Vida - 2º andar',
    date: '2026-05-28',
    startTime: '10:30',
    endTime: '11:30',
    patientId: 'p1',
    participantIds: ['1'],
    status: 'scheduled',
    permissions: {
      canEdit: ['1'],
      canDelete: ['1'],
    },
    createdBy: '1',
    createdAt: '2026-05-22T15:30:00Z',
  },
  {
    id: 'a3',
    title: 'Consulta Oftalmologia',
    specialty: 'Oftalmologia',
    location: 'Centro Médico Premium',
    date: '2026-06-02',
    startTime: '16:00',
    endTime: '17:00',
    patientId: 'p1',
    participantIds: ['1', '2', '3'],
    status: 'scheduled',
    permissions: {
      canEdit: ['1', '2'],
      canDelete: ['1'],
    },
    createdBy: '1',
    createdAt: '2026-05-23T09:00:00Z',
  },
  {
    id: 'a4',
    title: 'Exame de Sangue',
    specialty: 'Laboratório',
    location: 'Laboratório Análises Clínicas',
    date: '2026-04-15',
    startTime: '08:00',
    endTime: '08:30',
    patientId: 'p1',
    participantIds: ['1'],
    status: 'completed',
    permissions: {
      canEdit: [],
      canDelete: [],
    },
    createdBy: '1',
    createdAt: '2026-04-10T12:00:00Z',
  },
  {
    id: 'a5',
    title: 'Consulta Geriatra',
    specialty: 'Geriatria',
    location: 'Consultório Dra. Paula',
    date: '2026-05-10',
    startTime: '09:00',
    endTime: '10:00',
    patientId: 'p1',
    participantIds: ['1', '2'],
    status: 'completed',
    permissions: {
      canEdit: [],
      canDelete: [],
    },
    createdBy: '1',
    createdAt: '2026-05-05T14:00:00Z',
  },
];

export const mockNetworkMembers: NetworkMember[] = [
  {
    userId: '1',
    patientId: 'p1',
    role: 'ADMINISTRADOR',
    status: 'active',
    joinedAt: '2025-01-15T10:00:00Z',
  },
  {
    userId: '2',
    patientId: 'p1',
    role: 'MEMBRO',
    status: 'active',
    joinedAt: '2025-02-20T14:30:00Z',
  },
  {
    userId: '3',
    patientId: 'p1',
    role: 'MEMBRO',
    status: 'pending',
    joinedAt: '2026-05-20T09:00:00Z',
  },
];

export const mockUsers = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@example.com',
    role: 'ADMINISTRADOR' as const,
  },
  {
    id: '2',
    name: 'Pedro Santos',
    email: 'pedro@example.com',
    role: 'MEMBRO' as const,
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@example.com',
    role: 'MEMBRO' as const,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'reminder',
    title: 'Lembrete de consulta',
    message: 'Consulta de Cardiologia amanhã às 14:00',
    read: false,
    createdAt: '2026-05-25T09:00:00Z',
    relatedId: 'a1',
  },
  {
    id: 'n2',
    type: 'invite',
    title: 'Novo convite',
    message: 'Ana Costa foi convidada para a rede de apoio',
    read: false,
    createdAt: '2026-05-20T15:30:00Z',
  },
  {
    id: 'n3',
    type: 'confirmation',
    title: 'Consulta confirmada',
    message: 'Retorno de Ortopedia confirmado para 28/05',
    read: true,
    createdAt: '2026-05-22T16:00:00Z',
    relatedId: 'a2',
  },
];
