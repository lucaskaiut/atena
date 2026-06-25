'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { TaskFilterParams, Task } from '@/types';
import { getPriorityColor, getPriorityLabel, formatDate } from '@/lib/utils';

interface TaskTableProps {
  filters: TaskFilterParams;
  onFiltersChange: (filters: TaskFilterParams) => void;
}

export function TaskTable({ filters, onFiltersChange }: TaskTableProps) {
  const router = useRouter();
  const { data, isLoading } = useTasks(filters);
  const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    filters.sort_order || 'desc'
  );

  function handleSort(key: string) {
    const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(key);
    setSortOrder(newOrder);
    onFiltersChange({ ...filters, sort_by: key, sort_order: newOrder });
  }

  const columns = [
    {
      key: 'title',
      header: 'Título',
      sortable: true,
      render: (task: Task) => (
        <span className="font-medium text-gray-900">{task.title}</span>
      ),
    },
    {
      key: 'project',
      header: 'Projeto',
      render: (task: Task) => (
        <span className="text-gray-600">{task.project?.name || '-'}</span>
      ),
    },
    {
      key: 'assignee',
      header: 'Responsável',
      render: (task: Task) => (
        <span className="text-gray-600">{task.assignee?.name || '-'}</span>
      ),
    },
    {
      key: 'priority',
      header: 'Prioridade',
      render: (task: Task) => (
        <Badge className={getPriorityColor(task.priority)}>
          {getPriorityLabel(task.priority)}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (task: Task) => (
        <Badge color={task.status?.color}>{task.status?.name || '-'}</Badge>
      ),
    },
    {
      key: 'due_date',
      header: 'Prazo',
      sortable: true,
      render: (task: Task) => (
        <span className="text-gray-600">{formatDate(task.due_date)}</span>
      ),
    },
    {
      key: 'estimated_hours',
      header: 'Horas',
      render: (task: Task) => (
        <span className="text-gray-600">
          {task.worked_hours || 0}h / {task.estimated_hours || '-'}h
        </span>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        data={data?.data || ([] as unknown as Task[])}
        onRowClick={(task) => router.push(`/tasks/${task.id}`)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        isLoading={isLoading}
        emptyMessage="Nenhuma tarefa encontrada"
      />
      {data?.meta && (
        <Pagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          onPageChange={(page) =>
            onFiltersChange({ ...filters, page })
          }
        />
      )}
    </div>
  );
}
