'use client';

import { useKanban } from '@/hooks/useKanban';
import { useUpdateTaskStatus } from '@/hooks/useTasks';
import { KanbanColumn } from './KanbanColumn';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useState } from 'react';
import { SearchInput } from '@/components/ui/SearchInput';

interface KanbanBoardProps {
  projectId?: number;
  sprintId?: number;
}

export function KanbanBoard({ projectId, sprintId }: KanbanBoardProps) {
  const { data: columns, isLoading } = useKanban(projectId, sprintId);
  const updateStatus = useUpdateTaskStatus();
  const [search, setSearch] = useState('');

  function handleDragStart(e: React.DragEvent, task: import('@/types').Task) {
    e.dataTransfer.setData('taskId', String(task.id));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDrop(e: React.DragEvent, statusId: number) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateStatus.mutate({ id: Number(taskId), status_id: statusId });
    }
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-12" />;
  }

  const filteredColumns = columns?.map((col) => ({
    ...col,
    tasks: col.tasks.filter(
      (t) =>
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <div>
      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Filtrar tarefas..."
          className="max-w-xs"
        />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {filteredColumns?.map((col) => (
          <KanbanColumn
            key={col.status_id}
            status={col.status}
            tasks={col.tasks}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
