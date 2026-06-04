import { Patient, Appointment, NetworkMember, Notification } from '../app/types';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';

const API_PREFIX = '/api/v1';

type RequestOptions = RequestInit & {
  token?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${API_PREFIX}${normalizedPath}`;
}

async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...restOptions } = options;
  const response = await fetch(buildUrl(path), {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const body = await parseJson(response);

  if (!response.ok) {
    const message = body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
      ? body.error
      : 'Erro ao processar a requisição';

    throw new ApiError(message, response.status);
  }

  return body as T;
}

export type RegisterResponse = {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
};

export type LoginResponse = {
  message: string;
  token: string;
};

export type ProfileResponse = {
  message: string;
  seu_id_no_banco_de_dados: string;
};

export function registerUser(payload: { name: string; email: string; password: string }) {
  return request<RegisterResponse>('/users/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: { email: string; password: string }) {
  return request<LoginResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getProfile(token: string) {
  return request<ProfileResponse>('/perfil', {
    method: 'GET',
    token,
  });
}

// --- PACIENTES ---
export function getPatients(token: string) {
  return request<Patient[]>('/patients', { method: 'GET', token });
}
export function createPatient(token: string, payload: { name: string; date_of_birth: string }) {
  return request<Patient>('/patients', { method: 'POST', token, body: JSON.stringify(payload) });
}

// --- AGENDAMENTOS ---
export function getPatientAppointments(token: string, patientId: string) {
  return request<Appointment[]>(`/patients/${patientId}/appointments`, { method: 'GET', token });
}
export function createAppointment(token: string, payload: any) {
  return request<Appointment>('/appointments', { method: 'POST', token, body: JSON.stringify(payload) });
}
export function updateAppointment(token: string, appointmentId: string, payload: any) {
  return request<{message: string}>(`/appointments/${appointmentId}`, { method: 'PUT', token, body: JSON.stringify(payload) });
}
export function deleteAppointment(token: string, appointmentId: string) {
  return request<{message: string}>(`/appointments/${appointmentId}`, { method: 'DELETE', token });
}

// --- REDE DE APOIO ---
export function getNetworkMembers(token: string, patientId: string) {
  return request<NetworkMember[]>(`/patients/${patientId}/network`, { method: 'GET', token });
}
export function addNetworkMember(token: string, patientId: string, payload: { email: string; role: string }) {
  return request<{message: string}>(`/patients/${patientId}/network`, { method: 'POST', token, body: JSON.stringify(payload) });
}
export function updateNetworkRole(token: string, patientId: string, userId: string, role: string) {
  return request<{message: string}>(`/patients/${patientId}/network/${userId}`, { method: 'PUT', token, body: JSON.stringify({ role }) });
}
export function removeNetworkMember(token: string, patientId: string, userId: string) {
  return request<{message: string}>(`/patients/${patientId}/network/${userId}`, { method: 'DELETE', token });
}

// --- NOTIFICAÇÕES ---
export function getNotifications(token: string) {
  return request<Notification[]>('/notifications', { method: 'GET', token });
}
export function markNotificationAsRead(token: string, notificationId: string) {
  return request<{message: string}>(`/notifications/${notificationId}/read`, { method: 'PATCH', token });
}
