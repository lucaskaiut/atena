'use client';

import { useState } from 'react';
import { useHoursReport } from '@/hooks/useReports';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useSprints } from '@/hooks/useSprints';
import { Table } from '@/components/ui/Table';
import { FilterBar } from '@/components/ui/FilterBar';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDate, formatHours } from '@/lib/utils';
import { TimeEntry } from '@/types';

export default function HoursReportPage() {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | number | undefined>>({});

  const { data: entries = [], isLoading } = useHoursReport(
    Object.keys(appliedFilters).length > 0 ? appliedFilters : {}
  );

  const { data: projectsData } = useProjects(1, '');
  const { data: clientsData } = useClients(1, '');
  const { data: sprintsData } = useSprints(1, '');

  const projectOptions =
    projectsData?.data.map((p) => ({ value: p.id, label: p.name })) || [];
  const clientOptions =
    clientsData?.data.map((c) => ({ value: c.id, label: c.name })) || [];
  const sprintOptions =
    sprintsData?.data.map((s) => ({ value: s.id, label: s.name })) || [];

  const totalHours =
    entries.reduce((sum, e) => sum + (e.duration_minutes || 0), 0) / 60;

  const hasFilters = Object.keys(filters).length > 0;

  const columns = [
    {
      key: 'user',
      header: 'Usuário',
      render: (e: TimeEntry) => e.user?.name || '-',
    },
    {
      key: 'task',
      header: 'Tarefa',
      render: (e: TimeEntry) => e.task?.title || '-',
    },
    {
      key: 'description',
      header: 'Descrição',
      render: (e: TimeEntry) => e.description || '-',
    },
    {
      key: 'start_time',
      header: 'Início',
      render: (e: TimeEntry) => formatDate(e.start_time, 'long'),
    },
    {
      key: 'end_time',
      header: 'Fim',
      render: (e: TimeEntry) =>
        e.end_time ? formatDate(e.end_time, 'long') : 'Em andamento',
    },
    {
      key: 'duration',
      header: 'Duração',
      render: (e: TimeEntry) =>
        formatHours((e.duration_minutes || 0) / 60),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Relatório de Horas</h1>

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
        <Select
          options={sprintOptions}
          placeholderOption="Sprint"
          value={String(filters.sprint_id || '')}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              sprint_id: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          className="w-44"
        />
        <Input
          type="date"
          placeholder="Data início"
          value={String(filters.start_date || '')}
          onChange={(e) =>
            setFilters((f) => ({ ...f, start_date: e.target.value || undefined }))
          }
          className="w-36"
        />
        <Input
          type="date"
          placeholder="Data fim"
          value={String(filters.end_date || '')}
          onChange={(e) =>
            setFilters((f) => ({ ...f, end_date: e.target.value || undefined }))
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

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-sm text-gray-500">
          Total de horas:{' '}
          <span className="font-bold text-gray-900">{formatHours(totalHours)}</span>
        </p>
      </div>

      <Table
        columns={columns}
        data={entries}
        isLoading={isLoading}
        emptyMessage="Nenhum registro de horas encontrado"
      />
    </div>
  );
}
