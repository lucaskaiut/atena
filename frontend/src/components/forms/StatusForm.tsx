'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { statusSchema, StatusFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface StatusFormProps {
  onSubmit: (data: StatusFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<StatusFormData>;
}

export function StatusForm({ onSubmit, isLoading, initialData }: StatusFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: initialData || {
      name: '',
      color: '#3b82f6',
      order: 0,
      is_active: true,
      type: 'task',
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Cor
          </label>
          <input
            id="color"
            type="color"
            {...register('color')}
            className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
        </div>
        <Input
          label="Ordem"
          id="order"
          type="number"
          {...register('order', { valueAsNumber: true })}
          error={errors.order?.message}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Tipo"
          id="type"
          {...register('type')}
          options={[
            { value: 'task', label: 'Tarefa' },
            { value: 'project', label: 'Projeto' },
          ]}
          error={errors.type?.message}
        />
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('is_active')}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">Ativo</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Atualizar' : 'Criar'} Status
        </Button>
      </div>
    </form>
  );
}
