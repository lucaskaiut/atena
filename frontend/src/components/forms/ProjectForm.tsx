'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Project } from '@/types';

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  isLoading?: boolean;
  initialData?: Project | null;
  clientOptions: { value: number; label: string }[];
  managerOptions: { value: number; label: string }[];
  statusOptions: { value: number; label: string }[];
}

export function ProjectForm({
  onSubmit,
  isLoading,
  initialData,
  clientOptions,
  managerOptions,
  statusOptions,
}: ProjectFormProps) {
  const defaultValues: ProjectFormData = initialData
    ? {
        name: initialData.name,
        description: initialData.description || '',
        client_id: initialData.client_id || null,
        manager_id: initialData.manager_id || null,
        status_id: initialData.status_id || null,
        priority: initialData.priority,
        estimated_hours: initialData.estimated_hours || null,
        planned_start_date: initialData.planned_start_date || '',
        planned_end_date: initialData.planned_end_date || '',
        budget: initialData.budget || null,
      }
    : {
        name: '',
        description: '',
        client_id: null,
        manager_id: null,
        status_id: null,
        priority: 'medium',
        estimated_hours: null,
        planned_start_date: '',
        planned_end_date: '',
        budget: null,
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome"
        id="name"
        {...register('name')}
        error={errors.name?.message}
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
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Cliente"
          id="client_id"
          {...register('client_id', { valueAsNumber: true })}
          options={clientOptions}
          placeholderOption="Selecione..."
        />
        <Select
          label="Gerente"
          id="manager_id"
          {...register('manager_id', { valueAsNumber: true })}
          options={managerOptions}
          placeholderOption="Selecione..."
        />
      </div>
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
        <Input
          label="Orçamento"
          id="budget"
          type="number"
          step="0.01"
          {...register('budget', { valueAsNumber: true })}
        />
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
      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Atualizar' : 'Criar'} Projeto
        </Button>
      </div>
    </form>
  );
}
