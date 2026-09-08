import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthState = {
  user: UserProfile | null;
  token: string | null;
  setAuth: (user: UserProfile, token?: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      // Cập nhật thông tin user & token
      setAuth: (user, token) =>
        set((state) => ({
          user,
          token: token ?? state.token,
        })),

      // Đăng xuất
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);