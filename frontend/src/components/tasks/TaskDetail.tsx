'use client';

import { useTask, useUpdateTask } from '@/hooks/useTasks';
import { useStatuses } from '@/hooks/useStatuses';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TaskForm } from '@/components/forms/TaskForm';
import { getPriorityColor, getPriorityLabel, formatDate, formatHours, getTimeStatusColor } from '@/lib/utils';
import { useState } from 'react';
import { Edit, Clock } from 'lucide-react';

interface TaskDetailProps {
  taskId: number;
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const { data: task, isLoading } = useTask(taskId);
  const { data: statuses = [] } = useStatuses();
  const updateTask = useUpdateTask();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <LoadingSpinner size="lg" className="py-12" />;
  if (!task) return <p className="text-gray-500">Tarefa não encontrada</p>;

  const progress =
    task.subtasks_count && task.subtasks_count > 0
      ? ((task.completed_subtasks_count || 0) / task.subtasks_count) * 100
      : 0;

  const timeStatus = getTimeStatusColor(task.estimated_hours, task.worked_hours);

  return (
    <div className="space-y-6">
      {isEditing ? (
        <Card>
          <CardContent className="p-6">
            <TaskForm
              initialData={task}
              onSubmit={(data) => {
                updateTask.mutate(
                  { id: taskId, ...data },
                  { onSuccess: () => setIsEditing(false) }
                );
              }}
              isLoading={updateTask.isPending}
              projectOptions={[
                { value: task.project_id, label: task.project?.name || '' },
              ]}
              statusOptions={statuses.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
              sprintOptions={[]}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge color={task.status?.color}>{task.status?.name || 'Sem status'}</Badge>
                <Badge className={getPriorityColor(task.priority)}>
                  {getPriorityLabel(task.priority)}
                </Badge>
                {task.project && (
                  <span className="text-sm text-gray-500">
                    Projeto: {task.project.name}
                  </span>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </div>

          {task.description && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {task.description}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-gray-500">Horas Estimadas</p>
                <p className="text-lg font-bold">{formatHours(task.estimated_hours)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-gray-500">Horas Trabalhadas</p>
                <p className={`text-lg font-bold ${timeStatus}`}>
                  {formatHours(task.worked_hours)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-gray-500">Prazo</p>
                <p className="text-lg font-bold">{formatDate(task.due_date)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-gray-500">Responsável</p>
                <p className="text-lg font-bold">
                  {task.assignees?.map((a) => a.name).join(', ') ||
                    task.assignee?.name ||
                    '-'}
                </p>
              </CardContent>
            </Card>
          </div>

          {task.subtasks_count != null && task.subtasks_count > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progresso das Subtarefas
                </span>
                <span className="text-sm text-gray-500">
                  {task.completed_subtasks_count || 0}/{task.subtasks_count}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-gray-500">
                Início Planejado: {formatDate(task.planned_start_date)}
              </p>
              <p className="text-gray-500">
                Início Real: {formatDate(task.actual_start_date)}
              </p>
              <p className="text-gray-500">
                Criado em: {formatDate(task.created_at, 'long')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500">
                Término Planejado: {formatDate(task.planned_end_date)}
              </p>
              <p className="text-gray-500">
                Término Real: {formatDate(task.actual_end_date)}
              </p>
              <p className="text-gray-500">
                Atualizado em: {formatDate(task.updated_at, 'long')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
