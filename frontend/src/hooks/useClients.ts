import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Client, PaginatedResponse, ApiResponse } from '@/types';
import { ClientFormData } from '@/lib/validators';

export function useClients(page = 1, search = '', filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ['clients', page, search, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), ...filters });
      if (search) params.set('search', search);
      const { data } = await api.get<PaginatedResponse<Client>>(`/clients?${params}`);
      return data;
    },
  });
}

export function useClient(id: number) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Client>>(`/clients/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ClientFormData) => {
      const { data } = await api.post<ApiResponse<Client>>('/clients', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: ClientFormData & { id: number }) => {
      const { data } = await api.put<ApiResponse<Client>>(`/clients/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
