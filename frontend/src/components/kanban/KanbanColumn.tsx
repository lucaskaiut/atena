'use client';

import { Task, ProjectStatus } from '@/types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: ProjectStatus;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDrop: (e: React.DragEvent, statusId: number) => void;
}

export function KanbanColumn({ status, tasks, onDragStart, onDrop }: KanbanColumnProps) {
  return (
    <div
      className="flex-shrink-0 w-72 flex flex-col bg-gray-100 rounded-xl h-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, status.id)}
    >
      <div
        className="px-4 py-3 rounded-t-xl flex items-center justify-between shrink-0"
        style={{ backgroundColor: status.color + '20' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: status.color }}
          />
          <h3 className="text-sm font-semibold" style={{ color: status.color }}>
            {status.name}
          </h3>
        </div>
        <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-0">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-xs text-gray-400">
            Nenhuma tarefa
          </div>
        )}
      </div>
    </div>
  );
}
