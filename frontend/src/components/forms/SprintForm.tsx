'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sprintSchema, SprintFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Sprint } from '@/types';

interface SprintFormProps {
  onSubmit: (data: SprintFormData) => void;
  isLoading?: boolean;
  initialData?: Sprint | null;
  projectOptions: { value: number; label: string }[];
}

export function SprintForm({ onSubmit, isLoading, initialData, projectOptions }: SprintFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          goal: initialData.goal || '',
          start_date: initialData.start_date?.split('T')[0] || '',
          end_date: initialData.end_date?.split('T')[0] || '',
          project_id: initialData.project_id || null,
        }
      : {
          name: '',
          goal: '',
          start_date: '',
          end_date: '',
          project_id: null,
        },
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
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
          Objetivo
        </label>
        <textarea
          id="goal"
          {...register('goal')}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Data de Início"
          id="start_date"
          type="date"
          {...register('start_date')}
          error={errors.start_date?.message}
        />
        <Input
          label="Data de Término"
          id="end_date"
          type="date"
          {...register('end_date')}
          error={errors.end_date?.message}
        />
      </div>
      <Select
        label="Projeto"
        id="project_id"
        {...register('project_id', { valueAsNumber: true })}
        options={projectOptions}
        placeholderOption="Selecione..."
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Atualizar' : 'Criar'} Sprint
        </Button>
      </div>
    </form>
  );
}
