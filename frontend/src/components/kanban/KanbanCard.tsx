'use client';

import { Task } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { getPriorityColor, getPriorityLabel } from '@/lib/utils';
import { useStartTimeEntry, useStopTimeEntry } from '@/hooks/useTimeEntries';
import { Clock, User, Play, Pause } from 'lucide-react';

interface KanbanCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export function KanbanCard({ task, onDragStart }: KanbanCardProps) {
  const startEntry = useStartTimeEntry();
  const stopEntry = useStopTimeEntry();

  const runningEntry = task.time_entries?.find((e) => e.end_time === null);
  const isRunning = !!runningEntry;

  function handleToggle() {
    if (isRunning && runningEntry) {
      stopEntry.mutate(runningEntry.id);
    } else {
      startEntry.mutate({ task_id: task.id });
    }
  }

  const isPending = startEntry.isPending || stopEntry.isPending;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative group"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
          {task.title}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          disabled={isPending}
          className={`shrink-0 p-1 rounded-md transition-all ${
            isRunning
              ? 'opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50'
              : 'opacity-0 group-hover:opacity-100 text-green-600 hover:bg-green-50'
          }`}
          title={isRunning ? 'Pausar' : 'Iniciar'}
        >
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-1">
        <Badge className={getPriorityColor(task.priority)}>
          {getPriorityLabel(task.priority)}
        </Badge>
        {task.estimated_hours && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {task.estimated_hours}h
          </span>
        )}
      </div>
      {task.assignee && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <User className="h-3 w-3" />
          {task.assignee.name}
        </div>
      )}
      {task.subtasks_count != null && task.subtasks_count > 0 && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Subtarefas</span>
            <span>
              {task.completed_subtasks_count || 0}/{task.subtasks_count}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full"
              style={{
                width: `${
                  task.subtasks_count > 0
                    ? ((task.completed_subtasks_count || 0) / task.subtasks_count) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
