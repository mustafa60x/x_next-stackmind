import { useUserStore } from '../store/userStore';
import { useCallback } from 'react';
import { User } from '../types/userTypes';
import { userRepository } from '@/lib/api/userRepository';
import toast from 'react-hot-toast';

export const useUser = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const loadUser = useCallback(async (userId: string) => {
    try {
      const user = await userRepository.fetchUser(userId) as User;
      setCurrentUser(user);
    } catch {
      toast.error("Kullanıcı bilgileri yüklenirken bir hata oluştu");
    }
  }, [setCurrentUser]);

  return { currentUser, loadUser };
};