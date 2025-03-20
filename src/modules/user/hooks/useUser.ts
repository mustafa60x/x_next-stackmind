import { useCallback } from 'react';
import { User } from '../types/userTypes';
import { userRepository } from '@/lib/api/userRepository';
import { useAuthStore } from '@/stores';

export const useUser = () => {
  const { user, setUser } = useAuthStore();

  const loadUser = useCallback(async (userId: string) => {
    try {
      const user = await userRepository.fetchUser(userId) as User;
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  }, [setUser]);

  return { user, loadUser };
};
