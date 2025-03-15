import { BaseRepository } from './baseRepository';

export class AuthRepository extends BaseRepository {
  async register(username: string, password: string) {
    return this.fetch<{ token: string; user: { id: string; username: string } }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
  }

  async login(username: string, password: string) {
    return this.fetch<{ token: string; user: { id: string; username: string } }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
  }

  async getProfile(token: string) {
    return this.fetch<{ id: string; username: string }>('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const authRepository = new AuthRepository();