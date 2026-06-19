import type { Tag } from '@/store/types';

const BASE_URL = '/api/tags';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
    throw new Error(body.message || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const tagApi = {
  fetchAll: (): Promise<Tag[]> =>
    fetch(BASE_URL).then((res) => handleResponse<Tag[]>(res)),

  create: (data: { name: string; color?: string }): Promise<Tag> =>
    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<Tag>(res)),
};
