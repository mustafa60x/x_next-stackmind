import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from 'js-cookie'

type User = {
  id: string;
  username: string;
};

type AuthState = {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};


export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      login: async (token: string, user: User) => {
        set({ user });
        Cookies.set('access_token', token, {
          path: "",
          expires: 7 // 7 days
        });
        
      },
      logout: async () => {
        Cookies.remove('access_token')
        set({ user: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

