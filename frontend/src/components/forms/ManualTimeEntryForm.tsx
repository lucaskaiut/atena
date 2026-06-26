'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { manualTimeEntrySchema, ManualTimeEntryFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ManualTimeEntryFormProps {
  onSubmit: (data: ManualTimeEntryFormData) => void;
  isLoading?: boolean;
}

export function ManualTimeEntryForm({ onSubmit, isLoading }: ManualTimeEntryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualTimeEntryFormData>({
    resolver: zodResolver(manualTimeEntrySchema),
    defaultValues: {
      start_time: '',
      end_time: '',
      description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Início"
          id="start_time"
          type="datetime-local"
          {...register('start_time')}
          error={errors.start_time?.message}
        />
        <Input
          label="Fim"
          id="end_time"
          type="datetime-local"
          {...register('end_time')}
          error={errors.end_time?.message}
        />
      </div>
      <Input
        label="Descrição (opcional)"
        id="description"
        placeholder="O que foi feito?"
        {...register('description')}
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          Salvar
        </Button>
      </div>
    </form>
  );
}
