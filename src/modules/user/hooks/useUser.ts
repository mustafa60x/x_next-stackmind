import { useUserStore } from '../store/userStore';
import { fetchUser } from '../services/userService';
import { useCallback } from 'react';

export const useUser = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const loadUser = useCallback(async (userId: string) => {
    try {
      const user = await fetchUser(userId);
      setCurrentUser(user);
    } catch (error) {
      console.error(error);
    }
  }, [setCurrentUser]);

  return { currentUser, loadUser };
};
