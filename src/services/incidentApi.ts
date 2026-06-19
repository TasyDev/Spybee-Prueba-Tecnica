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

  createDraft: (data: CreateIncidentInput): Promise<Incident> =>
    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, status: 'draft' }),
    }).then((res) => handleResponse<Incident>(res)),

  finalizeDraft: (id: string, data: Partial<CreateIncidentInput>): Promise<Incident> =>
    fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, status: 'open' }),
    }).then((res) => handleResponse<Incident>(res)),

  cancelDraft: (id: string): Promise<void> =>
    fetch(`${BASE_URL}/${id}/draft`, { method: 'DELETE' }).then(() => undefined),

  update: (id: string, changes: UpdateIncidentInput): Promise<Incident> =>
    fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    }).then((res) => handleResponse<Incident>(res)),

  remove: (id: string): Promise<void> =>
    fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(() => undefined),

  uploadMedia: (id: string, file: File): Promise<{ id: string; name: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${BASE_URL}/${id}/media`, {
      method: 'POST',
      body: formData,
    }).then((res) => handleResponse<{ id: string; name: string; url: string }>(res));
  },

  deleteMedia: (id: string, mediaId: string): Promise<void> =>
    fetch(`${BASE_URL}/${id}/media/${mediaId}`, { method: 'DELETE' }).then(() => undefined),
};
