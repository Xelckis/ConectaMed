export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMINISTRADOR' | 'MEMBRO';
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  responsibleIds: string[];
}

export interface Appointment {
  id: string;
  title: string;
  specialty: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  patientId: string;
  participantIds: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  permissions: {
    canEdit: string[];
    canDelete: string[];
  };
  createdBy: string;
  createdAt: string;
}

export interface NetworkMember {
  userId: string;
  patientId: string;
  role: 'ADMINISTRADOR' | 'MEMBRO';
  status: 'active' | 'pending';
  joinedAt: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'reschedule' | 'invite' | 'conflict' | 'confirmation';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}
