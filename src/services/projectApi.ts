import type { Project } from '@/store/types';

const BASE_URL = '/api/projects';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
    throw new Error(body.message || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const projectApi = {
  fetchAll: (): Promise<Project[]> =>
    fetch(BASE_URL).then((res) => handleResponse<Project[]>(res)),

  create: (data: { name: string }): Promise<Project> =>
    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<Project>(res)),
};
