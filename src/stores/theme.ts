import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;

}

export const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      isDarkMode: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (value: boolean) => set({ isDarkMode: value }),
    }),
    {
      name: 'theme-storage', // localStorage’daki anahtar
    }
  )
);

// Sistem teması değişikliklerini dinleyip store'u güncelle
// Client-side only
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    useThemeStore.getState().setDarkMode(e.matches);
  });
}