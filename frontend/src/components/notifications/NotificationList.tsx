'use client';

import { useNotifications, useMarkAsRead } from '@/hooks/useNotifications';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Bell, Check } from 'lucide-react';

export function NotificationList() {
  const { data, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const notifications = data?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Nenhuma notificação</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-lg border transition-colors',
            notification.read_at
              ? 'bg-white border-gray-200'
              : 'bg-blue-50 border-blue-200'
          )}
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {String(notification.data?.message || notification.message || 'Notificação')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(notification.created_at, 'relative')}
            </p>
          </div>
          {!notification.read_at && (
            <button
              onClick={() => markAsRead.mutate(notification.id)}
              className="p-1 rounded hover:bg-blue-100 text-blue-600"
              title="Marcar como lida"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
