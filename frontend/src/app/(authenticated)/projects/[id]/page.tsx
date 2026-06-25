'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getPriorityColor, getPriorityLabel, formatDate, formatHours } from '@/lib/utils';
import { Task } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: project, isLoading } = useProject(Number(id));
  const { data: tasksData } = useTasks({ project_id: Number(id), per_page: 10 });

  if (isLoading) return <LoadingSpinner size="lg" className="py-12" />;
  if (!project) return <p className="text-gray-500">Projeto não encontrado</p>;

  const progress =
    project.total_tasks_count && project.total_tasks_count > 0
      ? ((project.completed_tasks_count || 0) / project.total_tasks_count) * 100
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
        <Link href="/projects" className="text-sm text-primary hover:underline">
          ← Voltar para projetos
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <Badge color={project.status?.color}>{project.status?.name}</Badge>
          <Badge className={getPriorityColor(project.priority)}>
            {getPriorityLabel(project.priority)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">Horas Estimadas</p>
            <p className="text-lg font-bold">{formatHours(project.estimated_hours)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">Horas Trabalhadas</p>
            <p className="text-lg font-bold">{formatHours(project.worked_hours)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">Prazo</p>
            <p className="text-lg font-bold">{formatDate(project.planned_end_date)}</p>
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
                {project.completed_tasks_count || 0}/{project.total_tasks_count || 0} tarefas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {project.description && (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-900">Descrição</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-gray-900">Tarefas</h3>
        </CardHeader>
        <CardContent>
          <Table
            columns={taskColumns}
            data={tasksData?.data || ([] as unknown as Task[])}
            onRowClick={(task) => router.push(`/tasks/${task.id}`)}
            emptyMessage="Nenhuma tarefa neste projeto"
          />
        </CardContent>
      </Card>
    </div>
  );
}
