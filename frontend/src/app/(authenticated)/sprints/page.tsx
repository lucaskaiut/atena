'use client';

import { useState } from 'react';
import {
  useSprints,
  useCreateSprint,
  useUpdateSprint,
  useCloseSprint,
} from '@/hooks/useSprints';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SprintForm } from '@/components/forms/SprintForm';
import { Sprint } from '@/types';
import { formatDate } from '@/lib/utils';
import { Plus, Pencil, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SprintsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);

  const { data, isLoading } = useSprints(page, search);
  const createSprint = useCreateSprint();
  const updateSprint = useUpdateSprint();
  const closeSprint = useCloseSprint();

  function handleCreate() {
    setSelectedSprint(null);
    setModalOpen(true);
  }

  function handleEdit(sprint: Sprint) {
    setSelectedSprint(sprint);
    setModalOpen(true);
  }

  const columns = [
    {
      key: 'name',
      header: 'Nome',
      render: (s: Sprint) => (
        <span className="font-medium text-gray-900">{s.name}</span>
      ),
    },
    {
      key: 'start_date',
      header: 'Início',
      render: (s: Sprint) => formatDate(s.start_date),
    },
    {
      key: 'end_date',
      header: 'Término',
      render: (s: Sprint) => formatDate(s.end_date),
    },
    {
      key: 'progress',
      header: 'Progresso',
      render: (s: Sprint) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{
                width: `${
                  s.tasks_count && s.tasks_count > 0
                    ? ((s.completed_tasks_count || 0) / s.tasks_count) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {s.completed_tasks_count || 0}/{s.tasks_count || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s: Sprint) => (
        <Badge
          className={
            s.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }
        >
          {s.is_active ? 'Ativa' : 'Fechada'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (s: Sprint) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(s);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {s.is_active && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSprint(s);
                setCloseOpen(true);
              }}
              title="Fechar Sprint"
            >
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sprints</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Nova Sprint
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar sprints..."
        className="max-w-sm"
      />

      <Table
        columns={columns}
        data={data?.data || ([] as unknown as Sprint[])}
        onRowClick={(sprint) => router.push(`/sprints/${sprint.id}`)}
        isLoading={isLoading}
        emptyMessage="Nenhuma sprint encontrada"
      />

      {data?.meta && (
        <Pagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          onPageChange={setPage}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedSprint ? 'Editar Sprint' : 'Nova Sprint'}
      >
        <SprintForm
          initialData={selectedSprint}
          onSubmit={(data) => {
            if (selectedSprint) {
              updateSprint.mutate(
                { ...data, id: selectedSprint.id },
                { onSuccess: () => setModalOpen(false) }
              );
            } else {
              createSprint.mutate(data, {
                onSuccess: () => setModalOpen(false),
              });
            }
          }}
          isLoading={createSprint.isPending || updateSprint.isPending}
        />
      </Modal>

      <ConfirmDialog
        isOpen={closeOpen}
        onClose={() => setCloseOpen(false)}
        onConfirm={() => {
          if (selectedSprint) {
            closeSprint.mutate(selectedSprint.id, {
              onSuccess: () => setCloseOpen(false),
            });
          }
        }}
        title="Fechar Sprint"
        message={`Tem certeza que deseja fechar a sprint "${selectedSprint?.name}"?`}
        variant="primary"
        confirmLabel="Fechar Sprint"
        isLoading={closeSprint.isPending}
      />
    </div>
  );
}
