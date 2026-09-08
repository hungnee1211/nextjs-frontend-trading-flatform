'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function AuthInitializer() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized) return;

    const initAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (res.ok && data.success && data.user) {
          setAuth(data.user);
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
