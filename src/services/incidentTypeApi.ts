import type { IncidentType } from '@/store/types';

const BASE_URL = '/api/incident-types';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
    throw new Error(body.message || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const incidentTypeApi = {
  fetchAll: (): Promise<IncidentType[]> =>
    fetch(BASE_URL).then((res) => handleResponse<IncidentType[]>(res)),
};
