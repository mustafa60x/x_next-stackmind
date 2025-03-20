import { create } from "zustand";
import Cookies from "js-cookie";

type User = {
  id: string;
  username: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  login: async (token: string, user: User) => {
    set({ user });
    Cookies.set("access_token", token, {
      path: "/",
      expires: 7, // 7 days
      sameSite: "strict"
    });
  },
  logout: async () => {
    Cookies.remove("access_token");
    set({ user: null });
    window.location.href = "/login";
  },
}));
