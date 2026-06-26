'use client';

import {
  useDashboardStats,
  useDashboardProductivity,
  useDashboardTasksByStatus,
  useDashboardRecentTasks,
} from '@/hooks/useDashboard';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProductivityChart } from '@/components/dashboard/ProductivityChart';
import { TasksByStatusChart } from '@/components/dashboard/TasksByStatusChart';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getPriorityColor, getPriorityLabel, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  ListTodo,
  Clock,
  BarChart3,
  Timer,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: productivity, isLoading: prodLoading } = useDashboardProductivity();
  const { data: tasksByStatus, isLoading: statusLoading } =
    useDashboardTasksByStatus();
  const { data: recentTasks, isLoading: tasksLoading } = useDashboardRecentTasks();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Projetos"
          value={statsLoading ? '-' : stats?.total_projects || 0}
          icon={<FolderKanban className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Tarefas"
          value={statsLoading ? '-' : stats?.total_tasks || 0}
          icon={<ListTodo className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Horas Trab."
          value={statsLoading ? '-' : `${stats?.hours_worked || 0}h`}
          icon={<Clock className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Horas Est."
          value={statsLoading ? '-' : `${stats?.hours_estimated || 0}h`}
          icon={<BarChart3 className="h-6 w-6" />}
          color="indigo"
        />
        <StatCard
          title="Sprints Ativas"
          value={statsLoading ? '-' : stats?.active_sprints || 0}
          icon={<Timer className="h-6 w-6" />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductivityChart
          data={productivity || []}
          isLoading={prodLoading}
        />
        <TasksByStatusChart
          data={tasksByStatus || []}
          isLoading={statusLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-gray-900">Tarefas Recentes</h3>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <LoadingSpinner className="py-4" />
          ) : !recentTasks || recentTasks.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Nenhuma tarefa recente
            </p>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100"
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {task.project?.name} • {formatDate(task.created_at, 'relative')}
                    </p>
                  </div>
                  <Badge color={task.status?.color}>{task.status?.name}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
