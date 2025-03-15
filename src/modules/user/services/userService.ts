import { User } from '../types/userTypes';
import { apiFetch } from '../../../lib/api';

export async function fetchUser(userId: string): Promise<User> {
  return await apiFetch(`/users/${userId}`);
}
