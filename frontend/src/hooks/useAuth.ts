import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { LoginCredentials, RegisterData, LoginResponse } from '@/types';

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

  const registerMutation = useMutation({
    mutationFn: async (registerData: RegisterData) => {
      const { data } = await api.post<LoginResponse>('/auth/register', registerData);
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

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return {
    user,
    isAuthenticated,
    isLoading: isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
  };
}
