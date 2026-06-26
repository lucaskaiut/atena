'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { AuthUser } from '@/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, setUser, clearAuth, setLoading, isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useAuthStore.persist;

    if (!persist) {
      setHydrated(true);
      return;
    }

    if (persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = persist.onFinishHydration(() => {
        setHydrated(true);
      });
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

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
  }, [hydrated]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
