import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Sprint, PaginatedResponse, ApiResponse } from '@/types';
import { SprintFormData } from '@/lib/validators';

export function useSprints(page = 1, search = '') {
  return useQuery({
    queryKey: ['sprints', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('search', search);
      const { data } = await api.get<PaginatedResponse<Sprint>>(`/sprints?${params}`);
      return data;
    },
  });
}

export function useSprint(id: number) {
  return useQuery({
    queryKey: ['sprint', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Sprint>>(`/sprints/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateSprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SprintFormData) => {
      const { data } = await api.post<ApiResponse<Sprint>>('/sprints', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}

export function useUpdateSprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: SprintFormData & { id: number }) => {
      const { data } = await api.put<ApiResponse<Sprint>>(`/sprints/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}

export function useCloseSprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch<ApiResponse<Sprint>>(`/sprints/${id}/close`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
}
