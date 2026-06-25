'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, UserFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { User } from '@/types';

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
  initialData?: User | null;
}

export function UserForm({ onSubmit, isLoading, initialData }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          password: '',
          role: initialData.role,
          is_active: initialData.is_active,
        }
      : {
          name: '',
          email: '',
          password: '',
          role: 'user',
          is_active: true,
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
      <Input
        label="Email"
        id="email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Senha"
        id="password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        placeholder={initialData ? 'Deixe em branco para manter' : ''}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Perfil"
          id="role"
          {...register('role')}
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'manager', label: 'Gerente' },
            { value: 'user', label: 'Usuário' },
          ]}
          error={errors.role?.message}
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
          {initialData ? 'Atualizar' : 'Criar'} Usuário
        </Button>
      </div>
    </form>
  );
}
