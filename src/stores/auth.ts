import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: { id: string; username: string } | null;
  isHydrated: boolean;
  login: (token: string, user: { id: string; username: string }) => void;
  logout: () => void;
  setRehydrated: (value: boolean) => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      isHydrated: false, // Başlangıçta false
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setRehydrated: (value: boolean) => set({ isHydrated: value }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setRehydrated(true); // Veriler yüklendiğinde true yap
      },
    }
  )
);
