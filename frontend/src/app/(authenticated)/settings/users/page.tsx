'use client';

import { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UserForm } from '@/components/forms/UserForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import api from '@/lib/api';
import { User, PaginatedResponse } from '@/types';
import { Plus, Pencil, UserCheck, UserX } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  function loadUsers() {
    setIsLoading(true);
    api
      .get<PaginatedResponse<User>>('/users?per_page=100')
      .then(({ data }) => setUsers(data.data))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = useMutation({
    mutationFn: async (payload: { name: string; email: string; password?: string; role: string; is_active: boolean }) => {
      const { data } = await api.post<{ data: User }>('/users', payload);
      return data;
    },
    onSuccess: () => {
      setModalOpen(false);
      loadUsers();
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: number;
      name: string;
      email: string;
      password?: string;
      role: string;
      is_active: boolean;
    }) => {
      const { data } = await api.put<{ data: User }>(`/users/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      setModalOpen(false);
      loadUsers();
    },
  });

  const toggleUser = useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      await api.patch(`/users/${id}/toggle`, { is_active });
    },
    onSuccess: () => {
      setToggleOpen(false);
      loadUsers();
    },
  });

  function handleCreate() {
    setSelectedUser(null);
    setModalOpen(true);
  }

  function handleEdit(user: User) {
    setSelectedUser(user);
    setModalOpen(true);
  }

  function handleToggle(user: User) {
    setSelectedUser(user);
    setToggleOpen(true);
  }

  const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Perfil',
      render: (u: User) => (
        <Badge
          className={
            u.role === 'admin'
              ? 'bg-purple-100 text-purple-800'
              : u.role === 'manager'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }
        >
          {u.role === 'admin'
            ? 'Admin'
            : u.role === 'manager'
            ? 'Gerente'
            : 'Usuário'}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (u: User) => (
        <Badge
          className={
            u.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }
        >
          {u.is_active ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (u: User) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(u);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle(u);
            }}
          >
            {u.is_active ? (
              <UserX className="h-4 w-4 text-red-500" />
            ) : (
              <UserCheck className="h-4 w-4 text-green-600" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-8" />
      ) : (
        <Table
          columns={columns}
          data={users}
          emptyMessage="Nenhum usuário encontrado"
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <UserForm
          initialData={selectedUser}
          onSubmit={(data) => {
            // Remove empty password on edit
            const payload = {
              ...data,
              ...(selectedUser && !data.password ? { password: undefined } : {}),
            };
            if (selectedUser) {
              updateUser.mutate({ id: selectedUser.id, ...payload } as {
                id: number;
                name: string;
                email: string;
                password?: string;
                role: string;
                is_active: boolean;
              });
            } else {
              createUser.mutate(payload as {
                name: string;
                email: string;
                password: string;
                role: string;
                is_active: boolean;
              });
            }
          }}
          isLoading={createUser.isPending || updateUser.isPending}
        />
      </Modal>

      <ConfirmDialog
        isOpen={toggleOpen}
        onClose={() => setToggleOpen(false)}
        onConfirm={() => {
          if (selectedUser) {
            toggleUser.mutate({
              id: selectedUser.id,
              is_active: !selectedUser.is_active,
            });
          }
        }}
        title={
          selectedUser?.is_active ? 'Inativar Usuário' : 'Ativar Usuário'
        }
        message={
          selectedUser?.is_active
            ? `Tem certeza que deseja inativar o usuário "${selectedUser?.name}"?`
            : `Tem certeza que deseja ativar o usuário "${selectedUser?.name}"?`
        }
        variant={selectedUser?.is_active ? 'danger' : 'primary'}
        confirmLabel={
          selectedUser?.is_active ? 'Inativar' : 'Ativar'
        }
        isLoading={toggleUser.isPending}
      />
    </div>
  );
}
