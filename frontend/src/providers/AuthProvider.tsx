'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { AuthUser } from '@/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, clearAuth, setLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) return;

    setLoading(true);

    api.get('/auth/me')
      .then(({ data }: { data: { data: AuthUser } }) => {
        setUser(data.data);
      })
      .catch(() => {
        clearAuth();
      });
  }, []);

  return <>{children}</>;
}
