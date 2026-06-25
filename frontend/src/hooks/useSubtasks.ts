import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Subtask, ApiResponse } from '@/types';
import { SubtaskFormData } from '@/lib/validators';

export function useSubtasks(taskId: number) {
  return useQuery({
    queryKey: ['subtasks', taskId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Subtask[]>>(`/tasks/${taskId}/subtasks`);
      return data.data;
    },
    enabled: !!taskId,
  });
}

export function useCreateSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SubtaskFormData) => {
      const { data } = await api.post<ApiResponse<Subtask>>(
        `/tasks/${payload.task_id}/subtasks`,
        payload
      );
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', vars.task_id] });
      queryClient.invalidateQueries({ queryKey: ['task', vars.task_id] });
    },
  });
}

export function useUpdateSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, task_id, ...payload }: SubtaskFormData & { id: number; task_id: number }) => {
      const { data } = await api.put<ApiResponse<Subtask>>(
        `/tasks/${task_id}/subtasks/${id}`,
        payload
      );
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', vars.task_id] });
    },
  });
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, taskId }: { id: number; taskId: number }) => {
      await api.delete(`/tasks/${taskId}/subtasks/${id}`);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', vars.taskId] });
    },
  });
}
