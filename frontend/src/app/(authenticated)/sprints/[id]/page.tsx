'use client';

import { useParams } from 'next/navigation';
import { useSprint } from '@/hooks/useSprints';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getPriorityColor, getPriorityLabel, formatDate, getSprintStatusColor, getSprintStatusLabel } from '@/lib/utils';
import { Task } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SprintDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: sprint, isLoading } = useSprint(Number(id));
  const { data: tasksData } = useTasks({ sprint_id: Number(id), per_page: 50 });

  if (isLoading) return <LoadingSpinner size="lg" className="py-12" />;
  if (!sprint) return <p className="text-gray-500">Sprint não encontrada</p>;

  const progress =
    sprint.tasks_count && sprint.tasks_count > 0
      ? ((sprint.completed_tasks_count || 0) / sprint.tasks_count) * 100
      : 0;

  const taskColumns = [
    {
      key: 'title',
      header: 'Título',
      render: (t: Task) => (
        <span className="font-medium text-gray-900">{t.title}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t: Task) => (
        <Badge color={t.status?.color}>{t.status?.name || '-'}</Badge>
      ),
    },
    {
      key: 'priority',
      header: 'Prioridade',
      render: (t: Task) => (
        <Badge className={getPriorityColor(t.priority)}>
          {getPriorityLabel(t.priority)}
        </Badge>
      ),
    },
    {
      key: 'assignee',
      header: 'Responsável',
      render: (t: Task) => t.assignee?.name || '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/sprints" className="text-sm text-primary hover:underline">
          ← Voltar para sprints
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-2xl font-bold text-gray-900">{sprint.name}</h1>
          <Badge className={getSprintStatusColor(sprint.status)}>
            {getSprintStatusLabel(sprint.status)}
          </Badge>
        </div>
      </div>

      {sprint.goal && (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-900">Objetivo</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{sprint.goal}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">Início</p>
            <p className="text-lg font-bold">{formatDate(sprint.start_date)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">Término</p>
            <p className="text-lg font-bold">{formatDate(sprint.end_date)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">Progresso</p>
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {sprint.completed_tasks_count || 0}/{sprint.tasks_count || 0} tarefas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-gray-900">Tarefas da Sprint</h3>
        </CardHeader>
        <CardContent>
          <Table
            columns={taskColumns}
            data={tasksData?.data || ([] as unknown as Task[])}
            onRowClick={(task) => router.push(`/tasks/${task.id}`)}
            emptyMessage="Nenhuma tarefa nesta sprint"
          />
        </CardContent>
      </Card>
    </div>
  );
}
