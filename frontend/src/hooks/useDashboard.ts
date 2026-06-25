import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  DashboardStats,
  ProductivityData,
  TasksByStatusData,
  Task,
  ApiResponse,
} from '@/types';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
      return data.data;
    },
  });
}

export function useDashboardProductivity() {
  return useQuery({
    queryKey: ['dashboard', 'productivity'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ProductivityData[]>>(
        '/dashboard/productivity'
      );
      return data.data;
    },
  });
}

export function useDashboardTasksByStatus() {
  return useQuery({
    queryKey: ['dashboard', 'tasksByStatus'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<TasksByStatusData[]>>(
        '/dashboard/tasks-by-status'
      );
      return data.data;
    },
  });
}

export function useDashboardRecentTasks() {
  return useQuery({
    queryKey: ['dashboard', 'recentTasks'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Task[]>>('/dashboard/recent-tasks');
      return data.data;
    },
  });
}
