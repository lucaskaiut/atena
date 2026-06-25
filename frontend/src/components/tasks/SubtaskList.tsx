'use client';

import { useSubtasks, useCreateSubtask, useUpdateSubtask, useDeleteSubtask } from '@/hooks/useSubtasks';
import { SubtaskForm } from '@/components/forms/SubtaskForm';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CheckCheck, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubtaskListProps {
  taskId: number;
}

export function SubtaskList({ taskId }: SubtaskListProps) {
  const { data: subtasks = [], isLoading } = useSubtasks(taskId);
  const createSubtask = useCreateSubtask();
  const updateSubtask = useUpdateSubtask();
  const deleteSubtask = useDeleteSubtask();

  const completed = subtasks.filter((s) => s.is_completed).length;
  const total = subtasks.length;

  if (isLoading) return <LoadingSpinner className="py-4" />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Subtarefas</h3>
          {total > 0 && (
            <span className="text-xs text-gray-500">
              {completed}/{total} concluídas
            </span>
          )}
        </div>
        {total > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <SubtaskForm
          taskId={taskId}
          onSubmit={(data) => createSubtask.mutate(data)}
          isLoading={createSubtask.isPending}
        />
        <div className="space-y-1 mt-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group"
            >
              <button
                onClick={() =>
                  updateSubtask.mutate({
                    id: subtask.id,
                    task_id: taskId,
                    title: subtask.title,
                    assignee_id: subtask.assignee_id,
                    status_id: subtask.status_id,
                    is_completed: !subtask.is_completed,
                  })
                }
                className={cn(
                  'h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                  subtask.is_completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-400'
                )}
              >
                {subtask.is_completed && <CheckCheck className="h-3 w-3" />}
              </button>
              <span
                className={cn(
                  'text-sm flex-1',
                  subtask.is_completed && 'line-through text-gray-400'
                )}
              >
                {subtask.title}
              </span>
              <button
                onClick={() =>
                  deleteSubtask.mutate({ id: subtask.id, taskId })
                }
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {subtasks.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              Nenhuma subtarefa ainda
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
