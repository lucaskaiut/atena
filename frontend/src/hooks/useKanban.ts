import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { KanbanColumn, ApiResponse } from '@/types';

export function useKanban(projectId?: number, sprintId?: number) {
  return useQuery({
    queryKey: ['kanban', projectId, sprintId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (projectId) params.set('project_id', String(projectId));
      if (sprintId) params.set('sprint_id', String(sprintId));
      const { data } = await api.get<ApiResponse<KanbanColumn[]>>(
        `/kanban?${params}`
      );
      return data.data;
    },
  });
}
