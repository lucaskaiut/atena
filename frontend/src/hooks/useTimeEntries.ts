import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { TimeEntry, ApiResponse } from '@/types';
import { ManualTimeEntryFormData } from '@/lib/validators';

export function useTimeEntries(taskId: number) {
  return useQuery({
    queryKey: ['timeEntries', taskId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<TimeEntry[]>>(`/tasks/${taskId}/time-entries`);
      return data.data;
    },
    enabled: !!taskId,
  });
}

export function useStartTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      task_id,
      description,
    }: {
      task_id: number;
      description?: string;
    }) => {
      const { data } = await api.post<ApiResponse<TimeEntry>>(`/tasks/${task_id}/time-entries/start`, {
        description,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['task'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useStopTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<ApiResponse<TimeEntry>>(`/time-entries/${id}/stop`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['task'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/time-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['task'] });
    },
  });
}

export function useCreateManualEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      task_id,
      ...payload
    }: ManualTimeEntryFormData & { task_id: number }) => {
      const { data } = await api.post<ApiResponse<TimeEntry>>(
        `/tasks/${task_id}/time-entries`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['task'] });
    },
  });
}
