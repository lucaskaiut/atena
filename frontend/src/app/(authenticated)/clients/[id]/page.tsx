'use client';

import { useParams } from 'next/navigation';
import { useClient } from '@/hooks/useClients';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getStatusColor, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function ClientDetailPage() {
  const { id } = useParams();
  const { data: client, isLoading } = useClient(Number(id));

  if (isLoading) return <LoadingSpinner size="lg" className="py-12" />;
  if (!client) return <p className="text-gray-500">Cliente não encontrado</p>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/clients" className="text-sm text-primary hover:underline">
          ← Voltar para clientes
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <Badge className={getStatusColor(client.status)}>
            {client.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-900">Informações</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm">{client.email || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="text-sm">{client.phone || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Empresa</p>
              <p className="text-sm">{client.company_name || '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-900">Datas</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Criado em</p>
              <p className="text-sm">{formatDate(client.created_at, 'long')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Atualizado em</p>
              <p className="text-sm">{formatDate(client.updated_at, 'long')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {client.notes && (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-900">Observações</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{client.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
