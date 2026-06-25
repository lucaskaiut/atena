'use client';

import { useState } from 'react';
import { useEstimatesReport } from '@/hooks/useReports';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { Table } from '@/components/ui/Table';
import { FilterBar } from '@/components/ui/FilterBar';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { formatHours } from '@/lib/utils';

export default function EstimatesReportPage() {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | number | undefined>>({});

  const { data: items = [], isLoading } = useEstimatesReport(
    Object.keys(appliedFilters).length > 0 ? appliedFilters : {}
  );

  const { data: projectsData } = useProjects(1, '');
  const { data: clientsData } = useClients(1, '');

  const projectOptions =
    projectsData?.data.map((p) => ({ value: p.id, label: p.name })) || [];
  const clientOptions =
    clientsData?.data.map((c) => ({ value: c.id, label: c.name })) || [];

  const hasFilters = !!(filters.project_id || filters.client_id);

  const columns = [
    {
      key: 'project_name',
      header: 'Projeto',
      render: (item: { project_name: string; estimated_hours: number; worked_hours: number; tasks_count: number }) => (
        <span className="font-medium text-gray-900">{item.project_name}</span>
      ),
    },
    {
      key: 'tasks_count',
      header: 'Tarefas',
      render: (item: { project_name: string; estimated_hours: number; worked_hours: number; tasks_count: number }) => item.tasks_count,
    },
    {
      key: 'estimated_hours',
      header: 'Horas Estimadas',
      render: (item: { project_name: string; estimated_hours: number; worked_hours: number; tasks_count: number }) =>
        formatHours(item.estimated_hours),
    },
    {
      key: 'worked_hours',
      header: 'Horas Realizadas',
      render: (item: { project_name: string; estimated_hours: number; worked_hours: number; tasks_count: number }) =>
        formatHours(item.worked_hours),
    },
    {
      key: 'variance',
      header: 'Variação',
      render: (item: { project_name: string; estimated_hours: number; worked_hours: number; tasks_count: number }) => {
        const diff = item.worked_hours - item.estimated_hours;
        const pct =
          item.estimated_hours > 0
            ? ((diff / item.estimated_hours) * 100).toFixed(1)
            : '0';
        return (
          <span
            className={
              diff > 0
                ? 'text-red-600 font-medium'
                : diff < 0
                ? 'text-green-600 font-medium'
                : ''
            }
          >
            {diff > 0 ? '+' : ''}
            {formatHours(Math.abs(diff))} ({pct}%)
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Relatório de Estimativas</h1>

      <FilterBar
        onClear={() => {
          setFilters({});
          setAppliedFilters({});
        }}
        hasFilters={hasFilters}
      >
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
        data={items}
        isLoading={isLoading}
        emptyMessage="Nenhum dado de estimativas encontrado"
      />

      {!isLoading && items.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Total Estimado</p>
              <p className="text-lg font-bold">
                {formatHours(
                  items.reduce((sum, i) => sum + i.estimated_hours, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Realizado</p>
              <p className="text-lg font-bold">
                {formatHours(
                  items.reduce((sum, i) => sum + i.worked_hours, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Variação Total</p>
              <p className="text-lg font-bold">
                {formatHours(
                  items.reduce(
                    (sum, i) => sum + Math.abs(i.worked_hours - i.estimated_hours),
                    0
                  )
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
