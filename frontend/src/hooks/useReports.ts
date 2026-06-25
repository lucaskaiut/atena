import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse, TimeEntry } from '@/types';

export function useHoursReport(filters: Record<string, string | number | undefined> = {}) {
  return useQuery({
    queryKey: ['reports', 'hours', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.set(key, String(value));
      });
      const { data } = await api.get<ApiResponse<TimeEntry[]>>(
        `/reports/hours?${params}`
      );
      return data.data;
    },
  });
}

interface TasksReportItem {
  id: number;
  title: string;
  status: string;
  priority: string;
  estimated_hours?: number;
  worked_hours?: number;
  created_at: string;
  completed_at?: string;
}

export function useTasksReport(
  type: string,
  filters: Record<string, string | number | undefined> = {}
) {
  return useQuery({
    queryKey: ['reports', 'tasks', type, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ type });
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.set(key, String(value));
      });
      const { data } = await api.get<ApiResponse<TasksReportItem[]>>(
        `/reports/tasks?${params}`
      );
      return data.data;
    },
  });
}

interface EstimatesReportItem {
  project_name: string;
  estimated_hours: number;
  worked_hours: number;
  tasks_count: number;
}

export function useEstimatesReport(
  filters: Record<string, string | number | undefined> = {}
) {
  return useQuery({
    queryKey: ['reports', 'estimates', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.set(key, String(value));
      });
      const { data } = await api.get<ApiResponse<EstimatesReportItem[]>>(
        `/reports/estimates?${params}`
      );
      return data.data;
    },
  });
}
