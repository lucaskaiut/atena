'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useStatuses } from '@/hooks/useStatuses';
import { useSprints } from '@/hooks/useSprints';
import { TaskTable } from '@/components/tasks/TaskTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterBar } from '@/components/ui/FilterBar';
import { Select } from '@/components/ui/Select';
import { TaskForm } from '@/components/forms/TaskForm';
import { TaskFilterParams } from '@/types';
import { useCreateTask } from '@/hooks/useTasks';
import { Plus } from 'lucide-react';

export default function TasksPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<TaskFilterParams>({
    page: 1,
    per_page: 15,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const createTask = useCreateTask();
  const { data: projectsData } = useProjects(1, '');
  const { data: clientsData } = useClients(1, '');
  const { data: statuses = [] } = useStatuses();
  const { data: sprintsData } = useSprints(1, '');

  const projectOptions =
    projectsData?.data.map((p) => ({
      value: p.id,
      label: p.name,
    })) || [];

  const clientOptions =
    clientsData?.data.map((c) => ({
      value: c.id,
      label: c.name,
    })) || [];

  const statusOptions = statuses.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const sprintOptions =
    sprintsData?.data.map((s) => ({
      value: s.id,
      label: s.name,
    })) || [];

  const hasFilters = !!(
    filters.search ||
    filters.project_id ||
    filters.client_id ||
    filters.responsible_id ||
    filters.priority ||
    filters.status_id ||
    filters.sprint_id
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          value={filters.search || ''}
          onChange={(val) => setFilters((f) => ({ ...f, search: val, page: 1 }))}
          placeholder="Buscar tarefas..."
          className="max-w-sm flex-1"
        />
      </div>

      <FilterBar
        onClear={() =>
          setFilters({
            page: 1,
            per_page: 15,
            sort_by: 'created_at',
            sort_order: 'desc',
          })
        }
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
              page: 1,
            }))
          }
          className="w-48"
        />
        <Select
          options={statusOptions}
          placeholderOption="Status"
          value={String(filters.status_id || '')}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status_id: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            }))
          }
          className="w-40"
        />
        <Select
          options={[
            { value: 'low', label: 'Baixa' },
            { value: 'medium', label: 'Média' },
            { value: 'high', label: 'Alta' },
            { value: 'critical', label: 'Crítica' },
          ]}
          placeholderOption="Prioridade"
          value={filters.priority || ''}
          onChange={(e) =>
            setFilters((f) => ({ ...f, priority: e.target.value || undefined, page: 1 }))
          }
          className="w-40"
        />
        <Select
          options={sprintOptions}
          placeholderOption="Sprint"
          value={String(filters.sprint_id || '')}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              sprint_id: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            }))
          }
          className="w-40"
        />
      </FilterBar>

      <TaskTable filters={filters} onFiltersChange={setFilters} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova Tarefa"
        size="lg"
      >
        <TaskForm
          onSubmit={(data) => {
            createTask.mutate(data, { onSuccess: () => setModalOpen(false) });
          }}
          isLoading={createTask.isPending}
          projectOptions={projectOptions}
          statusOptions={statusOptions}
          sprintOptions={sprintOptions}
        />
      </Modal>
    </div>
  );
}
