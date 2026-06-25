import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ProjectStatus, ApiResponse } from '@/types';
import { StatusFormData } from '@/lib/validators';

export function useStatuses(type: 'project' | 'task' = 'task') {
  return useQuery({
    queryKey: ['statuses', type],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ProjectStatus[]>>(`/statuses?type=${type}`);
      return data.data;
    },
  });
}

export function useCreateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: StatusFormData) => {
      const { data } = await api.post<ApiResponse<ProjectStatus>>('/statuses', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] });
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: StatusFormData & { id: number }) => {
      const { data } = await api.put<ApiResponse<ProjectStatus>>(`/statuses/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] });
    },
  });
}

export function useReorderStatuses() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: { id: number; order: number }[]) => {
      const { data } = await api.post('/statuses/reorder', { statuses: orderedIds });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] });
    },
  });
}
