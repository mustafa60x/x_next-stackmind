import { useUserStore } from '../store/userStore';
import { useCallback } from 'react';
import { User } from '../types/userTypes';
import { userRepository } from '@/lib/api/userRepository';

export const useUser = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const loadUser = useCallback(async (userId: string) => {
    try {
      const user = await userRepository.fetchUser(userId) as User;
      setCurrentUser(user);
    } catch (error) {
      console.error(error);
    }
  }, [setCurrentUser]);

  return { currentUser, loadUser };
};
