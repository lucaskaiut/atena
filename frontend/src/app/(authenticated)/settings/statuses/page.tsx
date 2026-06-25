'use client';

import { useState } from 'react';
import {
  useStatuses,
  useCreateStatus,
  useUpdateStatus,
  useReorderStatuses,
} from '@/hooks/useStatuses';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { StatusForm } from '@/components/forms/StatusForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProjectStatus } from '@/types';
import { Plus, Pencil, GripVertical } from 'lucide-react';

export default function StatusesPage() {
  const [type, setType] = useState<'project' | 'task'>('task');
  const { data: statuses = [], isLoading } = useStatuses(type);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(
    null
  );

  const createStatus = useCreateStatus();
  const updateStatus = useUpdateStatus();
  const reorderStatuses = useReorderStatuses();

  function handleCreate() {
    setSelectedStatus(null);
    setModalOpen(true);
  }

  function handleEdit(status: ProjectStatus) {
    setSelectedStatus(status);
    setModalOpen(true);
  }

  function handleDragStart(
    e: React.DragEvent,
    index: number
  ) {
    e.dataTransfer.setData('text/plain', String(index));
  }

  function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const reordered = [...statuses];
    const [removed] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, removed);

    reorderStatuses.mutate(
      reordered.map((s, i) => ({ id: s.id, order: i }))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Status</h1>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setType('task')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                type === 'task'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Tarefas
            </button>
            <button
              onClick={() => setType('project')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                type === 'project'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Projetos
            </button>
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Novo Status
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-8" />
      ) : statuses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Nenhum status cadastrado
        </div>
      ) : (
        <div className="space-y-2">
          {statuses.map((status, index) => (
            <div
              key={status.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <GripVertical className="h-4 w-4 text-gray-300 cursor-grab" />
              <div
                className="h-6 w-6 rounded-full border-2"
                style={{ backgroundColor: status.color, borderColor: status.color }}
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {status.name}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  Ordem: {status.order}
                </span>
              </div>
              <Badge
                className={
                  status.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-500'
                }
              >
                {status.is_active ? 'Ativo' : 'Inativo'}
              </Badge>
              <Badge className="bg-gray-100 text-gray-600">
                {status.type === 'task' ? 'Tarefa' : 'Projeto'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(status)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedStatus ? 'Editar Status' : 'Novo Status'}
      >
        <StatusForm
          initialData={
            selectedStatus
              ? {
                  name: selectedStatus.name,
                  color: selectedStatus.color,
                  order: selectedStatus.order,
                  is_active: selectedStatus.is_active,
                  type: selectedStatus.type,
                }
              : { name: '', color: '#3b82f6', order: statuses.length, is_active: true, type }
          }
          onSubmit={(data) => {
            if (selectedStatus) {
              updateStatus.mutate(
                { ...data, id: selectedStatus.id },
                { onSuccess: () => setModalOpen(false) }
              );
            } else {
              createStatus.mutate(data, {
                onSuccess: () => setModalOpen(false),
              });
            }
          }}
          isLoading={createStatus.isPending || updateStatus.isPending}
        />
      </Modal>
    </div>
  );
}
