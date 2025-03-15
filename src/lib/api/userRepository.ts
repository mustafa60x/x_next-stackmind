import { User } from '@/modules/user/types/userTypes';
import { BaseRepository } from './baseRepository';

export class UserRepository extends BaseRepository {
  private readonly RESOURCE = '/users';

  async fetchUser(userId: string): Promise<User> {
    return await this.fetch<User>(`${this.RESOURCE}/${userId}`, {
      headers: { body: JSON.stringify({ userId }) },
    });
  }
}

export const userRepository = new UserRepository();