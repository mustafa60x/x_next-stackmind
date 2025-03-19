import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  username: string;
};

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};


export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      login: (user: User) => {
        set({ user });
      },
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

