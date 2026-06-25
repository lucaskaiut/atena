'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { timeEntrySchema, TimeEntryFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface TimeEntryFormProps {
  taskId: number;
  onSubmit: (data: TimeEntryFormData) => void;
  isLoading?: boolean;
}

export function TimeEntryForm({ taskId, onSubmit, isLoading }: TimeEntryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: { task_id: taskId, description: '' },
  });

  function handleFormSubmit(data: TimeEntryFormData) {
    onSubmit(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex gap-2">
      <Input
        placeholder="O que você está fazendo?"
        {...register('description')}
        className="flex-1"
      />
      <Button type="submit" size="sm" isLoading={isLoading}>
        Iniciar
      </Button>
    </form>
  );
}
