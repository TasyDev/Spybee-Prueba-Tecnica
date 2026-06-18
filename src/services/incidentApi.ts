import type { Incident, CreateIncidentInput, UpdateIncidentInput } from '@/store/types';

const BASE_URL = '/api/incidents';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
    throw new Error(body.message || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const incidentApi = {
  fetchAll: (): Promise<{ data: Incident[]; total: number }> =>
    fetch(BASE_URL).then((res) => handleResponse<{ data: Incident[]; total: number }>(res)),

  fetchById: (id: string): Promise<Incident> =>
    fetch(`${BASE_URL}/${id}`).then((res) => handleResponse<Incident>(res)),

  create: (data: CreateIncidentInput): Promise<Incident> =>
    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<Incident>(res)),

  update: (id: string, changes: UpdateIncidentInput): Promise<Incident> =>
    fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    }).then((res) => handleResponse<Incident>(res)),

  remove: (id: string): Promise<void> =>
    fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(() => undefined),
};
