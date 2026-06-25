import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project, PaginatedResponse, ApiResponse } from '@/types';
import { ProjectFormData } from '@/lib/validators';

export function useProjects(page = 1, search = '', filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ['projects', page, search, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), ...filters });
      if (search) params.set('search', search);
      const { data } = await api.get<PaginatedResponse<Project>>(`/projects?${params}`);
      return data;
    },
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Project>>(`/projects/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProjectFormData) => {
      const { data } = await api.post<ApiResponse<Project>>('/projects', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: ProjectFormData & { id: number }) => {
      const { data } = await api.put<ApiResponse<Project>>(`/projects/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useCloseProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await api.post<ApiResponse<Project>>(`/projects/${id}/close`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
