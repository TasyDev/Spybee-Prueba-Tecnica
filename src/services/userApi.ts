import type { User } from '@/store/types';

const BASE_URL = '/api/users';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
    throw new Error(body.message || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const userApi = {
  fetchAll: (): Promise<User[]> =>
    fetch(BASE_URL).then((res) => handleResponse<User[]>(res)),
};
