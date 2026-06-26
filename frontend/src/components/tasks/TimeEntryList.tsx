'use client';

import { useState } from 'react';
import { useTimeEntries, useDeleteTimeEntry, useCreateManualEntry } from '@/hooks/useTimeEntries';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ManualTimeEntryForm } from '@/components/forms/ManualTimeEntryForm';
import { ManualTimeEntryFormData } from '@/lib/validators';
import { formatDate, formatHours, formatTime } from '@/lib/utils';
import { Trash2, Clock, Plus } from 'lucide-react';

interface TimeEntryListProps {
  taskId: number;
}

export function TimeEntryList({ taskId }: TimeEntryListProps) {
  const { data: entries = [], isLoading } = useTimeEntries(taskId);
  const deleteEntry = useDeleteTimeEntry();
  const createEntry = useCreateManualEntry();
  const [modalOpen, setModalOpen] = useState(false);

  function handleCreate(data: ManualTimeEntryFormData) {
    createEntry.mutate(
      { ...data, task_id: taskId },
      { onSuccess: () => setModalOpen(false) }
    );
  }

  if (isLoading) return <LoadingSpinner className="py-4" />;

  const totalMinutes = entries.reduce(
    (sum, e) => sum + (e.duration_minutes || 0),
    0
  );
  const totalHours = totalMinutes / 60;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Registros de Tempo
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                Total: {formatHours(totalHours)}
              </span>
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Novo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Nenhum registro de tempo
            </p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-700">
                        {entry.description || 'Sem descrição'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.user?.name} • {formatDate(entry.start_time)} {formatTime(entry.start_time)}
                        {entry.end_time &&
                          ` → ${formatTime(entry.end_time)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      {formatHours((entry.duration_minutes || 0) / 60)}
                    </span>
                    <button
                      onClick={() => deleteEntry.mutate(entry.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Apontamento Manual"
      >
        <ManualTimeEntryForm
          onSubmit={handleCreate}
          isLoading={createEntry.isPending}
        />
      </Modal>
    </>
  );
}
