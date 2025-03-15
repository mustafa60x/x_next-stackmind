import { User } from '../types/userTypes';
import { BaseRepository } from '@/lib/api/baseRepository';

export class UserService extends BaseRepository {
  async fetchUser(userId: string): Promise<User> {
    return await this.fetch<User>(`/users/${userId}`);
  }
}

export const userService = new UserService();