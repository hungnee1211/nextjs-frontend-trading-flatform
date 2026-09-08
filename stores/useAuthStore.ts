import { create } from 'zustand';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthState = {
  user: UserProfile | null;
  isInitialized: boolean;
  setAuth: (user: UserProfile) => void;
  setInitialized: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isInitialized: false,

  setAuth: (user) =>
    set(() => ({
      user,
    })),

  setInitialized: (value) =>
    set(() => ({
      isInitialized: value,
    })),

  logout: () => set({ user: null }),
}));
