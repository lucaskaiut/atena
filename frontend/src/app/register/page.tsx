'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Lock, Mail, User, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const { register: registerUser, isLoading, registerError } = useAuth();
  const { isAuthenticated, isLoading: storeLoading } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (!storeLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [router, isAuthenticated, storeLoading]);

  function onSubmit(data: RegisterFormData) {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      company_name: data.company_name || undefined,
      corporate_name: data.corporate_name || undefined,
      cnpj: data.cnpj || undefined,
    };
    registerUser(payload);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Atena</h1>
          <p className="text-gray-500 mt-2">Task Management System</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Criar conta</h2>

          {registerError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {(registerError as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Erro ao criar conta. Verifique os dados informados.'}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
              <Input
                label="Nome"
                id="name"
                type="text"
                placeholder="Seu nome"
                className="pl-10"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
              <Input
                label="Email"
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
              <Input
                label="Senha"
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                className="pl-10"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>

            <div className="border-t border-gray-200 my-4" />

            <p className="text-sm font-medium text-gray-700">Dados da empresa</p>

            <div className="relative">
              <Building2 className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
              <Input
                label="Nome da empresa"
                id="company_name"
                type="text"
                placeholder="Nome fantasia"
                className="pl-10"
                {...register('company_name')}
                error={errors.company_name?.message}
              />
            </div>

            <Input
              label="Razão social (opcional)"
              id="corporate_name"
              type="text"
              placeholder="Razão social"
              {...register('corporate_name')}
              error={errors.corporate_name?.message}
            />

            <Input
              label="CNPJ (opcional)"
              id="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              {...register('cnpj')}
              error={errors.cnpj?.message}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Criar conta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
