'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Client } from '@/types';

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  isLoading?: boolean;
  initialData?: Client | null;
}

export function ClientForm({ onSubmit, isLoading, initialData }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData
      ? { ...initialData, phone: initialData.phone || '', email: initialData.email || '', company_name: initialData.company_name || '', notes: initialData.notes || '' }
      : { name: '', email: '', phone: '', company_name: '', status: 'active', notes: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome"
        id="name"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        id="email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input label="Telefone" id="phone" {...register('phone')} />
      <Input
        label="Empresa"
        id="company_name"
        {...register('company_name')}
      />
      <Select
        label="Status"
        id="status"
        {...register('status')}
        options={[
          { value: 'active', label: 'Ativo' },
          { value: 'inactive', label: 'Inativo' },
        ]}
        error={errors.status?.message}
      />
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Atualizar' : 'Criar'} Cliente
        </Button>
      </div>
    </form>
  );
}
