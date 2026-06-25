'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subtaskSchema, SubtaskFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SubtaskFormProps {
  taskId: number;
  onSubmit: (data: SubtaskFormData) => void;
  isLoading?: boolean;
}

export function SubtaskForm({ taskId, onSubmit, isLoading }: SubtaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubtaskFormData>({
    resolver: zodResolver(subtaskSchema),
    defaultValues: { title: '', task_id: taskId, is_completed: false },
  });

  function handleFormSubmit(data: SubtaskFormData) {
    onSubmit(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex gap-2">
      <Input
        placeholder="Nova subtarefa..."
        {...register('title')}
        error={errors.title?.message}
        className="flex-1"
      />
      <Button type="submit" size="sm" isLoading={isLoading}>
        Adicionar
      </Button>
    </form>
  );
}
