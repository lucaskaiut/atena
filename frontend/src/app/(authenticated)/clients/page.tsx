'use client';

import { useState } from 'react';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/useClients';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ClientForm } from '@/components/forms/ClientForm';
import { Client } from '@/types';
import { getStatusColor, formatDate } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data, isLoading } = useClients(page, search);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  function handleCreate() {
    setSelectedClient(null);
    setModalOpen(true);
  }

  function handleEdit(client: Client) {
    setSelectedClient(client);
    setModalOpen(true);
  }

  function handleDelete(client: Client) {
    setSelectedClient(client);
    setDeleteOpen(true);
  }

  function handleSubmit(formData: Parameters<typeof createClient.mutate>[0]) {
    if (selectedClient) {
      updateClient.mutate(
        { ...formData, id: selectedClient.id },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createClient.mutate(formData, { onSuccess: () => setModalOpen(false) });
    }
  }

  const columns = [
    { key: 'name', header: 'Nome', sortable: true },
    {
      key: 'email',
      header: 'Email',
      render: (c: Client) => c.email || '-',
    },
    {
      key: 'company_name',
      header: 'Empresa',
      render: (c: Client) => c.company_name || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (c: Client) => (
        <Badge className={getStatusColor(c.status)}>
          {c.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Criado em',
      render: (c: Client) => formatDate(c.created_at),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (c: Client) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(c); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(c); }}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar clientes..."
        className="max-w-sm"
      />

      <Table
        columns={columns}
        data={data?.data || ([] as unknown as Client[])}
        isLoading={isLoading}
        emptyMessage="Nenhum cliente encontrado"
      />

      {data?.meta && (
        <Pagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          onPageChange={setPage}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedClient ? 'Editar Cliente' : 'Novo Cliente'}
      >
        <ClientForm
          initialData={selectedClient}
          onSubmit={handleSubmit}
          isLoading={createClient.isPending || updateClient.isPending}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (selectedClient) {
            deleteClient.mutate(selectedClient.id, {
              onSuccess: () => setDeleteOpen(false),
            });
          }
        }}
        title="Excluir Cliente"
        message={`Tem certeza que deseja excluir o cliente "${selectedClient?.name}"? Esta ação não pode ser desfeita.`}
        isLoading={deleteClient.isPending}
      />
    </div>
  );
}
