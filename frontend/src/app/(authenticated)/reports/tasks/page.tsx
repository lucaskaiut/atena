'use client';

import { useState } from 'react';
import { useTasksReport } from '@/hooks/useReports';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useStatuses } from '@/hooks/useStatuses';
import { Table } from '@/components/ui/Table';
import { FilterBar } from '@/components/ui/FilterBar';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getPriorityColor, getPriorityLabel, formatDate } from '@/lib/utils';

export default function TasksReportPage() {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({
    type: 'open',
  });
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | number | undefined>>({
    type: 'open',
  });

  const { data: tasks = [], isLoading } = useTasksReport(
    String(appliedFilters.type || 'open'),
    appliedFilters
  );

  const { data: projectsData } = useProjects(1, '');
  const { data: clientsData } = useClients(1, '');
  const { data: statuses = [] } = useStatuses();

  const projectOptions =
    projectsData?.data.map((p) => ({ value: p.id, label: p.name })) || [];
  const clientOptions =
    clientsData?.data.map((c) => ({ value: c.id, label: c.name })) || [];
  const statusOptions = statuses.map((s) => ({ value: s.id, label: s.name }));

  const hasFilters = !!(
    filters.project_id ||
    filters.client_id ||
    filters.status_id ||
    filters.priority
  );

  const columns = [
    {
      key: 'title',
      header: 'Título',
      render: (t: { id: number; title: string; status: string; priority: string; estimated_hours?: number; worked_hours?: number; created_at: string; completed_at?: string }) => (
        <span className="font-medium text-gray-900">{t.title}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t: { id: number; title: string; status: string; priority: string; estimated_hours?: number; worked_hours?: number; created_at: string; completed_at?: string }) => (
        <Badge>{t.status}</Badge>
      ),
    },
    {
      key: 'priority',
      header: 'Prioridade',
      render: (t: { id: number; title: string; status: string; priority: string; estimated_hours?: number; worked_hours?: number; created_at: string; completed_at?: string }) => (
        <Badge className={getPriorityColor(t.priority)}>
          {getPriorityLabel(t.priority)}
        </Badge>
      ),
    },
    {
      key: 'estimated_hours',
      header: 'Horas Est.',
      render: (t: { id: number; title: string; status: string; priority: string; estimated_hours?: number; worked_hours?: number; created_at: string; completed_at?: string }) =>
        t.estimated_hours ? `${t.estimated_hours}h` : '-',
    },
    {
      key: 'worked_hours',
      header: 'Horas Trab.',
      render: (t: { id: number; title: string; status: string; priority: string; estimated_hours?: number; worked_hours?: number; created_at: string; completed_at?: string }) =>
        t.worked_hours ? `${t.worked_hours}h` : '0h',
    },
    {
      key: 'created_at',
      header: 'Criada em',
      render: (t: { id: number; title: string; status: string; priority: string; estimated_hours?: number; worked_hours?: number; created_at: string; completed_at?: string }) =>
        formatDate(t.created_at),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Relatório de Tarefas</h1>

      <FilterBar
        onClear={() => {
          setFilters({ type: filters.type });
          setAppliedFilters({ type: filters.type });
        }}
        hasFilters={hasFilters}
      >
        <Select
          options={[
            { value: 'open', label: 'Abertas' },
            { value: 'completed', label: 'Concluídas' },
            { value: 'late', label: 'Atrasadas' },
          ]}
          value={String(filters.type || 'open')}
          onChange={(e) =>
            setFilters((f) => ({ ...f, type: e.target.value }))
          }
          className="w-36"
        />
        <Select
          options={projectOptions}
          placeholderOption="Projeto"
          value={String(filters.project_id || '')}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              project_id: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          className="w-44"
        />
        <Select
          options={clientOptions}
          placeholderOption="Cliente"
          value={String(filters.client_id || '')}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              client_id: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          className="w-44"
        />
        <Select
          options={statusOptions}
          placeholderOption="Status"
          value={String(filters.status_id || '')}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status_id: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          className="w-36"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => setAppliedFilters({ ...filters })}
        >
          Filtrar
        </Button>
      </FilterBar>

      <Table
        columns={columns}
        data={tasks}
        isLoading={isLoading}
        emptyMessage="Nenhuma tarefa encontrada"
      />
    </div>
  );
}
