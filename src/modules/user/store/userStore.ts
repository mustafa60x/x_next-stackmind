import { create } from 'zustand';
import { UserState } from '../types/userTypes';

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user: UserState['currentUser']) => set({ currentUser: user }),
}));
