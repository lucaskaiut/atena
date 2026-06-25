'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, TaskFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Task } from '@/types';

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  isLoading?: boolean;
  initialData?: Task | null;
  projectOptions: { value: number; label: string }[];
  statusOptions: { value: number; label: string }[];
  sprintOptions: { value: number; label: string }[];
  parentTaskOptions?: { value: number; label: string }[];
  userOptions?: { value: number; label: string }[];
}

export function TaskForm({
  onSubmit,
  isLoading,
  initialData,
  projectOptions,
  statusOptions,
  sprintOptions,
  parentTaskOptions,
  userOptions,
}: TaskFormProps) {
  const defaultValues: TaskFormData = initialData
    ? {
        title: initialData.title,
        description: initialData.description || '',
        project_id: initialData.project_id,
        parent_id: initialData.parent_id || null,
        status_id: initialData.status_id || null,
        priority: initialData.priority,
        estimated_hours: initialData.estimated_hours || null,
        due_date: initialData.due_date || '',
        planned_start_date: initialData.planned_start_date || '',
        planned_end_date: initialData.planned_end_date || '',
        sprint_id: initialData.sprint_id || null,
        assignee_ids: initialData.assignees?.map((u) => u.id) || [],
      }
    : {
        title: '',
        description: '',
        project_id: 0,
        parent_id: null,
        status_id: null,
        priority: 'medium',
        estimated_hours: null,
        due_date: '',
        planned_start_date: '',
        planned_end_date: '',
        sprint_id: null,
        assignee_ids: [],
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título"
        id="title"
        {...register('title')}
        error={errors.title?.message}
      />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <Select
        label="Projeto"
        id="project_id"
        {...register('project_id', { valueAsNumber: true })}
        options={projectOptions}
        error={errors.project_id?.message}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          id="status_id"
          {...register('status_id', { valueAsNumber: true })}
          options={statusOptions}
          placeholderOption="Selecione..."
        />
        <Select
          label="Prioridade"
          id="priority"
          {...register('priority')}
          options={priorityOptions}
          error={errors.priority?.message}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Horas Estimadas"
          id="estimated_hours"
          type="number"
          step="0.5"
          {...register('estimated_hours', { valueAsNumber: true })}
        />
        <Input label="Prazo" id="due_date" type="date" {...register('due_date')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Data de Início Planejada"
          id="planned_start_date"
          type="date"
          {...register('planned_start_date')}
        />
        <Input
          label="Data de Término Planejada"
          id="planned_end_date"
          type="date"
          {...register('planned_end_date')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Sprint"
          id="sprint_id"
          {...register('sprint_id', { valueAsNumber: true })}
          options={sprintOptions}
          placeholderOption="Selecione..."
        />
        {parentTaskOptions && (
          <Select
            label="Tarefa Pai"
            id="parent_id"
            {...register('parent_id', { valueAsNumber: true })}
            options={parentTaskOptions}
            placeholderOption="Nenhuma..."
          />
        )}
      </div>
      {userOptions && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Responsáveis
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
            {userOptions.map((user) => (
              <label key={user.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  value={user.value}
                  {...register('assignee_ids')}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                {user.label}
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Atualizar' : 'Criar'} Tarefa
        </Button>
      </div>
    </form>
  );
}
