'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { AuthUser } from '@/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, setUser, clearAuth, setLoading, isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      setReady(true);
      return;
    }

    if (!token) {
      clearAuth();
      setReady(true);
      return;
    }

    setLoading(true);

    api.get('/auth/me')
      .then(({ data }: { data: { data: AuthUser } }) => {
        setUser(data.data);
        setReady(true);
      })
      .catch(() => {
        clearAuth();
        setReady(true);
      });
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
