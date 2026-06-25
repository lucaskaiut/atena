import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { LoginCredentials, LoginResponse } from '@/types';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<LoginResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push('/dashboard');
    },
  });

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // token may already be invalid
    }
    clearAuth();
    router.push('/login');
  }

  return {
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    login: loginMutation.mutate,
    logout: handleLogout,
  };
}
