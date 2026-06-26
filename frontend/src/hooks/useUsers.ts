import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, PaginatedResponse } from '@/types';

export function useUsers(page = 1, search = '', filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ['users', page, search, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), ...filters });
      if (search) params.set('search', search);
      const { data } = await api.get<PaginatedResponse<User>>(`/users?${params}`);
      return data;
    },
  });
}
