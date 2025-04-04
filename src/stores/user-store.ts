import { create } from "zustand";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
  token: string | null;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
