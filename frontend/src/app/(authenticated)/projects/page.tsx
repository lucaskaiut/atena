'use client';

import { useState } from 'react';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useCloseProject,
} from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useStatuses } from '@/hooks/useStatuses';
import { useUsers } from '@/hooks/useUsers';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterBar } from '@/components/ui/FilterBar';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { Project } from '@/types';
import { getPriorityColor, getPriorityLabel, formatDate } from '@/lib/utils';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [closeType, setCloseType] = useState<string>('completed');

  const { data, isLoading } = useProjects(page, search, filters);
  const { data: clientsData } = useClients(1, '');
  const { data: statuses = [] } = useStatuses('project');
  const { data: usersData } = useUsers(1, '');
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const closeProject = useCloseProject();

  const clientOptions =
    clientsData?.data.map((c) => ({
      value: c.id,
      label: c.name,
    })) || [];

  const managerOptions =
    usersData?.data.map((u) => ({
      value: u.id,
      label: u.name,
    })) || [];

  const statusOptions = statuses.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  function handleCreate() {
    setSelectedProject(null);
    setModalOpen(true);
  }

  function handleEdit(project: Project) {
    setSelectedProject(project);
    setModalOpen(true);
  }

  function handleSubmit(formData: Parameters<typeof createProject.mutate>[0]) {
    if (selectedProject) {
      updateProject.mutate(
        { ...formData, id: selectedProject.id },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createProject.mutate(formData, { onSuccess: () => setModalOpen(false) });
    }
  }

  const hasFilters = Object.keys(filters).length > 0;

  const columns = [
    {
      key: 'name',
      header: 'Nome',
      sortable: true,
      render: (p: Project) => (
        <span className="font-medium text-gray-900">{p.name}</span>
      ),
    },
    {
      key: 'client',
      header: 'Cliente',
      render: (p: Project) => p.client?.name || '-',
    },
    {
      key: 'priority',
      header: 'Prioridade',
      render: (p: Project) => (
        <Badge className={getPriorityColor(p.priority)}>
          {getPriorityLabel(p.priority)}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Project) => (
        <Badge color={p.status?.color}>{p.status?.name || '-'}</Badge>
      ),
    },
    {
      key: 'planned_end_date',
      header: 'Prazo',
      render: (p: Project) => formatDate(p.planned_end_date),
    },
    {
      key: 'progress',
      header: 'Progresso',
      render: (p: Project) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{
                width: `${
                  p.total_tasks_count && p.total_tasks_count > 0
                    ? ((p.completed_tasks_count || 0) / p.total_tasks_count) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {p.completed_tasks_count || 0}/{p.total_tasks_count || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (p: Project) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(p);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {p.is_active && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(p);
                  setCloseType('completed');
                  setCloseOpen(true);
                }}
                title="Concluir"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(p);
                  setCloseType('cancelled');
                  setCloseOpen(true);
                }}
                title="Cancelar"
              >
                <XCircle className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProject(p);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar projetos..."
          className="max-w-sm flex-1"
        />
      </div>

      <FilterBar
        onClear={() => setFilters({})}
        hasFilters={hasFilters}
      >
        <Select
          options={clientOptions}
          placeholderOption="Cliente"
          value={filters.client_id || ''}
          onChange={(e) =>
            setFilters((f) => ({ ...f, client_id: e.target.value }))
          }
          className="w-48"
        />
        <Select
          options={statusOptions}
          placeholderOption="Status"
          value={filters.status_id || ''}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status_id: e.target.value }))
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
            setFilters((f) => ({ ...f, priority: e.target.value }))
          }
          className="w-40"
        />
      </FilterBar>

      <Table
        columns={columns}
        data={data?.data || ([] as unknown as Project[])}
        isLoading={isLoading}
        emptyMessage="Nenhum projeto encontrado"
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
        title={selectedProject ? 'Editar Projeto' : 'Novo Projeto'}
        size="lg"
      >
        <ProjectForm
          initialData={selectedProject}
          onSubmit={handleSubmit}
          isLoading={createProject.isPending || updateProject.isPending}
          clientOptions={clientOptions}
          managerOptions={managerOptions}
          statusOptions={statusOptions}
        />
      </Modal>

      <ConfirmDialog
        isOpen={closeOpen}
        onClose={() => setCloseOpen(false)}
        onConfirm={() => {
          if (selectedProject) {
            closeProject.mutate(
              { id: selectedProject.id, status: closeType },
              { onSuccess: () => setCloseOpen(false) }
            );
          }
        }}
        title={closeType === 'completed' ? 'Concluir Projeto' : 'Cancelar Projeto'}
        message={
          closeType === 'completed'
            ? `Tem certeza que deseja concluir o projeto "${selectedProject?.name}"?`
            : `Tem certeza que deseja cancelar o projeto "${selectedProject?.name}"?`
        }
        variant={closeType === 'completed' ? 'primary' : 'danger'}
        confirmLabel={closeType === 'completed' ? 'Concluir' : 'Cancelar'}
        isLoading={closeProject.isPending}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (selectedProject) {
            deleteProject.mutate(selectedProject.id, {
              onSuccess: () => setDeleteOpen(false),
            });
          }
        }}
        title="Excluir Projeto"
        message={`Tem certeza que deseja excluir o projeto "${selectedProject?.name}"? Esta ação não pode ser desfeita.`}
        isLoading={deleteProject.isPending}
      />
    </div>
  );
}
