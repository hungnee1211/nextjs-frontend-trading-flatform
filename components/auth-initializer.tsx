'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/lib/axios';

export function AuthInitializer() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized) return;

    const initAuth = async () => {
      try {
        const res = await api.get<{ success: boolean; user: { id: string; name: string; email: string; avatar?: string } }>('/api/auth/me');

        if (res.data.success && res.data.user) {
          setAuth(res.data.user);
        }
      } catch (err) {
        console.log('No active session');
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [isInitialized, user, setAuth, setInitialized]);

  return null;
}