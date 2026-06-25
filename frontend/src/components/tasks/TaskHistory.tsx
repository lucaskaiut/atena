'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { History } from 'lucide-react';

interface HistoryEntry {
  id: number;
  field: string;
  old_value?: string;
  new_value?: string;
  user?: { name: string };
  created_at: string;
}

interface TaskHistoryProps {
  taskId: number;
}

export function TaskHistory({ taskId }: TaskHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get<{ data: HistoryEntry[] }>(`/tasks/${taskId}/history`)
      .then(({ data }) => setHistory(data.data))
      .catch(() => setHistory([]))
      .finally(() => setIsLoading(false));
  }, [taskId]);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <History className="h-4 w-4" />
          Histórico de Alterações
        </h3>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhuma alteração registrada
          </p>
        ) : (
          <div className="space-y-1">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 text-sm py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-xs text-gray-500 w-20 flex-shrink-0">
                  {formatDate(entry.created_at, 'short')}
                </span>
                <span className="font-medium text-gray-700 w-16 flex-shrink-0">
                  {entry.field}
                </span>
                <span className="text-gray-400">→</span>
                <span className="text-gray-600 truncate">
                  {entry.old_value || '-'} → {entry.new_value || '-'}
                </span>
                {entry.user && (
                  <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                    {entry.user.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
